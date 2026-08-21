'use client';

import { createClient } from '@/lib/supabase/client';

/**
 * Action cœur de l'écran Admin Live : le régisseur valide un essai
 * (Good Lift / No Lift). La protection ne vient pas d'un guard côté
 * Next.js : elle est appliquée DANS la fonction Postgres elle-même
 * (`if not is_operator_or_admin() then raise exception`, voir migration
 * 4). Un joueur normal qui appellerait ce hook recevrait simplement une
 * erreur — même sans aucune vérification de rôle côté front, la donnée
 * reste protégée à la source.
 *
 * Cela dit, il reste recommandé de masquer l'écran Admin Live aux non-
 * régisseurs côté UI (via `profile.role`, voir useAuth) pour l'expérience,
 * même si la sécurité réelle est déjà garantie en base.
 */
export function useValidateAttempt() {
  const supabase = createClient();

  async function validate(attemptId: string, status: 'GOOD_LIFT' | 'NO_LIFT') {
    const { data, error } = await supabase.rpc('validate_attempt', {
      p_attempt_id: attemptId,
      p_status: status,
    });
    if (error) throw error;
    return data;
  }

  return { validate };
}
