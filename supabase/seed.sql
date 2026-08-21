-- ============================================================
-- LIFT LEDGER — Données de démonstration
-- ============================================================
-- Convention Supabase : ce fichier est appliqué automatiquement après les
-- migrations lors d'un `supabase db reset` (dev local). Données de la
-- compétition d'exemple (Championnats d'Europe 2026, catégorie -66kg
-- Hommes) — le roster complet sera intégré plus tard, comme convenu.
--
-- Note : les comptes de démo (régisseur/joueur) ne sont PAS créés ici —
-- côté Supabase, la création d'utilisateurs passe par auth.signUp(), pas
-- par un INSERT SQL direct dans auth.users (mot de passe à hasher par
-- GoTrue). Créez-les depuis l'appli ou le Dashboard Supabase > Authentication,
-- puis passez le premier en OPERATOR avec :
--   update public.profiles set role = 'OPERATOR' where pseudo = 'regisseur';
-- ============================================================

insert into public.competitions (id, name, slug, location, start_date, end_date)
values (
  '11111111-1111-1111-1111-111111111111',
  'Championnats d''Europe de Streetlifting 2026',
  'euros-2026',
  'Paris, France',
  '2026-10-02T09:00:00Z',
  '2026-10-04T19:00:00Z'
)
on conflict (slug) do nothing;

insert into public.categories (id, competition_id, label, gender, weight_kg, platform, scheduled_at, "order")
values (
  '22222222-2222-2222-2222-222222222222',
  '11111111-1111-1111-1111-111111111111',
  '-66 KG', 'H', 66, 'A', '2026-10-03T09:00:00Z', 1
)
on conflict (id) do nothing;

-- Roster (extrait de la liste officielle FinalRep Euros 26)
insert into public.athletes (id, first_name, last_name) values
  ('33333333-3333-3333-3333-333333333331', 'Cyril', 'Brau'),
  ('33333333-3333-3333-3333-333333333332', 'Hubert', 'Chwałek'),
  ('33333333-3333-3333-3333-333333333333', 'Lovro', 'Topic')
on conflict (id) do nothing;

-- Inscriptions dans la catégorie -66kg (même formule de calcul que le
-- prototype front : total = round(weightKg * 2.1), PR historique ~93% du total)
insert into public.athlete_entries (athlete_id, category_id, seed, mu_pr_all_time, pu_pr_all_time, dips_pr_all_time, sq_pr_all_time, previous_total)
select
  a.id,
  '22222222-2222-2222-2222-222222222222',
  row_number() over (order by a.last_name),
  round(139 * 0.075 * 0.93, 1),
  round(139 * 0.14 * 0.93, 1),
  round(139 * 0.245 * 0.93, 1),
  round(139 * 0.54 * 0.93, 1),
  round(139 * 0.93)
from public.athletes a
where a.id in (
  '33333333-3333-3333-3333-333333333331',
  '33333333-3333-3333-3333-333333333332',
  '33333333-3333-3333-3333-333333333333'
)
on conflict (athlete_id, category_id) do nothing;

-- Gabarits de cartes (un par athlète inscrit)
insert into public.card_templates (athlete_entry_id, tier, ris_score)
select ae.id, (case when a.first_name = 'Cyril' then 'ELITE' else 'SILVER' end)::public.card_tier, round(139 * 0.4045, 2)
from public.athlete_entries ae
join public.athletes a on a.id = ae.athlete_id
where ae.category_id = '22222222-2222-2222-2222-222222222222'
on conflict (athlete_entry_id) do nothing;

-- Packs boutique (mêmes paliers que le front déjà livré)
insert into public.pack_types (code, name, cost, card_count, odds) values
  ('starter', 'Starter', 90, 1, '{"BRONZE":0.6,"SILVER":0.4}'::jsonb),
  ('standard', 'Standard', 180, 2, '{"BRONZE":0.4,"SILVER":0.45,"ELITE":0.15}'::jsonb),
  ('elite', 'Élite', 350, 3, '{"SILVER":0.5,"ELITE":0.5}'::jsonb)
on conflict (code) do nothing;
