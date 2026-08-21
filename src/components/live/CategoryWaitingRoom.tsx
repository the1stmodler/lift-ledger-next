'use client';

import { useCountdown } from '@/hooks/useCountdown';

interface CategoryWaitingRoomProps {
  categoryLabel: string;
  genderLabel: string;
  startsAtIso: string;
  joined: boolean;
  onJoin: () => void;
}

/**
 * Sas d'attente avant le début d'une catégorie (équivalent `renderWaitingRoom`
 * du prototype). Le joueur doit cliquer "Rejoindre le jeu" avant le coup
 * d'envoi — passé ce délai, il ne peut plus rejoindre cette catégorie.
 */
export default function CategoryWaitingRoom({
  categoryLabel,
  genderLabel,
  startsAtIso,
  joined,
  onJoin,
}: CategoryWaitingRoomProps) {
  const { days, hours, minutes, seconds, mounted } = useCountdown(startsAtIso);
  const cd = mounted ? `${String(days).padStart(2, '0')}j ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}` : '--';

  return (
    <div className="flex flex-col items-center rounded-l border border-electric-line bg-gradient-to-br from-steel-2 to-steel-1 px-6 py-10 text-center">
      <span className="mb-4 rounded-full border border-electric-line bg-electric-soft px-3 py-1.5 font-mono text-[11px] font-bold uppercase text-electric-bright">
        {genderLabel} &middot; {categoryLabel}
      </span>
      <div className="font-display text-lg uppercase text-platinum">Prochaine catégorie</div>
      <div className="mt-2 font-mono text-3xl font-bold text-white">{cd}</div>
      <p className="mt-2 text-xs text-mute">Temps restant pour rejoindre cette catégorie</p>

      {joined ? (
        <div className="mt-5 flex items-center gap-2 text-sm font-bold text-good">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} className="h-4 w-4">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Vous êtes inscrit et prêt&nbsp;!
        </div>
      ) : (
        <button
          onClick={onJoin}
          className="mt-5 rounded-full bg-grad-electric px-8 py-3 text-sm font-bold text-white shadow-ambient"
        >
          Rejoindre le jeu
        </button>
      )}
      <p className="mt-4 max-w-xs text-[11px] text-mute-dim">
        {joined
          ? 'Une fois la catégorie lancée, le jeu démarrera automatiquement pour vous.'
          : 'Une fois la catégorie lancée, il ne sera plus possible de la rejoindre.'}
      </p>
    </div>
  );
}
