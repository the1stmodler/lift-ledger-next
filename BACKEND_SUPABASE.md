# Lift Ledger — Backend Supabase

Backend Supabase du projet Lift Ledger (Championnats d'Europe de
Streetlifting 2026) : schéma de base de données, sécurité, logique métier
et synchronisation temps réel, prêts à être poussés sur un projet
Supabase et branchés au front Next.js.

## ✅ Validé dans cet environnement

Je n'ai pas accès à un vrai projet Supabase distant depuis ce sandbox,
mais j'ai **installé PostgreSQL 16 localement et rejoué chaque migration
contre une vraie base**, avec un harnais de test qui simule le strict
nécessaire du schéma `auth` fourni nativement par Supabase (`auth.users`,
`auth.uid()`, rôles `anon`/`authenticated`, publication `supabase_realtime`).

Concrètement, ont été testés en conditions réelles (pas juste relus) :
- Les 5 migrations s'appliquent dans l'ordre sur une base vierge, sans erreur.
- Le trigger de création de profil fonctionne dès l'inscription.
- **Isolation RLS** : deux faux utilisateurs (Alice/Bob) — Alice voit son
  historique de jetons, Bob n'y a strictement aucun accès (0 ligne).
- **`validate_attempt`** (la fonction la plus critique) : un pronostic
  soumis puis un essai validé Good Lift met bien à jour le Total de
  l'athlète, marque le pronostic correct, et crédite les jetons —
  vérifié à chaque étape.
- **Sécurité** : un simple joueur qui tente d'appeler `validate_attempt`
  reçoit une erreur explicite ("Action réservée au régisseur...").
- **`open_pack`** : échoue proprement si le solde est insuffisant (et
  **la transaction complète s'annule** — le solde n'est pas débité en cas
  d'échec plus loin dans la fonction, confirmant l'atomicité). Cas de
  succès également vérifié : carte attribuée, solde débité du bon montant.
- **Realtime** : la publication `supabase_realtime` contient bien les 3
  tables nécessaires (`categories`, `athlete_entries`, `attempts`).

Deux problèmes ont été trouvés et corrigés grâce à ces tests (pas de la
relecture, de l'exécution réelle) : une ambiguïté de nom de colonne dans
`open_pack`, et une erreur de cast d'énumération dans `seed.sql`.

## Démarrage

```bash
# 1. Installer la CLI Supabase si besoin
npm install -g supabase

# 2. Lier ce dossier à votre projet Supabase (créé sur supabase.com)
supabase link --project-ref <votre-project-ref>

# 3. Pousser les migrations sur le projet distant
supabase db push

# 4. (Optionnel, dev local uniquement) lancer Supabase en local avec Docker
supabase start
supabase db reset   # applique migrations + seed.sql automatiquement
```

Les comptes de démo (régisseur/joueur) ne sont **pas** créés par
`seed.sql` — on ne peut pas insérer directement dans `auth.users` (le mot
de passe doit être hashé par le service Auth de Supabase). Créez un
compte depuis l'app (`supabase.auth.signUp()`) ou le Dashboard, puis
promouvez-le régisseur :

```sql
update public.profiles set role = 'OPERATOR' where pseudo = 'votre_pseudo';
```

## Architecture

| Domaine | Où ça vit |
|---|---|
| Authentification | Supabase Auth (natif) + table `profiles` (migration 2) |
| Autorisation / rôles | Row Level Security (migration 3) |
| Logique métier (validation d'essai, ouverture de pack, jetons) | Fonctions Postgres (migration 4) |
| Synchronisation temps réel du classement | Supabase Realtime (migration 5) |

Toute la logique sensible (validation d'un essai par le régisseur, débit/
crédit de jetons, tirage de cartes) vit dans des fonctions Postgres
`SECURITY DEFINER`, ce qui garantit l'atomicité (tout ou rien) sans code
applicatif supplémentaire à maintenir. La sécurité par rôle (joueur /
régisseur / admin) est appliquée directement par la base de données via
les policies RLS, quel que soit le client qui interroge (web, mobile,
script) — impossible à contourner depuis le front.

## Brancher le front Next.js

1. **Installer les dépendances** (voir `package-additions.json`) :
   `npm install @supabase/ssr @supabase/supabase-js`
2. **Copier `.env.local.example`** → `.env.local`, remplir avec les clés
   du Dashboard Supabase (Project Settings > API).
3. **Copier `src/lib/supabase/` et `src/hooks/`** dans le projet Next.js
   (mêmes chemins).
4. **Dans `app/live/page.tsx`** : utiliser `useLiveLeaderboard(categoryId)`
   pour alimenter `<LiveRankList />`, et brancher le `onAnswer` de
   `PredictPanel` sur `usePredictAttempt().predict()`.
5. **Dans `app/cards/page.tsx`** : brancher `handleBuy()` sur
   `useOpenPack().openPack(packId)`.
6. **Écran Admin Live** (à construire côté front) : liste les essais
   `PENDING` de la catégorie en cours avec deux boutons Good Lift / No
   Lift, appelant `useValidateAttempt().validate()`.

Aucun composant visuel (`AthleteCard`, `PredictPanel`, `LiveRankList`...)
n'a besoin d'être modifié : ils restent purement présentationnels,
pilotés par props.

## Fichiers de ce paquet

```
supabase/
  migrations/
    20260101000001_init_schema.sql      12 tables, enums, index
    20260101000002_profile_trigger.sql  création auto du profil à l'inscription
    20260101000003_rls_policies.sql     sécurité par rôle
    20260101000004_rpc_functions.sql    logique métier (validate_attempt, open_pack...)
    20260101000005_realtime.sql         synchronisation temps réel
  seed.sql                              données de démo (Euros 2026, -66kg)
src/
  lib/supabase/
    client.ts                           client navigateur
    types.ts                            types TS (à régénérer via `supabase gen types`)
  hooks/
    useAuth.ts
    useLiveLeaderboard.ts
    usePredictAttempt.ts
    useValidateAttempt.ts               écran Admin Live
    useOpenPack.ts
.env.local.example
package-additions.json                  dépendances à ajouter au front
```

## Limites connues

- **Roster réduit** dans `seed.sql`, comme convenu — à enrichir plus tard.
- **`types.ts`** est écrit à la main pour que le code compile dès
  maintenant ; à régénérer automatiquement dès que le projet Supabase
  existe (`supabase gen types typescript`), pour rester garanti à jour.
- **Écran Admin Live** : les hooks sont prêts (`useValidateAttempt`), mais
  l'écran React lui-même reste à construire côté front.
- **Catégories "+101kg"** : le schéma actuel ne distingue pas encore les
  catégories à seuil supérieur (ex: +101kg) des catégories classiques
  (ex: -66kg) — signalé dans `useLiveLeaderboard.ts`, à affiner si besoin
  en ajoutant une colonne dédiée sur `categories`.
