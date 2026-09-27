---
description: "Tâches — Contenu d'entraînement"
---

# Tasks: Contenu d'entraînement

**Prerequisites**: 001, 002 ; 004 pour l'XP de routine.

## Phase 1: Foundational

- [ ] T001 Migration `routines`, `routine_blocks`, `routine_completions`, `training_plans`, `optimization_checks` + RLS (`supabase/migrations/0009_training_content.sql`)
- [ ] T002 Seed des 9 routines du prototype + test de snapshot (`supabase/seed/routines.sql`, `supabase/tests/009_routines.test.sql`)
- [ ] T003 [P] `convert.ts` (formules `conv()`) + 50 cas de parité (`src/features/training/optimization/lib/`)
- [ ] T004 [P] `recommend.ts` (algorithme `renderWizard()`) + tests des 30 combinaisons (`src/features/training/routines/lib/`)

## Phase 2: User Story 1 - Routines (P1) 🎯 MVP

- [ ] T005 [US1] RPC `complete_routine` (XP 25, date locale, série) (`supabase/migrations/0009_training_content.sql`)
- [ ] T006 [P] [US1] `RoutineFilters` (3 Seg, logiciel mémorisé) + `RoutineCard` (accordéon, tags, blocs, note, « Séance faite ») (`src/features/training/routines/components/`)
- [ ] T007 [US1] Page `/routines` (SSR + filtres client, animation d'apparition échelonnée 45 ms) (`src/app/routines/page.tsx`)

## Phase 3: User Story 2 - Parcours guidé (P2)

- [ ] T008 [US2] `GuidedPathWizard` + `PlanResult` + persistance `training_plans` (`src/features/training/routines/components/`)
- [ ] T009 [US2] Encart « Programme suivi » de la vitrine branché sur `training_plans` (`src/features/profile/components/widgets/PlanWidget.tsx`)

## Phase 4: User Story 3 - Optimisation & convertisseur (P2)

- [ ] T010 [P] [US3] Contenu `optimization.ts` (4 onglets du prototype) + `OptiChecklist` (compteur, barre, persistance) (`src/content/optimization.ts`, `components/OptiChecklist.tsx`)
- [ ] T011 [P] [US3] `SensConverter` (sens, DPI, résolution, note 4:3) (`components/SensConverter.tsx`)
- [ ] T012 [US3] Page `/optimisation` (+ encart application → `/application`) (`src/app/optimisation/page.tsx`)

## Phase 5: User Story 4 - Accueil (P3)

- [ ] T013 [US4] Accueil : hero traduit, CTA, `MiniAimTest`, piliers, encarts Défi / Alerte arnaque (`src/app/page.tsx`, `src/features/training/home/`)

## Dependencies

- Phase 1 → US1 → US2 ; US3/US4 indépendants.
