# Torre H-7 · R-4 — stima di massa senza betulla e senza HDD

**23 novembre 2026 · studio preliminare NON esecutivo.**  
La separazione archiviazione/calcolo (H-7 + DAS H-4) resta la decisione architetturale vigente. **R-4 è una proposta meccanica e un budget di massa, non una geometria approvata, un render aggiornato o una struttura verificata**.

## Sintesi

- **Massa nominale stimata corretta: 15,046 kg**, arrotondata a **15,05 kg**.
- **Target di progetto: 14–16 kg**, subordinato a inventario e prova strutturale/termica; non è un intervallo di massa certificata.
- **Margine teorico sul limite 20 kg HAUGA: 4,954 kg.**
- Nessuna piastra in betulla, nessun HDD, nessun DAS/UPS sul mobile.
- Telaietto metallico aperto in profilati 2020 leggeri con traverse, **controventi e supporti locali realmente necessari**; adattatori per PC in PETG con stampa esterna. Il telaio deve distribuire il peso alla superficie interna del mobile HAUGA, senza caricare la spalletta.
- Quattro ventole 140 mm sono **solo uno scenario di massa**, non una decisione termica: se servono sei, aggiungere 0,388 kg per le due ventole aggiuntive.
- I 7 nodi hanno SSD locale di sistema, inclusi i futuri nodi, mentre le masse reali dei quattro donatori non ancora identificati restano incognite.

## Dal R-3 storico a R-4

| Modifica | Variazione (kg) |
|---|---:|
| R-3 storico con betulla, HDD e sei ventole | 17,80 |
| Togliere reticolo in multistrato betulla | −1,80 |
| Togliere 1 HDD 3,5″ + 2 HDD 2,5″ | −0,60 |
| Quattro ventole da 194 g invece delle sei da 230 g nella vecchia ipotesi R-3 | −0,604 |
| Semplificare inserti PETG | −0,10 |
| Ridurre cablaggi | −0,20 |
| Semplificare rialzi e appoggi | −0,15 |
| Rinforzare telaio 2020 da 7,5 m a 9,5 m | +0,70 |
| **R-4 nominale corretto** | **15,046** |

**Correzione della fonte ARCTIC:** la scheda ACFAN00125A riporta 194 g per la ventola e 230 g per il prodotto confezionato: i 230 g inseriti nella prima R-4 erano il peso dell'imballo. La variazione di +0,70 kg assume **esattamente lo stesso tipo di profilato leggero** del vecchio preventivo, **0,39 kg/m**. Non usare il rapporto su profilati pesanti indistinti: in commercio i 2020 non hanno tutti lo stesso peso lineare.

## Distinta di massa R-4 ipotetica

| Componente dentro/sopra HAUGA | Quantità / assunzione | kg |
|---|---|---:|
| Sette PC: schede madri, CPU, dissipatori e RAM | 7 misti, di cui 4 non identificati; vecchia ipotesi | 6,20 |
| Telaio 2020 leggero e relative traverse strutturali | 9,5 m × 0,39 kg/m | 3,70 |
| Sette inserti e guide PETG | alleggeriti rispetto R-3, **da verificare in CAD** | 0,90 |
| Ventilazione condivisa | 4 ventole × 0,194 kg (senza imballaggio) | 0,776 |
| SSD locali | 7, massa globale preliminare | 0,12 |
| Alimentatori posati sulla Torre | 1 ATX, altre brick laptop altrove | 1,30 |
| Cavi, terminazioni, fascette | stima | 0,60 |
| Viti, giunti, fermi, gomma, elementi anticaduta | stima | 0,70 |
| Sostegni smontabili su piano interno HAUGA | strutture + piastre di ripartizione, nessuna vite nel mobile | 0,75 |
| **TOTALE stimato corretto** | | **15,046 kg** |

> Attenzione: 0,70 kg per tutti i giunti/fissaggi e 0,75 kg per i rialzi sono ipotesi, non un calcolo da ferramenta/CAD; le parti in PETG non devono essere portanti senza collaudo. Anche l'eventuale stabilizzazione antiribaltamento è da verificare.

## Rischi e scenari

