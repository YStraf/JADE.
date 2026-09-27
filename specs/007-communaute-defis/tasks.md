---
description: "Tâches — Communauté (forum, défis)"
---

# Tasks: Communauté

**Prerequisites**: 002, 003 (`PlayerName`), 004 (`award_xp`), 005 (récompenses de défi).
**Tests**: pgTAP (RLS forum, unicité réactions/signalements, meilleur score, clôture idempotente) + e2e.

## Phase 1: Foundational

- [ ] T001 Migration `forum_posts`, `forum_reactions`, `forum_reports` + triggers de compteurs + RLS (`supabase/migrations/0007_community.sql`)
- [ ] T002 Migration `challenges`, `challenge_leaderboard` + RLS + publication Realtime (`supabase/migrations/0007_community.sql`)
- [ ] T003 [P] Libs `youtubeId`, `CATS/catColor`, `nextMondayParis` + tests (`src/features/community/**/lib/`)
- [ ] T004 [P] Seed de développement : 4 posts et classement d'exemple du prototype (`supabase/seed.sql`)

## Phase 2: User Story 1 - Forum (P1) 🎯 MVP

- [ ] T005 [US1] RPC `create_post` (validations, rate limit 5/h, XP `post`) (`supabase/migrations/0007_community.sql`)
- [ ] T006 [P] [US1] `useForumPosts` (pagination) + `PostCard` (PlayerName, pastille catégorie, date relative, vidéo nocookie lazy) (`src/features/community/forum/`)
- [ ] T007 [US1] `NewPostModal` + `CategoryPicker` (messages d'erreur du prototype, Échap, focus) (`src/features/community/forum/components/`)
- [ ] T008 [US1] Page `/forum` (Seg catégories avec pastilles de couleur, état vide) (`src/app/forum/page.tsx`)
- [ ] T009 [US1] E2E publication visible par un 2ᵉ compte (`tests/e2e/forum.spec.ts`)

## Phase 3: User Story 2 - GG & signalements (P1)

- [ ] T010 [US2] RPC `toggle_gg`, `report_post` (seuil de masquage dans `community_settings`) (`supabase/migrations/0007_community.sql`)
- [ ] T011 [P] [US2] `useToggleGG` (optimistic) + `ReportDialog` (`src/features/community/forum/`)
- [ ] T012 [US2] pgTAP : GG unique, signalement unique, masquage à 5 (`supabase/tests/007_community.test.sql`)

## Phase 4: User Story 3 - Défi de la semaine (P1)

- [ ] T013 [US3] RPC `submit_challenge_score` + `private.finalize_challenge` + jobs `pg_cron` (`supabase/migrations/0007_community.sql`)
- [ ] T014 [US3] pgTAP : meilleur score conservé, départage, clôture rejouée sans double récompense, podium sans vidéo reclassé (`supabase/tests/007_community.test.sql`)
- [ ] T015 [P] [US3] `ChallengeHero` + `Countdown` (30 s) + règles + lien règlement (`src/features/community/challenges/components/`)
- [ ] T016 [P] [US3] `Leaderboard` (podium, statuts vidéo, PlayerName) + abonnement Realtime (`components/Leaderboard.tsx`, `hooks/useChallengeLeaderboard.ts`)
- [ ] T017 [US3] `SubmitScoreDialog` + « Voir les runs postées » (forum filtré Défi hebdo) (`components/SubmitScoreDialog.tsx`)
- [ ] T018 [US3] Page `/defis` (`src/app/defis/page.tsx`)
- [ ] T019 [US3] E2E : 2 comptes, mise à jour temps réel du classement (`tests/e2e/challenge.spec.ts`)

## Phase 5: User Story 4 - Réponses (P3)

- [ ] T020 [US4] Table `forum_replies` + RPC `reply_to_post` + notification (préférence `notif.replies`) (`supabase/migrations/0007_community.sql`)
- [ ] T021 [US4] Fil de réponses sous `PostCard` (`src/features/community/forum/components/Replies.tsx`)

## Dependencies

- Phase 1 → US1 → US2 ; US3 après Phase 1 (+ 005/T012 pour les récompenses) ; US4 en dernier.
