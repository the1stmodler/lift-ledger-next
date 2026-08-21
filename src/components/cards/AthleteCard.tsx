'use client';

import { useRef, useState } from 'react';
import { cn, initialsFromName } from '@/lib/utils';
import type { AthleteCardData, Movement } from '@/types';
const TIER_COLORS: Record<AthleteCardData['tier'], { a: string; b: string; ring: string }> = {
  bronze: { a: '#d9a15c', b: '#7a4f22', ring: 'border-bronze' },
  silver: { a: '#c7cdd6', b: '#6b7480', ring: 'border-silver' },
  elite: { a: '#f4d97a', b: '#9a7418', ring: 'border-electric' },
};

const MOVE_LABEL: Record<Movement, string> = { MU: 'MU', PU: 'PU', DIPS: 'DIP', SQ: 'SQT' };

interface AthleteCardProps {
  athlete: AthleteCardData;
  onClick?: (id: string) => void;
}

/**
 * Carte athlète holographique (équivalent `.a-card` du prototype) : cadre
 * métallique à coins facettés, fond animé "hologramme", portrait lumineux
 * centré, inclinaison 3D + reflet qui suit la souris au survol.
 *
 * Le tilt est piloté via `ref` (mutation directe du style) plutôt que
 * `useState` sur chaque `mousemove` : un re-render React par pixel de
 * déplacement de souris ferait chuter les perfs. `useState` est réservé à
 * l'état "survolé" (déclenche le sweep holographique en CSS).
 */
export default function AthleteCard({ athlete, onClick }: AthleteCardProps) {
  const cardRef = useRef<HTMLButtonElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const tier = TIER_COLORS[athlete.tier];
  const initials = initialsFromName(athlete.name);

  function handleMouseMove(e: React.MouseEvent<HTMLButtonElement>) {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rotateY = (x - 0.5) * 12;
    const rotateX = (0.5 - y) * 12;
    card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
    card.style.setProperty('--mx', `${x * 100}%`);
    card.style.setProperty('--my', `${y * 100}%`);
  }

  function handleMouseLeave() {
    if (cardRef.current) cardRef.current.style.transform = '';
    setIsHovered(false);
  }

  return (
    <button
      ref={cardRef}
      onClick={() => onClick?.(athlete.id)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ ['--tier-a' as string]: tier.a, ['--tier-b' as string]: tier.b }}
      className={cn(
        'card-metal-frame group relative isolate w-full overflow-hidden bg-gradient-to-b from-[#1c2430] to-[#0a0e15] text-left transition-shadow duration-200 will-change-transform',
        'hover:shadow-[0_20px_36px_-14px_rgba(0,0,0,0.65)]',
      )}
    >
      {/* Fond holographique animé */}
      <div className="card-holo-bg pointer-events-none absolute inset-0 z-0 animate-holo-drift opacity-55" />
      {/* Grain matière */}
      <div className="card-texture pointer-events-none absolute inset-0 z-[1] opacity-50" />
      {/* Halo radial qui suit la souris */}
      <div
        className="pointer-events-none absolute inset-0 z-[3] opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(circle at var(--mx) var(--my), rgba(255,255,255,0.22), rgba(122,92,246,0.08) 35%, transparent 60%)',
        }}
      />
      {/* Reflet holographique (sweep) */}
      {isHovered && (
        <div className="pointer-events-none absolute -left-[35%] -top-[70%] z-[5] h-[240%] w-[65%] rotate-[20deg] animate-pack-sheen bg-gradient-to-r from-transparent via-white/30 to-transparent" />
      )}

      {/* Portrait */}
      <div className="relative z-[2] flex h-[150px] items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_42%,rgba(120,190,255,0.28),transparent_62%)]" />
        <span
          className="relative z-[2] font-display text-[42px] text-white/95"
          style={{ textShadow: '0 0 18px rgba(150,205,255,0.65), 0 0 3px rgba(255,255,255,0.8)' }}
        >
          {initials}
        </span>

        <div className="absolute left-3 top-2.5 z-[2] text-left leading-tight">
          <span className="block font-mono text-[7.5px] uppercase tracking-widest" style={{ color: tier.a }}>
            RIS
          </span>
          <span className="mt-0.5 block font-display text-[19px] text-white">{athlete.risScore}</span>
        </div>
        <div className="absolute right-3 top-3 z-[2] font-mono text-xs font-bold" style={{ color: tier.a }}>
          <b className="mr-0.5 font-display text-[15px] font-normal text-white">
            {athlete.weightLabel.replace('KG', '')}
          </b>
          KG
        </div>
      </div>

      {/* Corps */}
      <div className="relative z-[2] px-3.5 pt-2.5">
        <div className="text-[15.5px] font-extrabold text-platinum">{athlete.name}</div>
        {athlete.nickname && (
          <div className="mt-0.5 text-[10.5px] italic text-electric-bright">&laquo; {athlete.nickname} &raquo;</div>
        )}
        <div className="mt-0.5 font-mono text-[10px] uppercase text-mute">
          Streetlifting &middot; {athlete.weightLabel}
        </div>

        <div className="mt-3 grid grid-cols-4 border-t border-metal-line bg-white/[0.02]">
          {(Object.keys(MOVE_LABEL) as Movement[]).map((mv, i) => (
            <div key={mv} className={cn('py-2 text-center', i < 3 && 'border-r border-metal-line')}>
              <div className="font-mono text-[8px] uppercase tracking-wide text-mute-dim">{MOVE_LABEL[mv]}</div>
              <div className="mt-0.5 font-mono text-[11.5px] font-bold text-platinum">{athlete.stats[mv]}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between border-t border-metal-line px-0.5 py-2.5">
          <span className="font-mono text-[9.5px] uppercase tracking-widest text-mute">Total</span>
          <span className="font-mono text-[15.5px] font-extrabold text-electric-bright">{athlete.total} kg</span>
        </div>
      </div>

      <div className="relative z-[4] m-3 mt-0 rounded-s border border-metal-lineStrong py-2 text-center text-xs font-semibold text-mute group-hover:border-electric-line group-hover:text-electric-bright">
        Voir la carte
      </div>
    </button>
  );
}
