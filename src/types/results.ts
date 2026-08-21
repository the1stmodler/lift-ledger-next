// ============================================================
// Mes Résultats : classement général + palmarès de récompenses.
// ============================================================

export interface ResultEntry {
  rank: number;
  name: string;
  level: number;
  points: number;
  /** évolution depuis le dernier classement : positif, négatif ou 0 */
  trend: number;
  isCurrentUser?: boolean;
}

export interface Reward {
  id: string;
  title: string;
  subtitle: string;
}
