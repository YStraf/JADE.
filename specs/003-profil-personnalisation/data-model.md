# Data Model: Profil et personnalisation

## Colonnes ajoutées à `public.profiles`

| Colonne | Type | Défaut / contrainte |
|---|---|---|
| `bio` | text | check `char_length(bio) <= 240` |
| `avatar_path` | text | chemin Storage `avatars/<uid>/<hash>.jpg` |
| `avatar_zoom` | smallint | 100, check 100..320 |
| `avatar_x`, `avatar_y` | smallint | 50, check 0..100 |
| `banner_key` | text | `'aurora'` — base ou objet possédé (trigger) |
| `banner_path` | text | null — admin uniquement en v1 |
| `banner_zoom` | smallint | 100, check 100..300 |
| `banner_x`, `banner_y` | smallint | 50, check 0..100 |
| `frame_key` | text | `'jade'` — base ou objet possédé (trigger) |
| `title` | text | check `char_length(title) <= 26` (règle finale selon FR-006) |
| `widgets` | text[] | `{records,scen,streak,badges}` ; éléments ⊂ liste WIDGETS |
| `prefs` | jsonb | `{"publicProfile":true,"showScores":true,"accent":"jade","anims":true}` |
| `notif` | jsonb | `{"weekly":true,"challenge":true,"replies":true,"news":false}` |
| `ui_prefs` | jsonb | `{"theme":"dark","lang":"fr","sfx":false}` |
| `minutes_on_site` | integer | 0 — écrit par RPC `heartbeat()` uniquement |
| `pseudo_changed_at` | timestamptz | null |

Column grants `update` pour `authenticated` : `bio, avatar_zoom, avatar_x, avatar_y, banner_key,
frame_key, title, widgets, prefs, notif, ui_prefs` (+ `pseudo` via RPC `change_pseudo` pour la limite 30 j,
+ `avatar_path` via RPC `set_avatar` après upload).

Trigger `private.validate_cosmetics()` (`before update`) : `banner_key` ∈ bases ∪ objets possédés de type
banner ; idem `frame_key` ; titre filtré par `private.banned_words`.

## `public.support_tickets`

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint identity | PK |
| `user_id` | uuid | FK profiles, on delete set null |
| `subject` | text | check in (5 sujets du prototype) |
| `message` | text | check longueur ≥ 10 |
| `status` | text | `open` / `answered` / `closed` |
| `created_at` | timestamptz | |

`support_ticket_replies(id, ticket_id, author_id, body, created_at)`.
RLS : l'auteur lit/crée ses tickets ; `is_staff()` lit tout et répond.

## Storage

- Bucket `avatars` (lecture publique) : écriture si `(storage.foldername(name))[1] = auth.uid()::text` et `is_active_user()` ; taille max 1 Mo après redimensionnement, types `image/jpeg|png|webp`.
- Bucket `banners` (lecture publique) : écriture `is_admin()` uniquement (v1).

## RPC

| Fonction | Rôle |
|---|---|
| `get_public_profile(p_pseudo citext) returns jsonb` | Profil public filtré selon `prefs` ; `{private:true, pseudo}` si masqué |
| `get_mini_profile(p_pseudo citext) returns jsonb` | Données du mini-profil (banner, avatar, frame, rank, level, xp, sessions, streak, minutes, rank_points) |
| `change_pseudo(p_pseudo citext)` | Unicité, mots interdits, 1 changement / 30 j |
| `set_avatar(p_path text)` | Vérifie que le fichier est dans le dossier de l'utilisateur |
| `heartbeat()` | +1 minute si le dernier battement date de ≥ 55 s |
| `export_my_data() returns jsonb` | Toutes les lignes de l'utilisateur (profil, xp_events, coins_transactions, inventaire, séances, records, posts, réactions, tickets) |

Edge Function `delete-account` (service_role) : anonymise `forum_posts.author_id`, supprime fichiers Storage, puis `auth.admin.deleteUser()`.
