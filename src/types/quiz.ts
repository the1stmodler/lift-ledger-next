// ============================================================
// Quiz Game : plusieurs formats de pronostics (The Streetliftings Quiz,
// The Strongest, The GRID, Roster Roulette...).
// ============================================================

export interface QuizFormat {
  id: string;
  name: string;
  subtitle: string;
  badge: string;
  description: string;
  /** Date ISO de clôture des réponses */
  closeAt: string;
  rewardLabel: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  options: string[];
}
