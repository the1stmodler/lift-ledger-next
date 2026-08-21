'use client';

import { cn } from '@/lib/utils';
import type { FlashPodiumEntry } from '@/types';

interface FlashPodiumModalProps {
  entries: FlashPodiumEntry[];
  categoryLabel: string;
  onClose: () => void;
}

/** Podium flash affiché à la fin d'une catégorie (mini-classement des joueurs). */
export default function FlashPodiumModal({ entries, categoryLabel, onClose }: FlashPodiumModalProps) {
  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-[min(92vw,400px)] rounded-xl border border-metal-lineStrong bg-steel-1 p-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="font-display text-2xl uppercase text-platinum">Classement flash</div>
        <div className="mb-5 mt-1 font-mono text-[11px] text-mute">{categoryLabel}</div>

        <div className="flex flex-col gap-2">
          {entries.map((row) => (
            <div
              key={row.rank}
              className={cn(
                'flex items-center gap-3 rounded-m px-3 py-2.5',
                row.isMe ? 'border border-electric-bright bg-electric-soft' : 'bg-steel-2',
              )}
            >
              <span className={cn('w-6 font-display text-base', row.rank === 1 ? 'text-[#FFD34E]' : 'text-mute')}>
                {row.rank}
              </span>
              <span className="flex-1 text-left text-[13px] font-bold text-platinum">{row.name}</span>
              <span className="font-mono text-xs font-bold text-electric-bright">{row.points} pts</span>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-5 rounded-full bg-grad-electric px-7 py-3 text-sm font-bold text-white"
        >
          Continuer
        </button>
      </div>
    </div>
  );
}
