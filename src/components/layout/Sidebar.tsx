'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';
import NavIcon from './NavIcon';

interface SidebarProps {
  gameNav: NavItem[];
  parcoursNav: NavItem[];
  infoNav: NavItem[];
  playerName?: string;
  playerLevel?: number;
  jetonsBalance?: number;
}

/**
 * Sidebar desktop repliable (équivalent `.sidebar` + `#sidebarToggle` du
 * prototype). Aucune donnée en dur : les 3 sections de navigation sont
 * reçues en props (voir app/layout.tsx, alimenté par src/data/mockData.ts).
 * Sur mobile elle est masquée : voir <BottomNav />.
 */
export default function Sidebar({
  gameNav,
  parcoursNav,
  infoNav,
  playerName = 'Julien K.',
  playerLevel = 14,
  jetonsBalance = 1745,
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'sticky top-0 hidden h-screen flex-col overflow-y-auto border-r border-metal-line bg-steel-1 px-4 py-5 transition-[width] duration-200 md:flex',
        collapsed ? 'w-[76px] px-2' : 'w-[264px]',
      )}
    >
      <div className="mb-4 flex items-center justify-end gap-2 border-b border-metal-line pb-4">
        {!collapsed && (
          <Link
            href="/"
            aria-label="Accueil"
            className="flex h-[26px] w-[26px] items-center justify-center rounded-s border border-metal-lineStrong bg-steel-2 text-mute hover:border-electric-line hover:text-electric-bright"
          >
            <NavIcon name="home" className="h-3.5 w-3.5" />
          </Link>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          aria-label="Réduire ou ouvrir le menu"
          className="flex h-[26px] w-[26px] items-center justify-center rounded-s border border-metal-lineStrong bg-steel-2 text-mute hover:text-platinum"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn('h-3.5 w-3.5 transition-transform', collapsed && 'rotate-180')}
          >
            <path d="M15 6l-6 6 6 6" />
          </svg>
        </button>
      </div>

      {!collapsed && (
        <div className="mb-5 rounded-m border border-metal-line bg-steel-2 p-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-electric-bright bg-grad-electric text-sm font-bold text-white">
              {playerName
                .split(' ')
                .map((w) => w[0])
                .join('')}
            </div>
            <div className="min-w-0">
              <div className="truncate text-[13px] font-bold text-platinum">{playerName}</div>
              <div className="font-mono text-[10px] uppercase text-mute">Niveau {playerLevel} &middot; Manager</div>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-s border border-electric-line bg-electric-soft px-2.5 py-2">
            <span className="font-mono text-[10px] uppercase text-mute">Jetons</span>
            <span className="font-mono text-sm font-bold text-electric-bright">
              {jetonsBalance.toLocaleString('fr-FR')}
            </span>
          </div>
        </div>
      )}

      <NavSection title="Game" items={gameNav} pathname={pathname} collapsed={collapsed} />
      <NavSection title="Parcours" items={parcoursNav} pathname={pathname} collapsed={collapsed} />

      <div className="mt-auto pt-6">
        <NavSection title="Infos" items={infoNav} pathname={pathname} collapsed={collapsed} />
      </div>
    </aside>
  );
}

function NavSection({
  title,
  items,
  pathname,
  collapsed,
}: {
  title: string;
  items: NavItem[];
  pathname: string;
  collapsed: boolean;
}) {
  return (
    <div className="mb-2">
      {!collapsed && (
        <div className="mb-2 px-2 font-mono text-[10px] uppercase tracking-widest text-mute-dim">{title}</div>
      )}
      <nav className="flex flex-col gap-0.5">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'group flex items-center gap-3 rounded-s px-2.5 py-2.5 text-[13px] font-medium transition-colors',
                active ? 'bg-electric-soft text-electric-bright' : 'text-mute hover:bg-steel-2 hover:text-platinum',
                collapsed && 'justify-center',
              )}
            >
              <span className="relative h-[18px] w-[18px] shrink-0">
                <NavIcon name={item.icon} className="h-full w-full" />
                {item.badge === 'live' && (
                  <span className="absolute -right-1 -top-1 h-2 w-2 animate-pulse-ring rounded-full bg-signal" />
                )}
              </span>
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
