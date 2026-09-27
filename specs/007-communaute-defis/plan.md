# Implementation Plan: Communauté — forum et défis

**Branch**: `007-communaute-defis` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

Forum persistant (posts, GG, signalements, masquage auto), branché sur le moteur d'XP ; défi
hebdomadaire en base avec soumission de score, classement en temps réel (Supabase Realtime),
compte à rebours, clôture planifiée idempotente et versement des récompenses (005).

## Technical Context

Voir [001/plan.md](../001-socle-application/plan.md). Realtime `postgres_changes` sur
`challenge_leaderboard` filtré par `challenge_id`. `pg_cron` pour la clôture. Dates relatives
via `Intl.RelativeTimeFormat` (langue courante).

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I | ✅ | Scores, classement final et récompenses calculés serveur. |
| II | ✅ | Écritures via RPC ; modération via `has_role('moderator')`. |
| III | ✅ | Catégories, couleurs, messages de validation, compte à rebours, règles repris. |
| VIII | ✅ | Posts anonymisés à la suppression du compte. |

## Project Structure

```text
src/features/community/forum/{components,hooks,lib}/
src/features/community/challenges/{components,hooks,lib}/
src/app/forum/page.tsx  src/app/defis/page.tsx
supabase/migrations/0007_community.sql  supabase/tests/007_community.test.sql
```

## Complexity Tracking

Aucune violation.
