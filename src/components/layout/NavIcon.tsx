import type { NavIconName } from '@/types';

/**
 * Résout un nom d'icône (chaîne, sérialisable dans mockData.ts) vers son
 * SVG. Centralise les icônes de navigation utilisées par Sidebar et
 * BottomNav, pour éviter de dupliquer les <svg> dans chaque composant.
 */
export default function NavIcon({ name, className }: { name: NavIconName; className?: string }) {
  const paths: Record<NavIconName, React.ReactNode> = {
    home: (
      <>
        <path d="M3 11l9-7 9 7" />
        <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="1.5" />
        <path d="M3 9.5h18M8 3v4M16 3v4" />
      </>
    ),
    radio: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7.5V12l3 2" />
      </>
    ),
    help: (
      <>
        <rect x="4" y="4" width="16" height="16" rx="2" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </>
    ),
    cards: (
      <>
        <rect x="5" y="7" width="13" height="15" rx="1.5" transform="rotate(-8 11 14)" />
        <rect x="6.5" y="4" width="13" height="15" rx="1.5" />
      </>
    ),
    chart: <path d="M4 20V10M11 20V4M18 20v-7" />,
    trophy: (
      <>
        <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
        <path d="M8 5H5a3 3 0 0 0 3 5M16 5h3a3 3 0 0 1-3 5M12 12v4M9 20h6" />
      </>
    ),
    info: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 11v5M12 8v.01" />
      </>
    ),
  };

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
