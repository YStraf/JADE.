# Data Model: Jade Coins

## `public.coins_transactions` (append-only)

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint identity | PK |
| `user_id` | uuid | FK profiles on delete cascade |
| `amount` | integer | ≠ 0 |
| `reason` | text | check in (`session`,`record_test`,`streak_week`,`level_milestone`,`challenge`,`premium_monthly`,`crate_open`,`arcade_stake`,`arcade_payout`,`admin_grant`,`admin_revoke`) |
| `ref_type` / `ref_id` | text / text | ex. `crate_openings` / `42` |
| `dedup_key` | text | not null |
| `balance_after` | integer | check ≥ 0 |
| `created_at` | timestamptz | |
| unique | | (`user_id`, `reason`, `dedup_key`) |

Index `(user_id, created_at desc)`. RLS : `select` propriétaire + staff ; aucune écriture client.

## `profiles.coins_balance`

`integer not null default 0 check (coins_balance >= 0)` — jamais accordée en `update` au rôle `authenticated`.

## `public.economy_settings` (singleton, admin — partagé avec 006)

| Clé | Défaut |
|---|---|
| `coins_session` | 5 |
| `coins_session_daily_cap` | 20 (séances rémunérées / jour) |
| `coins_record_test` | 25 |
| `coins_streak_week` | 50 |
| `coins_level_milestone` | 75 (tous les 5 niveaux) |
| `coins_challenge` | `{"1":300,"2-3":250,"4-10":200,"top25":150,"valid":100}` |

## Fonctions

| Fonction | Exposée | Rôle |
|---|---|---|
| `private.apply_coins(uid, amount, reason, dedup_key, ref_type, ref_id) returns integer` | non | `select … for update` sur le profil, refuse si solde < débit, insère la transaction (on conflict do nothing → renvoie null), met à jour le cache |
| `private.award_coins_for_xp(uid, xp_type, xp_key, level_before, level_after, meta)` | non | Remplace le stub de 004 : session (plafond jour), record_test, streak_week (série % 7 = 0), level_milestone (chaque multiple de 5 franchi) |
| `public.my_coins_history(p_before bigint default null, p_limit int default 30)` | oui | pagination par curseur |
| `private.check_coins_integrity()` | non | job nocturne `pg_cron` : compare cache et somme, écrit une alerte dans `admin_logs` |

Realtime : publication de `profiles` limitée aux colonnes `coins_balance`, `xp_total`, `level` pour l'utilisateur courant (filtre `id=eq.<uid>`).
