# La Torre — H-7 R-8.1 Straight Wide C120 Universal

Abbiamo una scorta di **computer usati**: alcuni già identificati, altri ancora da misurare. Il progetto prova a riutilizzarli come piccolo cluster domestico, senza comprare sette computer nuovi e senza tenere sette vecchi case ingombranti. I PC restano **indipendenti**, collegati tra loro tramite rete: non stiamo costruendo un unico supercomputer.

**Canone del 24 novembre 2026:** [R-8.1 Straight Wide C120 Universal](docs/H7_R81_CANONE_2026-11-24.md) + DAS H-4 separato. Sette sedi a 0°, base 1325 × 310 mm, carrier candidato 120 × 284 × 280 mm, passo 190, luce fra guide 52 mm. Obiettivo ≤17 kg sul top, limite IKEA 20 kg; PSU commerciali su supporto indipendente preferito. La scelta architetturale è canonica; quote, giunti, cablaggio e termica non sono approvati per fabbricare. [Render corrente](index.html) · [Registro](registro.html).

**Direzione precedente del 23 novembre 2026: H-7 FB-1 + torrino storage H-4.** La struttura principale a sette moduli è disposta **a spina di pesce in pianta, come parcheggi obliqui**, non come due file a V impilate. Abbiamo eliminato la piastra di betulla: telaio aperto in metallo, adattatori specifici stampati in PETG tramite servizio esterno, zero HDD meccanici nei PC. Le vecchie geometrie R-2, R-3 e R-4 sono conservate per confronto, non descrivono più la soluzione scelta.

> **Novità R-6 Metal-Lite (23/11, studio successivo alla FB-1).** La [nuova pianta parametrica](r6.html) e il [dossier R-6](docs/H7_R6_METAL_LITE_2026-11-23.md) riprogettano le sette cartucce come telai aperti in alluminio, sostituendo i lunghi sostegni stampati con guide metalliche leggere e componenti PETG piccoli. **Obiettivo 0,7–1,2 kg PETG**; sagoma di studio 1310×305 mm. La FB-1 illustrata più sotto resta il **render 3D storico**, non un disegno da fabbricare. Nessun acquisto o stampa autorizzati prima dei rilievi e collaudi.

**Integrazione del 24/11:** i due rami notturni geometria e UX sono stati verificati insieme; [leggi il rapporto tecnico e i test](docs/INTEGRAZIONE_H7_FB1_2026-11-24.md). Le quote rimangono di studio e il progetto resta NO-GO alla stampa.

## R-7 Long Life — progettare per il prossimo hardware

La [specifica R-7](docs/H7_R7_LONG_LIFE_2026-11-24.md) introduce un carrier metallico permanente con traversine riposizionabili, adattatori minimi e target Mini-ITX / Micro-ATX 244 × 244. Candidato 92 × 284 × 280 mm: pianta R-6 invariata, altezza maggiorata da verificare. PSU indipendenti e riutilizzabili soltanto se compatibili; niente hot swap. Prima del congelamento si collaudano n1 e una dima inerte 244 × 244. **NO-GO alla serie; il render 3D non rappresenta ancora R-7.**

## R-7 Airflow — ventilazione (studio)

[Studio termogeometrico e protocollo n1](docs/H7_R7_AIRFLOW_2026-11-24.md): candidato 38°/170 mm, luce locale 23,96 mm contro 11,88 mm a 42°/164; basamento invariato, margini in profondità stretti. AirRail modulare, estrazione superiore da collaudare. Nessun cambio al render, nessuna CFD o approvazione produzione.

## R-7 Airflow Wide — studio storico

[Studio Wide e tolleranze](docs/H7_R7_AIRFLOW_WIDE_2026-11-24.md): basamento candidato 1325 × 310, sette carrier a 36° / passo 175 mm, luce locale nominale 31,58 mm. Alternative 35° e 37°. Sfruttamento piano quasi integrale, margini da misurare; storico superato da R-8.1. NO-GO alla produzione.

## R-8 Straight Wide — variante stretta storica (studio)

[Dimostrazione geometrica e limiti](docs/H7_R8_STRAIGHT_WIDE_2026-11-24.md): 0° / passo 196 mm, base 1325 × 310, luce locale con guide 86 mm; margini conservativi nominali 19,5/13 mm. Resta da verificare hardware completo, cablaggio, PSU, stabilità e temperatura. R-7 Wide 36° resta confronto; [anteprima R-8](r8.html), [FB-1 storico](fb1.html). NO-GO produzione.

