// ============================================================
// Éléments de navigation (Sidebar desktop + BottomNav mobile).
// Typés pour permettre à Sidebar/BottomNav de rester des composants
// purement présentationnels, sans aucune liste codée en dur à l'intérieur.
// ============================================================

export interface NavItem {
  href: string;
  label: string;
  /** Nom d'icône résolu par le composant NavIcon (voir Sidebar.tsx / BottomNav.tsx) */
  icon: NavIconName;
  /** Pastille "en direct" (ex: Live Game) */
  badge?: 'live';
}

export type NavIconName =
  | 'home'
  | 'calendar'
  | 'radio'
  | 'help'
  | 'cards'
  | 'chart'
  | 'trophy'
  | 'info';
