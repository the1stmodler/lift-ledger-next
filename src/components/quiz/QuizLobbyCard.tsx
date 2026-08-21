'use client';

import { cn, formatCountdown } from '@/lib/utils';
import { useCountdown } from '@/hooks/useCountdown';
import type { QuizFormat } from '@/types';

interface QuizLobbyCardProps {
  quiz: QuizFormat;
  selected: boolean;
  onSelect: (id: string) => void;
}

/** Carte de sélection d'un format de quiz (lobby). */
export default function QuizLobbyCard({ quiz, selected, onSelect }: QuizLobbyCardProps) {
  const { totalSeconds, mounted } = useCountdown(quiz.closeAt);

  return (
    <button
      onClick={() => onSelect(quiz.id)}
      className={cn(
        'flex w-[260px] shrink-0 flex-col overflow-hidden rounded-l border text-left transition-colors',
        selected ? 'border-electric-bright' : 'border-metal-line hover:border-electric-line',
      )}
    >
      <div className="flex h-20 items-center justify-between bg-gradient-to-br from-steel-3 to-steel-2 px-4">
        {quiz.badge && <span className="font-display text-lg text-white/70">{quiz.badge}</span>}
        <span className="ml-auto rounded-full border border-metal-lineStrong bg-black/30 px-2 py-0.5 font-mono text-[8.5px] uppercase text-mute">
          {quiz.subtitle}
        </span>
      </div>
      <div className="flex flex-1 flex-col bg-steel-1 p-4">
        <div className="font-display text-base uppercase text-platinum">{quiz.name}</div>
        <p className="mt-1 text-xs text-mute">{quiz.description}</p>
        <div className="mt-auto flex items-center justify-between pt-4 font-mono text-[10.5px]">
          <span className="text-mute">
            Clôture dans <b className="text-electric-bright">{mounted ? formatCountdown(totalSeconds) : '--'}</b>
          </span>
          <span className="font-bold text-electric-bright">{quiz.rewardLabel}</span>
        </div>
      </div>
    </button>
  );
}
