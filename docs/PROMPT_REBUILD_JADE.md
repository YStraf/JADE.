# Contexte projet — Jade (site d'aim training CS2 / Valorant)

Tu reçois un prototype fonctionnel complet, écrit en HTML/CSS/JS vanilla en un
seul fichier (`index.html`, ~2700 lignes, tout en `localStorage`, sans backend).
Ce prototype sert de **spécification produit et fonctionnelle** : il faut le
reconstruire proprement en **React + Tailwind + Supabase**, en gardant l'esprit,
le design et toutes les fonctionnalités, mais avec une vraie architecture
(composants, base de données réelle, auth réelle, état serveur).

Utilise **spec-kit** pour structurer le travail : découpe ce document en specs
par domaine (auth, profil, shop, admin, etc.), génère les user stories et les
tâches à partir de ce qui suit.

---

## 1. Vue d'ensemble du produit

**Jade** est un site d'entraînement à l'aim (visée) pour les joueurs de CS2 et
Valorant. Univers visuel : thème sombre par défaut (vert "jade" `#2EE88A` en
accent), thème clair disponible, police display type "gaming/tech", ambiance
FACEIT/CS-esque mais en français.

Le prototype actuel n'a **aucun backend** : tout est stocké dans le
`localStorage` du navigateur (comptes, XP, coins, inventaire, posts, etc.), donc
rien n'est partagé entre utilisateurs. C'est le principal problème à résoudre
avec Supabase : faire persister tout ça côté serveur, avec de vrais comptes.

---

## 2. Fonctionnalités à reconstruire

### 2.1 Structure générale
- Navigation par onglets/pages : Accueil, Routines, Tests, Optimisation, Actus,
  Sécurité, Défis, Forum, Application, Formules (tarifs), Shop, Progression,
  Profil, Joueur (profil public), Légal, Admin.
- Header avec logo, nav, sélecteur de langue, bouton son (SFX on/off), toggle
  thème clair/sombre, bouton profil/connexion.
- Footer avec liens légaux, replay intro, easter egg discret (voir 2.10).
- Une **intro animée** au premier chargement (splash screen stylé).
- Système de **traductions multilingues** (objet `S` avec clés par langue,
  fonction `t()` pour récupérer une chaîne traduite + fusion avec `EXTRA` pour
  compléments).

### 2.2 Comptes utilisateurs & profils
- Inscription/connexion (email + mot de passe minimum). Structure utilisateur
  actuelle (`DEF_USER`) à reprendre et enrichir :
  - pseudo, avatar (image uploadable + attributs de position/zoom —
    `avatarAttr`), bannière de profil (`bannerAttr`), rôle (membre/mod/admin),
    XP, niveau, rang, coins, inventaire d'items cosmétiques.
- **Profil public** consultable par les autres joueurs (mini-profil au survol
  du pseudo ailleurs sur le site — voir `bindMini`).
- Page "Mon profil" avec onglets : compte, apparence (bannière/avatar/contour),
  progression, badges, notifications, sécurité, données personnelles (RGPD).

### 2.3 Système XP / Niveaux / Rangs
- `XP_RULES` : différentes actions rapportent de l'XP (import de séance,
  record sur un test, défi terminé, streak quotidien, etc.).
- `awardXP(type, key, extra)` : fonction centrale qui attribue l'XP, avec
  déduplication (`done{}`) pour ne pas farmer en spammant la même action.
