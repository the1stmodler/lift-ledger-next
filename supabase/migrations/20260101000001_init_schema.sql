-- ============================================================
-- LIFT LEDGER — Migration 1 : schéma de base
-- ============================================================
-- Modèle de données de l'application Lift Ledger : utilisateurs, athlètes,
-- compétitions/catégories, essais en direct, cartes et économie de jetons
-- virtuels. Choix de conception :
--   - Pas de table "users" propre : on étend auth.users (fourni nativement
--     par Supabase Auth) via une table "profiles" en relation 1-1.
--   - uuid partout (gen_random_uuid(), extension pgcrypto activée par
--     défaut sur tout projet Supabase).
--   - Le solde de jetons (profiles.jetons_balance) reste un cache — la
--     source de vérité est wallet_transactions (voir migration 4, fonctions
--     credit_wallet / debit_wallet).
-- ============================================================

-- ---- Enums ----

create type public.app_role as enum ('PLAYER', 'OPERATOR', 'ADMIN');
create type public.gender as enum ('H', 'F');
create type public.competition_status as enum ('UPCOMING', 'LIVE', 'FINISHED');
create type public.category_status as enum ('PENDING', 'LIVE', 'DONE');
create type public.movement as enum ('MU', 'PU', 'DIPS', 'SQ');
create type public.attempt_status as enum ('PENDING', 'GOOD_LIFT', 'NO_LIFT');
create type public.card_tier as enum ('BRONZE', 'SILVER', 'ELITE');
create type public.transaction_type as enum ('PACK_PURCHASE', 'LIVE_GAME_REWARD', 'QUIZ_REWARD', 'BONUS', 'ADMIN_ADJUSTMENT');

-- ============================================================
-- 1. PROFILS (étend auth.users)
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  pseudo text unique not null,
  role public.app_role not null default 'PLAYER',
  jetons_balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.profiles is 'Étend auth.users avec les données propres à Lift Ledger (rôle, pseudo, solde de jetons).';

-- ============================================================
-- 2. COMPÉTITION / CATÉGORIES / ATHLÈTES / ESSAIS EN DIRECT
-- ============================================================

create table public.competitions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  location text,
  start_date timestamptz not null,
  end_date timestamptz not null,
  status public.competition_status not null default 'UPCOMING'
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  competition_id uuid not null references public.competitions(id) on delete cascade,
  label text not null,
  gender public.gender not null,
  weight_kg integer not null,
  platform text not null default 'A',
  scheduled_at timestamptz not null,
  status public.category_status not null default 'PENDING',
  "order" integer not null default 0
);

create table public.athletes (
  id uuid primary key default gen_random_uuid(),
  first_name text not null,
  last_name text not null,
  nickname text,
  country_code text,
  photo_url text,
  created_at timestamptz not null default now()
);

-- Inscription d'un athlète dans une catégorie pour une compétition donnée.
create table public.athlete_entries (
  id uuid primary key default gen_random_uuid(),
  athlete_id uuid not null references public.athletes(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  seed integer not null default 0,
  mu_pr_all_time numeric not null default 0,
  pu_pr_all_time numeric not null default 0,
  dips_pr_all_time numeric not null default 0,
  sq_pr_all_time numeric not null default 0,
  previous_total numeric not null default 0,
  current_total numeric not null default 0,
  unique (athlete_id, category_id)
);

create table public.attempts (
  id uuid primary key default gen_random_uuid(),
  athlete_entry_id uuid not null references public.athlete_entries(id) on delete cascade,
  movement public.movement not null,
  attempt_number smallint not null check (attempt_number between 1 and 3),
  requested_weight numeric not null,
  status public.attempt_status not null default 'PENDING',
  validated_by uuid references public.profiles(id),
  validated_at timestamptz,
  created_at timestamptz not null default now()
);

create index attempts_entry_idx on public.attempts (athlete_entry_id, movement, attempt_number);

-- Pronostic d'un joueur sur l'issue d'un essai (mécanique "The Live Game").
create table public.live_game_predictions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  attempt_id uuid not null references public.attempts(id) on delete cascade,
  guess public.attempt_status not null check (guess in ('GOOD_LIFT', 'NO_LIFT')),
  is_correct boolean,
  jetons_awarded integer not null default 0,
  created_at timestamptz not null default now(),
  unique (user_id, attempt_id)
);

-- ============================================================
-- 3. CARTES & ÉCONOMIE DE JETONS VIRTUELS
-- ============================================================

create table public.card_templates (
  id uuid primary key default gen_random_uuid(),
  athlete_entry_id uuid not null unique references public.athlete_entries(id) on delete cascade,
  tier public.card_tier not null default 'SILVER',
  ris_score numeric not null default 0
);

create table public.pack_types (
  id uuid primary key default gen_random_uuid(),
  code text unique not null,
  name text not null,
  cost integer not null,
  card_count integer not null,
  odds jsonb not null -- ex: {"BRONZE": 0.6, "SILVER": 0.4}
);

create table public.pack_openings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  pack_type_id uuid not null references public.pack_types(id),
  opened_at timestamptz not null default now()
);

create table public.user_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  card_template_id uuid not null references public.card_templates(id) on delete cascade,
  pack_opening_id uuid references public.pack_openings(id),
  acquired_at timestamptz not null default now()
);

-- Grand livre des mouvements de jetons — source de vérité du solde.
create table public.wallet_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  type public.transaction_type not null,
  reference text,
  created_at timestamptz not null default now()
);
