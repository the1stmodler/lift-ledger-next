'use client';

import { createClient } from '@/lib/supabase/client';

/**
 * Soumet le pronostic Good Lift / No Lift d'un joueur sur un essai en
 * cours. Le résultat définitif (correct/raté) n'est pas retourné
 * directement ici (le pronostic peut être soumis avant que l'issue réelle
 * soit connue) : il arrive ensuite via l'abonnement temps réel sur
 * `attempts` une fois le régisseur passé par validate_attempt().
 */
export function usePredictAttempt() {
  const supabase = createClient();

  async function predict(attemptId: string, guess: 'GOOD_LIFT' | 'NO_LIFT') {
    const { data, error } = await supabase.rpc('submit_prediction', {
      p_attempt_id: attemptId,
      p_guess: guess,
    });
    if (error) throw error;
    return data;
  }

  return { predict };
}
