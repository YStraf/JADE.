# Data Model: Pages éditoriales

## Contenu versionné (dépôt)

- `src/content/security.ts` : `FICHES` (8 × [titre, niveau, mécanisme, signaux[], réflexe]) et `REMEDES` (8) — copiés tels quels.
- `src/content/legal/{mentions,confidentialite,cookies,cgu,cgv,reglement-defis}.fr.mdx` + `src/content/legal/config.ts` (éditeur, SIREN, adresse, hébergeur, contact, DPO).
- `src/content/plans.ts` : `PLANS`, `PLAN_ROWS`, `PAY_FAQ`, taglines.
- `src/content/news.ts` : données d'exemple `actus` (CS2/Valorant).

## `public.security_reports`

`(id, reporter_id uuid null on delete set null, message text check length ≥ 15 and ≤ 4000, status 'open'|'triaged'|'published'|'dismissed', handled_by, created_at)`
RLS : insertion par tous via RPC `report_scam` (rate limit + captcha si anonyme) ; lecture `has_role('moderator')`.

## `public.app_notify_signups`

`(email citext pk, consent_at timestamptz, confirmed_at timestamptz null, confirm_token uuid, unsubscribed_at null, created_at)`
RLS : aucune lecture client ; insertion via Edge Function `app-notify` (envoi du double opt-in).

## `public.news_items` (P3)

`(id, game 'CS2'|'Valorant', kind 'esport'|'patch'|'veille', title, body, data jsonb, source_url, published_at, status)` — lecture publique des publiés, écriture admin.
