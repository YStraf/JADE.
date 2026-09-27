---
description: "Tâches — Jade Coins"
---

# Tasks: Jade Coins

**Prerequisites**: 004 Phase 1 (moteur `award_xp` + stub).
**Tests**: pgTAP obligatoires (constitution, point 4 des portes qualité).

## Phase 1: Foundational

- [ ] T001 Migration `coins_transactions`, `profiles.coins_balance`, `economy_settings` (seed barème) (`supabase/migrations/0005_coins.sql`)
- [ ] T002 `private.apply_coins` (verrou `for update`, solde ≥ 0, dédup, cache) (`supabase/migrations/0005_coins.sql`)
- [ ] T003 Tests pgTAP : double crédit impossible, débit > solde refusé, aucune écriture client, lecture d'un autre utilisateur refusée (`supabase/tests/005_coins.test.sql`)

## Phase 2: User Story 1 - Gagner des coins (P1) 🎯 MVP

- [ ] T004 [US1] Remplacer le stub par `private.award_coins_for_xp` (session + plafond, record_test, streak_week, level_milestone multi-paliers) (`supabase/migrations/0005_coins.sql`)
- [ ] T005 [US1] Étendre `AwardResult` avec `coins` + libellés, pop « +N coins · … » (`src/features/xp/lib/handleAward.ts`)
- [ ] T006 [US1] pgTAP : niveau 9→11 = un seul +75 ; série 6→7 = +50, 7→8 = 0 ; 25 séances = 100 coins (`supabase/tests/005_coins.test.sql`)

## Phase 3: User Story 2 - Solde et historique (P1)

- [ ] T007 [P] [US2] RPC `my_coins_history` (curseur) (`supabase/migrations/0005_coins.sql`)
- [ ] T008 [P] [US2] Hooks `useCoinsBalance` (Realtime) et `useCoins` (`src/features/coins/hooks/`)
- [ ] T009 [P] [US2] `CoinChip`, `CoinDisclaimer`, `CoinHistory` (`src/features/coins/components/`)
- [ ] T010 [US2] Solde dans le menu compte + onglet « Historique des coins » dans le Shop (006) (`src/features/auth/components/AccountButton.tsx`)
- [ ] T011 [US2] Job `pg_cron` `check_coins_integrity` + alerte `admin_logs` (`supabase/migrations/0005_coins.sql`)

## Phase 4: User Story 3 - Récompense de défi (P2)

- [ ] T012 [US3] `private.award_challenge_rewards(challenge_id)` (barème par classement, XP 250 + coins, idempotent) appelé par 007 (`supabase/migrations/0005_coins.sql`)
- [ ] T013 [US3] pgTAP : finalisation rejouée = pas de double crédit ; podium non validé reclassé (`supabase/tests/005_coins.test.sql`)

## Phase 5: User Story 4 - Premium (P3) — après décision

- [ ] T014 [US4] Implémenter l'option retenue (recommandé : cosmétique mensuel déterministe via `pg_cron`) (`supabase/migrations/0005_coins.sql`)

## Dependencies

- Phase 1 → US1 → US2 ; US3 nécessite 007 (tables de défi) ; US4 bloqué par la clarification.
