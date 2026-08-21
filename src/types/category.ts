// ============================================================
// Catégories de poids / compétition (timeline du Live Game et du Pré-Game).
// ============================================================

import type { Gender } from './athlete';

export type CategoryStatus = 'PENDING' | 'LIVE' | 'DONE';

export interface Category {
  id: string;
  /** ex: "-66 KG" */
  label: string;
  gender: Gender;
  weightKg: number;
  platform: string;
  /** Date ISO du coup d'envoi de la catégorie */
  scheduledAt: string;
  status: CategoryStatus;
}
