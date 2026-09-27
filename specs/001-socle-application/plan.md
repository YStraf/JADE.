# Implementation Plan: Socle applicatif

**Branch**: `001-socle-application` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-socle-application/spec.md`

## Summary

Mettre en place la coque de l'application Jade : projet Next.js + Tailwind + Supabase, tokens
de design du prototype, routes des 16 pages, header/footer/navigation, thème, i18n
(react-i18next), sons d'interface, intro animée, toasts, segments, 404, SEO/OG, PWA. Ce plan
porte aussi les **décisions d'architecture globales** (voir [research.md](./research.md)) et la
structure de dépôt utilisée par tous les autres domaines.

## Technical Context

**Language/Version**: TypeScript 5.x (strict), Node 22, SQL (Postgres 15+)
**Primary Dependencies**: Next.js (App Router), React 19, Tailwind CSS, @supabase/supabase-js + @supabase/ssr, @tanstack/react-query v5, zustand, i18next + react-i18next
**Storage**: Supabase Postgres (données), Supabase Storage (avatars/bannières), localStorage (préférences anonymes uniquement)
**Testing**: Vitest + Testing Library, Playwright, pgTAP (`supabase test db`)
**Target Platform**: Navigateurs evergreen desktop + mobile ; PWA installable
**Project Type**: Application web (frontend Next.js + backend Supabase géré)
**Performance Goals**: LCP < 2,5 s (4G simulée) ; 60 fps sur les animations (intro, roulette, tests d'aim)
**Constraints**: JS initial < 200 Ko gzip ; aucun secret côté client ; RLS partout ; `prefers-reduced-motion` respecté
**Scale/Scope**: ~16 pages, 11 domaines fonctionnels, cible initiale 10 k comptes

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I. Serveur fait foi | ✅ | Le socle ne contient aucune logique économique ; les hooks d'économie arrivent dans 004-006. |
| II. RLS par défaut | ✅ | Migration initiale : `alter default privileges` + RLS activée par convention (test pgTAP qui échoue si une table `public` n'a pas RLS). |
| III. Parité prototype | ✅ | Tokens, micro-copy et sons repris à l'identique. |
| IV. Divertissement responsable | n/a | |
| V. Accessibilité | ✅ | Reduced motion, focus visible, ARIA des segments/menus/modales. |
| VI. i18n | ✅ | react-i18next dès le socle + lint anti-chaînes en dur. |
| VII. Simplicité | ✅ | Structure par domaine, Zustand + TanStack Query uniquement. |
| VIII. RGPD | ✅ | Polices auto-hébergées, aucun traceur par défaut. |

## Project Structure

### Documentation (this feature)

```text
specs/001-socle-application/
├── plan.md
├── research.md          # Décisions d'architecture globales (D1-D9) + constats prototype
├── spec.md
├── tasks.md
└── checklists/requirements.md
```

### Source Code (repository root) — structure commune à tout le projet

```text
src/
├── app/                          # Routes Next.js (App Router)
│   ├── layout.tsx                # <Providers/>, <Header/>, <Footer/>, <IntroSplash/>, <Toaster/>
│   ├── page.tsx                  # Accueil
│   ├── routines/ tests/ optimisation/ actus/ securite/ defis/ forum/
│   ├── application/ formules/ shop/ progression/
│   ├── profil/[[...tab]]/ joueur/[pseudo]/ legal/[doc]/ admin/[[...tab]]/
│   ├── auth/callback/route.ts    # échange du code Supabase (spec 002)
│   ├── not-found.tsx             # 404 « Cible manquée »
│   ├── manifest.ts  sitemap.ts  robots.ts  opengraph-image.tsx
├── components/
│   ├── layout/                   # Header, Navigation, Footer, IntroSplash, AccountButton, LanguageMenu, SoundToggle, ThemeToggle
│   └── ui/                       # Seg, Toast/Toaster, XpPop, Modal, Toggle, Card, Button, Tag, Badge, Field
├── features/                     # Un dossier par domaine (auth, profile, xp, coins, shop, community, admin, training, editorial, secrets)
│   └── <domaine>/{components,hooks,api,lib}/
├── lib/
│   ├── supabase/{client.ts,server.ts,middleware.ts,database.types.ts}
│   ├── i18n/{config.ts,client.ts,server.ts}
│   ├── sfx.ts                    # port du module SFX (Web Audio)
│   ├── motion.ts                 # useReducedMotion() (media query + préférence profil)
│   ├── query-keys.ts
│   └── store/ui-store.ts         # Zustand
├── locales/{fr,en,es,de,it,pl}/*.json
└── content/                      # Contenu éditorial versionné (fiches sécurité, légal, plans, actus)
supabase/
├── migrations/                   # SQL versionné
├── functions/                    # Edge Functions (delete-account, finalize-challenge, …)
├── tests/                        # pgTAP
└── seed.sql
tests/
├── e2e/                          # Playwright
└── unit/                         # Vitest (ou co-localisés *.test.ts)
prototype/                        # Prototype HTML de référence (lecture seule)
```

**Structure Decision**: application web unique (Next.js) adossée à Supabase géré ; pas de backend
séparé. Chaque domaine vit dans `src/features/<domaine>` et `supabase/migrations/<timestamp>_<domaine>.sql`.

## Complexity Tracking

Aucune violation.
