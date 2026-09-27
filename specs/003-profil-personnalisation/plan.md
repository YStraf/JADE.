# Implementation Plan: Profil, personnalisation, profil public, mini-profil

**Branch**: `003-profil-personnalisation` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

Porter la page « Mon profil » du prototype (9 onglets) en composants React branchés sur
`profiles` étendu, Supabase Storage pour l'avatar, RPC pour les données publiques
(`get_public_profile`, `get_mini_profile`) et le RGPD (`export_my_data`, Edge Function
`delete-account`). Le composant `<PlayerName/>` remplace `.author` + `bindMini()` partout.

## Technical Context

Voir [001/plan.md](../001-socle-application/plan.md). Recadrage : réimplémentation de `readImage()`
(canvas, 320 px, JPEG 0.82) ; `<MiniProfileHoverCard/>` avec Floating UI pour le positionnement.
Profil public en Server Component + `generateMetadata` + `opengraph-image.tsx` dynamique.

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I | ✅ | Cosmétiques validés par trigger ; temps sur site par RPC. |
| II | ✅ | Column grants + RLS Storage par dossier. |
| III | ✅ | Onglets, textes, listes BANNERS/FRAMES/WIDGETS repris. |
| V | ✅ | Toggle « Animations » alimente `useReducedMotion()`. |
| VIII | ✅ | Export + suppression en libre-service ; posts anonymisés. |

## Project Structure

```text
src/features/profile/
├── components/ProfileLayout.tsx  ProfileNav.tsx  IdentityBlock.tsx
├── components/tabs/{AccountTab,ShowcaseTab,XpTab,SecurityTab,PersoTab,SubscriptionTab,NotifTab,SupportTab,DataTab}.tsx
├── components/AvatarUploader.tsx  CropSliders.tsx  BannerPicker.tsx  FramePicker.tsx  WidgetToggles.tsx
├── components/Showcase.tsx  widgets/{Records,TopScenarios,Skills,StreakTime,Badges,Rank,Plan}Widget.tsx
├── components/PlayerName.tsx  MiniProfileHoverCard.tsx  Avatar.tsx  Banner.tsx
├── hooks/useProfile.ts  useUpdateProfile.ts  useMiniProfile.ts  useHeartbeat.ts
├── lib/image.ts  lib/cosmetics.ts (BANNERS, FRAMES, WIDGETS)
src/app/profil/[[...tab]]/page.tsx  src/app/joueur/[pseudo]/{page.tsx,opengraph-image.tsx}
supabase/migrations/0003_profile.sql  supabase/functions/delete-account/index.ts
supabase/tests/003_profile.test.sql
```

Détails : [data-model.md](./data-model.md), [contracts/profile.md](./contracts/profile.md).

## Complexity Tracking

Aucune violation.
