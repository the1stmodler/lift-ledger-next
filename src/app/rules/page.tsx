const SECTIONS = [
  {
    title: 'Pré-Game',
    items: [
      { title: 'Choisissez vos cartes', desc: 'Avant chaque compétition, sélectionnez exactement 3 cartes de votre collection pour chacune des divisions en jeu.' },
      { title: 'Deux décomptes à surveiller', desc: "Un premier décompte indique quand la division s'ouvre à la sélection. Un second indique la clôture, au début effectif de la compétition." },
    ],
  },
  {
    title: 'Live Game',
    items: [
      { title: 'Catégories déverrouillées en direct', desc: 'Chacune des 12 catégories de poids se débloque automatiquement à son horaire de passage.' },
      { title: 'Pronostiquez en direct', desc: 'Répondez à la question du moment (Good Lift / No Lift) avant la fin du chrono pour gagner des jetons.' },
    ],
  },
  {
    title: 'Cartes & Packs',
    items: [
      { title: 'Ouvrez des packs', desc: 'Dépensez vos jetons dans la boutique pour ouvrir des packs et agrandir votre collection.' },
      { title: 'Rareté des cartes', desc: 'Chaque carte a un palier (Bronze, Argent, Élite) qui influence ses statistiques visuelles.' },
    ],
  },
];

/** Page statique "Règles du jeu" — aucun état React nécessaire. */
export default function RulesPage() {
  return (
    <div className="flex max-w-2xl flex-col gap-8">
      <div>
        <div className="font-mono text-[11px] uppercase tracking-widest text-mute">Infos</div>
        <h1 className="font-display text-2xl uppercase text-platinum">Règles du jeu</h1>
        <p className="mt-1 text-sm text-mute">
          Comment fonctionnent le Pré-Game, la Live Game, vos cartes et vos jetons.
        </p>
      </div>

      {SECTIONS.map((section) => (
        <div key={section.title}>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-widest text-electric-bright">{section.title}</div>
          <div className="flex flex-col gap-4">
            {section.items.map((item) => (
              <div key={item.title} className="flex gap-3">
                <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-electric-bright" />
                <div>
                  <div className="text-sm font-bold text-platinum">{item.title}</div>
                  <p className="mt-0.5 text-sm text-mute">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
