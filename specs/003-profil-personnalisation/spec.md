# Feature Specification: Profil, personnalisation, profil public et mini-profil

**Feature Branch**: `003-profil-personnalisation`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Section 2.2 + 2.8 (mini-profil) du brief ; prototype : `renderProfile()`, `TABS`, `tabBody()`, `ustyle()`, `BANNERS`, `FRAMES`, `WIDGETS`, `showcaseHTML()`, `customHTML()`, `readImage()`, `avatarAttr()`, `bannerAttr()`, `publicProfileHTML()`, `miniCard()`, `bindMini()`, `playTime()`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gérer mon compte (Priority: P1)

Dans « Mon profil », onglet **Compte**, le joueur modifie pseudo, email et bio (240 caractères),
et importe un avatar qu'il recadre (zoom, position horizontale/verticale).

**Why this priority**: Identité de base visible partout (forum, classements, mini-profil).

**Independent Test**: Modifier pseudo/bio, importer une image, recharger sur un autre appareil : les changements sont là.

**Acceptance Scenarios**:

1. **Given** un pseudo vide, **When** « Enregistrer », **Then** toast « Le pseudo ne peut pas être vide ».
2. **Given** un email modifié, **When** « Enregistrer », **Then** un email de confirmation est envoyé à la nouvelle adresse (changement effectif après clic).
3. **Given** une image > 4 Mo ou non-image, **When** importée, **Then** toast « Image trop lourde (4 Mo max) » / « Choisis une image ».
4. **Given** une image valide, **When** importée, **Then** elle est redimensionnée (320 px max, JPEG 82 %), stockée, et les curseurs Zoom (100-320 %), Horizontal et Vertical (0-100 %) apparaissent avec aperçu en direct.

---

### User Story 2 - Personnaliser ma vitrine (Priority: P1)

Onglet **Vitrine** : choisir une bannière (Aurore, Nuit, Grille, Points, Carbone, Viseur, Coucher,
Glace + celles débloquées), un contour d'avatar (Aucun, Jade, Acier, Ambre, Violet, Pointillé, Double +
débloqués), un titre affiché, et les encarts de vitrine (Records aux tests, Meilleurs scénarios,
Compétences, Série et temps, Badges, Rang détaillé, Programme suivi). Un aperçu de la vitrine est
affiché au-dessus, avec le bouton « Voir mon profil public ».

**Why this priority**: Cœur de la motivation cosmétique (et débouché des caisses du Shop).

**Independent Test**: Choisir bannière + contour + encarts ; vérifier que la page publique et le mini-profil reflètent le choix.

**Acceptance Scenarios**:

1. **Given** un contour choisi, **When** l'utilisateur clique dessus, **Then** il est appliqué immédiatement à l'aperçu, au bouton du header et au mini-profil.
2. **Given** un objet cosmétique obtenu (caisse, secret, palier), **When** l'utilisateur ouvre la Vitrine, **Then** il apparaît dans le sélecteur avec sa rareté.
3. **Given** une tentative d'appliquer un objet non possédé (requête forgée), **When** elle arrive au serveur, **Then** elle est refusée.
4. **Given** les encarts cochés, **When** la vitrine s'affiche, **Then** l'ordre suit celui de la liste `WIDGETS`.

---

### User Story 3 - Profil public et mini-profil (Priority: P1)

N'importe quel visiteur ouvre `/joueur/<pseudo>` et voit bannière, avatar + contour, pseudo, titre,
niveau, rang, bio et encarts. En survolant un pseudo n'importe où (forum, classement), une carte
flottante affiche bannière, avatar, rang, niveau, XP, séances, série, temps sur Jade et points de rang.

**Why this priority**: Dans le prototype, les profils des autres sont vides (« en ligne bientôt ») : c'est la valeur ajoutée directe du backend.

**Independent Test**: Deux comptes : A survole le pseudo de B sur le forum et voit les vraies stats de B.

**Acceptance Scenarios**:

1. **Given** B a désactivé « Profil visible », **When** A ouvre `/joueur/b`, **Then** une page « Ce profil est privé » s'affiche (pseudo seul).
2. **Given** B a désactivé « Afficher mes scores », **When** A consulte son profil ou mini-profil, **Then** records, courbes et scénarios sont masqués mais niveau et rang restent visibles.
3. **Given** un survol de 0 à 250 ms puis sortie, **When** la souris quitte le pseudo, **Then** la carte se ferme après 250 ms, sauf si la souris entre dans la carte.
4. **Given** un écran tactile, **When** l'utilisateur appuie sur un pseudo, **Then** la carte s'ouvre (appui long) ou le profil public s'ouvre (appui court).
5. **Given** un partage du lien `/joueur/kyro`, **When** l'aperçu social est généré, **Then** il montre avatar, pseudo, rang et niveau.

---

### User Story 4 - Préférences, notifications, abonnement, support (Priority: P2)

