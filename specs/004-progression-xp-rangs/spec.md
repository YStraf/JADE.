# Feature Specification: Progression — XP, niveaux, rangs, badges, séances et records

**Feature Branch**: `004-progression-xp-rangs`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Section 2.3 du brief + sources d'XP de 2.7 (tests, import de séances) ; prototype : `XP_RULES`, `awardXP()`, `xpData()`, `levelFromXP()`, `xpTotalForLevel()`, `BADGES`, `xpStats()`, `TIERS`, `MAXLVL`, `RANKS`, `REFS`, `norm()`, `aimScore()`, `assiduity()`, `rankScore()`, `renderRank()`, `renderPath()`, `TESTS`, `startTest()`, `bestOf()`/`saveBest()`, `parseCSV()`, `handle()`, `renderProgress()`, `streakInfo()`, `weekDelta()`, `renderInsights()`, `SKILLS`/`skillOf()`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gagner de l'XP de façon fiable (Priority: P1)

Chaque action éligible rapporte de l'XP une seule fois selon le barème du prototype, avec un
« pop » « +60 XP · Record sur un test » et, en cas de passage de niveau, « Niveau atteint : N » + son `enter`.

| Action | XP | Clé de déduplication |
|---|---|---|
| Séance importée (`session`) | 10 | fichier source |
| Record sur un test (`record_test`) | 60 | test + valeur du record |
| Record sur un scénario (`record_scen`) | 40 | scénario + score |
| Jour d'entraînement (`streak_day`) | 15 | date |
| Post publié (`post`) | 20 | id du post |
| Compte lié (`link`) | 30 | fournisseur |
| Défi terminé (`challenge`) | 250 | id du défi |
| Secret découvert (`secret`, spec 011) | 250 | clé du secret |
| Routine terminée (`routine`) | 25 | routine + date |

**Why this priority**: Cœur de la motivation ; toutes les autres mécaniques (coins, paliers, badges) s'y accrochent.

**Independent Test**: Déclencher chaque source deux fois : l'XP n'est comptée qu'une fois ; l'historique affiche la ligne avec date et libellé.

**Acceptance Scenarios**:

1. **Given** un fichier CSV déjà importé, **When** il est réimporté, **Then** aucune XP supplémentaire.
2. **Given** 290 XP, **When** +10 XP, **Then** le niveau passe à 2 (seuil 300) et le pop de niveau s'affiche 500 ms après le pop d'XP.
3. **Given** un utilisateur qui appelle directement l'API pour s'attribuer de l'XP, **When** la requête arrive, **Then** elle est refusée (aucune RPC publique d'attribution arbitraire).

---

### User Story 2 - Passer les tests d'aim et enregistrer mes records (Priority: P1)

Page Tests : 5 tests jouables (Flick 20 cibles 42 px +0,25 s/raté ; Précision 15 cibles 20 px +0,5 s/raté ;
Réaction 5 essais, délai 0,9-3 s, clic anticipé = « trop tôt » ; Tracking 20 s cible 64 px, % sur cible ;
Switching 20 alternances 48 px +0,25 s/raté). Les records sont enregistrés sur le compte.

**Why this priority**: Les records de test alimentent le rang (70 %) et des XP/coins.

**Independent Test**: Jouer un test, battre son record, voir « Nouveau record » et le record sur un autre appareil.

**Acceptance Scenarios**:

1. **Given** un résultat meilleur que le record (plus bas pour s/ms, plus haut pour %), **When** le test se termine, **Then** le record est mis à jour et +60 XP.
2. **Given** un résultat hors bornes plausibles (ex. réaction < 80 ms moyenne, flick < 3 s), **When** il est soumis, **Then** il est rejeté comme invalide.
3. **Given** un visiteur non connecté, **When** il joue, **Then** le résultat s'affiche mais n'est pas enregistré, avec une invitation à créer un compte.

---

### User Story 3 - Importer mes séances Kovaak's et voir ma progression (Priority: P1)

Page Ma progression : glisser-déposer des CSV Kovaak's (ou choisir fichiers/dossier). Jade extrait
scénario, date (nom de fichier `Scénario - Challenge - AAAA.MM.JJ-HH.MM.SS`), score, précision
(hit/miss). Affichage : statistiques (séances, scénarios, record, progression %, précision moyenne),
courbe SVG par scénario, série de jours, delta moyen 7 jours, répartition par compétence.

**Why this priority**: Principale source d'XP et d'assiduité (30 % du rang).

**Independent Test**: Importer 3 CSV du même scénario à des dates différentes → courbe à 3 points, +30 XP, +15 coins (005).

**Acceptance Scenarios**:

1. **Given** des fichiers non-CSV ou illisibles, **When** importés, **Then** toast « Aucune nouvelle séance (2 fichiers non reconnus) ».
2. **Given** une seule séance sur un scénario, **When** il est sélectionné, **Then** « Il faut au moins deux séances sur ce scénario pour tracer une courbe. »
3. **Given** « Effacer mes données », **When** confirmé, **Then** les séances sont supprimées du compte (l'XP déjà gagnée reste acquise).

---

### User Story 4 - Niveau, pass de progression et badges (Priority: P2)

Onglet « Niveau et XP » : carte de niveau (niveau, XP totale, barre, « X / Y XP vers le niveau N+1 »),
8 badges (Première séance, 10 séances, 50 séances, 7 jours de suite, 30 jours de suite, Les 5 tests,
3 posts, Compte lié), historique, pass de progression à 10 paliers (niveau 5 à 100).

**Acceptance Scenarios**:

1. **Given** niveau 10 atteint, **When** l'utilisateur ouvre le pass, **Then** les paliers 5 et 10 sont « Débloqué », les suivants affichent l'XP cumulée requise.
2. **Given** un palier débloqué qui donne un cosmétique (ex. niveau 5 « Cadre de profil bronze »), **When** il est atteint, **Then** l'objet est ajouté à l'inventaire (spec 006).

---

### User Story 5 - Rang compétitif (Priority: P2)

Le rang (Fer → Jade, 10 paliers) est calculé sur les performances : 70 % score d'aim (moyenne
normalisée des records, au moins 3 tests sur 5) + 30 % assiduité (séances sur 30 jours et série).
L'XP n'entre pas dans le calcul.

