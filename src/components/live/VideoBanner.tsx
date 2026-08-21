'use client';

import { useCountdown } from '@/hooks/useCountdown';
import { formatCountdown } from '@/lib/utils';

interface VideoBannerProps {
  eventDate: string;
  isLive: boolean;
}

/** Lecteur vidéo placeholder + badge "EN DIRECT" + compte à rebours avant ouverture. */
export default function VideoBanner({ eventDate, isLive }: VideoBannerProps) {
  const { totalSeconds, mounted } = useCountdown(eventDate);

  return (
    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-l border border-metal-line bg-gradient-to-br from-electric-violet/40 to-void">
      {isLive && (
        <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal-soft px-2.5 py-1 font-mono text-[10px] font-bold uppercase text-signal">
          <span className="h-1.5 w-1.5 animate-pulse-ring rounded-full bg-signal" />
          En direct
        </span>
      )}
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full border border-white/25 bg-black/30 text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-6 w-6">
            <path d="M6 4l14 8-14 8V4Z" />
          </svg>
        </div>
        <div className="text-sm font-bold text-white">
          {isLive ? 'Regarder en direct' : "Vidéo disponible au coup d'envoi"}
        </div>
        {!isLive && (
          <div className="font-mono text-xs text-white/70">
            {mounted ? `Ouverture dans ${formatCountdown(totalSeconds)}` : ''}
          </div>
        )}
      </div>
    </div>
  );
}
