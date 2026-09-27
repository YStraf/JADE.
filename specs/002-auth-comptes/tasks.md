---
description: "Tâches — Authentification et comptes"
---

# Tasks: Authentification et comptes

**Prerequisites**: 001 Phase 2 terminée.
**Tests**: pgTAP obligatoires (rôles, trigger d'inscription, ban) ; e2e inscription/connexion.

## Phase 1: Setup

- [ ] T001 Configurer Supabase Auth : confirmation email, URL de redirection, SMTP, longueur mini 8, captcha Turnstile (`supabase/config.toml`)

## Phase 2: Foundational

- [ ] T002 Migration `profiles` (base), `profiles_private`, `admin_roles` + RLS + column grants (`supabase/migrations/0002_auth.sql`)
- [ ] T003 Fonctions `has_role`, `is_admin`, `is_staff`, `is_active_user`, `is_adult` (`supabase/migrations/0002_auth.sql`)
- [ ] T004 Trigger `private.handle_new_user` (pseudo unique, âge ≥ 15, CGU) (`supabase/migrations/0002_auth.sql`)
- [ ] T005 [P] Tests pgTAP : création profil, refus < 15 ans, pseudo dupliqué, membre ne peut écrire `admin_roles`, banni ne peut pas `update profiles` (`supabase/tests/002_auth_roles.test.sql`)
- [ ] T006 [P] Commande d'amorçage admin documentée (`supabase/scripts/bootstrap_admin.sql`, `README.md`)
- [ ] T007 Régénérer les types (`src/lib/supabase/database.types.ts`)

**Checkpoint**: les policies des autres domaines peuvent utiliser `has_role()` / `is_active_user()`.

## Phase 3: User Story 1 - Créer un compte (P1) 🎯 MVP

- [ ] T008 [P] [US1] `AuthModal` mode inscription : pseudo, email, mot de passe, date de naissance, case CGU, messages du prototype (`src/features/auth/components/AuthModal.tsx`)
- [ ] T009 [P] [US1] RPC `pseudo_available` + vérification à la volée (debounce 400 ms) (`supabase/migrations/0002_auth.sql`, `src/features/auth/api/auth.ts`)
- [ ] T010 [US1] Route `/auth/callback` + redirection `/profil` + toast « Bienvenue » + SFX `enter` (`src/app/auth/callback/route.ts`)
- [ ] T011 [US1] Écran « Vérifie ta boîte mail » + renvoi limité (`src/features/auth/components/CheckEmail.tsx`)
- [ ] T012 [US1] E2E inscription (Inbucket local de Supabase) (`tests/e2e/auth-signup.spec.ts`)

## Phase 4: User Story 2 - Connexion / déconnexion (P1)

- [ ] T013 [P] [US2] `useSession` / `useRoles` (TanStack Query + `onAuthStateChange`) (`src/features/auth/hooks/`)
- [ ] T014 [P] [US2] `AccountButton` + menu (initiales/avatar, « Mon profil », « Se déconnecter ») (`src/features/auth/components/AccountButton.tsx`)
- [ ] T015 [US2] Mode connexion de `AuthModal`, erreur générique, bascule « Pas encore de compte ? » (`src/features/auth/components/AuthModal.tsx`)
- [ ] T016 [US2] `BannedScreen` + garde global pour comptes bannis (`src/features/auth/components/BannedScreen.tsx`)
- [ ] T017 [US2] E2E connexion/déconnexion/persistance (`tests/e2e/auth-login.spec.ts`)

## Phase 5: User Story 4 - Rôles serveur (P1)

- [ ] T018 [US4] Guard de route `/admin` basé sur `useRoles()` + vérification serveur dans le layout admin (`src/app/admin/layout.tsx`)
- [ ] T019 [US4] Test pgTAP : RPC protégée par `is_admin()` refuse un membre (`supabase/tests/002_auth_roles.test.sql`)

## Phase 6: User Story 3 - Mot de passe (P2)

- [ ] T020 [P] [US3] Page `/auth/reset` + formulaire « mot de passe oublié » (`src/app/auth/reset/page.tsx`)
- [ ] T021 [US3] Carte « Mot de passe » de l'onglet Sécurité (validation 8 car., confirmation, révocation autres sessions) (`src/features/auth/components/ChangePasswordCard.tsx`)

## Phase 7: User Story 5 - OAuth (P3)

- [ ] T022 [P] [US5] Google OAuth + RPC `complete_profile` + page `/bienvenue` (`src/app/bienvenue/page.tsx`)
- [ ] T023 [US5] (Optionnel) Edge Function OpenID Steam (`supabase/functions/steam-openid/index.ts`)

## Dependencies

- Phase 2 bloque tout le reste du projet (fonctions de rôle). US1 → US2 → US4 ; US3/US5 indépendants.
