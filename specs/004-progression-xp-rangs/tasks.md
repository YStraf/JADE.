---
description: "Tâches — Progression (XP, niveaux, rangs, badges, tests, séances)"
---

# Tasks: Progression

**Prerequisites**: 001, 002. La brique coins (005) se branche sur `award_xp` via `private.award_coins_for_xp` : prévoir une implémentation vide (no-op) livrée ici puis remplacée par 005.
**Tests**: pgTAP (dédup, plafond, bornes, rang) + Vitest (parité TS/SQL, parse CSV) + e2e.

## Phase 1: Foundational

- [ ] T001 Migration `xp_events`, colonnes de cache `profiles`, `progression_settings` (seed REFS/RANKS/bornes) (`supabase/migrations/0004_progression.sql`)
- [ ] T002 Fonctions `private.level_from_xp`, `public.level_info`, `private.award_xp` (+ stub `private.award_coins_for_xp`) (`supabase/migrations/0004_progression.sql`)
- [ ] T003 [P] Libs TS pures : `levels.ts`, `rank.ts`, `badges.ts`, `tiers.ts`, `skills.ts`, `streak.ts` (`src/features/xp/lib/`)
- [ ] T004 [P] Tests Vitest de parité avec le prototype (niveau 100 = 902 880 XP, rang Maître à 920, skillOf) (`src/features/xp/lib/*.test.ts`)
- [ ] T005 Tests pgTAP : doublon ignoré, niveau recalculé, aucun `insert` client sur `xp_events` (`supabase/tests/004_progression.test.sql`)

## Phase 2: User Story 1 - XP fiable (P1) 🎯 MVP

- [ ] T006 [US1] Hook `useXP` + helper `handleAward(result)` (pops XP/coins/niveau + SFX + invalidations) (`src/features/xp/hooks/useXP.ts`, `src/features/xp/lib/handleAward.ts`)
- [ ] T007 [P] [US1] `LevelChip` du header (« Niveau N ») (`src/features/xp/components/LevelChip.tsx`)

## Phase 3: User Story 2 - Tests d'aim (P1)

- [ ] T008 Migration `test_records`, `test_attempts`, RPC `submit_test_result` (bornes, record, XP `record_test`, `streak_day`) (`supabase/migrations/0004_progression.sql`)
- [ ] T009 [P] [US2] Moteurs `useFlick`/`usePrecision` (N, taille, pénalité) (`src/features/training/tests/engines/`)
- [ ] T010 [P] [US2] Moteur `useReaction` (5 essais, délai 900-3000 ms, « trop tôt ») (`engines/useReaction.ts`)
- [ ] T011 [P] [US2] Moteur `useTracking` (20 s, trajectoire aléatoire, rebonds) (`engines/useTracking.ts`)
- [ ] T012 [P] [US2] Moteur `useSwitching` (2 cibles, cible active entourée) (`engines/useSwitching.ts`)
- [ ] T013 [US2] Page Tests : grille, arène, HUD, overlay résultat « Nouveau record », records (`src/app/tests/page.tsx`, `components/`)
- [ ] T014 [US2] Mode invité (résultat non sauvegardé + CTA inscription) (`components/TestOverlay.tsx`)
- [ ] T015 [US2] pgTAP bornes + record uniquement si meilleur (`supabase/tests/004_progression.test.sql`)

## Phase 4: User Story 3 - Import & progression (P1)

- [ ] T016 Migration `training_sessions` + RPC `import_sessions` (lot ≤ 500, dédup, plafond/jour, `record_scen`) + `delete_my_sessions` (`supabase/migrations/0004_progression.sql`)
- [ ] T017 [P] [US3] `parseKovaaksCsv` + tests (noms de fichiers réels, champs Score/Scenario/Hit Count/Miss Count) (`src/features/training/progression/lib/`)
- [ ] T018 [US3] `DropZone` (drag & drop, fichiers, dossier `webkitdirectory`), toasts du prototype, aide « chemin du dossier stats » + copier (`components/DropZone.tsx`)
- [ ] T019 [P] [US3] `StatsRow` (compteurs animés), `ScenarioChart` (SVG), sélecteur de scénario (`components/`)
- [ ] T020 [P] [US3] `StreakWeek`, delta 7 j, `SkillsGrid` + phrase « catégorie la moins travaillée » (`components/`)
- [ ] T021 [US3] Page `/progression` + « Effacer mes données » (`src/app/progression/page.tsx`)
- [ ] T022 [US3] E2E import de 3 CSV fixtures (`tests/e2e/progression.spec.ts`, `tests/fixtures/kovaaks/*.csv`)

## Phase 5: User Story 4 - Niveau, pass, badges (P2)

- [ ] T023 [US4] RPC `my_badges` + `private.grant_tier_rewards` (branché sur 006 pour les objets) (`supabase/migrations/0004_progression.sql`)
- [ ] T024 [P] [US4] `XpCard`, `BadgeGrid`, `XpHistory`, `ProgressPass` (`src/features/xp/components/`)
- [ ] T025 [US4] Onglet profil « Niveau et XP » = RankCard + XpCard + ProgressPass (`src/features/profile/components/tabs/XpTab.tsx`)

## Phase 6: User Story 5 - Rang (P2)

- [ ] T026 [US5] `private.recompute_rank` appelé après record/import/suppression + job nocturne (assiduité glissante) (`supabase/migrations/0004_progression.sql`, `pg_cron`)
- [ ] T027 [US5] `useRank` + `RankCard` (non classé / barres / échelle / note explicative) (`src/features/xp/`)
- [ ] T028 [US5] pgTAP rang : < 3 tests → null ; jeu de données → points attendus (`supabase/tests/004_progression.test.sql`)

## Dependencies

- Phase 1 → US1 → (US2 ∥ US3) → US4 → US5. 005 remplace le stub `award_coins_for_xp`.
