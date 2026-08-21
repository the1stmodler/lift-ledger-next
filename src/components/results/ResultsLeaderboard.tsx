import { cn } from '@/lib/utils';
import type { ResultEntry } from '@/types';

/** Classement général (page Mes Résultats). Composant purement présentationnel. */
export default function ResultsLeaderboard({ entries }: { entries: ResultEntry[] }) {
  return (
    <div className="overflow-hidden rounded-l border border-metal-line bg-steel-1">
      {entries.map((entry) => (
        <div
          key={entry.rank}
          className={cn(
            'flex items-center gap-4 border-b border-metal-line px-5 py-3.5 last:border-b-0',
            entry.isCurrentUser && 'bg-electric-soft',
          )}
        >
          <span
            className={cn(
              'w-8 shrink-0 text-center font-display text-lg',
              entry.rank === 1 && 'text-[#FFD34E]',
              entry.rank === 2 && 'text-[#C4C9D1]',
              entry.rank === 3 && 'text-[#D89257]',
              entry.rank > 3 && 'text-mute',
            )}
          >
            {entry.rank}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-platinum">{entry.name}</div>
            <div className="font-mono text-[10px] uppercase text-mute">Niveau {entry.level}</div>
          </div>
          <div className="text-right">
            <div className="font-mono text-sm font-bold text-platinum">{entry.points.toLocaleString('fr-FR')} pts</div>
            <div
              className={cn(
                'font-mono text-[10px]',
                entry.trend > 0 && 'text-good',
                entry.trend < 0 && 'text-signal',
                entry.trend === 0 && 'text-mute',
              )}
            >
              {entry.trend > 0 ? `▲ ${entry.trend}` : entry.trend < 0 ? `▼ ${Math.abs(entry.trend)}` : '—'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