## Proposta di modulo pioniere n4 — Fujitsu ESPRIMO (26/11)

Il primo C120 può essere collaudato con il Fujitsu proveniente dall'archivio di Udine, mantenendo n1 intatto e operativo. **[Anteprima n4 / esploso / sette sedi](n4/index.html)** · [Dossier P0.1](n4/README.md) · [CAD](n4/n4.scad) · [Dima](n4/dummy.stl) · [Render](n4/assembly.png) · [Distinta](n4/bom.csv). Identificazione provvisoria Q510/Q910/Q520/Q920, dima 65×195×190, 82 mm tasca cavi e verifica geometrica nominale positiva. Il requisito Fujitsu di 200 mm dalle griglie impedisce di certificare la popolazione adiacente: NO-GO finché non rilevata e verificata. Il canone C120 non cambia.

**P0.2 n4:** [Confronto VESA A / selle B](n4/p02/index.html) · [tavola dimensionale](n4/p02/tavola.svg) · [calcolatore griglie](n4/p02/thermal.html) · [dossier](n4/p02/README.md). Dieci controlli booleani su dima e quattro modelli; montanti B a tubolare 12×15×1,5 dopo screening di flessione. Rilievo hardware e validazione G0–G4 ancora aperti; nessun cambio C120 o n1.

## Fase 1 — prototipo n1

**P0.6 NetRail:** [dossier](docs/H7_C120_P06_NETRAIL_2026-11-24.md) · [calcolatore](netrail.html) · [rilievi CSV](netrail-survey.csv). n2 4TB su USB2, n3 Ethernet 100M e HDD su USB3; nessun cambio rete.

**P0.5 PowerRail:** [dossier](docs/H7_C120_P05_POWERRAIL_2026-11-24.md) · [calcolatore](powerrail.html) · [rilievi CSV](powerrail-survey.csv). PSU indipendenti, UPS prioritario storage/rete, NUT candidato non installato; nessuna misura AC.

**P0.4 AirRail/AirSense:** [dossier termico](docs/H7_C120_P04_AIRRAIL_AIRSENSE_2026-11-24.md) · [calcolatore interattivo](airrail.html) · [script passivo](tools/airsense.py). Raffreddamento locale sempre attivo; 0/1/4/7 ventole candidate, non approvate; nessun test sotto carico.

**P0.3 ServiceDock:** [architettura e manutenzione](docs/H7_C120_N1_P03_SERVICEDOCK_2026-11-24.md) · [tavola](n1-p03.svg) · [rilievo cavi CSV](n1-p03-cables.csv). Porte originali preferite, tasca 65 lordi e possibile ostacolo a 35,5 mm; HDD n1 /srv con 268 GiB occupati, migrazione bloccata fino a backup e verifica dipendenze.

**P0.2:** [Universal Mount, irrigidimento e ritenute](docs/H7_C120_N1_P02_MOUNT_2026-11-24.md) · [tavola](n1-p02.svg) · [delta CSV](n1-p02-delta.csv). Due alternative di supporto, quattro ritenute positive candidate; budget componenti A1 C120 77,9 mm lordi. NO-GO fabbricazione.

**P0.1:** [distinta tagli e giunti](docs/H7_C120_N1_P01_DISTINTA_2026-11-24.md) · [tavola](n1-p01.svg) · [CSV](n1-p01-bom.csv). Banco 380 × 310, angolari inferiori 15 mm, guide a ±66; studio, non taglio autorizzato.

[Distinta P0, geometria e rilievo](docs/H7_C120_N1_PROTOTIPO_2026-11-24.md) · [Dima A3 1:1 (solo a freddo)](n1-dima.svg). Inventario live verificato, fori e ingombri fisici aperti; stima P0 59–166 euro, non offerta. Nessuna fabbricazione.

## R-8.1 Universal — direzione corrente, quote candidate

[Studio C120 e protocollo n1](docs/H7_R81_UNIVERSAL_2026-11-24.md): involucro candidato 120 × 284 × 280, passo 190, luce guida 52 mm, adattatori metallici per 92 mm. PSU commerciali indipendenti preferibilmente su supporto ventilato separato dal top. Per n1 studiare tasca cavi interna; [anteprima 3D C120](index.html) aggiornata; [R-8 92/196 storico](r8.html). Modello concettuale, non CAD esecutivo. NO-GO fabbricazione.

