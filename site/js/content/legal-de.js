// Rechtliche Dokumente — deutsche Übersetzung (maßgeblich ist die französische Fassung).
const TODO = s => '<span class="todo">' + s + '</span>';
const EDITOR = TODO('Name oder Firma des Betreibers');
const MAIL = TODO('Kontakt-E-Mail-Adresse');
export default [
  { id: 'mentions', title: 'Impressum', updated: '2026-09-27', html: `
<p>Gemäß Artikel 6 III des französischen Gesetzes Nr. 2004-575 vom 21. Juni 2004 über das Vertrauen in die digitale Wirtschaft (LCEN) folgen hier die Angaben zum Betreiber und zum Hoster der Website Jade.</p>
<h3>Betreiber</h3>
<p>Die Website Jade wird betrieben von ${EDITOR}, ${TODO('Rechtsform (Einzelunternehmer, SAS…)')}, ${TODO('ggf. Stammkapital')}, mit Sitz in ${TODO('Postanschrift')}.</p>
<ul><li>Registrierung: ${TODO('RCS / RNE und SIREN-Nummer')}</li><li>USt-IdNr.: ${TODO('falls zutreffend')}</li><li>Kontakt: ${MAIL} — ${TODO('Telefonnummer')}</li></ul>
<p>Handelt der Betreiber als Privatperson ohne berufliche Tätigkeit, darf er gemäß Artikel 6 III 2 LCEN nur den Namen des Hosters veröffentlichen, sofern er diesem seine Identifikationsdaten mitgeteilt hat.</p>
<h3>Verantwortlich für den Inhalt</h3>
<p>${TODO('Name des Verantwortlichen für die Veröffentlichung')}.</p>
<h3>Hosting</h3>
<p>Die Website wird gehostet von Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, USA — vercel.com. Sobald Online-Konten verfügbar sind, werden Kontodaten bei ${TODO('Name des Datenbankanbieters')} innerhalb der Europäischen Union gespeichert.</p>
<h3>Geistiges Eigentum</h3>
<p>Die Texte, Routinen, Illustrationen, Embleme, grafischen Elemente und der Code von Jade sind durch das französische Gesetzbuch über geistiges Eigentum geschützt und gehören, sofern nicht anders angegeben, dem Betreiber. Jede Vervielfältigung oder Wiederverwendung ohne Genehmigung ist untersagt.</p>
<p>Counter-Strike 2, Valorant, Kovaak's, Aim Lab, FACEIT, Steam und Discord sind Marken ihrer jeweiligen Inhaber. Jade ist eine unabhängige Website ohne offizielle Verbindung zu Valve, Riot Games, Kovaak's, Statespace, FACEIT oder Discord. Die Namen der Trainingsszenarien werden zur Information genannt, damit man sie in der jeweiligen Software findet.</p>
<h3>Inhalte melden</h3>
<p>Siehe das Dokument „Inhalt melden“. Kontakt: ${MAIL}.</p>` },

  { id: 'cgu', title: 'Allgemeine Nutzungsbedingungen', updated: '2026-09-27', html: `
<h3>1. Gegenstand</h3>
<p>Diese Nutzungsbedingungen regeln den Zugang zur und die Nutzung der Website Jade, die Aim-Trainingsroutinen, Tests, ein System aus Leveln, Rängen und kosmetischen Belohnungen, Optimierungswerkzeuge, Fortschrittsverfolgung, Challenges und einen Community-Bereich anbietet. Mit der Nutzung der Website akzeptierst du diese Bedingungen.</p>
<h3>2. Zugang zum Dienst</h3>
<p>Der Basiszugang ist kostenlos. Er setzt Geräte und eine Internetverbindung auf Kosten der Nutzer voraus. Der Betreiber bemüht sich um die Verfügbarkeit der Website, kann sie aber für Wartung oder aus technischen Gründen ohne Entschädigung unterbrechen.</p>
<h3>3. Konto</h3>
<ul><li>Die Kontoerstellung ist Personen ab 15 Jahren vorbehalten. Gemäß Artikel 45 des französischen Datenschutzgesetzes (Loi Informatique et Libertés) kann eine minderjährige Person unter 15 Jahren nicht allein in die Verarbeitung ihrer Daten einwilligen.</li><li>Ein Konto pro Person. Die angegebenen Informationen müssen korrekt sein.</li><li>Du bist für die Geheimhaltung deines Passworts und für die Aktivitäten auf deinem Konto verantwortlich. Melde uns jede unbefugte Nutzung sofort.</li><li>Aktuelle Version: Konten werden lokal in deinem Browser gespeichert. Sie werden noch nicht mit einem Server synchronisiert.</li></ul>
<h3>4. Community-Regeln</h3>
<p>Die Nutzung der Community-Bereiche (Forum, Profile, Challenges) unterliegt den <a href="#/legal/community">Community- und Moderationsregeln</a>, die fester Bestandteil dieser Bedingungen sind.</p>
<h3>5. Inhalte der Nutzer</h3>
<p>Du behältst die Rechte an den Inhalten, die du veröffentlichst. Du räumst dem Betreiber für die Dauer der Veröffentlichung eine kostenlose, nicht exklusive, weltweite Lizenz ein, sie auf Jade zu hosten, zu vervielfältigen und anzuzeigen, ausschließlich zum Betrieb des Dienstes. Du garantierst, die nötigen Rechte an diesen Inhalten (Texte, Bilder, Videos) zu besitzen.</p>
<h3>6. Moderation</h3>
<p>Gemäß der Verordnung (EU) 2022/2065 über digitale Dienste (DSA) sind die Regeln, Mittel und Verfahren der Moderation in den Community-Regeln beschrieben. Jede einschränkende Entscheidung (Entfernung, Ausblendung, Sperre) wird begründet und kann angefochten werden.</p>
<h3>7. Jade Coins, Kisten und Arcade</h3>
<p>Jade Coins sind eine kostenlose virtuelle Währung ohne Geldwert, geregelt durch die <a href="#/legal/coins">Regeln für Jade Coins, Shop und Arcade</a>.</p>
<h3>8. Challenges</h3>
<p>Die wöchentlichen Challenges unterliegen den <a href="#/legal/challenges">Challenge-Regeln</a>.</p>
<h3>9. Haftung</h3>
<p>Trainings- und Optimierungstipps dienen der Information. Du bleibst für die Einstellungen verantwortlich, die du an deiner Hardware und deinem System vornimmst. Jade garantiert keine Fortschrittsergebnisse. Trainiere in deinem Tempo und mach Pausen: Wenn dir Handgelenke oder Unterarme wehtun, hör auf und wende dich an medizinisches Fachpersonal.</p>
<h3>10. Sperrung und Kündigung</h3>
<p>Du kannst dein Konto jederzeit im Reiter Daten deines Profils löschen. Der Betreiber kann ein Konto bei schwerem oder wiederholtem Verstoß gegen diese Bedingungen nach begründeter Entscheidung sperren oder schließen, außer in dringenden Fällen oder bei gesetzlicher Verpflichtung.</p>
<h3>11. Änderung der Bedingungen</h3>
<p>Diese Bedingungen können sich ändern. Jede wesentliche Änderung wird vor ihrem Inkrafttreten auf der Website angekündigt. Wer die Website danach weiter nutzt, akzeptiert sie.</p>
<h3>12. Anwendbares Recht und Streitigkeiten</h3>
<p>Diese Bedingungen unterliegen französischem Recht. Im Streitfall wird zunächst eine gütliche Lösung gesucht (Kontakt: ${MAIL}). Als Verbraucher kannst du kostenlos die in den Verkaufsbedingungen genannte Verbraucherschlichtungsstelle anrufen. Andernfalls sind die französischen Gerichte zuständig, unbeschadet der für Verbraucher geltenden Schutzvorschriften.</p>` },

  { id: 'cgv', title: 'Allgemeine Verkaufsbedingungen', updated: '2026-09-27', html: `
<p><strong>Wichtig: Zahlungen sind noch nicht aktiv.</strong> Diese Bedingungen gelten, sobald kostenpflichtige Angebote verfügbar sind. Sie regeln Verkäufe zwischen dem Betreiber und Verbrauchern.</p>
<h3>1. Angebote</h3>
<ul><li><strong>Kostenlos</strong>: Basiszugang ohne zeitliche Begrenzung.</li><li><strong>Programm</strong>: 8-wöchiges Trainingsprogramm, Einmalkauf, lebenslanger Zugang zu den gekauften Inhalten.</li><li><strong>Premium</strong>: monatliches Abo ohne Mindestlaufzeit.</li></ul>
<p>Die wesentlichen Merkmale jedes Angebots werden gemäß Artikel L111-1 des französischen Verbrauchergesetzbuchs auf der Seite Tarife dargestellt.</p>
<h3>2. Preise</h3>
<p>Die Preise sind in Euro inklusive aller Steuern angegeben (Artikel L112-1 des Verbrauchergesetzbuchs). Kein Abo und kein Kauf gibt Jade Coins.</p>
<h3>3. Bestellung</h3>
<p>Vor der Bestätigung siehst du eine Zusammenfassung deiner Bestellung und ihren Gesamtpreis. Der Bestätigungsbutton trägt die Aufschrift „Zahlungspflichtig bestellen“ oder eine gleichwertige Formulierung (Artikel L221-14). Du erhältst eine Bestätigung per E-Mail auf einem dauerhaften Datenträger.</p>
<h3>4. Zahlung</h3>
<p>Die Zahlung wird über ${TODO('Name des zugelassenen Zahlungsdienstleisters')} abgewickelt. Jade hat nie Zugriff auf deine Kartendaten.</p>
<h3>5. Laufzeit, Verlängerung und Kündigung des Abos</h3>
<ul><li>Das Premium-Abo ist monatlich und verlängert sich automatisch.</li><li>Du kannst es jederzeit online über die Kündigungsfunktion im Reiter Abo deines Profils kündigen (Artikel L215-1-1 des Verbrauchergesetzbuchs, „Kündigung in drei Klicks“). Du erhältst eine Bestätigung.</li><li>Die Kündigung wird zum Ende des bereits bezahlten Zeitraums wirksam.</li></ul>
<h3>6. Widerrufsrecht</h3>
<p>Du hast 14 Tage ab Vertragsschluss Zeit, ohne Angabe von Gründen zu widerrufen (Artikel L221-18). Schreib dazu an ${MAIL} oder nutze das Muster-Widerrufsformular.</p>
<p>Ausnahmen: Bei digitalen Inhalten, die nicht auf einem körperlichen Datenträger geliefert werden (Programm), erlischt das Widerrufsrecht, sobald die Ausführung mit deiner vorherigen ausdrücklichen Zustimmung und deinem ausdrücklichen Verzicht auf dieses Recht begonnen hat (Artikel L221-28, 13°). Bei einer Dienstleistung (Premium), deren Ausführung du vor Ablauf der Frist verlangst, schuldest du einen Betrag, der der bis zum Widerruf erbrachten Leistung entspricht (Artikel L221-25).</p>
<h3>7. Gesetzliche Gewährleistung</h3>
<p>Digitale Inhalte und Dienstleistungen unterliegen der gesetzlichen Konformitätsgewährleistung der Artikel L224-25-12 ff. des Verbrauchergesetzbuchs: Herstellung des vertragsgemäßen Zustands, andernfalls Preisminderung oder Vertragsauflösung. Bei fortlaufender Bereitstellung (Abo) gilt die Gewährleistung für den gesamten Bereitstellungszeitraum; bei einmaliger Bereitstellung (Programm) für Mängel, die innerhalb von zwei Jahren auftreten.</p>
<h3>8. Kundenservice</h3>
<p>${MAIL}. Antwort im Schnitt innerhalb von 48 Arbeitsstunden.</p>
<h3>9. Verbraucherschlichtung</h3>
<p>Gemäß Artikel L612-1 des Verbrauchergesetzbuchs kannst du, wenn ein Streit mit dem Kundenservice nicht beigelegt wird, kostenlos die Verbraucherschlichtungsstelle anrufen: ${TODO('Name, Website und Anschrift der Schlichtungsstelle')}.</p>
<h3>10. Anwendbares Recht</h3>
<p>Diese Bedingungen unterliegen französischem Recht, unbeschadet günstigerer Bestimmungen deines Wohnsitzlandes.</p>` },

  { id: 'privacy', title: 'Datenschutzerklärung', updated: '2026-09-27', html: `
<p>Diese Erklärung beschreibt, welche Daten Jade verarbeitet, wozu und welche Rechte du hast, gemäß der Verordnung (EU) 2016/679 (DSGVO) und dem französischen Gesetz Nr. 78-17 vom 6. Januar 1978 (Loi Informatique et Libertés).</p>
<h3>Verantwortlicher</h3>
<p>${EDITOR}, erreichbar unter ${MAIL}. ${TODO('Kontaktdaten des Datenschutzbeauftragten, falls benannt')}.</p>
<h3>Aktueller Stand</h3>
<p>In der aktuellen Version funktioniert Jade ohne Kontoserver: Dein Konto, dein Fortschritt, deine Jade Coins, dein Inventar und deine Sessions werden <strong>ausschließlich im lokalen Speicher deines Browsers</strong> abgelegt. Der Betreiber hat keinen Zugriff darauf. Die folgenden Punkte beschreiben auch die geplante Funktionsweise nach Einführung der Online-Konten; diese Erklärung wird dann aktualisiert.</p>
<h3>Verarbeitete Daten, Zwecke und Rechtsgrundlagen</h3>
<ul>
<li><strong>Konto</strong> (Benutzername, E-Mail, verschlüsseltes Passwort, Geburtsdatum): dein Konto erstellen und schützen, das Mindestalter prüfen. Grundlage: Vertragserfüllung (Nutzungsbedingungen) und rechtliche Verpflichtung beim Alter.</li>
<li><strong>Training</strong> (Scores, importierte Sessions, Rekorde, XP, Rang, Jade Coins, Inventar): den Dienst erbringen. Grundlage: Vertragserfüllung.</li>
<li><strong>Öffentliches Profil und Forum</strong> (Benutzername, Avatar, Banner, Beiträge): die Community betreiben. Grundlage: Vertragserfüllung. Diese Angaben sind je nach deinen Einstellungen für andere Nutzer sichtbar.</li>
<li><strong>Moderation und Sicherheit</strong> (Meldungen, Sanktionen, technische Protokolle): Nutzer schützen und unsere Pflichten erfüllen. Grundlage: berechtigtes Interesse und rechtliche Verpflichtungen (darunter die von der LCEN und ihrer Durchführungsverordnung verlangte Speicherung von Verbindungsdaten).</li>
<li><strong>Support</strong> (Nachrichten): deine Anfragen beantworten. Grundlage: Vertragserfüllung.</li>
<li><strong>Info-E-Mails</strong> (Rückblick, Challenge-Erinnerung): nur, wenn du sie aktivierst. Grundlage: Einwilligung, jederzeit widerrufbar.</li>
<li><strong>Reichweitenmessung</strong>: standardmäßig deaktiviert, nur mit deiner Einwilligung (siehe Cookie-Richtlinie).</li>
</ul>
<h3>Empfänger</h3>
<p>Die Daten sind für den Betreiber und seine technischen Auftragsverarbeiter bestimmt: Hosting der Website (Vercel Inc.) und, sobald die Konten online sind, ${TODO('Datenbank- und E-Mail-Anbieter')}. Die Schriftarten der Website werden auf der Website selbst gehostet: Es wird keine Anfrage an einen externen Schriftdienst gesendet. Keine Daten werden verkauft oder für Werbung genutzt.</p>
<h3>Übermittlungen außerhalb der Europäischen Union</h3>
<p>Der Hoster der Website hat seinen Sitz in den USA. Etwaige Übermittlungen sind durch das EU-US Data Privacy Framework oder die Standardvertragsklauseln der Europäischen Kommission abgesichert.</p>
<h3>Speicherdauer</h3>
<ul><li>Konto- und Trainingsdaten: solange das Konto besteht, danach Löschung innerhalb von 30 Tagen.</li><li>Forenbeiträge: gelöscht oder anonymisiert, wenn das Konto gelöscht wird.</li><li>Verbindungsdaten: 1 Jahr (gesetzliche Pflicht).</li><li>Support-Nachrichten: 3 Jahre nach dem letzten Austausch.</li><li>Cookie-Auswahl: 6 Monate.</li></ul>
<h3>Automatisierte Entscheidungen</h3>
<p>Level, Rang und Abzeichen werden automatisch aus deinen Ergebnissen berechnet. Diese Berechnung hat keine rechtliche Wirkung und keine erhebliche Beeinträchtigung im Sinne von Artikel 22 DSGVO.</p>
<h3>Minderjährige</h3>
<p>Die Website ist ab 15 Jahren zugänglich. Gemäß Artikel 45 des französischen Datenschutzgesetzes kann sich eine minderjährige Person unter 15 Jahren nur mit der gemeinsamen Einwilligung eines Sorgeberechtigten registrieren; da dieses Verfahren nicht existiert, wird die Registrierung abgelehnt. Die Arcade ist Volljährigen vorbehalten.</p>
<h3>Deine Rechte</h3>
<p>Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit und Widerspruch sowie das Recht, Verfügungen für deine Daten nach deinem Tod festzulegen (Artikel 85 des französischen Datenschutzgesetzes). Die meisten davon kannst du direkt im Reiter Daten deines Profils ausüben (Export und Löschung). Für alles andere schreib an ${MAIL}. Du kannst dich bei der CNIL (www.cnil.fr) oder deiner örtlichen Aufsichtsbehörde beschweren.</p>
<h3>Sicherheit</h3>
<p>Passwörter werden gehasht (kryptografischer Fingerabdruck) und nie im Klartext gespeichert. Der Datenaustausch mit der Website ist verschlüsselt (HTTPS).</p>` },

  { id: 'cookies', title: 'Cookie- und Tracker-Richtlinie', updated: '2026-09-27', html: `
<p>Gemäß Artikel 82 des französischen Datenschutzgesetzes und den Leitlinien und Empfehlungen der CNIL informiert dich Jade über die verwendeten Tracker und lässt dich wählen.</p>
<h3>Was ist ein Tracker?</h3>
<p>Ein Cookie oder jeder andere Tracker (zum Beispiel der lokale Speicher des Browsers) speichert Informationen auf deinem Gerät. Es gelten dieselben Regeln, unabhängig von der Technik.</p>
<h3>Unbedingt erforderliche Tracker (ohne Einwilligung)</h3>
<ul><li><code>jade:theme</code>, <code>jade:lang</code>, <code>jade:sfx</code>, <code>jade:anims</code>: deine Anzeigeeinstellungen.</li><li><code>jade:accounts</code>, <code>jade:current</code>: dein lokales Konto und deine Sitzung.</li><li><code>jade:u:…</code>: dein Fortschritt, deine Jade Coins, dein Inventar, deine Sessions.</li><li><code>jade:cookies</code>: deine Auswahl zu Trackern.</li><li>Sitzungsspeicher: Intro bereits gesehen, Administrationssitzung.</li></ul>
<p>Diese Tracker dienen ausschließlich dazu, den von dir angeforderten Dienst zu erbringen. Sie verlassen dein Gerät nicht.</p>
<h3>Reichweitenmessung (mit Einwilligung)</h3>
<p>Derzeit ist kein Werkzeug zur Reichweitenmessung aktiv. Falls eines hinzukommt, wird es erst nach deiner Zustimmung gesetzt und nur genutzt, um zu erfahren, welche Seiten nützlich sind, ohne jemanden zu identifizieren.</p>
<h3>Werbung</h3>
<p>Keine. Jade nutzt keine Werbe-Tracker und keine sozialen Netzwerke von Drittanbietern.</p>
<h3>Inhalte Dritter</h3>
<p>Im Forum eingebettete YouTube-Videos werden über youtube-nocookie.com geladen (erweiterter Datenschutzmodus). Die Schriftarten werden auf der Website gehostet: Zur Anzeige wird kein Drittanbieter kontaktiert.</p>
<h3>Dauer</h3>
<p>Deine Auswahl wird 6 Monate gespeichert, danach wirst du erneut gefragt. Einwilligungspflichtige Tracker haben eine Lebensdauer von höchstens 13 Monaten.</p>
<h3>Meinung ändern</h3>
<p>Der Link „Cookie-Einstellungen“ unten auf jeder Seite öffnet das Banner erneut. Ablehnen ist so einfach wie Zustimmen. Du kannst auch den Speicher deines Browsers leeren oder alles im Reiter Daten deines Profils löschen.</p>` },

  { id: 'community', title: 'Community- und Moderationsregeln', updated: '2026-09-27', html: `
<p>Diese Regeln sind Teil der Nutzungsbedingungen. Sie beschreiben, was auf Jade erlaubt ist und wie die Moderation funktioniert, gemäß der Verordnung (EU) 2022/2065 über digitale Dienste (DSA) und der LCEN.</p>
<h3>Was verboten ist</h3>
<ul><li>Jeder rechtswidrige Inhalt: Hass, Diskriminierung, Belästigung, Drohungen, Verherrlichung von Terrorismus oder Verbrechen, Darstellungen sexuellen Kindesmissbrauchs, Verletzung der Privatsphäre, Verleumdung, Produktpiraterie.</li><li>Cheaten: Cheat-Software, Skripte oder „geboostete“ Konten bewerben, verlinken oder teilen.</li><li>Betrug: Phishing, gefälschte Gewinnspiele, gefälschte Skin- oder Turnierseiten, Anfragen nach Zugangsdaten oder Codes.</li><li>Kontoverkauf, bezahltes Boosting, Weitergabe von Zugangsdaten (von den Spieleherstellern verboten).</li><li>Personenbezogene Daten Dritter, Identitätsanmaßung.</li><li>Spam, unerwünschte Werbung, sexuelle oder gewalttätige Inhalte.</li></ul>
<h3>Melden</h3>
<p>Jeder Beitrag hat einen Button „Melden“. Du kannst auch das unter „Inhalt melden“ beschriebene Verfahren nutzen. Meldungen werden sorgfältig, nicht willkürlich und objektiv bearbeitet.</p>
<h3>Moderationsmittel</h3>
<p>Die Moderation erfolgt durch Menschen (Moderatoren und Administratoren). Automatisierte Werkzeuge können einen häufig gemeldeten Inhalt vorübergehend ausblenden, bis ein Mensch ihn prüft; keine endgültige Sanktion wird ohne menschliches Eingreifen verhängt.</p>
<h3>Entscheidungen und Sanktionen</h3>
<ul><li>Je nach Schwere: Verwarnung, Ausblendung oder Entfernung des Inhalts, vorübergehende Sperre, Schließung des Kontos.</li><li>Jede Entscheidung wird begründet: Sachverhalt, angewandte Regel, mögliche Rechtsbehelfe (Artikel 17 DSA).</li><li>Offensichtlich rechtswidrige Inhalte werden schnell entfernt. Schwere Straftaten können den Behörden gemeldet werden (in Frankreich über die Plattform PHAROS), und jede Bedrohung für Leben oder Sicherheit einer Person wird den zuständigen Behörden mitgeteilt (Artikel 18 DSA).</li></ul>
<h3>Beschwerden</h3>
<p>Du kannst eine dich betreffende Entscheidung innerhalb von 6 Monaten kostenlos anfechten, indem du an ${MAIL} schreibst. Die Beschwerde wird von einer Person geprüft, die die ursprüngliche Entscheidung nicht getroffen hat. Du kannst dich auch an die zuständigen Gerichte wenden.</p>
<h3>Missbräuchliche Meldungen</h3>
<p>Offensichtlich unbegründete und wiederholte Meldungen können zur vorübergehenden Aussetzung der Bearbeitung deiner Meldungen führen. Einen Inhalt wissentlich als rechtswidrig darzustellen, um seine Entfernung zu erreichen, kann strafbar sein.</p>` },

  { id: 'challenges', title: 'Challenge-Regeln', updated: '2026-09-27', html: `
<h3>1. Veranstalter</h3>
<p>Die wöchentlichen Challenges werden von ${EDITOR} veranstaltet.</p>
<h3>2. Teilnahme</h3>
<p>Die Teilnahme ist kostenlos, ohne Kaufpflicht und offen für alle mit einem Jade-Konto. Ein Abo verschafft keinen Vorteil in der Hauptrangliste der Challenges. Die Challenges beruhen ausschließlich auf dem Können der Teilnehmenden, ohne jedes Zufallselement.</p>
<h3>3. Ablauf</h3>
<p>Jede Challenge betrifft ein angekündigtes Szenario, von Montag 00:00 bis Sonntag 23:59 (Pariser Zeit). Es zählt nur der beste Score jedes Teilnehmers im Zeitraum.</p>
<h3>4. Bestätigung</h3>
<ul><li>Der Score muss im genau angekündigten Szenario erzielt werden, ohne Spielmodifikation oder Drittsoftware.</li><li>Die ersten drei müssen das vollständige Video ihrer besten Session vorlegen, um ihren Platz zu bestätigen.</li><li>Scores können mit den offiziellen Ranglisten der Trainingssoftware abgeglichen werden.</li><li>Jeder Fälschungsversuch führt zum Ausschluss von den Challenges und zum Verlust der Belohnungen.</li></ul>
<h3>5. Belohnungen</h3>
<p>Alle Teilnehmenden mit gültigem Score erhalten XP und Jade Coins je nach Platzierung (300 Coins für Platz 1, 250 für die Top 3, 200 für die Top 10, 150 für die Top 25, 100 für alle anderen). Ein etwaiger Wochenpreis wird auf der Seite Challenges angekündigt. Er kann weder in Geld umgetauscht noch übertragen werden. Der Gewinner wird innerhalb von sieben Tagen per E-Mail kontaktiert und hat 30 Tage Zeit, ihn einzufordern.</p>
<h3>6. Daten</h3>
<p>Benutzernamen und Scores der Teilnehmenden erscheinen in der öffentlichen Rangliste. Die Daten werden gemäß der Datenschutzerklärung verarbeitet.</p>
<h3>7. Änderungen</h3>
<p>Diese Regeln können sich ändern; jede Änderung wird vor der betreffenden Challenge auf dieser Seite angekündigt.</p>` },

  { id: 'coins', title: 'Regeln für Jade Coins, Shop und Arcade', updated: '2026-09-27', html: `
<h3>1. Art der Jade Coins</h3>
<ul><li>Jade Coins sind eine <strong>kostenlose</strong> virtuelle Währung, die nur auf Jade nutzbar ist.</li><li>Sie werden ausschließlich durch die Nutzung der Website verdient (Sessions, Rekorde, Serien, Level-Meilensteine, Challenges).</li><li>Sie <strong>können nicht gekauft werden</strong>, weder direkt noch über ein Abo oder ein kostenpflichtiges Angebot.</li><li>Sie haben <strong>keinen Geldwert</strong>: nicht erstattungsfähig, nicht in Geld oder Waren umtauschbar, nicht tauschbar und nicht zwischen Konten übertragbar.</li><li>Sie stellen eine einfache, persönliche und widerrufliche Nutzungslizenz dar, die an das Konto gebunden ist.</li></ul>
<h3>2. Kisten und kosmetische Gegenstände</h3>
<ul><li>Kisten werden ausschließlich mit Jade Coins geöffnet. Ihr Inhalt wird zufällig gezogen; <strong>die Chancen jedes Gegenstands und jeder Seltenheit werden vor dem Öffnen angezeigt</strong>.</li><li>Die Gegenstände sind rein kosmetisch (Banner, Rahmen, Titel). Sie verschaffen keinen Vorteil bei Tests, Rängen oder Challenges.</li><li>Gegenstände können weder übertragen, getauscht noch weiterverkauft werden, weder auf Jade noch anderswo. Sie sind keine „monetarisierbaren digitalen Objekte“.</li><li>Die Anzahl der Öffnungen ist pro Tag begrenzt.</li></ul>
<h3>3. Arcade</h3>
<ul><li>Die Arcade bietet Unterhaltungs-Minispiele (Rad, Kopf oder Zahl, Raster) mit Jade Coins.</li><li>Da es weder einen finanziellen Einsatz noch einen Gewinn mit Geldwert gibt, sind diese Spiele keine Glücksspiele im Sinne von Artikel L320-1 des französischen Gesetzbuchs über die innere Sicherheit.</li><li>Vorsichtshalber ist die Arcade <strong>Volljährigen vorbehalten</strong>, auf eine Anzahl von Spielen pro Tag begrenzt, und alle Spielenden können sich im Shop selbst ausschließen (7 Tage, 30 Tage oder dauerhaft).</li><li>Die erwartete Rückgabe jedes Spiels ist kleiner oder gleich dem Einsatz: Keine Strategie ermöglicht es, auf Dauer Coins zu „gewinnen“.</li></ul>
<h3>4. Verantwortungsvolles Spielen</h3>
<p>Diese Mechaniken sollen ein Spiel bleiben. Wenn du das Gefühl hast, nicht mehr aufhören zu können, in Spielen oder anderswo, sprich darüber. In Frankreich: Joueurs Info Service, 09 74 75 13 13 (normaler Tarif, 7 Tage die Woche).</p>
<h3>5. Änderung und Einstellung</h3>
<p>Der Betreiber kann die Belohnungsstaffel, den Inhalt der Kisten oder die Spiele ändern oder einstellen, nachdem er die Nutzer informiert hat. Mit der Löschung des Kontos gehen Jade Coins und Gegenstände ohne Entschädigung verloren, da sie keinen Geldwert haben.</p>
<h3>6. Missbrauch</h3>
<p>Jede Manipulation (Datenänderung, Automatisierung, Ausnutzen eines Fehlers) kann zum Zurücksetzen der Jade Coins und des Inventars führen.</p>` },

  { id: 'accessibility', title: 'Erklärung zur Barrierefreiheit', updated: '2026-09-27', html: `
<p>Der Betreiber verpflichtet sich, Jade möglichst vielen Menschen zugänglich zu machen, auf Grundlage des französischen Referenzrahmens für Barrierefreiheit (RGAA 4.1) und der Norm EN 301 549.</p>
<h3>Stand der Konformität</h3>
<p>Die Website wurde noch keinem vollständigen Audit unterzogen. Sie wird bis zu diesem Audit als <strong>nicht konform</strong> erklärt, das heißt, die Konformität wurde noch nicht gemessen.</p>
<h3>Umgesetzte Maßnahmen</h3>
<ul><li>Vollständige Tastaturbedienung, sichtbarer Fokus, Link zum Überspringen zum Inhalt.</li><li>Globale Suche (Strg + K), um jede Seite und jeden Inhalt zu finden.</li><li>Berücksichtigung der Systemeinstellung „Bewegung reduzieren“ und ein Schalter für Animationen im Profil.</li><li>Helles, dunkles und kontrastreiches Design.</li><li>Töne standardmäßig aus.</li></ul>
<h3>Bekannte nicht barrierefreie Inhalte</h3>
<ul><li>Aim-Tests und einige Prüfungen beruhen naturgemäß auf Präzision und Tempo mit der Maus.</li><li>Die Intro-Animation nutzt eine dekorative Leinwand (ohne wesentliche Informationen).</li><li>Die Fortschrittsdiagramme haben noch keine vollständige Textalternative.</li></ul>
<h3>Rückmeldung und Kontakt</h3>
<p>Wenn ein Barrierefreiheitsproblem dich daran hindert, auf einen Inhalt oder eine Funktion zuzugreifen, schreib an ${MAIL}: Wir stellen dir die Information in anderer Form bereit.</p>
<h3>Rechtsbehelfe</h3>
<p>Wenn du keine zufriedenstellende Antwort erhältst, kannst du dich an den französischen Bürgerbeauftragten (Défenseur des droits, www.defenseurdesdroits.fr) wenden.</p>` },

  { id: 'report', title: 'Inhalt melden', updated: '2026-09-27', html: `
<p>Gemäß den Artikeln 11, 12 und 16 der Verordnung (EU) 2022/2065 (DSA) und der LCEN erfährst du hier, wie du einen Inhalt meldest, den du für rechtswidrig oder regelwidrig hältst.</p>
<h3>Über die Website</h3>
<p>Nutze den Button „Melden“ unter dem betreffenden Beitrag oder bei Betrug das Formular auf der Seite Sicherheit.</p>
<h3>Per E-Mail</h3>
<p>Schreib an ${MAIL} mit folgenden Angaben:</p>
<ul><li>die genaue Adresse (URL) des Inhalts;</li><li>eine hinreichend begründete Erklärung, warum du ihn für rechtswidrig hältst;</li><li>dein Name und deine E-Mail-Adresse (außer bei Darstellungen sexuellen Kindesmissbrauchs);</li><li>eine Erklärung, dass du in gutem Glauben handelst und die Angaben richtig und vollständig sind.</li></ul>
<p>Du erhältst eine Eingangsbestätigung und anschließend die getroffene Entscheidung mit Begründung.</p>
<h3>Zentrale Kontaktstelle</h3>
<p>Behörden der Mitgliedstaaten, Europäische Kommission und Europäisches Gremium für digitale Dienste: ${MAIL} (Französisch oder Englisch). Nutzer: dieselbe Adresse.</p>
<h3>Weitere nützliche Anlaufstellen (Frankreich)</h3>
<ul><li>Schwerwiegende rechtswidrige Inhalte: internet-signalement.gouv.fr (PHAROS).</li><li>Cybermobbing: 3018 (Anruf, Chat oder App, kostenlos und anonym).</li><li>Betrug oder Hacking: 17cyber.gouv.fr und cybermalveillance.gouv.fr.</li><li>Akute Gefahr: 17 oder 112.</li></ul>
<h3>Hinweis</h3>
<p>Nach französischem Recht wird es mit einem Jahr Freiheitsstrafe und 15.000 € Geldstrafe bestraft, dem Hoster einen Inhalt als rechtswidrig darzustellen, um seine Entfernung zu erreichen, obwohl man weiß, dass diese Angabe falsch ist.</p>` },
];
