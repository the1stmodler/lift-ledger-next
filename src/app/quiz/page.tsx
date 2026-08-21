'use client';

import { useMemo, useState } from 'react';
import QuizLobbyCard from '@/components/quiz/QuizLobbyCard';
import QuizQuestionCard from '@/components/quiz/QuizQuestionCard';
import OnboardingModal from '@/components/onboarding/OnboardingModal';
import { quizFormats, streetliftingsQuizQuestions, onboardingTours } from '@/data/mockData';

const quizTour = onboardingTours.find((t) => t.id === 'quiz')!;

/**
 * Page Quiz Game : sélection du format (lobby) puis réponses aux questions.
 * `answers` centralise les réponses de l'utilisateur, clé = questionId.
 * Le bouton "Valider" ne s'active que lorsque toutes les questions ont
 * une réponse (dérivé via useMemo plutôt que stocké séparément).
 */
export default function QuizGamePage() {
  const [selectedQuizId, setSelectedQuizId] = useState(quizFormats[0]?.id);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const questions = streetliftingsQuizQuestions; // un seul format détaillé dans cette démo
  const selectedQuiz = quizFormats.find((q) => q.id === selectedQuizId);
  const isDetailedFormat = selectedQuizId === quizFormats[0]?.id;

  const allAnswered = useMemo(
    () => questions.every((q) => !!answers[q.id]),
    [questions, answers],
  );

  function handleAnswer(questionId: string, option: string) {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  }

  return (
    <div className="flex flex-col gap-6">
      <OnboardingModal tour={quizTour} />

      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-mute">Game</div>
        <h1 className="font-display text-2xl uppercase text-platinum">Quiz Game</h1>
        <p className="mt-1 max-w-xl text-sm text-mute">
          La section de pronostics d&apos;avant-match, accessible sans cartes numériques.
        </p>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-2">
        {quizFormats.map((quiz) => (
          <QuizLobbyCard key={quiz.id} quiz={quiz} selected={quiz.id === selectedQuizId} onSelect={setSelectedQuizId} />
        ))}
      </div>

      {isDetailedFormat ? (
        <div className="flex flex-col gap-3">
          <h2 className="font-display text-lg uppercase text-platinum">Le grand quiz d&apos;avant-match</h2>
          {questions.map((question, i) => (
            <QuizQuestionCard
              key={question.id}
              question={question}
              index={i}
              selectedOption={answers[question.id] ?? null}
              onAnswer={handleAnswer}
            />
          ))}

          <div className="flex items-center justify-between rounded-m border border-metal-line bg-steel-1 p-4">
            <span className="font-mono text-xs text-mute">
              {Object.keys(answers).length} / {questions.length} questions répondues
            </span>
            <button
              disabled={!allAnswered || submitted}
              onClick={() => setSubmitted(true)}
              className="rounded-full bg-grad-electric px-5 py-2.5 text-xs font-bold text-white disabled:opacity-40"
            >
              {submitted ? 'Pronostics enregistrés ✓' : 'Valider mes pronostics'}
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-m border border-dashed border-metal-lineStrong p-10 text-center">
          <p className="font-display text-lg uppercase text-platinum">{selectedQuiz?.name}</p>
          <p className="mt-2 text-sm text-mute">
            Ce format sera détaillé prochainement dans cette démo — revenez sur &laquo;&nbsp;The Streetliftings
            Quiz&nbsp;&raquo; pour tester le flux complet de réponses.
          </p>
        </div>
      )}
    </div>
  );
}
