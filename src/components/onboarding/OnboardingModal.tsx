'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import type { OnboardingTour } from '@/types';
import NavIcon from '@/components/layout/NavIcon';

interface OnboardingModalProps {
  tour: OnboardingTour;
}

/**
 * Tutoriel multi-étapes (façon Esports World Cup) affiché automatiquement
 * à la toute première visite d'une page de jeu, puis mémorisé via
 * localStorage pour ne plus jamais réapparaître ensuite. Un seul composant
 * générique réutilisé sur les 3 pages (Pré-Game / Live Game / Quiz Game),
 * chacune passant son propre `tour` typé depuis mockData.ts.
 */
export default function OnboardingModal({ tour }: OnboardingModalProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);
  const storageKey = `onboard_seen_${tour.id}`;

  useEffect(() => {
    try {
      if (!localStorage.getItem(storageKey)) {
        localStorage.setItem(storageKey, '1');
        setOpen(true);
      }
    } catch {
      // localStorage indisponible (navigation privée stricte, etc.) : on
      // n'affiche simplement pas le tutoriel plutôt que de faire planter la page.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  if (!open) return null;

  const total = tour.steps.length;
  const current = tour.steps[step];
  const isLast = step === total - 1;

  function close() {
    setOpen(false);
  }

  function next() {
    if (isLast) close();
    else setStep((s) => s + 1);
  }

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="relative w-[min(94vw,440px)] max-h-[88vh] overflow-y-auto rounded-xl border border-metal-lineStrong bg-steel-1 p-7">
        <button
          onClick={close}
          aria-label="Fermer"
          className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full border border-metal-lineStrong bg-steel-2 text-mute hover:text-platinum"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" className="h-3.5 w-3.5">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        <div className="font-mono text-[11px] font-bold uppercase tracking-widest text-electric-bright">
          Étape {step + 1} sur {total}
        </div>
        <div className="mb-3.5 mt-1 pr-5 font-display text-2xl uppercase leading-[1.05] text-platinum">
          {current.title}
        </div>
        <p className="mb-4 text-sm leading-relaxed text-mute">{current.description}</p>

        <div className="mb-4 flex h-[150px] items-center justify-center rounded-l border border-metal-line bg-gradient-to-br from-steel-2 to-void text-electric-bright">
          <NavIcon name={tour.icon} className="h-14 w-14 opacity-90" />
        </div>

        <div className="mb-4 flex justify-center gap-1.5">
          {tour.steps.map((_, i) => (
            <span
              key={i}
              className={cn('h-1.5 rounded-full transition-all', i === step ? 'w-4 bg-electric-bright' : 'w-1.5 bg-metal-lineStrong')}
            />
          ))}
        </div>

        <div className="flex items-center gap-2.5 border-t border-metal-line pt-4">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            style={{ visibility: step === 0 ? 'hidden' : 'visible' }}
            className="flex-1 rounded-full border border-metal-lineStrong bg-steel-2 py-3 text-[13px] font-bold text-mute hover:text-platinum"
          >
            Retour
          </button>
          <button
            onClick={next}
            className="flex-1 rounded-full bg-grad-electric py-3 text-[13px] font-bold text-white"
          >
            {isLast ? 'Fermer et jouer' : 'Suivant'}
          </button>
        </div>
      </div>
    </div>
  );
}
