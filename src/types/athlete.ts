// ============================================================
// Types liés aux athlètes et à leurs cartes de collection.
// Déduits de la structure `.a-card` du prototype HTML d'origine
// (badge RIS, poids, initiales, stats MU/PU/DIP/SQT, Total).
// ============================================================

export type CardTier = 'bronze' | 'silver' | 'elite';

export type Movement = 'MU' | 'PU' | 'DIPS' | 'SQ';

export type Gender = 'H' | 'F';

/** Répartition des points par mouvement, affichée dans la grille de stats de la carte. */
export type AthleteStats = Record<Movement, number>;

export interface AthleteCardData {
  id: string;
  /** Nom affiché, format "F. Nom" (ex: "C. Brau") — convention reprise du prototype. */
  name: string;
  nickname?: string;
  gender: Gender;
  /** Étiquette de poids affichée sur la carte, ex: "-66KG" */
  weightLabel: string;
  tier: CardTier;
  risScore: number;
  stats: AthleteStats;
  total: number;
}
