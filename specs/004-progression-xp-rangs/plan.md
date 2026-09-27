# Implementation Plan: Progression — XP, niveaux, rangs, badges, séances, records

**Branch**: `004-progression-xp-rangs` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

Construire le moteur d'XP serveur (`private.award_xp`) avec journal dédupliqué, le calcul de
niveau/rang/badges côté serveur, les RPC d'entrée (`submit_test_result`, `import_sessions`), et
porter en React les 5 moteurs de tests d'aim, la page Ma progression (import, courbe, série,
compétences) et l'onglet « Niveau et XP » (carte, badges, historique, pass, rang).

## Technical Context

Voir [001/plan.md](../001-socle-application/plan.md). Moteurs de test : composants client avec
`requestAnimationFrame` + `pointerdown` (port de `startTest()`), un hook par moteur. Courbe :
SVG maison (port de `chart()`) — pas de librairie de graphes. Calculs purs partagés dans
`src/features/xp/lib/` (niveau, rang, streak, skillOf) et **dupliqués en SQL** ; des tests de
parité vérifient que TS et SQL donnent le même résultat.

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I | ✅ | `award_xp` privé ; records et séances validés serveur. |
| II | ✅ | Aucune écriture client sur `xp_events`, `test_records`, `training_sessions` (RPC only). |
| III | ✅ | Barèmes, courbe, RANKS, REFS, BADGES, TIERS, moteurs de test identiques. |
| V | ✅ | Compteurs animés (`countUp`) et courbe animée désactivés en reduced motion. |

## Project Structure

```text
src/features/xp/
├── lib/{levels.ts,rank.ts,badges.ts,tiers.ts,skills.ts,streak.ts}   (+ *.test.ts)
├── hooks/{useXP,useRank,useBadges}.ts
├── components/{XpCard,BadgeGrid,XpHistory,ProgressPass,RankCard,LevelChip}.tsx
src/features/training/tests/
├── engines/{useFlick,usePrecision,useReaction,useTracking,useSwitching}.ts
├── components/{TestGrid,TestArena,TestOverlay,TestRecords}.tsx
├── hooks/{useTestRecords,useSubmitTestResult}.ts
src/features/training/progression/
├── lib/parseKovaaksCsv.ts (+test)
├── components/{DropZone,StatsRow,ScenarioChart,StreakWeek,SkillsGrid,StatsPathHelper}.tsx
├── hooks/{useTrainingSessions,useImportSessions}.ts
src/app/tests/page.tsx  src/app/progression/page.tsx
supabase/migrations/0004_progression.sql  supabase/tests/004_progression.test.sql
```

## Complexity Tracking

| Écart | Pourquoi | Alternative rejetée |
|---|---|---|
| Calculs dupliqués TS + SQL | Le serveur fait foi (I), mais l'UI a besoin d'afficher la barre/les seuils instantanément | Tout calculer en SQL et refetch à chaque affichage : latence visible sur les pops |
