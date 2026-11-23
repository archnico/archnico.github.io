# Torre H-7 R-6 · Metal-Lite a spina di pesce

**23 novembre 2026 — progetto candidato parametrico, NON disegno esecutivo.**  
Sostituisce la FB-1 come **direzione di riprogettazione**, non come geometria già certificata. La FB-1 e il render esistente rimangono come riferimento storico. Nessun ordine, taglio o STL di produzione è autorizzato.

## Scopo e decisione

- Sette PC indipendenti; orientazione a parcheggio obliquo **42° in pianta**, passo **164 mm**.
- Riservare materiale stampato **solo a interfacce non portanti**: pattini di usura, adattatori isolati, maniglie/fermi con ritenuta metallica, supporti SSD e morsetti cavo. **Target PETG 0,70–1,20 kg per sette moduli**, da verificare nel slicer; non è una massa calcolata da mesh STL.
- **Eliminare** i sette fondi PETG pieni da 92×284×10 mm e le 14 lunghe guide laterali PETG, oltre ai moduli HDD e alla betulla. Sostituire tutto questo con **cornici aperte in metallo sottile** e guide fisse metalliche sottili + pattini intercambiabili.
- Il carico corre dal PCB attraverso distanziali e supporti progettati al **carrier metallico**, alle selle metalliche, alle traverse 2020 e ai sei piedi di scarico. Il PETG non è trave, supporto di peso concentrato, né barriera unica contro cadute.
- Stesse cartucce sulla HAUGA o su supporto indipendente a pavimento; in quest'ultimo caso cambiano **soltanto** piedi e stabilizzatori. Non forare la HAUGA. La HAUGA deve essere ancorata a parete **come richiesto da IKEA**; la Torre necessita comunque di **ritenuta antiribaltamento autonoma** rispetto all'ancoraggio IKEA.
- DAS commerciale **4 bay** separato sopra cassettiera + hub USB alimentato 4 porte; nessun disco meccanico né UPS sulla HAUGA; un SSD locale per PC; eventuale GPU esterna.

## Geometria di studio R-6 (mm)

| Parametro | R-6 | Origine/stato |
|---|---:|---|
| Piano interno HAUGA | 1345 × 330 | catalogo, misura reale PENDENTE |
| Sagoma base candidato | **1310 × 305** | prima FB-1 1310 × 318 |
| Margini teorici piano interno | 17,5 ai lati / 12,5 fronte-retro | con centratura ideale, NO tolleranze |
| Angolo, passo centri | 42°; 164 | non modificati |
| Cartuccia nominale | **92 × 284**, altezza libera da rilevare | NON confermata su n1 |
| Centri | X=162+164i, Y=152,5 per i=0..6 | coordinate locali |
| Proiezione cartuccia | circa **258,4 × 272,6** | formule trigonometriche |
| Gioco normale tra due cartucce mobili | **29,87** | 164 cos(42°) − 92 |
| Guide fisse ipotetiche | centri U ±52, ingombro locale 6 | NON quote produttore |
| Luce nominale guida/mobile | **3 mm** per lato | 52−3−46 |
| Luce tra guide fisse adiacenti | circa **11,87 mm** | 164cos42−2×52−6; testa vite NON inserita |
| Piedi per appoggio HAUGA | 3 stazioni X × 2 file Y | X=100,655,1210; Y=45,260 |
| Livello sopra spalletta | ≥109 mm dal piano | lip H90 nominale; top, traverse da verificare |
| Estrazione | verticale dopo scollegamento e rimozione ferma | corsa e traiettoria ancora DA COLLAUDARE |

Formule per proiezione della cartuccia ruotata: X=W cosθ + D sinθ; Y=W sinθ + D cosθ. Una sagoma ristretta **non** significa automaticamente maggiore stabilità: va ricalcolato il momento di ribaltamento nel piano della profondità.

**Rilievo necessario:** la scheda n1 ASUS H81M-E misura circa **226×175 mm** contro il fantoccio FB-1 208×180. Restano ignoti verso di montaggio, connettori con cavi, spessore completo ATX24/dissipatore e ingombro alimentatori. Verificare che l'altezza utile sia ≥ PCB226 + gioco ai bordi e che la larghezza **92** basti al dissipatore e alle curve cavo. Se non basta, **fermarsi e variare passo/layout**, non spingere connettori contro le guide.

## Distinta preliminare metallo, NO ordine

