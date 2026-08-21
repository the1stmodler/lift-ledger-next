/**
 * Types minimaux à la main, pour que le reste du code compile dès
 * maintenant. À REMPLACER dès que le projet Supabase existe réellement par
 * la génération automatique (reflète alors le schéma exact, à jour) :
 *
 *   npx supabase gen types typescript --project-id <id> --schema public \
 *     > src/lib/supabase/types.ts
 *
 * Idéalement scripté en `postinstall` ou en tâche CI pour ne jamais dériver
 * du schéma réel.
 */

export type AppRole = 'PLAYER' | 'OPERATOR' | 'ADMIN';
export type Gender = 'H' | 'F';
export type CategoryStatus = 'PENDING' | 'LIVE' | 'DONE';
export type Movement = 'MU' | 'PU' | 'DIPS' | 'SQ';
export type AttemptStatus = 'PENDING' | 'GOOD_LIFT' | 'NO_LIFT';
export type CardTier = 'BRONZE' | 'SILVER' | 'ELITE';

export interface ProfileRow {
  id: string;
  pseudo: string;
  role: AppRole;
  jetons_balance: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryRow {
  id: string;
  competition_id: string;
  label: string;
  gender: Gender;
  weight_kg: number;
  platform: string;
  scheduled_at: string;
  status: CategoryStatus;
  order: number;
}

export interface AthleteEntryRow {
  id: string;
  athlete_id: string;
  category_id: string;
  seed: number;
  mu_pr_all_time: number;
  pu_pr_all_time: number;
  dips_pr_all_time: number;
  sq_pr_all_time: number;
  previous_total: number;
  current_total: number;
}

export interface AttemptRow {
  id: string;
  athlete_entry_id: string;
  movement: Movement;
  attempt_number: number;
  requested_weight: number;
  status: AttemptStatus;
  validated_by: string | null;
  validated_at: string | null;
  created_at: string;
}

// La forme Row/Insert/Update/Relationships sur chaque table est celle
// attendue par le générique Database de @supabase/supabase-js — c'est
// exactement la structure produite par `supabase gen types typescript`.
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: ProfileRow;
        Insert: Partial<ProfileRow> & Pick<ProfileRow, 'id' | 'pseudo'>;
        Update: Partial<ProfileRow>;
        Relationships: [];
      };
      categories: {
        Row: CategoryRow;
        Insert: Partial<CategoryRow> & Pick<CategoryRow, 'competition_id' | 'label' | 'gender' | 'weight_kg' | 'scheduled_at'>;
        Update: Partial<CategoryRow>;
        Relationships: [];
      };
      athlete_entries: {
        Row: AthleteEntryRow;
        Insert: Partial<AthleteEntryRow> & Pick<AthleteEntryRow, 'athlete_id' | 'category_id'>;
        Update: Partial<AthleteEntryRow>;
        Relationships: [];
      };
      attempts: {
        Row: AttemptRow;
        Insert: Partial<AttemptRow> & Pick<AttemptRow, 'athlete_entry_id' | 'movement' | 'attempt_number' | 'requested_weight'>;
        Update: Partial<AttemptRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      validate_attempt: {
        Args: { p_attempt_id: string; p_status: 'GOOD_LIFT' | 'NO_LIFT' };
        Returns: AttemptRow;
      };
      submit_prediction: {
        Args: { p_attempt_id: string; p_guess: 'GOOD_LIFT' | 'NO_LIFT' };
        Returns: { id: string; is_correct: boolean | null };
      };
      open_pack: {
        Args: { p_pack_type_id: string };
        Returns: { user_card_id: string; card_template_id: string; tier: CardTier }[];
      };
      start_category: {
        Args: { p_category_id: string };
        Returns: CategoryRow;
      };
    };
    Enums: {
      app_role: AppRole;
      gender: Gender;
      category_status: CategoryStatus;
      movement: Movement;
      attempt_status: AttemptStatus;
      card_tier: CardTier;
    };
    CompositeTypes: Record<string, never>;
  };
}
