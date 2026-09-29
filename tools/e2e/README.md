# Tests navigateur (Playwright)

Tous passent par `tools/e2e/run.sh`, qui démarre le serveur local (`site/` sur le port 8765) si besoin.

| Commande | Vérifie |
|---|---|
| `tools/e2e/run.sh smoke fr,en,es,de,it,pl` | chaque route dans chaque langue : erreurs JS, pages vides, clés i18n brutes |
| `tools/e2e/run.sh flow` | parcours complet : inscription, test d'aim, caisse, Arcade, forum, recherche, titres |
| `tools/e2e/run.sh mobile fr,de,pl [home,shop]` | débordement horizontal à 390 px (+ captures dans `$OUT`, défaut `/tmp`) |
| `tools/e2e/run.sh leak es,de,it,pl` | texte français resté dans les autres langues (quelques faux positifs : « des » en allemand) |
| `tools/e2e/run.sh showcase` | vitrine à widgets : ajout de chaque type, réglages, taille, déplacement, vue publique, mobile (captures dans `$OUT`) |
| `tools/e2e/run.sh app` | mode application avec un faux pont natif : PC et jeux, tracker, lancement, synchro, Jade+ |
| `tools/e2e/run.sh live` | changement de langue en direct depuis le menu |

Variables : `JADE_BASE` (URL testée), `CHROME_PATH` (Chromium à utiliser), `PW_ROOT` (dossier contenant `playwright`).
Traductions sans navigateur : `node tools/check-i18n.mjs`.
