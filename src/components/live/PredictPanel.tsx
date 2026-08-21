'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn, initialsFromName } from '@/lib/utils';
import type { AttemptGuess, LiveAttempt } from '@/types';

interface PredictPanelProps {
  attempt: LiveAttempt;
  durationSeconds?: number;
  /** Remonte le choix du joueur au composant parent (appel API réel côté prod). */
  onAnswer?: (guess: AttemptGuess) => Promise<boolean>; // retourne si le pronostic était correct
}

const RING_RADIUS = 17.5;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

/**
 * Panneau de pronostic Good Lift / No Lift (équivalent `renderPredictPanel`
 * du prototype). Toute la donnée de l'essai en cours arrive via la prop
 * typée `attempt: LiveAttempt` ; l'état React ne gère que l'interactivité :
 *   - `secondsLeft` : minuteur décompté via useEffect/setInterval
 *   - `answer`      : choix verrouillé une fois soumis (désactive les boutons)
 *   - `resultFlash` : feedback visuel temporaire après résolution
 */
export default function PredictPanel({ attempt, durationSeconds = 35, onAnswer }: PredictPanelProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [answer, setAnswer] = useState<AttemptGuess | null>(null);
  const [resultFlash, setResultFlash] = useState<'correct' | 'wrong' | null>(null);

  // Minuteur : se réinitialise à chaque nouvel essai (changement de props clé)
  useEffect(() => {
    setSecondsLeft(durationSeconds);
    setAnswer(null);
    setResultFlash(null);
  }, [attempt.athleteId, attempt.movement, attempt.attemptNumber, durationSeconds]);

  useEffect(() => {
    if (answer || secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [answer, secondsLeft]);

  const ringOffset = useMemo(
    () => RING_CIRCUMFERENCE * (1 - secondsLeft / durationSeconds),
    [secondsLeft, durationSeconds],
  );

  async function handleAnswer(guess: AttemptGuess) {
    if (answer) return;
    setAnswer(guess);
    const correct = (await onAnswer?.(guess)) ?? Math.random() > 0.5; // fallback démo sans backend branché
    setResultFlash(correct ? 'correct' : 'wrong');
  }

  return (
    <div className="relative overflow-hidden rounded-l border border-electric-line bg-gradient-to-br from-steel-2 to-steel-1 p-3.5">
      {resultFlash && (
        <div
          className={cn(
            'absolute inset-0 z-10 flex items-center justify-center bg-void/85 font-display text-lg uppercase backdrop-blur-[2px]',
            resultFlash === 'correct' ? 'text-good' : 'text-signal',
          )}
        >
          {resultFlash === 'correct' ? '✓ Bon pronostic' : '✕ Raté'}
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <div className="flex h-[42px] w-[42px] items-center justify-center rounded-full border-2 border-electric-bright font-display text-sm text-white">
          {initialsFromName(attempt.athleteName)}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate font-display text-[15px] uppercase text-platinum">{attempt.athleteName}</div>
          <div className="font-mono text-[9.5px] text-mute">{attempt.weightLabel}</div>
        </div>

        <div className="relative h-10 w-10 shrink-0">
          <svg viewBox="0 0 40 40" className="-rotate-90">
            <circle cx="20" cy="20" r={RING_RADIUS} fill="none" stroke="#333" strokeWidth={3} />
            <circle
              cx="20"
              cy="20"
              r={RING_RADIUS}
              fill="none"
              strokeWidth={3}
              strokeLinecap="round"
              className={cn(
                'transition-[stroke-dashoffset] duration-1000 ease-linear',
                secondsLeft <= 5 ? 'stroke-signal' : 'stroke-electric-bright',
              )}
              strokeDasharray={RING_CIRCUMFERENCE}
              strokeDashoffset={ringOffset}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center font-mono text-xs font-bold text-platinum">
            {secondsLeft}
          </span>
        </div>
      </div>

      <div className="my-2.5 inline-flex items-center gap-1.5 rounded-full bg-move-mu px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-void">
        {attempt.movement} &middot; Essai {attempt.attemptNumber}
      </div>

      <div className="mb-3">
        <div className="font-mono text-base font-extrabold text-electric-bright">
          {attempt.attemptWeight}
          <span className="ml-0.5 text-[10px] font-medium text-mute">kg tentés</span>
        </div>
        <div className="mt-1 h-1.5 rounded-full bg-gradient-to-r from-good via-electric-bright to-signal opacity-35" />
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <AnswerButton
          label="No Lift"
          variant="no"
          selected={answer === 'NO_LIFT'}
          disabled={!!answer}
          onClick={() => handleAnswer('NO_LIFT')}
        />
        <AnswerButton
          label="Good Lift"
          variant="yes"
          selected={answer === 'GOOD_LIFT'}
          disabled={!!answer}
          onClick={() => handleAnswer('GOOD_LIFT')}
        />
      </div>
    </div>
  );
}

function AnswerButton({
  label,
  variant,
  selected,
  disabled,
  onClick,
}: {
  label: string;
  variant: 'yes' | 'no';
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex items-center justify-center gap-1.5 rounded-m border py-3 text-[13px] font-extrabold uppercase transition-colors disabled:pointer-events-none disabled:opacity-50',
        selected && variant === 'yes' && 'border-good bg-good/10 text-good',
        selected && variant === 'no' && 'border-signal bg-signal-soft text-signal',
        !selected && 'border-metal-lineStrong bg-steel-2 text-platinum',
      )}
    >
      {variant === 'yes' ? '✓' : '✕'} {label}
    </button>
  );
}
