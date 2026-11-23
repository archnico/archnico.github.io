# Torre H-7 — un cluster domestico costruito con PC recuperati

Abbiamo una piccola scorta di **computer usati**: alcuni li conosciamo già abbastanza bene, di altri dobbiamo ancora verificare schede madri, ingombri, alimentazione e collegamenti. L'idea è dare loro una seconda vita come **cluster casalingo a basso costo**, anziché comprare sette computer nuovi o impilare sette vecchi case.

La **Torre H-7** è il contenitore orizzontale che stiamo progettando per ospitarli in modo compatto, ispezionabile e modulare. Dal **23 novembre 2026** la direzione canonica distingue **H-7 per il calcolo** e **DAS H-4 per i dischi**, acquistato come unità USB multibay commerciale con un hub USB alimentato separato per altri dischi esterni. Non è un supercomputer unico: ogni PC resta un nodo indipendente, collegato agli altri tramite rete locale. Il software dell'Astronave potrà assegnare i lavori alle macchine disponibili. Il risultato desiderato è più capacità utile con poca spesa e minore spreco di hardware.

## Come funziona

- **Sette vani PC uguali**, affiancati; all'interno ogni scheda madre ha un adattatore specifico. Ogni modulo è verticale e si **solleva dall'alto**, senza guide a cassetto. Prima si spengono i nodi, si scollegano alimentazione e cavi, e si sbloccano i fermi.
- **Nessun banco HDD dentro la Torre.** Ogni nodo tiene il proprio SSD di sistema; gli HDD vengono trasferiti concettualmente in un **torrino DAS H-4 separato**, su un altro mobile. Alimentatori adeguati ai singoli PC, niente distribuzione elettrica artigianale.
- **Telaio aperto e robusto**, con retro accessibile per porte USB, rete e alimentazione. Raffreddamento tramite dissipatori CPU originali e **sei ventole frontali candidate**, da verificare con misure reali prima di stabilire quante ne servono.
- **Semplicità prima di tutto**: moduli identici, poche parti speciali, niente baie per telefoni o GPU interne. Una GPU futura, se utile, potrà avere un supporto esterno indipendente.

## Dove starebbe

Il corpo della Torre misura **circa 102,8 × 42,9 × 33,4 cm** nel modello di studio. Può stare su un supporto proprio; quattro pattini opzionali possono allargare la base.

Nella stanza attuale il mobile è **IKEA HAUGA 004.150.47**, catalogo 138 × 36 × 54 cm; misurato **137 × 35,5 × 54 cm**, con spalletta a U alta **9 cm** e spessa **1 cm**. IKEA limita il carico sul piano superiore a **20 kg** e richiede il fissaggio del mobile alla parete.

L'ultima proposta è la **R-3 ultraleggera**: riportiamo l'intera Torre sul piano interno del mobile, **senza nuove viti nel mobile** e senza affidare peso alla spalletta. Rinunciamo alla lastra piena da 18 mm, mantenendo una struttura reticolare irrigidita con traversi metallici. La simulazione **storica** R-3 stimava **17,8 kg** con 7 schede, 6 ventole, **3 HDD**, 1 PSU interno e adattatori: non è una pesata, e non vale più come budget per la nuova H-7 senza HDD. **Ricalcoleremo massa, sostegni e ventilazione** dopo la separazione; obiettivo prudenziale **16–17 kg effettivi o meno**, con margine rispetto ai 20 kg. L'**UPS resta altrove**; i dischi USB già presenti rimangono nelle sedi attuali fino a migrazione pianificata (8 TB attualmente su n3).

Per superare la U, proponiamo **sei rialzi smontabili, alti 105 mm, con piastre di ripartizione sul piano interno** e niente fissaggi alla spalletta. La stessa H-7, tolti i rialzi, può poggiare direttamente sul pavimento: **il portale R-2 a quattro gambe resta solo un'alternativa archiviata**, non la scelta corrente. Ogni sostegno, la portata e il baricentro devono essere collaudati prima di caricare il mobile.

La stanza è circa 5 × 5 m, tre monitor su bracci a muro e finestra 210 × 160 cm. Il render separa i componenti per esplorarli a strati e confrontare R-3 con R-2 storica.

## Il torrino dei dischi

L'archivio sarà un **DAS commerciale USB a quattro vani SATA indipendenti**, con alimentazione e raffreddamento propri, installato su **altro mobile**. Un **hub USB 3.x alimentato** separato permetterà di collegare i dischi esterni già inscatolati. **n2** sarà il nodo host iniziale: i dati diventeranno accessibili dagli altri PC tramite NFS/Samba, **non** con due collegamenti USB simultanei allo stesso disco. Il nuovo assetto libera spazio, peso, vibrazioni e calore nella H-7. Non abbiamo ancora acquistato DAS o hub; prestazioni, porte USB reali di n2, dischi e costi sono da verificare.

La geometria dei banchi HDD mostrata nell'anteprima deriva dalle **revisioni storiche**: non è più la configurazione scelta. Il render verrà adeguato dopo le verifiche progettuali. [**Scheda canonica del DAS H-4**](docs/TORRINO_DAS_H4_2026-11-23.md).

## Come vogliamo costruirla

**Poca spesa, facilità di montaggio e manutenzione.** L'ipotesi R-3 combina pochi profilati di alluminio pretagliati, una base reticolare alleggerita in multistrato e pezzi **stampati in PETG da un servizio esterno** per gli adattatori e i particolari non strutturali. Non abbiamo una stampante 3D. Le parti portanti devono essere dimensionate e testate: **non basta che il render sembri solido**.

Un eventuale UPS commerciale rimane **separato**, mai sul mobile HAUGA: non contribuisce ai 17,8 kg della stima. Non è una promessa di alimentare sette PC a batteria.

## A che punto siamo

**Stiamo progettando, non montando l'installazione definitiva.** Esistono un modello esplorabile R-3 (con R-2 conservata per confronto), geometrie illustrative e verifiche digitali preliminari. Mancano ancora le misure complete delle schede donatrici, la nuova distinta senza HDD, le prove di rigidità e stabilità del supporto, la verifica del raffreddamento e il collaudo elettrico. Prima costruiremo e proveremo **un modulo**, poi estenderemo il sistema.

Il render permette di spegnere o mostrare **pareti, mobilio, monitor, bracci, telaio, moduli, schede, dischi, ventole e cavi**: una specie di matrioska digitale per capire il progetto dall'esterno all'interno. **Semitrasparenza e isolamento del pezzo selezionato sono opzioni**, non aspetti obbligatori della vista.

**[Apri l'anteprima interattiva (geometria storage storica)](index.html)** · **[Nuova architettura DAS H-4](docs/TORRINO_DAS_H4_2026-11-23.md)** · **[R-3: budget di peso storico](r3.html)** · [Portale R-2 alternativo](r2.html) · [Misure aggiornate](registro.html) · [Archivio storico R-1](schema-r1.html) · [Dettagli tecnici e storico](docs/README-tecnico-storico.md)

*Nota: le quote della Torre e della piastra sono di studio, non file esecutivi per stampa o installazione. L'inventario hardware è progressivo: non tutti i sette PC sono già definiti.*
