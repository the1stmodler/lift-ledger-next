'use client';

import { useState } from 'react';
import CompetitionTabs from '@/components/live/CompetitionTabs';
import CategoryTimeline from '@/components/live/CategoryTimeline';
import VideoBanner from '@/components/live/VideoBanner';
import PredictPanel from '@/components/live/PredictPanel';
import LiveRankList from '@/components/live/LiveRankList';
import CategoryWaitingRoom from '@/components/live/CategoryWaitingRoom';
import FinalAttemptCard from '@/components/live/FinalAttemptCard';
import PerfectScoreCard from '@/components/live/PerfectScoreCard';
import JetonGainToast from '@/components/live/JetonGainToast';
import FlashPodiumModal from '@/components/live/FlashPodiumModal';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { competitionTabs, timelineCategories, initialLeaderboard, flashPodiumEntries, onboardingTours } from '@/data/mockData';
import { cn } from '@/lib/utils';
import type { AttemptGuess, FinalAttemptChoice, LiveEvent } from '@/types';

const liveTour = onboardingTours.find((t) => t.id === 'live')!;

// Date de coup d'envoi de la catégorie affichée dans le sas d'attente. Loin
// dans le futur pour la démo (roster réduit — le vrai calendrier sera piloté
// par la base de données une fois les athlètes intégrés).
const CATEGORY_START_ISO = '2026-10-02T09:00:00';

/**
 * File d'événements de démonstration : essais standards, avec insertion de
 * "The Final Attempt" après l'essai 2 d'un athlète et de "Perfect Score"
 * avant un essai de Squat — reproduit la mécanique complète du prototype
 * original avec le roster réduit actuellement disponible dans mockData.ts.
 */
function buildDemoQueue(): LiveEvent[] {
  return [
    { type: 'lift', attempt: { athleteId: '1', athleteName: 'C. Brau', weightLabel: '-66 KG', movement: 'MU', attemptNumber: 1, attemptWeight: 9.6 } },
    { type: 'lift', attempt: { athleteId: '2', athleteName: 'H. Chwałek', weightLabel: '-66 KG', movement: 'MU', attemptNumber: 1, attemptWeight: 9.4 } },
    { type: 'lift', attempt: { athleteId: '1', athleteName: 'C. Brau', weightLabel: '-66 KG', movement: 'MU', attemptNumber: 2, attemptWeight: 10.4 } },
    { type: 'final', finalContext: { athleteName: 'C. Brau', weightLabel: '-66 KG', prevWeight: 10.4, prevSuccess: true } },
    { type: 'lift', attempt: { athleteId: '3', athleteName: 'L. Topic', weightLabel: '-66 KG', movement: 'PU', attemptNumber: 1, attemptWeight: 19.5 } },
    { type: 'boss', bossContext: { athleteName: 'C. Brau', weightLabel: '-66 KG' } },
    { type: 'lift', attempt: { athleteId: '1', athleteName: 'C. Brau', weightLabel: '-66 KG', movement: 'SQ', attemptNumber: 1, attemptWeight: 75.1 } },
    { type: 'lift', attempt: { athleteId: '4', athleteName: 'M. Koślak', weightLabel: '-66 KG', movement: 'MU', attemptNumber: 1, attemptWeight: 9.1 } },
  ];
}

/**
 * Page Live Game complète : sas d'attente, onglets de compétition, timeline,
 * vidéo, classement en direct, et le panneau central qui bascule entre les
 * 3 mini-jeux (Good/No Lift, The Final Attempt, Perfect Score) au fil de la
 * file d'événements. En production, la file provient du WebSocket temps
 * réel (namespace /live, voir backend NestJS livré précédemment) plutôt
 * que d'un script local.
 */
