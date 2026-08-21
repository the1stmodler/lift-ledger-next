'use client';

import { useState } from 'react';
import DivisionPanel from '@/components/pregame/DivisionPanel';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { divisions, onboardingTours } from '@/data/mockData';

const pregameTour = onboardingTours.find((t) => t.id === 'pregame')!;

/**
 * Page Pré-Game : sélection de 3 cartes par division avant clôture.
 * `selections` centralise l'état de toutes les divisions dans la page —
 * chaque <DivisionPanel /> reste un composant contrôlé sans état de
 * sélection propre (seul `pickerOpen` reste local à chaque panneau).
 */
export default function PreGamePage() {
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  function handleChange(divisionId: string, athleteIds: string[]) {
    setSelections((prev) => ({ ...prev, [divisionId]: athleteIds }));
  }

  return (
    <div className="flex flex-col gap-5">
      <OnboardingModal tour={pregameTour} />

      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-mute">Game</div>
        <h1 className="font-display text-2xl uppercase text-platinum">Pré-Game</h1>
        <p className="mt-1 max-w-xl text-sm text-mute">
          Sélectionnez 3 cartes de votre collection pour chaque division, avant la clôture (début de la compétition).
        </p>
      </div>

      {divisions.map((division) => (
        <DivisionPanel
          key={division.id}
          division={division}
          selectedIds={selections[division.id] ?? []}
          onChange={handleChange}
        />
      ))}
    </div>
  );
}
