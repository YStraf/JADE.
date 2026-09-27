# Implementation Plan: Jade Coins

**Branch**: `005-jade-coins` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

Journal `coins_transactions` + cache `profiles.coins_balance`, fonction interne `apply_coins`
(verrou, solde ≥ 0, dédup), remplacement du stub `award_coins_for_xp` de 004 par le vrai barème,
paramètres dans `economy_settings`, historique paginé, solde temps réel, contrôle d'intégrité
nocturne, et récompense de défi appelée par la finalisation (007).

## Technical Context

Voir [001/plan.md](../001-socle-application/plan.md). `pg_cron` pour le contrôle d'intégrité.
Supabase Realtime (postgres_changes filtré sur l'utilisateur) pour le solde.

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I | ✅ | Toutes les écritures via `private.apply_coins`. |
| II | ✅ | Aucun grant d'écriture ; tests pgTAP dédup/négatif/autre utilisateur. |
| IV | ⚠️ | Bonus Premium en attente de décision (US4 / NEEDS CLARIFICATION) ; aucune fonction d'achat/transfert. |

## Project Structure

```text
src/features/coins/
├── components/{CoinChip,CoinDisclaimer,CoinHistory}.tsx
├── hooks/{useCoinsBalance,useCoins}.ts
supabase/migrations/0005_coins.sql
supabase/tests/005_coins.test.sql
```

## Complexity Tracking

Aucune violation (le cache de solde est justifié par la performance et vérifié chaque nuit).