Onglets **Personnalisation** (thème clair, animations, sons, profil visible, afficher mes scores),
**Notifications** (récap hebdo, défi de la semaine, réponses forum, actus), **Abonnement**
(formules d'exemple Gratuit / Programme / Premium, facturation), **Support** (FAQ + formulaire de contact),
**Sécurité et liaisons** (mot de passe — cf. 002, A2F « Bientôt », liaisons Steam/FACEIT/Google/Riot, sessions).

**Independent Test**: Chaque toggle persiste côté serveur ; un message support crée un ticket visible par le staff.

**Acceptance Scenarios**:

1. **Given** un message support < 10 caractères, **When** « Envoyer », **Then** toast « Décris un peu plus ton problème ».
2. **Given** un message valide, **When** « Envoyer », **Then** un ticket est créé et le toast confirme « Réponse sous 48 h en moyenne ».
3. **Given** l'onglet Abonnement, **When** l'utilisateur clique « Choisir » sur Premium, **Then** toast « Les paiements ne sont pas encore actifs » (le plan n'est modifiable que par le serveur).
4. **Given** « Lier » Google, **When** l'utilisateur termine l'OAuth, **Then** l'identité est liée et l'XP « Compte lié » (30 XP) est attribuée une seule fois.

---

### User Story 5 - Mes données (RGPD) (Priority: P2)

Onglet **Données** : exporter toutes mes données en JSON, effacer mes séances importées, supprimer
définitivement mon compte.

**Independent Test**: Export → fichier `jade-donnees.json` contenant profil, XP, coins, inventaire, séances, posts ; suppression → reconnexion impossible, posts anonymisés.

**Acceptance Scenarios**:

1. **Given** « Exporter », **When** cliqué, **Then** un JSON complet est téléchargé en moins de 10 s.
2. **Given** « Supprimer mon compte », **When** l'utilisateur confirme en retapant son pseudo, **Then** compte, scores, inventaire, coins sont supprimés et ses posts affichent « Compte supprimé ».

### Edge Cases

- Changement de pseudo : ancien lien `/joueur/ancien` → 404 (pas de redirection, pour éviter l'usurpation) ; limite 1 changement / 30 jours.
- Pseudo contenant un mot interdit (liste de modération) : refus.
- Image EXIF orientée : corrigée avant redimensionnement.
- Objet cosmétique retiré du catalogue : l'utilisateur qui l'avait appliqué retombe sur la valeur par défaut (Aurore / Jade).
- Titre contenant une insulte : refusé par la liste de mots interdits.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: La page profil DOIT présenter les onglets Compte, Vitrine, Niveau et XP, Sécurité et liaisons, Personnalisation, Abonnement, Notifications, Support, Données, avec l'onglet courant dans l'URL (`/profil/<onglet>`), et un bloc d'identité (avatar + contour, pseudo, rang, barre de niveau).
- **FR-002**: Un visiteur non connecté sur `/profil` DOIT voir la carte « Se connecter / Créer un compte ».
- **FR-003**: L'avatar DOIT être importable (image ≤ 4 Mo, redimensionnée à 320 px) avec zoom 100-320 % et position X/Y 0-100 % ; stocké dans un espace de fichiers dont seul le propriétaire peut écrire le dossier.
- **FR-004**: La bannière DOIT être choisie parmi les bannières de base + possédées ; l'import d'une image de bannière (zoom 100-300 %, X/Y) est réservé aux administrateurs en v1.
- **FR-005**: Le serveur DOIT refuser toute bannière, tout contour ou tout titre de collection non possédé.
- **FR-006**: Le titre affiché DOIT être choisi parmi les titres **possédés** (Pass niveau 50 et 100, Caisse Mixte, secrets). Aucun titre libre pour les membres : seul un administrateur (rôle serveur) peut saisir un titre personnalisé (40 caractères max), qui remplace alors le titre débloqué. *(Décision du porteur de projet, 2026-09-27.)*
- **FR-007**: La vitrine DOIT afficher les encarts choisis dans l'ordre de `WIDGETS`.
- **FR-008**: La page publique `/joueur/<pseudo>` DOIT respecter « Profil visible » et « Afficher mes scores », être rendue côté serveur avec métadonnées OG.
- **FR-009**: Le mini-profil DOIT s'afficher au survol de tout élément auteur (`<PlayerName/>`) sur tout le site, positionné sans sortir de l'écran, et charger ses données en < 300 ms (cache).
- **FR-010**: Le « Temps sur Jade » DOIT être compté côté serveur par un battement d'activité (onglet visible), plafonné à 1 minute réelle par minute.
- **FR-011**: Les préférences (`prefs`, `notif`, préférences d'interface) DOIVENT être persistées dans le profil.
- **FR-012**: Le formulaire support DOIT créer un ticket (sujet parmi : Problème technique, Abonnement et paiement, Signaler un contenu, Signaler une arnaque, Autre).
- **FR-013**: L'export DOIT inclure toutes les données de l'utilisateur ; la suppression DOIT effacer le compte et anonymiser ses posts.
- **FR-014**: Le plan d'abonnement NE DOIT PAS être modifiable par l'utilisateur tant que le paiement n'existe pas.

### Key Entities

- **Profil étendu** : bio, avatar (+zoom/X/Y), bannière (clé ou image +zoom/X/Y), contour, titre, encarts, préférences, notifications, temps sur le site.
- **Objet cosmétique possédé** : voir spec 006 (`inventory_items`).
- **Ticket support** : auteur, sujet, message, statut, réponses.

## Success Criteria *(mandatory)*

- **SC-001**: Le mini-profil d'un autre joueur affiche ses vraies statistiques (0 carte « en ligne bientôt »).
- **SC-002**: Import + recadrage d'avatar en moins de 30 s.
- **SC-003**: 100 % des tentatives d'application d'un cosmétique non possédé sont refusées (tests pgTAP).
- **SC-004**: Export RGPD complet en < 10 s pour un compte de 1 000 séances.

## Assumptions

- Les liaisons FACEIT et Riot restent affichées « Bientôt » (APIs partenaires non disponibles) ; Steam dépend de 002/US5.
- A2F reste « Bientôt » en v1 (Supabase MFA TOTP pourra l'activer plus tard).
- Les couleurs d'accent (`prefs.accent`) restent fixées à « jade » en v1.

## Écarts assumés vis-à-vis du prototype

- Import d'avatar ouvert à tous (le prototype le réservait à l'admin, « arrivera avec les comptes en ligne »).
- Les liaisons ne sont plus des bascules factices : seules les vraies liaisons OAuth comptent (et rapportent l'XP).
- Le changement de plan « démo » est retiré.
