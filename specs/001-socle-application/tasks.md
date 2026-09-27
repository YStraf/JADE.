---
description: "Tâches — Socle applicatif"
---

# Tasks: Socle applicatif

**Input**: `specs/001-socle-application/` (spec.md, plan.md, research.md)
**Prerequisites**: aucun — c'est la première brique.
**Tests**: tests unitaires des utilitaires (i18n fallback, motion, redirections) et e2e smoke de navigation.

## Format: `[ID] [P?] [Story] Description`

## Phase 1: Setup

- [ ] T001 Initialiser le projet Next.js + TypeScript strict à la racine (`package.json`, `tsconfig.json`, `next.config.ts`)
- [ ] T002 [P] Configurer ESLint (+ `eslint-plugin-i18next` en mode « no literal string » sur `src/`) et Prettier (`eslint.config.mjs`, `.prettierrc`)
- [ ] T003 [P] Installer et configurer Tailwind CSS avec tokens du prototype (sombre/clair) dans `src/app/globals.css` et `tailwind.config.ts`
- [ ] T004 [P] Configurer Vitest + Testing Library (`vitest.config.ts`, `tests/unit/setup.ts`)
- [ ] T005 [P] Configurer Playwright avec Chromium préinstallé (`playwright.config.ts`, `tests/e2e/`)
- [ ] T006 [P] Initialiser Supabase CLI (`supabase/config.toml`, `supabase/seed.sql`, `.env.example` avec `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`)
- [ ] T007 [P] Pipeline CI : typecheck, lint, vitest, `supabase test db`, playwright smoke (`.github/workflows/ci.yml`)

---

## Phase 2: Foundational (bloquant pour tous les domaines)

- [ ] T008 Clients Supabase navigateur/serveur + middleware de rafraîchissement de session (`src/lib/supabase/client.ts`, `server.ts`, `middleware.ts`, `src/middleware.ts`)
- [ ] T009 Migration socle : extensions (`pgcrypto`, `citext`), schéma `private`, révocation des droits par défaut, fonction utilitaire `set_updated_at()` (`supabase/migrations/0001_socle.sql`)
- [ ] T010 Test pgTAP « garde-fou » : échoue si une table de `public` n'a pas RLS activée (`supabase/tests/000_rls_enabled.test.sql`)
- [ ] T011 [P] Providers globaux : QueryClientProvider, I18nextProvider, thème (`src/app/providers.tsx`)
- [ ] T012 [P] Store UI Zustand persistant (thème, langue, sons, animations, intro vue) avec try/catch sur le stockage (`src/lib/store/ui-store.ts`)
- [ ] T013 [P] Hook `useReducedMotion()` combinant media query et préférence « Animations » (`src/lib/motion.ts`)
- [ ] T014 [P] Script d'extraction des tables `S` + `EXTRA` du prototype vers JSON (`scripts/extract-prototype-i18n.ts` → `src/locales/<lng>/*.json`)
- [ ] T015 Config i18next : détection cookie→profil→navigateur→fr, repli en→fr→clé (`src/lib/i18n/config.ts`, `client.ts`, `server.ts`)
- [ ] T016 [P] Composants UI de base : Button, Card, Tag, Badge, Field, Toggle, Modal (focus trap, Échap) (`src/components/ui/`)
- [ ] T017 [P] `Toaster` (2,4 s) et `XpPop` empilé (3,2 s, `aria-live`) + API `toast()` / `pop()` (`src/components/ui/Toast.tsx`, `XpPop.tsx`)
- [ ] T018 [P] Composant `Seg` (pastille glissante, flèches clavier, `aria-pressed`, pastilles de couleur optionnelles) (`src/components/ui/Seg.tsx`)
- [ ] T019 Clés de requêtes centralisées (`src/lib/query-keys.ts`)

**Checkpoint**: fondations prêtes — les domaines 002 à 011 peuvent démarrer.

---

## Phase 3: User Story 1 - Navigation entre les pages (P1) 🎯 MVP

**Goal**: les 16 routes existent, header/footer présents, lien actif, 404.
**Independent Test**: e2e qui visite chaque route et vérifie `aria-current`.

