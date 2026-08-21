'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { TimelineCategory } from '@/types';

interface CategoryTimelineProps {
  categories: TimelineCategory[];
  onSelect?: (id: string) => void;
}

/** Timeline horizontale des catégories de poids (passage des divisions). */
export default function CategoryTimeline({ categories, onSelect }: CategoryTimelineProps) {
  const [activeId, setActiveId] = useState(categories.find((c) => c.isLive)?.id ?? categories[0]?.id);

  function handleSelect(id: string) {
    setActiveId(id);
    onSelect?.(id);
  }

  return (
    <div className="rounded-l border border-metal-line bg-steel-1 p-5">
      <div className="mb-4 font-display text-lg uppercase text-platinum">FinalRep Euros 26</div>
      <div className="relative flex gap-6 overflow-x-auto pb-1">
        <div className="absolute left-0 right-0 top-[7px] h-px bg-metal-line" />
        {categories.map((cat) => {
          const active = cat.id === activeId;
          return (
            <button key={cat.id} onClick={() => handleSelect(cat.id)} className="relative flex shrink-0 flex-col items-center gap-1.5">
              <span
                className={cn(
                  'z-[1] h-3.5 w-3.5 rounded-full border-2',
                  active ? 'border-electric-bright bg-electric-bright' : 'border-metal-lineStrong bg-steel-1',
                )}
              />
              <span className={cn('font-mono text-[11px] font-bold', active ? 'text-electric-bright' : 'text-platinum')}>
                {cat.weightLabel}
              </span>
              <span className="font-mono text-[9px] text-mute">
                {cat.genderLabel} &middot; {cat.dayLabel}
              </span>
              <span className="font-mono text-[9px] text-mute">{cat.timeLabel}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
