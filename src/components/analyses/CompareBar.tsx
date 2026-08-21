import type { AthleteProfile } from '@/types';

const BAR_COLORS = ['bg-electric-bright', 'bg-electric-violet', 'bg-good', 'bg-move-mu'];

interface CompareBarProps {
  label: string;
  athletes: AthleteProfile[];
  getValue: (athlete: AthleteProfile) => number;
  formatValue: (value: number) => string;
}

/** Une ligne de comparaison (ex: "RIS") avec une barre par athlète sélectionné. */
export default function CompareBar({ label, athletes, getValue, formatValue }: CompareBarProps) {
  const max = Math.max(...athletes.map(getValue), 1);

  return (
    <div className="mb-5">
      <div className="mb-2 font-mono text-[11px] uppercase tracking-widest text-mute">{label}</div>
      <div className="flex flex-col gap-1.5">
        {athletes.map((athlete, i) => {
          const value = getValue(athlete);
          return (
            <div key={athlete.id} className="flex items-center gap-2.5">
              <span className="w-24 shrink-0 truncate text-xs text-mute">{athlete.name}</span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-steel-3">
                <div
                  className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]}`}
                  style={{ width: `${Math.max(6, (value / max) * 100)}%` }}
                />
              </div>
              <span className="w-16 shrink-0 text-right font-mono text-xs text-platinum">{formatValue(value)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