- [ ] T020 [P] [US1] Layout racine avec Header/Footer/Toaster (`src/app/layout.tsx`)
- [ ] T021 [P] [US1] Header : logo « Jade. », nav, ombre au scroll > 8 px, menu mobile (`src/components/layout/Header.tsx`, `Navigation.tsx`)
- [ ] T022 [P] [US1] Pages squelettes pour les 16 routes avec titre/sous-titre traduits (`src/app/**/page.tsx`)
- [ ] T023 [US1] Redirection des ancres du prototype vers les chemins (`src/components/layout/LegacyHashRedirect.tsx`)
- [ ] T024 [US1] Transitions de page via View Transitions API si dispo et si mouvement autorisé (`src/components/layout/PageTransition.tsx`)
- [ ] T025 [P] [US1] Page 404 reprenant `prototype/404.html` (`src/app/not-found.tsx`)
- [ ] T026 [US1] E2E smoke navigation + 404 + redirections (`tests/e2e/navigation.spec.ts`)

---

## Phase 4: User Story 2 - Thème, langue, sons (P1)

- [ ] T027 [P] [US2] ThemeToggle (knob soleil/lune du prototype) + script anti-flash inline (`src/components/layout/ThemeToggle.tsx`, `src/app/theme-script.ts`)
- [ ] T028 [P] [US2] LanguageMenu (drapeaux, `role="menu"`, toast « Langue changée », note contenu FR) (`src/components/layout/LanguageMenu.tsx`)
- [ ] T029 [P] [US2] Port du module SFX (hover/click/enter, désactivé par défaut) (`src/lib/sfx.ts`) + SoundToggle (`src/components/layout/SoundToggle.tsx`)
- [ ] T030 [US2] Délégation globale hover/click → SFX sur les éléments interactifs (`src/components/layout/SfxListener.tsx`)
- [ ] T031 [US2] Synchronisation préférences ↔ profil quand connecté (branchée après 003) (`src/features/profile/hooks/useSyncUiPrefs.ts`)
- [ ] T032 [P] [US2] Tests unitaires : fallback i18n, persistance store sans localStorage (`tests/unit/i18n.test.ts`, `ui-store.test.ts`)

---

## Phase 5: User Story 3 - Intro animée (P2)

- [ ] T033 [US3] `IntroSplash` : canvas (grille défilante, 46 points, anneaux de visée), terminal typé, lettres « JADE. », boutons Entrer/Passer, touches Entrée/Espace/Échap, `sessionStorage` (`src/components/layout/IntroSplash.tsx`)
- [ ] T034 [US3] Variante reduced-motion + bouton « Revoir l'intro » du footer (`src/components/layout/Footer.tsx`)
- [ ] T035 [US3] E2E : intro visible une fois par session, fermeture clavier (`tests/e2e/intro.spec.ts`)

---

## Phase 6: User Story 4 - Footer, SEO, PWA (P3)

- [ ] T036 [P] [US4] Footer complet : liens légaux, préférences cookies, replay intro, mention d'indépendance, point admin (triple-clic) (`src/components/layout/Footer.tsx`)
- [ ] T037 [P] [US4] Raccourci `Ctrl+Shift+A` → `/admin` (`src/components/layout/AdminShortcut.tsx`)
- [ ] T038 [P] [US4] Metadata par page, OG/Twitter, JSON-LD, `og.png` (`src/app/layout.tsx`, `public/og.png`)
- [ ] T039 [P] [US4] `manifest.ts`, icônes, `sitemap.ts`, `robots.ts`
- [ ] T040 [US4] Service worker minimal (assets statiques uniquement) + bouton « Installer Jade » sur `beforeinstallprompt` (`public/sw.js`, `src/components/layout/InstallButton.tsx`)

---

## Phase 7: Polish

- [ ] T041 Audit Lighthouse (accessibilité ≥ 95, perf ≥ 90) et corrections
- [ ] T042 [P] README de démarrage (`README.md` : prérequis, `supabase start`, `npm run dev`, tests)

## Dependencies & Execution Order

- Phase 1 → Phase 2 → (US1 ∥ US2) → US3 → US4 → Polish.
- T031 dépend de la spec 003 (table `profiles`) ; il peut être livré plus tard sans bloquer US2.
