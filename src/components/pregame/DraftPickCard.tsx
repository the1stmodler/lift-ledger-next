'use client';

import { cn, initialsFromName } from '@/lib/utils';
import type { AthleteCardData } from '@/types';

interface DraftPickCardProps {
  athlete: AthleteCardData;
  selected: boolean;
  onToggle: (id: string) => void;
}

/** Mini-carte de sélection pour le sélecteur de division du Pré-Game. */
export default function DraftPickCard({ athlete, selected, onToggle }: DraftPickCardProps) {
  return (
    <button
      onClick={() => onToggle(athlete.id)}
      className={cn(
        'flex flex-col overflow-hidden rounded-m border text-left transition-colors',
        selected ? 'border-electric-bright bg-electric-soft' : 'border-metal-lineStrong bg-steel-1 hover:border-electric-line',
      )}
    >
      <div className="relative flex h-16 items-center justify-center bg-gradient-to-br from-steel-3 to-steel-2 font-display text-lg text-white">
        {initialsFromName(athlete.name)}
        <span
          className={cn(
            'absolute right-1.5 top-1.5 flex h-5 w-5 items-center justify-center rounded-full border text-[10px]',
            selected ? 'border-transparent bg-electric-bright text-white' : 'border-white/40 text-transparent',
          )}
        >
          ✓
        </span>
      </div>
      <div className="p-2">
        <div className="truncate text-[11.5px] font-bold text-platinum">{athlete.name}</div>
        <div className="font-mono text-[9px] text-mute">{athlete.weightLabel}</div>
      </div>
    </button>
  );
}
