'use client';

import { useState } from 'react';
import PredictPanel from '@/components/live/PredictPanel';
import LiveRankList from '@/components/live/LiveRankList';
import { initialLeaderboard } from '@/data/mockData';
import type { AttemptGuess, LiveAttempt } from '@/types';

const DEMO_ATTEMPT: LiveAttempt = {
  athleteId: '1',
  athleteName: 'C. Brau',
  weightLabel: '-66 KG',
  movement: 'MU',
  attemptNumber: 1,
  attemptWeight: 9.6,
};

/**
 * Page Live Game (démo). En production, `attempt` provient de l'état de
 * session temps réel (WebSocket namespace /live, voir backend NestJS livré
 * précédemment) plutôt que d'une constante locale.
 */
export default function LiveGamePage() {
  const [rows, setRows] = useState(initialLeaderboard);

  async function handleAnswer(guess: AttemptGuess) {
    // Intégration réelle : POST /api/live/attempts/:id/predict puis attendre
    // l'événement WebSocket `attempt:validated` pour le résultat définitif.
    await new Promise((r) => setTimeout(r, 400));

    // Démo : simule la validation d'un essai qui fait évoluer le classement,
    // pour illustrer l'animation FLIP de <LiveRankList />.
    setRows((prev) => {
      const next = [...prev];
      const idx = Math.floor(Math.random() * next.length);
      next[idx] = { ...next[idx], currentTotal: next[idx].currentTotal + DEMO_ATTEMPT.attemptWeight };
      return next;
    });

    return guess === 'GOOD_LIFT'; // simplification démo
  }

  return (
    <div className="grid gap-6 md:grid-cols-[1fr_320px]">
      <div>
        <h1 className="mb-4 font-display text-2xl uppercase text-platinum">Live Game</h1>
        <PredictPanel attempt={DEMO_ATTEMPT} onAnswer={handleAnswer} />
      </div>
      <LiveRankList rows={rows} />
    </div>
  );
}
