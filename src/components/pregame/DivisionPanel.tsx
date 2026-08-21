'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { Division } from '@/types';
import DraftPickCard from './DraftPickCard';

interface DivisionPanelProps {
  division: Division;
  selectedIds: string[];
  onChange: (divisionId: string, athleteIds: string[]) => void;
}

const MAX_PICKS = 3;

/**
 * Panneau d'une division : 3 emplacements de carte + grille de sélection.
 * L'état des sélections vit dans la page parente (`pregame/page.tsx`) et
 * transite ici via props, ce composant ne fait que proposer les actions
 * (`onChange`) — pattern "état remonté" classique en React.
 */
export default function DivisionPanel({ division, selectedIds, onChange }: DivisionPanelProps) {
  const [pickerOpen, setPickerOpen] = useState(false);

  function toggleAthlete(id: string) {
    if (selectedIds.includes(id)) {
      onChange(division.id, selectedIds.filter((x) => x !== id));
      return;
    }
    if (selectedIds.length >= MAX_PICKS) return;
    const next = [...selectedIds, id];
    onChange(division.id, next);
    if (next.length >= MAX_PICKS) setPickerOpen(false);
  }

  const selectedAthletes = division.pool.filter((a) => selectedIds.includes(a.id));
  const complete = selectedIds.length >= MAX_PICKS;

  return (
    <div className="rounded-l border border-metal-line bg-steel-1 p-5">
      <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
        <div>
          <div className="font-display text-lg uppercase text-platinum">{division.label}</div>
          <div className="font-mono text-[10.5px] text-mute">{division.weightRange}</div>
        </div>
        <span className="font-mono text-[10px] uppercase text-mute">
          Clôture <b className="text-electric-bright">{new Date(division.closeAt).toLocaleDateString('fr-FR')}</b>
        </span>
      </div>

      <div className="mb-3 grid grid-cols-3 gap-2.5">
        {[0, 1, 2].map((i) => {
          const athlete = selectedAthletes[i];
          return athlete ? (
            <button
              key={athlete.id}
              onClick={() => toggleAthlete(athlete.id)}
              className="rounded-m border border-electric-line bg-electric-soft p-2.5 text-left"
            >
              <div className="truncate text-xs font-bold text-platinum">{athlete.name}</div>
              <div className="font-mono text-[9px] text-mute">{athlete.weightLabel}</div>
            </button>
          ) : (
            <div
              key={i}
              className="flex items-center justify-center rounded-m border border-dashed border-metal-lineStrong py-6 text-mute"
            >
              +
            </div>
          );
        })}
      </div>

      <div className="mb-3 flex items-center justify-between">
        <span className="font-mono text-xs text-mute">{selectedIds.length} / {MAX_PICKS} cartes choisies</span>
        {!complete && (
          <button
            onClick={() => setPickerOpen((o) => !o)}
            className="rounded-full border border-metal-lineStrong bg-steel-2 px-3.5 py-1.5 font-mono text-xs font-semibold text-mute hover:text-platinum"
          >
            {pickerOpen ? 'Fermer' : 'Ajouter une carte'}
          </button>
        )}
      </div>

      {pickerOpen && !complete && (
        <div className={cn('grid grid-cols-3 gap-2 border-t border-metal-line pt-3 sm:grid-cols-4')}>
          {division.pool.map((athlete) => (
            <DraftPickCard
              key={athlete.id}
              athlete={athlete}
              selected={selectedIds.includes(athlete.id)}
              onToggle={toggleAthlete}
            />
          ))}
        </div>
      )}
    </div>
  );
}
