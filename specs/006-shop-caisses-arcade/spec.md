# Feature Specification: Shop — caisses, inventaire, Arcade et garde-fous

**Feature Branch**: `006-shop-caisses-arcade`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Section 2.5 du brief (+ point de vigilance légale) ; prototype : page `#shop`, `CRATE_POOLS`, `CRATE_COST`, `RARITY_W`, `RARITY_COLOR`, `rollCrate()`, `openCrate()`, `playOpenAnim()`, `addInv()`/`inventory()`, `spinWheel()`, pile ou face (`data-cf`), grille mystère (`renderMystery()`), `renderShopTabs()`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ouvrir une caisse (Priority: P1)

Onglet **Caisses** : trois caisses — 🖼️ Statique (150 coins, bannières et contours fixes),
✨ Animée (350, cosmétiques animés plus rares), 🎁 Mixte (220, titres, cadres, bannières).
« Ouvrir » débite le coût, puis une bande horizontale de 40 objets défile (roulette type
CS/FACEIT) et ralentit pendant ~4,2 s pour s'arrêter sur l'objet gagné sous le repère central ;
« Tu as obtenu : <objet> » + étiquette de rareté colorée (commun gris, rare bleu, épique violet,
légendaire or). L'objet rejoint l'inventaire.

**Why this priority**: Principal débouché des coins, demandé explicitement.

**Independent Test**: Avec 150 coins, ouvrir la Caisse Statique : solde 0, un objet de la liste Statique en inventaire, animation qui s'arrête exactement sur lui.

**Acceptance Scenarios**:

1. **Given** un solde < coût, **When** « Ouvrir », **Then** toast « Pas assez de Jade Coins », aucun débit.
2. **Given** un solde suffisant, **When** « Ouvrir », **Then** le résultat est tiré **par le serveur** avant l'animation, et l'animation se termine sur cet objet.
3. **Given** `prefers-reduced-motion`, **When** une caisse est ouverte, **Then** le résultat s'affiche directement sans défilement.
4. **Given** la limite quotidienne d'ouvertures atteinte, **When** « Ouvrir », **Then** message « Limite du jour atteinte, reviens demain » et aucun débit.
5. **Given** une caisse, **When** l'utilisateur clique « Voir les probabilités », **Then** la liste des objets et le pourcentage exact de chaque rareté et de chaque objet s'affichent.

---

### User Story 2 - Inventaire et utilisation des objets (Priority: P1)

L'inventaire liste les objets obtenus (nom, type bannière/contour/titre, rareté, date, quantité) ;
un objet possédé est sélectionnable dans la Vitrine du profil (spec 003).

**Independent Test**: Obtenir « Contour Émeraude », l'appliquer dans la Vitrine, le voir sur le mini-profil.

**Acceptance Scenarios**:

1. **Given** un doublon obtenu, **When** l'inventaire s'affiche, **Then** l'objet apparaît une fois avec « ×2 ».
2. **Given** un objet d'inventaire, **When** l'utilisateur cherche à le vendre, l'échanger ou le donner, **Then** aucune option n'existe.

---

### User Story 3 - Comment gagner des coins (Priority: P1)

Onglet **Comment gagner des coins** : barème de la spec 005 (lu depuis les paramètres serveur),
avec la mention « Tout se gagne en jouant, rien ne s'achète ».

---

### User Story 4 - Arcade (Priority: P3)

