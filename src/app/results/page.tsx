import ResultsLeaderboard from '@/components/results/ResultsLeaderboard';
import RewardCard from '@/components/results/RewardCard';
import { resultEntries, rewards } from '@/data/mockData';

/**
 * Page Mes Résultats. Purement présentationnelle côté page (pas d'état
 * React nécessaire ici) — toutes les données transitent via mockData.ts.
 */
export default function ResultsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-mute">Parcours</div>
        <h1 className="font-display text-2xl uppercase text-platinum">Mes Résultats</h1>
      </div>

      <ResultsLeaderboard entries={resultEntries} />

      <div>
        <h2 className="mb-3 font-display text-lg uppercase text-platinum">Palmarès</h2>
        <div className="grid gap-3 sm:grid-cols-3">
          {rewards.map((reward) => (
            <RewardCard key={reward.id} reward={reward} />
          ))}
        </div>
      </div>
    </div>
  );
}
