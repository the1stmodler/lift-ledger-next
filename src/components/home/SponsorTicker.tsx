import type { SponsorItem } from '@/types';

interface SponsorTickerProps {
  sponsors: SponsorItem[];
}

/**
 * Bandeau sponsors en défilement infini. Composant purement présentationnel
 * (pas d'état) — la liste de sponsors est reçue en props, aucune donnée
 * codée en dur ici.
 */
export default function SponsorTicker({ sponsors }: SponsorTickerProps) {
  const doubled = [...sponsors, ...sponsors];
  return (
    <div className="overflow-hidden rounded-m border border-metal-line bg-steel-1">
      <div className="flex animate-[marquee_18s_linear_infinite] whitespace-nowrap">
        {doubled.map((sponsor, i) => (
          <div
            key={`${sponsor.id}-${i}`}
            className="flex items-center gap-2 border-r border-metal-line px-8 py-4 font-mono text-xs font-bold uppercase tracking-wide text-mute"
          >
            {sponsor.name}
          </div>
        ))}
      </div>
    </div>
  );
}
