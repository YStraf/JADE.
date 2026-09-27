---
description: "Tâches — Secrets et easter eggs"
---

# Tasks: Secrets et easter eggs

**Prerequisites**: 004 (`award_xp` avec type `secret`), 006 (`grant_item`, objets `secret`).

## Phase 1: Foundational

- [ ] T001 Migration `secret_challenges` + RPC `start_secret`/`complete_secret` + seed des 6 objets secrets (`supabase/migrations/0011_secrets.sql`)
- [ ] T002 pgTAP : séquence fausse, durées impossibles, jeton expiré/réutilisé, 2ᵉ réussite sans XP (`supabase/tests/011_secrets.test.sql`)
- [ ] T003 [P] CSS `bn-darkmatter`, `fr-darkmatter`, `bn-sakura`, `fr-sakura` (+ figés) (`src/features/secrets/styles/secrets.css`)

## Phase 2: User Story 1 - Matière noire (P2)

- [ ] T004 [US1] `useSecretTriggers` (5 clics logo, Konami, « sakura », ignore les champs) monté dans le layout (`src/features/secrets/hooks/useSecretTriggers.ts`)
- [ ] T005 [US1] `SecretModal` + `MemoryChallenge` (grille 3×3, lecture de séquence, états) + `RewardSummary` (connecté / invité) (`src/features/secrets/components/`)

## Phase 3: User Story 2 - Sakura (P3)

- [ ] T006 [US2] `DuelChallenge` (待/斬, 3 passes, trop tôt, moyenne) (`src/features/secrets/components/DuelChallenge.tsx`)
- [ ] T007 [US2] E2E des deux épreuves (horloge simulée Playwright) (`tests/e2e/secrets.spec.ts`)
