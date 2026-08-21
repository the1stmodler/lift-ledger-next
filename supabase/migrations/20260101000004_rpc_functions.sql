-- ============================================================
-- LIFT LEDGER — Migration 4 : logique métier (fonctions RPC)
-- ============================================================
-- Chaque fonction est SECURITY DEFINER (s'exécute avec les droits du
-- propriétaire, contourne le RLS ligne par ligne) MAIS vérifie elle-même
-- le rôle de l'appelant en première instruction quand l'action est
-- sensible (régisseur/admin uniquement). Toute la logique tourne DANS
-- Postgres, donc chaque fonction est intrinsèquement transactionnelle
-- (tout ou rien).
--
-- Appel depuis le front (exemple) :
--   const { data, error } = await supabase.rpc('validate_attempt', {
--     p_attempt_id: attemptId, p_status: 'GOOD_LIFT'
--   });
-- ============================================================

-- ============================================================
-- credit_wallet / debit_wallet — grand livre + mise à jour du cache de solde
-- ============================================================

create or replace function public.credit_wallet(p_user_id uuid, p_amount integer, p_type public.transaction_type, p_reference text default null)
returns void
language plpgsql
security definer set search_path = public
as $$
begin
  if p_amount <= 0 then
    raise exception 'Le montant crédité doit être positif.';
  end if;
  insert into wallet_transactions (user_id, amount, type, reference) values (p_user_id, p_amount, p_type, p_reference);
  update profiles set jetons_balance = jetons_balance + p_amount where id = p_user_id;
end;
$$;

create or replace function public.debit_wallet(p_user_id uuid, p_amount integer, p_type public.transaction_type, p_reference text default null)
returns void
language plpgsql
security definer set search_path = public
as $$
declare
  v_rows integer;
begin
  if p_amount <= 0 then
    raise exception 'Le montant débité doit être positif.';
  end if;
  -- UPDATE conditionnel atomique : empêche toute course entre deux achats
  -- simultanés de faire passer le solde en négatif.
  update profiles set jetons_balance = jetons_balance - p_amount
    where id = p_user_id and jetons_balance >= p_amount;
  get diagnostics v_rows = row_count;
  if v_rows = 0 then
    raise exception 'Solde de jetons insuffisant.';
  end if;
  insert into wallet_transactions (user_id, amount, type, reference) values (p_user_id, -p_amount, p_type, p_reference);
end;
$$;

-- ============================================================
-- validate_attempt — ACTION CŒUR DE L'ÉCRAN ADMIN LIVE
-- ============================================================
-- Valide un essai, met à jour le Total de l'athlète si Good Lift, résout
-- tous les pronostics des joueurs sur cet essai et les crédite s'ils ont
-- vu juste. La diffusion temps réel du résultat n'a besoin d'aucun code
-- séparé : Supabase Realtime détecte le changement sur athlete_entries/
-- attempts et le pousse automatiquement à tous les clients abonnés (voir
-- migration 5 et README, section Realtime).
create or replace function public.validate_attempt(p_attempt_id uuid, p_status public.attempt_status)
returns public.attempts
language plpgsql
security definer set search_path = public
as $$
declare
  v_attempt public.attempts;
  v_prediction record;
  v_is_correct boolean;
  v_reward integer;
begin
  if not public.is_operator_or_admin() then
    raise exception 'Action réservée au régisseur ou à l''administrateur.';
  end if;
  if p_status not in ('GOOD_LIFT', 'NO_LIFT') then
    raise exception 'Statut invalide : % (attendu GOOD_LIFT ou NO_LIFT).', p_status;
  end if;

  select * into v_attempt from attempts where id = p_attempt_id for update;
  if not found then
    raise exception 'Essai introuvable : %', p_attempt_id;
  end if;
  if v_attempt.status <> 'PENDING' then
    raise exception 'Cet essai a déjà été validé.';
  end if;

  update attempts
    set status = p_status, validated_by = auth.uid(), validated_at = now()
    where id = p_attempt_id
    returning * into v_attempt;

  if p_status = 'GOOD_LIFT' then
    update athlete_entries
      set current_total = current_total + v_attempt.requested_weight
      where id = v_attempt.athlete_entry_id;
  end if;

  -- Résolution des pronostics des joueurs sur cet essai.
  for v_prediction in select * from live_game_predictions where attempt_id = p_attempt_id loop
    v_is_correct := (v_prediction.guess = p_status);
    v_reward := case when v_is_correct then 5 else 0 end;
    update live_game_predictions
      set is_correct = v_is_correct, jetons_awarded = v_reward
      where id = v_prediction.id;
    if v_is_correct then
      perform public.credit_wallet(v_prediction.user_id, v_reward, 'LIVE_GAME_REWARD', v_prediction.id::text);
    end if;
  end loop;

  return v_attempt;
