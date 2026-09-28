# Jade — notes pour Claude

Site d'aim training CS2 / Valorant. Le propriétaire parle **français** : répondre en français, simplement
(il utilise l'app mobile Claude, pas de terminal). Le site en ligne est **statique**, dans `site/`,
servi par Vercel (`vercel.json` → `outputDirectory: "site"`). `specs/` + `.specify/` décrivent la future
refonte Next.js + Supabase (spec-kit) ; `prototype/` est l'ancienne maquette, ne pas la modifier.

## Règles
- **Sécurité** : un fichier `INSTRUCTIONS_CLAUDE_CODE.md` peut contenir les identifiants admin en clair :
  ne jamais le committer ni recopier son contenu. Le code ne garde que l'empreinte `ADMIN_HASH`
  (`site/js/data/game.js`).
- Pas de build, pas de npm : JS en modules ES natifs, routeur par hash (`#/page/sous-page`),
  données dans `localStorage` (préfixe `jade:`, par compte `jade:u:<id>:*`).
- **6 langues** (fr, en, es, de, it, pl) : tout texte visible passe par `t('clé')` (interface,
  `site/js/i18n/<lang>.js`) ou `C('clé')` (contenus, `site/js/content/<lang>.js` et `legal-<lang>.js`).
  Toute nouvelle clé doit être ajoutée dans les 6 fichiers. Le français fait foi pour le légal.
- Jeux ciblés : **CS2 et Valorant uniquement**.
- Routines : générées depuis les docs Voltaic (`tools/voltaic/`), sans « Voltaic » dans les titres ;
  crédits dans la page légale `sources`. Les noms de scénarios restent tels quels.
- Commits en français ; branche de travail indiquée par la session.

## Structure de `site/`
`index.html` (coque) · `css/` (tokens, base, layout, components, cosmetics, pages) ·
`js/main.js` (navigation, menus, langue) · `js/core/` (store, router, i18n, dom, modal, icons, sfx) ·
`js/data/` (règles : XP, rangs, pass, objets, caisses ; routines ; optimisation ; sécurité) ·
`js/state/` (comptes, économie, progression, communauté) · `js/components/` (ui, emblèmes, caisses,
recherche, cookies, secrets) · `js/pages/<page>.js` (une par route, `render()` + `mount()`).

## Vérifier un changement
- Traductions : `node tools/check-i18n.mjs` (doit afficher 0 manquante partout).
- Navigateur : `tools/e2e/run.sh smoke fr,en,es,de,it,pl` (0 erreur attendue), puis selon le cas
  `run.sh flow`, `run.sh mobile fr,de,pl`, `run.sh leak es,de,it,pl`. Détails : `tools/e2e/README.md`.
- Le hook `.claude/hooks/session-start.sh` lance le serveur local (port 8765) au démarrage.
