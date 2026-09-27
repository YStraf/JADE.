# Implementation Plan: Contenu d'entraînement

**Branch**: `009-contenu-entrainement` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

Routines en base (seed des 9 routines), page Routines filtrable, « Séance faite » branchée sur
l'XP, parcours guidé, checklists d'optimisation persistées, convertisseur de sensibilité et
mini-test de l'accueil — ports fidèles du prototype.

## Technical Context

Voir [001/plan.md](../001-socle-application/plan.md). Page Routines rendue côté serveur (SEO) avec
filtres client. Fonctions pures `convertSens()`, `recommendRoutines()` testées par parité.

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I | ✅ | XP de routine via RPC dédupliquée. |
| III | ✅ | Contenu et formules identiques (tests de parité). |
| VI | ✅ | Interface traduite ; contenu FR assumé. |

## Project Structure

```text
src/features/training/routines/{components/{RoutineFilters,RoutineCard,RoutineList,GuidedPathWizard,PlanResult},hooks/{useRoutines,useCompleteRoutine,useTrainingPlan},lib/recommend.ts}
src/features/training/optimization/{components/{OptiChecklist,SensConverter},lib/convert.ts}
src/features/training/home/{MiniAimTest,HomeHero,Pillars}.tsx
src/content/optimization.ts
src/app/page.tsx  src/app/routines/page.tsx  src/app/optimisation/page.tsx
supabase/migrations/0009_training_content.sql  supabase/seed/routines.sql
```

## Complexity Tracking

Aucune violation.
