# Data Model: Administration

## `public.admin_logs` (append-only, immuable)

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint identity | |
| `actor_id` | uuid | FK profiles on delete set null |
| `action` | text | ex. `role.set`, `user.ban`, `user.unban`, `user.delete`, `xp.grant`, `coins.grant`, `post.hide`, `post.restore`, `post.delete`, `report.reject`, `challenge.upsert`, `challenge.video`, `challenge.finalize`, `routine.upsert`, `shop.item.upsert`, `shop.crate.upsert`, `settings.update`, `admin.login`, `integrity.alert` |
| `target_user_id` | uuid | null, on delete set null |
| `target_type` / `target_id` | text | |
| `details` | jsonb | avant/après, motif |
| `created_at` | timestamptz | |

RLS : `select` si `is_staff()` (Support : uniquement ses propres entrées et celles des tickets) ; aucune écriture client ; trigger qui interdit `update`/`delete` (même pour `service_role`, sauf suppression en cascade RGPD anonymisée).

## `public.user_sanctions`

`(id, user_id, kind 'ban'|'unban'|'warning'|'post_hidden', reason text not null, actor_id, created_at)`.

## `public.community_settings`

`auto_hide_reports_threshold int default 5`, `posts_per_hour int default 5`.

## Vue matérialisée `private.admin_dashboard_stats`

Comptes, inscriptions 7 j, actifs 7 j (heartbeat/xp_events), rétention J7 (cohorte), posts, séances, scénarios distincts, signalements ouverts, tickets ouverts, coins en circulation (somme des soldes), ouvertures de caisses/jour. Rafraîchie par `pg_cron` toutes les 15 min ; lue via RPC `admin_dashboard()`.

## RPC d'administration (toutes `security definer`, contrôle de rôle + `admin_logs`)

| RPC | Rôle minimal |
|---|---|
| `admin_search_users(q, limit, offset)` | support |
| `admin_user_detail(user_id)` → profil + historique agrégé | support |
| `admin_set_role(user_id, role|null)` | admin |
| `admin_ban_user(user_id, reason)` / `admin_unban_user(user_id, reason)` | moderator (cibles membres) / admin |
| `admin_delete_user(user_id, reason)` → appelle l'Edge Function `delete-account` | admin |
| `admin_grant_xp(user_id, amount, reason)` | admin |
| `admin_grant_coins(user_id, amount, reason)` | admin |
| `mod_set_post_status(post_id, status, reason)` | moderator |
| `mod_handle_report(report_id, decision)` | moderator |
| `mod_set_video_status(challenge_id, user_id, status)` | moderator |
| `admin_upsert_challenge(...)`, `admin_finalize_challenge(id)` | admin |
| `admin_upsert_routine(...)`, `admin_delete_routine(id)` | admin |
| `admin_upsert_item(...)`, `admin_upsert_crate(...)` | admin |
| `admin_update_settings(scope, patch jsonb)` | admin |
| `admin_dashboard()` | moderator |
| `admin_logs_query(filters, cursor)` | support |
| `support_reply(ticket_id, body)`, `support_set_status(ticket_id, status)` | support |
