// Documents légaux — version française (celle qui fait foi).
// Les éléments <span class="todo"> sont à compléter par l'éditeur avant toute mise en ligne publique.
const TODO = s => '<span class="todo">' + s + '</span>';
const EDITOR = TODO('nom ou raison sociale de l\'éditeur');
const MAIL = TODO('adresse email de contact');
export default [
  { id: 'mentions', title: 'Mentions légales', updated: '2026-09-27', html: `
<p>Conformément à l'article 6 III de la loi n° 2004-575 du 21 juin 2004 pour la confiance dans l'économie numérique (LCEN), voici les informations relatives à l'éditeur et à l'hébergeur du site Jade.</p>
<h3>Éditeur</h3>
<p>Le site Jade est édité par ${EDITOR}, ${TODO('forme juridique (entreprise individuelle, SAS…)')}, ${TODO('capital social le cas échéant')}, dont le siège est situé ${TODO('adresse postale')}.</p>
<ul><li>Immatriculation : ${TODO('RCS / RNE et numéro SIREN')}</li><li>Numéro de TVA intracommunautaire : ${TODO('le cas échéant')}</li><li>Contact : ${MAIL} — ${TODO('numéro de téléphone')}</li></ul>
<p>Si l'éditeur est une personne physique agissant à titre non professionnel, il peut, conformément à l'article 6 III 2 de la LCEN, ne mettre à disposition du public que le nom de l'hébergeur, à condition d'avoir communiqué ses éléments d'identification à ce dernier.</p>
<h3>Directeur de la publication</h3>
<p>${TODO('nom du directeur de la publication')}.</p>
<h3>Hébergement</h3>
<p>Le site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com. Lorsque les comptes en ligne seront ouverts, les données des comptes seront stockées chez ${TODO('nom du prestataire de base de données')}, dans l'Union européenne.</p>
<h3>Propriété intellectuelle</h3>
<p>Les textes, routines, illustrations, emblèmes, éléments graphiques et le code de Jade sont protégés par le Code de la propriété intellectuelle et appartiennent à l'éditeur, sauf mention contraire. Toute reproduction ou réutilisation sans autorisation est interdite.</p>
<p>Counter-Strike 2, Valorant, Kovaak's, Aim Lab, FACEIT, Steam et Discord sont des marques de leurs détenteurs respectifs. Jade est un site indépendant, sans lien officiel avec Valve, Riot Games, Kovaak's, Statespace, FACEIT ou Discord. Les noms de scénarios d'entraînement sont cités à titre informatif pour permettre de les retrouver dans les logiciels concernés.</p>
<h3>Signaler un contenu</h3>
<p>Voir le document « Signaler un contenu ». Contact : ${MAIL}.</p>` },

  { id: 'cgu', title: "Conditions générales d'utilisation", updated: '2026-09-27', html: `
<h3>1. Objet</h3>
<p>Les présentes conditions générales d'utilisation (CGU) encadrent l'accès et l'utilisation du site Jade, qui propose des routines d'entraînement à la visée, des tests, un système de niveaux, de rangs et de récompenses cosmétiques, des outils d'optimisation, un suivi de progression, des défis et un espace communautaire. L'utilisation du site vaut acceptation des CGU.</p>
<h3>2. Accès au service</h3>
<p>L'accès de base est gratuit. Il nécessite un équipement et une connexion internet à la charge de l'utilisateur. L'éditeur s'efforce d'assurer la disponibilité du site mais peut l'interrompre pour maintenance ou raison technique, sans indemnité.</p>
<h3>3. Compte</h3>
<ul><li>La création d'un compte est réservée aux personnes âgées d'au moins 15 ans. Conformément à l'article 45 de la loi Informatique et Libertés, un mineur de moins de 15 ans ne peut consentir seul au traitement de ses données.</li><li>Un seul compte par personne. Les informations fournies doivent être exactes.</li><li>Tu es responsable de la confidentialité de ton mot de passe et de l'activité de ton compte. Préviens-nous sans délai de toute utilisation non autorisée.</li><li>Version actuelle : les comptes sont enregistrés localement dans ton navigateur. Ils ne sont pas encore synchronisés sur un serveur.</li></ul>
<h3>4. Règles de la communauté</h3>
<p>L'utilisation des espaces communautaires (forum, profils, défis) est soumise à la <a href="#/legal/community">Charte de la communauté et de modération</a>, qui fait partie intégrante des CGU.</p>
<h3>5. Contenus publiés par les utilisateurs</h3>
<p>Tu restes titulaire des droits sur les contenus que tu publies. Tu accordes à l'éditeur, pour la durée de leur mise en ligne, une licence gratuite, non exclusive et mondiale pour les héberger, les reproduire et les afficher sur Jade, dans le seul but de faire fonctionner le service. Tu garantis disposer des droits nécessaires sur ces contenus (textes, images, vidéos).</p>
<h3>6. Modération</h3>
<p>Conformément au règlement (UE) 2022/2065 sur les services numériques (DSA), les règles, moyens et procédures de modération sont décrits dans la Charte de la communauté. Toute décision de restriction (retrait, masquage, suspension) est motivée et peut faire l'objet d'une réclamation.</p>
<h3>7. Jade Coins, caisses et Arcade</h3>
<p>Les Jade Coins sont une monnaie virtuelle gratuite, sans valeur monétaire, régie par le <a href="#/legal/coins">Règlement Jade Coins, Shop et Arcade</a>.</p>
<h3>8. Défis</h3>
<p>Les défis hebdomadaires sont régis par le <a href="#/legal/challenges">Règlement des défis</a>.</p>
<h3>9. Responsabilité</h3>
<p>Les conseils d'entraînement et d'optimisation sont fournis à titre informatif. Tu restes responsable des réglages appliqués à ton matériel et à ton système. Jade ne garantit aucun résultat de progression. Pratique à ton rythme et fais des pauses : en cas de douleur aux poignets ou aux avant-bras, arrête et consulte un professionnel de santé.</p>
<h3>10. Suspension et résiliation</h3>
<p>Tu peux supprimer ton compte à tout moment depuis l'onglet Données de ton profil. L'éditeur peut suspendre ou fermer un compte en cas de manquement grave ou répété aux CGU, après décision motivée, sauf urgence ou obligation légale.</p>
<h3>11. Modification des CGU</h3>
<p>Les CGU peuvent évoluer. Toute modification importante est annoncée sur le site avant son entrée en vigueur. Poursuivre l'utilisation du site après cette date vaut acceptation.</p>
<h3>12. Droit applicable et litiges</h3>
<p>Les CGU sont soumises au droit français. En cas de litige, une solution amiable est recherchée en priorité (contact : ${MAIL}). Si tu es consommateur, tu peux recourir gratuitement au médiateur de la consommation désigné dans les Conditions générales de vente. À défaut, les tribunaux français sont compétents, sans préjudice des règles protectrices applicables aux consommateurs.</p>` },

  { id: 'cgv', title: 'Conditions générales de vente', updated: '2026-09-27', html: `
<p><strong>Important : les paiements ne sont pas encore actifs.</strong> Les présentes conditions s'appliqueront dès l'ouverture des offres payantes. Elles concernent les ventes conclues entre l'éditeur et un consommateur.</p>
<h3>1. Offres</h3>
<ul><li><strong>Gratuit</strong> : accès de base, sans limite de durée.</li><li><strong>Programme</strong> : programme d'entraînement de 8 semaines, achat unique, accès à vie au contenu acheté.</li><li><strong>Premium</strong> : abonnement mensuel sans engagement.</li></ul>
<p>Les caractéristiques essentielles de chaque offre sont présentées sur la page Formules, conformément à l'article L111-1 du Code de la consommation.</p>
<h3>2. Prix</h3>
<p>Les prix sont indiqués en euros, toutes taxes comprises (article L112-1 du Code de la consommation). Aucun abonnement ni achat ne permet d'obtenir des Jade Coins.</p>
<h3>3. Commande</h3>
<p>Avant de valider, tu vois le récapitulatif de ta commande et son prix total. Le bouton de validation porte la mention « Commande avec obligation de paiement » ou une formule équivalente (article L221-14). Une confirmation t'est envoyée par email sur un support durable.</p>
<h3>4. Paiement</h3>
<p>Le paiement est traité par ${TODO('nom du prestataire de paiement agréé')}. Jade n'a jamais accès à tes données de carte bancaire.</p>
<h3>5. Durée, reconduction et résiliation de l'abonnement</h3>
<ul><li>L'abonnement Premium est mensuel et se renouvelle tacitement.</li><li>Tu peux le résilier à tout moment, en ligne, grâce à la fonctionnalité de résiliation accessible depuis l'onglet Abonnement de ton profil (article L215-1-1 du Code de la consommation, « résiliation en trois clics »). Un accusé de réception t'est envoyé.</li><li>La résiliation prend effet à la fin de la période déjà payée.</li></ul>
<h3>6. Droit de rétractation</h3>
<p>Tu disposes d'un délai de 14 jours à compter de la conclusion du contrat pour te rétracter, sans justification (article L221-18). Pour l'exercer, écris à ${MAIL} ou utilise le formulaire type de rétractation.</p>
<p>Exceptions : pour un contenu numérique fourni sans support matériel (Programme), le droit de rétractation ne peut plus être exercé si l'exécution a commencé avec ton accord préalable exprès et ta renonciation expresse à ce droit (article L221-28, 13°). Pour un service (Premium) dont tu demandes l'exécution avant la fin du délai, tu restes redevable d'un montant proportionnel au service fourni jusqu'à ta rétractation (article L221-25).</p>
<h3>7. Garantie légale de conformité</h3>
<p>Les contenus et services numériques bénéficient de la garantie légale de conformité prévue aux articles L224-25-12 et suivants du Code de la consommation : mise en conformité, ou à défaut réduction du prix ou résolution du contrat. Pour une fourniture continue (abonnement), la garantie couvre toute la durée de fourniture ; pour une fourniture unique (Programme), les défauts apparaissant dans un délai de deux ans.</p>
<h3>8. Service client</h3>
<p>${MAIL}. Réponse sous 48 heures ouvrées en moyenne.</p>
<h3>9. Médiation de la consommation</h3>
<p>Conformément à l'article L612-1 du Code de la consommation, en cas de litige non résolu par le service client, tu peux recourir gratuitement au médiateur de la consommation : ${TODO('nom, site internet et adresse du médiateur')}.</p>
<h3>10. Droit applicable</h3>
<p>Les présentes CGV sont soumises au droit français, sans préjudice des dispositions plus protectrices de ton pays de résidence.</p>` },

  { id: 'privacy', title: 'Politique de confidentialité', updated: '2026-09-27', html: `
<p>Cette politique t'explique quelles données Jade traite, pourquoi, et quels sont tes droits, conformément au règlement (UE) 2016/679 (RGPD) et à la loi n° 78-17 du 6 janvier 1978 (loi Informatique et Libertés).</p>
<h3>Responsable du traitement</h3>
<p>${EDITOR}, joignable à ${MAIL}. ${TODO('Coordonnées du délégué à la protection des données, si désigné')}.</p>
<h3>Situation actuelle</h3>
<p>Dans sa version actuelle, Jade fonctionne sans serveur de comptes : ton compte, ta progression, tes Jade Coins, ton inventaire et tes séances sont enregistrés <strong>uniquement dans le stockage local de ton navigateur</strong>. L'éditeur n'y a pas accès. Les éléments ci-dessous décrivent aussi le fonctionnement prévu lorsque les comptes en ligne seront ouverts ; cette politique sera mise à jour à ce moment-là.</p>
<h3>Données traitées, finalités et bases légales</h3>
<ul>
<li><strong>Compte</strong> (pseudo, email, mot de passe chiffré, date de naissance) : créer et sécuriser ton compte, vérifier l'âge minimum. Base : exécution du contrat (CGU) et obligation légale pour l'âge.</li>
<li><strong>Entraînement</strong> (scores, séances importées, records, XP, rang, Jade Coins, inventaire) : fournir le service. Base : exécution du contrat.</li>
<li><strong>Profil public et forum</strong> (pseudo, avatar, bannière, publications) : fonctionnement de la communauté. Base : exécution du contrat. Ces informations sont visibles des autres utilisateurs selon tes réglages.</li>
<li><strong>Modération et sécurité</strong> (signalements, sanctions, journaux techniques) : protéger les utilisateurs et respecter nos obligations. Base : intérêt légitime et obligations légales (notamment conservation des données de connexion prévue par la LCEN et son décret d'application).</li>
<li><strong>Support</strong> (messages) : répondre à tes demandes. Base : exécution du contrat.</li>
<li><strong>Emails d'information</strong> (récap, rappel de défi) : uniquement si tu les actives. Base : consentement, retirable à tout moment.</li>
<li><strong>Mesure d'audience</strong> : désactivée par défaut, uniquement avec ton consentement (voir la politique cookies).</li>
</ul>
<h3>Destinataires</h3>
<p>Les données sont destinées à l'éditeur et à ses sous-traitants techniques : hébergement du site (Vercel Inc.), et, lorsque les comptes seront en ligne, ${TODO('prestataire de base de données et d\'emails')}. Les polices du site sont hébergées sur le site lui-même : aucune requête n'est envoyée à un service de polices tiers. Aucune donnée n'est vendue ni utilisée à des fins publicitaires.</p>
<h3>Transferts hors de l'Union européenne</h3>
<p>L'hébergeur du site est établi aux États-Unis. Les transferts éventuels sont encadrés par le cadre de protection des données UE–États-Unis (Data Privacy Framework) ou par les clauses contractuelles types de la Commission européenne.</p>
<h3>Durées de conservation</h3>
<ul><li>Compte et données d'entraînement : tant que le compte existe, puis suppression sous 30 jours.</li><li>Publications du forum : supprimées ou anonymisées à la suppression du compte.</li><li>Données de connexion : 1 an (obligation légale).</li><li>Messages au support : 3 ans après le dernier échange.</li><li>Choix cookies : 6 mois.</li></ul>
<h3>Décisions automatisées</h3>
<p>Le niveau, le rang et les badges sont calculés automatiquement à partir de tes résultats. Ce calcul n'a aucun effet juridique et n'emporte aucune conséquence significative au sens de l'article 22 du RGPD.</p>
<h3>Mineurs</h3>
<p>Le site est ouvert à partir de 15 ans. Conformément à l'article 45 de la loi Informatique et Libertés, un mineur de moins de 15 ans ne peut s'inscrire qu'avec le consentement conjoint d'un titulaire de l'autorité parentale ; en l'absence de ce parcours, l'inscription est refusée. L'Arcade est réservée aux personnes majeures.</p>
<h3>Tes droits</h3>
<p>Tu disposes des droits d'accès, de rectification, d'effacement, de limitation, de portabilité et d'opposition, ainsi que du droit de définir des directives relatives au sort de tes données après ta mort (article 85 de la loi Informatique et Libertés). L'essentiel s'exerce directement depuis l'onglet Données de ton profil (export et suppression). Pour le reste, écris à ${MAIL}. Tu peux introduire une réclamation auprès de la CNIL (www.cnil.fr).</p>
<h3>Sécurité</h3>
<p>Les mots de passe sont chiffrés (empreinte cryptographique), jamais stockés en clair. Les échanges avec le site sont chiffrés (HTTPS).</p>` },

  { id: 'cookies', title: 'Politique cookies et traceurs', updated: '2026-09-27', html: `
<p>Conformément à l'article 82 de la loi Informatique et Libertés et aux lignes directrices et recommandations de la CNIL, Jade t'informe des traceurs utilisés et te laisse choisir.</p>
<h3>Qu'est-ce qu'un traceur ?</h3>
<p>Un cookie ou tout autre traceur (stockage local du navigateur, par exemple) enregistre des informations sur ton appareil. Les mêmes règles s'appliquent quelle que soit la technique.</p>
<h3>Traceurs strictement nécessaires (sans consentement)</h3>
<ul><li><code>jade:theme</code>, <code>jade:lang</code>, <code>jade:sfx</code>, <code>jade:anims</code> : tes préférences d'affichage.</li><li><code>jade:accounts</code>, <code>jade:current</code> : ton compte local et ta session.</li><li><code>jade:u:…</code> : ta progression, tes Jade Coins, ton inventaire, tes séances.</li><li><code>jade:cookies</code> : ton choix concernant les traceurs.</li><li>Stockage de session : intro déjà vue, session d'administration.</li></ul>
<p>Ces traceurs servent uniquement à fournir le service que tu demandes. Ils ne quittent pas ton appareil.</p>
<h3>Mesure d'audience (avec consentement)</h3>
<p>Aucun outil de mesure d'audience n'est actif pour l'instant. S'il est ajouté, il ne sera déposé qu'après ton accord, et servira uniquement à savoir quelles pages sont utiles, sans identifier personne.</p>
<h3>Publicité</h3>
<p>Aucune. Jade n'utilise ni traceur publicitaire ni réseau social tiers.</p>
<h3>Contenus tiers</h3>
<p>Les vidéos YouTube intégrées au forum sont chargées via youtube-nocookie.com (mode de confidentialité renforcée). Les polices sont hébergées sur le site : aucun service tiers n'est contacté pour les afficher.</p>
<h3>Durée</h3>
<p>Ton choix est conservé 6 mois, puis redemandé. Les traceurs soumis au consentement ont une durée de vie maximale de 13 mois.</p>
<h3>Changer d'avis</h3>
<p>Le lien « Préférences cookies » en bas de chaque page rouvre le bandeau. Refuser est aussi simple qu'accepter. Tu peux aussi vider le stockage de ton navigateur, ou tout effacer depuis l'onglet Données de ton profil.</p>` },

  { id: 'community', title: 'Charte de la communauté et de modération', updated: '2026-09-27', html: `
<p>Cette charte fait partie des CGU. Elle décrit ce qui est autorisé sur Jade et comment la modération fonctionne, conformément au règlement (UE) 2022/2065 sur les services numériques (DSA) et à la LCEN.</p>
<h3>Ce qui est interdit</h3>
<ul><li>Tout contenu illicite : haine, discrimination, harcèlement, menaces, apologie du terrorisme ou de crimes, contenus pédopornographiques, atteinte à la vie privée, diffamation, contrefaçon.</li><li>Triche : promotion, liens ou partage de logiciels de triche, de scripts ou de comptes « boostés ».</li><li>Arnaques : phishing, faux giveaways, faux sites de skins ou de tournois, demandes d'identifiants ou de codes.</li><li>Vente de comptes, boosting payant, partage d'identifiants (interdits par les éditeurs de jeux).</li><li>Données personnelles d'un tiers, usurpation d'identité.</li><li>Spam, publicité non sollicitée, contenus sexuels ou violents.</li></ul>
<h3>Signaler</h3>
<p>Chaque publication a un bouton « Signaler ». Tu peux aussi utiliser la procédure décrite dans « Signaler un contenu ». Les signalements sont examinés de manière diligente, non arbitraire et objective.</p>
<h3>Moyens de modération</h3>
<p>La modération est assurée par des personnes (modérateurs et administrateurs). Des outils automatiques peuvent masquer temporairement un contenu très signalé en attendant un examen humain ; aucune sanction définitive n'est prise sans intervention humaine.</p>
<h3>Décisions et sanctions</h3>
<ul><li>Selon la gravité : avertissement, masquage ou retrait du contenu, suspension temporaire, fermeture du compte.</li><li>Chaque décision est motivée : faits, règle appliquée, recours possibles (article 17 du DSA).</li><li>Les contenus manifestement illicites sont retirés promptement. Les infractions graves peuvent être signalées aux autorités (plateforme PHAROS), et toute menace pour la vie ou la sécurité d'une personne est notifiée aux autorités compétentes (article 18 du DSA).</li></ul>
<h3>Réclamation</h3>
<p>Tu peux contester une décision te concernant dans un délai de 6 mois, gratuitement, en écrivant à ${MAIL}. La réclamation est examinée par une personne qui n'a pas pris la décision initiale. Tu peux aussi saisir les juridictions compétentes.</p>
<h3>Signalements abusifs</h3>
<p>Les signalements manifestement infondés et répétés peuvent entraîner une suspension temporaire du traitement de tes signalements. Présenter sciemment un contenu comme illicite pour obtenir son retrait peut être puni par la loi.</p>` },

  { id: 'challenges', title: 'Règlement des défis', updated: '2026-09-27', html: `
<h3>1. Organisateur</h3>
<p>Les défis hebdomadaires sont organisés par ${EDITOR}.</p>
<h3>2. Participation</h3>
<p>La participation est gratuite, sans obligation d'achat, et ouverte à toute personne disposant d'un compte Jade. Être abonné ne donne aucun avantage dans le classement du défi principal. Les défis reposent exclusivement sur l'adresse des participants, sans intervention du hasard.</p>
<h3>3. Déroulement</h3>
<p>Chaque défi porte sur un scénario annoncé, du lundi 00:00 au dimanche 23:59 (heure de Paris). Seul le meilleur score de la période est retenu pour chaque participant.</p>
<h3>4. Validation</h3>
<ul><li>Le score doit être réalisé sur le scénario exact annoncé, sans modification du jeu ni logiciel tiers.</li><li>Les trois premiers doivent fournir la vidéo complète de leur meilleure session pour valider leur place.</li><li>Les scores peuvent être recoupés avec les classements officiels du logiciel d'entraînement.</li><li>Toute tentative de falsification entraîne l'exclusion des défis et le retrait des récompenses.</li></ul>
<h3>5. Récompenses</h3>
<p>Chaque participant avec un score valide reçoit de l'XP et des Jade Coins selon son classement (300 coins pour le 1er, 250 pour le top 3, 200 pour le top 10, 150 pour le top 25, 100 pour les autres). Le lot éventuel de la semaine est annoncé sur la page Défis. Il ne peut être ni échangé contre sa valeur en argent, ni cédé. Le gagnant est contacté par email dans les sept jours et dispose de 30 jours pour le réclamer.</p>
<h3>6. Données</h3>
<p>Le pseudo et le score des participants apparaissent dans le classement public. Les données sont traitées conformément à la politique de confidentialité.</p>
<h3>7. Modification</h3>
<p>Le règlement peut être modifié ; toute modification est annoncée sur cette page avant le défi concerné.</p>` },

  { id: 'coins', title: 'Règlement Jade Coins, Shop et Arcade', updated: '2026-09-27', html: `
<h3>1. Nature des Jade Coins</h3>
<ul><li>Les Jade Coins sont une monnaie virtuelle <strong>gratuite</strong>, utilisable uniquement sur Jade.</li><li>Ils se gagnent exclusivement en utilisant le site (séances, records, séries, paliers de niveau, défis).</li><li>Ils <strong>ne s'achètent pas</strong>, ni directement, ni via un abonnement ou une offre payante.</li><li>Ils n'ont <strong>aucune valeur monétaire</strong> : ils ne sont ni remboursables, ni convertibles en argent ou en biens, ni échangeables, ni transférables entre comptes.</li><li>Ils constituent une simple licence d'utilisation personnelle, révocable, attachée au compte.</li></ul>
<h3>2. Caisses et objets cosmétiques</h3>
<ul><li>Les caisses s'ouvrent uniquement avec des Jade Coins. Leur contenu est tiré au hasard ; <strong>les probabilités de chaque objet et de chaque rareté sont affichées</strong> avant l'ouverture.</li><li>Les objets sont purement cosmétiques (bannières, contours, titres). Ils ne donnent aucun avantage dans les tests, les rangs ou les défis.</li><li>Les objets ne sont ni cessibles, ni échangeables, ni revendables, sur Jade comme en dehors. Ils ne sont pas des « objets numériques monétisables ».</li><li>Le nombre d'ouvertures est limité par jour.</li></ul>
<h3>3. Arcade</h3>
<ul><li>L'Arcade propose des mini-jeux de divertissement (roue, pile ou face, grille) utilisant des Jade Coins.</li><li>Faute de sacrifice financier et de gain ayant une valeur monétaire, ces jeux ne constituent pas des jeux d'argent et de hasard au sens de l'article L320-1 du Code de la sécurité intérieure.</li><li>Par prudence, l'Arcade est <strong>réservée aux personnes majeures</strong>, limitée à un nombre de parties par jour, et chaque joueur peut s'en exclure lui-même (7 jours, 30 jours ou définitivement) depuis le Shop.</li><li>L'espérance de gain de chaque jeu est inférieure ou égale à la mise : aucune stratégie ne permet de « gagner » des coins à long terme.</li></ul>
<h3>4. Jeu responsable</h3>
<p>Ces mécaniques doivent rester un amusement. Si tu as l'impression de ne plus pouvoir t'arrêter, en jeu ou ailleurs, parles-en : Joueurs Info Service, 09 74 75 13 13 (appel non surtaxé, 7 j/7).</p>
<h3>5. Modification et suppression</h3>
<p>L'éditeur peut modifier le barème, le contenu des caisses ou les jeux, ou y mettre fin, après information des utilisateurs. La suppression du compte entraîne la perte des Jade Coins et des objets, sans compensation, ceux-ci n'ayant aucune valeur monétaire.</p>
<h3>6. Abus</h3>
<p>Toute manipulation (modification des données, automatisation, exploitation d'un bug) peut entraîner la remise à zéro des Jade Coins et de l'inventaire.</p>` },

  { id: 'accessibility', title: "Déclaration d'accessibilité", updated: '2026-09-27', html: `
<p>L'éditeur s'engage à rendre Jade accessible au plus grand nombre, en s'appuyant sur le référentiel général d'amélioration de l'accessibilité (RGAA 4.1) et la norme EN 301 549.</p>
<h3>État de conformité</h3>
<p>Le site n'a pas encore fait l'objet d'un audit complet. Il est déclaré <strong>non conforme</strong> en attendant cet audit, ce qui signifie que la conformité n'est pas encore mesurée.</p>
<h3>Mesures en place</h3>
<ul><li>Navigation complète au clavier, focus visible, lien d'évitement vers le contenu.</li><li>Recherche globale (Ctrl + K) pour trouver n'importe quelle page ou contenu.</li><li>Respect de la préférence système « réduire les animations », et interrupteur Animations dans le profil.</li><li>Thème clair, thème sombre et thème à contraste renforcé.</li><li>Sons désactivés par défaut.</li></ul>
<h3>Contenus non accessibles connus</h3>
<ul><li>Les tests d'aim et certaines épreuves reposent sur la précision et la vitesse de la souris, par nature.</li><li>L'animation d'introduction utilise un canvas décoratif (sans information essentielle).</li><li>Les graphiques de progression ne disposent pas encore d'alternative textuelle complète.</li></ul>
<h3>Retour d'information et contact</h3>
<p>Si tu rencontres un défaut d'accessibilité qui t'empêche d'accéder à un contenu ou à une fonctionnalité, écris à ${MAIL} : nous te fournirons l'information sous une autre forme.</p>
<h3>Voies de recours</h3>
<p>Si tu n'obtiens pas de réponse satisfaisante, tu peux saisir le Défenseur des droits (www.defenseurdesdroits.fr).</p>` },

  { id: 'report', title: 'Signaler un contenu', updated: '2026-09-27', html: `
<p>Conformément aux articles 11, 12 et 16 du règlement (UE) 2022/2065 (DSA) et à la LCEN, voici comment signaler un contenu que tu estimes illicite ou contraire à la Charte.</p>
<h3>Depuis le site</h3>
<p>Utilise le bouton « Signaler » sous la publication concernée, ou le formulaire de la page Sécurité pour une arnaque.</p>
<h3>Par email</h3>
<p>Écris à ${MAIL} en indiquant :</p>
<ul><li>l'adresse exacte (URL) du contenu ;</li><li>une explication suffisamment motivée des raisons pour lesquelles tu le considères illicite ;</li><li>ton nom et ton adresse email (sauf pour les contenus pédopornographiques) ;</li><li>une déclaration confirmant que tu es de bonne foi et que les informations fournies sont exactes et complètes.</li></ul>
<p>Tu reçois un accusé de réception, puis la décision prise et ses motifs.</p>
<h3>Point de contact unique</h3>
<p>Autorités des États membres, Commission européenne et comité européen des services numériques : ${MAIL} (français ou anglais). Utilisateurs : même adresse.</p>
<h3>Autres recours utiles</h3>
<ul><li>Contenus illicites graves : internet-signalement.gouv.fr (PHAROS).</li><li>Cyberharcèlement : 3018 (appel, tchat ou application, gratuit et anonyme).</li><li>Arnaque ou piratage : 17cyber.gouv.fr et cybermalveillance.gouv.fr.</li><li>Danger immédiat : 17 ou 112.</li></ul>
<h3>Attention</h3>
<p>Présenter à l'hébergeur un contenu comme illicite dans le but d'en obtenir le retrait en sachant cette information inexacte est puni d'un an d'emprisonnement et de 15 000 € d'amende.</p>` },

  { id: 'sources', title: "Sources et crédits", updated: '2026-09-28', html: `
<p>Jade s'appuie sur le travail de la communauté de l'aim training. Cette page indique d'où viennent les contenus du site et à qui appartiennent les marques citées.</p>
<h3>Routines d'entraînement</h3>
<p>Le choix et l'ordre des scénarios, le nombre de runs et les codes de playlist des routines proviennent des documents publics de <strong>Voltaic</strong>, communauté d'entraînement à la visée (voltaic.gg) : routines fondamentales, routines par faiblesse et routines par jeu, pour Kovaak's et Aim Lab. La bibliothèque de scénarios reprend leur tableau de scénarios recommandés (refonte 2024 par clover).</p>
<ul><li>Routine Valorant experte : bardOZ, pour Voltaic.</li><li>Échauffement RAMP Valorant : minigodcs, pour Voltaic.</li><li>Routine de switching rapide : Viscose et Christmasiscancelled.</li></ul>
<p>Les titres, consignes et traductions sont rédigés par Jade. Jade n'est ni affilié à Voltaic ni approuvé par Voltaic. Pour toute demande de correction ou de retrait : ${MAIL}.</p>
<h3>Noms de scénarios</h3>
<p>Les scénarios appartiennent à leurs créateurs respectifs. Leurs noms sont cités tels quels pour qu'on puisse les retrouver dans Kovaak's et Aim Lab.</p>
<h3>Marques</h3>
<p>Counter-Strike 2 et Steam sont des marques de Valve Corporation ; Valorant est une marque de Riot Games ; Kovaak's appartient à ses éditeurs ; Aim Lab est une marque de Statespace ; FACEIT et Discord appartiennent à leurs détenteurs respectifs. Jade est un site indépendant, sans lien officiel avec ces sociétés.</p>
<h3>Polices et ressources graphiques</h3>
<p>Polices Chakra Petch et Manrope, sous licence SIL Open Font License 1.1, hébergées sur le site. Les emblèmes de rang, visuels de caisses, icônes et cosmétiques sont créés pour Jade.</p>
<h3>Informations pratiques</h3>
<p>Les réglages d'optimisation s'appuient sur les options officielles de Windows, des pilotes NVIDIA et AMD et des jeux. Les ressources d'aide aux victimes citées dans la page Sécurité sont celles des services publics français (17cyber.gouv.fr, cybermalveillance.gouv.fr). Les repères des tests et des rangs sont calibrés par Jade et provisoires.</p>` },
];
