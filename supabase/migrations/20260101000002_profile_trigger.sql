-- ============================================================
-- LIFT LEDGER — Migration 2 : création automatique du profil
-- ============================================================
-- L'inscription (supabase.auth.signUp()) crée directement une ligne dans
-- auth.users. Ce trigger crée automatiquement la ligne "profiles"
-- correspondante juste après, avec le pseudo fourni dans les métadonnées
-- d'inscription.
--
-- Côté front (exemple) :
--   await supabase.auth.signUp({
--     email, password,
--     options: { data: { pseudo: 'JoueurDemo' } } // -> lu ici via NEW.raw_user_meta_data
--   });
-- ============================================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, pseudo)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'pseudo', 'joueur_' || substr(new.id::text, 1, 8))
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Maintient updated_at à jour sur profiles à chaque modification.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute procedure public.set_updated_at();
