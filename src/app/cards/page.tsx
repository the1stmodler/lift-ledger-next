'use client';

import { useMemo, useState } from 'react';
import AthleteCard from '@/components/cards/AthleteCard';
import PackShopCard from '@/components/cards/PackShopCard';
import { packOffers, myCollection } from '@/data/mockData';
import type { Gender } from '@/types';
import { cn } from '@/lib/utils';

type GenderFilter = Gender | 'ALL';

const FILTERS: { key: GenderFilter; label: string }[] = [
  { key: 'ALL', label: 'Toutes' },
  { key: 'H', label: 'Hommes' },
  { key: 'F', label: 'Femmes' },
];

/**
 * Page "Mes Cartes" : boutique de packs + collection filtrable.
 * Démontre deux mécaniques d'état distinctes :
 *   - `purchasingId` : état de chargement asynchrone pendant un achat
 *   - `genderFilter`  : filtre synchrone appliqué à la collection affichée
 * Toutes les données proviennent de src/data/mockData.ts.
 */
export default function CardsPage() {
  const [purchasingId, setPurchasingId] = useState<string | null>(null);
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('ALL');

  const filteredCollection = useMemo(
    () => myCollection.filter((athlete) => genderFilter === 'ALL' || athlete.gender === genderFilter),
    [genderFilter],
  );

  async function handleBuy(packId: string) {
    setPurchasingId(packId);
    try {
      // Intégration réelle :
      // await fetch('/api/cards/packs/open', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      //   body: JSON.stringify({ packTypeId: packId }),
      // });
      await new Promise((r) => setTimeout(r, 700)); // simulation démo
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
    </div>
  );
}
