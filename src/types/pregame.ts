// ============================================================
// Pré-Game : sélection de 3 cartes par division avant la compétition.
// ============================================================

import type { AthleteCardData } from './athlete';

export interface Division {
  id: string;
  /** ex: "Hommes · Lightweight" */
  label: string;
  /** ex: "-66KG / -73KG" */
  weightRange: string;
  /** Date ISO de clôture des inscriptions pour cette division */
  closeAt: string;
  /** Athlètes disponibles à la sélection pour cette division */
  pool: AthleteCardData[];
}