Onglet **Arcade** (réservé aux comptes majeurs) : **Roue Jade** (mise 20, multiplicateurs jusqu'à ×10),
**Pile ou Face** (mise 10, double ou rien), **Grille Mystère** (mise 15, 3×3, une case gagnante, ×6).
Mention « Jeux de divertissement sans valeur réelle. Limités par jour pour rester amusants, pas addictifs. »

**Why this priority**: Divertissement annexe, et zone de risque réglementaire la plus forte : livré en dernier, derrière un interrupteur.

**Independent Test**: Compte majeur : jouer jusqu'à la limite quotidienne ; compte mineur : onglet remplacé par un message explicatif.

**Acceptance Scenarios**:

1. **Given** un compte de moins de 18 ans, **When** il ouvre l'onglet Arcade, **Then** « L'Arcade est réservée aux joueurs majeurs » et aucun jeu jouable (refus aussi côté serveur).
2. **Given** la Roue, **When** « Lancer — 20 coins », **Then** la mise est débitée, le serveur tire le segment, la roue tourne ~3,9 s (≥ 4 tours) et s'arrête sur ce segment ; « Gagné : N coins (×M) » ou « Perdu, retente ta chance ».
3. **Given** Pile ou Face, **When** l'utilisateur choisit « Pile », **Then** « pile — gagné, +20 coins » ou « face — perdu ».
4. **Given** la Grille, **When** une case est choisie, **Then** « Trouvé ! +90 coins » ou « Perdu, la case était la N » puis la grille se réinitialise.
5. **Given** la limite quotidienne de parties atteinte, **When** l'utilisateur rejoue, **Then** refus avec l'heure de réinitialisation.
6. **Given** l'option « Me retirer de l'Arcade » activée par le joueur, **When** il revient, **Then** l'Arcade reste masquée pendant la durée choisie (7, 30 jours ou définitivement).

### Edge Cases

- Fermeture de l'onglet pendant l'animation : l'objet est déjà en inventaire ; à la réouverture, le Shop affiche « Dernière ouverture : <objet> ».
- Double clic sur « Ouvrir » : une seule ouverture (bouton désactivé + idempotence par identifiant de requête).
- Objet retiré du catalogue : n'est plus tirable, reste dans les inventaires existants.
- Arcade désactivée globalement par l'admin : onglet masqué.
- Changement de jour : les limites se réinitialisent à minuit heure de Paris.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le Shop DOIT présenter trois onglets (Caisses, Arcade, Comment gagner des coins) avec la pastille de solde (spec 005).
- **FR-002**: Le tirage DOIT être réalisé côté serveur, avec un aléa cryptographique, pondéré par rareté selon `RARITY_W` (commun 60, rare 28, épique 10, légendaire 2 par objet), puis journalisé (utilisateur, caisse, objet, coût, date).
- **FR-003**: Les probabilités effectives DOIVENT être affichées publiquement pour chaque caisse (valeurs actuelles : Statique commun 72,6 % / rare 22,6 % / épique 4,0 % / légendaire 0,8 % ; Animée rare 70 % / épique 25 % / légendaire 5 % ; Mixte commun 63,8 % / rare 29,8 % / épique 5,3 % / légendaire 1,1 %).
- **FR-004**: Le débit, le tirage et l'ajout à l'inventaire DOIVENT être atomiques.
- **FR-005**: L'animation DOIT reproduire celle du prototype (40 cartes de 120 px, gagnant en position 34, décalage aléatoire ±15 px, 4,2 s `cubic-bezier(.1,.7,.05,1)`, affichage du résultat à 4,4 s) et respecter le mouvement réduit.
- **FR-006**: Garde-fous légaux, obligatoires avant mise en production :
  - aucun achat de coins, aucune conversion en argent, aucun échange/transfert/revente d'objet ;
  - limites quotidiennes configurables : ouvertures de caisses (défaut 5/jour) et parties d'Arcade (défaut 15/jour) ;
  - Arcade réservée aux comptes majeurs (vérifié serveur) et désactivable globalement ;
  - auto-exclusion de l'Arcade par le joueur (7 j, 30 j, définitive) ;
  - mention « divertissement sans valeur réelle » sur chaque écran de tirage ;
  - probabilités publiées (FR-003) ;
  - espérance de gain de chaque jeu d'Arcade ≤ 1 (aucune stratégie ne crée de coins).
- **FR-007**: Roue : 8 segments visuels `[×0, ×0,5, ×1, ×1, ×2, ×3, ×5, ×10]` pondérés côté serveur (défaut 35/25/10/10/12/5/2/1 → espérance ×0,915). Pile ou face : 50/50, gain ×2 (espérance ×1). Grille : 1 chance sur 9, gain ×6 (espérance ×0,67).
- **FR-008**: L'inventaire DOIT être persistant, consultable dans le Shop et le profil, sans action de vente/échange.
- **FR-009**: Hooks `useInventory()`, `useCrates()`, `useOpenCrate()`, `useArcade()`.
- **FR-010**: Le catalogue (caisses, objets, raretés, poids, actif/inactif) DOIT être administrable (spec 008).

### Key Entities

- **Objet cosmétique** (`cosmetic_items`) : clé, nom, type (banner/frame/title), rareté, animé, source (crate/tier/secret/premium).
- **Caisse** (`crates_catalog`) + **contenu** (`crate_items`).
- **Ouverture** (`crate_openings`) ; **Partie d'Arcade** (`arcade_plays`).
- **Objet possédé** (`inventory_items`) : utilisateur, objet, quantité, source, première obtention.

## Success Criteria *(mandatory)*

- **SC-001**: Sur 100 000 tirages simulés, chaque rareté observée est à ±0,5 point de la probabilité publiée.
- **SC-002**: L'animation s'arrête sur l'objet réellement attribué dans 100 % des cas.
- **SC-003**: Espérance empirique de chaque jeu d'Arcade ≤ 1 sur 100 000 parties simulées.
- **SC-004**: 0 ouverture/partie au-delà des limites quotidiennes (tests pgTAP + concurrence).

## Assumptions

- Les doublons sont conservés (quantité) sans conversion en coins, pour ne pas créer de valeur de « revente ».
- Les objets animés (Contour Pulse, Flux Jade, Prisme, Bannière Aurore Mouvante, Particules, Comète) sont réalisés en CSS/SVG animés, figés en mouvement réduit.
- Les limites par défaut (5 caisses, 15 parties/jour) sont des propositions à valider avec un conseil juridique.

## Écarts assumés vis-à-vis du prototype

- La Roue du prototype a des segments équiprobables → espérance ×2,81 (génération infinie de coins) : rééquilibrée.
- Tirage déplacé côté serveur (le prototype utilisait `Math.random()` côté client… dans un script qui ne s'exécutait pas).
- Ajout : probabilités affichées, limite quotidienne des caisses, restriction d'âge et auto-exclusion de l'Arcade.
