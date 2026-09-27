# Feature Specification: Contenu d'entraînement — routines, parcours guidé, optimisation, convertisseur

**Feature Branch**: `009-contenu-entrainement`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Section 2.7 du brief (hors tests d'aim et suivi de séances, traités en 004) ; prototype : `routines` (9 routines Kovaak's / Aim Lab), `renderRoutines()`, `GOALS`, `GOAL_TYPE`, `renderWizard()`, `opti`, `renderOpti()`, `conv()`, mini-test de l'accueil (`#arena`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Trouver et suivre une routine (Priority: P1)

Page Routines : filtres Logiciel (Kovaak's / Aim Lab, mémorisé), Niveau (Tous niveaux, Débutant,
Intermédiaire, Avancé), Jeu (Tous les jeux, CS2, Valorant). Chaque routine est un accordéon : titre,
tags (niveau, jeu, types), durée ; blocs (minutes, scénario, consigne) ; note ; bouton « Séance faite »
(+25 XP, une fois par routine et par jour).

**Why this priority**: Contenu principal du site.

**Independent Test**: Filtrer « Aim Lab / Intermédiaire / CS2 » → « Micro-ajustements » ; « Séance faite » deux fois le même jour → XP une seule fois.

**Acceptance Scenarios**:

1. **Given** un filtre sans résultat, **When** appliqué, **Then** « Aucune routine <logiciel> pour ce filtre pour l'instant. »
2. **Given** une routine « Tous » jeux, **When** filtre CS2, **Then** elle reste affichée.
3. **Given** un visiteur non connecté, **When** « Séance faite », **Then** invitation à se connecter pour gagner l'XP.

---

### User Story 2 - Parcours guidé « Trouver mon programme » (Priority: P2)

Trois questions (objectif : Débuter proprement, Améliorer mes flicks, Améliorer mon tracking, Gagner
en précision, Préparer une compétition ; jeu : CS2 / Valorant / Les deux ; temps : 20 / 30 / 45 min) →
2 routines max du logiciel choisi, triées par proximité de durée, avec conseil de fréquence et test
de référence à refaire après 3 semaines. Le programme choisi est mémorisé (encart « Programme suivi » de la vitrine).

**Acceptance Scenarios**:

1. **Given** « Améliorer mon tracking / Les deux / 30 min » sur Kovaak's, **When** « Voir mon programme », **Then** « Tracking fluide » en premier et toast « Programme prêt ».
2. **Given** aucune correspondance, **When** validé, **Then** « Aucune routine ne correspond encore… Essaie l'autre logiciel ou un autre objectif. »

---

### User Story 3 - Optimisation PC et convertisseur de sensibilité (Priority: P2)

Checklists par onglet (Windows, Carte graphique, CS2, Valorant) avec progression « N sur M réglages
faits » et barre ; convertisseur CS2 ↔ Valorant (sensi, DPI, résolution) affichant sensi équivalente
(CS2→Val : `s × 0,022 / 0,07`, 3 décimales ; Val→CS2 : `s × 0,07 / 0,022`, 2 décimales), eDPI, cm/360
(`360 / (s × yaw × dpi) × 2,54`) et la note sur le 4:3 étiré.

**Acceptance Scenarios**:

1. **Given** sensi CS2 = 2, DPI 800, **When** conversion, **Then** Valorant 0,629, eDPI 1600, 26,0 cm/360.
2. **Given** une sensi vide ou ≤ 0, **When** saisie, **Then** « – » partout.
3. **Given** des cases cochées, **When** l'utilisateur revient (connecté, autre appareil), **Then** la checklist est restaurée.

---

### User Story 4 - Mini-test de l'accueil (Priority: P3)

Accueil : arène de 20 cibles, chrono, précision, ratés (+0,25 s), « Nouveau record », meilleur temps.

### Edge Cases

- Routine supprimée par l'admin alors qu'elle est dans le programme mémorisé : l'encart indique « Programme à refaire ».
- Contenu des routines non traduit : affiché en français dans toutes les langues (note `content_fr`).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Les routines DOIVENT être stockées en base (administrables, spec 008), avec seed des 9 routines du prototype (contenu à l'identique).
- **FR-002**: Filtres et comportement de `renderRoutines()` reproduits ; logiciel mémorisé.
- **FR-003**: « Séance faite » DOIT appeler une RPC qui attribue `routine` (25 XP, clé routine + date locale) et compte comme jour d'entraînement (série).
- **FR-004**: L'algorithme du parcours guidé DOIT reproduire `renderWizard()` (niveaux par objectif, filtre par type si disponible, tri par écart de durée, 2 résultats).
- **FR-005**: Le choix du parcours et la checklist d'optimisation DOIVENT être persistés pour un utilisateur connecté (localement sinon).
- **FR-006**: Le convertisseur DOIT reproduire exactement les formules et textes de `conv()`.
- **FR-007**: Le mini-test de l'accueil DOIT reproduire le prototype ; son meilleur temps est local (non classé).

### Key Entities

- **Routine** (`routines`) et **Bloc** (`routine_blocks`) ; **Routine faite** (`routine_completions`) ; **Programme suivi** (`training_plans`) ; **Checklist d'optimisation** (`optimization_checks`).

## Success Criteria *(mandatory)*

- **SC-001**: Les 9 routines du prototype sont présentes à l'identique (test de snapshot du seed).
- **SC-002**: Les résultats du convertisseur sont identiques au prototype sur 50 cas de test.
- **SC-003**: Le parcours guidé renvoie les mêmes routines que le prototype pour les 30 combinaisons objectif × jeu × temps (par logiciel).

## Assumptions

- Le contenu d'optimisation (checklists) reste du contenu versionné dans le dépôt (`src/content/optimization.ts`), pas en base.
- Le mini-test de l'accueil ne rapporte ni XP ni coins (les tests de la page Tests s'en chargent).
