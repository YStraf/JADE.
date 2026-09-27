# Routines Voltaic

`site/js/data/routines.js` (tableaux `ROUTINES` et `SCEN_LIB`) est généré à partir des documents
publics de Voltaic (routines Kovaak's et Aim Lab, fondamentales / par faiblesse / par jeu) et du
tableau de scénarios recommandés.

1. Exporter les Google Docs en texte (`https://docs.google.com/document/d/<id>/export?format=txt`,
   fichier nommé `<id>.txt`) et le tableau en CSV (`sheet.csv`) dans un même dossier.
2. `python3 parse.py` → `parsed.json` (sections, scénarios, runs/minutes, codes de playlist).
3. `python3 build.py` → `routines-gen.js` ; remplacer le bloc `ROUTINES` / `SCEN_LIB` de
   `site/js/data/routines.js` par son contenu. La table `M` de `build.py` associe chaque section
   à son logiciel, sa compétence (`focus`), son niveau et son jeu.

Les textes (titres, consignes) ne viennent pas des documents : ce sont les clés `rt.*` des
fichiers `site/js/i18n/<langue>.js`.
