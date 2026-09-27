# Implementation Plan: Secrets et easter eggs

**Branch**: `011-secrets-easter-eggs` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

Porter les deux épreuves secrètes et leurs déclencheurs, avec génération/validation serveur par
jeton (`start_secret`, `complete_secret`) et octroi des cosmétiques via l'inventaire de 006.

## Technical Context

Voir [001/plan.md](../001-socle-application/plan.md). CSS des bannières/contours `darkmatter` et
`sakura` repris du prototype (variantes figées en mouvement réduit).

## Data model

- `public.secret_challenges(token uuid pk, user_id, secret text in ('darkmatter','sakura'), payload jsonb /* séquence ou délais */, issued_at, expires_at, consumed_at)` — aucune lecture client directe.
- RPC `start_secret(p_secret) returns {token, sequence?|delays?}` ; `complete_secret(p_token, p_answer jsonb) returns {granted bool, fresh bool, items[], award}`.
- Validation : mémoire → réponse = séquence et durée ≥ 6 × (420 + 180) ms ; duel → 3 temps ∈ [100, 2000] ms, moyenne < 350, durée totale ≥ somme des délais.

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I | ✅ | Récompense décidée serveur. |
| III | ✅ | Déclencheurs, textes, visuels repris. |
| V | ✅ | Épreuves accessibles au clavier ; visuels figés en mouvement réduit. |

## Project Structure

```text
src/features/secrets/{components/{SecretModal,MemoryChallenge,DuelChallenge,RewardSummary},hooks/{useSecretTriggers,useSecret}.ts,styles/secrets.css}
supabase/migrations/0011_secrets.sql  supabase/tests/011_secrets.test.sql
```

## Complexity Tracking

Aucune violation.
