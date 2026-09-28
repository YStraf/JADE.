// Documenti legali — traduzione italiana (fa fede la versione francese).
const TODO = s => '<span class="todo">' + s + '</span>';
const EDITOR = 'wStraf';
const MAIL = TODO('indirizzo email di contatto');
export default [
  { id: 'mentions', title: 'Note legali', updated: '2026-09-28', html: `
<p>Ai sensi dell’articolo 6 III della legge francese n. 2004-575 del 21 giugno 2004 sulla fiducia nell’economia digitale (LCEN), ecco le informazioni sull’editore e sull’hosting del sito Jade.</p>
<h3>Editore</h3>
<p>Il sito Jade è pubblicato da ${EDITOR}, persona fisica che agisce a titolo non professionale durante la fase di preparazione del sito. Ai sensi dell'articolo 6 III 2 della LCEN, i suoi dati identificativi sono stati comunicati all'hosting provider.</p>
<ul><li>Contatto: ${MAIL}</li></ul>
<p>Prima dell'apertura delle offerte a pagamento l'attività diventa commerciale: l'identità completa dell'editore (nome, forma, indirizzo, numero SIREN, telefono) sarà pubblicata in questa pagina, come richiesto dall'articolo 6 III 1 della LCEN.</p>
<h3>Direttore della pubblicazione</h3>
<p>${EDITOR}.</p>
<h3>Hosting</h3>
<p>Il sito è ospitato da Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Stati Uniti — vercel.com. Quando saranno attivi gli account online, i dati degli account saranno conservati presso Supabase Inc. (970 Toa Payoh North #07-04, Singapore 318992 — supabase.com), su server situati nell'Unione europea.</p>
<h3>Proprietà intellettuale</h3>
<p>I testi, le routine, le illustrazioni, gli emblemi, gli elementi grafici e il codice di Jade sono protetti dal Codice della proprietà intellettuale francese e appartengono all’editore salvo diversa indicazione. È vietata qualsiasi riproduzione o riutilizzo senza autorizzazione.</p>
<p>Counter-Strike 2, Valorant, Kovaak's, Aim Lab, FACEIT, Steam e Discord sono marchi dei rispettivi titolari. Jade è un sito indipendente senza alcun legame ufficiale con Valve, Riot Games, Kovaak's, Statespace, FACEIT o Discord. I nomi degli scenari di allenamento sono citati a titolo informativo per poterli ritrovare nei software interessati.</p>
<h3>Segnalare un contenuto</h3>
<p>Vedi il documento «Segnalare un contenuto». Contatto: ${MAIL}.</p>` },

  { id: 'cgu', title: 'Condizioni generali d’uso', updated: '2026-09-27', html: `
<h3>1. Oggetto</h3>
<p>Le presenti condizioni generali d’uso disciplinano l’accesso e l’uso del sito Jade, che offre routine di allenamento della mira, test, un sistema di livelli, gradi e ricompense cosmetiche, strumenti di ottimizzazione, monitoraggio dei progressi, sfide e uno spazio community. Usare il sito significa accettare queste condizioni.</p>
<h3>2. Accesso al servizio</h3>
<p>L’accesso di base è gratuito. Richiede un dispositivo e una connessione a internet a carico dell’utente. L’editore si impegna a mantenere il sito disponibile, ma può interromperlo per manutenzione o per motivi tecnici, senza indennizzo.</p>
<h3>3. Account</h3>
<ul><li>La creazione di un account è riservata alle persone di almeno 15 anni. Ai sensi dell’articolo 45 della legge francese «Informatique et Libertés», un minore di 15 anni non può acconsentire da solo al trattamento dei propri dati.</li><li>Un account per persona. Le informazioni fornite devono essere esatte.</li><li>Sei responsabile della riservatezza della tua password e delle attività del tuo account. Avvisaci subito di qualsiasi uso non autorizzato.</li><li>Versione attuale: gli account sono salvati localmente nel tuo browser. Non sono ancora sincronizzati con un server.</li></ul>
<h3>4. Regole della community</h3>
<p>L’uso degli spazi community (forum, profili, sfide) è soggetto alle <a href="#/legal/community">Regole della community e della moderazione</a>, che fanno parte integrante di queste condizioni.</p>
<h3>5. Contenuti degli utenti</h3>
<p>Conservi i diritti sui contenuti che pubblichi. Concedi all’editore, per tutta la durata della loro pubblicazione, una licenza gratuita, non esclusiva e mondiale per ospitarli, riprodurli e mostrarli su Jade, esclusivamente per il funzionamento del servizio. Garantisci di disporre dei diritti necessari su tali contenuti (testi, immagini, video).</p>
<h3>6. Moderazione</h3>
<p>Ai sensi del Regolamento (UE) 2022/2065 sui servizi digitali (DSA), le regole, i mezzi e le procedure di moderazione sono descritti nelle Regole della community. Ogni decisione restrittiva (rimozione, occultamento, sospensione) è motivata e può essere contestata.</p>
<h3>7. Jade Coins, casse e Arcade</h3>
<p>Le Jade Coins sono una valuta virtuale gratuita senza valore monetario, disciplinata dal <a href="#/legal/coins">Regolamento Jade Coins, Negozio e Arcade</a>.</p>
<h3>8. Sfide</h3>
<p>Le sfide settimanali sono disciplinate dal <a href="#/legal/challenges">Regolamento delle sfide</a>.</p>
<h3>9. Responsabilità</h3>
<p>I consigli di allenamento e ottimizzazione sono forniti a titolo informativo. Resti responsabile delle impostazioni che applichi al tuo hardware e al tuo sistema. Jade non garantisce alcun risultato di progresso. Allenati al tuo ritmo e fai pause: se ti fanno male i polsi o gli avambracci, fermati e consulta un professionista sanitario.</p>
<h3>10. Sospensione e chiusura</h3>
<p>Puoi eliminare il tuo account in qualsiasi momento dalla scheda Dati del tuo profilo. L’editore può sospendere o chiudere un account in caso di violazione grave o ripetuta delle presenti condizioni, con decisione motivata, salvo urgenza o obbligo di legge.</p>
<h3>11. Modifica delle condizioni</h3>
<p>Queste condizioni possono cambiare. Ogni modifica importante viene annunciata sul sito prima della sua entrata in vigore. Continuare a usare il sito dopo tale data significa accettarla.</p>
<h3>12. Legge applicabile e controversie</h3>
<p>Queste condizioni sono regolate dal diritto francese. In caso di controversia, si cerca prima una soluzione amichevole (contatto: ${MAIL}). Se sei un consumatore, puoi rivolgerti gratuitamente al mediatore dei consumatori indicato nelle Condizioni di vendita. In mancanza, sono competenti i tribunali francesi, fatte salve le norme di tutela applicabili ai consumatori.</p>` },

  { id: 'cgv', title: 'Condizioni generali di vendita', updated: '2026-09-28', html: `
<p><strong>Importante: i pagamenti non sono ancora attivi.</strong> Le presenti condizioni si applicheranno all'apertura delle offerte a pagamento. Riguardano le vendite tra l'editore (il venditore, indicato nelle note legali) e un consumatore. Fa fede la versione francese.</p>
<h3>1. Offerte</h3>
<ul><li><strong>Gratis</strong>: tutto l'allenamento (routine, test, gradi, pass, casse, ottimizzazione, forum, sfide), senza limiti di tempo.</li><li><strong>Jade+</strong>: abbonamento che dà accesso all'analisi dei punti deboli e alle routine consigliate, a una vetrina da 24 widget con il widget Galleria, al banner personalizzato, ai cosmetici Jade+ (cornice, banner, titolo) e al distintivo Jade+, oltre al supporto prioritario. Mensile (4,99 €) o annuale (39,99 €).</li><li><strong>Pack Fondatore</strong>: acquisto unico (14,99 €) con cornice, banner e titolo Fondatore per sempre e 3 mesi di Jade+ senza rinnovo. Disponibile fino all'uscita dell'app.</li></ul>
<p>Le caratteristiche essenziali di ogni offerta sono indicate nella pagina Jade+ e richiamate prima del pagamento. Nessuna offerta contiene Jade Coins o casse: non sono mai in vendita.</p>
<h3>2. Prezzi</h3>
<p>I prezzi sono in euro, tasse incluse. Il prezzo di un abbonamento non può aumentare senza che tu ne sia informato almeno un mese prima, con la possibilità di disdire.</p>
<h3>3. Ordine</h3>
<p>Serve un account Jade. Prima di confermare vedi il riepilogo dell'offerta e il prezzo totale, accetti le presenti condizioni e chiedi l'accesso immediato al contenuto. Il pulsante di conferma riporta «Paga» seguito dall'importo. Ricevi una conferma via email.</p>
<h3>4. Pagamento</h3>
<p>Il pagamento avviene con carta ed è gestito da Stripe Payments Europe, Ltd. (Irlanda), fornitore di pagamenti autorizzato e certificato PCI-DSS. Jade non ha mai accesso ai dati della tua carta. L'abbonamento viene addebitato all'inizio di ogni periodo.</p>
<h3>5. Durata, rinnovo e disdetta</h3>
<ul><li>Jade+ dura un mese o un anno e si rinnova automaticamente per lo stesso periodo.</li><li>Per la formula annuale, vieni informato via email, non prima di tre mesi e non oltre un mese prima della scadenza, della possibilità di non rinnovare.</li><li>Puoi disdire in qualsiasi momento online dalla scheda Abbonamento del profilo. Ricevi una conferma di ricezione. La disdetta ha effetto alla fine del periodo in corso, già pagato.</li><li>Alla fine dell'abbonamento le funzioni Jade+ vengono nascoste; progressi, oggetti e vetrina restano.</li></ul>
<h3>6. Diritto di recesso</h3>
<p>In linea di principio hai 14 giorni per recedere, senza motivazione. Tuttavia Jade+ e il pack Fondatore forniscono contenuti digitali già dal pagamento: ordinando, chiedi espressamente questo accesso immediato e riconosci di perdere il diritto di recesso non appena l'accesso inizia. Per la parte di servizio dell'abbonamento, se il recesso resta possibile, devi un importo proporzionale al servizio fornito. In caso di problemi, scrivi a ${MAIL}.</p>
<h3>7. Garanzia legale di conformità</h3>
<p>I contenuti e servizi digitali beneficiano della garanzia legale di conformità: ripristino della conformità o, in mancanza, riduzione del prezzo o risoluzione del contratto. Per l'abbonamento la garanzia copre l'intero periodo di fornitura; per il pack Fondatore, i difetti che compaiono entro due anni.</p>
<h3>8. Servizio clienti</h3>
<p>${MAIL}. Risposta in media entro 48 ore lavorative, con priorità per i membri Jade+.</p>
<h3>9. Mediazione dei consumatori</h3>
<p>Se una controversia non viene risolta dal servizio clienti, puoi rivolgerti gratuitamente al mediatore dei consumatori: ${TODO('nome, sito web e indirizzo del mediatore')}.</p>
<h3>10. Legge applicabile</h3>
<p>Le presenti condizioni sono regolate dal diritto francese, fatte salve le disposizioni più favorevoli del tuo paese di residenza.</p>` },

  { id: 'privacy', title: 'Informativa sulla privacy', updated: '2026-09-28', html: `
<p>Questa informativa spiega quali dati tratta Jade, per quali scopi e quali sono i tuoi diritti, ai sensi del Regolamento (UE) 2016/679 (GDPR) e della legge francese n. 78-17 del 6 gennaio 1978 («Informatique et Libertés»).</p>
<h3>Titolare del trattamento</h3>
<p>${EDITOR}, raggiungibile all’indirizzo ${MAIL}. Non è stato designato un responsabile della protezione dei dati; per Jade non è obbligatorio.</p>
<h3>Situazione attuale</h3>
<p>Nella versione attuale, Jade funziona senza server degli account: il tuo account, i progressi, le Jade Coins, l’inventario e le sessioni sono salvati <strong>esclusivamente nell’archiviazione locale del tuo browser</strong>. L’editore non vi ha accesso. I punti seguenti descrivono anche il funzionamento previsto all’apertura degli account online; questa informativa sarà aggiornata in quel momento.</p>
<h3>Dati trattati, finalità e basi giuridiche</h3>
<ul>
<li><strong>Account</strong> (nome utente, email, password cifrata, data di nascita): creare e proteggere il tuo account, verificare l’età minima. Base: esecuzione del contratto (condizioni d’uso) e obbligo legale per l’età.</li>
<li><strong>Allenamento</strong> (punteggi, sessioni importate, record, XP, grado, Jade Coins, inventario): fornire il servizio. Base: esecuzione del contratto.</li>
<li><strong>Profilo pubblico e forum</strong> (nome utente, avatar, banner, messaggi): far funzionare la community. Base: esecuzione del contratto. Queste informazioni sono visibili agli altri utenti secondo le tue impostazioni.</li>
<li><strong>Moderazione e sicurezza</strong> (segnalazioni, sanzioni, log tecnici): proteggere gli utenti e rispettare i nostri obblighi. Base: interesse legittimo e obblighi legali (tra cui la conservazione dei dati di connessione richiesta dalla LCEN e dal relativo decreto attuativo).</li>
<li><strong>Supporto</strong> (messaggi): rispondere alle tue richieste. Base: esecuzione del contratto.</li>
<li><strong>Email informative</strong> (riepilogo, promemoria sfida): solo se le attivi. Base: consenso, revocabile in qualsiasi momento.</li>
<li><strong>Misurazione del pubblico</strong>: disattivata per impostazione predefinita, solo con il tuo consenso (vedi l’informativa sui cookie).</li>
</ul>
<h3>Destinatari</h3>
<p>I dati sono destinati all’editore e ai suoi responsabili tecnici del trattamento: hosting del sito (Vercel Inc.) e, quando gli account saranno online, Supabase Inc. (database, autenticazione ed email di accesso, server nell'Unione europea) e Stripe Payments Europe, Ltd. (pagamenti, Irlanda). I caratteri tipografici del sito sono ospitati sul sito stesso: nessuna richiesta viene inviata a un servizio esterno di font. Nessun dato viene venduto o usato a fini pubblicitari.</p>
<h3>Trasferimenti fuori dall’Unione Europea</h3>
<p>L’hosting del sito ha sede negli Stati Uniti. Gli eventuali trasferimenti sono coperti dal Data Privacy Framework UE–USA o dalle clausole contrattuali tipo della Commissione europea.</p>
<h3>Tempi di conservazione</h3>
<ul><li>Dati dell’account e di allenamento: finché l’account esiste, poi cancellati entro 30 giorni.</li><li>Messaggi del forum: cancellati o anonimizzati alla cancellazione dell’account.</li><li>Dati di connessione: 1 anno (obbligo legale).</li><li>Messaggi al supporto: 3 anni dopo l’ultimo scambio.</li><li>Scelte sui cookie: 6 mesi.</li><li>Fatture e documenti contabili degli acquisti: 10 anni (articolo L123-22 del Codice di commercio francese).</li></ul>
<h3>Decisioni automatizzate</h3>
<p>Livello, grado e badge sono calcolati automaticamente dai tuoi risultati. Questo calcolo non produce effetti giuridici né conseguenze significative ai sensi dell’articolo 22 del GDPR.</p>
<h3>Minori</h3>
<p>Il sito è aperto dai 15 anni. Ai sensi dell’articolo 45 della legge «Informatique et Libertés», un minore di 15 anni può iscriversi solo con il consenso congiunto di un titolare della responsabilità genitoriale; poiché questa procedura non esiste, l’iscrizione viene rifiutata. L’Arcade è riservato ai maggiorenni.</p>
<h3>I tuoi diritti</h3>
<p>Hai diritto di accesso, rettifica, cancellazione, limitazione, portabilità e opposizione, oltre al diritto di definire direttive sui tuoi dati dopo la morte (articolo 85 della legge «Informatique et Libertés»). La maggior parte si esercita direttamente dalla scheda Dati del tuo profilo (esportazione e cancellazione). Per il resto, scrivi a ${MAIL}. Puoi presentare reclamo alla CNIL (www.cnil.fr) o alla tua autorità di controllo locale.</p>
<h3>Sicurezza</h3>
<p>Le password sono sottoposte a hash (impronta crittografica) e mai salvate in chiaro. Gli scambi con il sito sono cifrati (HTTPS).</p>` },

  { id: 'cookies', title: 'Informativa su cookie e tracker', updated: '2026-09-27', html: `
<p>Ai sensi dell’articolo 82 della legge «Informatique et Libertés» e delle linee guida e raccomandazioni della CNIL, Jade ti informa sui tracker utilizzati e ti lascia scegliere.</p>
<h3>Cos’è un tracker?</h3>
<p>Un cookie o qualsiasi altro tracker (ad esempio l’archiviazione locale del browser) salva informazioni sul tuo dispositivo. Le stesse regole valgono qualunque sia la tecnica.</p>
<h3>Tracker strettamente necessari (senza consenso)</h3>
<ul><li><code>jade:theme</code>, <code>jade:lang</code>, <code>jade:sfx</code>, <code>jade:anims</code>: le tue preferenze di visualizzazione.</li><li><code>jade:accounts</code>, <code>jade:current</code>: il tuo account locale e la tua sessione.</li><li><code>jade:u:…</code>: i tuoi progressi, le Jade Coins, l’inventario, le sessioni.</li><li><code>jade:cookies</code>: la tua scelta sui tracker.</li><li>Archiviazione di sessione: intro già vista, sessione di amministrazione.</li></ul>
<p>Questi tracker servono unicamente a fornire il servizio che richiedi. Non lasciano il tuo dispositivo.</p>
<h3>Misurazione del pubblico (con consenso)</h3>
<p>Al momento non è attivo alcuno strumento di misurazione del pubblico. Se ne verrà aggiunto uno, sarà impostato solo dopo il tuo consenso e usato solo per sapere quali pagine sono utili, senza identificare nessuno.</p>
<h3>Pubblicità</h3>
<p>Nessuna. Jade non usa alcun tracker pubblicitario né social network di terze parti.</p>
<h3>Contenuti di terzi</h3>
<p>I video YouTube incorporati nel forum sono caricati tramite youtube-nocookie.com (modalità privacy avanzata). I caratteri tipografici sono ospitati sul sito: nessun servizio di terze parti viene contattato per mostrarli.</p>
<h3>Durata</h3>
<p>La tua scelta viene conservata per 6 mesi, poi ti viene richiesta di nuovo. I tracker soggetti a consenso hanno una durata massima di 13 mesi.</p>
<h3>Cambiare idea</h3>
<p>Il link «Preferenze cookie» in fondo a ogni pagina riapre il banner. Rifiutare è facile quanto accettare. Puoi anche svuotare l’archiviazione del browser o cancellare tutto dalla scheda Dati del tuo profilo.</p>` },

  { id: 'community', title: 'Regole della community e della moderazione', updated: '2026-09-27', html: `
<p>Queste regole fanno parte delle condizioni d’uso. Descrivono cosa è consentito su Jade e come funziona la moderazione, ai sensi del Regolamento (UE) 2022/2065 sui servizi digitali (DSA) e della LCEN.</p>
<h3>Cosa è vietato</h3>
<ul><li>Qualsiasi contenuto illecito: odio, discriminazione, molestie, minacce, apologia di terrorismo o di crimini, materiale pedopornografico, violazione della vita privata, diffamazione, contraffazione.</li><li>Cheat: promuovere, linkare o condividere software di cheat, script o account «boostati».</li><li>Truffe: phishing, falsi giveaway, falsi siti di skin o di tornei, richieste di credenziali o codici.</li><li>Vendita di account, boosting a pagamento, condivisione di credenziali (vietati dagli editori dei giochi).</li><li>Dati personali di terzi, sostituzione di persona.</li><li>Spam, pubblicità non richiesta, contenuti sessuali o violenti.</li></ul>
<h3>Segnalare</h3>
<p>Ogni messaggio ha un pulsante «Segnala». Puoi anche usare la procedura descritta in «Segnalare un contenuto». Le segnalazioni sono trattate con diligenza, in modo non arbitrario e obiettivo.</p>
<h3>Mezzi di moderazione</h3>
<p>La moderazione è svolta da persone (moderatori e amministratori). Strumenti automatici possono nascondere temporaneamente un contenuto molto segnalato in attesa di un esame umano; nessuna sanzione definitiva viene presa senza intervento umano.</p>
<h3>Decisioni e sanzioni</h3>
<ul><li>A seconda della gravità: avvertimento, occultamento o rimozione del contenuto, sospensione temporanea, chiusura dell’account.</li><li>Ogni decisione è motivata: fatti, regola applicata, mezzi di ricorso (articolo 17 DSA).</li><li>I contenuti manifestamente illeciti vengono rimossi rapidamente. I reati gravi possono essere segnalati alle autorità (piattaforma PHAROS in Francia) e ogni minaccia alla vita o alla sicurezza di una persona viene notificata alle autorità competenti (articolo 18 DSA).</li></ul>
<h3>Reclami</h3>
<p>Puoi contestare una decisione che ti riguarda entro 6 mesi, gratuitamente, scrivendo a ${MAIL}. Il reclamo viene esaminato da una persona diversa da quella che ha preso la decisione iniziale. Puoi anche rivolgerti ai tribunali competenti.</p>
<h3>Segnalazioni abusive</h3>
<p>Segnalazioni manifestamente infondate e ripetute possono portare alla sospensione temporanea della gestione delle tue segnalazioni. Presentare consapevolmente un contenuto come illecito per ottenerne la rimozione può essere punito dalla legge.</p>` },

  { id: 'challenges', title: 'Regolamento delle sfide', updated: '2026-09-27', html: `
<h3>1. Organizzatore</h3>
<p>Le sfide settimanali sono organizzate da ${EDITOR}.</p>
<h3>2. Partecipazione</h3>
<p>La partecipazione è gratuita, senza obbligo di acquisto, e aperta a chiunque abbia un account Jade. Essere abbonati non dà alcun vantaggio nella classifica principale delle sfide. Le sfide si basano esclusivamente sull’abilità dei partecipanti, senza alcun elemento di caso.</p>
<h3>3. Funzionamento</h3>
<p>Ogni sfida riguarda uno scenario annunciato, dal lunedì alle 00:00 alla domenica alle 23:59 (ora di Parigi). Conta solo il miglior punteggio di ogni partecipante nel periodo.</p>
<h3>4. Convalida</h3>
<ul><li>Il punteggio deve essere ottenuto sullo scenario esatto annunciato, senza modifiche al gioco né software di terzi.</li><li>I primi tre devono fornire il video completo della loro migliore sessione per convalidare la posizione.</li><li>I punteggi possono essere confrontati con le classifiche ufficiali del software di allenamento.</li><li>Qualsiasi tentativo di falsificazione comporta l’esclusione dalle sfide e la perdita delle ricompense.</li></ul>
<h3>5. Ricompense</h3>
<p>Ogni partecipante con un punteggio valido riceve XP e Jade Coins in base alla posizione (300 monete al 1°, 250 alla top 3, 200 alla top 10, 150 alla top 25, 100 agli altri). L’eventuale premio settimanale è annunciato nella pagina Sfide. Non può essere convertito in denaro né ceduto. Il vincitore viene contattato via email entro sette giorni e ha 30 giorni per richiederlo.</p>
<h3>6. Dati</h3>
<p>I nomi utente e i punteggi dei partecipanti compaiono nella classifica pubblica. I dati sono trattati secondo l’informativa sulla privacy.</p>
<h3>7. Modifiche</h3>
<p>Questo regolamento può cambiare; ogni modifica viene annunciata su questa pagina prima della sfida interessata.</p>` },

  { id: 'coins', title: 'Regolamento Jade Coins, Negozio e Arcade', updated: '2026-09-27', html: `
<h3>1. Natura delle Jade Coins</h3>
<ul><li>Le Jade Coins sono una valuta virtuale <strong>gratuita</strong>, utilizzabile solo su Jade.</li><li>Si guadagnano esclusivamente usando il sito (sessioni, record, serie, traguardi di livello, sfide).</li><li><strong>Non si possono comprare</strong>, né direttamente né tramite un abbonamento o un’offerta a pagamento.</li><li><strong>Non hanno alcun valore monetario</strong>: non sono rimborsabili, né convertibili in denaro o beni, né scambiabili, né trasferibili tra account.</li><li>Costituiscono una semplice licenza d’uso personale e revocabile legata all’account.</li></ul>
<h3>2. Casse e oggetti cosmetici</h3>
<ul><li>Le casse si aprono solo con Jade Coins. Il contenuto è estratto a caso; <strong>le probabilità di ogni oggetto e di ogni rarità sono mostrate</strong> prima dell’apertura.</li><li>Gli oggetti sono puramente cosmetici (banner, cornici, titoli). Non danno alcun vantaggio nei test, nei gradi o nelle sfide.</li><li>Gli oggetti non si possono cedere, scambiare né rivendere, né su Jade né altrove. Non sono «oggetti digitali monetizzabili».</li><li>Il numero di aperture è limitato al giorno.</li></ul>
<h3>3. Arcade</h3>
<ul><li>L’Arcade offre minigiochi di intrattenimento (ruota, testa o croce, griglia) che usano Jade Coins.</li><li>In assenza di posta in denaro e di vincite con valore monetario, questi giochi non sono giochi d’azzardo ai sensi dell’articolo L320-1 del Codice della sicurezza interna francese.</li><li>Per precauzione, l’Arcade è <strong>riservato ai maggiorenni</strong>, limitato a un certo numero di partite al giorno, e ogni giocatore può autoescludersi (7 giorni, 30 giorni o per sempre) dal Negozio.</li><li>Il ritorno atteso di ogni gioco è inferiore o uguale alla puntata: nessuna strategia permette di «guadagnare» monete a lungo termine.</li></ul>
<h3>4. Gioco responsabile</h3>
<p>Queste meccaniche devono restare un gioco. Se senti di non riuscire più a fermarti, nei giochi o altrove, parlane. In Francia: Joueurs Info Service, 09 74 75 13 13 (tariffa ordinaria, 7 giorni su 7).</p>
<h3>5. Modifica e soppressione</h3>
<p>L’editore può modificare la scala delle ricompense, il contenuto delle casse o i giochi, o sopprimerli, dopo averne informato gli utenti. L’eliminazione dell’account comporta la perdita di Jade Coins e oggetti, senza compensazione, poiché non hanno valore monetario.</p>
<h3>6. Abusi</h3>
<p>Qualsiasi manipolazione (modifica dei dati, automazione, sfruttamento di un bug) può comportare l’azzeramento delle Jade Coins e dell’inventario.</p>` },

  { id: 'accessibility', title: 'Dichiarazione di accessibilità', updated: '2026-09-27', html: `
<p>L’editore si impegna a rendere Jade accessibile al maggior numero possibile di persone, basandosi sul riferimento francese per l’accessibilità (RGAA 4.1) e sulla norma EN 301 549.</p>
<h3>Stato di conformità</h3>
<p>Il sito non è ancora stato sottoposto a un audit completo. È dichiarato <strong>non conforme</strong> in attesa di tale audit, il che significa che la conformità non è ancora stata misurata.</p>
<h3>Misure adottate</h3>
<ul><li>Navigazione completa da tastiera, focus visibile, link per saltare al contenuto.</li><li>Ricerca globale (Ctrl + K) per trovare qualsiasi pagina o contenuto.</li><li>Rispetto della preferenza di sistema «riduci il movimento» e un interruttore Animazioni nel profilo.</li><li>Temi chiaro, scuro e ad alto contrasto.</li><li>Suoni disattivati per impostazione predefinita.</li></ul>
<h3>Contenuti non accessibili noti</h3>
<ul><li>I test di mira e alcune prove si basano per natura sulla precisione e sulla velocità del mouse.</li><li>L’animazione introduttiva usa un canvas decorativo (senza informazioni essenziali).</li><li>I grafici dei progressi non hanno ancora un’alternativa testuale completa.</li></ul>
<h3>Segnalazioni e contatto</h3>
<p>Se riscontri un problema di accessibilità che ti impedisce di accedere a un contenuto o a una funzione, scrivi a ${MAIL}: ti forniremo l’informazione in un’altra forma.</p>
<h3>Mezzi di ricorso</h3>
<p>Se non ottieni una risposta soddisfacente, puoi rivolgerti al Difensore dei diritti francese (www.defenseurdesdroits.fr).</p>` },

  { id: 'report', title: 'Segnalare un contenuto', updated: '2026-09-27', html: `
<p>Ai sensi degli articoli 11, 12 e 16 del Regolamento (UE) 2022/2065 (DSA) e della LCEN, ecco come segnalare un contenuto che ritieni illecito o contrario alle regole.</p>
<h3>Dal sito</h3>
<p>Usa il pulsante «Segnala» sotto il messaggio interessato, oppure il modulo della pagina Sicurezza per una truffa.</p>
<h3>Via email</h3>
<p>Scrivi a ${MAIL} indicando:</p>
<ul><li>l’indirizzo esatto (URL) del contenuto;</li><li>una spiegazione sufficientemente motivata del perché lo ritieni illecito;</li><li>il tuo nome e la tua email (salvo per materiale pedopornografico);</li><li>una dichiarazione che confermi che agisci in buona fede e che le informazioni fornite sono esatte e complete.</li></ul>
<p>Ricevi una conferma di ricezione, poi la decisione presa e le relative motivazioni.</p>
<h3>Punto di contatto unico</h3>
<p>Autorità degli Stati membri, Commissione europea e Comitato europeo per i servizi digitali: ${MAIL} (francese o inglese). Utenti: stesso indirizzo.</p>
<h3>Altre risorse utili (Francia)</h3>
<ul><li>Contenuti illeciti gravi: internet-signalement.gouv.fr (PHAROS).</li><li>Cyberbullismo: 3018 (chiamata, chat o app, gratuito e anonimo).</li><li>Truffa o pirateria: 17cyber.gouv.fr e cybermalveillance.gouv.fr.</li><li>Pericolo immediato: 17 o 112.</li></ul>
<h3>Avvertenza</h3>
<p>Secondo la legge francese, presentare all’hosting un contenuto come illecito per ottenerne la rimozione sapendo che tale informazione è inesatta è punito con un anno di reclusione e 15.000 € di multa.</p>` },

  { id: 'sources', title: "Fonti e crediti", updated: '2026-09-28', html: `
<p>Jade si basa sul lavoro della community dell'aim training. Questa pagina indica da dove provengono i contenuti del sito e a chi appartengono i marchi citati.</p>
<h3>Routine di allenamento</h3>
<p>La scelta e l'ordine degli scenari, il numero di run e i codici playlist delle routine provengono dai documenti pubblici di <strong>Voltaic</strong>, community di allenamento della mira (voltaic.gg): routine fondamentali, per debolezza e per gioco, per Kovaak's e Aim Lab. La libreria di scenari segue la loro tabella di scenari consigliati (revisione 2024 di clover).</p>
<ul><li>Routine Valorant esperta: bardOZ, per Voltaic.</li><li>Riscaldamento RAMP Valorant: minigodcs, per Voltaic.</li><li>Routine di switching veloce: Viscose e Christmasiscancelled.</li></ul>
<p>Titoli, istruzioni e traduzioni sono scritti da Jade. Jade non è affiliato a Voltaic né approvato da Voltaic. Per richieste di correzione o rimozione: ${MAIL}.</p>
<h3>Nomi degli scenari</h3>
<p>Gli scenari appartengono ai rispettivi creatori. I loro nomi sono citati così come sono per poterli ritrovare in Kovaak's e Aim Lab.</p>
<h3>Marchi</h3>
<p>Counter-Strike 2 e Steam sono marchi di Valve Corporation; Valorant è un marchio di Riot Games; Kovaak's appartiene ai suoi editori; Aim Lab è un marchio di Statespace; FACEIT e Discord appartengono ai rispettivi titolari. Jade è un sito indipendente senza legami ufficiali con queste società.</p>
<h3>Skin di CS2</h3>
<p>L'elenco delle skin del widget Collezione proviene dall'API libera <strong>CSGO-API</strong> di ByMykel (licenza MIT). Le immagini delle skin sono fornite da Steam e appartengono a Valve Corporation.</p>
<h3>Fondatori</h3>
<p>Grazie ai giocatori che sostengono Jade con il pack Fondatore. I loro nickname appariranno qui all'apertura dei pagamenti.</p>
<h3>Caratteri e risorse grafiche</h3>
<p>Caratteri Chakra Petch e Manrope, con licenza SIL Open Font License 1.1, ospitati sul sito. Emblemi dei gradi, immagini delle casse, icone e cosmetici sono creati per Jade.</p>
<h3>Informazioni pratiche</h3>
<p>Le impostazioni di ottimizzazione si basano sulle opzioni ufficiali di Windows, dei driver NVIDIA e AMD e dei giochi. Le risorse di aiuto alle vittime della pagina Sicurezza sono servizi pubblici francesi (17cyber.gouv.fr, cybermalveillance.gouv.fr). I riferimenti di test e gradi sono calibrati da Jade e provvisori.</p>` },
];
