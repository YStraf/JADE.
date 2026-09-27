# Feature Specification: Communauté — forum, réactions, signalements, défis hebdomadaires

**Feature Branch**: `007-communaute-defis`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Section 2.8 du brief ; prototype : `CATS`, `catColor()`, `seedPosts`, `renderPosts()`, `ytId()`, modale `#postModal`, `liked`, bouton « Signaler », page `#defis` (`nextMonday()`, `cd()`, `board`, `applyChallenge()`), règles et « Règlement des défis » (LEGAL).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Lire et publier sur le forum (Priority: P1)

Le forum liste les posts (avatar, auteur avec mini-profil, catégorie colorée, date relative, titre,
texte, vidéo YouTube intégrée). Filtre par catégorie : Tout, Perf (jade), Conseil (bleu), Setup
(violet), Défi hebdo (ambre), Recrutement (rouge). Un joueur connecté publie via la modale
« Nouveau post » (catégorie, titre, message, lien YouTube facultatif) et gagne 20 XP.

**Why this priority**: Dans le prototype les posts ne sont visibles que par leur auteur (localStorage) : c'est la première vraie fonctionnalité communautaire.

**Independent Test**: A publie, B voit le post immédiatement, filtre « Setup » le masque s'il est en « Perf ».

**Acceptance Scenarios**:

1. **Given** un titre vide, **When** « Publier », **Then** « Ajoute un titre. » ; message < 10 caractères → « Écris au moins quelques mots. » ; lien non YouTube → « Seuls les liens YouTube sont acceptés pour l'instant. »
2. **Given** un post valide, **When** publié, **Then** il apparaît en tête, la modale se ferme, toast « Post publié », +20 XP.
3. **Given** un visiteur non connecté, **When** il clique « Publier », **Then** la modale de connexion s'ouvre.
4. **Given** une vidéo YouTube, **When** le post s'affiche, **Then** elle est intégrée via `youtube-nocookie.com` en chargement différé.
5. **Given** une catégorie sans post, **When** filtrée, **Then** « Pas encore de post dans cette catégorie. Lance le premier. »

---

### User Story 2 - Réagir et signaler (Priority: P1)

Bouton « GG N » (bascule) et « Signaler » (motif) sur chaque post.

**Acceptance Scenarios**:

1. **Given** un post, **When** A clique « GG », **Then** le compteur augmente de 1 pour tout le monde ; re-clic → annulation.
2. **Given** « Signaler », **When** A choisit un motif et confirme, **Then** toast « Post signalé à la modération » et un signalement est créé (un seul par utilisateur et par post).
3. **Given** un post signalé par 5 utilisateurs distincts, **When** le 5ᵉ signalement arrive, **Then** le post est masqué automatiquement en attente de modération.

---

### User Story 3 - Défi de la semaine (Priority: P1)

