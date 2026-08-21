// ============================================================
// Contenu textuel/visuel "éditorial" (bannière héro, sponsors) — extrait
// des composants pour que HeroBanner/SponsorTicker restent purement
// présentationnels et pilotables depuis src/data/mockData.ts.
// ============================================================

export interface HeroContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  /** Date ISO du coup d'envoi, alimente useCountdown() */
  eventDate: string;
  ctaLabel: string;
  backgroundImageUrl: string;
}

export interface SponsorItem {
  id: string;
  name: string;
}
