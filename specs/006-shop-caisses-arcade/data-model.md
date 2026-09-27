# Data Model: Shop

## `public.cosmetic_items`

| Colonne | Type | Notes |
|---|---|---|
| `id` | text | PK, ex. `frame_steel`, `banner_comet`, `title_tryhard` |
| `name_fr` | text | ex. « Contour Acier » (traductions via i18n `items.<id>`) |
| `type` | text | `banner` / `frame` / `title` |
| `rarity` | text | `common` / `rare` / `epic` / `legend` |
| `animated` | boolean | |
| `css_key` | text | classe `bn-*` / `fr-*` ou libellé de titre |
| `source` | text | `crate` / `tier` / `secret` / `premium` / `base` |
| `active` | boolean | |

Seed : les 19 objets de `CRATE_POOLS`, les cosmétiques de palier (`TIERS`), les 2 secrets (`darkmatter`, `sakura`) et les bases (BANNERS, FRAMES) marquées `base`.

## `public.crates_catalog` / `public.crate_items`

`crates_catalog(key text pk in ('static','animated','mixed'), name_fr, emoji, description_fr, cost int, active bool, sort int)`
— seed : static 150 🖼️, animated 350 ✨, mixed 220 🎁.
`crate_items(crate_key, item_id, weight int default null /* null = poids de la rareté */, primary key(crate_key,item_id))`.
Vue `crate_odds` : probabilité par objet et par rareté (lecture publique).

## `public.inventory_items`

`(user_id, item_id, quantity int default 1, source text, first_obtained_at, last_obtained_at, primary key(user_id,item_id))`
RLS : `select` propriétaire ; lecture publique limitée à l'objet **équipé** via `get_public_profile`. Aucune écriture client.

## `public.crate_openings`

`(id bigint identity, user_id, crate_key, item_id, cost, request_id uuid unique, created_at)` — RLS lecture propriétaire.

## `public.arcade_plays`

`(id, user_id, game in ('wheel','coinflip','mystery'), stake, payout, outcome jsonb, request_id uuid unique, created_at)` — RLS lecture propriétaire.

## `public.arcade_exclusions`

`(user_id pk, until timestamptz null /* null = définitif */, created_at)` — écrite par RPC `exclude_me_from_arcade`.

## `economy_settings` (suite)

`crate_daily_limit 5`, `arcade_enabled true`, `arcade_daily_limit 15`, `arcade_min_age 18`,
`wheel_segments [{"mult":0,"w":35},{"mult":0.5,"w":25},{"mult":1,"w":10},{"mult":1,"w":10},{"mult":2,"w":12},{"mult":3,"w":5},{"mult":5,"w":2},{"mult":10,"w":1}]`,
`wheel_stake 20`, `coinflip_stake 10`, `coinflip_mult 2`, `mystery_stake 15`, `mystery_mult 6`.
Contrainte (trigger) : espérance calculée de chaque jeu ≤ 1, sinon l'update est refusé.

## RPC (toutes `security definer`, `is_active_user()` requis)

| Fonction | Retour |
|---|---|
| `open_crate(p_crate text, p_request_id uuid)` | `{opening_id, item:{id,name,type,rarity,animated}, balance}` |
| `play_wheel(p_request_id uuid)` | `{segment_index, mult, payout, balance}` |
| `play_coinflip(p_side text, p_request_id uuid)` | `{result, win, payout, balance}` |
| `play_mystery(p_cell int, p_request_id uuid)` | `{winning_cell, win, payout, balance}` |
| `exclude_me_from_arcade(p_days int /* null = définitif */)` | void |
| `shop_limits()` | `{crates_left, arcade_left, resets_at, arcade_allowed, reason}` |

Aléa : `private.rand_int(n)` basé sur `gen_random_bytes(4)` avec rejet pour éviter le biais modulo.
