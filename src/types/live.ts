// ============================================================
// Live Game : essai en cours (PredictPanel) + classement en direct
// (LiveRankList). Déduits de la mécanique "Good Lift / No Lift" et
// du panneau de pronostic du prototype.
// ============================================================

import type { Movement } from './athlete';

export type AttemptGuess = 'GOOD_LIFT' | 'NO_LIFT';

/** Essai en cours affiché dans le PredictPanel. */
export interface LiveAttempt {
  athleteId: string;
  athleteName: string;
  weightLabel: string;
  movement: Movement;
  attemptNumber: 1 | 2 | 3;
  /** Poids tenté sur cet essai, affiché dans la jauge Faible/Attendu/Élevé. */
  attemptWeight: number;
}

/** Ligne du classement en direct (LiveRankList). */
export interface LeaderboardRow {
  athleteEntryId: string;
  name: string;
  weightLabel: string;
  currentTotal: number;
}
