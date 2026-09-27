---
description: "Tâches — Profil, personnalisation, profil public, mini-profil"
---

# Tasks: Profil et personnalisation

**Prerequisites**: 001, 002 (Phase 2). Les encarts XP/rang/badges se branchent sur 004 ; les cosmétiques possédés sur 006 (fonctionne avec les seules bases avant).
**Tests**: pgTAP (cosmétiques non possédés, Storage, visibilité publique) ; e2e profil.

## Phase 1: Foundational

- [ ] T001 Migration colonnes profil, grants, trigger `validate_cosmetics`, table `banned_words` (`supabase/migrations/0003_profile.sql`)
- [ ] T002 Buckets `avatars`/`banners` + policies Storage (`supabase/migrations/0003_profile.sql`)
- [ ] T003 RPC `get_public_profile`, `get_mini_profile`, `change_pseudo`, `set_avatar`, `heartbeat`, `export_my_data` (`supabase/migrations/0003_profile.sql`)
- [ ] T004 [P] Tables `support_tickets`, `support_ticket_replies` + RLS (`supabase/migrations/0003_profile.sql`)
- [ ] T005 [P] Tests pgTAP : cosmétique non possédé refusé, écriture avatar hors dossier refusée, profil privé masqué, stats masquées si showScores=false (`supabase/tests/003_profile.test.sql`)
- [ ] T006 [P] Constantes cosmétiques de base (BANNERS, FRAMES, WIDGETS) + CSS des bannières `bn-*` et contours `fr-*` du prototype (`src/features/profile/lib/cosmetics.ts`, `src/features/profile/styles/cosmetics.css`)
- [ ] T007 Hooks `useProfile`, `useUpdateProfile` (optimistic update) (`src/features/profile/hooks/`)

## Phase 2: User Story 1 - Mon compte (P1) 🎯 MVP

- [ ] T008 [P] [US1] `ProfileLayout` + `ProfileNav` (icônes `IC` du prototype) + `IdentityBlock` + route `/profil/[[...tab]]` (`src/features/profile/components/`, `src/app/profil/[[...tab]]/page.tsx`)
- [ ] T009 [US1] `AccountTab` : pseudo (RPC `change_pseudo`), email (confirmation), bio 240 (`src/features/profile/components/tabs/AccountTab.tsx`)
- [ ] T010 [US1] `AvatarUploader` + `CropSliders` (redimensionnement canvas, EXIF, aperçu live) (`src/features/profile/components/AvatarUploader.tsx`, `lib/image.ts`)
- [ ] T011 [P] [US1] Composants `Avatar` / `Banner` réutilisables (zoom/position/contour) (`src/features/profile/components/Avatar.tsx`, `Banner.tsx`)
- [ ] T012 [P] [US1] Test unitaire `image.ts` (limites taille/type) (`tests/unit/image.test.ts`)

## Phase 3: User Story 2 - Vitrine (P1)

- [ ] T013 [P] [US2] `BannerPicker`, `FramePicker` (bases + possédés, rareté), champ Titre (`src/features/profile/components/`)
- [ ] T014 [P] [US2] Widgets de vitrine (7) avec états vides du prototype (`src/features/profile/components/widgets/`)
- [ ] T015 [US2] `ShowcaseTab` = aperçu `Showcase` + personnalisation + `WidgetToggles` (`src/features/profile/components/tabs/ShowcaseTab.tsx`)

## Phase 4: User Story 3 - Profil public & mini-profil (P1)

- [ ] T016 [US3] Page `/joueur/[pseudo]` (SSR, privé/masqué, bouton « Copier le lien ») + `opengraph-image.tsx` (`src/app/joueur/[pseudo]/`)
- [ ] T017 [US3] `useMiniProfile` + `MiniProfileHoverCard` (délai 250 ms, garde au survol de la carte, placement dans l'écran, tactile) (`src/features/profile/components/MiniProfileHoverCard.tsx`)
- [ ] T018 [US3] `PlayerName` (remplace `.author`) utilisé dans forum, classements, admin (`src/features/profile/components/PlayerName.tsx`)
- [ ] T019 [US3] `useHeartbeat` (60 s, onglet visible) (`src/features/profile/hooks/useHeartbeat.ts`)
- [ ] T020 [US3] E2E : A voit le mini-profil réel de B ; profil privé (`tests/e2e/public-profile.spec.ts`)

## Phase 5: User Story 4 - Préférences, notifications, abonnement, support (P2)

- [ ] T021 [P] [US4] `PersoTab` (thème, animations, sons, profil visible, afficher mes scores) + branchement 001/T031 (`tabs/PersoTab.tsx`)
- [ ] T022 [P] [US4] `NotifTab` (4 toggles + mention désinscription) (`tabs/NotifTab.tsx`)
- [ ] T023 [P] [US4] `SubscriptionTab` (PLANS d'exemple, facturation, « paiements pas encore actifs ») (`tabs/SubscriptionTab.tsx`)
- [ ] T024 [P] [US4] `SupportTab` (FAQ + formulaire ticket) (`tabs/SupportTab.tsx`)
- [ ] T025 [US4] `SecurityTab` : mot de passe (002/T021), A2F « Bientôt », liaisons (Google via `linkIdentity`, autres « Bientôt »), sessions (`tabs/SecurityTab.tsx`)

## Phase 6: User Story 5 - Données RGPD (P2)

- [ ] T026 [US5] `DataTab` : export JSON (`jade-donnees.json`), effacer séances (branché 004), suppression avec re-saisie du pseudo (`tabs/DataTab.tsx`)
- [ ] T027 [US5] Edge Function `delete-account` (anonymisation posts, purge Storage, suppression auth) (`supabase/functions/delete-account/index.ts`)
- [ ] T028 [US5] E2E export + suppression (`tests/e2e/rgpd.spec.ts`)

## Dependencies

- Phase 1 → US1 → (US2 ∥ US3) → US4 ∥ US5. L'onglet « Niveau et XP » est livré par 004.