## Come si presenta

La **Torre H-7** poggia sul mobile bianco IKEA HAUGA. Sette cartucce perpendicolari a 0° sfruttano la larghezza nominale del piano; la disposizione obliqua FB-1 è conservata solo in archivio. Ogni nodo conserva il proprio SSD di avvio. I dettagli dei dissipatori, degli alimentatori e dei fori delle schede non ancora censite sono ancora illustrativi; non vanno scambiati per CAD esecutivo.

Il **torrino dei dischi** è **separato**, sul piano della cassettiera vicino al mobile audio: un **DAS commerciale a 4 bay SATA** con alimentazione e ventilazione proprie, e un **hub USB 3.x alimentato a 4 porte** per altre periferiche (**un secondo hub solo se servirà**, su porta host separata se possibile). Lo scenario iniziale prevede soltanto **due HDD USB, 8 TB e 4 TB**, mantenuti nelle loro custodie: **quattro bay SATA liberi** in attesa di dischi compatibili. L'8 TB oggi si trova su n3: **nessun disco è stato migrato**. Due collegamenti USB separati raggiungeranno **n2 ospitato nella Torre**, che poi può condividere i volumi sulla LAN via NFS/Samba; non si collega lo stesso disco a due host USB.

Il **mobile multilivello** raccoglie i quattro satelliti audio, il subwoofer e il router. La **scrivania** ospita tastiera, mouse, laptop aperto su leggio e smartphone sul proprio leggio. Sul bordo sinistro sono progettate **sei prese USB-C**, due rappresentate collegate (telefono e postazione PC). Porte dati, alimentazione e potenze di ricarica sono da specificare prima dell'acquisto.

## Vincoli reali, prima dell'estetica

Il mobile è un **IKEA HAUGA 004.150.47**: circa 137 × 35,5 × 54 cm misurati, **spalletta a U alta 9 cm e spessa 1 cm**. Il produttore dichiara **20 kg massimo sul piano** e richiede l'ancoraggio del mobile a parete. Vogliamo **nessuna vite aggiuntiva nel mobile**: la Torre usa appoggi metallici smontabili sul piano interno, senza scaricare sulla spalletta, e deve poter poggiare anche a terra.

L'ingombro storico **FB-1 è preliminarmente 1310 × 318 mm** e l'angolo proposto **42°**, con sette cartucce da **92 × 284 mm** di impronta esterna illustrativa. Il confronto è con la luce nominale catalogo **1345 × 330 mm**, **non con una misura interna certificata dell'esemplare**. Il nuovo budget di massa **non è ancora verificato**; i 17,8 kg R-3 con HDD erano soltanto uno studio storico. Il DAS, sul mobile separato, **non entra** nel carico HAUGA. Verificare baricentro, distribuzione carichi, oscillazioni, accesso ai cavi e raffreddamento prima di costruire.

La stanza è circa **5 × 5 × 3 m**, con un solo angolo smussato, finestra 210 × 160 cm, tre monitor su bracci a muro e scrivania misurata 100 × 55 × 80 cm. Il modello cerca di rappresentare questa stanza, non uno showroom inventato. Dal 25/11/2026 HAUGA e H-7 sono sulla parete senza finestra (ex mobili marroni); multilivello audio/router e cassettiera DAS sono sulla parete della finestra, prima dell’apertura. Le posizioni in pianta sono ipotesi da misurare; la tratta USB lungo parete è schematica e va verificata per lunghezza e affidabilità.

## Variante autonoma a terra

