# Feature Specification: Authentification et comptes

**Feature Branch**: `002-auth-comptes`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Section 2.2 (comptes) + section 4 points 1-2 du brief ; prototype : modale `#authModal`, `openAuth()`, `signIn()`, `DEF_USER`, `paintAcct()`, `ROLES`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Créer un compte (Priority: P1)

Un visiteur clique « Se connecter » → « Créer un compte », saisit pseudo, email, mot de passe
et date de naissance, accepte les CGU, puis confirme son email. Il arrive sur son profil avec
le toast « Bienvenue, <pseudo> » et le son `enter`.

**Why this priority**: Tout ce qui persiste (XP, coins, forum, défis) exige un compte réel — c'est le problème n°1 du prototype.

**Independent Test**: Créer un compte sur une base vide, confirmer l'email, vérifier la ligne `profiles` créée et le bouton compte avec initiales.

**Acceptance Scenarios**:

1. **Given** la modale en mode inscription, **When** le pseudo est vide, **Then** l'erreur « Choisis un pseudo. » s'affiche.
2. **Given** un email invalide, **When** l'utilisateur valide, **Then** « Entre un email valide. » s'affiche.
3. **Given** un pseudo déjà pris (insensible à la casse), **When** l'utilisateur valide, **Then** « Ce pseudo est déjà pris. » s'affiche sans créer de compte.
4. **Given** une date de naissance indiquant moins de 15 ans, **When** l'utilisateur valide, **Then** l'inscription est refusée avec un message expliquant la limite d'âge.
5. **Given** une inscription valide, **When** l'email de confirmation est cliqué, **Then** l'utilisateur est connecté, un profil est créé avec les valeurs par défaut de `DEF_USER` (plan Gratuit, préférences, notifications) et 0 XP / 0 coins.

---

### User Story 2 - Se connecter / se déconnecter (Priority: P1)

Un joueur existant se connecte par email + mot de passe ; le bouton du header affiche ses initiales
(ou son avatar) et son pseudo ; le menu propose « Mon profil » et « Se déconnecter ».

**Why this priority**: Indissociable de l'inscription.

