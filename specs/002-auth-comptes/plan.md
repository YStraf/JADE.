# Implementation Plan: Authentification et comptes

**Branch**: `002-auth-comptes` | **Date**: 2026-09-27 | **Spec**: [spec.md](./spec.md)

## Summary

Brancher Supabase Auth (email/mot de passe, confirmation, reset, OAuth Google), créer
automatiquement le profil et les données privées via trigger, introduire la table
`admin_roles` et les fonctions `has_role/is_admin/is_staff/is_active_user/is_adult` qui
serviront à toutes les policies RLS du projet. Reprendre la modale de connexion du prototype
(mode « in »/« up », bascule, messages) en composants React.

## Technical Context

Identique à [001/plan.md](../001-socle-application/plan.md). Spécifique : `@supabase/ssr` pour la
session en cookies ; Cloudflare Turnstile (captcha Supabase) activé après échecs ; SMTP UE.

## Constitution Check

| Principe | Statut | Note |
|---|---|---|
| I | ✅ | Plan/ban/rôles jamais écrits par le client (column grants). |
| II | ✅ | `admin_roles` + fonctions `has_role` ; tests pgTAP obligatoires. |
| III | ✅ | Libellés et erreurs de `openAuth()` repris. |
| IV | ✅ | `is_adult()` exposé pour l'Arcade (006). |
| VIII | ✅ | Date de naissance dans une table privée, jamais exposée publiquement. |

## Project Structure

```text
src/features/auth/
├── components/AuthModal.tsx        # modes in/up, champs, erreurs, bascule, boutons OAuth
├── components/AccountButton.tsx    # bouton header + menu (profil / déconnexion)
├── components/CompleteProfileForm.tsx
├── components/BannedScreen.tsx
├── hooks/useSession.ts  hooks/useRoles.ts
└── api/auth.ts                     # wrappers signUp/signIn/…, mapping d'erreurs
src/app/auth/callback/route.ts  src/app/auth/reset/page.tsx  src/app/bienvenue/page.tsx
supabase/migrations/0002_auth.sql
supabase/tests/002_auth_roles.test.sql
```

Voir [data-model.md](./data-model.md) et [contracts/auth.md](./contracts/auth.md).

## Complexity Tracking

| Écart | Pourquoi | Alternative rejetée |
|---|---|---|
| Table `profiles_private` séparée | La date de naissance ne doit jamais sortir via une policy publique | Colonne dans `profiles` : trop facile à exposer par erreur via `select *` |
