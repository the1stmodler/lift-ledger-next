import type { CardTier, RarityTierInfo } from '@/types';
import { cn } from '@/lib/utils';

interface RarityTiersPanelProps {
  tiers: RarityTierInfo[];
}

const TIER_STYLE: Record<CardTier, { border: string; text: string; glow: string }> = {
  bronze: { border: 'border-bronze', text: 'text-bronze', glow: 'shadow-[0_0_24px_-8px_#9C6B42]' },
  silver: { border: 'border-silver', text: 'text-silver', glow: 'shadow-[0_0_24px_-8px_#AEB6C2]' },
  elite: { border: 'border-electric-bright', text: 'text-electric-bright', glow: 'shadow-[0_0_24px_-8px_#6FA8FF]' },
};

/**
 * Encart explicatif des paliers de rareté des cartes (Bronze / Argent /
 * Élite). Remplace sur la page d'accueil l'ancienne grille de cartes
 * cliquables qui pointait vers une fiche athlète inexistante — purement
 * informatif, aucune navigation.
 */
export default function RarityTiersPanel({ tiers }: RarityTiersPanelProps) {
  return (
    <section>
      <div className="mb-4">
        <div className="font-mono text-[11px] uppercase tracking-widest text-mute">Collection</div>
        <h2 className="font-display text-2xl uppercase text-platinum">Niveaux de rareté</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {tiers.map((tier) => {
          const style = TIER_STYLE[tier.tier];
          return (
            <div
              key={tier.tier}
              className={cn('rounded-l border bg-steel-1 p-5', style.border, style.glow)}
            >
              <div className="flex items-center gap-3">
                <span
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-full border-2 font-display text-sm',
                    style.border,
                    style.text,
                  )}
                >
                  <IconGem className="h-4 w-4" />
                </span>
                <div className={cn('font-display text-lg uppercase', style.text)}>{tier.label}</div>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-mute">{tier.description}</p>
              <div className="mt-4 border-t border-metal-line pt-3 font-mono text-[10.5px] uppercase tracking-wide text-mute-dim">
                {tier.dropRateLabel}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function IconGem(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} {...props}>
      <path d="M6 3h12l3 5-9 13L3 8l3-5Z" />
      <path d="M3 8h18M9 3l3 5-3 13M15 3l-3 5 3 13" />
    </svg>
  );
}
