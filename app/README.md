# Jade — application Windows

L'application reprend tout le site (`../site`, copié dans `renderer/` à chaque lancement) et ajoute ce qu'un site ne peut pas faire :

| Onglet | Ce que fait l'app |
|---|---|
| PC et jeux | scan du matériel, 7 optimisations Windows réelles et réversibles, graphismes CS2 / Valorant (curseur Performance ↔ Équilibré ↔ Qualité, sauvegarde avant écriture) |
| Tracker | CS2 (Leetify), FACEIT, Valorant via la fonction serveur `supabase/functions/tracker` (aperçu tant qu'elle n'est pas configurée) |
| Routines | bouton « Lancer » : Kovaak's s'ouvre directement sur la playlist ou le scénario (liens Steam) ; Aim Lab s'ouvre avec le code copié |
| Ma progression | dossier `stats` de Kovaak's trouvé tout seul (bibliothèques Steam) ou choisi une fois, puis import automatique de chaque partie |
| Jade+ | pas d'achat dans l'app : renvoi vers le site (même compte) |

Code : `main/main.js` (fenêtre, protocole `app://`, pont IPC), `main/preload.js` (API `window.jadeNative`),
`main/native/*` (Windows, optimisation, jeux, stats, lancement). Côté interface : `site/js/core/native.js`
(`isApp`), pages `site/js/pages/pc.js` et `tracker.js`, style `site/css/app.css`.

- Lancer en local (Windows) : `npm install` puis `npm start`.
- Tests : `npm test` (fichiers de réglages CS2/Valorant, liens de lancement, note du PC).
- Installeur : `npm run dist` → `dist/Jade Setup x.y.z.exe`. GitHub Actions (`.github/workflows/app.yml`) le compile
  à chaque changement ; une étiquette `app-v0.1.0` publie une version téléchargeable.
- Adresse du site utilisée par l'app : `SITE_URL` dans `site/js/core/native.js`.
