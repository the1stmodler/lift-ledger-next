'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import type { ArenaInfo, ArenaKey } from '@/types';

interface ArenaBarProps {
  arenas: ArenaInfo[];
}

/**
 * Sélecteur d'arène (sport) affiché en haut de chaque page. Cliquer sur une
 * arène verrouillée ouvre une bulle d'information + vote au lieu de naviguer.
 * `arenas` est reçu en props (voir app/layout.tsx / src/data/mockData.ts) :
 * ce composant ne connaît aucun sport en dur.
 */
export default function ArenaBar({ arenas }: ArenaBarProps) {
  const defaultActive = arenas.find((a) => a.unlocked)?.key ?? arenas[0]?.key;
  const [active, setActive] = useState<ArenaKey | undefined>(defaultActive);
  const [lockedModal, setLockedModal] = useState<ArenaInfo | null>(null);

  function handleSelect(arena: ArenaInfo) {
    if (!arena.unlocked) {
      setLockedModal(arena);
      return;
    }
    setActive(arena.key);
  }

  const activeArena = arenas.find((a) => a.key === active);

  return (
    <div className="px-8 pt-4">
      <div className="flex gap-6 overflow-x-auto">
        {arenas.map((arena) => (
          <button
            key={arena.key}
            onClick={() => handleSelect(arena)}
            className="flex shrink-0 flex-col items-center gap-1.5"
          >
            <span
              className={cn(
                'relative flex h-14 w-14 items-center justify-center rounded-full border-2 transition-colors',
                arena.key === active
                  ? 'border-electric-bright text-electric-bright shadow-[0_0_16px_-3px_rgba(46,124,246,0.7)]'
                  : 'border-metal-lineStrong text-mute grayscale',
              )}
            >
              <ArenaIcon arena={arena.key} className="h-6 w-6" />
              {!arena.unlocked && (
                <span className="absolute -bottom-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full border border-void bg-steel-3 text-mute">
                  <IconLock className="h-2.5 w-2.5" />
                </span>
              )}
            </span>
            <span className={cn('font-mono text-[10.5px]', arena.key === active ? 'font-bold text-platinum' : 'text-mute')}>
              {arena.name}
            </span>
          </button>
        ))}
      </div>

      <div className="mt-3.5 border-t border-metal-line pt-3 font-mono text-[11px] text-mute">
        Vous êtes dans l&apos;<b className="text-electric-bright">Arène {activeArena?.name}</b> &middot; 1
        <sup>ère</sup> compétition&nbsp;: Championnats d&apos;Europe 2026
      </div>

      {lockedModal && <LockedArenaModal arena={lockedModal} onClose={() => setLockedModal(null)} />}
    </div>
  );
}

function LockedArenaModal({ arena, onClose }: { arena: ArenaInfo; onClose: () => void }) {
  const [voted, setVoted] = useState(false);

  return (
    <div className="fixed inset-0 z-[210] flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-[min(92vw,380px)] rounded-xl border border-metal-lineStrong bg-steel-1 p-7 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full border-2 border-metal-lineStrong bg-steel-2 text-mute grayscale">
          <ArenaIcon arena={arena.key} className="h-9 w-9" />
        </div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-mute">Arène verrouillée</div>
        <div className="mb-3 mt-1 font-display text-3xl uppercase text-platinum">{arena.name}</div>
        <p className="mb-6 text-sm text-mute">
          Cette arène n&apos;est pas encore ouverte sur Lift Ledger. Votez pour faire remonter la demande et être
          prévenu dès son ouverture.
        </p>
        <button
          disabled={voted}
          onClick={() => setVoted(true)}
          className="w-full rounded-full bg-grad-electric px-6 py-3 text-sm font-bold text-white disabled:opacity-60"
        >
          {voted ? 'Merci, votre vote a été enregistré !' : `Je veux voir le ${arena.name} sur Lift Ledger`}
        </button>
        <button onClick={onClose} className="mt-4 font-mono text-xs text-mute hover:text-platinum">
          Retour à l&apos;Arène Streetlifting
        </button>
      </div>
    </div>
  );
}

function ArenaIcon({ arena, className }: { arena: ArenaKey; className?: string }) {
  if (arena === 'streetlifting') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
        <path d="M5 6h14M7 6v13M17 6v13" />
        <circle cx="12" cy="15" r="2" />
      </svg>
    );
  }
  if (arena === 'powerlifting') {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
        <path d="M4 12h16M6 8v8M18 8v8M2 10v4M22 10v4" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className}>
      <g transform="rotate(-35 12 12)">
        <path d="M4 12h16M6 8v8M18 8v8M2 10v4M22 10v4" />
      </g>
    </svg>
  );
}

function IconLock(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a4 4 0 0 0-4 4v3H7a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1h-1V6a4 4 0 0 0-4-4Zm0 2a2 2 0 0 1 2 2v3h-4V6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}
