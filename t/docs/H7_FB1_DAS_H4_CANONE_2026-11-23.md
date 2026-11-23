# H-7 FB-1 e torrino H-4 — decisione progettuale 23/11/2026

**Stato:** nuova direzione canonica di studio, dimensionamento e acquisti da verificare. Sostituisce come impostazione gli schemi H-7 rettilinei e DAS H-4. Le quote FB-1 descrivono un render parametrico esplorativo, **non** un progetto esecutivo.

## 1. Geometria della Torre H-7

- **Sette cartucce PC uguali**, disposte obliquamente **in pianta** come parcheggi a spina di pesce; non a V sovrapposte verticalmente. Tutte devono essere estraibili dopo spegnimento e scollegamento.
- Studio FB-1: **42°**, passo orizzontale **164 mm**, cartuccia candidata **92 × 284 mm** in pianta; ingombro perimetrale del telaio **1310 × 318 mm**. Proiezione calcolata cartuccia: circa **259 × 273 mm**; i moduli sono paralleli e non si intersecano nel modello ideale. Serve comunque confermare distanze d'estrazione, connettori, dissipatori, PSU e limiti reali di ogni scheda.
- **Nessuna piastra di betulla**. Telaio reticolare di profilati metallici con giunti da dimensionare, adattatori PETG solo per funzioni appropriate; supporti avvitati alla **Torre**, non al mobile.
- **Sei supporti smontabili** ripartiti su tre posizioni longitudinali e due trasversali sul piano **interno** dell'HAUGA, con rialzo di studio **~109 mm** per scavalcare la spalletta a U da 90 mm. Devono essere antiscivolo, stabili, sostituibili e testati con carico inerte. La versione a terra usa gli stessi elementi o piedi alternativi senza modificare la Torre.
- Ogni PC mantiene **SSD locale di sistema**. **Zero HDD meccanici, zero banchi dischi, zero UPS** nel modulo H-7. I quattro gruppi ventola illustrati sono **candidati**, non una validazione termica né una distinta acquisti.
- Nodi reali da censire: disposizione delle prese, accesso alle schede, dimensioni dissipatori e alimentatori, massa finale, percorsi di rete e alimentazione, separazione DC/AC, aria in aspirazione e scarico.

## 2. Mobile e rischi

Mobile candidato: **IKEA HAUGA 004.150.47**, misure dell'esemplare **1370 × 355 × 540 mm**, corpo fino a **450 mm**, spalletta **90 mm**, spessore **10 mm**. Luce utile da catalogo **1345 × 330 mm**, non ancora rilevata sull'esemplare; il nostro telaio **1310 × 318 mm** lascia solo **35 mm** complessivi di gioco longitudinale e **12 mm** in profondità nominale. Sono tolleranze **molto piccole**: prima di progettare giunti e cavi misurare con righello e dima il piano libero reale, i raggi degli angoli e le sporgenze della U.

Il produttore dichiara **20 kg massimi sul piano** e prevede l'**ancoraggio del mobile alla parete**. Non va aggirato né il limite di massa né l'ancoraggio: verificare massa effettiva Torre completa **compresi 7 alimentatori eventualmente necessari, cablaggio, ventole, SSD, sostegni, viti**, e poi distribuzione delle reazioni. I **17,8 kg** attribuiti alla precedente R-3 non sono applicabili alla FB-1. Se la Torre completa supera la portata, cambia il supporto o il progetto, non la scheda del produttore.

## 3. Torrino storage H-4 sopra la cassettiera

- **Un DAS USB commerciale a 4 bay SATA**, ventilato e alimentato autonomamente, da scegliere verificando esposizione **indipendente dei dischi** e SMART/JBOD effettivo. Non assumere modalità RAID o indipendenza senza scheda tecnica del modello.
- **Un hub USB 3.x a 4 porte alimentato separatamente**, dedicato ai dispositivi USB esterni. **Non** acquistare ora un hub a 8 porte: un secondo hub a 4 porte potrà essere aggiunto soltanto se necessario, preferibilmente su un altro collegamento host USB di n2, senza passare dal DAS. L’hub è un oggetto distinto dal DAS e non trasforma gli quattro bay SATA in prese USB. Alimentazione esterna obbligatoria in presenza di HDD USB portatili; verificare alimentatore/cavo inclusi.
- Scenario iniziale **senza alterare le unità esistenti**: il disco esterno **8 TB Seagate Expansion USB** rimane inizialmente su **n3** e il **4 TB WD40NDZW USB nativo** su **n2**. In seguito, se validati trasferimento e backup, entrambi potranno collegarsi come dispositivi esterni a un **hub USB 3.x alimentato 4 porte** sulla cassettiera. Il WD 4 TB **non ha un normale connettore SATA utilizzabile**: NON rappresentarlo inserito in un bay SATA. Il DAS ha **quattro baie SATA vuote** in prima fase; il disco 8 TB non sarà smontato prima di verificare internamente il tipo di interfaccia e la sicurezza di migrazione. Nessuna migrazione automatica né acquisto di HDD nuovi implicito.
- Posizione: **sopra la cassettiera indipendente**. Prima di acquistare verificare superficie disponibile, portata della cassettiera, ventilazione, vibrazioni e accesso frontale/posteriore. Non mettere DAS e hub sul piano HAUGA già riservato alla H-7.
- Collegamenti: cavo USB **DAS → n2** e cavo USB **hub → n2**, passando ordinatamente verso la **Torre**. n2 è host iniziale; altri nodi accedono mediante rete e NFS/Samba. **Mai doppio host USB contemporaneo** sugli stessi dischi. Le lunghezze ammissibili e l'eventuale necessità di cavo attivo dipendono dai dispositivi scelti; verificare backup e filesystem prima della migrazione.

