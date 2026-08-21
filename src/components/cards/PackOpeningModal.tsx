'use client';

import { useEffect, useState } from 'react';
import AthleteCard from '@/components/cards/AthleteCard';
import { cn } from '@/lib/utils';
import type { AthleteCardData } from '@/types';

interface PackOpeningModalProps {
  cards: AthleteCardData[];
  onClose: () => void;
}

/**
 * Animation d'ouverture de pack : les cartes tirées apparaissent une par
 * une (léger décalage) avec un scale-in + fondu, puis un bouton
 * "Continuer" apparaît une fois toutes les cartes révélées. Réutilise
 * directement <AthleteCard /> pour garder l'effet holographique cohérent
 * avec le reste du site.
 */
export default function PackOpeningModal({ cards, onClose }: PackOpeningModalProps) {
  const [revealedCount, setRevealedCount] = useState(0);

  useEffect(() => {
    if (revealedCount >= cards.length) return;
    const id = setTimeout(() => setRevealedCount((c) => c + 1), 450);
    return () => clearTimeout(id);
  }, [revealedCount, cards.length]);

  const allRevealed = revealedCount >= cards.length;

  return (
    <div className="fixed inset-0 z-[230] flex flex-col items-center justify-center gap-7 bg-black/92 p-6 backdrop-blur-md">
      <div className="font-display text-xl uppercase text-platinum">
        {allRevealed ? 'Vos nouvelles cartes' : "Ouverture du pack…"}
      </div>

      <div className="flex flex-wrap items-center justify-center gap-5">
        {cards.map((card, i) => (
          <div
            key={`${card.id}-${i}`}
            className={cn(
              'w-[180px] transition-all duration-500 ease-out',
              i < revealedCount ? 'translate-y-0 scale-100 opacity-100' : 'pointer-events-none translate-y-4 scale-75 opacity-0',
            )}
          >
            <AthleteCard athlete={card} />
          </div>
        ))}
      </div>

      {allRevealed && (
        <button onClick={onClose} className="rounded-full bg-grad-electric px-8 py-3 text-sm font-bold text-white shadow-ambient">
          Continuer
        </button>
      )}
    </div>
  );
}