- **Un alimentatore ATX ulteriore sulla Torre:** ~**+1,3 kg** → **16,35 kg**.
- **Due alimentatori ATX ulteriori:** ~**+2,6 kg** → **17,65 kg**.
- **Tre ulteriori:** ~**+3,9 kg** → **18,95 kg** (margine insufficiente per assunzioni ancora grezze).
- **Quattro ulteriori:** ~**+5,2 kg** → **20,25 kg**, sopra il limite.
- **Tornare a sei ventole:** **+0,388 kg** → **15,434 kg** con un solo PSU.
- **Profilato 2020 più pesante da 0,50 kg/m** al posto di 0,39: aggiungere ~1,05 kg → **16,10 kg**. Con 0,62 kg/m: +2,19 kg → **17,24 kg**.
- **Massa reale dei PC:** ogni kg in più sul gruppo di 7 nodi si somma integralmente. La precedente ipotesi 6,2 kg per sette schede non è verificata, soprattutto per quattro PC sconosciuti.

La **massa plausibile finale potrebbe superare 16 kg** anche senza betulla/HDD. Non considerare 15,046 kg una previsione precisa al grammo.

## Architettura costruttiva proposta (non ancora verificata)

- Niente piano pieno e niente reticolo ligneo; 2 longheroni longitudinali + traverse sopra punti di carico e appoggi, controventi diagonali necessari per evitare la deformazione a parallelogramma; possibile irrigidimento alto e fermi antisfilamento. Il numero di traverse dipende dalla posizione e dall'orientamento dei sette moduli.
- Appoggi rimovibili per scavalcare **U di HAUGA, H90/sp10 mm**; progetto storico 6 rialzi H105 mm, da riconsiderare per la nuova struttura. **Tutti i carichi sul piano interno**, in prossimità dei divisori portanti, mai sulla spalletta a U.
- Evitare nuove viti nel mobile, ma **l'ancoraggio a parete richiesto da IKEA rimane obbligatorio**. Niente UPS, HDD o DAS sulla HAUGA; la torre deve poter essere sistemata a terra con supporti alternativi appropriati.
- La disposizione **a pettine obliquo** è stata sviluppata numericamente nella [R-5](H7_R5_PETTINE_INGEGNERIA_2026-11-23.md): i 9,5 m di profilato restano l'ipotesi rettilinea, mentre la variante R-5 mette a budget **10,3 m**, da confermare in CAD.
- Ventole originali/dissipatori delle CPU rimangono obbligatori; quattro ventole esterne sono una **candidatura**; decidere numero, dimensioni e orientamento solo dopo rilievo dei veri PC e test termico.

## Gate prima della stampa e posa

1. Pesare realmente n0/n1/n2/n3 senza case e gli altri tre o quattro donatori quando identificati, inclusi dissipatori, alimentatori, SSD e cablaggi; definire alimentatori effettivamente posati sulla Torre.
2. Disegnare in CAD un telaio in solo metallo (niente betulla) con distinta **numero e lunghezza profilati**, giunti, piastre, controventi, supporti e calcolare massa a partire da pesi di catalogo specifici.
3. Eseguire controllo flessione/torsione/racking, stabilità e anti-ribaltamento, caricando i punti realmente sostenuti dalla HAUGA; non usare il carico nominale 20 kg come sostituto della verifica dei carichi puntuali.
4. Aggiornare calcolo termico eliminando le due aree HDD e realizzare prova con quattro, poi se necessario sei ventole. Evitare una spesa prematura in ventole superflue.
5. Montare e testare prima un singolo modulo; pesare struttura completa e verificare appoggi, cavi e stabilità. Soglia **massima assoluta** del mobile: 20 kg di tutto ciò che grava sul piano, inclusi componenti non previsti e supporti. Serve margine.
6. Solo allora aggiornare render e quotature, distinguendo R-4 dallo storico R-3.

## Fonti e basi di calcolo

- Registro storico: [bilancio R-3](../r3.html) e [misure](../misure.json)
- [Meccania 2020 leggero 0,39 kg/m](https://www.meccania.com/en/industrial-extrusions/aluminium/20-mm-base/20x20-face-aluminium-extrusions-d01-8)
- [ARCTIC P14 PWM PST: 0,194 kg ventola (0,230 kg con imballaggio)](https://www.arctic.de/en/P14-PWM-PST/ACFAN00125A/)
- [IKEA HAUGA 00415047: massimo 20 kg sul piano](https://www.ikea.com.tr/en/product/hauga-white-138x36x54-cm-tv-bench-00415047)
- [Architettura H-7 + DAS H-4](TORRINO_DAS_H4_2026-11-23.md)

**Nessun componente è stato acquistato o collaudato.** La R-5 affina la geometria e non costituisce autorizzazione alla posa su HAUGA.
