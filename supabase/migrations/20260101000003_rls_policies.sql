-- ============================================================
-- LIFT LEDGER — Migration 3 : sécurité (Row Level Security)
-- ============================================================
-- La sécurité vit DANS la base de données, appliquée à chaque requête quel
-- que soit le client qui la fait (front web, mobile, script). Le rôle du
-- joueur connecté est lu depuis sa ligne "profiles" via auth.uid()
-- (l'identifiant Supabase Auth de la requête courante).
-- ============================================================

-- Fonction utilitaire : le joueur connecté est-il régisseur ou admin ?
-- SECURITY DEFINER + search_path fixe = évite les failles de résolution
-- de schéma, pattern recommandé par la doc Supabase pour ce type d'helper.
create or replace function public.is_operator_or_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('OPERATOR', 'ADMIN')
  );
$$;

-- ---- profiles ----
alter table public.profiles enable row level security;

create policy "Profils visibles par tous les joueurs connectés"
  on public.profiles for select
  to authenticated
  using (true);

create policy "Un joueur ne modifie que son propre profil"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id)
  with check (auth.uid() = id AND role = (select role from public.profiles where id = auth.uid()));
  -- ^ empêche un joueur de s'auto-promouvoir OPERATOR/ADMIN en modifiant son propre profil.

-- ---- competitions / categories / athletes / athlete_entries ----
-- Lecture publique (même les visiteurs non connectés voient le programme),
-- écriture réservée au régisseur/admin.
alter table public.competitions enable row level security;
alter table public.categories enable row level security;
alter table public.athletes enable row level security;
alter table public.athlete_entries enable row level security;

create policy "Lecture publique" on public.competitions for select to anon, authenticated using (true);
create policy "Écriture régisseur/admin" on public.competitions for all to authenticated
  using (public.is_operator_or_admin()) with check (public.is_operator_or_admin());

create policy "Lecture publique" on public.categories for select to anon, authenticated using (true);
create policy "Écriture régisseur/admin" on public.categories for all to authenticated
  using (public.is_operator_or_admin()) with check (public.is_operator_or_admin());

create policy "Lecture publique" on public.athletes for select to anon, authenticated using (true);
create policy "Écriture régisseur/admin" on public.athletes for all to authenticated
  using (public.is_operator_or_admin()) with check (public.is_operator_or_admin());

create policy "Lecture publique" on public.athlete_entries for select to anon, authenticated using (true);
create policy "Écriture régisseur/admin" on public.athlete_entries for all to authenticated
  using (public.is_operator_or_admin()) with check (public.is_operator_or_admin());

-- ---- attempts ----
-- Lecture publique (classement en direct). L'écriture directe est réservée
-- au régisseur/admin — mais la validation d'un essai passe en pratique par
-- la fonction validate_attempt() (migration 4), pas par un UPDATE direct,
-- pour garder la logique métier atomique et centralisée.
alter table public.attempts enable row level security;

create policy "Lecture publique" on public.attempts for select to anon, authenticated using (true);
create policy "Écriture régisseur/admin" on public.attempts for all to authenticated
  using (public.is_operator_or_admin()) with check (public.is_operator_or_admin());

-- ---- live_game_predictions ----
-- Un joueur ne voit et ne modifie que ses propres pronostics, et seulement
-- tant que l'essai concerné est encore PENDING (vérifié en sous-requête).
alter table public.live_game_predictions enable row level security;

create policy "Un joueur gère ses propres pronostics"
  on public.live_game_predictions for select
  to authenticated
  using (auth.uid() = user_id);

create policy "Un joueur crée un pronostic sur un essai encore ouvert"
  on public.live_game_predictions for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.attempts where id = attempt_id and status = 'PENDING')
  );

create policy "Un joueur modifie son pronostic tant que l'essai est ouvert"
  on public.live_game_predictions for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (select 1 from public.attempts where id = attempt_id and status = 'PENDING')
  );

-- ---- card_templates / pack_types ----
-- Catalogue public (boutique, cartes existantes).
alter table public.card_templates enable row level security;
alter table public.pack_types enable row level security;

create policy "Lecture publique" on public.card_templates for select to anon, authenticated using (true);
create policy "Écriture régisseur/admin" on public.card_templates for all to authenticated
  using (public.is_operator_or_admin()) with check (public.is_operator_or_admin());

create policy "Lecture publique" on public.pack_types for select to anon, authenticated using (true);
create policy "Écriture admin" on public.pack_types for all to authenticated
  using (public.is_operator_or_admin()) with check (public.is_operator_or_admin());

-- ---- user_cards / pack_openings / wallet_transactions ----
-- Strictement privé : un joueur ne voit que sa propre collection, ses
-- propres ouvertures de pack et son propre historique de jetons. Aucune
-- policy INSERT/UPDATE directe : ces tables ne sont écrites QUE par les
-- fonctions RPC SECURITY DEFINER (open_pack, credit_wallet, debit_wallet —
-- voir migration 4), jamais par un INSERT client brut.
alter table public.user_cards enable row level security;
alter table public.pack_openings enable row level security;
alter table public.wallet_transactions enable row level security;

create policy "Un joueur voit ses propres cartes" on public.user_cards for select to authenticated using (auth.uid() = user_id);
create policy "Un joueur voit ses propres ouvertures" on public.pack_openings for select to authenticated using (auth.uid() = user_id);
create policy "Un joueur voit son propre historique" on public.wallet_transactions for select to authenticated using (auth.uid() = user_id);
