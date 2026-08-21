import Link from 'next/link';

/**
 * Barre supérieure sticky (équivalent `.topbar` du prototype). Le solde de
 * jetons est reçu en prop pour rester la source de vérité côté état global
 * (contexte / store) plutôt que dupliqué localement.
 */
export default function Topbar({ jetonsBalance = 1745 }: { jetonsBalance?: number }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between overflow-hidden border-b border-metal-line bg-glass px-8 backdrop-blur-md">
      <Link href="/" className="flex items-center gap-2.5">
        <span className="flex h-7 w-7 items-center justify-center rounded-s bg-platinum">
          <span className="h-3 w-3 rounded-[2px] bg-void" />
        </span>
        <span className="font-display text-base uppercase tracking-wide text-platinum">
          Lift <span className="text-electric-bright">Ledger</span>
        </span>
      </Link>

      <div className="flex items-center gap-2.5">
        <UtilityButton ariaLabel="Rechercher">
          <IconSearch />
        </UtilityButton>
        <UtilityButton ariaLabel="Notifications">
          <IconBell />
        </UtilityButton>

        <div className="flex items-center gap-1.5 rounded-s border border-electric-line bg-electric-soft px-3 py-2 font-mono text-sm font-bold text-electric-bright">
          <IconCoin className="h-3.5 w-3.5" />
          {jetonsBalance.toLocaleString('fr-FR')} JT
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-steel-2 text-xs font-bold text-platinum">
          JK
        </div>
      </div>
    </header>
  );
}

function UtilityButton({ children, ariaLabel }: { children: React.ReactNode; ariaLabel: string }) {
  return (
    <button
      aria-label={ariaLabel}
      className="flex h-9 w-9 items-center justify-center rounded-full border border-metal-line bg-steel-2 text-mute transition-colors hover:border-electric-line hover:text-electric-bright"
    >
      {children}
    </button>
  );
}

function IconSearch() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}
function IconBell() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-4 w-4">
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
function IconCoin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v9M9 9.5h4a1.8 1.8 0 0 1 0 3.6H9.5a1.8 1.8 0 0 0 0 3.6H15" />
    </svg>
  );
}
