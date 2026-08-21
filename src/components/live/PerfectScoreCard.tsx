'use client';

import { cn } from '@/lib/utils';

interface PerfectScoreCardProps {
  athleteName: string;
  weightLabel: string;
  onAnswer: (willBePerfect: boolean) => void;
  answered: boolean;
}

/**
 * "Perfect Score" — carte bonus dorée qui apparaît au début du Squat pour
 * les athlètes en sans-faute (Muscle-up + Pull-up + Dips validés à 100%).
 * Le joueur pronostique s'il ira au bout du sans-faute jusqu'au Squat.
 */
export default function PerfectScoreCard({ athleteName, weightLabel, onAnswer, answered }: PerfectScoreCardProps) {
  return (
    <div className="relative overflow-hidden rounded-l border-2 border-[#FFD34E] bg-gradient-to-br from-[#3d2a06] to-[#1a1204] p-5 text-center shadow-[0_0_40px_-10px_rgba(255,211,78,0.5)]">
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#FFD34E] to-[#C98A1D] px-3 py-1 font-display text-[11px] uppercase text-[#241a00]">
        ★ Perfect Score
      </div>
      <div className="font-display text-lg uppercase text-platinum">{athleteName}</div>
      <div className="font-mono text-[10px] text-mute">{weightLabel}</div>
      <p className="mt-3 text-sm text-platinum">
        Sans-faute sur MU &middot; PU &middot; Dips. Validera-t-il le Perfect Score au Squat&nbsp;?
      </p>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <button
          disabled={answered}
          onClick={() => onAnswer(false)}
          className={cn(
            'rounded-m border py-3 text-[13px] font-extrabold uppercase transition-colors disabled:pointer-events-none disabled:opacity-50',
            'border-metal-lineStrong bg-black/30 text-platinum hover:border-signal hover:text-signal',
          )}
        >
          ✕ Non
        </button>
        <button
          disabled={answered}
          onClick={() => onAnswer(true)}
          className={cn(
            'rounded-m border py-3 text-[13px] font-extrabold uppercase transition-colors disabled:pointer-events-none disabled:opacity-50',
            'border-[#FFD34E] bg-[#FFD34E]/10 text-[#FFD34E] hover:bg-[#FFD34E]/20',
          )}
        >
          ✓ Oui
        </button>
      </div>
    </div>
  );
}