- Système de niveaux avec courbe de progression, paliers (`TIERS`, `MAXLVL`).
- **Rangs** compétitifs séparés de l'XP (`RANKS`), calculés sur des critères de
  performance réelle (`aimScore`, `assiduity` = régularité d'entraînement) —
  PAS uniquement sur le temps passé.
- Badges de progression (`BADGES`) débloqués selon critères (nb de séances,
  streak, etc.).

### 2.4 Jade Coins — monnaie du site (⚠️ fonctionnalité récente, cœur de la
demande)
- **Monnaie virtuelle gratuite**, gagnée uniquement en jouant/s'entraînant
  (jamais achetable avec de l'argent réel) :
  - défi hebdomadaire terminé → 100-300 coins selon classement
  - séance d'entraînement importée → +5 coins
  - streak hebdomadaire (tous les 7 jours) → +50 coins
  - nouveau record personnel sur un test → +25 coins
  - palier d'XP franchi (tous les 5 niveaux) → +75 coins
  - abonné premium → coins quotidiens bonus + caisse mensuelle exclusive
- Crochet sur `awardXP` existant : chaque gain d'XP peut déclencher un gain de
  coins en parallèle (`addCoins`), sans dupliquer si déjà accordé.

### 2.5 Shop / Case opening
- Page Shop avec 3 onglets : Caisses, Arcade, "Comment gagner des coins".
- **3 caisses** à ouvrir avec les coins (`CRATE_POOLS`, `CRATE_COST`) :
  - Caisse **Statique** (150 coins) : bannières/contours fixes
  - Caisse **Animée** (350 coins) : cosmétiques animés, plus rares
  - Caisse **Mixte** (220 coins) : titres, cadres, bannières mélangés
- Système de **rareté pondérée** (`RARITY_W` : common/rare/epic/legend) avec
  probabilités type case-opening CS/FACEIT.
- **Animation d'ouverture** : défilement horizontal type "roulette" qui
  ralentit et s'arrête sur l'item gagné (`playOpenAnim`, `openCrate`),
  affichage avec tag de rareté coloré.
- Inventaire persistant des items obtenus (`addInv`, `inventory()`).
- **Onglet Arcade** (mini-jeux de divertissement, mises en coins) :
  - Roue de la fortune (mise 20 coins, multiplicateurs jusqu'à x10)
  - Pile ou face (mise 10 coins, double ou rien)
  - Grille mystère 3x3 (mise 15 coins, 1 case gagnante sur 9)
- ⚠️ **Point de vigilance légale à traiter dans la vraie version** : même en
  monnaie virtuelle gratuite, un système de tirage aléatoire avec objets à
  valeur perçue peut légalement s'apparenter à du gambling selon les
  juridictions, surtout avec un public potentiellement mineur. Prévoir :
  limite de mises/tentatives par jour, absence totale de conversion
  coins→argent réel dans un sens ou l'autre, mention claire "divertissement
  sans valeur réelle", vérification d'âge à l'inscription.

### 2.6 Panel Admin
- Accès caché (raccourci clavier + easter egg dans le footer), authentifié par
  un couple identifiant/mot de passe dont seul le hash SHA-256 est stocké
  (`ADMIN_HASH`, calculé sur `identifiant:motdepasse`) — **dans la vraie
  version, remplacer ça par un vrai rôle Supabase (RLS + policy `is_admin`)**.
- Onglets du panel (`ADM_TABS`) :
  - **Dashboard** : stats globales
  - **Utilisateurs & rôles** : liste des comptes, changement de rôle
    (membre/mod/support/admin), bannissement, attribution manuelle d'XP
  - **Mon apparence admin** : personnalisation libre du profil admin
  - **Modération forum** : suppression/masquage de posts
  - **Contenu** : gestion des routines/défis
  - **Défi de la semaine** : configuration du challenge en cours
  - **Journal** (`admLog`) : logs horodatés des actions admin
  - **Paramètres** généraux
- À ajouter dans la vraie version : attribution manuelle de Jade Coins,
  gestion des items du shop, modération plus fine avec historique par
  utilisateur.

### 2.7 Contenu d'entraînement
- **Routines** : programmes d'exercices avec objectifs et parcours guidés
  (`GOALS`, `GOAL_TYPE`).
- **Tests d'aim** (`TESTS`) avec système de records personnels (`bestOf`,
  `saveBest`).
- **Skills tracking** : suivi par compétence (`SKILLS`, `skillOf`) —
  catégorisation des scénarios par type de skill travaillé.
- **Convertisseur de sensibilité** entre jeux (`conv`).
- **Optimisation PC** : guides/checklist.

### 2.8 Communauté
- **Forum** : posts catégorisés (`CATS`), avec système de likes/réactions,
  couleur par catégorie (`catColor`).
- **Défis hebdomadaires** avec classement (`board`), scénario imposé,
  countdown (`cd`, `nextMonday`).
- **Système de streak** (série de connexions/entraînements consécutifs).
- **Mini-profil au survol** du pseudo n'importe où sur le site
  (`bindMini`) — affiche rang, niveau, stats de base.

### 2.9 Pages informatives
- **Actus** (jeu vidéo, patchs).
- **Sécurité** : fiches détaillées sur les arnaques courantes CS2/Valorant
  (`FICHES`), avec remèdes/conseils (`REMEDES`) — contenu à conserver tel
  quel, c'est du contenu éditorial de valeur.
- **Formules/Tarifs** (`PLANS`, `PLAN_ROWS`) : comparatif gratuit/premium,
  FAQ paiement (`PAY_FAQ`).
- **Application** : page présentant une appli mobile/desktop (à priori pas
  encore développée, juste vitrine).
- **Légal** (`LEGAL`) : mentions légales, CGU, politique de confidentialité,
  cookies (`COOKIE_DEF`).

### 2.10 Détails d'expérience utilisateur (à ne pas perdre)
- **Easter egg caché** dans le footer (`SECRETS`, système de séquence à
  cliquer) débloquant des items cosmétiques exclusifs.
- **Effets sonores** (SFX) activables/désactivables, sons de feedback UI.
- **Segments animés** (onglets avec transition fluide, `seg()`).
- **Accessibilité mouvement réduit** : `matchMedia('prefers-reduced-motion')`
  respecté partout où il y a des animations.
- **SEO/Partage** : image Open Graph (`og.png`), page 404 stylée.
- **PWA-ready** : pense installable (à voir si on garde ou si Next.js gère
  différemment).

---

## 3. Stack technique cible

- **Frontend** : React (Vite ou Next.js — à décider selon besoin de SSR pour
  le SEO des pages publiques/profils), Tailwind CSS pour le style (reprendre
  la palette : vert jade `#2EE88A` en accent, mode sombre par défaut via
  `darkMode: 'class'`).
- **Backend/Data** : Supabase
  - Auth Supabase (email/password minimum, OAuth optionnel plus tard)
  - Tables : `users` (profils étendus), `xp_events`, `coins_transactions`,
    `inventory_items`, `crates_catalog`, `forum_posts`, `forum_reactions`,
    `challenges`, `challenge_leaderboard`, `admin_roles`, `admin_logs`,
    `security_reports` (si formulaire de signalement)
  - RLS (Row Level Security) stricte : un user ne modifie que ses propres
    données, admin/mod ont des policies dédiées
  - Supabase Realtime éventuellement pour le classement des défis en live
- **Découpage en composants React** à partir des sections du prototype :
  `<Header/>`, `<IntroSplash/>`, `<Navigation/>`, chaque page en composant
  dédié, `<CrateOpeningAnimation/>`, `<MiniProfileHoverCard/>`, `<AdminPanel/>`
  avec sous-composants par onglet, etc.
- **Gestion d'état** : Context API ou Zustand pour l'état global léger
  (thème, langue, user connecté), React Query / TanStack Query pour les
  données Supabase (cache, refetch, mutations).

---

## 4. Ce qui doit changer par rapport au prototype

1. Tout ce qui est en `localStorage` doit migrer vers Supabase (tables +
   RLS), avec des hooks React (`useXP()`, `useCoins()`, `useInventory()`, etc.)
2. L'authentification admin par hash en dur doit devenir un vrai système de
   rôles Supabase.
3. Le système de coins/shop doit avoir les garde-fous légaux mentionnés en
   2.5 avant toute mise en production réelle.
4. Les traductions (`S`, `EXTRA`, `t()`) doivent utiliser une vraie lib i18n
   (ex. `react-i18next`) plutôt qu'un objet fait main.
5. Découpage en fichiers/composants au lieu d'un unique fichier de 2700
   lignes.

---

## 5. Fichier de référence fourni

Le fichier `index.html` joint est le prototype complet et fonctionnel — à
ouvrir dans un navigateur pour voir/tester le comportement réel de chaque
fonctionnalité avant de la recoder. C'est la source de vérité pour le
détail des interactions (animations, textes, micro-copy en français) là où
ce document reste au niveau fonctionnel.

Utilise spec-kit pour transformer les sections 2.1 à 2.10 ci-dessus en specs
individuelles, puis en tâches de développement priorisées (auth d'abord,
puis profil/XP, puis coins/shop, puis admin, puis contenu éditorial).