Page Défis : défi en cours (titre, scénario Kovaak's / Aim Lab, consigne, lot), compte à rebours
jours/heures/minutes jusqu'au lundi 00:00, bouton « Soumettre mon score » (score + lien vidéo),
classement (rang, joueur, score, statut vidéo : « Validée » / « En attente » / « Pas requise »),
podium mis en valeur, règles et lien vers le règlement complet.

**Why this priority**: Rituel hebdomadaire central et source majeure de coins (100-300).

**Independent Test**: Trois comptes soumettent des scores ; le classement se met à jour en direct chez tous ; à la clôture, les récompenses sont versées.

**Acceptance Scenarios**:

1. **Given** un joueur qui soumet un score inférieur à son meilleur, **When** il valide, **Then** seul le meilleur score de la semaine est conservé.
2. **Given** un joueur dans le top 3 sans vidéo, **When** le classement s'affiche, **Then** son statut est « Vidéo requise » et il est invité à la fournir.
3. **Given** un nouveau score soumis par un autre joueur, **When** il arrive, **Then** le classement se met à jour sans rechargement (temps réel).
4. **Given** lundi 00:00 (Europe/Paris), **When** le défi se clôture, **Then** le classement final est figé, les récompenses (250 XP + coins selon rang, spec 005) sont versées une seule fois, et le défi suivant devient actif.
5. **Given** un score manifestement impossible (au-delà du record officiel connu configuré), **When** il est soumis, **Then** il est marqué « à vérifier » et exclu du podium tant qu'un modérateur ne l'a pas validé.

---

### User Story 4 - Réponses aux posts (Priority: P3)

Répondre à un post (fil simple, non imbriqué) ; l'auteur est notifié si « Réponses sur le forum » est activé.

### Edge Cases

- Post d'un compte supprimé : auteur « Compte supprimé », avatar neutre, pas de mini-profil.
- Post masqué par la modération : invisible pour tous sauf auteur (bandeau « Masqué par la modération ») et staff.
- Anti-spam : 5 posts / heure / compte ; liens hors YouTube interdits dans le corps (remplacés par du texte).
- Aucun défi configuré pour la semaine : la page affiche « Prochain défi annoncé bientôt ».
- Égalité de score : départage par date de soumission la plus ancienne.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Les posts DOIVENT être stockés côté serveur, visibles par tous (visiteurs compris), triés du plus récent au plus ancien, paginés (20 par page).
- **FR-002**: Seul un utilisateur connecté, non banni, peut publier ; l'auteur est le compte (le champ « Pseudo » de la modale du prototype disparaît).
- **FR-003**: Validation serveur : titre 1-120, message 10-4 000, catégorie ∈ `CATS`, vidéo = URL YouTube valide (formats `youtu.be/`, `watch?v=`, `shorts/`, `embed/`).
- **FR-004**: Réactions « GG » uniques par (post, utilisateur), compteur agrégé.
- **FR-005**: Signalements uniques par (post, utilisateur) avec motif ; masquage automatique au seuil configurable (défaut 5).
- **FR-006**: La publication d'un post DOIT attribuer l'XP `post` (spec 004) une seule fois.
- **FR-007**: Un seul défi actif à la fois, avec semaine (lundi-dimanche, Europe/Paris), titre, scénarios, consigne, lot ; configuré par l'admin (spec 008).
- **FR-008**: Chaque participant n'a qu'une entrée par défi (meilleur score conservé) ; les 3 premiers doivent fournir une vidéo validée par un modérateur pour conserver leur place.
- **FR-009**: Le classement DOIT être diffusé en temps réel.
- **FR-010**: La clôture DOIT être automatique (planifiée) et idempotente, et déclencher les récompenses (spec 005/US3).
- **FR-011**: Le compte à rebours DOIT viser le prochain lundi 00:00 Europe/Paris et se rafraîchir toutes les 30 s.
- **FR-012**: La participation aux défis DOIT rester gratuite et sans avantage lié à l'abonnement (règlement).

### Key Entities

- **Post** (`forum_posts`), **Réaction** (`forum_reactions`), **Signalement** (`forum_reports`), **Réponse** (`forum_replies`, P3).
- **Défi** (`challenges`), **Entrée de classement** (`challenge_leaderboard`).

## Success Criteria *(mandatory)*

- **SC-001**: Un post publié est visible par un autre utilisateur en < 2 s.
- **SC-002**: Mise à jour du classement chez les spectateurs en < 2 s après une soumission.
- **SC-003**: 100 % des défis clôturés dans les 5 minutes suivant lundi 00:00, sans double récompense.

## Assumptions

- Les 4 posts d'exemple du prototype (Straf, Nsx, Luma, Kyro) et le classement d'exemple ne sont **pas** importés en production (seed de développement uniquement).
- Le défi initial du prototype (« Tracking fluide sur cible volante », Air / Motionshot) sert de seed.
- Le lot du défi reste un texte libre saisi par l'admin ; la remise du lot est manuelle (hors plateforme).

## Écarts assumés vis-à-vis du prototype

- « Signaler » crée un vrai signalement (le prototype affichait seulement un toast).
- Statut vidéo à trois états (« Validée », « En attente », « Pas requise ») au lieu de deux.
