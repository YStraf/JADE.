# Jade

Site d'entraînement à la visée (aim training) pour CS2 et Valorant : routines, tests d'aim,
suivi de progression, défis hebdomadaires, forum, Jade Coins et Shop cosmétique.

Le site en ligne est la version statique du dossier [`site/`](site/) (HTML/CSS/JS sans build,
servie par Vercel). Le dépôt prépare aussi sa reconstruction en **Next.js (React) + Tailwind +
Supabase**, structurée avec [spec-kit](https://github.com/github/spec-kit).

| Où | Quoi |
|---|---|
| [`site/`](site/) | **Site en ligne** : ouvrir `site/index.html` via un petit serveur (`cd site && python3 -m http.server`) |
| [`specs/README.md`](specs/README.md) | Feuille de route : 11 specs, ordre d'exécution, décisions à prendre |
| [`.specify/memory/constitution.md`](.specify/memory/constitution.md) | Principes non négociables (serveur qui fait foi, RLS, garde-fous légaux…) |
| [`specs/001-socle-application/research.md`](specs/001-socle-application/research.md) | Décisions d'architecture (stack, structure, i18n, état, tests) |
| [`prototype/`](prototype/) | Prototype HTML de référence (source de vérité UX et micro-copy) — ouvrir `prototype/index.html` |
| [`docs/PROMPT_REBUILD_JADE.md`](docs/PROMPT_REBUILD_JADE.md) | Brief de reconstruction |
| `.claude/skills/speckit-*` | Commandes spec-kit (`/speckit-clarify`, `/speckit-analyze`, `/speckit-implement`…) |

## Le site (`site/`)

```text
site/
  index.html            coque (menu latéral, barre du haut, pied de page)
  css/                  tokens (thèmes), base, layout, composants, cosmétiques, pages, polices
  assets/fonts/         polices auto-hébergées (licence OFL) — aucune requête vers Google
  js/main.js            navigation, raccourcis (Ctrl+K, /), changement de langue en direct
  js/core/              stockage, routeur (#/page/sous-page), i18n, modales, sons, icônes
  js/data/              règles du jeu (XP, rangs, pass, objets, caisses), routines, optimisation, sécurité
  js/state/             comptes locaux, économie (Jade Coins, caisses, Arcade), progression, communauté
  js/components/        interface, emblèmes de rang et visuels de caisses (SVG), recherche, cookies
  js/pages/             une page par route (accueil, routines, tests, rangs, pass, shop, admin, légal…)
  js/i18n/<langue>.js   textes d'interface  — fr, en, es, de, it, pl
  js/content/<langue>.js contenus éditoriaux + legal-<langue>.js (documents légaux)
```

- **Traductions** : chaque langue a les mêmes clés que le français. `node tools/check-i18n.mjs`
  liste les clés manquantes, en trop ou non traduites (interface et contenus). Le français fait foi
  pour les documents légaux.
- **Documents légaux** : les champs à compléter (éditeur, SIREN, adresse, médiateur de la
  consommation, prestataire de paiement…) sont surlignés dans les pages et marqués
  `TODO(...)` dans `js/content/legal-*.js`.
- **Administration** : `#/admin`. Seule l'empreinte SHA-256 des identifiants est dans le code
  (`ADMIN_HASH`, `js/data/game.js`) ; l'onglet Réglages calcule la nouvelle empreinte pour la changer.
  C'est une protection côté navigateur en attendant les rôles serveur (spec 002).
