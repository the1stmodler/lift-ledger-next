// ============================================================
// Boutique de packs de cartes (PackShopCard). Déduit des trois paliers
// "Starter / Standard / Élite" du prototype, avec probabilités de tirage
// affichées de façon transparente au joueur.
// ============================================================

import type { CardTier } from './athlete';

export interface PackOdds {
  tier: CardTier;
  label: string;
  percent: number;
}

export interface PackOffer {
  id: string;
  name: string;
  /** Coût en jetons (JT) */
  cost: number;
  cardCount: number;
  odds: PackOdds[];
  /** ex: "1 Élite garantie" — optionnel, affiché en badge */
  guarantee?: string;
  /** Met la carte en avant visuellement (pack "Élite" du prototype) */
  featured?: boolean;
}

/** Fiche explicative d'un palier de rareté (RarityTiersPanel, page d'accueil). */
export interface RarityTierInfo {
  tier: CardTier;
  label: string;
  description: string;
  /** ex: "~55% des tirages" — indicatif, non contractuel */
  dropRateLabel: string;
}
