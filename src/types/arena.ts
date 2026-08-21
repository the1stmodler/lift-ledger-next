// ============================================================
// Sélecteur d'arène (sport) — Streetlifting / Powerlifting / Weightlifting.
// ============================================================

export type ArenaKey = 'streetlifting' | 'powerlifting' | 'weightlifting';

export interface ArenaInfo {
  key: ArenaKey;
  name: string;
  unlocked: boolean;
}
