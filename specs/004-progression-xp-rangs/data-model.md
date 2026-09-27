# Data Model: Progression

## `public.xp_events` (append-only)

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint identity | PK |
| `user_id` | uuid | FK profiles on delete cascade |
| `type` | text | check in (`session`,`record_test`,`record_scen`,`streak_day`,`post`,`link`,`challenge`,`routine`,`secret`,`admin`) |
| `dedup_key` | text | not null |
| `xp` | integer | peut être négatif uniquement pour `admin` |
| `meta` | jsonb | ex. `{"label":"Tile Frenzy"}` |
| `created_at` | timestamptz | |
| unique | | (`user_id`, `type`, `dedup_key`) |

RLS : `select` propriétaire (+ staff) ; aucune écriture client.

## Colonnes de cache sur `profiles`

`xp_total int default 0`, `level smallint default 1`, `rank_points smallint null`,
`rank_name text null`, `aim_score numeric(5,2) null`, `assiduity numeric(5,2) null`,
`streak_days smallint default 0`, `timezone text default 'Europe/Paris'` — écrits uniquement par
les fonctions serveur.

## `public.training_sessions`

| Colonne | Type | Notes |
|---|---|---|
| `id` | bigint identity | |
| `user_id` | uuid | FK |
| `scenario` | text | ≤ 120 car. |
| `skill` | text | calculé serveur via mots-clés `SKILLS` |
| `score` | numeric | ≥ 0 |
| `accuracy` | numeric(5,2) | null, 0..100 |
| `played_at` | timestamptz | ≤ now()+1 j, ≥ now()-5 ans |
| `source_file` | text | |
| `created_at` | timestamptz | |
| unique | | (`user_id`, `source_file`) |

RLS : propriétaire `select`/`delete` ; insertion via RPC `import_sessions` uniquement.

## `public.test_records` / `public.test_attempts`

`test_records(user_id, test_key, best_value numeric, achieved_at, primary key(user_id,test_key))`
`test_attempts(id, user_id, test_key, value, detail jsonb, created_at)` — historique brut pour audit.
`test_key` ∈ (`flick`,`precision`,`reaction`,`tracking`,`switching`).
Bornes de plausibilité (table `progression_settings`) : flick ≥ 3 s, précision ≥ 4 s, réaction moyenne ≥ 80 ms, tracking ≤ 100 %, switching ≥ 3 s.

## `public.progression_settings` (singleton, admin)

`rank_refs jsonb` (REFS), `rank_thresholds jsonb` (RANKS), `daily_session_xp_cap int default 50`, `test_bounds jsonb`.

## Fonctions

| Fonction | Exposée | Rôle |
|---|---|---|
| `private.award_xp(uid, type, key, meta) returns jsonb` | non | insère `xp_events` (on conflict do nothing), met à jour `xp_total`/`level`, appelle `private.award_coins_for_xp` (005) et `private.grant_tier_rewards`, renvoie `{xp, level_before, level_after, coins}` ou `null` si doublon |
| `private.level_from_xp(total int) returns table(lvl, into, need, pct)` | non | courbe FR-003 |
| `public.level_info(total int)` | oui (immutable) | même calcul, pour l'UI |
| `public.submit_test_result(p_test text, p_value numeric, p_detail jsonb) returns jsonb` | oui | valide bornes, enregistre tentative, met à jour record, `award_xp('record_test', test||':'||value)`, `streak_day` |
| `public.import_sessions(p_rows jsonb) returns jsonb` | oui | lot ≤ 500, dédup, validation, `award_xp('session', file)` (plafond/jour), `record_scen`, `streak_day` ; renvoie `{added, skipped, invalid, xp, coins}` |
| `public.delete_my_sessions()` | oui | supprime les séances, recalcule le rang |
| `private.recompute_rank(uid)` | non | FR-008, met à jour le cache |
| `public.my_badges() returns table(id, unlocked)` | oui | critères BADGES |
| `private.grant_tier_rewards(uid, lvl_before, lvl_after)` | non | cosmétiques des paliers (via inventaire 006) |
