# Feature Specification: Panel d'administration et modération

**Feature Branch**: `008-administration`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Section 2.6 du brief + section 4 point 2 ; prototype : `ADMIN_HASH`, `renderAdmin()`, `ADM_TABS` (Tableau de bord, Utilisateurs et rôles, Mon apparence admin, Modération forum, Contenu, Défi de la semaine, Journal, Paramètres), `admLog()`, `allUsers()`, `grantXP()`, `ROLES`, `applyChallenge()`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Accéder au panel selon mon rôle (Priority: P1)

Un membre du staff ouvre `/admin` (raccourci `Ctrl+Shift+A` ou triple-clic sur le point du footer).
L'accès est décidé par son rôle serveur, sans identifiant/mot de passe dédié. Les onglets visibles
dépendent du rôle : **Support** (tickets, fiche utilisateur en lecture), **Modérateur** (+ modération
forum, signalements, validation des vidéos de défi, bannissement des membres), **Administrateur** (tout).

**Why this priority**: Remplace l'authentification par hash en dur du prototype ; prérequis à tous les onglets.

**Independent Test**: Un membre sur `/admin` voit « Accès réservé » ; un modérateur voit ses onglets seulement ; un appel RPC admin par un modérateur est refusé.

**Acceptance Scenarios**:

1. **Given** un visiteur non connecté, **When** il ouvre `/admin`, **Then** la page affiche le cadenas « Accès administrateur » et propose de se connecter.
2. **Given** un membre connecté, **When** il ouvre `/admin`, **Then** « Accès réservé à l'équipe Jade » (aucune donnée chargée).
3. **Given** un administrateur, **When** il ouvre `/admin`, **Then** il voit les 10 onglets et l'action est journalisée (« Connexion administrateur »).

---

### User Story 2 - Gérer les utilisateurs, rôles, XP, coins, sanctions (Priority: P1)

Onglet **Utilisateurs et rôles** : recherche par pseudo/email, tableau (joueur, email, rôle, XP,
coins, statut), changement de rôle (Membre, Support, Modérateur, Administrateur), attribution/retrait
d'XP (pas de 50, défaut 500) et de **Jade Coins**, bannissement/débannissement avec **motif obligatoire**,
suppression de compte, et **fiche utilisateur** avec historique de modération (sanctions, posts
masqués, signalements, ajustements XP/coins).

**Why this priority**: Outil de base de l'équipe ; les coins manuels et l'historique sont explicitement demandés.

**Independent Test**: Donner 100 coins à B → B voit +100 « Ajustement de l'équipe » ; bannir B sans motif → refusé ; la fiche de B liste les deux actions.

**Acceptance Scenarios**:

1. **Given** l'admin sur sa propre ligne, **When** il clique « Bannir », **Then** « Tu ne peux pas te bannir toi-même ».
2. **Given** le dernier administrateur, **When** on tente de lui retirer le rôle, **Then** refus « Il doit rester au moins un administrateur ».
3. **Given** un retrait de 500 XP à un joueur qui en a 300, **When** validé, **Then** son XP tombe à 0 (jamais négatif) et l'historique enregistre −300.
4. **Given** toute action de cet onglet, **When** elle est effectuée, **Then** une entrée horodatée apparaît dans le Journal (acteur, action, cible, détails).
5. **Given** un modérateur, **When** il tente de bannir un autre modérateur ou un admin, **Then** refus.

---

### User Story 3 - Modérer le forum (Priority: P1)

Onglet **Modération forum** : file des signalements (post, motifs, nombre), liste des posts
(auteur, titre, catégorie, GG, statut) avec **Masquer** / **Rétablir** / **Supprimer** (motif requis,
confirmation), et rappel des règles de modération du prototype.

**Acceptance Scenarios**:

1. **Given** un post signalé, **When** le modérateur le masque avec un motif, **Then** il disparaît du forum public, les signalements passent « acceptés », l'auteur voit le bandeau « Masqué par la modération ».
2. **Given** un signalement infondé, **When** « Rejeter », **Then** le post reste visible et le signalement est clos.

---

### User Story 4 - Défi de la semaine et contenu (Priority: P2)

Onglet **Défi de la semaine** : créer/planifier les défis (titre, scénario Kovaak's, scénario Aim Lab,
consigne, lot, score plausible max) — « Titre et scénario obligatoires » ; valider/refuser les vidéos
du podium ; forcer la clôture en cas d'incident.
Onglet **Contenu** : CRUD des routines (logiciel, niveau, jeu, titre, durée, types, blocs, note) ;
statut de l'alimentation des actus.

**Acceptance Scenarios**:

