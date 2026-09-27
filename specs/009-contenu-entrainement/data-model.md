# Data Model: Contenu d'entraînement

## `public.routines`

`(id bigint identity, software text in ('Kovaak''s','Aim Lab'), level text in ('Débutant','Intermédiaire','Avancé'), game text in ('Tous','CS2','Valorant'), title text, minutes smallint, types text[] /* Clicking, Précision, Tracking, Flick, Switching, Micro-ajustement, Réaction */, note text, sort int, active bool, updated_at)`

## `public.routine_blocks`

`(id, routine_id fk on delete cascade, position smallint, minutes smallint, scenario text, how text)`

RLS : lecture publique (actives) ; écriture admin (RPC 008).

## `public.routine_completions`

`(user_id, routine_id, local_date date, created_at, primary key(user_id, routine_id, local_date))`
RPC `complete_routine(p_routine_id)` → insère + `award_xp('routine', routine_id||':'||local_date)` + `streak_day`.

## `public.training_plans`

`(user_id pk, goal text, game text, minutes smallint, software text, routine_ids bigint[], updated_at)` — RLS propriétaire.

## `public.optimization_checks`

`(user_id, item_key text /* ex. 'Windows:0' */, checked bool, updated_at, primary key(user_id,item_key))` — RLS propriétaire.
