# Implementation Plan: Pages éditoriales

**Branch**: `010-pages-editoriales` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

Porter Actus, Sécurité, Formules, Application, Légal et le bandeau cookies en pages rendues côté
serveur à partir de contenu versionné (copie exacte du prototype), avec deux vraies écritures :
signalements d'arnaque et inscriptions « Me prévenir » (double opt-in).

## Technical Context

Voir [001/plan.md](../001-socle-application/plan.md). MDX pour les documents légaux ; composant
`LegalPlaceholder` qui met en évidence les champs non renseignés ; test CI qui échoue si
`legal/config.ts` contient des valeurs vides en build de production.

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| III | ✅ | Contenu éditorial copié à l'identique + test de comparaison. |
| VI | ✅ | Interface traduite, documents légaux FR + avertissement. |
| VIII | ✅ | Consentement avant mesure ; double opt-in ; lien de désinscription. |

## Project Structure

```text
src/features/editorial/{security,legal,pricing,news,app}/components/
src/features/editorial/cookies/{CookieBanner,useCookieConsent}.tsx
src/content/{security.ts,plans.ts,news.ts,legal/}
src/app/{securite,legal/[doc],formules,actus,application}/page.tsx
supabase/migrations/0010_editorial.sql  supabase/functions/app-notify/index.ts
tests/unit/content-parity.test.ts
```

## Complexity Tracking

Aucune violation.
