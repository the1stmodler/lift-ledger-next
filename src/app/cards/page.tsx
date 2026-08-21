'use client';

import { useMemo, useState } from 'react';
import AthleteCard from '@/components/cards/AthleteCard';
import PackShopCard from '@/components/cards/PackShopCard';
import PackOpeningModal from '@/components/cards/PackOpeningModal';
import { packOffers, myCollection, featuredAthletes } from '@/data/mockData';
import type { AthleteCardData, CardTier, Gender, PackOdds } from '@/types';
import { cn } from '@/lib/utils';

type GenderFilter = Gender | 'ALL';

const FILTERS: { key: GenderFilter; label: string }[] = [
  { key: 'ALL', label: 'Toutes' },
  { key: 'H', label: 'Hommes' },
  { key: 'F', label: 'Femmes' },
];

// Pool de tirage pour l'ouverture de pack — combine les cartes déjà connues
// de la démo. Sera remplacé par le tirage réel côté API une fois les
// athlètes intégrés en base de données (POST /api/cards/packs/open).
const DRAW_POOL: AthleteCardData[] = [...featuredAthletes, ...myCollection];

function pickRandomTier(odds: PackOdds[]): CardTier {
  const roll = Math.random();
  let cumulative = 0;
  for (const o of odds) {
    cumulative += o.percent / 100;
    if (roll <= cumulative) return o.tier;
  }
  return odds[odds.length - 1].tier;
}

function drawCards(cardCount: number, odds: PackOdds[]): AthleteCardData[] {
  const drawn: AthleteCardData[] = [];
  for (let i = 0; i < cardCount; i++) {
    const tier = pickRandomTier(odds);
    const candidates = DRAW_POOL.filter((a) => a.tier === tier);
    const pool = candidates.length > 0 ? candidates : DRAW_POOL;
    drawn.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return drawn;
}

/**
 * Page "Mes Cartes" : boutique de packs + collection filtrable.
 * `handleBuy` tire les cartes selon les probabilités du pack (odds par
 * palier), puis affiche <PackOpeningModal /> pour l'animation de révélation
 * — même logique de tirage pondéré que le service `CardsService.openPack()`
 * côté backend NestJS (livré précédemment), simulée ici côté client.
 */
export default function CardsPage() {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('ALL');
  const [revealedCards, setRevealedCards] = useState<AthleteCardData[] | null>(null);

  const filteredCollection = useMemo(
    () => myCollection.filter((athlete) => genderFilter === 'ALL' || athlete.gender === genderFilter),
    [genderFilter],
  );

  async function handleBuy(packId: string) {
    const pack = packOffers.find((p) => p.id === packId);
    if (!pack) return;
    setPurchasingId(packId);
    try {
      // Intégration réelle :
      // const res = await fetch('/api/cards/packs/open', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ packTypeId: packId }),
      // });
      // const { cards } = await res.json();
      await new Promise((r) => setTimeout(r, 700)); // simulation démo du temps réseau
      setRevealedCards(drawCards(pack.cardCount, pack.odds));
    } finally {
      setPurchasingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-4 font-display text-2xl uppercase text-platinum">Boutique</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {packOffers.map((pack) => (
            <PackShopCard key={pack.id} pack={pack} onBuy={handleBuy} isPurchasing={purchasingId === pack.id} />
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-2xl uppercase text-platinum">Ma collection</h2>
          <div className="flex gap-2">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setGenderFilter(f.key)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold transition-colors',
                  genderFilter === f.key
                    ? 'border-electric-bright bg-electric-soft text-electric-bright'
                    : 'border-metal-lineStrong bg-steel-2 text-mute hover:text-platinum',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {filteredCollection.length === 0 ? (
          <p className="rounded-m border border-dashed border-metal-lineStrong p-8 text-center text-sm text-mute">
            Aucune carte ne correspond à ce filtre.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {filteredCollection.map((athlete) => (
              <AthleteCard key={athlete.id} athlete={athlete} />
            ))}
          </div>
        )}
      </section>

      {revealedCards && <PackOpeningModal cards={revealedCards} onClose={() => setRevealedCards(null)} />}
    </div>
  );
}
