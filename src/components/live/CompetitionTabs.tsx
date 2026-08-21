'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { CompetitionTab } from '@/types';

interface CompetitionTabsProps {
  tabs: CompetitionTab[];
}

/** Onglets de compétition façon Esports World Cup, en haut de Live Game. */
export default function CompetitionTabs({ tabs }: CompetitionTabsProps) {
  const [activeId, setActiveId] = useState(tabs.find((t) => t.status === 'live')?.id ?? tabs[0]?.id);

  return (
    <div className="flex gap-0.5 overflow-x-auto">
      {tabs.map((tab) => {
        const active = tab.id === activeId;
        return (
          <button
            key={tab.id}
            onClick={() => tab.status === 'live' && setActiveId(tab.id)}
            className={cn(
              'w-[180px] shrink-0 border-b-[3px] px-3.5 py-3 pt-3 text-left transition-colors',
              active ? 'border-electric-bright bg-steel-1' : 'border-transparent bg-steel-2 hover:bg-steel-3',
            )}
          >
            <div className={cn('min-h-[32px] font-display text-[13.5px] uppercase leading-tight', active ? 'text-platinum' : 'text-mute')}>
              {tab.name}
            </div>
            <span
              className={cn(
                'mt-2 inline-block rounded-[3px] border px-2 py-0.5 font-mono text-[9.5px] font-bold uppercase',
                tab.status === 'live'
                  ? 'border-signal/40 bg-signal-soft text-signal'
                  : 'border-metal-lineStrong bg-steel-3 text-mute',
              )}
            >
              {tab.statusLabel}
            </span>
          </button>
        );
      })}
    </div>
  );
}
