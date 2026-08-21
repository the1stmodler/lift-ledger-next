'use client';

import { cn } from '@/lib/utils';
import type { FinalAttemptChoice } from '@/types';

interface FinalAttemptCardProps {
  athleteName: string;
  prevWeight: number;
  prevSuccess: boolean;
  onChoose: (choice: FinalAttemptChoice) => void;
  chosen: FinalAttemptChoice | null;
}

const OPTIONS: { key: FinalAttemptChoice; label: string; sub: string }[] = [
  { key: 'safe', label: 'Option Sûre', sub: '+0 à +5 kg' },
  { key: 'standard', label: 'Option Standard', sub: '+5,1 à +10 kg' },
  { key: 'allin', label: 'Option All-In', sub: '+10,1 kg ou plus' },
];

/**
 * "The Final Attempt" — mini-jeu déclenché après l'essai 2 de chaque
 * athlète : le joueur pronostique la stratégie de charge choisie par le
 * coach pour le 3e essai. Thème violet distinct du panneau Good/No Lift
 * pour bien marquer ce moment spécial.
 */
export default function FinalAttemptCard({ athleteName, prevWeight, prevSuccess, onChoose, chosen }: FinalAttemptCardProps) {
  return (
    <div className="rounded-l border border-electric-violet bg-gradient-to-br from-[#241a3d] to-[#120a20] p-5 text-center">
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-electric-violet px-3 py-1 font-mono text-[10px] font-bold uppercase text-white">
        The Final Attempt
      </div>
      <p className="text-sm font-bold text-platinum">
        Quelle stratégie de charge pour le 3<sup>e</sup> essai de {athleteName}&nbsp;?
      </p>
      <p className="mt-1 font-mono text-[10.5px] text-mute">
        Essai 2&nbsp;: {prevSuccess ? 'validé ✓' : 'raté ✕'} à {prevWeight}&nbsp;kg
      </p>

      <div className="mt-4 flex flex-col gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt.key}
            disabled={!!chosen}
            onClick={() => onChoose(opt.key)}
            className={cn(
              'flex items-center justify-between rounded-m border px-4 py-2.5 text-left text-[13px] font-bold transition-colors disabled:pointer-events-none',
              chosen === opt.key
                ? 'border-electric-bright bg-electric-soft text-electric-bright'
                : 'border-metal-lineStrong bg-white/[0.03] text-platinum',
              chosen && chosen !== opt.key && 'opacity-40',
            )}
          >
            {opt.label}
            <span className="font-mono text-[10px] font-medium text-mute">{opt.sub}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
