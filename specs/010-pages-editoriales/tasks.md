---
description: "Tâches — Pages éditoriales"
---

# Tasks: Pages éditoriales

**Prerequisites**: 001 ; 002 pour l'auteur des signalements (facultatif).

## Phase 1: Foundational

- [ ] T001 [P] Extraire `FICHES`, `REMEDES`, `LEGAL`, `PLANS`, `PLAN_ROWS`, `PAY_FAQ`, `actus` vers `src/content/` (`scripts/extract-prototype-content.ts`)
- [ ] T002 [P] Test de parité du contenu avec `prototype/index.html` (`tests/unit/content-parity.test.ts`)
- [ ] T003 Migration `security_reports`, `app_notify_signups` + RPC `report_scam` (`supabase/migrations/0010_editorial.sql`)

## Phase 2: User Story 1 - Sécurité (P1) 🎯 MVP

- [ ] T004 [US1] `FicheCard` (details/summary, niveau coloré, 3 sections) + `RemediesSteps` (`src/features/editorial/security/components/`)
- [ ] T005 [US1] `ScamReportForm` (≥ 15 car., captcha anonyme, avertissement sur les liens) (`src/features/editorial/security/components/ScamReportForm.tsx`)
- [ ] T006 [US1] Page `/securite` SSR (`src/app/securite/page.tsx`)

## Phase 3: User Story 2 - Légal & cookies (P1)

- [ ] T007 [US2] Documents légaux MDX + `legal/config.ts` + `LegalPlaceholder` + contrôle CI production (`src/content/legal/`)
- [ ] T008 [US2] Page `/legal/[doc]` (Seg des 6 documents, bandeau non-FR) + liens footer (`src/app/legal/[doc]/page.tsx`)
- [ ] T009 [US2] `CookieBanner` + `useCookieConsent` (3 boutons, personnalisation, 13 mois, sync profil) (`src/features/editorial/cookies/`)
- [ ] T010 [US2] Mettre à jour les textes cookies/confidentialité pour la version en ligne (session Supabase, base UE) (`src/content/legal/*.mdx`)
- [ ] T011 [US2] E2E : aucune requête de mesure avant consentement (`tests/e2e/cookies.spec.ts`)

## Phase 4: User Story 3 - Formules (P2)

- [ ] T012 [US3] Page `/formules` : cartes, comparatif, FAQ, actions (`src/app/formules/page.tsx`, `src/features/editorial/pricing/`)

## Phase 5: User Story 4 - Actus (P2)

- [ ] T013 [US4] Page `/actus` : Seg CS2/Valorant, rangées esport/patch/veille, étiquettes « exemple » (`src/app/actus/page.tsx`, `src/features/editorial/news/`)
- [ ] T014 [US4] (P3) Table `news_items` + onglet admin (lié à 008/T015) (`supabase/migrations/0010_editorial.sql`)

## Phase 6: User Story 5 - Application (P3)

- [ ] T015 [US5] Page `/application` (fonctionnalités, avancement) + formulaire « Me prévenir » avec consentement (`src/app/application/page.tsx`)
- [ ] T016 [US5] Edge Function `app-notify` (double opt-in, désinscription) (`supabase/functions/app-notify/index.ts`)

## Dependencies

- Phase 1 → US1 ∥ US2 → US3 ∥ US4 → US5.
