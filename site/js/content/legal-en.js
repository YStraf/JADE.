// Legal documents — English translation (the French version is authoritative).
const TODO = s => '<span class="todo">' + s + '</span>';
const EDITOR = TODO("publisher's name or company name");
const MAIL = TODO('contact email address');
export default [
  { id: 'mentions', title: 'Legal notice', updated: '2026-09-27', html: `
<p>In accordance with article 6 III of French law no. 2004-575 of 21 June 2004 on confidence in the digital economy (LCEN), here is the information about the publisher and host of the Jade website.</p>
<h3>Publisher</h3>
<p>The Jade website is published by ${EDITOR}, ${TODO('legal form (sole trader, SAS…)')}, ${TODO('share capital if applicable')}, whose registered office is located at ${TODO('postal address')}.</p>
<ul><li>Registration: ${TODO('RCS / RNE and SIREN number')}</li><li>EU VAT number: ${TODO('if applicable')}</li><li>Contact: ${MAIL} — ${TODO('phone number')}</li></ul>
<p>If the publisher is a private individual acting in a non-professional capacity, they may, under article 6 III 2 of the LCEN, only make the host's name public, provided they have given their identification details to the host.</p>
<h3>Publication director</h3>
<p>${TODO('name of the publication director')}.</p>
<h3>Hosting</h3>
<p>The site is hosted by Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, United States — vercel.com. When online accounts open, account data will be stored with ${TODO('database provider name')}, within the European Union.</p>
<h3>Intellectual property</h3>
<p>The texts, routines, illustrations, emblems, graphic elements and code of Jade are protected by the French Intellectual Property Code and belong to the publisher unless stated otherwise. Any reproduction or reuse without permission is prohibited.</p>
<p>Counter-Strike 2, Valorant, Kovaak's, Aim Lab, FACEIT, Steam and Discord are trademarks of their respective owners. Jade is an independent site with no official link to Valve, Riot Games, Kovaak's, Statespace, FACEIT or Discord. Training scenario names are cited for information so that they can be found in the relevant software.</p>
<h3>Reporting content</h3>
<p>See the "Report content" document. Contact: ${MAIL}.</p>` },

  { id: 'cgu', title: 'Terms of use', updated: '2026-09-27', html: `
<h3>1. Purpose</h3>
<p>These terms of use govern access to and use of the Jade website, which offers aim training routines, tests, a system of levels, ranks and cosmetic rewards, optimization tools, progress tracking, challenges and a community space. Using the site means accepting these terms.</p>
<h3>2. Access to the service</h3>
<p>Basic access is free. It requires equipment and an internet connection at the user's expense. The publisher strives to keep the site available but may interrupt it for maintenance or technical reasons, without compensation.</p>
<h3>3. Account</h3>
<ul><li>Account creation is reserved for people aged at least 15. Under article 45 of the French Data Protection Act, a minor under 15 cannot consent alone to the processing of their data.</li><li>One account per person. The information provided must be accurate.</li><li>You are responsible for keeping your password confidential and for activity on your account. Tell us immediately of any unauthorized use.</li><li>Current version: accounts are stored locally in your browser. They are not yet synced to a server.</li></ul>
<h3>4. Community rules</h3>
<p>Use of the community spaces (forum, profiles, challenges) is subject to the <a href="#/legal/community">Community and moderation guidelines</a>, which form an integral part of these terms.</p>
<h3>5. User content</h3>
<p>You keep the rights to the content you publish. You grant the publisher, for as long as it is online, a free, non-exclusive, worldwide licence to host, reproduce and display it on Jade, solely to operate the service. You guarantee that you hold the necessary rights to this content (texts, images, videos).</p>
<h3>6. Moderation</h3>
<p>In accordance with Regulation (EU) 2022/2065 on digital services (DSA), moderation rules, means and procedures are described in the Community guidelines. Any restriction decision (removal, hiding, suspension) is explained and can be challenged.</p>
<h3>7. Jade Coins, crates and Arcade</h3>
<p>Jade Coins are a free virtual currency with no monetary value, governed by the <a href="#/legal/coins">Jade Coins, Shop and Arcade rules</a>.</p>
<h3>8. Challenges</h3>
<p>Weekly challenges are governed by the <a href="#/legal/challenges">Challenge rules</a>.</p>
<h3>9. Liability</h3>
<p>Training and optimization advice is provided for information. You remain responsible for the settings you apply to your hardware and system. Jade guarantees no progress results. Train at your own pace and take breaks: if your wrists or forearms hurt, stop and see a health professional.</p>
<h3>10. Suspension and termination</h3>
<p>You can delete your account at any time from the Data tab of your profile. The publisher may suspend or close an account in case of serious or repeated breach of these terms, after a reasoned decision, except in emergencies or where required by law.</p>
<h3>11. Changes to the terms</h3>
<p>These terms may change. Any significant change is announced on the site before it takes effect. Continuing to use the site after that date means accepting it.</p>
<h3>12. Applicable law and disputes</h3>
<p>These terms are governed by French law. In case of dispute, an amicable solution is sought first (contact: ${MAIL}). If you are a consumer, you may use the consumer mediator named in the Terms of sale free of charge. Otherwise, French courts have jurisdiction, without prejudice to the protective rules applicable to consumers.</p>` },

  { id: 'cgv', title: 'Terms of sale', updated: '2026-09-27', html: `
<p><strong>Important: payments are not active yet.</strong> These terms will apply once paid offers open. They cover sales between the publisher and a consumer.</p>
<h3>1. Offers</h3>
<ul><li><strong>Free</strong>: basic access, with no time limit.</li><li><strong>Program</strong>: 8-week training program, one-time purchase, lifetime access to the purchased content.</li><li><strong>Premium</strong>: monthly subscription with no commitment.</li></ul>
<p>The main features of each offer are shown on the Plans page, in accordance with article L111-1 of the French Consumer Code.</p>
<h3>2. Prices</h3>
<p>Prices are shown in euros, all taxes included (article L112-1 of the Consumer Code). No subscription or purchase gives Jade Coins.</p>
<h3>3. Order</h3>
<p>Before confirming, you see a summary of your order and its total price. The confirmation button reads "Order with obligation to pay" or an equivalent wording (article L221-14). A confirmation is sent to you by email on a durable medium.</p>
<h3>4. Payment</h3>
<p>Payment is processed by ${TODO('name of the licensed payment provider')}. Jade never has access to your card details.</p>
<h3>5. Duration, renewal and cancellation of the subscription</h3>
<ul><li>The Premium subscription is monthly and renews automatically.</li><li>You can cancel it at any time, online, with the cancellation feature available in the Subscription tab of your profile (article L215-1-1 of the Consumer Code, "three-click cancellation"). An acknowledgment is sent to you.</li><li>Cancellation takes effect at the end of the period already paid.</li></ul>
<h3>6. Right of withdrawal</h3>
<p>You have 14 days from the conclusion of the contract to withdraw, without giving reasons (article L221-18). To do so, write to ${MAIL} or use the standard withdrawal form.</p>
<p>Exceptions: for digital content not supplied on a tangible medium (Program), the right of withdrawal can no longer be exercised once performance has begun with your prior express consent and your express waiver of this right (article L221-28, 13°). For a service (Premium) whose performance you request before the end of the period, you owe an amount proportionate to the service provided until your withdrawal (article L221-25).</p>
<h3>7. Legal guarantee of conformity</h3>
<p>Digital content and services benefit from the legal guarantee of conformity under articles L224-25-12 et seq. of the Consumer Code: bringing into conformity, or failing that, a price reduction or termination of the contract. For continuous supply (subscription), the guarantee covers the whole supply period; for a single supply (Program), defects appearing within two years.</p>
<h3>8. Customer service</h3>
<p>${MAIL}. Reply within 48 working hours on average.</p>
<h3>9. Consumer mediation</h3>
<p>In accordance with article L612-1 of the Consumer Code, if a dispute is not resolved by customer service, you may use the consumer mediator free of charge: ${TODO('mediator name, website and address')}.</p>
<h3>10. Applicable law</h3>
<p>These terms are governed by French law, without prejudice to more protective provisions of your country of residence.</p>` },

  { id: 'privacy', title: 'Privacy policy', updated: '2026-09-27', html: `
<p>This policy explains what data Jade processes, why, and what your rights are, in accordance with Regulation (EU) 2016/679 (GDPR) and French law no. 78-17 of 6 January 1978 (Data Protection Act).</p>
<h3>Data controller</h3>
<p>${EDITOR}, reachable at ${MAIL}. ${TODO('Contact details of the data protection officer, if appointed')}.</p>
<h3>Current situation</h3>
<p>In its current version, Jade runs without an account server: your account, progress, Jade Coins, inventory and sessions are stored <strong>only in your browser's local storage</strong>. The publisher has no access to them. The items below also describe how things will work once online accounts open; this policy will be updated at that time.</p>
<h3>Data processed, purposes and legal bases</h3>
<ul>
<li><strong>Account</strong> (username, email, encrypted password, date of birth): create and secure your account, check the minimum age. Basis: performance of the contract (terms of use) and legal obligation for age.</li>
<li><strong>Training</strong> (scores, imported sessions, records, XP, rank, Jade Coins, inventory): provide the service. Basis: performance of the contract.</li>
<li><strong>Public profile and forum</strong> (username, avatar, banner, posts): run the community. Basis: performance of the contract. This information is visible to other users according to your settings.</li>
<li><strong>Moderation and security</strong> (reports, sanctions, technical logs): protect users and meet our obligations. Basis: legitimate interest and legal obligations (including the retention of connection data required by the LCEN and its implementing decree).</li>
<li><strong>Support</strong> (messages): answer your requests. Basis: performance of the contract.</li>
<li><strong>Information emails</strong> (recap, challenge reminder): only if you turn them on. Basis: consent, which can be withdrawn at any time.</li>
<li><strong>Audience measurement</strong>: off by default, only with your consent (see the cookie policy).</li>
</ul>
<h3>Recipients</h3>
<p>Data is intended for the publisher and its technical processors: site hosting (Vercel Inc.) and, once accounts are online, ${TODO('database and email provider')}. The site's fonts are hosted on the site itself: no request is sent to a third-party font service. No data is sold or used for advertising.</p>
<h3>Transfers outside the European Union</h3>
<p>The site host is established in the United States. Any transfers are covered by the EU–US Data Privacy Framework or by the European Commission's standard contractual clauses.</p>
<h3>Retention periods</h3>
<ul><li>Account and training data: as long as the account exists, then deleted within 30 days.</li><li>Forum posts: deleted or anonymized when the account is deleted.</li><li>Connection data: 1 year (legal obligation).</li><li>Support messages: 3 years after the last exchange.</li><li>Cookie choices: 6 months.</li></ul>
<h3>Automated decisions</h3>
<p>Level, rank and badges are calculated automatically from your results. This calculation has no legal effect and no significant consequence within the meaning of article 22 of the GDPR.</p>
<h3>Minors</h3>
<p>The site is open from age 15. Under article 45 of the French Data Protection Act, a minor under 15 can only register with the joint consent of a holder of parental authority; since this process does not exist, registration is refused. The Arcade is reserved for adults.</p>
<h3>Your rights</h3>
<p>You have the rights of access, rectification, erasure, restriction, portability and objection, as well as the right to set instructions for your data after your death (article 85 of the French Data Protection Act). Most of them can be exercised directly from the Data tab of your profile (export and deletion). For the rest, write to ${MAIL}. You can lodge a complaint with the CNIL (www.cnil.fr) or your local supervisory authority.</p>
<h3>Security</h3>
<p>Passwords are hashed (cryptographic fingerprint), never stored in plain text. Exchanges with the site are encrypted (HTTPS).</p>` },

  { id: 'cookies', title: 'Cookie and tracker policy', updated: '2026-09-27', html: `
<p>In accordance with article 82 of the French Data Protection Act and the CNIL's guidelines and recommendations, Jade informs you of the trackers used and lets you choose.</p>
<h3>What is a tracker?</h3>
<p>A cookie or any other tracker (the browser's local storage, for example) saves information on your device. The same rules apply whatever the technique.</p>
<h3>Strictly necessary trackers (no consent needed)</h3>
<ul><li><code>jade:theme</code>, <code>jade:lang</code>, <code>jade:sfx</code>, <code>jade:anims</code>: your display preferences.</li><li><code>jade:accounts</code>, <code>jade:current</code>: your local account and session.</li><li><code>jade:u:…</code>: your progress, Jade Coins, inventory, sessions.</li><li><code>jade:cookies</code>: your choice about trackers.</li><li>Session storage: intro already seen, administration session.</li></ul>
<p>These trackers are used only to provide the service you request. They do not leave your device.</p>
<h3>Audience measurement (with consent)</h3>
<p>No audience measurement tool is active for now. If one is added, it will only be set after your agreement, and used solely to know which pages are useful, without identifying anyone.</p>
<h3>Advertising</h3>
<p>None. Jade uses no advertising tracker and no third-party social network.</p>
<h3>Third-party content</h3>
<p>YouTube videos embedded in the forum are loaded via youtube-nocookie.com (privacy-enhanced mode). Fonts are hosted on the site: no third-party service is contacted to display them.</p>
<h3>Duration</h3>
<p>Your choice is kept for 6 months, then asked again. Trackers subject to consent have a maximum lifetime of 13 months.</p>
<h3>Changing your mind</h3>
<p>The "Cookie preferences" link at the bottom of every page reopens the banner. Refusing is as easy as accepting. You can also clear your browser storage, or erase everything from the Data tab of your profile.</p>` },

  { id: 'community', title: 'Community and moderation guidelines', updated: '2026-09-27', html: `
<p>These guidelines are part of the terms of use. They describe what is allowed on Jade and how moderation works, in accordance with Regulation (EU) 2022/2065 on digital services (DSA) and the LCEN.</p>
<h3>What is forbidden</h3>
<ul><li>Any illegal content: hate, discrimination, harassment, threats, glorification of terrorism or crimes, child sexual abuse material, invasion of privacy, defamation, counterfeiting.</li><li>Cheating: promoting, linking or sharing cheat software, scripts or "boosted" accounts.</li><li>Scams: phishing, fake giveaways, fake skin or tournament sites, requests for credentials or codes.</li><li>Selling accounts, paid boosting, sharing credentials (forbidden by game publishers).</li><li>Third parties' personal data, impersonation.</li><li>Spam, unsolicited advertising, sexual or violent content.</li></ul>
<h3>Reporting</h3>
<p>Each post has a "Report" button. You can also use the procedure described in "Report content". Reports are handled diligently, in a non-arbitrary and objective way.</p>
<h3>Moderation means</h3>
<p>Moderation is carried out by people (moderators and administrators). Automated tools may temporarily hide heavily reported content pending human review; no final sanction is taken without human involvement.</p>
<h3>Decisions and sanctions</h3>
<ul><li>Depending on severity: warning, hiding or removal of content, temporary suspension, account closure.</li><li>Each decision is explained: facts, rule applied, possible remedies (article 17 DSA).</li><li>Manifestly illegal content is removed promptly. Serious offences may be reported to the authorities (PHAROS platform in France), and any threat to a person's life or safety is notified to the competent authorities (article 18 DSA).</li></ul>
<h3>Complaints</h3>
<p>You can challenge a decision concerning you within 6 months, free of charge, by writing to ${MAIL}. The complaint is reviewed by a person who did not take the initial decision. You can also go to the competent courts.</p>
<h3>Abusive reports</h3>
<p>Manifestly unfounded and repeated reports may lead to a temporary suspension of the handling of your reports. Knowingly presenting content as illegal to have it removed may be punishable by law.</p>` },

  { id: 'challenges', title: 'Challenge rules', updated: '2026-09-27', html: `
<h3>1. Organizer</h3>
<p>Weekly challenges are organized by ${EDITOR}.</p>
<h3>2. Entry</h3>
<p>Entry is free, with no purchase necessary, and open to anyone with a Jade account. Being a subscriber gives no advantage in the main challenge leaderboard. Challenges rely exclusively on the participants' skill, without any element of chance.</p>
<h3>3. How it works</h3>
<p>Each challenge covers an announced scenario, from Monday 00:00 to Sunday 23:59 (Paris time). Only each participant's best score of the period counts.</p>
<h3>4. Validation</h3>
<ul><li>The score must be achieved on the exact announced scenario, without game modification or third-party software.</li><li>The top three must provide the full video of their best session to validate their place.</li><li>Scores may be cross-checked with the training software's official leaderboards.</li><li>Any attempt to falsify leads to exclusion from challenges and loss of rewards.</li></ul>
<h3>5. Rewards</h3>
<p>Each participant with a valid score receives XP and Jade Coins according to their place (300 coins for 1st, 250 for the top 3, 200 for the top 10, 150 for the top 25, 100 for the others). Any weekly prize is announced on the Challenges page. It can neither be exchanged for its cash value nor transferred. The winner is contacted by email within seven days and has 30 days to claim it.</p>
<h3>6. Data</h3>
<p>Participants' usernames and scores appear on the public leaderboard. Data is processed in accordance with the privacy policy.</p>
<h3>7. Changes</h3>
<p>These rules may change; any change is announced on this page before the challenge concerned.</p>` },

  { id: 'coins', title: 'Jade Coins, Shop and Arcade rules', updated: '2026-09-27', html: `
<h3>1. Nature of Jade Coins</h3>
<ul><li>Jade Coins are a <strong>free</strong> virtual currency, usable only on Jade.</li><li>They are earned exclusively by using the site (sessions, records, streaks, level milestones, challenges).</li><li>They <strong>cannot be bought</strong>, neither directly nor through a subscription or paid offer.</li><li>They have <strong>no monetary value</strong>: they are not refundable, not convertible into money or goods, not exchangeable and not transferable between accounts.</li><li>They are a simple personal, revocable licence of use attached to the account.</li></ul>
<h3>2. Crates and cosmetic items</h3>
<ul><li>Crates are opened only with Jade Coins. Their content is drawn at random; <strong>the odds of each item and each rarity are displayed</strong> before opening.</li><li>Items are purely cosmetic (banners, frames, titles). They give no advantage in tests, ranks or challenges.</li><li>Items can be neither transferred, exchanged nor resold, on Jade or elsewhere. They are not "monetizable digital objects".</li><li>The number of openings is limited per day.</li></ul>
<h3>3. Arcade</h3>
<ul><li>The Arcade offers entertainment mini-games (wheel, heads or tails, grid) using Jade Coins.</li><li>Since there is no financial stake and no winnings with monetary value, these games are not gambling within the meaning of article L320-1 of the French Internal Security Code.</li><li>As a precaution, the Arcade is <strong>reserved for adults</strong>, limited to a number of games per day, and each player can exclude themselves (7 days, 30 days or permanently) from the Shop.</li><li>The expected return of each game is lower than or equal to the bet: no strategy lets you "win" coins in the long run.</li></ul>
<h3>4. Responsible play</h3>
<p>These mechanics must remain fun. If you feel you can no longer stop, in games or elsewhere, talk about it. In France: Joueurs Info Service, 09 74 75 13 13 (standard rate, 7 days a week).</p>
<h3>5. Changes and removal</h3>
<p>The publisher may change the reward scale, crate contents or games, or end them, after informing users. Deleting the account means losing Jade Coins and items, without compensation, since they have no monetary value.</p>
<h3>6. Abuse</h3>
<p>Any manipulation (data tampering, automation, exploiting a bug) may lead to Jade Coins and inventory being reset.</p>` },

  { id: 'accessibility', title: 'Accessibility statement', updated: '2026-09-27', html: `
<p>The publisher is committed to making Jade accessible to as many people as possible, based on the French accessibility framework (RGAA 4.1) and the EN 301 549 standard.</p>
<h3>Compliance status</h3>
<p>The site has not yet undergone a full audit. It is declared <strong>non-compliant</strong> pending this audit, which means compliance has not been measured yet.</p>
<h3>Measures in place</h3>
<ul><li>Full keyboard navigation, visible focus, skip link to the content.</li><li>Global search (Ctrl + K) to find any page or content.</li><li>Respect for the system "reduce motion" preference, and an Animations switch in the profile.</li><li>Light, dark and high-contrast themes.</li><li>Sounds off by default.</li></ul>
<h3>Known inaccessible content</h3>
<ul><li>Aim tests and some trials rely by nature on mouse precision and speed.</li><li>The intro animation uses a decorative canvas (with no essential information).</li><li>Progress charts do not yet have a complete text alternative.</li></ul>
<h3>Feedback and contact</h3>
<p>If you face an accessibility issue that prevents you from accessing content or a feature, write to ${MAIL}: we will provide the information in another form.</p>
<h3>Remedies</h3>
<p>If you do not get a satisfactory answer, you can contact the French Defender of Rights (www.defenseurdesdroits.fr).</p>` },

  { id: 'report', title: 'Report content', updated: '2026-09-27', html: `
<p>In accordance with articles 11, 12 and 16 of Regulation (EU) 2022/2065 (DSA) and the LCEN, here is how to report content you consider illegal or contrary to the guidelines.</p>
<h3>From the site</h3>
<p>Use the "Report" button under the post concerned, or the form on the Security page for a scam.</p>
<h3>By email</h3>
<p>Write to ${MAIL} stating:</p>
<ul><li>the exact address (URL) of the content;</li><li>a sufficiently substantiated explanation of why you consider it illegal;</li><li>your name and email address (except for child sexual abuse material);</li><li>a statement confirming that you are acting in good faith and that the information provided is accurate and complete.</li></ul>
<p>You receive an acknowledgment, then the decision taken and its reasons.</p>
<h3>Single point of contact</h3>
<p>Member State authorities, the European Commission and the European Board for Digital Services: ${MAIL} (French or English). Users: same address.</p>
<h3>Other useful resources (France)</h3>
<ul><li>Serious illegal content: internet-signalement.gouv.fr (PHAROS).</li><li>Cyberbullying: 3018 (call, chat or app, free and anonymous).</li><li>Scam or hacking: 17cyber.gouv.fr and cybermalveillance.gouv.fr.</li><li>Immediate danger: 17 or 112.</li></ul>
<h3>Warning</h3>
<p>Under French law, presenting content to the host as illegal in order to have it removed while knowing this information to be inaccurate is punishable by one year's imprisonment and a €15,000 fine.</p>` },

  { id: 'sources', title: "Sources and credits", updated: '2026-09-28', html: `
<p>Jade builds on the work of the aim training community. This page explains where the site's content comes from and who owns the trademarks mentioned.</p>
<h3>Training routines</h3>
<p>The choice and order of scenarios, the number of runs and the playlist codes of the routines come from the public documents of <strong>Voltaic</strong>, an aim training community (voltaic.gg): fundamental, weakness-specific and game-specific routines for Kovaak's and Aim Lab. The scenario library follows their recommended scenarios sheet (2024 rework by clover).</p>
<ul><li>Expert Valorant routine: bardOZ, for Voltaic.</li><li>Valorant RAMP warm-up: minigodcs, for Voltaic.</li><li>Speed switching routine: Viscose and Christmasiscancelled.</li></ul>
<p>Titles, instructions and translations are written by Jade. Jade is not affiliated with or endorsed by Voltaic. For any correction or removal request: ${MAIL}.</p>
<h3>Scenario names</h3>
<p>Scenarios belong to their respective creators. Their names are quoted as they are so you can find them in Kovaak's and Aim Lab.</p>
<h3>Trademarks</h3>
<p>Counter-Strike 2 and Steam are trademarks of Valve Corporation; Valorant is a trademark of Riot Games; Kovaak's belongs to its publishers; Aim Lab is a trademark of Statespace; FACEIT and Discord belong to their respective owners. Jade is an independent site with no official link to these companies.</p>
<h3>Fonts and graphics</h3>
<p>Chakra Petch and Manrope fonts, under the SIL Open Font License 1.1, hosted on the site. Rank emblems, crate art, icons and cosmetics are made for Jade.</p>
<h3>Practical information</h3>
<p>Optimization settings rely on the official options of Windows, NVIDIA and AMD drivers and the games. The victim support resources on the Security page are French public services (17cyber.gouv.fr, cybermalveillance.gouv.fr). Test and rank benchmarks are calibrated by Jade and provisional.</p>` },
];
