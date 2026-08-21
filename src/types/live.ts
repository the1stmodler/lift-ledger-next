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

/** Onglet de compétition affiché en haut de la page Live Game (façon Esports World Cup). */
export interface CompetitionTab {
  id: string;
  name: string;
  status: 'live' | 'locked';
  statusLabel: string;
}

/** Étape de la timeline des catégories (une par poids/genre). */
export interface TimelineCategory {
  id: string;
  weightLabel: string;
  genderLabel: string;
  dayLabel: string;
  timeLabel: string;
  isLive: boolean;
}

// ============================================================
// Mini-jeux spéciaux du Live Game : "The Final Attempt" (stratégie du
// 3e essai) et "Perfect Score" (sans-faute). Le déroulé complet est
// piloté par une file d'événements côté page (voir app/live/page.tsx).
// ============================================================

export type LiveEventType = 'lift' | 'final' | 'boss';

export type FinalAttemptChoice = 'safe' | 'standard' | 'allin';

export interface LiveEvent {
  type: LiveEventType;
  /** Pour 'lift' : essai standard, utilise directement LiveAttempt. */
  attempt?: LiveAttempt;
  /** Pour 'final' : contexte de l'essai 2 qui vient d'être validé. */
  finalContext?: { athleteName: string; weightLabel: string; prevWeight: number; prevSuccess: boolean };
  /** Pour 'boss' : athlète en sans-faute avant le Squat. */
  bossContext?: { athleteName: string; weightLabel: string };
}

/** Ligne du podium flash affiché à la fin d'une catégorie. */
export interface FlashPodiumEntry {
  rank: number;
  name: string;
  points: number;
  isMe?: boolean;
}
