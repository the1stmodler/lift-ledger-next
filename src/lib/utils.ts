import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Fusionne des classes Tailwind conditionnelles sans collision (pattern shadcn/ui). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formate un nombre de secondes en "JJ HH:MM:SS", identique à l'utilitaire
 * `formatCountdown` du prototype (bannière héro, sas d'attente Live Game).
 */
export function formatCountdown(totalSeconds: number): string {
  if (totalSeconds <= 0) return '';
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(days)}j ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** Secondes restantes jusqu'à une date ISO donnée (jamais négatif). */
export function secondsUntil(isoDate: string): number {
  return Math.max(0, Math.floor((new Date(isoDate).getTime() - Date.now()) / 1000));
}

/** Initiales à partir d'un nom affiché ("C. Brau" -> "CB"). */
export function initialsFromName(name: string): string {
  return name
    .split(' ')
    .map((w) => w.replace('.', '')[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
