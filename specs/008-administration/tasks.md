---
description: "Tâches — Administration"
---

# Tasks: Administration

**Prerequisites**: 002 (rôles), 003, 004, 005, 006, 007 (tables administrées). US1-US2 peuvent démarrer dès 002-005.
**Tests**: pgTAP : chaque RPC × chaque rôle (autorisé/refusé) + journalisation.

## Phase 1: Foundational

- [ ] T001 Migration `admin_logs` (immuable), `user_sanctions`, `community_settings`, helper `private.log_admin(...)` (`supabase/migrations/0008_admin.sql`)
- [ ] T002 Test pgTAP générique : toute RPC `admin_*`/`mod_*`/`support_*` refuse `authenticated` sans rôle (`supabase/tests/008_admin.test.sql`)

## Phase 2: User Story 1 - Accès par rôle (P1) 🎯 MVP

- [ ] T003 [US1] Layout `/admin` serveur (vérif rôle) + `AdminLock` (non connecté) + `AccessDenied` (membre) (`src/app/admin/layout.tsx`, `src/features/admin/components/`)
- [ ] T004 [US1] `AdminPanel` + `useAdminTabs` (matrice de rôles) + route `[[...tab]]` (`src/features/admin/`)
- [ ] T005 [US1] Journalisation `admin.login` à l'ouverture du panel (`supabase/migrations/0008_admin.sql`)

## Phase 3: User Story 2 - Utilisateurs, rôles, XP, coins, sanctions (P1)

- [ ] T006 [US2] RPC `admin_search_users`, `admin_user_detail`, `admin_set_role` (dernier admin protégé), `admin_ban_user`/`admin_unban_user` (motif, révocation sessions), `admin_grant_xp`, `admin_grant_coins`, `admin_delete_user` (`supabase/migrations/0008_admin.sql`)
- [ ] T007 [US2] pgTAP : auto-bannissement refusé, dernier admin, modérateur ne bannit pas un modérateur, XP/coins jamais négatifs, journal écrit (`supabase/tests/008_admin.test.sql`)
- [ ] T008 [P] [US2] `UsersTab` (recherche, tableau, sélecteur de rôle, XP ±, coins ±, bannir/débannir, supprimer) (`tabs/UsersTab.tsx`)
- [ ] T009 [P] [US2] `UserDetailDrawer` (historique de modération agrégé) (`tabs/UserDetailDrawer.tsx`)
- [ ] T010 [P] [US2] `ReasonDialog`, `ConfirmDialog`, `useAdminAction` (ré-auth > 30 min) (`src/features/admin/`)

## Phase 4: User Story 3 - Modération forum (P1)

- [ ] T011 [US3] RPC `mod_set_post_status`, `mod_handle_report` (`supabase/migrations/0008_admin.sql`)
- [ ] T012 [P] [US3] `ReportsQueue` + `ForumModerationTab` (règles de modération du prototype) (`tabs/`)

## Phase 5: User Story 4 - Défi & contenu (P2)

- [ ] T013 [US4] RPC `admin_upsert_challenge`, `admin_finalize_challenge`, `mod_set_video_status` (`supabase/migrations/0008_admin.sql`)
- [ ] T014 [P] [US4] `ChallengeTab` (planning, validation vidéos, clôture forcée, rappel légal) (`tabs/ChallengeTab.tsx`)
- [ ] T015 [P] [US4] `ContentTab` : CRUD routines (dépend de 009/T001) + statut actus (`tabs/ContentTab.tsx`)

## Phase 6: User Story 5 - Shop, paramètres, dashboard, journal, apparence (P2)

- [ ] T016 [US5] RPC `admin_upsert_item`, `admin_upsert_crate`, `admin_update_settings` (validation espérance ≤ 1) (`supabase/migrations/0008_admin.sql`)
- [ ] T017 [P] [US5] `ShopAdminTab` (objets, caisses, probabilités recalculées) (`tabs/ShopAdminTab.tsx`)
- [ ] T018 [P] [US5] `SettingsTab` (barèmes, limites, Arcade, seuils, repères de rang) (`tabs/SettingsTab.tsx`)
- [ ] T019 [US5] Vue matérialisée `admin_dashboard_stats` + `pg_cron` + RPC `admin_dashboard` ; `DashboardTab` (`supabase/migrations/0008_admin.sql`, `tabs/DashboardTab.tsx`)
- [ ] T020 [P] [US5] `LogsTab` (filtres, pagination, export CSV) (`tabs/LogsTab.tsx`)
- [ ] T021 [P] [US5] `BrandTab` : import avatar/bannière (bucket `banners`), titre 40 car., bypass de possession pour admin (`tabs/BrandTab.tsx`)

## Phase 7: User Story 6 - Tickets (P3)

- [ ] T022 [US6] RPC `support_reply`, `support_set_status` + `TicketsTab` (`supabase/migrations/0008_admin.sql`, `tabs/TicketsTab.tsx`)

## Dependencies

- Phase 1 → US1 → US2 → US3 ; US4/US5/US6 après les specs qui créent leurs tables.
