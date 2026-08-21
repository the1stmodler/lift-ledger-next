import { initialsFromName } from '@/lib/utils';
import type { AthleteProfile, Movement } from '@/types';

const MOVE_LABEL: Record<Movement, string> = { MU: 'Muscle-up', PU: 'Pull-up', DIPS: 'Dips', SQ: 'Squat' };

/** Fiche détaillée d'un athlète (page Mes Analyses, mode "Parcourir un athlète"). */
export default function AthleteProfileCard({ athlete }: { athlete: AthleteProfile }) {
  return (
    <div className="rounded-l border border-metal-line bg-steel-1 p-6">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-electric-bright bg-grad-electric font-display text-xl text-white">
          {initialsFromName(athlete.name)}
        </div>
        <div>
          <div className="font-display text-2xl uppercase text-platinum">{athlete.name}</div>
          <div className="font-mono text-xs text-mute">
            {athlete.country} &middot; {athlete.age} ans &middot; {athlete.weightLabel}
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="font-mono text-2xl font-bold text-electric-bright">{athlete.risScore}</div>
          <div className="font-mono text-[9px] uppercase text-mute">RIS</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Stat label="Total actuel" value={`${athlete.total} kg`} />
        <Stat label="Meilleur total" value={`${athlete.bestTotal} kg`} />
        <Stat label="Compétitions" value={String(athlete.competitionsCount)} />
        <Stat label="Forme (30j)" value={`${athlete.form > 0 ? '+' : ''}${athlete.form}%`} accent={athlete.form >= 0} />
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {(Object.keys(MOVE_LABEL) as Movement[]).map((mv) => (
          <div key={mv} className="rounded-s border border-metal-line bg-steel-2 p-3 text-center">
            <div className="font-mono text-[9px] uppercase text-mute">{MOVE_LABEL[mv]}</div>
            <div className="mt-1 font-mono text-base font-bold text-platinum">{athlete.stats[mv]} kg</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="rounded-s border border-metal-line bg-steel-2 p-3 text-center">
      <div className="font-mono text-[9px] uppercase text-mute">{label}</div>
      <div className={`mt-1 font-mono text-base font-bold ${accent === undefined ? 'text-platinum' : accent ? 'text-good' : 'text-signal'}`}>
        {value}
      </div>
    </div>
  );
}
