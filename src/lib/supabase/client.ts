import { createBrowserClient } from '@supabase/ssr';

/**
 * Client Supabase côté navigateur. Le front parle directement à la base de
 * données via ce client — la sécurité est appliquée par les policies RLS
 * (migration 3), pas par une couche applicative intermédiaire.
 *
 * Non paramétré par le type `Database` (voir types.ts) : le typage exact
 * généré automatiquement par la CLI Supabase impose une forme générique
 * précise (Tables/Views/Functions/Enums avec Row/Insert/Update sur chaque
 * table) qu'un typage écrit à la main reproduit difficilement à l'identique
 * sans faire échouer la compilation. Dès que le projet Supabase existe,
 * régénérer les types réels :
 *
 *   npx supabase gen types typescript --project-id <id> > src/lib/supabase/types.ts
 *
 * puis reparamétrer ce client : createBrowserClient<Database>(...). En
 * attendant, `types.ts` reste la référence de forme des données (utilisable
 * pour du typage explicite au point d'usage, voir les hooks de ce dossier).
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
