# Implementation Plan: Panel d'administration

**Branch**: `008-administration` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

Remplacer l'accès par hash du prototype par un panel protégé par les rôles Supabase, où chaque
action est une RPC journalisée. Onglets : Tableau de bord, Utilisateurs et rôles (+ coins, fiche
et historique), Mon apparence admin, Modération forum, Signalements, Contenu (routines), Défi de la
semaine, Shop, Journal, Paramètres, Tickets.

## Technical Context

Voir [001/plan.md](../001-socle-application/plan.md). Layout `/admin` en Server Component (vérification
de rôle côté serveur avant rendu), onglets en Client Components. Ré-authentification (mot de passe)
pour les actions sensibles si `last_sign_in_at` > 30 min.

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I | ✅ | Toutes les actions en RPC serveur. |
| II | ✅ | `has_role()` dans chaque RPC ; tests pgTAP par RPC × rôle ; aucun secret client. |
| IV | ✅ | Paramètres d'économie validés (espérance ≤ 1). |
| VIII | ✅ | Journal limité au nécessaire ; anonymisation à la suppression. |

## Project Structure

```text
src/features/admin/
├── components/{AdminPanel,AdminLock,AccessDenied,ReasonDialog,ConfirmDialog}.tsx
├── components/tabs/{Dashboard,Users,UserDetailDrawer,Brand,ForumModeration,ReportsQueue,Content,Challenge,ShopAdmin,Logs,Settings,Tickets}Tab.tsx
├── hooks/{useAdminTabs,useAdminUsers,useAdminUserDetail,useAdminAction,useAdminLogs,useAdminDashboard}.ts
src/app/admin/layout.tsx  src/app/admin/[[...tab]]/page.tsx
supabase/migrations/0008_admin.sql  supabase/tests/008_admin.test.sql
```

## Complexity Tracking

Aucune violation.
