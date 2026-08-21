// ============================================================
// Tutoriel d'onboarding multi-étapes (façon Esports World Cup), affiché
// automatiquement à la première visite de chacune des 3 pages de jeu.
// ============================================================

import type { NavIconName } from './navigation';

export interface OnboardingStep {
  title: string;
  description: string;
}

export interface OnboardingTour {
  /** Sert aussi de clé de mémorisation localStorage ("onboard_seen_<id>"). */
  id: 'pregame' | 'live' | 'quiz';
  icon: NavIconName;
  steps: OnboardingStep[];
}
