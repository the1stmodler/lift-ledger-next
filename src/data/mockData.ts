// ============================================================
// DONNÉES DE DÉMONSTRATION CENTRALISÉES
// ============================================================
// Toutes les données textuelles/visuelles de l'app vivent ici, typées
// contre src/types/. Les composants ne contiennent plus aucune donnée en
// dur : ils reçoivent tout via des props (voir app/page.tsx, app/cards/
// page.tsx, app/live/page.tsx, app/layout.tsx qui importent ce fichier et
// distribuent les données aux composants concernés).
//
// En production, chaque export ci-dessous est destiné à être remplacé par
// un appel à l'API réelle (voir le backend NestJS livré précédemment) :
//   - featuredAthletes / myCollection  -> GET /api/categories/:id/roster ou /api/cards/me
//   - packOffers                        -> GET /api/cards/pack-types
//   - initialLeaderboard                -> GET /api/live/categories/:id/leaderboard
//   - heroContent                       -> GET /api/competitions/:id
// ============================================================

import type {
  AthleteCardData,
  PackOffer,
  LeaderboardRow,
  ArenaInfo,
  NavItem,
  HeroContent,
  SponsorItem,
} from '@/types';

// ---- Athlètes / cartes ----

export const featuredAthletes: AthleteCardData[] = [
  {
    id: 'm-66-1',
    name: 'C. Brau',
    gender: 'H',
    weightLabel: '-66KG',
    tier: 'elite',
    risScore: 56.23,
    stats: { MU: 10.4, PU: 19.5, DIPS: 34.1, SQ: 75.1 },
    total: 139,
  },
  {
    id: 'm-94-2',
    name: 'R. Pittia',
    nickname: 'Gohan',
    gender: 'H',
    weightLabel: '-94KG',
    tier: 'silver',
    risScore: 79.69,
    stats: { MU: 14.8, PU: 27.6, DIPS: 48.3, SQ: 106.4 },
    total: 197,
  },
  {
    id: 'w-52-1',
    name: 'J. Lis',
    gender: 'F',
    weightLabel: '-52KG',
    tier: 'silver',
    risScore: 32.76,
    stats: { MU: 6.1, PU: 11.3, DIPS: 19.8, SQ: 43.7 },
    total: 81,
  },
  {
    id: 'w-plus70-1',
    name: 'S. Guichard',
    gender: 'F',
    weightLabel: '+70KG',
    tier: 'elite',
    risScore: 48.94,
    stats: { MU: 9.1, PU: 16.9, DIPS: 29.6, SQ: 65.3 },
    total: 121,
  },
];

export const myCollection: AthleteCardData[] = [
  featuredAthletes[0], // C. Brau
  featuredAthletes[2], // J. Lis
  {
    id: 'm-101-1',
    name: 'D. Milićević',
    gender: 'H',
    weightLabel: '-101KG',
    tier: 'bronze',
    risScore: 85.75,
    stats: { MU: 15.9, PU: 29.7, DIPS: 51.9, SQ: 114.5 },
    total: 212,
  },
];

// ---- Boutique de packs ----

export const packOffers: PackOffer[] = [
  {
    id: 'elite',
    name: 'Élite',
    cost: 350,
    cardCount: 3,
    featured: true,
    guarantee: '1 Élite garantie',
    odds: [
      { tier: 'silver', label: 'Argent', percent: 50 },
      { tier: 'elite', label: 'Élite', percent: 50 },
    ],
  },
  {
    id: 'starter',
    name: 'Starter',
    cost: 90,
    cardCount: 1,
    odds: [
      { tier: 'bronze', label: 'Bronze', percent: 60 },
      { tier: 'silver', label: 'Argent', percent: 40 },
    ],
  },
  {
    id: 'standard',
    name: 'Standard',
    cost: 180,
    cardCount: 2,
    guarantee: '1 Argent garanti',
    odds: [
      { tier: 'bronze', label: 'Bronze', percent: 40 },
      { tier: 'silver', label: 'Argent', percent: 45 },
      { tier: 'elite', label: 'Élite', percent: 15 },
    ],
  },
];

// ---- Live Game : classement de démonstration ----

export const initialLeaderboard: LeaderboardRow[] = [
  { athleteEntryId: '1', name: 'C. Brau', weightLabel: '-66 KG', currentTotal: 0 },
  { athleteEntryId: '2', name: 'H. Chwałek', weightLabel: '-66 KG', currentTotal: 0 },
  { athleteEntryId: '3', name: 'L. Topic', weightLabel: '-66 KG', currentTotal: 0 },
  { athleteEntryId: '4', name: 'M. Koślak', weightLabel: '-66 KG', currentTotal: 0 },
];

// ---- Arènes (sports) ----

export const arenas: ArenaInfo[] = [
  { key: 'streetlifting', name: 'Streetlifting', unlocked: true },
  { key: 'powerlifting', name: 'Powerlifting', unlocked: false },
  { key: 'weightlifting', name: 'Weightlifting', unlocked: false },
];

// ---- Navigation (Sidebar desktop) ----

export const sidebarGameNav: NavItem[] = [
  { href: '/pregame', label: 'Pré-Game', icon: 'calendar' },
  { href: '/live', label: 'Live Game', icon: 'radio', badge: 'live' },
  { href: '/quiz', label: 'Quiz Game', icon: 'help' },
];

export const sidebarParcoursNav: NavItem[] = [
  { href: '/cards', label: 'Mes Cartes', icon: 'cards' },
  { href: '/analyses', label: 'Mes Analyses', icon: 'chart' },
  { href: '/results', label: 'Mes Résultats', icon: 'trophy' },
];

export const sidebarInfoNav: NavItem[] = [{ href: '/rules', label: 'Règles du jeu', icon: 'info' }];

// ---- Navigation (BottomNav mobile) ----

export const bottomNavItems: NavItem[] = [
  { href: '/', label: 'Accueil', icon: 'home' },
  { href: '/pregame', label: 'Pré-Game', icon: 'calendar' },
  { href: '/live', label: 'Live', icon: 'radio' },
  { href: '/quiz', label: 'Quiz Game', icon: 'help' },
];

// ---- Bannière héro ----

export const heroContent: HeroContent = {
  eyebrow: 'Prochaine compétition',
  title: "Championnats d'Europe de Streetlifting",
  subtitle: '2 – 4 octobre 2026 · Paris · France. Préparez vos cartes avant le coup d\'envoi.',
  eventDate: '2026-10-02T09:00:00',
  ctaLabel: 'Préparer mon équipe',
  backgroundImageUrl: '/images/hero-finalrep.jpg',
};

// ---- Sponsors ----

export const sponsors: SponsorItem[] = [
  { id: 'kow', name: 'King of Weighted' },
  { id: 'mergaux', name: 'Mergaux' },
  { id: 'tatakai', name: 'Tatakai' },
  { id: 'altius', name: 'Altius' },
];