export default function LiveGamePage() {
  const [joined, setJoined] = useState(false);
  const [rows, setRows] = useState(initialLeaderboard);
  const [queue] = useState<LiveEvent[]>(buildDemoQueue);
  const [qIndex, setQIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [jetonGainKey, setJetonGainKey] = useState(0);
  const [jetonAmount, setJetonAmount] = useState(0);
  const [showPodium, setShowPodium] = useState(false);
  const [finalChoice, setFinalChoice] = useState<FinalAttemptChoice | null>(null);
  const [bossAnswered, setBossAnswered] = useState(false);
  const [sideResultFlash, setSideResultFlash] = useState<'correct' | 'wrong' | null>(null);

  const currentEvent = qIndex < queue.length ? queue[qIndex] : null;

  function awardJetons(amount: number) {
    setJetonAmount(amount);
    setJetonGainKey((k) => k + 1);
  }

  function bumpLeaderboard(athleteName: string, weight: number) {
    setRows((prev) => prev.map((r) => (r.name === athleteName ? { ...r, currentTotal: r.currentTotal + weight } : r)));
  }

  function advance() {
    setSideResultFlash(null);
    if (qIndex + 1 >= queue.length) {
      setShowPodium(true);
    } else {
      setQIndex((i) => i + 1);
      setFinalChoice(null);
      setBossAnswered(false);
    }
  }

  async function handleAnswer(guess: AttemptGuess) {
    if (!currentEvent?.attempt) return false;
    await new Promise((r) => setTimeout(r, 350));
    const success = Math.random() > 0.35;
    if (success) bumpLeaderboard(currentEvent.attempt.athleteName, currentEvent.attempt.attemptWeight);
    const correct = (guess === 'GOOD_LIFT') === success;
    if (correct) {
      setScore((s) => s + 10);
      awardJetons(5);
    }
    setTimeout(advance, 700);
    return correct;
  }

  function handleFinalChoice(choice: FinalAttemptChoice) {
    setFinalChoice(choice);
    const actual: FinalAttemptChoice = (['safe', 'standard', 'allin'] as const)[Math.floor(Math.random() * 3)];
    const correct = choice === actual;
    setSideResultFlash(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore((s) => s + 25);
      awardJetons(15);
    }
    setTimeout(advance, 900);
  }

  function handleBossAnswer(guess: boolean) {
    setBossAnswered(true);
    const willBePerfect = Math.random() < 0.35;
    const correct = guess === willBePerfect;
    setSideResultFlash(correct ? 'correct' : 'wrong');
    if (correct) {
      setScore((s) => s + 50);
      awardJetons(30);
    }
    setTimeout(advance, 900);
  }

  return (
    <div className="flex flex-col gap-5">
      <OnboardingModal tour={liveTour} />

      <CompetitionTabs tabs={competitionTabs} />
      <CategoryTimeline categories={timelineCategories} />

      <div className="grid gap-5 md:grid-cols-[1.35fr_1fr]">
        <div className="flex flex-col gap-5">
          <VideoBanner eventDate={CATEGORY_START_ISO} isLive />
          <LiveRankList rows={rows} />
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between rounded-m border border-metal-line bg-steel-1 px-4 py-2.5">
            <span className="font-mono text-[10px] uppercase text-mute">Score de session</span>
            <span className="font-mono text-sm font-bold text-electric-bright">{score}</span>
          </div>

          <div className="relative">
            <JetonGainToast triggerKey={jetonGainKey} amount={jetonAmount} />

            {sideResultFlash && (
              <div
                className={cn(
                  'absolute inset-0 z-10 flex items-center justify-center rounded-l bg-void/85 font-display text-lg uppercase backdrop-blur-[2px]',
                  sideResultFlash === 'correct' ? 'text-good' : 'text-signal',
                )}
              >
                {sideResultFlash === 'correct' ? '✓ Bon pronostic' : '✕ Raté'}
              </div>
            )}

            {!joined ? (
              <CategoryWaitingRoom
                categoryLabel="-66 KG"
                genderLabel="Hommes"
                startsAtIso={CATEGORY_START_ISO}
                joined={joined}
                onJoin={() => setJoined(true)}
              />
            ) : !currentEvent ? (
              <div className="rounded-l border border-dashed border-metal-lineStrong p-10 text-center text-sm text-mute">
                Catégorie terminée — merci d&apos;avoir joué&nbsp;!
              </div>
            ) : currentEvent.type === 'lift' && currentEvent.attempt ? (
              <PredictPanel attempt={currentEvent.attempt} onAnswer={handleAnswer} />
            ) : currentEvent.type === 'final' && currentEvent.finalContext ? (
              <FinalAttemptCard
                athleteName={currentEvent.finalContext.athleteName}
                prevWeight={currentEvent.finalContext.prevWeight}
                prevSuccess={currentEvent.finalContext.prevSuccess}
                onChoose={handleFinalChoice}
                chosen={finalChoice}
              />
            ) : currentEvent.type === 'boss' && currentEvent.bossContext ? (
              <PerfectScoreCard
                athleteName={currentEvent.bossContext.athleteName}
                weightLabel={currentEvent.bossContext.weightLabel}
                onAnswer={handleBossAnswer}
                answered={bossAnswered}
              />
            ) : null}
          </div>
        </div>
      </div>

      {showPodium && (
        <FlashPodiumModal
          entries={flashPodiumEntries}
          categoryLabel="Hommes · -66 KG"
          onClose={() => setShowPodium(false)}
        />
      )}
    </div>
  );
}