**Independent Test**: Connexion, rechargement (session conservée), déconnexion (retour à l'accueil si on était sur `/profil`).

**Acceptance Scenarios**:

1. **Given** des identifiants corrects, **When** l'utilisateur valide, **Then** la session est ouverte et persiste après rechargement.
2. **Given** des identifiants incorrects, **When** l'utilisateur valide, **Then** un message générique « Email ou mot de passe incorrect. » s'affiche (pas d'indication sur l'existence du compte).
3. **Given** un utilisateur connecté sur `/profil`, **When** il se déconnecte, **Then** il est renvoyé à l'accueil avec le toast « Se déconnecter ».
4. **Given** un compte banni, **When** il se connecte, **Then** il voit un écran expliquant la suspension (motif, date) et ne peut effectuer aucune action d'écriture.

---

### User Story 3 - Mot de passe oublié et changement de mot de passe (Priority: P2)

**Independent Test**: Demander un lien de réinitialisation, définir un nouveau mot de passe (≥ 8 caractères, confirmation identique), se reconnecter.

**Acceptance Scenarios**:

1. **Given** l'onglet Sécurité du profil, **When** les deux mots de passe diffèrent, **Then** « Les deux mots de passe diffèrent » s'affiche.
2. **Given** moins de 8 caractères, **When** l'utilisateur enregistre, **Then** « 8 caractères minimum » s'affiche.
3. **Given** un changement réussi, **When** il est enregistré, **Then** les autres sessions sont révoquées.

---

### User Story 4 - Rôles serveur (Priority: P1)

Les rôles Membre, Support, Modérateur, Administrateur sont stockés et vérifiés côté serveur.
Un membre ne peut ni lire ni modifier les rôles ; seul un administrateur peut les attribuer (spec 008).

**Why this priority**: Remplace le hash admin en dur ; prérequis à toute policy RLS élevée.

**Independent Test**: Tests pgTAP : un membre qui tente `insert into admin_roles` est refusé ; `has_role('moderator')` renvoie vrai pour un modérateur.

**Acceptance Scenarios**:

1. **Given** aucun administrateur, **When** la commande d'amorçage est lancée avec l'email du propriétaire, **Then** ce compte devient administrateur (aucun identifiant dans le code).
2. **Given** un membre, **When** il appelle une RPC d'administration, **Then** l'appel échoue avec une erreur « forbidden ».

---

### User Story 5 - Connexion sociale (Priority: P3)

Boutons « Continuer avec Google » (OAuth Supabase) et « Continuer avec Steam » (OpenID) ; à la
première connexion, l'utilisateur choisit son pseudo et sa date de naissance.

**Acceptance Scenarios**:

1. **Given** une première connexion Google, **When** le retour OAuth aboutit, **Then** l'utilisateur doit compléter pseudo + date de naissance avant d'accéder au reste du site.

### Edge Cases

- Double clic sur « Créer un compte » : une seule requête.
- Email non confirmé : message « Vérifie ta boîte mail » + bouton « Renvoyer l'email » (limité à 1/min).
- Tentatives répétées : limitation de débit Supabase Auth + captcha (Turnstile) après 5 échecs.
- Pseudo avec caractères interdits ou > 24 caractères : refus côté client ET contrainte en base.
- Suppression du compte pendant une session ouverte ailleurs : la session suivante est invalide.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT permettre l'inscription par email + mot de passe (≥ 8 caractères) avec confirmation d'email.
- **FR-002**: Le pseudo DOIT être unique (insensible à la casse), 3 à 24 caractères, lettres/chiffres/`_`/`-`/`.`.
- **FR-003**: La date de naissance DOIT être demandée à l'inscription, stockée de façon privée, et l'inscription refusée sous 15 ans. Le système DOIT exposer un indicateur « majeur » (≥ 18 ans) sans révéler la date.
- **FR-004**: L'acceptation des CGU et de la politique de confidentialité DOIT être enregistrée (version + date).
- **FR-005**: Un profil DOIT être créé automatiquement à la création du compte avec les valeurs par défaut du prototype (`DEF_USER`).
- **FR-006**: Le header DOIT refléter l'état de session (bouton « Se connecter » ou avatar + pseudo + menu).
- **FR-007**: Les rôles élevés DOIVENT être stockés dans `admin_roles` et vérifiés par fonctions serveur ; aucun hash/identifiant admin côté client.
- **FR-008**: Un compte banni NE DOIT pouvoir écrire nulle part (posts, réactions, économie, profil), vérifié par RLS.
- **FR-009**: Réinitialisation de mot de passe par email et changement depuis le profil, avec révocation des autres sessions.
- **FR-010**: OAuth Google DOIT être disponible ; Steam est optionnel (P3).
- **FR-011**: Tous les messages d'erreur DOIVENT être traduits et ne pas révéler l'existence d'un compte.

### Key Entities

- **Compte (auth.users)** : géré par Supabase Auth.
- **Profil (`profiles`)** : identité publique (pseudo, plan, préférences) — étendu en 003.
- **Données privées (`profiles_private`)** : date de naissance, acceptation CGU.
- **Rôle élevé (`admin_roles`)** : `support` | `moderator` | `admin` ; absence de ligne = Membre.

## Success Criteria *(mandatory)*

- **SC-001**: Un visiteur crée un compte et arrive sur son profil en moins de 2 minutes (hors délai email).
- **SC-002**: 100 % des tentatives d'écriture d'un rôle par un non-admin sont refusées (tests pgTAP).
- **SC-003**: 0 identifiant, hash ou secret d'administration dans le bundle client (vérifié par recherche dans le build).

## Assumptions

- Âge minimum 15 ans sans parcours de consentement parental en v1 (cohérent avec la politique de confidentialité du prototype : « pas destiné aux moins de 15 ans sans accord parental »). Un parcours parental pourra être ajouté plus tard.
- Les emails transactionnels passent par le SMTP configuré dans Supabase (fournisseur UE).
- Steam n'est pas un fournisseur natif Supabase : il nécessitera une Edge Function OpenID ; d'où la priorité P3.

## Écarts assumés vis-à-vis du prototype

- Le prototype ne vérifie ni n'enregistre le mot de passe (« Version de démonstration ») : ici, vraie authentification.
- Suppression de l'accès admin par identifiant/mot de passe dédié : l'admin est un utilisateur normal avec le rôle `admin`.
