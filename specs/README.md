# Jade — feuille de route spec-kit

Reconstruction du prototype `prototype/index.html` (HTML/JS vanilla + localStorage) en
**Next.js (React) + Tailwind + Supabase**. Brief d'origine : [`docs/PROMPT_REBUILD_JADE.md`](../docs/PROMPT_REBUILD_JADE.md).
Principes non négociables : [`.specify/memory/constitution.md`](../.specify/memory/constitution.md).

## Les 11 specs

| # | Spec | Sections du brief | Contenu | Priorité globale |
|---|---|---|---|---|
| 001 | [Socle applicatif](./001-socle-application/spec.md) | 2.1, 2.10 | Projet, routes, header/footer, thème, i18n, sons, intro, 404, SEO, PWA — **+ décisions d'architecture** ([research](./001-socle-application/research.md)) | Prérequis |
| 002 | [Authentification et comptes](./002-auth-comptes/spec.md) | 2.2, §4.2 | Supabase Auth, âge, profil auto, **rôles serveur** (`admin_roles`, `has_role`) | **1 — Auth** |
| 003 | [Profil et personnalisation](./003-profil-personnalisation/spec.md) | 2.2, 2.8 | 9 onglets, avatar/bannière (zoom/X/Y), vitrine, profil public, **mini-profil**, RGPD | **2 — Profil/XP** |
| 004 | [Progression : XP, niveaux, rangs](./004-progression-xp-rangs/spec.md) | 2.3, 2.7 | Moteur `award_xp` dédupliqué, courbe, rangs, badges, pass, 5 tests d'aim, import CSV | **2 — Profil/XP** |
| 005 | [Jade Coins](./005-jade-coins/spec.md) | 2.4 | Journal + solde, barème, crochet sur l'XP, récompense de défi | **3 — Coins/Shop** |
| 006 | [Shop, caisses, Arcade](./006-shop-caisses-arcade/spec.md) | 2.5 | Tirage serveur, roulette, inventaire, Arcade + **garde-fous légaux** | **3 — Coins/Shop** |
| 007 | [Communauté et défis](./007-communaute-defis/spec.md) | 2.8 | Forum, GG, signalements, défi hebdo, classement temps réel, clôture | 3 bis (voir note) |
| 008 | [Administration](./008-administration/spec.md) | 2.6 | Panel par rôles, XP/coins manuels, sanctions + historique, modération, Shop, journal | **4 — Admin** |
| 009 | [Contenu d'entraînement](./009-contenu-entrainement/spec.md) | 2.7 | Routines, parcours guidé, optimisation, convertisseur, accueil | **5 — Contenu** |
| 010 | [Pages éditoriales](./010-pages-editoriales/spec.md) | 2.9 | Sécurité (verbatim), Légal, cookies, Formules, Actus, Application | **5 — Contenu** (sauf Légal, voir note) |
| 011 | [Secrets et easter eggs](./011-secrets-easter-eggs/spec.md) | 2.10 | Matière noire, Sakura, validation serveur | 6 — Finitions |

Chaque dossier contient `spec.md` (user stories priorisées, exigences, critères de succès),
`plan.md` (Constitution Check, structure), `data-model.md` / `contracts/` quand il y a des données,
`tasks.md` (tâches `T###` avec `[P]` parallélisable et `[USn]`), `checklists/requirements.md`.

## Ordre d'exécution

```text
M0  001 Phases 1-2 + US1/US2 ─────────────── socle (bloquant)
M1  002 (P1)  ∥  010/US2 Légal+cookies ───── comptes réels + textes légaux avant ouverture
M2  003 (P1) → 004 (P1 puis P2) ──────────── profil, XP, tests, séances, rangs
M3  005 (P1) → 006 US1-US3 ───────────────── coins, caisses, inventaire   (006/US4 Arcade : derrière interrupteur)
M4  007 (P1) ─────────────────────────────── forum + défis (nécessaire à la modération et aux récompenses de défi)
M5  008 US1-US3 puis US4-US6 ─────────────── panel admin
M6  009, 010 (reste), 003/004 P2-P3 ──────── contenu éditorial et d'entraînement
M7  011, 006/US4 activée après revue juridique, polish ─ finitions
```

Notes sur l'ordre demandé (auth → profil/XP → coins/shop → admin → contenu) :

- **007 Communauté** n'était pas dans la liste de priorités : elle est placée avant l'admin car
  la modération forum (008/US3) et la récompense du défi (005/US3) en dépendent. L'admin
  « utilisateurs/rôles/XP/coins » (008/US1-US2) peut démarrer dès la fin de M3 en parallèle.
- **010/US2 Légal et cookies** doit être en ligne avant d'ouvrir les inscriptions au public
  (politique de confidentialité, CGU acceptées à l'inscription) : c'est un portage de texte,
  faisable en parallèle de M1.

## Correspondance avec les tables demandées dans le brief

| Brief | Tables retenues | Spec |
|---|---|---|
| `users` | `profiles` (+ `profiles_private` pour la date de naissance) | 002, 003 |
| `admin_roles` | `admin_roles` (+ fonctions `has_role`, `is_admin`, `is_staff`, `is_active_user`, `is_adult`) | 002 |
| `xp_events` | `xp_events` (+ `training_sessions`, `test_records`, `test_attempts`) | 004 |
| `coins_transactions` | `coins_transactions` (+ `economy_settings`) | 005 |
| `crates_catalog`, `inventory_items` | `crates_catalog`, `crate_items`, `cosmetic_items`, `inventory_items`, `crate_openings`, `arcade_plays`, `arcade_exclusions` | 006 |
| `forum_posts`, `forum_reactions` | idem + `forum_reports`, `forum_replies` | 007 |
| `challenges`, `challenge_leaderboard` | idem (Realtime sur le classement) | 007 |
| `admin_logs` | `admin_logs` (immuable) + `user_sanctions` | 008 |
| `security_reports` | `security_reports` (+ `app_notify_signups`) | 010 |
| — | `support_tickets`, `routines`, `routine_blocks`, `routine_completions`, `training_plans`, `optimization_checks`, `secret_challenges` | 003, 009, 011 |

Hooks React demandés : `useXP()`, `useRank()`, `useBadges()` (004), `useCoins()`,
`useCoinsBalance()` (005), `useInventory()`, `useCrates()`, `useOpenCrate()`, `useArcade()` (006),
`useProfile()`, `useMiniProfile()` (003), `useSession()`, `useRoles()` (002), `useForumPosts()`,
`useChallengeLeaderboard()` (007)…

## Décisions à prendre (marqueurs `[NEEDS CLARIFICATION]`)

1. **003 / FR-006 — Titre affiché** : libre pour tous (prototype), réservé au niveau 50 (Pass), ou
   uniquement les titres obtenus (caisses/secrets) ?
2. **005 / US4 — Bonus Premium** : un abonnement payant qui donne des coins ou une caisse
   aléatoire ressemble à une loot box payante. Recommandation : le remplacer par un cosmétique
   mensuel exclusif **non aléatoire**.

Hypothèses prises par défaut, à valider (modifiables sans refonte) :

- âge minimum 15 ans (politique de confidentialité du prototype), Arcade réservée aux 18 ans et plus ;
- limites : 5 caisses et 15 parties d'Arcade par jour, 20 séances rémunérées en coins par jour ;
- barème du défi : 300 / 250 / 200 / 150 / 100 coins selon le classement ;
- Next.js plutôt que Vite (SEO des profils publics et des fiches Sécurité) — voir 001/research D1.

Pour trancher : `/speckit-clarify` dans le dossier concerné, puis mettre à jour `spec.md` et `tasks.md`.

## Constats sur le prototype

1. Le code Jade Coins / caisses / Arcade est dans une balise `<script type="application/ld+json">`
   (lignes 26-118) : **il ne s'exécute pas**. Dans le prototype, le Shop s'affiche mais ne fonctionne pas.
2. La Roue a des segments équiprobables `[0, .5, 1, 1, 2, 3, 5, 10]` → espérance **×2,81** la mise :
   coins infinis. Rééquilibrée à ×0,915 dans 006.
3. Tout est côté client (XP, coins, rôles, hash admin) : réécrit côté serveur (constitution I et II).
4. Les identifiants admin figuraient en clair dans le fichier d'instructions livré avec le prototype
   (non versionné ici) : les considérer comme compromis.

## Utiliser spec-kit sur ce dépôt

- Skills installés dans `.claude/skills/` : `/speckit-clarify`, `/speckit-plan`, `/speckit-tasks`,
  `/speckit-analyze`, `/speckit-implement`, `/speckit-taskstoissues`.
- Pour travailler sur une spec : `export SPECIFY_FEATURE_DIRECTORY=specs/00X-...` (ou mettre à jour
  `.specify/feature.json`), puis `/speckit-analyze` (cohérence) et `/speckit-implement`.
