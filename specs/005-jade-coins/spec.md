# Feature Specification: Jade Coins — monnaie virtuelle gagnée en jouant

**Feature Branch**: `005-jade-coins`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Section 2.4 du brief (cœur de la demande) + section 4 point 3 ; prototype : `coins()`, `setCoins()`, `addCoins()`, `paintCoins()`, crochet `awardXP` (`coinTable`), onglet « Comment gagner des coins ».

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gagner des coins en m'entraînant (Priority: P1)

Chaque action d'entraînement éligible crédite des Jade Coins, en même temps que l'XP, avec un pop
« +25 coins · Record sur un test ». Barème :

| Source | Coins | Règle |
|---|---|---|
| Séance d'entraînement importée | +5 | par séance nouvelle, plafonné à 20 séances rémunérées par jour |
| Nouveau record personnel sur un test | +25 | à chaque record battu |
| Série de jours d'entraînement | +50 | chaque fois que la série atteint un multiple de 7 (7, 14, 21…) |
| Palier d'XP franchi | +75 | à chaque niveau multiple de 5 atteint (5, 10, 15…) |
| Défi hebdomadaire terminé | 100 à 300 | selon le classement final (voir US3) |

**Why this priority**: C'est la fonctionnalité demandée en priorité ; sans gain, le Shop n'a pas de sens.

**Independent Test**: Importer une séance, battre un record, franchir le niveau 5 : le solde et l'historique reflètent exactement +5, +25, +75, sans double compte si l'action est rejouée.

**Acceptance Scenarios**:

1. **Given** une action dont l'XP a déjà été accordée, **When** elle est rejouée, **Then** aucun coin n'est crédité (même clé de déduplication que l'XP).
2. **Given** une série qui passe de 6 à 7 jours, **When** le 7ᵉ jour est validé, **Then** +50 coins « série de 7 jours » ; à 8 jours, rien.
3. **Given** un gain d'XP qui fait passer du niveau 9 au 11, **When** il est attribué, **Then** +75 coins (un seul palier multiple de 5 franchi : 10).
4. **Given** 25 séances importées le même jour, **When** l'import se termine, **Then** 20 × 5 = 100 coins crédités et le toast mentionne le plafond.

---

### User Story 2 - Voir mon solde et mon historique (Priority: P1)

Le solde apparaît dans le Shop (pastille coin) et dans le menu du compte ; l'historique liste chaque
mouvement (date, motif, +/−, solde après).

**Independent Test**: Comparer la somme de l'historique au solde affiché.

**Acceptance Scenarios**:

1. **Given** un mouvement, **When** le solde change, **Then** toutes les pastilles de solde se mettent à jour sans rechargement.
2. **Given** un utilisateur qui tente de modifier son solde via l'API, **When** la requête arrive, **Then** elle est refusée.

---

### User Story 3 - Récompense du défi hebdomadaire (Priority: P2)

À la clôture d'un défi (lundi 00:00, heure de Paris), chaque participant validé reçoit des coins
selon son classement final, en plus des 250 XP « Défi terminé ».

| Classement final | Coins |
|---|---|
| 1ᵉʳ | 300 |
| 2ᵉ – 3ᵉ | 250 |
| 4ᵉ – 10ᵉ | 200 |
| Top 25 % (au-delà du 10ᵉ) | 150 |
| Autres participants avec score valide | 100 |

**Acceptance Scenarios**:

1. **Given** un défi clôturé, **When** la finalisation tourne deux fois, **Then** chaque participant n'est crédité qu'une fois.
2. **Given** un podium dont la vidéo n'est pas validée, **When** le défi est finalisé, **Then** le joueur est reclassé après les scores validés (règlement des défis).

---

### User Story 4 - Bonus Premium (Priority: P3)

Le brief prévoit « abonné premium → coins quotidiens bonus + caisse mensuelle exclusive ».
[NEEDS CLARIFICATION: un avantage acheté avec de l'argent réel qui donne des coins ou des tirages aléatoires rapproche le système d'une « loot box payante » (risque réglementaire, principe IV de la constitution). Options : (a) supprimer le bonus de coins et remplacer la caisse mensuelle par un cosmétique exclusif **non aléatoire** — recommandé ; (b) garder un petit bonus quotidien mais utilisable uniquement pour des achats non aléatoires ; (c) garder tel quel après avis juridique.]

**Acceptance Scenarios** (option a) :

1. **Given** un abonné Premium, **When** un nouveau mois commence, **Then** il reçoit un cosmétique exclusif du mois (déterministe) dans son inventaire.

### Edge Cases

- Deux onglets ouvrent une caisse au même instant avec un solde juste suffisant : une seule dépense réussit (verrou de ligne).
- Le solde ne peut jamais devenir négatif (contrainte base).
- Retrait admin supérieur au solde : le solde tombe à 0 et le journal enregistre le montant réellement retiré.
- Suppression du compte : les transactions sont supprimées avec le compte (aucune valeur à rembourser).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Les coins DOIVENT être crédités/débités exclusivement côté serveur, dans un journal append-only avec motif, montant signé, référence, clé de déduplication unique et solde après opération.
- **FR-002**: Le crédit de coins lié à une action DOIT se faire dans la même transaction que l'XP (crochet sur le moteur `award_xp`), sans double crédit si l'XP était déjà accordée.
- **FR-003**: Le barème (US1, US3) DOIT être paramétrable par l'administrateur sans déploiement.
- **FR-004**: Le solde DOIT être ≥ 0 en toutes circonstances et les débits concurrents sérialisés.
- **FR-005**: Il NE DOIT exister aucun moyen d'acheter des coins, de les convertir en argent, de les transférer à un autre joueur ou d'échanger des objets.
- **FR-006**: L'interface DOIT afficher la mention « Monnaie virtuelle gratuite, sans valeur réelle. Elle se gagne uniquement en jouant. » près de chaque solde affiché dans le Shop.
- **FR-007**: Hooks `useCoins()` (solde + historique paginé) et `useCoinsBalance()` (solde seul, temps réel).
- **FR-008**: Le bonus Premium DOIT respecter la décision prise sur US4.

### Key Entities

- **Transaction de coins** (`coins_transactions`) : utilisateur, montant signé, motif, référence, clé de dédup, solde après, date.
- **Solde** : colonne de cache `profiles.coins_balance`, dérivée du journal.
- **Barème** (`economy_settings`) : montants et plafonds.

## Success Criteria *(mandatory)*

- **SC-001**: Pour 100 % des comptes, `coins_balance = somme(coins_transactions.amount)` (vérification nocturne, alerte sinon).
- **SC-002**: 0 double crédit sur 10 000 attributions concurrentes simulées (test de charge pgTAP/pgbench).
- **SC-003**: Un joueur régulier (4 séances/jour, 1 record/semaine) peut ouvrir une Caisse Statique (150) en moins d'une semaine.

## Assumptions

- Barème du défi (US3) choisi pour respecter la fourchette « 100 à 300 » du brief ; ajustable.
- Le plafond de 20 séances rémunérées/jour vise à limiter la triche par CSV forgés (les séances sont déclaratives).

## Écarts assumés vis-à-vis du prototype

- Dans le prototype, le code des coins est placé dans un bloc `<script type="application/ld+json">` et **ne s'exécute jamais** ; les valeurs de `coinTable` (session 5, record_test 25, challenge 150) sont reprises, sauf le défi (150 fixe → 100-300 selon classement, conforme au brief) et le palier tous les 5 niveaux (annoncé mais non codé dans le prototype).
