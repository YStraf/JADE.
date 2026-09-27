# Data Model: Communauté

## `public.forum_posts`

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint identity | PK |
| `author_id` | uuid | FK profiles **on delete set null** (anonymisation) |
| `category` | text | check in (`Perf`,`Conseil`,`Setup`,`Défi hebdo`,`Recrutement`) |
| `title` | text | 1..120 |
| `body` | text | 10..4000 |
| `video_id` | text | id YouTube (11 car.) extrait côté serveur, null |
| `status` | text | `visible` / `hidden` / `deleted` |
| `hidden_reason` | text | null |
| `moderated_by` / `moderated_at` | uuid / timestamptz | |
| `gg_count` | integer | cache maintenu par trigger |
| `reports_count` | integer | cache |
| `created_at` | timestamptz | |

RLS : `select` si `status='visible'` ou auteur ou `has_role('moderator')` ; `insert` via RPC `create_post` (rate limit, XP) ; `update`/`delete` : auteur (titre/corps, 15 min) ou modérateur (statut, via RPC 008).

## `public.forum_reactions`

`(post_id, user_id, kind text default 'gg', created_at, primary key(post_id,user_id,kind))` — RLS : lecture publique, insert/delete soi-même si `is_active_user()`.

## `public.forum_reports`

`(id, post_id, reporter_id, reason text check in ('spam','triche','arnaque','harcèlement','illégal','autre'), details, status 'open'|'accepted'|'rejected', handled_by, handled_at, created_at, unique(post_id, reporter_id))` — RLS : insert soi-même ; select soi-même + modérateurs.

## `public.forum_replies` (P3)

`(id, post_id, author_id on delete set null, body 2..2000, status, created_at)`.

## `public.challenges`

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint identity | |
| `week_start` | date | lundi, unique |
| `title` | text | |
| `scenario_kovaaks` / `scenario_aimlab` | text | |
| `description` | text | consigne |
| `prize` | text | |
| `max_plausible_score` | numeric | null |
| `status` | text | `scheduled` / `active` / `closed` |
| `finalized_at` | timestamptz | null |

RLS : lecture publique ; écriture admin (RPC 008).

## `public.challenge_leaderboard`

| Colonne | Type | Notes |
|---|---|---|
| `challenge_id` | bigint | FK |
| `user_id` | uuid | FK |
| `score` | numeric | meilleur score |
| `video_id` | text | null |
| `video_status` | text | `not_required` / `pending` / `validated` / `rejected` |
| `flagged` | boolean | score au-delà du plausible |
| `submitted_at` | timestamptz | départage |
| `final_rank` | integer | rempli à la clôture |
| PK | | (`challenge_id`,`user_id`) |

RLS : lecture publique ; écriture via RPC `submit_challenge_score` uniquement. Publication Realtime sur cette table.

## RPC

| Fonction | Rôle |
|---|---|
| `create_post(p_category, p_title, p_body, p_video_url)` | validations FR-003, rate limit, `award_xp('post', id)` |
| `toggle_gg(p_post_id)` | bascule réaction |
| `report_post(p_post_id, p_reason, p_details)` | signalement + masquage auto au seuil |
| `submit_challenge_score(p_score numeric, p_video_url text)` | défi actif, meilleur score, statut vidéo, `flagged` |
| `private.finalize_challenge(p_id)` | classement final (validés d'abord), `award_challenge_rewards` (005), statut `closed`, active le suivant |

`pg_cron` : `0 22 * * 0` et `0 23 * * 0` UTC (couvre lundi 00:00 Paris été/hiver), la fonction vérifie l'heure locale avant d'agir.