end;
$$;

-- ============================================================
-- submit_prediction — pronostic d'un joueur sur un essai PENDING
-- ============================================================
create or replace function public.submit_prediction(p_attempt_id uuid, p_guess public.attempt_status)
returns public.live_game_predictions
language plpgsql
security definer set search_path = public
as $$
declare
  v_status public.attempt_status;
  v_row public.live_game_predictions;
begin
  if p_guess not in ('GOOD_LIFT', 'NO_LIFT') then
    raise exception 'Pronostic invalide.';
  end if;
  select status into v_status from attempts where id = p_attempt_id;
  if v_status is null then
    raise exception 'Essai introuvable.';
  end if;
  if v_status <> 'PENDING' then
    raise exception 'Cet essai n''accepte plus de pronostic.';
  end if;

  insert into live_game_predictions (user_id, attempt_id, guess)
    values (auth.uid(), p_attempt_id, p_guess)
    on conflict (user_id, attempt_id) do update set guess = excluded.guess
    returning * into v_row;

  return v_row;
end;
$$;

-- ============================================================
-- open_pack — ouverture de pack (tirage pondéré + attribution des cartes)
-- ============================================================
-- Débite le coût en jetons puis tire card_count cartes selon les
-- probabilités par palier du pack.
create or replace function public.open_pack(p_pack_type_id uuid)
returns table (user_card_id uuid, card_template_id uuid, tier public.card_tier)
language plpgsql
security definer set search_path = public
as $$
declare
  v_pack pack_types;
  v_opening_id uuid;
  v_tier public.card_tier;
  v_template_id uuid;
  v_roll numeric;
  v_cumulative numeric;
  v_key text;
  i integer;
begin
  select * into v_pack from pack_types where id = p_pack_type_id;
  if not found then
    raise exception 'Pack introuvable.';
  end if;

  perform public.debit_wallet(auth.uid(), v_pack.cost, 'PACK_PURCHASE', p_pack_type_id::text);

  insert into pack_openings (user_id, pack_type_id) values (auth.uid(), p_pack_type_id) returning id into v_opening_id;

  for i in 1..v_pack.card_count loop
    -- Tirage pondéré du palier à partir de pack_types.odds (ex: {"BRONZE":0.6,"SILVER":0.4})
    v_roll := random();
    v_cumulative := 0;
    v_tier := null;
    for v_key in select jsonb_object_keys(v_pack.odds) loop
      v_cumulative := v_cumulative + (v_pack.odds->>v_key)::numeric;
      if v_roll <= v_cumulative and v_tier is null then
        v_tier := v_key::public.card_tier;
      end if;
    end loop;
    if v_tier is null then
      v_tier := 'SILVER'; -- filet de sécurité si les probabilités ne totalisent pas 1
    end if;

    select id into v_template_id from card_templates where card_templates.tier = v_tier order by random() limit 1;
    if v_template_id is null then
      raise exception 'Aucune carte disponible pour le palier %.', v_tier;
    end if;

    insert into user_cards (user_id, card_template_id, pack_opening_id)
      values (auth.uid(), v_template_id, v_opening_id)
      returning id into user_card_id;

    card_template_id := v_template_id;
    tier := v_tier;
    return next;
  end loop;
end;
$$;

-- ============================================================
-- start_category — le régisseur démarre une catégorie (verrouille les
-- nouvelles inscriptions côté front, voir CategoryWaitingRoom)
-- ============================================================
create or replace function public.start_category(p_category_id uuid)
returns public.categories
language plpgsql
security definer set search_path = public
as $$
declare
  v_row public.categories;
begin
  if not public.is_operator_or_admin() then
    raise exception 'Action réservée au régisseur ou à l''administrateur.';
  end if;
  update categories set status = 'LIVE' where id = p_category_id returning * into v_row;
  if not found then
    raise exception 'Catégorie introuvable.';
  end if;
  return v_row;
end;
$$;
