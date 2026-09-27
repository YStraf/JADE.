// Dokumenty prawne — tłumaczenie na polski (wiążąca jest wersja francuska).
const TODO = s => '<span class="todo">' + s + '</span>';
const EDITOR = TODO('nazwa wydawcy lub firmy');
const MAIL = TODO('kontaktowy adres e-mail');
export default [
  { id: 'mentions', title: 'Nota prawna', updated: '2026-09-27', html: `
<p>Zgodnie z art. 6 III francuskiej ustawy nr 2004-575 z 21 czerwca 2004 r. o zaufaniu do gospodarki cyfrowej (LCEN) poniżej znajdują się informacje o wydawcy i dostawcy hostingu strony Jade.</p>
<h3>Wydawca</h3>
<p>Stronę Jade wydaje ${EDITOR}, ${TODO('forma prawna (jednoosobowa działalność, SAS…)')}, ${TODO('kapitał zakładowy, jeśli dotyczy')}, z siedzibą pod adresem ${TODO('adres pocztowy')}.</p>
<ul><li>Rejestracja: ${TODO('RCS / RNE i numer SIREN')}</li><li>Numer VAT UE: ${TODO('jeśli dotyczy')}</li><li>Kontakt: ${MAIL} — ${TODO('numer telefonu')}</li></ul>
<p>Jeśli wydawcą jest osoba fizyczna działająca poza działalnością zawodową, może ona, zgodnie z art. 6 III 2 LCEN, podać publicznie wyłącznie nazwę dostawcy hostingu, pod warunkiem że przekazała mu swoje dane identyfikacyjne.</p>
<h3>Dyrektor publikacji</h3>
<p>${TODO('imię i nazwisko dyrektora publikacji')}.</p>
<h3>Hosting</h3>
<p>Strona jest hostowana przez Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, Stany Zjednoczone — vercel.com. Po uruchomieniu kont online dane kont będą przechowywane u ${TODO('nazwa dostawcy bazy danych')}, na terenie Unii Europejskiej.</p>
<h3>Własność intelektualna</h3>
<p>Teksty, rutyny, ilustracje, emblematy, elementy graficzne i kod Jade są chronione francuskim Kodeksem własności intelektualnej i należą do wydawcy, o ile nie wskazano inaczej. Wszelkie powielanie lub ponowne wykorzystanie bez zgody jest zabronione.</p>
<p>Counter-Strike 2, Valorant, Kovaak's, Aim Lab, FACEIT, Steam i Discord są znakami towarowymi ich właścicieli. Jade to niezależna strona bez oficjalnych powiązań z Valve, Riot Games, Kovaak's, Statespace, FACEIT ani Discord. Nazwy scenariuszy treningowych podano informacyjnie, by można je było znaleźć w danym oprogramowaniu.</p>
<h3>Zgłaszanie treści</h3>
<p>Zobacz dokument „Zgłoś treść”. Kontakt: ${MAIL}.</p>` },

  { id: 'cgu', title: 'Regulamin korzystania', updated: '2026-09-27', html: `
<h3>1. Przedmiot</h3>
<p>Niniejszy regulamin określa zasady dostępu do strony Jade i korzystania z niej. Strona oferuje rutyny treningu celowania, testy, system poziomów, rang i nagród kosmetycznych, narzędzia optymalizacji, śledzenie postępów, wyzwania i przestrzeń społecznościową. Korzystanie ze strony oznacza akceptację regulaminu.</p>
<h3>2. Dostęp do usługi</h3>
<p>Podstawowy dostęp jest darmowy. Wymaga sprzętu i połączenia z internetem na koszt użytkownika. Wydawca dba o dostępność strony, ale może ją przerwać z powodu konserwacji lub przyczyn technicznych, bez odszkodowania.</p>
<h3>3. Konto</h3>
<ul><li>Konto mogą założyć osoby, które ukończyły 15 lat. Zgodnie z art. 45 francuskiej ustawy o informatyce i wolnościach osoba poniżej 15 lat nie może samodzielnie wyrazić zgody na przetwarzanie swoich danych.</li><li>Jedno konto na osobę. Podane informacje muszą być prawdziwe.</li><li>Odpowiadasz za poufność hasła i aktywność na swoim koncie. Niezwłocznie informuj nas o każdym nieuprawnionym użyciu.</li><li>Obecna wersja: konta są przechowywane lokalnie w twojej przeglądarce. Nie są jeszcze synchronizowane z serwerem.</li></ul>
<h3>4. Zasady społeczności</h3>
<p>Korzystanie z przestrzeni społecznościowych (forum, profile, wyzwania) podlega <a href="#/legal/community">Zasadom społeczności i moderacji</a>, które stanowią integralną część regulaminu.</p>
<h3>5. Treści użytkowników</h3>
<p>Zachowujesz prawa do publikowanych treści. Udzielasz wydawcy, na czas ich publikacji, bezpłatnej, niewyłącznej i światowej licencji na ich hosting, powielanie i wyświetlanie w Jade wyłącznie w celu działania usługi. Gwarantujesz, że masz niezbędne prawa do tych treści (teksty, obrazy, filmy).</p>
<h3>6. Moderacja</h3>
<p>Zgodnie z rozporządzeniem (UE) 2022/2065 w sprawie usług cyfrowych (DSA) zasady, środki i procedury moderacji opisano w Zasadach społeczności. Każda decyzja ograniczająca (usunięcie, ukrycie, zawieszenie) jest uzasadniana i można ją zakwestionować.</p>
<h3>7. Jade Coins, skrzynki i Arcade</h3>
<p>Jade Coins to darmowa wirtualna waluta bez wartości pieniężnej, uregulowana w <a href="#/legal/coins">Regulaminie Jade Coins, Sklepu i Arcade</a>.</p>
<h3>8. Wyzwania</h3>
<p>Cotygodniowe wyzwania podlegają <a href="#/legal/challenges">Regulaminowi wyzwań</a>.</p>
<h3>9. Odpowiedzialność</h3>
<p>Porady dotyczące treningu i optymalizacji mają charakter informacyjny. Odpowiadasz za ustawienia, które stosujesz na swoim sprzęcie i systemie. Jade nie gwarantuje żadnych rezultatów. Trenuj we własnym tempie i rób przerwy: jeśli bolą cię nadgarstki lub przedramiona, przerwij i skonsultuj się z lekarzem.</p>
<h3>10. Zawieszenie i rozwiązanie</h3>
<p>Możesz w każdej chwili usunąć konto w zakładce Dane swojego profilu. Wydawca może zawiesić lub zamknąć konto w razie poważnego lub powtarzającego się naruszenia regulaminu, na podstawie uzasadnionej decyzji, z wyjątkiem sytuacji pilnych lub obowiązku prawnego.</p>
<h3>11. Zmiany regulaminu</h3>
<p>Regulamin może się zmieniać. Każda istotna zmiana jest ogłaszana na stronie przed wejściem w życie. Dalsze korzystanie ze strony po tej dacie oznacza jej akceptację.</p>
<h3>12. Prawo właściwe i spory</h3>
<p>Regulamin podlega prawu francuskiemu. W razie sporu w pierwszej kolejności poszukuje się rozwiązania polubownego (kontakt: ${MAIL}). Jako konsument możesz bezpłatnie skorzystać z mediatora konsumenckiego wskazanego w Warunkach sprzedaży. W pozostałych przypadkach właściwe są sądy francuskie, bez uszczerbku dla przepisów chroniących konsumentów.</p>` },

  { id: 'cgv', title: 'Warunki sprzedaży', updated: '2026-09-27', html: `
<p><strong>Ważne: płatności nie są jeszcze aktywne.</strong> Niniejsze warunki zaczną obowiązywać po uruchomieniu płatnych ofert. Regulują sprzedaż między wydawcą a konsumentem.</p>
<h3>1. Oferty</h3>
<ul><li><strong>Darmowy</strong>: podstawowy dostęp bez limitu czasu.</li><li><strong>Program</strong>: 8-tygodniowy program treningowy, zakup jednorazowy, dożywotni dostęp do kupionych treści.</li><li><strong>Premium</strong>: miesięczna subskrypcja bez zobowiązań.</li></ul>
<p>Główne cechy każdej oferty przedstawiono na stronie Plany, zgodnie z art. L111-1 francuskiego Kodeksu konsumenckiego.</p>
<h3>2. Ceny</h3>
<p>Ceny podano w euro, z podatkami (art. L112-1 Kodeksu konsumenckiego). Żadna subskrypcja ani zakup nie daje Jade Coins.</p>
<h3>3. Zamówienie</h3>
<p>Przed potwierdzeniem widzisz podsumowanie zamówienia i łączną cenę. Przycisk potwierdzenia ma napis „Zamawiam z obowiązkiem zapłaty” lub równoważny (art. L221-14). Potwierdzenie otrzymujesz e-mailem na trwałym nośniku.</p>
<h3>4. Płatność</h3>
<p>Płatność obsługuje ${TODO('nazwa licencjonowanego dostawcy płatności')}. Jade nigdy nie ma dostępu do danych twojej karty.</p>
<h3>5. Czas trwania, odnowienie i rezygnacja z subskrypcji</h3>
<ul><li>Subskrypcja Premium jest miesięczna i odnawia się automatycznie.</li><li>Możesz z niej zrezygnować w każdej chwili, online, funkcją rezygnacji w zakładce Subskrypcja w profilu (art. L215-1-1 Kodeksu konsumenckiego, „rezygnacja w trzech kliknięciach”). Otrzymasz potwierdzenie.</li><li>Rezygnacja działa od końca już opłaconego okresu.</li></ul>
<h3>6. Prawo odstąpienia</h3>
<p>Masz 14 dni od zawarcia umowy na odstąpienie od niej bez podawania przyczyny (art. L221-18). W tym celu napisz na ${MAIL} lub użyj wzoru formularza odstąpienia.</p>
<p>Wyjątki: w przypadku treści cyfrowych niedostarczanych na nośniku materialnym (Program) prawo odstąpienia wygasa po rozpoczęciu świadczenia za twoją uprzednią wyraźną zgodą i po wyraźnej rezygnacji z tego prawa (art. L221-28 pkt 13). W przypadku usługi (Premium), której wykonania zażądasz przed upływem terminu, płacisz kwotę proporcjonalną do usługi świadczonej do chwili odstąpienia (art. L221-25).</p>
<h3>7. Ustawowa gwarancja zgodności</h3>
<p>Treści i usługi cyfrowe objęte są ustawową gwarancją zgodności z art. L224-25-12 i nast. Kodeksu konsumenckiego: doprowadzenie do zgodności, a w razie niemożności obniżenie ceny lub rozwiązanie umowy. Przy dostarczaniu ciągłym (subskrypcja) gwarancja obejmuje cały okres dostarczania; przy jednorazowym (Program) wady ujawnione w ciągu dwóch lat.</p>
<h3>8. Obsługa klienta</h3>
<p>${MAIL}. Odpowiedź średnio w ciągu 48 godzin roboczych.</p>
<h3>9. Mediacja konsumencka</h3>
<p>Zgodnie z art. L612-1 Kodeksu konsumenckiego, jeśli spór nie zostanie rozwiązany przez obsługę klienta, możesz bezpłatnie zwrócić się do mediatora konsumenckiego: ${TODO('nazwa, strona i adres mediatora')}.</p>
<h3>10. Prawo właściwe</h3>
<p>Warunki podlegają prawu francuskiemu, bez uszczerbku dla korzystniejszych przepisów kraju twojego zamieszkania.</p>` },

  { id: 'privacy', title: 'Polityka prywatności', updated: '2026-09-27', html: `
<p>Niniejsza polityka wyjaśnia, jakie dane przetwarza Jade, w jakim celu i jakie masz prawa, zgodnie z rozporządzeniem (UE) 2016/679 (RODO) oraz francuską ustawą nr 78-17 z 6 stycznia 1978 r. (o informatyce i wolnościach).</p>
<h3>Administrator danych</h3>
<p>${EDITOR}, kontakt: ${MAIL}. ${TODO('Dane kontaktowe inspektora ochrony danych, jeśli został wyznaczony')}.</p>
<h3>Obecna sytuacja</h3>
<p>W obecnej wersji Jade działa bez serwera kont: twoje konto, postępy, Jade Coins, ekwipunek i sesje są przechowywane <strong>wyłącznie w pamięci lokalnej twojej przeglądarki</strong>. Wydawca nie ma do nich dostępu. Poniższe punkty opisują też planowane działanie po uruchomieniu kont online; polityka zostanie wtedy zaktualizowana.</p>
<h3>Przetwarzane dane, cele i podstawy prawne</h3>
<ul>
<li><strong>Konto</strong> (nazwa użytkownika, e-mail, zaszyfrowane hasło, data urodzenia): utworzenie i zabezpieczenie konta, weryfikacja minimalnego wieku. Podstawa: wykonanie umowy (regulamin) i obowiązek prawny w zakresie wieku.</li>
<li><strong>Trening</strong> (wyniki, zaimportowane sesje, rekordy, XP, ranga, Jade Coins, ekwipunek): świadczenie usługi. Podstawa: wykonanie umowy.</li>
<li><strong>Profil publiczny i forum</strong> (nazwa użytkownika, awatar, baner, posty): prowadzenie społeczności. Podstawa: wykonanie umowy. Informacje te są widoczne dla innych użytkowników zgodnie z twoimi ustawieniami.</li>
<li><strong>Moderacja i bezpieczeństwo</strong> (zgłoszenia, sankcje, logi techniczne): ochrona użytkowników i wypełnianie naszych obowiązków. Podstawa: prawnie uzasadniony interes i obowiązki prawne (w tym przechowywanie danych o połączeniach wymagane przez LCEN i jej rozporządzenie wykonawcze).</li>
<li><strong>Pomoc</strong> (wiadomości): odpowiadanie na twoje prośby. Podstawa: wykonanie umowy.</li>
<li><strong>E-maile informacyjne</strong> (podsumowanie, przypomnienie o wyzwaniu): tylko jeśli je włączysz. Podstawa: zgoda, którą można w każdej chwili wycofać.</li>
<li><strong>Pomiar oglądalności</strong>: domyślnie wyłączony, tylko za twoją zgodą (zob. polityka cookie).</li>
</ul>
<h3>Odbiorcy</h3>
<p>Dane są przeznaczone dla wydawcy i jego technicznych podmiotów przetwarzających: hostingu strony (Vercel Inc.) oraz, po uruchomieniu kont online, ${TODO('dostawcy bazy danych i poczty e-mail')}. Czcionki strony są hostowane na samej stronie: żadne zapytanie nie trafia do zewnętrznej usługi czcionek. Żadne dane nie są sprzedawane ani używane do reklamy.</p>
<h3>Przekazywanie poza Unię Europejską</h3>
<p>Dostawca hostingu ma siedzibę w Stanach Zjednoczonych. Ewentualne przekazywanie danych odbywa się w ramach EU–US Data Privacy Framework lub standardowych klauzul umownych Komisji Europejskiej.</p>
<h3>Okresy przechowywania</h3>
<ul><li>Dane konta i treningowe: tak długo, jak istnieje konto, potem usuwane w ciągu 30 dni.</li><li>Posty na forum: usuwane lub anonimizowane przy usunięciu konta.</li><li>Dane o połączeniach: 1 rok (obowiązek prawny).</li><li>Wiadomości do pomocy: 3 lata od ostatniej wymiany.</li><li>Wybory dotyczące cookie: 6 miesięcy.</li></ul>
<h3>Zautomatyzowane decyzje</h3>
<p>Poziom, ranga i odznaki są obliczane automatycznie na podstawie twoich wyników. To obliczenie nie wywołuje skutków prawnych ani istotnych konsekwencji w rozumieniu art. 22 RODO.</p>
<h3>Małoletni</h3>
<p>Strona jest dostępna od 15. roku życia. Zgodnie z art. 45 francuskiej ustawy o informatyce i wolnościach osoba poniżej 15 lat może się zarejestrować tylko za wspólną zgodą opiekuna prawnego; ponieważ taka procedura nie istnieje, rejestracja jest odrzucana. Arcade jest zarezerwowane dla pełnoletnich.</p>
<h3>Twoje prawa</h3>
<p>Masz prawo dostępu, sprostowania, usunięcia, ograniczenia, przenoszenia i sprzeciwu, a także prawo do określenia dyspozycji dotyczących danych po śmierci (art. 85 francuskiej ustawy o informatyce i wolnościach). Większość z nich zrealizujesz bezpośrednio w zakładce Dane w profilu (eksport i usunięcie). W pozostałych sprawach napisz na ${MAIL}. Możesz złożyć skargę do CNIL (www.cnil.fr) lub do lokalnego organu nadzorczego (w Polsce: Prezes UODO).</p>
<h3>Bezpieczeństwo</h3>
<p>Hasła są hashowane (kryptograficzny odcisk) i nigdy nie są przechowywane jawnym tekstem. Komunikacja ze stroną jest szyfrowana (HTTPS).</p>` },

  { id: 'cookies', title: 'Polityka cookie i mechanizmów śledzących', updated: '2026-09-27', html: `
<p>Zgodnie z art. 82 francuskiej ustawy o informatyce i wolnościach oraz wytycznymi i zaleceniami CNIL Jade informuje cię o używanych mechanizmach i pozwala dokonać wyboru.</p>
<h3>Czym jest mechanizm śledzący?</h3>
<p>Plik cookie lub inny mechanizm (np. pamięć lokalna przeglądarki) zapisuje informacje na twoim urządzeniu. Te same zasady obowiązują niezależnie od techniki.</p>
<h3>Mechanizmy niezbędne (bez zgody)</h3>
<ul><li><code>jade:theme</code>, <code>jade:lang</code>, <code>jade:sfx</code>, <code>jade:anims</code>: twoje preferencje wyświetlania.</li><li><code>jade:accounts</code>, <code>jade:current</code>: twoje lokalne konto i sesja.</li><li><code>jade:u:…</code>: twoje postępy, Jade Coins, ekwipunek, sesje.</li><li><code>jade:cookies</code>: twój wybór dotyczący mechanizmów śledzących.</li><li>Pamięć sesji: obejrzane intro, sesja administracyjna.</li></ul>
<p>Te mechanizmy służą wyłącznie świadczeniu usługi, o którą prosisz. Nie opuszczają twojego urządzenia.</p>
<h3>Pomiar oglądalności (za zgodą)</h3>
<p>Obecnie nie działa żadne narzędzie do pomiaru oglądalności. Jeśli zostanie dodane, zadziała dopiero po twojej zgodzie i posłuży wyłącznie do sprawdzenia, które strony są przydatne, bez identyfikowania kogokolwiek.</p>
<h3>Reklama</h3>
<p>Brak. Jade nie używa żadnych mechanizmów reklamowych ani zewnętrznych sieci społecznościowych.</p>
<h3>Treści zewnętrzne</h3>
<p>Filmy z YouTube osadzone na forum są ładowane przez youtube-nocookie.com (tryb rozszerzonej prywatności). Czcionki są hostowane na stronie: do ich wyświetlania nie kontaktujemy się z żadną zewnętrzną usługą.</p>
<h3>Okres</h3>
<p>Twój wybór jest przechowywany przez 6 miesięcy, potem zapytamy ponownie. Mechanizmy wymagające zgody działają maksymalnie 13 miesięcy.</p>
<h3>Zmiana decyzji</h3>
<p>Link „Ustawienia cookie” na dole każdej strony ponownie otwiera baner. Odmowa jest równie prosta jak akceptacja. Możesz też wyczyścić pamięć przeglądarki lub usunąć wszystko w zakładce Dane swojego profilu.</p>` },

  { id: 'community', title: 'Zasady społeczności i moderacji', updated: '2026-09-27', html: `
<p>Te zasady są częścią regulaminu. Opisują, co jest dozwolone w Jade i jak działa moderacja, zgodnie z rozporządzeniem (UE) 2022/2065 w sprawie usług cyfrowych (DSA) i LCEN.</p>
<h3>Co jest zakazane</h3>
<ul><li>Wszelkie nielegalne treści: nienawiść, dyskryminacja, nękanie, groźby, pochwalanie terroryzmu lub przestępstw, materiały przedstawiające wykorzystywanie seksualne dzieci, naruszanie prywatności, zniesławienie, podróbki.</li><li>Oszukiwanie: promowanie, linkowanie lub udostępnianie cheatów, skryptów czy „boostowanych” kont.</li><li>Oszustwa: phishing, fałszywe konkursy, fałszywe strony ze skinami lub turniejami, prośby o dane logowania lub kody.</li><li>Sprzedaż kont, płatny boosting, udostępnianie danych logowania (zakazane przez wydawców gier).</li><li>Dane osobowe osób trzecich, podszywanie się pod innych.</li><li>Spam, niezamówiona reklama, treści seksualne lub brutalne.</li></ul>
<h3>Zgłaszanie</h3>
<p>Każdy post ma przycisk „Zgłoś”. Możesz też skorzystać z procedury opisanej w „Zgłoś treść”. Zgłoszenia są rozpatrywane starannie, w sposób niearbitralny i obiektywny.</p>
<h3>Środki moderacji</h3>
<p>Moderację prowadzą ludzie (moderatorzy i administratorzy). Narzędzia automatyczne mogą tymczasowo ukryć często zgłaszaną treść do czasu weryfikacji przez człowieka; żadna ostateczna sankcja nie zapada bez udziału człowieka.</p>
<h3>Decyzje i sankcje</h3>
<ul><li>W zależności od wagi: ostrzeżenie, ukrycie lub usunięcie treści, tymczasowe zawieszenie, zamknięcie konta.</li><li>Każda decyzja jest uzasadniana: fakty, zastosowana zasada, możliwe środki odwoławcze (art. 17 DSA).</li><li>Treści oczywiście nielegalne są szybko usuwane. Poważne przestępstwa mogą być zgłaszane organom (we Francji platforma PHAROS), a każde zagrożenie życia lub bezpieczeństwa osoby jest zgłaszane właściwym organom (art. 18 DSA).</li></ul>
<h3>Odwołania</h3>
<p>Możesz bezpłatnie zakwestionować dotyczącą cię decyzję w ciągu 6 miesięcy, pisząc na ${MAIL}. Odwołanie rozpatruje osoba, która nie podjęła pierwotnej decyzji. Możesz też zwrócić się do właściwego sądu.</p>
<h3>Nadużycia zgłoszeń</h3>
<p>Oczywiście bezzasadne i powtarzające się zgłoszenia mogą skutkować tymczasowym wstrzymaniem rozpatrywania twoich zgłoszeń. Świadome przedstawianie treści jako nielegalnej w celu jej usunięcia może być karalne.</p>` },

  { id: 'challenges', title: 'Regulamin wyzwań', updated: '2026-09-27', html: `
<h3>1. Organizator</h3>
<p>Cotygodniowe wyzwania organizuje ${EDITOR}.</p>
<h3>2. Udział</h3>
<p>Udział jest bezpłatny, bez obowiązku zakupu, i otwarty dla każdego posiadacza konta Jade. Subskrypcja nie daje żadnej przewagi w głównym rankingu wyzwań. Wyzwania opierają się wyłącznie na umiejętnościach uczestników, bez elementu losowości.</p>
<h3>3. Przebieg</h3>
<p>Każde wyzwanie dotyczy ogłoszonego scenariusza, od poniedziałku 00:00 do niedzieli 23:59 (czasu paryskiego). Liczy się tylko najlepszy wynik każdego uczestnika w tym okresie.</p>
<h3>4. Weryfikacja</h3>
<ul><li>Wynik musi zostać osiągnięty dokładnie w ogłoszonym scenariuszu, bez modyfikacji gry i bez zewnętrznego oprogramowania.</li><li>Pierwsza trójka musi dostarczyć pełne wideo swojej najlepszej sesji, by potwierdzić miejsce.</li><li>Wyniki mogą być porównywane z oficjalnymi rankingami oprogramowania treningowego.</li><li>Każda próba fałszerstwa oznacza wykluczenie z wyzwań i utratę nagród.</li></ul>
<h3>5. Nagrody</h3>
<p>Każdy uczestnik z ważnym wynikiem otrzymuje XP i Jade Coins zależnie od miejsca (300 monet za 1. miejsce, 250 za top 3, 200 za top 10, 150 za top 25, 100 dla pozostałych). Ewentualna nagroda tygodnia jest ogłaszana na stronie Wyzwania. Nie można jej wymienić na gotówkę ani przekazać. Zwycięzca otrzymuje e-mail w ciągu siedmiu dni i ma 30 dni na jej odebranie.</p>
<h3>6. Dane</h3>
<p>Nazwy użytkowników i wyniki uczestników pojawiają się w publicznym rankingu. Dane są przetwarzane zgodnie z polityką prywatności.</p>
<h3>7. Zmiany</h3>
<p>Regulamin może się zmieniać; każda zmiana jest ogłaszana na tej stronie przed danym wyzwaniem.</p>` },

  { id: 'coins', title: 'Regulamin Jade Coins, Sklepu i Arcade', updated: '2026-09-27', html: `
<h3>1. Charakter Jade Coins</h3>
<ul><li>Jade Coins to <strong>darmowa</strong> wirtualna waluta, której można używać wyłącznie w Jade.</li><li>Zdobywa się je wyłącznie korzystając ze strony (sesje, rekordy, serie, kamienie milowe poziomów, wyzwania).</li><li><strong>Nie można ich kupić</strong>, ani bezpośrednio, ani w ramach subskrypcji czy płatnej oferty.</li><li><strong>Nie mają wartości pieniężnej</strong>: nie podlegają zwrotowi, wymianie na pieniądze lub towary, nie można ich wymieniać ani przekazywać między kontami.</li><li>Stanowią zwykłą, osobistą i odwołalną licencję na korzystanie, przypisaną do konta.</li></ul>
<h3>2. Skrzynki i przedmioty kosmetyczne</h3>
<ul><li>Skrzynki otwiera się wyłącznie za Jade Coins. Ich zawartość jest losowana; <strong>szanse każdego przedmiotu i każdej rzadkości są wyświetlane</strong> przed otwarciem.</li><li>Przedmioty są czysto kosmetyczne (banery, ramki, tytuły). Nie dają przewagi w testach, rangach ani wyzwaniach.</li><li>Przedmiotów nie można przekazywać, wymieniać ani odsprzedawać, ani w Jade, ani poza nim. Nie są to „cyfrowe przedmioty podlegające monetyzacji”.</li><li>Liczba otwarć jest ograniczona dziennie.</li></ul>
<h3>3. Arcade</h3>
<ul><li>Arcade oferuje rozrywkowe minigry (koło, orzeł czy reszka, siatka) z użyciem Jade Coins.</li><li>Ponieważ nie ma stawki finansowej ani wygranych o wartości pieniężnej, gry te nie są grami hazardowymi w rozumieniu art. L320-1 francuskiego Kodeksu bezpieczeństwa wewnętrznego.</li><li>Dla ostrożności Arcade jest <strong>zarezerwowane dla pełnoletnich</strong>, ograniczone do liczby gier dziennie, a każdy gracz może się wykluczyć (na 7 dni, 30 dni lub na zawsze) w Sklepie.</li><li>Oczekiwany zwrot każdej gry jest mniejszy lub równy stawce: żadna strategia nie pozwala „zarabiać” monet w dłuższym okresie.</li></ul>
<h3>4. Odpowiedzialna gra</h3>
<p>Te mechaniki mają pozostać zabawą. Jeśli czujesz, że nie potrafisz przestać, w grach lub gdzie indziej, porozmawiaj o tym. We Francji: Joueurs Info Service, 09 74 75 13 13 (opłata standardowa, 7 dni w tygodniu).</p>
<h3>5. Zmiany i wycofanie</h3>
<p>Wydawca może zmienić skalę nagród, zawartość skrzynek lub gry albo je wycofać, po poinformowaniu użytkowników. Usunięcie konta oznacza utratę Jade Coins i przedmiotów bez rekompensaty, ponieważ nie mają one wartości pieniężnej.</p>
<h3>6. Nadużycia</h3>
<p>Każda manipulacja (modyfikacja danych, automatyzacja, wykorzystanie błędu) może skutkować wyzerowaniem Jade Coins i ekwipunku.</p>` },

  { id: 'accessibility', title: 'Deklaracja dostępności', updated: '2026-09-27', html: `
<p>Wydawca zobowiązuje się udostępnić Jade jak najszerszemu gronu osób, w oparciu o francuski standard dostępności (RGAA 4.1) i normę EN 301 549.</p>
<h3>Stan zgodności</h3>
<p>Strona nie przeszła jeszcze pełnego audytu. Do czasu audytu jest deklarowana jako <strong>niezgodna</strong>, co oznacza, że zgodność nie została jeszcze zmierzona.</p>
<h3>Wdrożone rozwiązania</h3>
<ul><li>Pełna obsługa klawiaturą, widoczny fokus, link do przejścia do treści.</li><li>Wyszukiwanie globalne (Ctrl + K), by znaleźć każdą stronę i treść.</li><li>Respektowanie systemowego ustawienia „ogranicz ruch” i przełącznik Animacje w profilu.</li><li>Motywy jasny, ciemny i o wysokim kontraście.</li><li>Dźwięki domyślnie wyłączone.</li></ul>
<h3>Znane niedostępne treści</h3>
<ul><li>Testy celowania i niektóre próby z natury opierają się na precyzji i szybkości myszy.</li><li>Animacja wprowadzająca używa dekoracyjnego canvasu (bez istotnych informacji).</li><li>Wykresy postępów nie mają jeszcze pełnej alternatywy tekstowej.</li></ul>
<h3>Uwagi i kontakt</h3>
<p>Jeśli problem z dostępnością uniemożliwia ci dostęp do treści lub funkcji, napisz na ${MAIL}: przekażemy ci informację w innej formie.</p>
<h3>Środki odwoławcze</h3>
<p>Jeśli nie otrzymasz satysfakcjonującej odpowiedzi, możesz zwrócić się do francuskiego Rzecznika Praw (Défenseur des droits, www.defenseurdesdroits.fr).</p>` },

  { id: 'report', title: 'Zgłoś treść', updated: '2026-09-27', html: `
<p>Zgodnie z art. 11, 12 i 16 rozporządzenia (UE) 2022/2065 (DSA) i LCEN, oto jak zgłosić treść, którą uważasz za nielegalną lub sprzeczną z zasadami.</p>
<h3>Na stronie</h3>
<p>Użyj przycisku „Zgłoś” pod danym postem lub formularza na stronie Bezpieczeństwo w przypadku oszustwa.</p>
<h3>E-mailem</h3>
<p>Napisz na ${MAIL}, podając:</p>
<ul><li>dokładny adres (URL) treści;</li><li>wystarczająco uzasadnione wyjaśnienie, dlaczego uważasz ją za nielegalną;</li><li>swoje imię i nazwisko oraz adres e-mail (z wyjątkiem materiałów przedstawiających wykorzystywanie seksualne dzieci);</li><li>oświadczenie, że działasz w dobrej wierze, a podane informacje są dokładne i kompletne.</li></ul>
<p>Otrzymasz potwierdzenie odbioru, a potem podjętą decyzję wraz z uzasadnieniem.</p>
<h3>Pojedynczy punkt kontaktowy</h3>
<p>Organy państw członkowskich, Komisja Europejska i Europejska Rada ds. Usług Cyfrowych: ${MAIL} (po francusku lub angielsku). Użytkownicy: ten sam adres.</p>
<h3>Inne przydatne zasoby (Francja)</h3>
<ul><li>Poważne nielegalne treści: internet-signalement.gouv.fr (PHAROS).</li><li>Cyberprzemoc: 3018 (telefon, czat lub aplikacja, bezpłatnie i anonimowo).</li><li>Oszustwo lub włamanie: 17cyber.gouv.fr i cybermalveillance.gouv.fr.</li><li>Bezpośrednie zagrożenie: 17 lub 112.</li></ul>
<h3>Ostrzeżenie</h3>
<p>Zgodnie z prawem francuskim przedstawienie dostawcy hostingu treści jako nielegalnej w celu jej usunięcia, ze świadomością, że ta informacja jest nieprawdziwa, podlega karze roku pozbawienia wolności i grzywny w wysokości 15 000 €.</p>` },

  { id: 'sources', title: "Źródła i podziękowania", updated: '2026-09-28', html: `
<p>Jade opiera się na pracy społeczności trenującej celowanie. Ta strona wyjaśnia, skąd pochodzą treści serwisu i do kogo należą wymienione znaki towarowe.</p>
<h3>Rutyny treningowe</h3>
<p>Dobór i kolejność scenariuszy, liczba runów i kody playlist pochodzą z publicznych dokumentów <strong>Voltaic</strong>, społeczności trenującej celowanie (voltaic.gg): rutyny podstawowe, pod słabości i pod konkretne gry, dla Kovaak's i Aim Lab. Biblioteka scenariuszy opiera się na ich zestawieniu polecanych scenariuszy (przeróbka z 2024 r. autorstwa clover).</p>
<ul><li>Ekspercka rutyna do Valorant: bardOZ, dla Voltaic.</li><li>Rozgrzewka RAMP do Valorant: minigodcs, dla Voltaic.</li><li>Rutyna szybkiego switchingu: Viscose i Christmasiscancelled.</li></ul>
<p>Tytuły, instrukcje i tłumaczenia przygotował Jade. Jade nie jest powiązany z Voltaic ani przez niego zatwierdzony. Prośby o poprawkę lub usunięcie: ${MAIL}.</p>
<h3>Nazwy scenariuszy</h3>
<p>Scenariusze należą do ich twórców. Ich nazwy podajemy bez zmian, by można je było znaleźć w Kovaak's i Aim Lab.</p>
<h3>Znaki towarowe</h3>
<p>Counter-Strike 2 i Steam są znakami Valve Corporation; Valorant jest znakiem Riot Games; Kovaak's należy do swoich wydawców; Aim Lab jest znakiem Statespace; FACEIT i Discord należą do swoich właścicieli. Jade to niezależna strona bez oficjalnych powiązań z tymi firmami.</p>
<h3>Czcionki i grafika</h3>
<p>Czcionki Chakra Petch i Manrope na licencji SIL Open Font License 1.1, hostowane na stronie. Emblematy rang, grafiki skrzynek, ikony i kosmetyki stworzono dla Jade.</p>
<h3>Informacje praktyczne</h3>
<p>Ustawienia optymalizacji opierają się na oficjalnych opcjach Windows, sterowników NVIDIA i AMD oraz gier. Zasoby pomocy dla ofiar na stronie Bezpieczeństwo to francuskie służby publiczne (17cyber.gouv.fr, cybermalveillance.gouv.fr). Punkty odniesienia testów i rang skalibrował Jade; są tymczasowe.</p>` },
];