1. **Given** un défi publié pour la semaine en cours, **When** l'admin enregistre, **Then** la page Défis l'affiche immédiatement (toast « Défi publié »).
2. **Given** une routine modifiée, **When** enregistrée, **Then** elle apparaît dans la page Routines et le parcours guidé.

---

### User Story 5 - Shop, paramètres, tableau de bord, journal (Priority: P2)

- **Shop** (nouveau) : objets cosmétiques (nom, type, rareté, animé, actif), contenu et coût des caisses, avec aperçu des probabilités recalculées.
- **Paramètres** : barème coins/XP, limites quotidiennes, interrupteur Arcade (espérance ≤ 1 contrôlée), seuil de masquage auto, repères de rang.
- **Tableau de bord** : comptes, inscriptions 7 j, actifs 7 j, rétention à 7 jours, posts, séances importées, scénarios suivis, signalements en attente, tickets ouverts, coins en circulation, ouvertures de caisses/jour.
- **Journal** : entrées immuables, filtres par acteur/action/cible/date, export CSV.
- **Mon apparence admin** : import d'avatar et de bannière personnalisés (zoom/position), titre libre (40 caractères), sans contrainte de possession.

**Acceptance Scenarios**:

1. **Given** un réglage d'Arcade dont l'espérance dépasse 1, **When** l'admin enregistre, **Then** refus avec l'espérance calculée affichée.
2. **Given** le Journal, **When** un admin cherche à le vider, **Then** aucune action ne le permet (journal immuable, contrairement au prototype).

---

### User Story 6 - Tickets support (Priority: P3)

Le rôle Support voit la file des tickets (spec 003), répond, change le statut.

### Edge Cases

- Action admin sur un compte supprimé entre-temps : message « Utilisateur introuvable ».
- Deux admins modifient le même défi : dernier enregistrement gagnant, les deux actions journalisées.
- Session admin inactive 30 min : ré-authentification demandée pour les actions sensibles (rôles, suppression, coins).
- Bannissement : le joueur est déconnecté de toutes ses sessions.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: L'accès au panel et à chaque action DOIT être contrôlé côté serveur par `admin_roles` (aucun secret côté client) ; matrice : Support ⊂ Modérateur ⊂ Administrateur, sauf rôles/paramètres/Shop/suppression réservés à l'Administrateur.
- **FR-002**: Chaque action d'administration DOIT être une RPC serveur qui écrit dans `admin_logs` dans la même transaction.
- **FR-003**: Le bannissement DOIT exiger un motif, révoquer les sessions et bloquer toute écriture (spec 002).
- **FR-004**: Attribution/retrait manuel d'XP et de Jade Coins bornés (±100 000 XP, ±10 000 coins par action), jamais de solde négatif, visibles dans l'historique du joueur (« Ajustement de l'équipe »).
- **FR-005**: Il DOIT toujours rester au moins un administrateur ; un utilisateur ne peut pas se bannir ni se retirer son propre rôle admin.
- **FR-006**: Fiche utilisateur avec historique de modération agrégé (sanctions, posts modérés, signalements émis/reçus, ajustements).
- **FR-007**: Gestion du catalogue Shop et des paramètres économiques avec validation (espérance ≤ 1, coûts > 0).
- **FR-008**: Journal immuable (aucune suppression, même par un admin), consultable et exportable.
- **FR-009**: Tableau de bord alimenté par des agrégats serveur (vue matérialisée rafraîchie toutes les 15 min).
- **FR-010**: Les interfaces DOIVENT reprendre libellés et notes du prototype (« Rôles : Membre (aucun droit), Support (répond aux tickets)… »).

### Key Entities

- **Rôle** (`admin_roles`, spec 002) ; **Entrée de journal** (`admin_logs`) ; **Sanction** (`user_sanctions`) ; **Paramètres** (`economy_settings`, `progression_settings`, `community_settings`).

## Success Criteria *(mandatory)*

- **SC-001**: 100 % des RPC d'administration refusent un utilisateur sans le rôle requis (pgTAP, une assertion par RPC et par rôle).
- **SC-002**: 100 % des actions d'administration produisent une entrée de journal.
- **SC-003**: Un modérateur traite un signalement (lecture → décision) en moins de 30 s.

## Assumptions

- Le premier administrateur est créé par la commande d'amorçage (spec 002) ; aucun identifiant n'est livré dans le code.
- « Forcer un niveau » du prototype devient une attribution d'XP classique (journalisée).

## Écarts assumés vis-à-vis du prototype

- Suppression de `ADMIN_HASH`, du déverrouillage par identifiant/mot de passe et du générateur d'empreinte (onglet Paramètres).
- Suppression de « Vider le journal » et de « Purge locale ».
- Ajouts demandés : coins manuels, gestion du Shop, historique par utilisateur ; ajout : tickets support.
