import type { Reward } from '@/types';

/** Carte de récompense/palmarès. */
export default function RewardCard({ reward }: { reward: Reward }) {
  return (
    <div className="flex items-center gap-3 rounded-m border border-metal-line bg-steel-1 p-3.5">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-electric-line bg-electric-soft text-electric-bright">
        🏅
      </div>
      <div className="min-w-0">
        <div className="truncate text-xs font-bold text-platinum">{reward.title}</div>
        <div className="truncate font-mono text-[9.5px] text-mute">{reward.subtitle}</div>
      </div>
    </div>
  );
}
