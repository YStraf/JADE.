# Research: Socle applicatif — décisions d'architecture globales

Ces décisions valent pour **tout le projet** ; les autres plans y renvoient.

## D1. Next.js (App Router) plutôt que Vite SPA

- **Décision** : Next.js (App Router) + React 19 + TypeScript strict.
- **Raison** : trois besoins de rendu serveur réels — (1) profils publics `/joueur/[pseudo]`
  partageables avec aperçu OG dynamique, (2) contenu éditorial à fort potentiel SEO (fiches
  Sécurité, routines, actus), (3) pages légales indexables. `@supabase/ssr` gère la session
  par cookies côté serveur, ce qui évite le flash « déconnecté » au chargement.
- **Alternatives** : Vite + React Router (plus simple, mais SEO et OG dynamiques à bricoler via
  prérendu) ; Remix/React Router v7 framework (équivalent, écosystème Supabase moins documenté).
- **Garde-fou** : les pages interactives (tests d'aim, shop, admin) sont des Client Components ;
  on n'utilise ni Server Actions pour l'économie (tout passe par RPC Supabase), ni ISR complexe.

## D2. Routage : chemins réels + redirections des ancres

- Table de correspondance `#accueil→/`, `#opti→/optimisation`, `#tarifs→/formules`,
  `#app→/application`, `#joueur→/joueur/<moi>`, les autres `#x→/x`. Redirection côté client
  (un hash n'est pas envoyé au serveur) dans le layout racine.

## D3. Styles : Tailwind + tokens CSS

- Les couleurs du prototype deviennent des variables CSS (`--bg`, `--jade`…) déclarées pour
  `:root` (sombre) et `.light` ; Tailwind référence ces variables (`bg-bg`, `text-jade`…).
  Le thème sombre est le défaut ; la classe est posée par un script inline avant hydratation
  (évite le flash). Variante `dark`/`light` pilotée par classe (équivalent `darkMode: 'class'`).
- Polices Chakra Petch / Manrope via `next/font/google` (auto-hébergées, pas d'appel tiers).

## D4. i18n : react-i18next

- `i18next` + `react-i18next` + détecteur (cookie `jade_lang` → profil → navigateur → fr).
- Namespaces par domaine (`common`, `nav`, `profile`, `xp`, `shop`, `legal`, …) dans
  `src/locales/<lng>/<ns>.json`. Les tables `S` et `EXTRA` du prototype sont migrées par un
  script ponctuel (`scripts/extract-prototype-i18n.ts`).
- Pas de préfixe de langue dans l'URL (contenu éditorial FR uniquement) ; `hreflang` non utilisé.

## D5. État

- **Serveur** : TanStack Query v5, un hook par ressource (`useProfile`, `useXP`, `useCoins`,
  `useInventory`, `useForumPosts`…), clés centralisées dans `src/lib/query-keys.ts`.
- **UI** : Zustand (`useUiStore` : thème, langue, sons, animations, intro vue) avec
  `persist` sur `localStorage` enveloppé dans try/catch.

## D6. Supabase

- Projet en région UE (Francfort ou Paris). Migrations SQL versionnées, `supabase gen types`
  vers `src/lib/supabase/database.types.ts`.
- Clients : `createBrowserClient` (composants client) et `createServerClient` (RSC, route
  handlers, middleware de rafraîchissement de session).
- Logique métier sensible en fonctions Postgres `SECURITY DEFINER` avec `search_path` fixé,
  appelées par `supabase.rpc()` ; Edge Functions uniquement quand il faut la clé
  `service_role` (suppression de compte, finalisation de défi planifiée, emails).

## D7. Tests

- Vitest + Testing Library (unités : calcul de niveau, rang, parse CSV, convertisseur).
- pgTAP via `supabase test db` (RLS, RPC d'économie).
- Playwright (e2e), navigateur Chromium préinstallé.

## D8. Hébergement

- Front sur Vercel (ou équivalent Node) ; variables `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_SITE_URL`. Clé `service_role` jamais exposée.

## D9. PWA

- Manifest + service worker minimal (cache des assets statiques uniquement, jamais des
  réponses Supabase authentifiées). Le bouton « Installer Jade » du prototype est conservé.

## Constats sur le prototype (à ne pas reproduire)

1. Le bloc « Jade Coins / Caisses / Arcade » (lignes 26-118) est placé **dans la balise
   `<script type="application/ld+json">`** : il n'est jamais exécuté. Les coins, caisses et
   jeux d'arcade du prototype ne fonctionnent donc pas ; seul le HTML du Shop est visible.
2. La Roue a 8 multiplicateurs équiprobables `[0, .5, 1, 1, 2, 3, 5, 10]` : espérance ×2,81
   la mise → génération infinie de coins (voir spec 006).
3. L'auth admin repose sur un hash SHA-256 dans le code client, sans limitation de tentatives.
4. Les identifiants admin figurent en clair dans `INSTRUCTIONS_CLAUDE_CODE.md` (non versionné
   ici) → à considérer comme compromis et à ne pas réutiliser.
