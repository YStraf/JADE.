# Feature Specification: Secrets et easter eggs

**Feature Branch**: `011-secrets-easter-eggs`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Section 2.10 du brief (easter egg débloquant des cosmétiques exclusifs) ; prototype : `SECRETS` (`darkmatter`, `sakura`), `grantSecret()`, `rewardHTML()`, `openEgg()`, épreuve mémoire (`memoIntro`, `EGG_LEN = 6`), duel (`duelIntro`, 3 passes, < 350 ms), déclencheurs (5 clics sur le point du logo, code Konami, frappe de « sakura »).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Découvrir « Matière noire » (Priority: P2)

Cinq clics rapides (≤ 1,4 s d'écart) sur le point du logo « Jade. », ou le code Konami
(↑ ↑ ↓ ↓ ← → ← → B A) hors champ de saisie, ouvrent une modale : 9 cibles, 6 s'allument tour à
tour ; il faut reproduire la séquence sans erreur (erreur → « Raté, on recommence » et rejeu).
Réussite : bannière nébuleuse animée, double liseré violet/bleu, titre « Matière noire », appliqués
automatiquement, + 250 XP.

**Why this priority**: Détail de marque apprécié, mais non essentiel au lancement.

**Independent Test**: Déclencher, réussir, vérifier l'inventaire (3 objets) et la vitrine ; réussir une 2ᵉ fois → « Tu avais déjà cette récompense », pas d'XP.

**Acceptance Scenarios**:

1. **Given** un visiteur non connecté qui réussit, **When** la modale de récompense s'affiche, **Then** « Crée un compte pour garder cette récompense, puis recommence l'épreuve » + bouton « Créer un compte ».
2. **Given** une séquence soumise qui ne correspond pas à celle générée par le serveur, **When** elle est validée, **Then** aucune récompense.
3. **Given** le focus dans un champ texte, **When** le code Konami est tapé, **Then** rien ne se déclenche.

---

### User Story 2 - Découvrir « Sakura » (Priority: P3)

Taper « sakura » hors d'un champ de saisie ouvre le duel : 3 passes ; attendre le signe 待 puis
frapper dès que 斬 apparaît (délai 1,2 à 3,8 s) ; frapper trop tôt annule la passe ; moyenne < 350 ms
requise. Récompense : bannière pétales sur soleil rouge, contour rose/rouge, titre « Sakura », + 250 XP.

**Acceptance Scenarios**:

1. **Given** un clic avant le signe, **When** il arrive, **Then** « Trop tôt. Recommence la passe. »
2. **Given** une moyenne de 380 ms, **When** la 3ᵉ passe se termine, **Then** « Moyenne 380 ms. Il faut moins de 350 ms. » et remise à zéro.

### Edge Cases

- Mouvement réduit : pas d'animation de pétales/nébuleuse (visuels figés), l'épreuve reste jouable.
- Réponses forgées (temps de réaction < 100 ms, épreuve terminée plus vite que la séquence ne s'affiche) : refusées par le serveur.
- Secret retiré par l'admin : n'est plus attribuable, reste dans les inventaires.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Les déclencheurs DOIVENT reproduire ceux du prototype (5 clics / 1,4 s sur le point du logo, Konami, « sakura »), ignorés quand le focus est dans un champ.
- **FR-002**: Le serveur DOIT générer l'épreuve (séquence mémoire, délais du duel) avec un jeton à usage unique et valider la réponse (séquence exacte, durées plausibles, jeton non expiré ≤ 5 min).
- **FR-003**: La réussite DOIT octroyer les 3 objets (bannière, contour, titre) via l'inventaire (spec 006), les appliquer si l'utilisateur n'a pas déjà un titre, et attribuer 250 XP une seule fois (type `secret`, clé = secret).
- **FR-004**: Les secrets NE DOIVENT PAS rapporter de coins.
- **FR-005**: La modale DOIT reprendre textes, grille 3×3, états « Observe... », « À toi », « N / 6 », caractères 待 / 斬 et rendu des récompenses du prototype, avec le bouton « Aller les appliquer » → Vitrine.

### Key Entities

- **Défi secret** (`secret_challenges` : jeton, utilisateur, type, graine, expiration, consommé).
- **Objets secrets** : entrées `cosmetic_items` source `secret`.

## Success Criteria *(mandatory)*

- **SC-001**: 0 récompense accordée sur réponse forgée (tests pgTAP avec séquences/durées invalides).
- **SC-002**: Les deux épreuves sont jouables au clavier et à la souris.

## Assumptions

- Le point discret en bas à droite du footer reste l'accès **admin** (triple clic), comme dans le prototype ; l'easter egg cosmétique est sur le point du **logo** (le brief parle d'« easter egg dans le footer » : à confirmer, sans impact technique).

## Écarts assumés vis-à-vis du prototype

- Type d'XP `secret` au lieu de réutiliser `challenge` (journal plus lisible, pas de confusion avec les défis hebdo).
- Validation serveur par jeton (le prototype accordait la récompense côté client).
