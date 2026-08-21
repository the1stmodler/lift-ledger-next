# Lift Ledger — Web (Next.js / TypeScript / Tailwind)

Réplique complète du prototype HTML/CSS/JS d'origine en architecture
Next.js 14 (App Router), typée strictement, avec toutes les données
centralisées et séparées des composants.

## ✅ Validé dans cet environnement

- `npm install` + `npm run build` : compile sans erreur sur les 9 pages.
- Balayage complet des 8 pages en conditions réelles (serveur de prod local
  + navigateur) : **aucune erreur console**.
- Live Game testé mécanique par mécanique, en cliquant réellement dans le
  navigateur jusqu'au bout de la file d'événements :
  sas d'attente → inscription → Good/No Lift → **The Final Attempt**
  (déclenché après l'essai 2) → **Perfect Score** (carte dorée) →
  **podium flash** de fin de catégorie, avec l'animation "+X JT" vérifiée
  visuellement à chaque bonne réponse.
- Onboarding testé : ouverture à la première visite sur les 3 pages de jeu,
  navigation Retour/Suivant, mémorisation par page confirmée (ne réapparaît
  pas après fermeture, indépendamment d'une page à l'autre).
- Animation d'ouverture de pack testée : révélation des cartes une par une,
  fermeture propre de la modale.
- **Lien mort corrigé** : la grille de cartes cliquables de l'accueil (qui
  pointait vers une fiche `/athlete/[id]` inexistante) a été retirée et
  remplacée par un bandeau promo + un encart "Niveaux de rareté".

## Démarrage

```bash
npm install
npm run dev
```

## Pages

| Route | Contenu |
|---|---|
| `/` | Héro, sponsors, bandeau promo, niveaux de rareté |
| `/pregame` | Sélection de 3 cartes par division + onboarding |
| `/live` | Sas d'attente, vidéo, timeline, Good/No Lift, Final Attempt, Perfect Score, classement animé, podium flash, onboarding |
| `/quiz` | 3 formats de quiz, questions interactives, onboarding |
| `/cards` | Boutique avec animation d'ouverture de pack + collection filtrable |
| `/analyses` | Fiche athlète + comparateur |
| `/results` | Classement général + palmarès |
| `/rules` | Règles du jeu |

## Architecture

```
src/
├── types/            Typage strict, un fichier par domaine
│   └── onboarding.ts  (nouveau) OnboardingTour, OnboardingStep
├── data/
│   └── mockData.ts   Toutes les données, y compris désormais :
│                       rarityTiers, promoBanner, flashPodiumEntries,
│                       onboardingTours
├── components/
│   ├── home/
│   │   ├── RarityTiersPanel.tsx   (nouveau) remplace la grille défectueuse
│   │   └── PromoBannerCard.tsx    (nouveau)
│   ├── live/
│   │   ├── CategoryWaitingRoom.tsx  (nouveau) sas d'attente + inscription
│   │   ├── FinalAttemptCard.tsx     (nouveau) mini-jeu stratégie 3e essai
│   │   ├── PerfectScoreCard.tsx     (nouveau) mini-jeu sans-faute
│   │   ├── JetonGainToast.tsx       (nouveau) animation "+X JT"
│   │   └── FlashPodiumModal.tsx     (nouveau) podium fin de catégorie
│   ├── cards/
│   │   └── PackOpeningModal.tsx    (nouveau) révélation animée des cartes
│   └── onboarding/
│       └── OnboardingModal.tsx     (nouveau) tutoriel générique réutilisable
└── app/
    ├── page.tsx        mis à jour (retrait du lien mort)
    ├── live/page.tsx   réécrit (orchestration de la file d'événements)
    ├── cards/page.tsx  mis à jour (tirage + animation d'ouverture)
    ├── pregame/page.tsx  + onboarding
    └── quiz/page.tsx     + onboarding
```

## Limites connues

- **Roster réduit** : les données athlètes dans `mockData.ts` sont
  volontairement limitées (quelques athlètes de démonstration) — le roster
  complet sera intégré plus tard via la base de données réelle, comme
  convenu. La file d'événements du Live Game (`buildDemoQueue` dans
  `app/live/page.tsx`) est un script de démonstration à remplacer par la
  synchronisation temps réel une fois le backend branché (voir
  `BACKEND_SUPABASE.md`).
- **Quiz Game** : seul le format "The Streetliftings Quiz" a des questions
  complètes ; les deux autres formats affichent un message d'attente clair.

## Backend

Le backend (base de données, sécurité, logique métier, temps réel) est
documenté séparément dans **`BACKEND_SUPABASE.md`** à la racine du projet,
avec les migrations SQL dans `supabase/` et les hooks d'intégration dans
`src/hooks/` (`useAuth`, `useLiveLeaderboard`, `usePredictAttempt`,
`useValidateAttempt`, `useOpenPack`).
