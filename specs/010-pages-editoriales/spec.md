# Feature Specification: Pages éditoriales — Actus, Sécurité, Formules, Application, Légal, Cookies

**Feature Branch**: `010-pages-editoriales`

**Created**: 2026-09-27

**Status**: Draft

**Input**: Section 2.9 du brief ; prototype : `actus`, `renderActus()`, `FICHES`, `REMEDES`, `renderSecurite()`, `PLANS`, `PLAN_ROWS`, `PAY_FAQ`, `renderPricing()`, page `#app` (`appNotify`), `LEGAL` (6 documents), `renderLegal()`, `COOKIE_DEF`, `renderCookieBar()`, `reopenCookies()`.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Fiches Sécurité et signalement d'arnaque (Priority: P1)

Page Sécurité : 8 fiches dépliables (titre, niveau « critique » / « élevé » / « moyen », « Comment ça
marche », « Les signaux », « Le réflexe »), puis « Je me suis fait avoir, je fais quoi ? » (8 étapes
numérotées), puis « Signaler une arnaque » (≥ 15 caractères).

**Why this priority**: Contenu éditorial de valeur, à conserver tel quel ; le signalement devient réel.

**Independent Test**: Comparer mot pour mot les fiches au prototype ; envoyer un signalement → visible par les modérateurs.

**Acceptance Scenarios**:

1. **Given** un message < 15 caractères, **When** « Envoyer le signalement », **Then** « Décris un peu plus ce que tu as vu ».
2. **Given** un message valide (connecté ou non), **When** envoyé, **Then** un signalement `security_reports` est créé et le toast confirme l'envoi.
3. **Given** un moteur de recherche, **When** il indexe `/securite`, **Then** le contenu des fiches est présent dans le HTML initial.

---

### User Story 2 - Légal et cookies (Priority: P1)

Page Légal avec segments : Mentions légales, Confidentialité, Cookies, Conditions d'utilisation,
Conditions de vente, Règlement des défis (textes du prototype, champs « à compléter » mis en évidence
tant qu'ils ne sont pas renseignés). Bandeau cookies au premier passage : Strictement nécessaires
(toujours actifs), Mesure d'audience (désactivée par défaut), Publicité (non utilisée) ; boutons
« Tout refuser », « Personnaliser », « Tout accepter » ; lien « Préférences cookies » dans le footer.

**Why this priority**: Obligatoire avant ouverture publique (comptes réels, données personnelles).

**Acceptance Scenarios**:

1. **Given** une langue autre que le français, **When** un document légal s'affiche, **Then** le bandeau « Ces documents font foi en français… » apparaît.
2. **Given** « Tout refuser », **When** cliqué, **Then** aucun script de mesure n'est chargé et le toast « Seuls les cookies nécessaires sont actifs » s'affiche.
3. **Given** « Préférences cookies » dans le footer, **When** cliqué, **Then** le bandeau réapparaît.
4. **Given** 13 mois après le choix, **When** l'utilisateur revient, **Then** le consentement est redemandé.

---

### User Story 3 - Formules / tarifs (Priority: P2)

Page Formules : 3 cartes (Gratuit 0 € pour toujours, Programme 12 € achat unique, Premium 6 €/mois,
mise en avant « best »), comparatif (13 lignes `PLAN_ROWS`), FAQ paiement (5 questions `PAY_FAQ`).
« Commencer gratuitement » → inscription ou Routines ; autres boutons « Bientôt disponible ».

---

### User Story 4 - Actus (Priority: P2)

Page Actus : segment CS2 / Valorant ; rangées « Résultats esport » (score, vainqueur surligné, stats),
« Patch notes », « Veille et sécurité » (alertes avec « Réflexe »), étiquette « mise en page d'exemple »
tant que le contenu est fictif.

---

### User Story 5 - Page Application (Priority: P3)

Présentation de l'application à venir (fonctionnalités prévues, état d'avancement) et inscription
« Me prévenir » : un seul email le jour de la sortie, avec consentement explicite et désinscription.

**Acceptance Scenarios**:

1. **Given** un email invalide, **When** « Me prévenir », **Then** « Entre un email valide. »
2. **Given** un email valide et la case de consentement cochée, **When** envoyé, **Then** « Noté, tu seras prévenu à la sortie » et l'inscription est enregistrée (double opt-in par email).

### Edge Cases

- Signalement d'arnaque contenant un lien : stocké tel quel mais **jamais rendu cliquable** dans l'admin.
- Spam du formulaire de signalement / notification : limitation de débit + captcha pour les visiteurs anonymes.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Les textes des fiches Sécurité, des remèdes et des documents légaux DOIVENT être repris **à l'identique** du prototype (contenu versionné dans le dépôt, rendu côté serveur).
- **FR-002**: Les champs « à compléter » des documents légaux DOIVENT provenir d'une configuration unique (éditeur, SIREN, adresse, hébergeur, contact) et bloquer la mise en production tant qu'ils sont vides (contrôle CI).
- **FR-003**: Les signalements d'arnaque DOIVENT être stockés (`security_reports`) et consultables par les modérateurs.
- **FR-004**: Le consentement cookies DOIT être enregistré localement (et dans le profil si connecté), daté, renouvelé après 13 mois ; aucun script de mesure avant consentement.
- **FR-005**: Formules, comparatif et FAQ DOIVENT reprendre `PLANS`, `PLAN_ROWS`, `PAY_FAQ` ; aucun paiement n'est actif.
- **FR-006**: Les inscriptions « Me prévenir » DOIVENT exiger un consentement explicite et une confirmation par email.
- **FR-007**: Les actus DOIVENT être affichées depuis un contenu versionné en v1 ; une table `news_items` administrable est prévue en P3.

### Key Entities

- **Signalement d'arnaque** (`security_reports`) ; **Inscription notification appli** (`app_notify_signups`) ; **Consentement** (local + `profiles.ui_prefs.cookies`) ; **Actu** (`news_items`, P3).

## Success Criteria *(mandatory)*

- **SC-001**: 100 % du texte des 8 fiches, 8 remèdes et 6 documents légaux identique au prototype (test de comparaison automatisé).
- **SC-002**: 0 requête vers un service de mesure avant consentement (test e2e réseau).
- **SC-003**: Les pages éditoriales obtiennent un score SEO Lighthouse ≥ 95.

## Assumptions

- La mesure d'audience, si activée, utilisera un outil sans cookie tiers hébergé en UE (ex. Plausible/Matomo) — choix hors périmètre.
- Les textes légaux seront relus par un juriste avant ouverture (en particulier Arcade/caisses, spec 006).

## Écarts assumés vis-à-vis du prototype

- La politique cookies doit mentionner le stockage de session Supabase (cookies d'authentification strictement nécessaires) et la base de données en ligne (le prototype indique que « tout reste sur ton navigateur »).
- Les textes « Version de démonstration » / « rien n'est envoyé ailleurs » sont retirés partout où ils deviennent faux.
