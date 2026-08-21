'use client';

import { useLayoutEffect, useRef } from 'react';
import { cn, initialsFromName } from '@/lib/utils';
import type { LeaderboardRow } from '@/types';

interface LiveRankListProps {
  rows: LeaderboardRow[];
}

/**
 * Classement en direct qui anime le réordonnancement de ses lignes quand
 * `rows` change (un athlète valide un essai -> son Total grimpe -> il
 * remonte dans le classement). Technique FLIP (First / Last / Invert /
 * Play) : on mesure la position AVANT le re-render (via un ref par ligne),
 * puis après re-render on applique un `transform` inverse instantané suivi
 * d'une transition vers 0 — donne l'illusion d'un glissement fluide plutôt
 * qu'un saut brut de position.
 *
 * Alimenté en production par l'événement WebSocket `leaderboard:update`
 * (voir `useLiveSocket` à créer / backend `LiveGateway`).
 */
export default function LiveRankList({ rows }: LiveRankListProps) {
  const rowRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const prevRects = useRef<Map<string, DOMRect>>(new Map());

  // Avant peinture : compare les positions précédentes aux nouvelles et
  // rejoue le déplacement depuis l'ancienne position (FLIP).
  useLayoutEffect(() => {
    rowRefs.current.forEach((el, id) => {
      const prev = prevRects.current.get(id);
      if (!prev) return;
      const next = el.getBoundingClientRect();
      const deltaY = prev.top - next.top;
      if (deltaY) {
        el.style.transition = 'none';
        el.style.transform = `translateY(${deltaY}px)`;
        requestAnimationFrame(() => {
          el.style.transition = 'transform 450ms cubic-bezier(.2,.7,.2,1)';
          el.style.transform = '';
        });
      }
    });
    // Snapshot des positions courantes pour le prochain changement.
    rowRefs.current.forEach((el, id) => prevRects.current.set(id, el.getBoundingClientRect()));
  }, [rows]);

  const sorted = [...rows].sort((a, b) => b.currentTotal - a.currentTotal);

  return (
    <div className="rounded-m border border-metal-line bg-steel-1 p-3.5">
      <div className="mb-2 flex items-center justify-between px-0.5">
        <span className="font-display text-[15px] uppercase text-platinum">Classement en direct</span>
      </div>
      <div className="flex flex-col">
        {sorted.map((row, index) => (
          <div
            key={row.athleteEntryId}
            ref={(el) => {
              if (el) rowRefs.current.set(row.athleteEntryId, el);
            }}
            className="flex items-center gap-2.5 border-b border-metal-line py-2 last:border-b-0"
          >
            <span
              className={cn(
                'w-[18px] text-center font-mono text-xs font-bold',
                index === 0 && 'text-[#FFD34E]',
                index === 1 && 'text-[#C4C9D1]',
                index === 2 && 'text-[#D89257]',
                index > 2 && 'text-mute',
              )}
            >
              {index + 1}
            </span>
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-steel-3 font-mono text-[9.5px] font-bold text-white">
              {initialsFromName(row.name)}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-bold text-platinum">{row.name}</span>
              <span className="block font-mono text-[8.5px] text-mute">{row.weightLabel}</span>
            </span>
            <span className="shrink-0 font-mono text-[13px] font-extrabold text-platinum">
              {row.currentTotal}
              <span className="ml-0.5 text-[9px] font-medium text-mute">kg</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
