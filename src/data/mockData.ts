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
  Division,
  CompetitionTab,
  TimelineCategory,
  QuizFormat,
  QuizQuestion,
  AthleteProfile,
  ResultEntry,
  Reward,
  RarityTierInfo,
  PromoBanner,
  FlashPodiumEntry,
  OnboardingTour,
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

// ---- Podium flash de fin de catégorie (Live Game) ----

export const flashPodiumEntries: FlashPodiumEntry[] = [
  { rank: 1, name: 'T. Auberval', points: 474 },
  { rank: 2, name: 'N. Delvaux', points: 470 },
  { rank: 3, name: 'L. Achab', points: 395 },
  { rank: 4, name: 'R. Simonet', points: 381 },
  { rank: 5, name: 'Vous', points: 340, isMe: true },
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

// ---- Bandeau promo (accueil) ----

export const promoBanner: PromoBanner = {
  eyebrow: "Bonus spécial Championnats d'Europe",
  title: '500 JT offerts',
  description: 'Un bonus exceptionnel a été crédité sur votre solde pour ouvrir plusieurs packs de cartes avant le coup d\'envoi du 2 octobre.',
  amountLabel: '+500',
  amountSuffix: 'déjà sur votre solde',
  ctaLabel: 'Ouvrir un pack',
};

// ---- Paliers de rareté des cartes (RarityTiersPanel, accueil) ----

export const rarityTiers: RarityTierInfo[] = [
  {
    tier: 'bronze',
    label: 'Bronze',
    description: 'Athlètes prometteurs de la scène. La base de toute collection équilibrée.',
    dropRateLabel: '~50% des tirages',
  },
  {
    tier: 'silver',
    label: 'Argent',
    description: 'Compétiteurs confirmés, réguliers sur le podium de leur catégorie.',
    dropRateLabel: '~35% des tirages',
  },
  {
    tier: 'elite',
    label: 'Élite',
    description: 'Les têtes d\'affiche du championnat. Rares, décisifs, recherchés.',
    dropRateLabel: '~15% des tirages',
  },
];

// ---- Pré-Game : divisions et pool d'athlètes sélectionnables ----

const draftPoolLightweight: AthleteCardData[] = [
  { id: 'm-66-1', name: 'C. Brau', gender: 'H', weightLabel: '-66KG', tier: 'elite', risScore: 56.23, stats: { MU: 10.4, PU: 19.5, DIPS: 34.1, SQ: 75.1 }, total: 139 },
  { id: 'm-66-2', name: 'H. Chwałek', gender: 'H', weightLabel: '-66KG', tier: 'silver', risScore: 56.23, stats: { MU: 10.4, PU: 19.5, DIPS: 34.1, SQ: 75.1 }, total: 139 },
  { id: 'm-66-3', name: 'L. Topic', gender: 'H', weightLabel: '-66KG', tier: 'bronze', risScore: 56.23, stats: { MU: 10.4, PU: 19.5, DIPS: 34.1, SQ: 75.1 }, total: 139 },
  { id: 'm-73-1', name: 'J. Valdez', gender: 'H', weightLabel: '-73KG', tier: 'silver', risScore: 61.89, stats: { MU: 11.5, PU: 21.4, DIPS: 37.5, SQ: 82.6 }, total: 153 },
  { id: 'm-73-2', name: 'F. Fresta', gender: 'H', weightLabel: '-73KG', tier: 'bronze', risScore: 61.89, stats: { MU: 11.5, PU: 21.4, DIPS: 37.5, SQ: 82.6 }, total: 153 },
];

export const divisions: Division[] = [
  {
    id: 'div-m-light',
    label: 'Hommes · Lightweight',
    weightRange: '-66KG / -73KG',
    closeAt: '2026-10-03T09:00:00',
    pool: draftPoolLightweight,
  },
  {
    id: 'div-w-light',
    label: 'Femmes · Lightweight',
    weightRange: '-52KG / -57KG',
    closeAt: '2026-10-04T09:00:00',
    pool: [
      { id: 'w-52-1', name: 'J. Lis', gender: 'F', weightLabel: '-52KG', tier: 'silver', risScore: 32.76, stats: { MU: 6.1, PU: 11.3, DIPS: 19.8, SQ: 43.7 }, total: 81 },
      { id: 'w-57-1', name: 'E. Christinaki', gender: 'F', weightLabel: '-57KG', tier: 'bronze', risScore: 35.6, stats: { MU: 6.6, PU: 12.3, DIPS: 21.6, SQ: 47.5 }, total: 88 },
    ],
  },
];

// ---- Live Game : onglets de compétition + timeline des catégories ----

export const competitionTabs: CompetitionTab[] = [
  { id: 'euros-2026', name: "Championnats d'Europe de Streetlifting 2026", status: 'live', statusLabel: 'EN DIRECT' },
  { id: 'worlds-2027', name: 'Championnats du Monde de Streetlifting 2027', status: 'locked', statusLabel: 'Bientôt' },
];

export const timelineCategories: TimelineCategory[] = [
  { id: 'm-66', weightLabel: '-66 KG', genderLabel: 'H', dayLabel: 'Jour 1', timeLabel: '09:00', isLive: true },
  { id: 'm-73', weightLabel: '-73 KG', genderLabel: 'H', dayLabel: 'Jour 1', timeLabel: '09:45', isLive: false },
  { id: 'm-80', weightLabel: '-80 KG', genderLabel: 'H', dayLabel: 'Jour 1', timeLabel: '12:00', isLive: false },
  { id: 'm-87', weightLabel: '-87 KG', genderLabel: 'H', dayLabel: 'Jour 1', timeLabel: '12:45', isLive: false },
  { id: 'm-94', weightLabel: '-94 KG', genderLabel: 'H', dayLabel: 'Jour 1', timeLabel: '15:30', isLive: false },
  { id: 'w-52', weightLabel: '-52 KG', genderLabel: 'F', dayLabel: 'Jour 2', timeLabel: '09:00', isLive: false },
  { id: 'w-57', weightLabel: '-57 KG', genderLabel: 'F', dayLabel: 'Jour 2', timeLabel: '09:45', isLive: false },
];

// ---- Quiz Game ----

export const quizFormats: QuizFormat[] = [
  {
    id: 'streetliftings-quiz',
    name: 'The Streetliftings Quiz',
    subtitle: 'Partenaire média',
    badge: 'SLS',
    description: 'Une liste de questions créée par le média Streetliftings pour pimenter votre pronostic.',
    closeAt: '2026-10-02T09:00:00',
    rewardLabel: "Jusqu'à 60 JT",
  },
  {
    id: 'the-strongest',
    name: 'The Strongest',
    subtitle: 'Format officiel',
    badge: '',
    description: 'Pronostiquez le podium RIS Hommes et le podium RIS Femmes de tout le championnat.',
    closeAt: '2026-10-02T09:00:00',
    rewardLabel: "Jusqu'à 60 JT",
  },
  {
    id: 'the-grid',
    name: 'The GRID',
    subtitle: 'Nouveau format',
    badge: '',
    description: 'Choisissez une catégorie et placez tous les athlètes en lice, du premier au dernier.',
    closeAt: '2026-10-02T09:00:00',
    rewardLabel: "Jusqu'à 80 JT",
  },
];

export const streetliftingsQuizQuestions: QuizQuestion[] = [
  { id: 'q1', prompt: "Combien d'athlètes vont buller (0/3 sur un mouvement) pendant tout le week-end ?", options: ['0', '1', '2', '3 et plus'] },
  { id: 'q2', prompt: "Un record d'Europe tombera-t-il pendant l'évènement ?", options: ['Oui, sur un mouvement', 'Oui, au total', 'Plusieurs records', 'Non, aucun'] },
  { id: 'q3', prompt: "Quel mouvement enregistrera le plus d'échecs (0/3) sur l'ensemble du week-end ?", options: ['Muscle-up lesté', 'Pull-up lesté', 'Dips lestés', 'Squat lesté'] },
];

// ---- Mes Analyses ----

export const athleteProfiles: AthleteProfile[] = [
  {
    id: 'm-66-1',
    name: 'C. Brau',
    gender: 'H',
    weightLabel: '-66KG',
    tier: 'elite',
    risScore: 56.23,
    stats: { MU: 10.4, PU: 19.5, DIPS: 34.1, SQ: 75.1 },
    total: 139,
    country: 'France',
    age: 27,
    competitionsCount: 6,
    bestTotal: 141,
    form: 4.2,
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
    country: 'Pologne',
    age: 24,
    competitionsCount: 4,
    bestTotal: 83,
    form: -1.1,
  },
];

// ---- Mes Résultats ----

export const resultEntries: ResultEntry[] = [
  { rank: 1, name: 'A. Mercier', level: 27, points: 12480, trend: 2 },
  { rank: 2, name: 'S. Braun', level: 25, points: 11990, trend: 1 },
  { rank: 3, name: 'L. Oyelaran', level: 24, points: 11750, trend: -1 },
  { rank: 4, name: 'R. Costa', level: 23, points: 11400, trend: 0 },
  { rank: 5, name: 'H. Lindqvist', level: 22, points: 11180, trend: 3 },
  { rank: 128, name: 'Julien K. (vous)', level: 14, points: 8940, trend: 6, isCurrentUser: true },
];

export const rewards: Reward[] = [
  { id: 'silver-medal', title: "Médaille d'argent", subtitle: 'Meeting national Streetlifting · mai 2026' },
  { id: 'perfect-streak', title: 'Série parfaite', subtitle: 'Saison 03' },
  { id: 'top-200', title: 'Top 200 général', subtitle: 'Saison 03' },
];

// ---- Tutoriels d'onboarding (Pré-Game / Live Game / Quiz Game) ----

export const onboardingTours: OnboardingTour[] = [
  {
    id: 'pregame',
    icon: 'calendar',
    steps: [
      {
        title: 'Composez vos 3 cartes',
        description:
          "Avant chaque compétition, sélectionnez exactement 3 cartes de votre collection pour chacune des divisions en jeu. Chaque athlète sélectionné rapportera des points selon sa performance réelle sur le plateau.",
      },
      {
        title: 'Deux décomptes à surveiller',
        description:
          "Un premier décompte indique quand la division s'ouvre à la sélection. Un second indique la clôture, au début effectif de la compétition : passé ce délai, votre sélection est verrouillée.",
      },
      {
        title: 'Gagnez des points',
        description:
          "Charge validée, classement final, record battu : chaque athlète que vous avez sélectionné fait progresser votre score sur toute la durée de l'événement.",
      },
    ],
  },
  {
    id: 'live',
    icon: 'radio',
    steps: [
      {
        title: 'Rejoignez avant le coup d\'envoi',
        description:
          "Chaque catégorie de poids a son propre sas d'attente. Cliquez sur « Rejoindre le jeu » avant le lancement : une fois la catégorie en cours, il n'est plus possible de la rejoindre.",
      },
      {
        title: 'Pronostiquez chaque essai',
        description:
          "Good Lift ou No Lift ? Un chrono réaliste vous laisse le temps de répondre entre la décision de l'essai précédent et le passage de l'athlète suivant. Bonne réponse = jetons gagnés, avec animation à l'appui.",
      },
      {
        title: 'Repérez les moments spéciaux',
        description:
          "The Final Attempt (stratégie du 3e essai) et Perfect Score (sans-faute) offrent des questions bonus avec une mise en scène dédiée. Restez attentif, ils rapportent gros !",
      },
    ],
  },
  {
    id: 'quiz',
    icon: 'help',
    steps: [
      {
        title: 'Choisissez votre format',
        description:
          "The Streetliftings Quiz, The Strongest, The Grid : plusieurs formats de pronostics vous attendent, chacun avec ses propres règles et récompenses.",
      },
      {
        title: 'Répondez avant la clôture',
        description:
          "Chaque quiz affiche un compte à rebours clair. Validez vos réponses avant l'échéance pour qu'elles soient prises en compte et rapportent des jetons.",
      },
      {
        title: 'Comparez votre score',
        description:
          "Une fois vos pronostics soumis, suivez le classement pour voir comment votre flair se mesure à celui des autres joueurs.",
      },
    ],
  },
];
