# Feature Specification: Socle applicatif (structure, navigation, thème, langues, sons, intro)

**Feature Branch**: `001-socle-application`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Sections 2.1 (structure générale) et 2.10 (détails d'expérience, hors easter eggs) du brief `docs/PROMPT_REBUILD_JADE.md` ; prototype `prototype/index.html` (routeur `route()`, `applyTheme`, `seg()`, `SFX`, `S`/`EXTRA`/`t()`, intro, footer, `404.html`).

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Naviguer entre toutes les pages du site (Priority: P1)

Un visiteur arrive sur Jade et navigue entre Accueil, Routines, Tests, Optimisation, Actus,
Sécurité, Défis, Shop, Forum, Application, Formules, Ma progression, Profil, Joueur, Légal et
Admin via un header fixe, avec une transition fluide entre pages et un lien actif souligné en jade.

**Why this priority**: Sans coque applicative, aucune autre fonctionnalité n'est accessible.

**Independent Test**: Ouvrir chaque URL, vérifier que la page (même vide) s'affiche avec le header,
le footer, le bon lien actif, et que le bouton retour du navigateur fonctionne.

**Acceptance Scenarios**:

1. **Given** un visiteur sur `/`, **When** il clique « Routines », **Then** l'URL devient `/routines`, le lien porte `aria-current="page"`, la page défile en haut.
2. **Given** un ancien lien `/#forum` (prototype), **When** il est ouvert, **Then** le visiteur est redirigé vers `/forum`.
3. **Given** une URL inconnue, **When** elle est ouverte, **Then** la page 404 stylée (« Cible manquée… ») s'affiche avec un bouton « Revenir à l'accueil ».
4. **Given** un écran mobile (< 900 px), **When** le visiteur ouvre le menu, **Then** tous les liens restent accessibles au doigt et au clavier.

---

### User Story 2 - Choisir thème, langue et sons (Priority: P1)

Le visiteur bascule entre thème sombre (défaut) et clair, choisit sa langue parmi 🇫🇷 🇬🇧 🇪🇸 🇩🇪 🇮🇹 🇵🇱,
et active/coupe les sons d'interface ; ses choix sont mémorisés.

**Why this priority**: Identité visuelle et accessibilité de base ; tout le reste en dépend (tokens, i18n).

**Independent Test**: Changer chaque préférence, recharger, vérifier la persistance ; se connecter
et vérifier qu'elles sont synchronisées avec le profil.

**Acceptance Scenarios**:

1. **Given** premier chargement, **When** la page s'affiche, **Then** le thème est sombre, la langue est le français, les sons sont coupés.
2. **Given** le toggle thème, **When** il est activé, **Then** la palette claire s'applique sans flash au rechargement suivant.
3. **Given** la langue « English », **When** elle est choisie, **Then** tous les libellés traduits changent immédiatement, un toast « Language changed » apparaît, et une note indique que le contenu des routines/actus reste en français.
4. **Given** les sons activés, **When** le visiteur survole ou clique un bouton, **Then** les sons `hover`, `click` du prototype sont joués (Web Audio, volumes identiques).

---

### User Story 3 - Intro animée au premier chargement (Priority: P2)

À la première visite de la session, un splash plein écran affiche un fond animé (grille qui défile,
points, anneaux de visée), un terminal qui tape `jade --start` puis 3 lignes « ok », puis le mot
« JADE. » lettre par lettre, avec « Entrer sur Jade » et « Passer l'intro ».

**Why this priority**: Signature de marque, mais non bloquante.

**Independent Test**: Nouvelle session → intro visible ; Entrée/Espace/Échap ferment ; « Revoir l'intro » dans le footer la rejoue.

**Acceptance Scenarios**:

1. **Given** une nouvelle session, **When** le site s'ouvre, **Then** l'intro est affichée et le focus est sur « Entrer sur Jade ».
2. **Given** `prefers-reduced-motion: reduce`, **When** l'intro s'affiche, **Then** aucun canvas animé ni frappe : le mot « JADE. » et `> jade --start` s'affichent directement.
3. **Given** l'intro déjà vue dans la session, **When** l'utilisateur navigue, **Then** elle ne réapparaît pas.

---

### User Story 4 - Footer, SEO et installation (Priority: P3)

Le footer propose les liens légaux (Mentions, Confidentialité, Cookies, CGU, CGV, Règlement des
défis), « Préférences cookies », « Revoir l'intro », la mention d'indépendance et le point discret
d'accès admin. Chaque page publique a titre, description et image Open Graph (`og.png`).
Le site est installable (PWA) quand le navigateur le propose.

**Why this priority**: Visibilité et conformité, sans impact fonctionnel immédiat.

**Independent Test**: Vérifier les balises meta de chaque page, le manifest, et le bouton « Installer Jade » sur navigateur compatible.

**Acceptance Scenarios**:

1. **Given** un partage de `/defis` sur un réseau social, **When** l'aperçu est généré, **Then** titre, description et image 1200×630 apparaissent.
2. **Given** un navigateur qui émet `beforeinstallprompt`, **When** l'événement arrive, **Then** un bouton « Installer Jade » apparaît dans le footer.

---

### Edge Cases

- Stockage local indisponible (navigation privée) : les préférences retombent sur les valeurs par défaut sans erreur.
- Langue non supportée demandée par le navigateur : repli sur le français.
- Traduction manquante pour une clé : repli en → fr → clé brute (même ordre que `t()` du prototype).
- API View Transitions absente : navigation instantanée sans erreur.
- Audio bloqué par le navigateur tant qu'il n'y a pas eu d'interaction : les sons démarrent au premier clic.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Le système DOIT exposer une route par page : `/`, `/routines`, `/tests`, `/optimisation`, `/actus`, `/securite`, `/defis`, `/forum`, `/application`, `/formules`, `/shop`, `/progression`, `/profil/[onglet]`, `/joueur/[pseudo]`, `/legal/[document]`, `/admin/[onglet]`.
- **FR-002**: Le système DOIT rediriger les anciennes ancres du prototype (`#accueil`, `#opti`, `#tarifs`, `#app`, etc.) vers les nouvelles routes.
- **FR-003**: Le header DOIT contenir logo « Jade. », navigation principale, sélecteur de langue, bouton son, toggle thème et bouton compte/connexion ; il devient opaque avec ombre après 8 px de défilement.
- **FR-004**: Le thème sombre DOIT être le défaut ; les deux palettes DOIVENT reprendre exactement les tokens du prototype (`--bg #0B0F0D`, `--jade #2EE88A`, clair `--jade #00A862`, etc.) et les polices Chakra Petch (titres) / Manrope (texte).
- **FR-005**: Les préférences thème, langue, sons, intro vue DOIVENT persister localement pour un visiteur anonyme et être synchronisées avec le profil pour un utilisateur connecté (le profil gagne en cas de conflit).
- **FR-006**: Toutes les chaînes DOIVENT provenir de fichiers de traduction `react-i18next` (fr source + en, es, de, it, pl) reprenant les clés `S` et `EXTRA` du prototype.
- **FR-007**: Le composant de segments (`seg()`) DOIT offrir une pastille qui glisse sous l'option active, être navigable au clavier (flèches) et exposer `aria-pressed`.
- **FR-008**: Les sons (`hover` 880 Hz 50 ms, `click` 520→780 Hz, `enter` accord 330/494/660 Hz) DOIVENT être désactivés par défaut et respecter le toggle.
- **FR-009**: Toute animation DOIT être désactivée si `prefers-reduced-motion: reduce` ou si la préférence « Animations » du profil est coupée.
- **FR-010**: Le système DOIT fournir un système de toasts (2,4 s) et de « pop » XP/coins empilés (3,2 s, `aria-live="polite"`).
- **FR-011**: Le site DOIT fournir manifest PWA, icônes, service worker minimal (cache des assets statiques), page 404 stylée, balises OG/Twitter et JSON-LD `WebSite`.
- **FR-012**: Le raccourci `Ctrl+Shift+A` et le triple-clic sur le point discret du footer DOIVENT mener à `/admin` (l'accès reste protégé par les rôles, cf. spec 008).

### Key Entities

- **Préférences d'interface** : thème, langue, sons, animations, intro vue — stockées localement et, si connecté, dans le profil (spec 003).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100 % des 16 pages sont atteignables par URL directe et par la navigation.
- **SC-002**: Aucun flash de thème incorrect au chargement (vérifié sur 20 rechargements en thème clair).
- **SC-003**: Score Lighthouse Accessibilité ≥ 95 et Performance ≥ 90 sur l'accueil (mobile).
- **SC-004**: 0 chaîne d'interface en dur détectée par la règle de lint i18n.

## Assumptions

- Le contenu éditorial (routines, actus) reste en français dans toutes les langues, comme dans le prototype.
- Le domaine définitif n'est pas encore choisi (`VOTRE-DOMAINE` dans le prototype) : il est paramétré par variable d'environnement.
- La vidéo de fond d'intro (`INTRO_VIDEO`) reste optionnelle et vide par défaut.

## Écarts assumés vis-à-vis du prototype

- Routage par chemins réels au lieu de `#hash` (SEO, partage des profils publics) avec redirection des anciens liens.
- Le lien « Profil » n'apparaît plus dans la nav : il est remplacé par le bouton compte (comportement déjà présent dans `paintAcct()`).