| Codice | Componente | Quantità × taglio | Totale lineare |
|---|---|---|---:|
| B1 | Longheroni bassi 2020 | 2 × 1310 mm | 2,620 m |
| B2 | Traverse base 2020 | 5 × 265 mm | 1,325 m |
| B3 | Montanti sollevamento 2020 | 6 × 104 mm | 0,624 m |
| **B** | **Somma 2020** | **13 pezzi** | **4,569 m** |
| C1 | Telai mobili, coppie longitudinali angolare Al 15×15×1,5 | 14 × 280 mm | 3,920 m |
| C2 | Telai mobili, chiusure angolare Al 15×15×1,5 | 14 × 92 mm | 1,288 m |
| C3 | Telai mobili, due elementi di sostegno verticali per modulo | 14 × 230 mm | 3,220 m |
| G1 | Guide fisse sottili angolare Al 15×15×1,5 | 14 × 240 mm | 3,360 m |
| **C+G** | **Somma angolare** | **56 pezzi** | **11,788 m** |
| R1 | Tiranti controventatura in piattina metallica | 2 × 400 mm | 0,800 m |

I tagli C2 (92 mm) sono **elementi trasversali concettuali**: connessioni, orientazioni e spazio delle teste vite vanno definiti nel CAD di carpenteria. Le guide G1 **non devono essere semplicemente appese** al PETG: richiedono attacchi rigidi metallici ai terminali della base; quando si verifica la configurazione del reale donatore, potrebbero essere accorciate o cambiate. Non aggiungere 56 pezzi al carrello senza una distinta lavorazioni e un prototipo metallico. Il profilo Meccania 2020 D01.8 pesa **0,39 kg/m**, ma il produttore lo presenta per **carichi limitati**: verifiche di flessione e giunzione obbligatorie. L'angolare sottile ha sezione nominale geometrica (2×15×1,5−1,5²)=42,75 mm² e massa **calcolata** ~0,115 kg/m a densità 2700 kg/m³, **non peso certificato di una referenza**.

## Ottimizzazione del lavoro manuale e delle lavorazioni

Il taglio concettuale soprastante conta **69 segmenti di metallo (13 profilati 2020 + 56 angolari)**: questo è un *tetto grezzo di componenti*, **non ancora un progetto economico da ordinare**. La manodopera per tagli, fori e smussi può costare più dei profili. Prima del preventivo:

1. **Prova di riuso:** verificare se i sette donatori offrono piastre motherboard / vassoi / staffe / distanziali metallici riutilizzabili senza compromettere case ancora in servizio. Un vassoio originale è il riferimento migliore per i fori e per la continuità di massa; **pesarlo prima** di accettarlo, perché una piastra d'acciaio piena può far fallire il budget 20 kg.
2. **Ridurre i tagli:** accorpare C2 e C3 mediante squadrette commerciali preforate o elementi salvati dai case, eliminando se possibile lavorazioni su pezzi lunghi ~92 mm. Non eliminare controventi o fermi per risparmiare tagli.
3. **Appoggi, non stampati:** portata e contatto del carrier devono passare per sedili metallici veri; qualunque rivestimento PETG va montato come parte sacrificabile, senza affidare tutto il peso a una clip plastica.
4. **Sicurezza elettrica:** rispettare i punti di collegamento a massa previsti dal produttore e la continuità tra chassis, PSU e messa a terra dove applicabile. Non isolare indiscriminatamente ogni foro motherboard con rondelle di plastica. La verifica va fatta sul nodo reale.
5. **Confrontare due RFQ:** una proposta con angolari tagliati/forati su misura, una con riuso dei vassoi e ferramenta preforata; confrontare *prezzo consegnato, numero lavorazioni, massa, smontabilità*.

## PETG: progettare piccoli elementi per servizio di stampa esterno

| Lotto | Cosa | Range massa di studio |
|---|---|---:|
| P1 | 7 kit adattatore motherboard con fori specifici, riutilizzando standoff e punti di massa OEM dove richiesti | 180–300 g |
| P2 | Interfacce guide + 28/56 pattini sostituibili sui carrier | 140–240 g |
| P3 | 7 coppie di fermi e maniglie con ritegno METALLICO | 100–180 g |
| P4 | 7 staffe SSD non strutturali | 80–140 g |
| P5 | Canalette e scarichi trazione locali | 60–140 g |
| P6 | 6 interfacce antiscivolo e piccoli raccordi | 80–160 g |
| **TOT** | **Lotti candidati** | **640–1160 g** |

Il budget gestionale **0,7–1,2 kg** include qualche spreco/pezzi di prova ma non garantisce il peso al grammo: confermarlo su STEP/STL reali e report slicer, stesso materiale PETG, impostazioni di perimetri adeguate. Niente PLA comune per staffe vicino a caldo e niente staffe PETG che sorreggono da sole le schede.

