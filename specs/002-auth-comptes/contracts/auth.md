# Contracts: Authentification

## Inscription

```ts
supabase.auth.signUp({
  email, password,
  options: {
    emailRedirectTo: `${SITE_URL}/auth/callback?next=/profil`,
    data: { pseudo, birth_date /* YYYY-MM-DD */, terms_version: '2026-09' }
  }
})
```
Erreurs mappées : `pseudo_taken`, `underage`, `weak_password`, `invalid_email` → clés i18n `auth.errors.*`.

Vérification préalable (UX) : `rpc('pseudo_available', { p: pseudo }) → boolean` (limité par débit).

## Connexion / déconnexion

- `signInWithPassword({ email, password })`, `signOut({ scope: 'local' })`.
- `signInWithOAuth({ provider: 'google', options: { redirectTo: `${SITE_URL}/auth/callback` } })`.
- Route `GET /auth/callback` : `exchangeCodeForSession`, puis redirection vers `/bienvenue` si le profil est incomplet (OAuth), sinon `next`.

## Profil incomplet (OAuth)

`rpc('complete_profile', { p_pseudo text, p_birth_date date, p_terms_version text }) → void`
Erreurs : `pseudo_taken`, `underage`, `already_completed`.

## Mot de passe

- `resetPasswordForEmail(email, { redirectTo: `${SITE_URL}/auth/reset` })`
- `updateUser({ password })` puis `signOut({ scope: 'others' })`.

## Hook client

`useSession()` → `{ session, user, profile, isLoading, isBanned, roles }` (TanStack Query, invalidé sur `onAuthStateChange`).
