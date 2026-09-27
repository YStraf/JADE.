---
description: "Tâches — Shop, caisses, inventaire, Arcade"
---

# Tasks: Shop

**Prerequisites**: 005 (coins) ; 003 pour l'usage des objets dans la Vitrine.
**Tests**: pgTAP obligatoires (économie) + simulations statistiques + e2e.

## Phase 1: Foundational

- [ ] T001 Migration `cosmetic_items`, `crates_catalog`, `crate_items`, vue `crate_odds`, `inventory_items`, `crate_openings` + seed du prototype (`supabase/migrations/0006_shop.sql`)
- [ ] T002 `private.rand_int` (aléa crypto sans biais) + `private.grant_item(uid, item, source)` (quantité) (`supabase/migrations/0006_shop.sql`)
- [ ] T003 Brancher `grant_item` dans `grant_tier_rewards` (004) et le trigger `validate_cosmetics` (003) (`supabase/migrations/0006_shop.sql`)
- [ ] T004 [P] CSS des objets statiques et animés (19 objets de caisse) avec gel en mouvement réduit (`src/features/shop/styles/cosmetics-animated.css`)

## Phase 2: User Story 1 - Ouvrir une caisse (P1) 🎯 MVP

- [ ] T005 [US1] RPC `open_crate` (limite/jour, solde, tirage pondéré, débit, inventaire, journal, idempotence `request_id`) (`supabase/migrations/0006_shop.sql`)
- [ ] T006 [US1] pgTAP : solde insuffisant, limite, idempotence, objet ∈ pool, distribution sur 100 000 tirages (`supabase/tests/006_shop.test.sql`)
- [ ] T007 [P] [US1] `CrateCard` (emoji, nom, description, coût, « Ouvrir ») + `CrateOddsDialog` (`src/features/shop/components/`)
- [ ] T008 [US1] `CrateOpeningAnimation` + `OpenResult` + `RarityTag` (port de `playOpenAnim`) (`src/features/shop/components/`)
- [ ] T009 [US1] `useOpenCrate` (request_id, invalidations coins/inventaire, SFX) (`src/features/shop/hooks/useOpenCrate.ts`)
- [ ] T010 [US1] Page `/shop` + `ShopTabs` (Seg) + `CoinChip` + mention sans valeur réelle (`src/app/shop/page.tsx`)
- [ ] T011 [US1] E2E ouverture (solde seedé), vérif objet affiché = objet en base (`tests/e2e/shop-crate.spec.ts`)

## Phase 3: User Story 2 - Inventaire (P1)

- [ ] T012 [P] [US2] `useInventory` + `InventoryGrid` (quantité, rareté, type, date) dans le Shop et la Vitrine (`src/features/shop/`)
- [ ] T013 [US2] Sélecteurs de la Vitrine (003/T013) alimentés par l'inventaire (`src/features/profile/components/BannerPicker.tsx`, `FramePicker.tsx`)

## Phase 4: User Story 3 - Comment gagner (P1)

- [ ] T014 [P] [US3] RPC/vue publique du barème `economy_settings` + `HowToEarn` (`src/features/shop/components/HowToEarn.tsx`)

## Phase 5: User Story 4 - Arcade (P3)

- [ ] T015 [US4] Tables `arcade_plays`, `arcade_exclusions`, paramètres + trigger « espérance ≤ 1 » (`supabase/migrations/0006_shop.sql`)
- [ ] T016 [US4] RPC `play_wheel`, `play_coinflip`, `play_mystery`, `exclude_me_from_arcade`, `shop_limits` (âge, exclusion, limite, interrupteur) (`supabase/migrations/0006_shop.sql`)
- [ ] T017 [US4] pgTAP : mineur refusé, exclusion, limite, espérance empirique ≤ 1 (`supabase/tests/006_shop.test.sql`)
- [ ] T018 [P] [US4] `WheelOfFortune` (8 segments, rotation serveur-décidée) (`components/arcade/WheelOfFortune.tsx`)
- [ ] T019 [P] [US4] `CoinFlip` et `MysteryGrid` (`components/arcade/`)
- [ ] T020 [US4] `ArcadeGate` (âge, exclusion, désactivé) + `SelfExclusion` + `ShopLimitsNotice` (`components/arcade/`)

## Phase 6: Polish

- [ ] T021 Revue juridique des garde-fous (checklist FR-006) avant activation de l'Arcade en production (`docs/legal/arcade-review.md`)

## Dependencies

- Phase 1 → US1 → US2 → US3 ; US4 indépendant après Phase 1, mais activé en production seulement après T021.