## Budget masse indicativo (scenario 4 ventole, 1 PSU)

| Gruppo | kg nominali di studio |
|---|---:|
| 7 PCB/CPU/dissipatori/RAM (vecchia assunzione non pesata) | 6,20 |
| Profilati 2020 4,569 m ×0,39 kg/m | 1,782 |
| Angolari 11,788 m ×0,1154 kg/m | 1,361 |
| Controventi in piattina | 0,086 |
| PETG piccolo | 0,90 |
| Piedi/piastre di ripartizione/ritenute extra | 0,50 |
| Giunti, distanziali, viti, ferramenta | 0,80 |
| 4 ventole P14 reali (fuori cartucce) | 0,776 |
| 7 SSD locali | 0,28 |
| 1 PSU ATX e altri brick ALTROVE (ipotesi!) | 1,30 |
| Cablaggio | 0,60 |
| **Totale nominale R-6** | **14,585** |

Con 6 ventole aggiungere ~0,388 kg. Con ogni ulteriore alimentatore ATX **sul mobile** aggiungere ~1,30 kg. Mancano montature reali ventole, cavi e masse dei donatori ignoti; è un budget di scenario, non una previsione affidabile né certificazione. **Gate operativo: obiettivo ≤17 kg realmente pesati, soglia HAUGA 20 kg inderogabile.** La base ristretta non elimina il ribaltamento; serve ritenuta a parete della Torre dimensionata indipendentemente, e verifica dei carichi locali sul piano del mobile.

## Preventivo R-6 per la Torre — acquisti condizionati

| Voce | € minimo–massimo indicativi |
|---|---:|
| Primo lotto campioni PETG esterni | 25–55 |
| Serie PETG finale 0,7–1,2 kg, service esterno | 80–300 |
| 2020 4,6 m, tagli a misura | 30–80 |
| Angolare alluminio ~12 m, tagli e possibili fori | 35–90 |
| Giunti/collegamenti, distanziali, viti | 35–80 |
| Piedi, piastre, protezioni e ritenute autonome | 30–80 |
| Ventole e griglie supplementari (da misurare) | 30–75 |
| Cavi, passacavi, minuteria | 20–65 |
| Spedizioni/lavorazioni aggiuntive | 20–65 |
| **Totale teorico** | **305–890** |

Si tratta di **intervallo di pianificazione**, non preventivo di fornitore. Esclude PSU mancanti, hardware PC, SSD da comprare, DAS, hub, UPS, lavori a parete, leggi/supporti scrivania. Evitare double counting dei campioni se il service li scala dalla produzione. **Obiettivo commerciale €400–600**, da verificare raccogliendo due preventivi per profilati tagliati e due per PETG; non sacrificare antisfilamento/antiribaltamento per inseguire il prezzo.

## Gate stop/go — ordine di lavori

- **G0 (bloccante):** rilievo meccanico n1 1:1 incl. PSU e cavi collegati, dimostrando volume reale 92×284 e percorso verticale. Misurare luce interna HAUGA e profilo U.
- **G1:** prototipo inerte di un solo vano con telaio metallico, guide e campioni PETG; controllare scorrimento e sfilamento senza mani nell'hardware, testa viti, polvere, deformazione e scarico cavi.
- **G2:** verifica statica del telaio 2020, giunzioni, tre stazioni di appoggio, reazioni sulla HAUGA, spinta di estrazione, controventature, ribaltamento e ritenuta autonoma, anche versione a pavimento. Non usare la portata 20 kg come prova di stabilità.
- **G3:** pesatura reale completa, con tutti gli alimentatori e sette donatori; collaudo elettrico e termico, ventole esterne reali e passaggi aria. Niente distribuzione artigianale 230 V.
- **G4:** report slicer P1–P6, orientazione e perimetri; RFQ stampa e tagli; acquisto soltanto dopo esiti G0–G3.

**Decisione:** il metallo prende il carico; PETG solo adattamento. **NO-GO** per pezzi definitivi, e **NO-GO** per stampare il vecchio FB-1 dal render.

## Fonti
- IKEA HAUGA 004.150.47, top **20 kg max**, **ancoraggio a parete obbligatorio**: https://www.ikea.com/ae/en/p/hauga-tv-bench-white-00415047/
- Meccania D01.8, peso **0,39 kg/m**, carichi limitati: https://www.meccania.com/it/profilati-industriali/alluminio/base-20-mm/profilato-frontale-20x20-d01-8
- Audit storico FB-1: [blundercheck](BLUNDERcheck_FB1_COLLISIONI_2026-11-23.md)
