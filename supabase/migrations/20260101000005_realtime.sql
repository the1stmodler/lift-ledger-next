-- ============================================================
-- LIFT LEDGER — Migration 5 : temps réel (Supabase Realtime)
-- ============================================================
-- Il suffit d'ajouter les tables à la publication "supabase_realtime" :
-- chaque INSERT/UPDATE est alors automatiquement diffusé aux clients
-- abonnés, sans écrire de code serveur dédié à la diffusion.
--
-- Abonnement côté front (exemple) :
--   supabase
--     .channel(`athlete_entries:category_id=eq.${categoryId}`)
--     .on('postgres_changes',
--         { event: 'UPDATE', schema: 'public', table: 'athlete_entries', filter: `category_id=eq.${categoryId}` },
--         (payload) => updateLeaderboardRow(payload.new))
--     .subscribe();
--
--   supabase
--     .channel(`attempts:category=${categoryId}`)
--     .on('postgres_changes',
--         { event: 'UPDATE', schema: 'public', table: 'attempts' },
--         (payload) => { if (payload.new.status !== 'PENDING') handleAttemptValidated(payload.new); })
--     .subscribe();
-- ============================================================

alter publication supabase_realtime add table public.athlete_entries;
alter publication supabase_realtime add table public.attempts;
alter publication supabase_realtime add table public.categories;

-- REPLICA IDENTITY FULL : nécessaire pour que les événements UPDATE/DELETE
-- diffusés par Realtime incluent l'état complet de la ligne (payload.old),
-- pas seulement la clé primaire — utile pour comparer l'ancien/nouveau
-- Total dans l'animation du classement front (technique FLIP déjà en place
-- côté composant LiveRankList).
alter table public.athlete_entries replica identity full;
alter table public.attempts replica identity full;
