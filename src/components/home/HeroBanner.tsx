'use client';

import { useCountdown } from '@/hooks/useCountdown';
import type { HeroContent } from '@/types';

interface HeroBannerProps {
  content: HeroContent;
}

/**
 * Bannière héro de l'accueil avec compte à rebours vivant vers le coup
 * d'envoi. Tout le contenu (titre, sous-titre, date, image) est reçu en
 * props — aucun texte codé en dur. La logique de minuteur (SSR-safe) vit
 * dans le hook partagé `useCountdown`.
 */
export default function HeroBanner({ content }: HeroBannerProps) {
  const { days, hours, minutes, seconds, mounted } = useCountdown(content.eventDate);

  return (
    <section className="relative overflow-hidden rounded-l border border-metal-line bg-steel-1">
      <div
        className="absolute inset-0 bg-cover bg-[75%_18%]"
        style={{ backgroundImage: `url('${content.backgroundImageUrl}')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-void via-void/70 to-transparent" />

      <div className="relative z-[1] p-8 md:p-12">
        <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-electric-line bg-electric-soft px-3 py-1.5 font-mono text-[11px] font-bold uppercase text-electric-bright">
          <span className="h-1.5 w-1.5 rounded-full bg-electric-bright" />
          {content.eyebrow}
        </span>

        <h1 className="max-w-xl font-display text-[clamp(38px,6vw,72px)] uppercase leading-[0.95] text-platinum">
          {content.title}
        </h1>
        <p className="mt-4 max-w-md text-sm text-mute">{content.subtitle}</p>

        <div className="mt-8 grid max-w-md grid-cols-4 gap-3">
          {[
            { label: 'Jours', value: days },
            { label: 'Heures', value: hours },
            { label: 'Minutes', value: minutes },
            { label: 'Secondes', value: seconds },
          ].map((block) => (
            <div
              key={block.label}
              className="rounded-s border border-electric-line bg-electric-soft/60 py-3 text-center backdrop-blur-sm"
            >
              <div className="font-mono text-2xl font-bold text-electric-bright">
                {mounted ? String(block.value).padStart(2, '0') : '--'}
              </div>
              <div className="font-mono text-[9px] uppercase text-mute">{block.label}</div>
            </div>
          ))}
        </div>

        <button className="mt-8 rounded-s bg-grad-electric px-6 py-3.5 text-sm font-bold text-white shadow-ambient">
          {content.ctaLabel}
        </button>
      </div>
    </section>
  );
}
