'use client';

import { useState } from 'react';
import AthleteProfileCard from '@/components/analyses/AthleteProfileCard';
import CompareBar from '@/components/analyses/CompareBar';
import { athleteProfiles } from '@/data/mockData';
import { cn } from '@/lib/utils';

type Mode = 'browse' | 'compare';

/**
 * Page Mes Analyses : deux modes contrôlés par un seul useState (`mode`).
 * En mode "compare", une deuxième pile d'état (`selectedIds`) gère quels
 * athlètes participent à la comparaison, avec un maximum volontairement
 * non plafonné (comme le prototype d'origine).
 */
export default function AnalysesPage() {
  const [mode, setMode] = useState<Mode>('browse');
  const [browseId, setBrowseId] = useState(athleteProfiles[0]?.id);
  const [selectedIds, setSelectedIds] = useState<string[]>(athleteProfiles.map((a) => a.id));

  const browsedAthlete = athleteProfiles.find((a) => a.id === browseId) ?? athleteProfiles[0];
  const comparedAthletes = athleteProfiles.filter((a) => selectedIds.includes(a.id));

  function toggleCompare(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-mute">Parcours</div>
        <h1 className="font-display text-2xl uppercase text-platinum">Mes Analyses</h1>
      </div>

      <div className="flex gap-2">
        <ModeButton label="Parcourir un athlète" active={mode === 'browse'} onClick={() => setMode('browse')} />
        <ModeButton label="Comparer plusieurs athlètes" active={mode === 'compare'} onClick={() => setMode('compare')} />
      </div>

      {mode === 'browse' ? (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            {athleteProfiles.map((a) => (
              <button
                key={a.id}
                onClick={() => setBrowseId(a.id)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold',
                  a.id === browseId ? 'border-electric-bright bg-electric-soft text-electric-bright' : 'border-metal-lineStrong bg-steel-2 text-mute',
                )}
              >
                {a.name}
              </button>
            ))}
          </div>
          {browsedAthlete && <AthleteProfileCard athlete={browsedAthlete} />}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          <div className="flex flex-wrap gap-2">
            {athleteProfiles.map((a) => (
              <button
                key={a.id}
                onClick={() => toggleCompare(a.id)}
                className={cn(
                  'rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold',
                  selectedIds.includes(a.id)
                    ? 'border-electric-bright bg-electric-soft text-electric-bright'
                    : 'border-metal-lineStrong bg-steel-2 text-mute',
                )}
              >
                {a.name}
              </button>
            ))}
          </div>

          {comparedAthletes.length >= 2 ? (
            <div className="rounded-l border border-metal-line bg-steel-1 p-5">
              <CompareBar label="RIS · indice P4P" athletes={comparedAthletes} getValue={(a) => a.risScore} formatValue={(v) => v.toLocaleString('fr-FR')} />
              <CompareBar label="Total PR" athletes={comparedAthletes} getValue={(a) => a.total} formatValue={(v) => `${v} kg`} />
            </div>
          ) : (
            <p className="rounded-m border border-dashed border-metal-lineStrong p-8 text-center text-sm text-mute">
              Sélectionnez au moins 2 athlètes pour lancer la comparaison.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function ModeButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rounded-s border px-4 py-2.5 text-xs font-bold',
        active ? 'border-electric-bright bg-grad-electric text-white' : 'border-metal-lineStrong bg-steel-2 text-mute',
      )}
    >
      {label}
    </button>
  );
}
