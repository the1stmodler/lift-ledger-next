import type { PromoBanner } from '@/types';

interface PromoBannerCardProps {
  promo: PromoBanner;
  onCta?: () => void;
}

/** Bandeau promo ponctuel (ex: bonus de jetons offerts), design épuré. */
export default function PromoBannerCard({ promo, onCta }: PromoBannerCardProps) {
  return (
    <section className="overflow-hidden rounded-l border border-electric-line bg-gradient-to-br from-steel-1 to-steel-2 p-8">
      <div className="font-mono text-[11px] uppercase tracking-widest text-electric-bright">{promo.eyebrow}</div>
      <div className="mt-2 font-display text-4xl uppercase text-platinum">{promo.title}</div>
      <p className="mt-3 max-w-md text-sm text-mute">{promo.description}</p>

      <div className="mt-6 flex items-center gap-4">
        <div>
          <div className="font-display text-3xl text-electric-bright">{promo.amountLabel} JT</div>
          <div className="font-mono text-[10px] uppercase text-mute">{promo.amountSuffix}</div>
        </div>
        <button
          onClick={onCta}
          className="rounded-s bg-grad-electric px-6 py-3 text-sm font-bold text-white shadow-ambient"
        >
          {promo.ctaLabel}
        </button>
      </div>
    </section>
  );
}
