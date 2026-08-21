'use client';

import { useRouter } from 'next/navigation';
import HeroBanner from '@/components/home/HeroBanner';
import SponsorTicker from '@/components/home/SponsorTicker';
import PromoBannerCard from '@/components/home/PromoBannerCard';
import RarityTiersPanel from '@/components/home/RarityTiersPanel';
import { heroContent, sponsors, promoBanner, rarityTiers } from '@/data/mockData';

/**
 * Page d'accueil. La grille de cartes cliquables a été retirée (elle
 * pointait vers une fiche athlète /athlete/[id] non construite) et
 * remplacée par un bandeau promo + un encart explicatif des paliers de
 * rareté, tous deux purement informatifs.
 */
export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-6">
      <SponsorTicker sponsors={sponsors} />
      <HeroBanner content={heroContent} />
      <PromoBannerCard promo={promoBanner} onCta={() => router.push('/cards')} />
      <RarityTiersPanel tiers={rarityTiers} />
    </div>
  );
}
