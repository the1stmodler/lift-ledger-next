'use client';

import { useRouter } from 'next/navigation';
import HeroBanner from '@/components/home/HeroBanner';
import SponsorTicker from '@/components/home/SponsorTicker';
import AthleteCard from '@/components/cards/AthleteCard';
import { heroContent, sponsors, featuredAthletes } from '@/data/mockData';

/**
 * Page d'accueil. Toutes les données (héro, sponsors, cartes vedettes)
 * proviennent de src/data/mockData.ts — à remplacer en production par un
 * fetch vers l'API (voir backend NestJS livré précédemment :
 * GET /api/competitions, GET /api/categories/:id/roster).
 */
export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <SponsorTicker sponsors={sponsors} />
      <HeroBanner content={heroContent} />

      <section>
        <div className="mb-4 flex items-end justify-between">
          <div>
            <div className="font-mono text-[11px] uppercase tracking-widest text-mute">Sélection du jour</div>
            <h2 className="font-display text-2xl uppercase text-platinum">Cartes vedettes du championnat</h2>
          </div>
          <button onClick={() => router.push('/cards')} className="font-mono text-xs text-electric-bright hover:underline">
            Mes Cartes →
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {featuredAthletes.map((athlete) => (
            <AthleteCard key={athlete.id} athlete={athlete} onClick={(id) => router.push(`/athlete/${id}`)} />
          ))}
        </div>
      </section>
    </div>
  );
}
