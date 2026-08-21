'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import type { NavItem } from '@/types';
import NavIcon from './NavIcon';

interface BottomNavProps {
  items: NavItem[];
}

/** Barre de navigation fixe en bas d'écran, visible uniquement sur mobile (< md). */
export default function BottomNav({ items }: BottomNavProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex h-16 items-stretch justify-around border-t border-metal-line bg-glass-strong backdrop-blur-md md:hidden">
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-mono',
              active ? 'text-electric-bright' : 'text-mute',
            )}
          >
            <NavIcon name={item.icon} className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
