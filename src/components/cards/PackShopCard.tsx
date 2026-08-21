'use client';

import { cn } from '@/lib/utils';
import type { PackOffer, CardTier } from '@/types';

interface PackShopCardProps {
  pack: PackOffer;
  onBuy: (packId: string) => void;
  /** true pendant l'appel réseau d'achat, désactive le bouton pour éviter un double-clic */
  isPurchasing?: boolean;
}

const TIER_BAR_CLASS: Record<CardTier, string> = {
  bronze: 'bg-bronze',
  silver: 'bg-silver',
  elite: 'bg-electric-bright',
};

/**
 * Carte de pack boutique (équivalent `.shop-pack` du prototype). Toutes les
 * données (nom, coût, probabilités, garantie) proviennent de la prop
 * typée `pack: PackOffer` — aucune valeur codée en dur dans ce composant.
 */
export default function PackShopCard({ pack, onBuy, isPurchasing = false }: PackShopCardProps) {
  const { featured = false } = pack;

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden rounded-l border bg-steel-1',
        featured
          ? 'border-electric-bright shadow-[0_0_0_1px_rgba(122,92,246,0.18),0_24px_48px_-22px_rgba(122,92,246,0.4)]'
          : 'border-metal-line',
      )}
    >
      <div
        className={cn(
          'relative flex h-[120px] items-center justify-center overflow-hidden',
          featured ? 'bg-gradient-to-br from-electric-violet to-electric' : 'bg-gradient-to-br from-steel-3 to-steel-2',
        )}
      >
        {featured && (
          <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-white/25 bg-black/40 px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-white backdrop-blur-sm">
            ★ Meilleure valeur
          </span>
        )}
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-white/30 bg-black/30 text-white">
          <IconPack className="h-6 w-6" />
        </div>
        <span className="absolute bottom-2.5 left-0 right-0 text-center font-mono text-[9.5px] uppercase tracking-widest text-white/80">
          {pack.cardCount} carte{pack.cardCount > 1 ? 's' : ''}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className={cn('font-display uppercase text-platinum', featured ? 'text-[22px]' : 'text-lg')}>
          {pack.name}
        </div>

        {pack.guarantee && (
          <span className="mt-2 inline-flex w-fit items-center gap-1.5 rounded-full border border-electric-line bg-electric-soft px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-electric-bright">
            ✓ {pack.guarantee}
          </span>
        )}

        <div className="mt-3 flex flex-col gap-1.5">
          {pack.odds.map((o) => (
            <div key={o.tier} className="grid grid-cols-[56px_1fr_32px] items-center gap-2">
              <span className="font-mono text-[9.5px] text-mute">{o.label}</span>
              <span className="h-1.5 overflow-hidden rounded-full bg-steel-3">
                <span className={cn('block h-full rounded-full', TIER_BAR_CLASS[o.tier])} style={{ width: `${o.percent}%` }} />
              </span>
              <span className="text-right font-mono text-[9.5px] text-mute">{o.percent}%</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex items-center justify-between pt-4">
          <div className={cn('font-mono font-bold text-platinum', featured ? 'text-[28px]' : 'text-[22px]')}>
            {pack.cost}
            <span className="ml-1 text-[11px] font-medium text-mute">JT</span>
          </div>
          <button
            onClick={() => onBuy(pack.id)}
            disabled={isPurchasing}
            className={cn(
              'rounded-s px-5 py-2.5 text-[13px] font-bold text-white disabled:opacity-60',
              featured
                ? 'bg-grad-electric shadow-[0_8px_20px_-8px_rgba(122,92,246,0.55)]'
                : 'border border-electric-line bg-electric-soft text-electric-bright',
            )}
          >
            {isPurchasing ? 'Ouverture…' : 'Ouvrir le pack'}
          </button>
        </div>
      </div>
    </div>
  );
}

function IconPack(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} {...props}>
      <rect x="5" y="7" width="13" height="15" rx="1.5" transform="rotate(-8 11 14)" />
      <rect x="6.5" y="4" width="13" height="15" rx="1.5" />
    </svg>
  );
}
