# Implementation Plan: Shop — caisses, inventaire, Arcade

**Branch**: `006-shop-caisses-arcade` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

Catalogue d'objets et de caisses en base, tirage pondéré serveur (`open_crate`), inventaire
persistant, animation de roulette fidèle au prototype, onglet « Comment gagner » alimenté par
`economy_settings`, puis Arcade (roue rééquilibrée, pile ou face, grille) derrière restriction
d'âge, limites quotidiennes, auto-exclusion et interrupteur global.

## Technical Context

Voir [001/plan.md](../001-socle-application/plan.md). Animations en CSS transitions pilotées par
React (pas de lib d'animation). Simulations statistiques (SC-001/003) en SQL (`generate_series`)
dans pgTAP et en Vitest pour le rendu.

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I | ✅ | Tirage + débit + inventaire dans une seule fonction serveur. |
| II | ✅ | Aucune écriture client ; tests pgTAP (limites, âge, solde). |
| III | ✅ | Caisses, coûts, pools, raretés, couleurs, animation, textes repris. |
| IV | ✅ | Garde-fous FR-006 intégralement couverts ; Arcade en P3 derrière interrupteur. |
| V | ✅ | Roulette et roue sans animation en mouvement réduit ; résultat annoncé en `aria-live`. |

## Project Structure

```text
src/features/shop/
├── components/{ShopPage,ShopTabs,CrateCard,CrateOddsDialog,CrateOpeningAnimation,OpenResult,RarityTag}.tsx
├── components/{InventoryGrid,HowToEarn,ShopLimitsNotice}.tsx
├── components/arcade/{ArcadeTab,WheelOfFortune,CoinFlip,MysteryGrid,ArcadeGate,SelfExclusion}.tsx
├── hooks/{useCrates,useOpenCrate,useInventory,useShopLimits,useArcade}.ts
├── lib/{rarity.ts,buildStrip.ts}
├── styles/cosmetics-animated.css
src/app/shop/page.tsx
supabase/migrations/0006_shop.sql   supabase/tests/006_shop.test.sql
```

## Complexity Tracking

Aucune violation.
