# La Torre — sette PC recuperati, una struttura a spina di pesce

Abbiamo una scorta di **computer usati**: alcuni già identificati, altri ancora da misurare. Il progetto prova a riutilizzarli come piccolo cluster domestico, senza comprare sette computer nuovi e senza tenere sette vecchi case ingombranti. I PC restano **indipendenti**, collegati tra loro tramite rete: non stiamo costruendo un unico supercomputer.

**Direzione canonica del 23 novembre 2026: H-7 FB-1 + torrino storage H-4.** La struttura principale a sette moduli è disposta **a spina di pesce in pianta, come parcheggi obliqui**, non come due file a V impilate. Abbiamo eliminato la piastra di betulla: telaio aperto in metallo, adattatori specifici stampati in PETG tramite servizio esterno, zero HDD meccanici nei PC. Le vecchie geometrie R-2, R-3 e R-4 sono conservate per confronto, non descrivono più la soluzione scelta.

## Come si presenta

La **Torre H-7** poggia sul mobile bianco IKEA HAUGA. Sette cartucce con ingombro esterno uniforme sono inclinate rispetto al fronte, così il telaio sfrutta la larghezza del mobile rispettandone la profondità ridotta. Ogni nodo conserva il proprio SSD di avvio. I dettagli dei dissipatori, degli alimentatori e dei fori delle schede non ancora censite sono ancora illustrativi; non vanno scambiati per CAD esecutivo.

Il **torrino dei dischi** è **separato**, sul piano della cassettiera vicino al mobile audio: un **DAS commerciale a 4 bay SATA** con alimentazione e ventilazione proprie, e un **hub USB 3.x alimentato a 4 porte** per altre periferiche (**un secondo hub solo se servirà**, su porta host separata se possibile). Lo scenario iniziale prevede soltanto **due HDD USB, 8 TB e 4 TB**, mantenuti nelle loro custodie: **quattro bay SATA liberi** in attesa di dischi compatibili. L'8 TB oggi si trova su n3: **nessun disco è stato migrato**. Due collegamenti USB separati raggiungeranno **n2 ospitato nella Torre**, che poi può condividere i volumi sulla LAN via NFS/Samba; non si collega lo stesso disco a due host USB.

Il **mobile multilivello** raccoglie i quattro satelliti audio, il subwoofer e il router. La **scrivania** ospita tastiera, mouse, laptop aperto su leggio e smartphone sul proprio leggio. Sul bordo sinistro sono progettate **sei prese USB-C**, due rappresentate collegate (telefono e postazione PC). Porte dati, alimentazione e potenze di ricarica sono da specificare prima dell'acquisto.

## Vincoli reali, prima dell'estetica

Il mobile è un **IKEA HAUGA 004.150.47**: circa 137 × 35,5 × 54 cm misurati, **spalletta a U alta 9 cm e spessa 1 cm**. Il produttore dichiara **20 kg massimo sul piano** e richiede l'ancoraggio del mobile a parete. Vogliamo **nessuna vite aggiuntiva nel mobile**: la Torre usa appoggi metallici smontabili sul piano interno, senza scaricare sulla spalletta, e deve poter poggiare anche a terra.

L'ingombro **FB-1 è preliminarmente 1310 × 318 mm** e l'angolo proposto **42°**, con sette cartucce da **92 × 284 mm** di impronta esterna illustrativa. Il confronto è con la luce nominale catalogo **1345 × 330 mm**, **non con una misura interna certificata dell'esemplare**. Il nuovo budget di massa **non è ancora verificato**; i 17,8 kg R-3 con HDD erano soltanto uno studio storico. Il DAS, sul mobile separato, **non entra** nel carico HAUGA. Verificare baricentro, distribuzione carichi, oscillazioni, accesso ai cavi e raffreddamento prima di costruire.

La stanza è circa **5 × 5 × 3 m**, con un solo angolo smussato, finestra 210 × 160 cm, tre monitor su bracci a muro e scrivania misurata 100 × 55 × 80 cm. Il modello cerca di rappresentare questa stanza, non uno showroom inventato.

## Esplorare l'anteprima

**[Apri il render 3D interattivo](index.html)**. A sinistra trovi capitoli a strati, ciascuno con **Tutti** per mostrare o nascondere il gruppo. Puoi selezionare un pezzo, attivare la semitrasparenza, usare i comandi di smontaggio e scegliere prospettive dedicate per stanza, Torre, HAUGA, DAS H-4, scrivania e bracci dei monitor.

**Nota geometrica:** la vista attuale **FB-1 a 42°**, con ingombri illustrativi 1310 × 318 mm, è un'ipotesi grafica funzionale ai confronti e **non una quota canonizzata per costruire**. In parallelo l'**[approfondimento ingegneristico R-5](docs/H7_R5_PETTINE_INGEGNERIA_2026-11-23.md)** indica **25° / passo 108 mm** come candidato geometrico alternativo su cartucce ipotetiche 80 × 251 mm. Le due versioni non vanno confuse: il primo dato guida il render, il secondo una simulazione comparativa da falsificare con l'hardware reale. Nessuna configurazione è approvata per la costruzione. La R-4 resta confronto storico per la massa (15,046 kg teorici, in uno scenario non rappresentativo della massa finale).


Per i dettagli: **[Canone FB-1 + DAS H-4 e verifiche](docs/H7_FB1_DAS_H4_CANONE_2026-11-23.md)** · [Registro misure](registro.html) · [Dati JSON](misure.json) · [Studio R-5, 25°](docs/H7_R5_PETTINE_INGEGNERIA_2026-11-23.md) · [Bilancio storico R-4](docs/H7_R4_BUDGET_MASSA_2026-11-23.md) · [Prima ipotesi DAS H-4 (archivio)](docs/TORRINO_DAS_H4_2026-11-23.md) · [R-3 storico](r3.html) · [Portale R-2 storico](r2.html) · [Archivio tecnico](docs/README-tecnico-storico.md).

**Stato:** progetto di fattibilità, non acquisti effettuati né installazione collaudata. Nel calcolo R-5 la massa ipotetica è 15,52 kg con un PSU e quattro ventole, ma più alimentatori possono portarla vicino ai 20 kg. L'analisi avverte soprattutto del **rischio di ribaltamento**: servono ritenute esterne al mobile o supporto autonomo a terra prima di montare. Prima proveremo e peseremo **un modulo**, poi valuteremo l'estensione a sette.

