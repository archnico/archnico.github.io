> **SUPERATO:** progetto storico H-4 a quattro baie. Il canone corrente è il [torrino H-8 con DAS a otto baie e hub a otto porte](H7_FB1_H8_CANONE_2026-11-23.md), sul piano della cassettiera.

# Decisione canonica — Torrino DAS H-4 separato dalla Torre H-7

**Data:** 23 novembre 2026  
**Stato:** architettura scelta; acquisto, misure, installazione e collaudo ancora da eseguire.  
**Prevale su:** precedenti ipotesi con due banchi HDD integrati nella Torre (R-1, R-2, R-3 e relative viste), per la sola architettura di archiviazione. La geometria H-7 e l'ipotesi cassetti a spina di pesce sono ancora oggetto di studio.

## Decisione

1. **Torre H-7 = calcolo.** Sette sedi modulari per PC, con SSD locale di sistema su ciascun nodo. **Niente HDD meccanici né vani/banchi HDD nel telaio.** GPU futura eventualmente esterna; UPS su altro supporto.
2. **Torrino DAS H-4 = archiviazione.** Un'unità commerciale multi-bay con **quattro vani SATA 3,5/2,5 pollici** come punto di partenza, su un mobile distinto. Deve avere alimentatore e raffreddamento propri. I dischi devono poter essere visti singolarmente dal nodo host (modalità dischi indipendenti, senza RAID obbligatorio).
3. **Espansione USB per dischi esterni già inscatolati.** Affiancare al DAS un **hub USB 3.x alimentato** per le unità USB esterne, preferibilmente su una seconda porta USB del nodo host. **Un DAS multi-bay non è automaticamente un hub USB**; non presumere la presenza di porte per altri dischi sul contenitore.
4. **n2 è proprietario USB e gestore logico iniziale.** Collegamento DAS → USB 3.x → n2; n2 esporta archivi verso gli altri nodi tramite NFS/Samba sulla LAN. I due nodi non devono montare simultaneamente via USB gli stessi dischi: USB non è una connessione multi-host concorrente per filesystem ordinari. Se un domani si vuole cambiare host, prima fermare servizi, smontare e riconnettere in modo controllato; eventuale failover solo dopo progetto e test dedicati.
5. **Capacità e migrazioni non presunte.** Gli HDD USB da 4 e 8 TB restano per ora nelle loro collocazioni effettive; in particolare l'8 TB risulta su **n3**. Nessun disco viene considerato migrato al torrino finché non lo è davvero.

## Criteri d'acquisto (da verificare sul prodotto)

- Almeno 4 bay e modalità dischi indipendenti. Preferire interfaccia USB 3.2 10 Gbps se supportata dall'host; **5 Gbps è comunque sufficiente per diversi HDD in uso normale**, salvo accessi simultanei intensivi.
- Verificare porte USB reali e velocità di **n2 i5-5200U**, compatibilità Linux del bridge USB-SATA, UASP e passaggio SMART, gestione degli errori, ripresa dopo interruzioni, rumorosità e ventole.
- Alimentazione separata di fabbrica, wattaggio adeguato allo **spunto simultaneo dei motori** HDD, raffreddamento continuo e accesso per sostituzione disco. Niente circuito di rete AC artigianale.
- Hub USB alimentato come componente separato per i dischi esterni. Valutare banda condivisa: un hub non moltiplica la velocità dell'unica porta upstream.
- Cablaggi USB corti e affidabili, fissaggio anti-strappo, inventario preciso HDD (capacità, formato, spunto, interfaccia). Prediligere semplicità e costi contenuti; evitare di progettare/stampare elettronica storage.
- Un contenitore non sostituisce una politica di backup: salvare separatamente i dati importanti, verificare SMART dove disponibile e mantenere monitoraggio e spegnimento sicuro. UPS eventualmente altrove, coerentemente con il progetto.

## Conseguenze per struttura, massa e raffreddamento

- **Rimuovere i due banchi laterali HDD** dai futuri modelli H-7, non dai documenti storici già pubblicati.
- **Ricalcolare le quote e la distinta della Torre**: le precedenti masse R-3 (per esempio 17,8 kg) comprendevano alcuni HDD e il loro hardware. Non trasformare semplicemente la differenza in una nuova massa "certificata"; considerare staffe, cablaggi e ventole che possono essere eliminate o riposizionate, quindi pesare davvero il prototipo.
- Il piano HAUGA mantiene il **limite dichiarato di 20 kg** e richiede l'ancoraggio del mobile alla parete. Restano gli obiettivi di non praticare nuove viti nel mobile, scaricare il carico sul suo piano interno (non sulla spalletta a U), avere una Torre utilizzabile anche a terra, e conservare margine di sicurezza verificato.
- Le sei ventole del vecchio schema includevano due zone destinate agli HDD: **ridimensionare ventilazione e percorsi d'aria** dopo il nuovo layout, senza fissare arbitrariamente il numero delle ventole prima delle prove.
- Il torrino avrà propria dissipazione e disaccoppiamento delle vibrazioni sul secondo mobile.
- **L'anteprima attuale mostra ancora banchi HDD storici**: non scambiarla per il progetto aggiornato. Revisione 3D dopo consolidamento di geometrie e hardware; mantenere versioni R-1/R-2/R-3 leggibili come storico.

## Gate prima dell'acquisto / montaggio

- **G-DAS-1 Inventario:** contare HDD SATA nudi, dischi USB esterni, SSD dei nodi e capacità richiesta oggi e a 2 anni.
- **G-DAS-2 Porte:** rilevare USB n2 e rete LAN; confermare le prestazioni effettive della catena scelta.
- **G-DAS-3 Scelta hardware:** confrontare 4-bay commerciali e hub alimentati, dimensionare alimentazione/ventole e ricambi.
- **G-DAS-4 Collaudo:** prova singolo HDD, dischi multipli, stress I/O concorrente e temperatura, SMART, riavvii/cadute di corrente non distruttive, esportazione rete e recupero mount persistenti per UUID.
- **G-H7 Revisione:** ricalcolare struttura H-7, distribuzione della massa, raffreddamento e compatibilità con HAUGA e installazione autonoma. L'idea di orientare i moduli «a spina di pesce» resta una **ipotesi separata da valutare**, non parte della decisione DAS.

**Sintesi:** si compra la parte difficile già industrializzata (DAS USB + hub alimentato), mentre la personalizzazione riguarda disposizione, supporti, ordine dei cavi e integrazione meccanica. Nessun ordine o modifica fisica risulta effettuato.
