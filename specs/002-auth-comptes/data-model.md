# Data Model: Authentification et comptes

## `public.profiles` (base — colonnes étendues en 003, 004, 005)

| Colonne | Type | Contraintes / défaut |
|---|---|---|
| `id` | uuid | PK, FK → `auth.users(id)` on delete cascade |
| `pseudo` | citext | unique, check `pseudo ~ '^[A-Za-z0-9_.-]{3,24}$'` |
| `plan` | text | `'Gratuit'` ; check in (`Gratuit`,`Programme`,`Premium`) — écrit uniquement par le serveur |
| `is_banned` | boolean | `false` — écrit uniquement par RPC admin |
| `ban_reason` | text | null |
| `banned_at` | timestamptz | null |
| `created_at` / `updated_at` | timestamptz | `now()` |

## `public.profiles_private`

| Colonne | Type | Contraintes |
|---|---|---|
| `user_id` | uuid | PK, FK → `profiles(id)` on delete cascade |
| `birth_date` | date | not null, check âge ≥ 15 à l'insertion |
| `terms_version` | text | not null |
| `terms_accepted_at` | timestamptz | not null |

RLS : `select` si `user_id = auth.uid()` ; aucune écriture client (insertion par le trigger d'inscription).

## `public.admin_roles`

| Colonne | Type | Contraintes |
|---|---|---|
| `user_id` | uuid | FK → `profiles(id)` on delete cascade |
| `role` | text | check in (`support`,`moderator`,`admin`) |
| `granted_by` | uuid | FK → `profiles(id)` |
| `granted_at` | timestamptz | `now()` |
| PK | | (`user_id`, `role`) |

RLS : `select` pour soi-même et pour `is_admin()` ; aucune écriture directe (RPC `admin_set_role`, spec 008).

## Fonctions

- `public.has_role(r text) returns boolean` — `stable security definer`, `search_path = ''` ; vrai si `auth.uid()` a le rôle `r` **ou** `admin`.
- `public.is_admin() returns boolean` — raccourci `has_role('admin')`.
- `public.is_staff() returns boolean` — `support`, `moderator` ou `admin`.
- `public.is_active_user() returns boolean` — connecté et non banni ; utilisée dans toutes les policies d'écriture.
- `public.is_adult(uid uuid default auth.uid()) returns boolean` — âge ≥ 18 d'après `profiles_private`.
- `private.handle_new_user()` — trigger `after insert on auth.users` : crée `profiles` + `profiles_private` à partir de `raw_user_meta_data` (pseudo, birth_date, terms_version) ; lève une erreur si pseudo pris ou âge < 15.
- `private.bootstrap_admin(email text)` — exécutable uniquement par `postgres` (CLI), donne le rôle `admin` au premier compte.

## Policies `profiles`

- `select` : tout le monde lit les colonnes publiques via la vue `public_profiles` (spec 003) ; la table elle-même : soi-même ou staff.
- `update` : soi-même **et** `is_active_user()`, limité aux colonnes éditables via `grant update (pseudo, bio, …)` (les colonnes `plan`, `is_banned`, `xp_total`, `coins_balance` ne sont jamais accordées au rôle `authenticated`).
