# Lift Ledger — Web (Next.js / TypeScript / Tailwind)

Conversion du prototype HTML/CSS/JS monolithique vers une architecture
Next.js 14 (App Router) component-driven, avec typage TypeScript strict et
séparation complète des données.

## ✅ Validé dans cet environnement

- `npm install` + `npm run build` : **compile sans erreur**, TypeScript
  strict + lint OK, sur l'ensemble des 7 fichiers de types, du fichier de
  données centralisé, et de tous les composants refactorisés.
- Rendu testé en conditions réelles (serveur de prod local + navigateur) :
  aucune erreur console, aucune erreur d'hydratation SSR, interactions
  `useState` fonctionnelles au clic — y compris le **filtre Hommes/Femmes**
  de la collection (testé : bascule correctement l'affichage des cartes).

## Démarrage

```bash
npm install
npm run dev
# http://localhost:3000
```

## Architecture

```
src/
├── types/                      Typage strict, un fichier par domaine
│   ├── athlete.ts              AthleteCardData, Movement, CardTier, Gender
│   ├── category.ts             Category, CategoryStatus
│   ├── live.ts                 LiveAttempt, LeaderboardRow, AttemptGuess
│   ├── shop.ts                 PackOffer, PackOdds
│   ├── arena.ts                ArenaInfo, ArenaKey
│   ├── navigation.ts           NavItem, NavIconName
│   ├── content.ts               HeroContent, SponsorItem
│   └── index.ts                 Barrel — import depuis '@/types' uniquement
│
├── data/
│   └── mockData.ts             TOUTES les données de l'app, typées contre
│                                src/types/. Aucun composant ne contient de
│                                donnée en dur — tout transite par des props.
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx         Reçoit gameNav/parcoursNav/infoNav en props
│   │   ├── Topbar.tsx
│   │   ├── ArenaBar.tsx        Reçoit arenas en props + modale useState
│   │   ├── BottomNav.tsx       Reçoit items en props
│   │   └── NavIcon.tsx         Résolveur d'icônes (NavIconName -> SVG)
│   ├── cards/
│   │   ├── AthleteCard.tsx     Carte holographique (prop athlete typée)
│   │   └── PackShopCard.tsx    Carte boutique (prop pack: PackOffer typée)
│   ├── home/
│   │   ├── HeroBanner.tsx      Reçoit content: HeroContent en props
│   │   └── SponsorTicker.tsx   Reçoit sponsors en props
│   └── live/
│       ├── PredictPanel.tsx    Reçoit attempt: LiveAttempt en props
│       └── LiveRankList.tsx    Classement animé (technique FLIP)
│
├── hooks/
│   └── useCountdown.ts         Minuteur SSR-safe réutilisable
│
├── lib/
│   └── utils.ts                cn(), formatCountdown(), initialsFromName()
│
└── app/
    ├── layout.tsx               Importe mockData, distribue aux composants
    ├── page.tsx                 Accueil
    ├── cards/page.tsx           Boutique + collection avec FILTRE useState
    └── live/page.tsx            Live Game (PredictPanel + LiveRankList)
```

## Pattern de séparation des données (important pour l'équipe)

**Aucun composant `.tsx` ne contient de tableau de données en dur.** Le flux
est toujours : `src/data/mockData.ts` (typé) → page (`app/**/page.tsx`) qui
importe et transmet en props → composant présentationnel qui affiche.

En production, il suffit de remplacer les imports de `mockData.ts` dans les
pages par de vrais appels `fetch`/`useSWR` vers l'API (voir le backend
NestJS livré précédemment) — **aucun composant n'a besoin d'être modifié**,
puisqu'ils ne connaissent que leurs props typées.

## Pages restant à créer (hors périmètre de cette livraison)

`pregame/`, `quiz/`, `analyses/`, `results/`, `rules/`, `athlete/[id]/` — à
construire en suivant exactement le même pattern (types dans `src/types/`,
données dans `mockData.ts`, composants purement présentationnels).
