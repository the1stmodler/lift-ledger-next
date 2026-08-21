import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Topbar from '@/components/layout/Topbar';
import ArenaBar from '@/components/layout/ArenaBar';
import BottomNav from '@/components/layout/BottomNav';
import { sidebarGameNav, sidebarParcoursNav, sidebarInfoNav, bottomNavItems, arenas } from '@/data/mockData';

export const metadata: Metadata = {
  title: 'Lift Ledger',
  description: "Fantasy game & cartes de streetlifting — Championnats d'Europe 2026",
};

/**
 * Shell applicatif partagé par toutes les pages (équivalent `.app` /
 * `.main-col` du prototype). Toutes les données de navigation/arènes sont
 * importées depuis src/data/mockData.ts puis distribuées en props typées
 * aux composants de layout — aucun composant enfant ne contient de donnée
 * en dur.
 */
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-void text-platinum">
        <div className="grid min-h-screen md:grid-cols-[264px_1fr]">
          <Sidebar gameNav={sidebarGameNav} parcoursNav={sidebarParcoursNav} infoNav={sidebarInfoNav} />
          <div className="relative min-w-0">
            <Topbar />
            <ArenaBar arenas={arenas} />
            <main className="px-4 pb-24 pt-4 md:px-8 md:pb-10">{children}</main>
          </div>
        </div>
        <BottomNav items={bottomNavItems} />
      </body>
    </html>
  );
}