La **[vista autonoma R-8.1](index.html#autonoma)** è una configurazione alternativa della **stessa Torre H-7**, non un secondo computer e non un basamento sul mobile: tutti e sette i moduli C120 restano identici e il telaio metallico viene rappresentato più basso, **senza i sei rialzi di studio da circa 107 mm necessari soltanto per superare la spalletta HAUGA**.

Il prototipo grafico della base comprende **il medesimo telaio a scala con sette traverse sotto le cartucce**, **sei scarpe rigide basse con suola elastomerica** (nessuna seconda coppia di longheroni né traverse a pavimento che si sovrappongano alle schede nel render) e **quattro ali stabilizzatrici rimovibili** (inizialmente nascoste, attivabili nel pannello Strumenti; la loro necessità è da dimostrare con un controllo di stabilità). Gli elementi sono selezionabili e la *Base autonoma* è uno strato indipendente con comando «Tutti» nel capitolo Torre. La vista include un piano di riferimento che **non è un pannello fisico di legno**. La profondità nominale del supporto senza ali è **circa 418 mm** e con ali aperte **circa 616 mm**: non deve essere confusa con l'**impronta C120 di studio 1325 × 310 mm** dei sette moduli sul mobile. Tutte le quote sono preliminari e cambieranno dopo rilievo dei cavi e delle schede.

**Sicurezza:** questa rappresentazione non dimostra che la Torre sia antiribaltamento né che i giunti sopportino il peso. Mancano ancora masse pesate, posizione del baricentro, attrito sul pavimento, carichi dinamici e definizione di una ritenuta indipendente dal mobile. La variante autonoma **non è ancora una soluzione costruttiva autorizzata**.

## Interfaccia R-5 (UX)

Il quinto passo UX migliora accessibilità, touch e prestazioni su mobile senza modificare la geometria in `assets/viewer.js`:

- Touch target di almeno 44 px, 48 px su dispositivi touch; switch con aree più ampie.
- Etichette ARIA, barra rapida accessibile e HUD di selezione con annunci discreti.
- Gestione del focus per finestra di aiuto e menu mobile, con ripristino alla chiusura.
- Barra rapida a scorrimento orizzontale, senza clipping, e blur ridotto sui dispositivi lenti.
- Test UX dedicati in `tests/test_ux_r5.py`.

## Blundercheck dei sostegni e intersezioni (23 novembre, round 1 + round 2 notturno)

La [verifica ingegneristica dei volumi FB-1](docs/BLUNDERcheck_FB1_COLLISIONI_2026-11-23.md) ha trovato un **PSU fittizio che attraversava tutte e sette le schede madri**, un **SSD che intersecava un fianco**, una **canalina che compenetrava il telaio** e, nel round 1, **intersezioni tra supporti fissi e telaio di base**. Le correzioni sono applicate al modello; gli alimentatori sono ora **intenzionalmente non collocati** invece che rappresentati falsamente compatibili.

I test automatici in `t/tests/blundercheck_fb1.py` (tower, modulo per ogni vano, standalone, rear, thermal), `t/tests/test_fb1_guides.py`, `t/tests/test_geometry.py` e il nuovo `t/tests/test_loadpath.py` controllano la geometria tramite Chromium/SAT e controlli statici: nessuna intersezione rigida tra schede, SSD, supporti fissi e sweep verticale 0–155 mm nelle scene principali. Rimangono aperti PSU, cavi, ventole reali, massa e la validazione strutturale della base autonoma a terra, documentati nell'[elenco azionabile](docs/FB1_MISURE_AZIONABILI_2026-11-23.md) e nel [resoconto round 2](docs/BLUNDERcheck_FB1_ROUND2_2026-11-23.md). Il render **non approva il CAD per stampare**.

### Round 2 — riconciliazione carico e geometria

In questa sessione è stato eseguito un secondo passo sul ramo `night/torre-geometry-20261123`:

- I montanti laterali fissi (`FBGUIDE`) ora partono dal telaio base a `z=107 mm` invece di galleggiare sopra di esso; il percorso di carico è continuo fino alla traversa sotto ogni vano.
- Il telaio base è diventato una **scala aperta**: due longheroni longitudinali, due testate e sette traverse di ripartizione centrate su ogni vano, così pattini inferiori e montanti laterali scaricano sulla stessa struttura.
- I sei rialzi HAUGA sono allineati ai longheroni longitudinali (yy=14 e D-32) per un trasferimento di carico diretto.
- Le icone ventola sono state riconciliate con il vincolo **nessun HDD in H-7** (lo storage è nel DAS H-4 separato) e con l'ingombro reale: una ARCTIC P14 140 mm non entra in una cartuccia larga 92 mm.
- La base autonoma a terra è stata abbassata per evitare intersezioni solide con il telaio abbassato; resta un **concept non validato strutturalmente**.
- Aggiornati test (`blundercheck_fb1.py`, `test_fb1_guides.py`) e aggiunto `tests/test_loadpath.py` per i controlli statici del percorso di carico.

Vedi i dettagli nei documenti linkati; lo stato rimane **NO-GO alla stampa** fino a chiusura dei gates G0–G3.

### Round 3 — annotazioni percorso di carico
In questa sessione sono state aggiunte annotazioni di percorso di carico nelle viste
Torre e Modulo (modalità Quote), confermata l'assenza di PSU fittizi e di HDD in
H-7, e documentati i blocchi aperti. I test SAT esistenti restano la verifica
di riferimento.

**Revisione autonoma 24/11:** in seguito a una verifica della vista da telefono, eliminati i longheroni e le traverse supplementari a terra che producevano false sovrapposizioni con le PCB. Il modello conserva il telaio superiore e mostra sei scarpe basse; le ali stabilizzatrici sono **opzionali e inizialmente nascoste**, non considerate inutili finché non si misura il baricentro. È stata corretta anche la strumentazione del blundercheck per includere la traslazione verticale e la base: [rapporto di correzione e limiti](docs/BLUNDERcheck_STANDALONE_2026-11-24.md).

## Esplorare l'anteprima

**[Apri il render 3D interattivo R-8.1 C120](index.html)**. A sinistra trovi capitoli a strati, ciascuno con **Tutti** per mostrare o nascondere il gruppo. Puoi selezionare un pezzo, attivare la semitrasparenza, usare i comandi di smontaggio e scegliere prospettive dedicate per stanza, Torre, HAUGA, DAS H-4, scrivania e bracci dei monitor.

**Nota geometrica storica:** la [vista FB-1 a 42°](fb1.html), con ingombri illustrativi 1310 × 318 mm, è un'ipotesi grafica funzionale ai confronti e **non una quota canonizzata per costruire**. In parallelo l'**[approfondimento ingegneristico R-5](docs/H7_R5_PETTINE_INGEGNERIA_2026-11-23.md)** indica **25° / passo 108 mm** come candidato geometrico alternativo su cartucce ipotetiche 80 × 251 mm. Le due versioni non vanno confuse: il primo dato guida il render, il secondo una simulazione comparativa da falsificare con l'hardware reale. Nessuna configurazione è approvata per la costruzione. La R-4 resta confronto storico per la massa (15,046 kg teorici, in uno scenario non rappresentativo della massa finale).


Per i dettagli: **[Canone FB-1 + DAS H-4 e verifiche](docs/H7_FB1_DAS_H4_CANONE_2026-11-23.md)** · [Registro misure](registro.html) · [Dati JSON](misure.json) · [Studio R-5, 25°](docs/H7_R5_PETTINE_INGEGNERIA_2026-11-23.md) · [Bilancio storico R-4](docs/H7_R4_BUDGET_MASSA_2026-11-23.md) · [Prima ipotesi DAS H-4 (archivio)](docs/TORRINO_DAS_H4_2026-11-23.md) · [R-3 storico](r3.html) · [Portale R-2 storico](r2.html) · [Archivio tecnico](docs/README-tecnico-storico.md).

**Stato:** progetto di fattibilità, non acquisti effettuati né installazione collaudata. Nel calcolo R-5 la massa ipotetica è 15,52 kg con un PSU e quattro ventole, ma più alimentatori possono portarla vicino ai 20 kg. L'analisi avverte soprattutto del **rischio di ribaltamento**: servono ritenute esterne al mobile o supporto autonomo a terra prima di montare. Prima proveremo e peseremo **un modulo**, poi valuteremo l'estensione a sette.

## Interfaccia R-7 (UX)

Il settimo passo UX è un giro di regressione su tutte le combinazioni di scena e strati, senza toccare `assets/viewer.js`:

* **Regression sweep**: `window.towerRegressionSweep()` (alias `window.towerRegression`) prova tutte le scene `[data-scene]`, i gruppi annidati e i singoli strati, poi una selezione e i tooltip, raccogliendo eventuali errori in `window.towerConsoleErrors`.
* **Console pulita**: helper `window.towerScene`, `window.towerView`, `window.towerLayer`, `window.towerCamera` e `window.towerTooltip` con gestione degli errori; nessuna geometria nuova.
* **Riferimenti visivi**: modalità `?reference=1`, `?scene=...`, `?view=...`, `?tooltip=...` per catturare viste riproducibili; screenshot smoke test su tutte le scene.
* **Tooltip migliorati**: il tooltip `#tooltip` resta leggibile in screenshot/reference e su schermi stretti.
* **Test aggiuntivi**: `tests/test_ux_r7.py` e `tests/ux_r7_dom.html`.

## Interfaccia R-8 (UX)

L'ottavo passo UX è l'audit visivo finale del giro notturno, senza toccare `assets/viewer.js`:

* **Audit visivo finale**: `window.towerVisualAudit()` (alias `towerAudit`, `towerFinalAudit`, `towerVisualAuditRun`) restituisce una checklist su console pulita, elementi base, strati, marcatori `≈`, chip di blocco, wording non approvativo e helper esistenti. Attivabile anche con `?audit=1` (`visual-audit-mode`).
* **Note per la prossima mattina**: `window.towerFeatureNotes()` (alias `towerMorningNotes`, `towerNextMorningNotes`) elenca le funzioni UX già presenti da riprendere il mattino dopo.
* **Nessun testo in più**: l'audit non aggiunge pannelli permanenti né claim di fabbricazione/prezzo.
* **Test aggiuntivi**: `tests/test_ux_r8.py` e `tests/ux_r8_dom.html`.

## Interfaccia R-6 (UX)

Il sesto passo UX compatta ulteriormente il menu e aggiunge densità tecnica, senza toccare `assets/viewer.js`:

* **Menu compatto**: la sidebar usa la classe `compact`, righe più dense e gruppi annidati con comando «Tutti».
* **Ispezione geometria**: pulsante e scorciatoia `G` attivano quote, griglia e ingombri; bordo ambra segnala la vista filtrata.
* **Densità tecnica**: il blocco `#tech-details` nell'inspector riassume la selezione e ricorda che le misure marcate `≈` sono da verificare.
* **Prestazioni mobile**: blur ridotto e target tattili adeguati su Samsung Flip/mobile.
* **Test aggiuntivi**: `tests/test_ux_r6.py` e `tests/ux_r6_dom.html`.

## Interfaccia R-1 (UX)

L'anteprima in `index.html` è ora più compatta e accessibile:

* **Sidebar a cassetti** con capitoli e pulsante "Tutti" per mostrare/nascondere ogni gruppo (già presente, resa più visibile).
* **Navigazione responsive**: su schermi stretti il menu hamburger apre i controlli come pannello inferiore, i pulsanti rapidi restano a dimensione tattile e l'inspector si adatta.
* **Selezione enfatica**: quando si sceglie un componente, il render passa automaticamente a *Isola selezione* + *Semitrasparente* così il pezzo non scompare dietro le pareti; compare un badge HUD in alto a destra e l'inspector mantiene il focus visivo.
* **Tasti rapidi**: `?` / `H` apre la guida, `Esc` chiude la guida/deseleziona, `F` centra, `I` isola, `X` semitrasparente, `L` etichette. I comandi `1`, `2`, `+`, `-`, `R` restano gestiti dal viewer di base.
* **Touch**: oltre al drag con un dito, il pinch con due dita zooma; il doppio tap isola e centra la selezione.
* **Fullscreen** tramite il pulsante ⛶ nella barra rapida.
* **Focus visivo**: contorni `:focus-visible` forti, skip-link da tastiera e rispetto di `prefers-reduced-motion`.

## Interfaccia R-2 (UX)

Il secondo passo UX affina la navigazione e la struttura dei controlli, sempre senza modificare il geometry worker `assets/viewer.js`:

* **Sottogruppi annidati**: dentro ogni capitolo i dettagli (HAUGA, scrivania, struttura/elettronica/servizi della Torre) sono raggruppati in sotto-cassetti, ognuno con il proprio comando "Tutti". La sidebar resta compatta anche con molti strati.
* **Preset di camera**: pulsanti dedicati per *Stanza*, *Torre*, *Mobile*, *Autonoma*, *Lato*, *Retro*, *Alto* e *Centra*. I preset sfruttano i comandi di scena/vista già presenti, quindi mantengono lo zoom e il centraggio definiti dal modello senza distorcere l'oggetto.
* **Controlli rapidi ridisegnati**: la barra in sovrimpressione include icone per i preset principali, zoom, centra, fullscreen e aiuto; i pulsanti sono tattili e leggibili anche su schermi stretti.
* **Selezione sempre visibile**: il piccolo testo `#focus-hint` spiega che la selezione viene isolata automaticamente; l'HUD e l'inspector mantengono il focus.
* **Prestazioni su dispositivi low-power**: il render rimane un singolo canvas 2D con ordinamento per facce; i controlli usano solo CSS/JS leggero, nessuna animazione continua né effetti blur pesanti sul visualizzatore.

I file modificati sono `index.html`, `assets/viewer.css` e `assets/viewer-enhancements.js`. I test aggiuntivi sono in `tests/test_ux_r2.py`; quelli esistenti (`tests/ux_enhancements_static.py`, `tests/ux_enhancements_dom.html`, `tests/ux_smoke_playwright.spec.js`, `tests/test_ux_r1.py`) devono continuare a passare.

## Interfaccia R-3 (UX)

Il terzo passo UX affina le modalità trasparente e di isolamento, senza toccare il geometry worker `assets/viewer.js`:

* **Indicatori visivi di modalità**: quando «Semitrasparente» o «Isola selezione» sono attivi, il viewport riceve le classi `xray-active` / `isolate-active` e un bordo sottile ciano ricorda che si sta vedendo una vista filtrata.
* **Selezione sempre leggibile**: l'HUD e l'inspector mantengono il focus; il pannello di aiuto spiega che la selezione attiva automaticamente isolate + semi-trasparente, così il pezzo non scompare dietro pareti o mobili.
* **Marcatori di misure da verificare**: gli strati che contengono componenti o quote ancora da collaudare sono contrassegnati con `data-unresolved` e mostrano un piccolo `≈` nel nome; il significato è spiegato nell'aiuto, mentre i dettagli restano nel README e nei documenti di ingegneria.
* **Test aggiuntivi**: `tests/test_ux_r3.py` verifica in Chromium headless che la selezione attivi i livelli corretti, le classi CSS e gli screenshot non vuoti; `tests/ux_r3_dom.html` è un test DOM leggero per la sincronizzazione delle classi.


## Interfaccia R-4 (UX)

Il quarto passo UX aggiunge stato ingegneristico visibile ma non invasivo e una modalità screenshot, senza toccare il geometry worker `assets/viewer.js`:

* **Stato e bloccanti visibili**: il capitolo «Stato progetto» mostra chip colorati per massa non verificata, PSU non collocati, antiribaltamento, fori scheda, limiti HAUGA/DAS e vincoli NO HDD/NO UPS/NO betulla. Ogni chip ha `data-blocker` per test e documentazione.
* **Nessuna approvazione alla costruzione**: il viewmark, il footer e un chip dedicato ripetono «STUDIO · NON ESECUTIVO · NON APPROVATO PER COSTRUZIONE». Il modello resta un'ipotesi grafica, non un CAD esecutivo.
* **Modalità screenshot**: aggiungendo `?screenshot=1` all'URL i controlli, il menu e il footer spariscono, lasciando il canvas pulito; con `&select=P1` (o `part`/`selected`) la selezione viene attivata automaticamente, mantenendo HUD e isolamento.
* **Selezione preservata**: anche in modalità screenshot il pezzo resta evidenziato, con isolate + semitrasparente, HUD e contorni; nessuna scomparsa dietro pareti.
* **Test aggiuntivi**: `tests/test_ux_r4.py` verifica chip di blocco, modalità screenshot, selezione e screenshot non vuoti; `tests/ux_r4_dom.html` è il test DOM leggero associato.

### Guide laterali dei cassetti FB-1 (correzione 23/11)

Il render FB-1 comprende ora **sette telai di sostegno laterale fissi**, distinti dalle guance colorate dei cassetti estraibili: quattro montanti angolari per vano collegati da binari frontali e posteriori bassi (nessuna barra continua attraversa la PCB), due longheroni inferiori con pattini anteriori/posteriori e battute terminali. Sono selezionabili tramite lo strato «Sostegni cassetti». Con 42° e passo 164 mm, il distacco perpendicolare tra assi è circa 121,9 mm; cartuccia larga 92 mm, guide fisse con luce nominale circa 5 mm per lato e circa 7,9 mm tra guide contigue. **Le quote sono di studio**: restano da provare deformazioni, tenuta delle connessioni, estrazione e carico sulla HAUGA (max 20 kg), senza considerare il 3D una verifica strutturale.