**Acceptance Scenarios**:

1. **Given** 2 tests faits, **When** l'utilisateur ouvre son rang, **Then** « Pas encore classé — 2 sur 5 faits » + bouton « Passer les tests ».
2. **Given** 920 points, **When** la carte s'affiche, **Then** rang « Maître », « 20 points avant Grand Maître », barres Aim/Assiduité, échelle des rangs avec le rang courant surligné.

### Edge Cases

- Fuseau horaire : les jours de série sont calculés dans le fuseau de l'utilisateur (stocké dans le profil).
- CSV avec date dans le futur ou > 5 ans : rejeté.
- Plus de 50 séances importées le même jour : XP plafonnée (50 × 10 XP/jour max) pour limiter la triche par fichiers forgés.
- Niveau 100 atteint : l'XP continue d'être comptée mais la barre reste pleine.
- Suppression de séances : le rang est recalculé (assiduité) ; l'XP acquise n'est pas retirée.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: L'attribution d'XP DOIT être exclusivement serveur, via un moteur interne unique appelé par les RPC métier (import, test, post, liaison, défi, routine, secret) ; aucune RPC publique ne permet d'attribuer une quantité arbitraire (hors admin, spec 008).
- **FR-002**: Chaque attribution DOIT être enregistrée dans un journal avec type, clé de déduplication unique par utilisateur, montant, métadonnées et date.
- **FR-003**: Le niveau DOIT suivre la courbe du prototype : 300 XP pour passer du niveau 1 au 2, puis `300 + (N-1) × 180` pour passer de N à N+1 ; plafond niveau 100 (902 880 XP cumulés).
- **FR-004**: Tout gain d'XP DOIT déclencher dans la même transaction le gain de coins associé (spec 005).
- **FR-005**: Les records de test DOIVENT être validés côté serveur (bornes de plausibilité par test) et ne remplacer le record que s'ils sont meilleurs.
- **FR-006**: L'import CSV DOIT être parsé côté client (fichiers jamais envoyés bruts) puis soumis en lot au serveur qui déduplique par nom de fichier et valide dates/scores.
- **FR-007**: Le système DOIT calculer série de jours consécutifs, grille des 7 derniers jours (lettres D L M M J V S), delta de score moyen 7 j vs 7 j précédents, et répartition par compétence (Flick/clicking, Tracking, Précision, Switching, Réaction, Autres) selon les mots-clés `SKILLS`.
- **FR-008**: Le rang DOIT être calculé côté serveur : `aim = moyenne(norm(test))` sur ≥ 3 tests avec les repères `REFS` (flick 12↔30 s, précision 18↔45 s, réaction 180↔400 ms, tracking 85↔30 %, switching 14↔35 s) ; `assiduité = min(100, séances30j/20×100)×0,6 + min(100, série/14×100)×0,4` ; `points = round((aim×0,7 + assiduité×0,3)×10)` ; seuils `RANKS` (Fer 0, Bronze 150, Argent 280, Or 420, Platine 550, Diamant 680, Élite 790, Maître 880, Grand Maître 940, Jade 980).
- **FR-009**: Les badges DOIVENT être évalués côté serveur selon les critères `BADGES`.
- **FR-010**: Le pass de progression DOIT afficher les 10 paliers `TIERS` et octroyer automatiquement les récompenses cosmétiques implémentées.
- **FR-011**: Les « pops » XP et niveau DOIVENT être déclenchés par la réponse serveur (pas par le client seul).
- **FR-012**: Les 5 moteurs de test DOIVENT reproduire à l'identique règles, tailles et pénalités du prototype, avec HUD (compteur, chrono) et overlay de résultat.

### Key Entities

- **Événement d'XP** (`xp_events`) ; **Séance** (`training_sessions`) ; **Record de test** (`test_records`) + **Tentative** (`test_attempts`, pour l'anti-triche) ; **Palier** (`TIERS`, constante) ; **Badge** (constante + évaluation) ; **Rang** (calculé, mis en cache dans `profiles`).

## Success Criteria *(mandatory)*

- **SC-001**: 0 double attribution d'XP possible (tests pgTAP sur chaque source).
- **SC-002**: La courbe d'un scénario à 200 séances s'affiche en < 200 ms.
- **SC-003**: Le rang affiché est identique au calcul du prototype pour un même jeu de données (tests unitaires de parité).
- **SC-004**: Import de 500 CSV en < 15 s.

## Assumptions

- Les données de séance restent **déclaratives** (fichiers locaux) ; la lutte anti-triche se limite à la validation de plausibilité et aux plafonds quotidiens. Les défis restent validés par vidéo (spec 007).
- Les repères de rang sont provisoires, recalibrables par l'admin (table de paramètres).

## Écarts assumés vis-à-vis du prototype

- `streak_day` n'est plus déduit uniquement des CSV importés : un jour compte s'il contient une séance importée, un test terminé ou une routine marquée faite.
- Le compteur « Temps sur Jade » est serveur (spec 003).
- Plafond quotidien d'XP d'import (absent du prototype).