## 4. Postazione e audio

Il **mobile multilivello** raccoglie i satelliti audio, il **subwoofer** e il **router**; la cassettiera vicina è lasciata al torrino. Sulla **scrivania 1000 × 550 × 800 mm** ci sono **tastiera, mouse, laptop aperto su leggio e smartphone su leggio**. Sul lato sinistro un pannello con **sei USB-C**, una per telefono e una verso il PC nello scenario; la reale combinazione di **dati, alimentazione e ricarica** è ancora da scegliere, e non va rappresentata come sei porte equivalenti senza verificarlo.

La stanza mantiene tre schermi su bracci a muro, la finestra 2100 × 1600 mm e l'unico angolo smussato; nessuna seconda Torre compare a terra.

## 5. Test indispensabili

1. Misurare top interno HAUGA e un campione delle sette schede, con PSU, dissipatori, I/O, SSD e cavi montati.
2. Confermare se sette moduli possono davvero uscire lungo le traiettorie oblique senza collidere con quelli vicini o con la U.
3. Ricalcolare **massa reale e baricentro**, prove con carico inerte, ribaltamento, deformazioni e fissaggi. Controllare ancoraggio HAUGA.
4. Rivedere ventilazione e PSU prima di scegliere quantità/tipo di ventole e geometria delle staffe.
5. Verificare portata, cavi e ventilazione della cassettiera; scegliere DAS 4 bay e primo hub USB 3.x a 4 porte **alimentato** con caratteristiche documentate; differire il secondo hub fino a necessità verificata.
6. Preparare un primo modulo stampato da terzi, provarlo con un nodo recuperato e **solo dopo** replicarlo.

## 6. Stato del render

L'**[anteprima interattiva](../index.html)** include i toggle per lo strato DAS, hub, cavi USB, periferiche da scrivania e prese USB-C, oltre a selezioni, viste e semitrasparenza. Il vecchio disegno R-2/R-3 è conservato nelle relative pagine storiche. I volumi di PC e attrezzatura sono in parte simbolici: un rendering convincente non è una validazione meccanica.

## Revisione economica: 4 bay SATA, non 8 (23 novembre 2026)

Il DAS **a quattro vani è la specifica canonica**. Non compriamo un DAS a 8 vani. Evitiamo funzioni hardware RAID non necessarie e scegliamo, se servirà, una custodia **SINGLE / quattro dischi separati**, ventilata, con alimentatore proprio e cavo USB diretto a n2.

**Prima fase più economica:** i dischi 8 TB e 4 TB oggi disponibili sono entrambi USB. Rimangono negli involucri originali e possono essere serviti tramite hub USB alimentato, purché sia dimensionata corrente, cavo, stabilità e standby. Il DAS non è urgente finché non abbiamo un HDD SATA compatibile da montare. Acquistarlo vuoto è una spesa senza capacità aggiuntiva. Nessun disco viene aperto.

Candidati verificati: **ICY BOX IB-3640SU3** (4 dischi SATA 3,5", SINGLE/JBOD, USB 5 Gbit/s, ventola e alimentatore; circa €132–145 nei listini visti); **TerraMaster D4-320** (4 SATA 2,5/3,5", SINGLE/no RAID, USB fino 10 Gbit/s, circa €168). Con n2 che espone attualmente USB 5 Gbit/s, il primo è sufficiente se siamo certi che useremo HDD 3,5"; il secondo è più versatile e supporta 2,5". Prezzi indicativi, da ricontrollare al momento dell'acquisto.

https://icybox.de/en/products/ib-3640su3
https://www.terra-master.com/it/products/d4-320

**Espansione:** prima hub a 4 porte, poi eventualmente un altro hub a 4 porte su host USB separato; se in futuro servono più di quattro HDD SATA, sarà più economico valutare un secondo DAS rispetto a pagare oggi un 8 bay inutilizzato.

## Vista autonoma a terra (render del 23/11/2026)

La preview distingue **Torre appoggiata su HAUGA** (sei rialzi alti circa 109 mm sul piano interno, nel rispetto del limite 20 kg e dell'ancoraggio IKEA) da **Torre autonoma** (gli stessi sette moduli FB-1 su una base autonoma metallica più bassa, che non tocca il mobile). L'autonoma NON replica i rialzi HAUGA. Disegna due correnti metallici bassi, tre traverse, sei punti di appoggio e quattro ali rimovibili per aumentare la profondità della base. Fissa l'ingombro soltanto come **studio**: supporto base circa 418 mm di profondità; con ali aperte circa 616 mm. La sagoma dei moduli di riferimento resta 1310 × 318 mm. Base a terra illustrativa non verificata, nessuna verifica di massa, ribaltamento, fissaggio o flessione. Piano semitrasparente solo come riferimento grafico: non è betulla né altra piastra portante.

[Apri la scena autonoma](../index.html#autonoma).
