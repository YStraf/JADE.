<!--
Sync Impact Report
- Version change: template → 1.0.0 (ratification initiale)
- Principes ajoutés : I à VIII (tous nouveaux)
- Sections ajoutées : Contraintes techniques, Flux de développement & portes qualité, Gouvernance
- Templates : plan-template.md ✅ (la « Constitution Check » se base sur les principes ci-dessous),
  spec-template.md ✅ (aucun changement requis), tasks-template.md ✅ (tests obligatoires pour
  l'économie et la RLS, cf. principe II)
- TODO différés : aucun
-->

# Constitution du projet Jade

Jade est un site d'entraînement à la visée (aim training) pour CS2 et Valorant, reconstruit
en React + Tailwind + Supabase à partir d'un prototype HTML/localStorage (`prototype/index.html`).

## Principes fondamentaux

### I. Le serveur fait foi (NON NÉGOCIABLE)

Toute valeur qui a un sens compétitif ou économique — XP, niveau, rang, Jade Coins,
inventaire, résultat d'une caisse ou d'un jeu d'arcade, record de test, classement de défi,
rôle — est **calculée et écrite côté serveur** (fonctions Postgres `SECURITY DEFINER`,
triggers ou Edge Functions). Le client n'écrit jamais directement un solde, un total d'XP,
un rôle ou un objet d'inventaire.

- Les tirages aléatoires (caisses, arcade) utilisent l'aléa du serveur (`gen_random_bytes`),
  jamais `Math.random()` côté navigateur. Le client ne fait qu'**animer** un résultat déjà décidé.
- Chaque attribution (XP, coins) passe par un journal append-only (`xp_events`,
  `coins_transactions`) avec une **clé de déduplication unique** ; le solde est dérivé de ce
  journal.
- Justification : le prototype stocke tout dans `localStorage`, n'importe quel joueur peut
  s'attribuer n'importe quoi depuis la console.

### II. Sécurité par Row Level Security, refus par défaut (NON NÉGOCIABLE)

- RLS activée sur **toutes** les tables du schéma `public`, sans exception. Aucune table n'est
  accessible sans policy explicite.
- Un utilisateur ne lit/modifie que ses propres données privées ; les données publiques
  passent par des vues ou policies dédiées qui respectent les réglages de visibilité.
- Les droits élevés (support, modérateur, administrateur) sont portés par la table
  `admin_roles` et vérifiés par des fonctions `has_role()` / `is_admin()` utilisées dans les
  policies. **Aucun secret, hash ou identifiant d'administration dans le code client.**
- Chaque policy RLS et chaque RPC d'économie a des tests pgTAP (cas autorisé + cas refusé).
- La clé `service_role` n'existe que dans les Edge Functions / l'environnement serveur.

### III. Parité avec le prototype

Le prototype (`prototype/index.html`) est la **source de vérité** pour les interactions, les
animations, les textes et la micro-copy française. Une fonctionnalité reconstruite reprend
ses libellés, ses valeurs (barèmes XP, rangs, paliers, coûts) et son comportement, sauf
écart **documenté** dans la spec concernée (section « Écarts assumés vis-à-vis du prototype »).
Le contenu éditorial (fiches Sécurité, remèdes, textes légaux) est repris **tel quel**.

### IV. Divertissement responsable

Les Jade Coins sont une monnaie virtuelle **gratuite et sans valeur réelle** :

- Aucun achat de coins avec de l'argent réel, aucune conversion coins → argent, aucun
  échange ou transfert entre joueurs, aucune revente d'objet.
- Aucun avantage payant ne doit se transformer en coins ou en tirages (voir spec 005, point
  à trancher sur le bonus Premium).
- Limites quotidiennes de tirages et de mises, configurables côté serveur ; probabilités des
  caisses affichées publiquement ; mention « divertissement sans valeur réelle » visible sur
  chaque écran de tirage ; espérance de gain de chaque jeu d'arcade ≤ 1.
- Vérification d'âge à l'inscription ; l'Arcade est réservée aux comptes majeurs.

### V. Accessibilité et mouvement réduit

- `prefers-reduced-motion` et la préférence « Animations » du profil sont respectés partout :
  intro, transitions de page, roulette des caisses, roue, compteurs animés.
- Navigation complète au clavier, focus visible (liseré jade), rôles ARIA sur modales,
  menus, segments et toggles, contrastes AA dans les deux thèmes.
- Sons d'interface désactivés par défaut.

### VI. Internationalisation dès la première ligne

- Toute chaîne visible passe par `react-i18next`. Le **français est la langue source** ;
  en, es, de, it, pl sont des traductions. Aucune chaîne d'interface en dur dans un composant.
- Les documents légaux font foi en français (bandeau d'avertissement dans les autres langues).

### VII. Simplicité et découpage

- Un composant par responsabilité, organisé par domaine (`src/features/<domaine>`). Un fichier
  qui dépasse ~250 lignes doit être découpé ou justifié.
- État serveur via TanStack Query (hooks `useXP()`, `useCoins()`, `useInventory()`…) ; état UI
  global léger via Zustand (thème, langue, sons, intro vue). Pas de troisième mécanisme.
- YAGNI : pas d'abstraction tant qu'elle ne sert pas au moins deux usages réels.

### VIII. Vie privée (RGPD) par conception

- Données minimales ; hébergement Supabase en région UE.
- Export JSON et suppression de compte en libre-service, depuis le profil.
- Consentement explicite pour la mesure d'audience et les emails ; lien de désinscription.
- Les journaux d'administration ne contiennent pas plus de données personnelles que nécessaire.

## Contraintes techniques

- **Frontend** : React 19 + TypeScript strict, Next.js (App Router) — décision et alternatives
  dans `specs/001-socle-application/research.md` ; Tailwind CSS avec thème sombre par défaut
  (variante `dark` pilotée par classe), palette du prototype exposée en tokens.
- **Données** : Supabase (Postgres, Auth, Storage, Realtime, Edge Functions). Migrations SQL
  versionnées dans `supabase/migrations`, types générés (`supabase gen types`).
- **Qualité** : ESLint + Prettier, Vitest + Testing Library, Playwright (e2e), pgTAP
  (`supabase test db`) pour RLS et RPC.
- **Performance** : LCP < 2,5 s sur la page d'accueil en 4G simulée ; bundle JS initial
  < 200 Ko gzip hors polices.

## Flux de développement et portes qualité

1. Chaque domaine suit spec-kit : `spec.md` → `plan.md` → `tasks.md` → implémentation.
2. Une PR ne touche qu'un domaine (ou le socle) et référence les IDs de tâches.
3. Portes bloquantes en CI : typecheck, lint, tests unitaires, tests pgTAP, e2e « smoke ».
4. Toute migration qui touche l'économie (XP, coins, inventaire, caisses, arcade) exige des
   tests pgTAP couvrant : double attribution impossible, solde jamais négatif, accès refusé
   à un autre utilisateur.
5. Revue « Constitution Check » dans chaque `plan.md` avant implémentation.

## Gouvernance

- Cette constitution prime sur toute autre pratique du dépôt. Un écart doit être justifié dans
  la section « Complexity Tracking » du plan concerné.
- Amendement : PR dédiée modifiant ce fichier, avec rapport d'impact en tête et incrément de
  version (MAJEUR : principe retiré/redéfini ; MINEUR : principe ajouté ; CORRECTIF : wording).
- Toute revue de PR vérifie la conformité aux principes I, II et IV en priorité.

**Version**: 1.0.0 | **Ratified**: 2026-09-27 | **Last Amended**: 2026-09-27
