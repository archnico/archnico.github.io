# Torre H-7 R-5 — Pettine obliquo, alleggerimento e appoggi
**23 novembre 2026 · candidato di calcolo sulla branch principale, NON esecutivo.** La R-5 sviluppa l'ipotesi dei sette moduli ruotati tutti nello stesso verso (parcheggio a pettine); non sono ancora autorizzati stampa, montaggio né modifica del render. Restano fissi: **H-7 solo calcolo, sette SSD di sistema, HDD sul DAS H-4 su altro mobile, UPS altrove**, GPU eventualmente esterna. Il mobile IKEA HAUGA 004.150.47 ha portata **massima dichiarata 20 kg sul top e deve essere ancorato al muro**. Lo studio punta a restare ben sotto, non a superare tale limite per effetto della distribuzione del peso.

## 1. Geometria verificabile
Sistema di coordinate: Y lungo i 1370 mm misurati del mobile, X dal retro verso la stanza, Z dal pavimento. Luce interna nominale catalogo **Y=1345 mm**, da rilevare in loco; profondità misurata 355 mm. I sette volumi di cartuccia sono rettangoli verticali di spessore W, sviluppo orizzontale D, disposti con angolo t comune e centri distanti P lungo Y. La cornice vecchia **80×249×251 mm** non è verificata sull'hardware; D=251 e W=80 sono **ipotesi di prova**. Le cartucce si sollevano **verticalmente**, dopo scollegamento e sblocco, non scorrono in avanti.

Formule (millimetri): 
- Larghezza del gruppo: `6P + W cos(t) + D sin(t)`.
- Profondità proiettata del singolo modulo: `D cos(t) + W sin(t)`.
- Intercapedine normale fra moduli paralleli: `P cos(t) − W`.
- Ingombro totale di STUDIO: larghezza del gruppo **+474 mm residui storici**, che comprendevano banchi HDD ormai rimossi. **Quel residuo deve essere ricostruito nel CAD e NON si considera confermato**.

| t | P (mm) | Ingombro Y (mm) W80 D251 con residuo 474 | Intercapedine normale | Margine teorico per lato vs 1345 |
|---|---:|---:|---:|---:|
| 0° | 96 | 1130 | 16,0 | 107,5 |
| 20° | 108 | 1283 | 21,5 | 31,0 |
| 24,5° | 109 | 1305 | 19,2 | 20,1 |
| **25°** | **108** | **1301** | **17,9** | **22,2** |
| 26° | 108 | 1304 | 17,1 | 20,5 |
| 30° | 108 | 1317 | 13,5 | 14,1 |

**Scelta di studio: 25°/passo 108 mm**, da verificare prima su n1. Il 30° erode il varco utile fra i moduli; il 24,5°/109 è variante quasi equivalente. L'ottimizzazione non è una certificazione: il semplice rettangolo non comprende dissipatori, connettori piegati, dita, maniglie, risvolti del telaio o cavi.

**Sensibilità al vero spessore della cartuccia:** richiedendo almeno 16 mm di intercapedine nominale, a 25° occorre passo 117 mm per W90 e 128 mm per W100. Con il residuo storico 474 mm, W90 produce L1364 mm e NON entra nei 1345 mm. Se i banchi HDD liberassero almeno 124 mm di residuo, W90 con residuo 350 mm darebbe L1240 mm; W100 con residuo 300 mm darebbe L1265 mm. Sono esempi alternativi, **non la promessa che i volumi laterali siano effettivamente liberi**.

**Profondità-obiettivo da falsificare:** l'impronta X delle sole cartucce con W80/t25 è 261 mm. Sommando illustrativamente 37 mm frontali (fan+griglia), 50–75 mm per I/O/cavi posteriori e 40 mm strutturali, si ottiene **388–413 mm**. Target di CAD 400–420 mm se le curve dei cavi lo permettono, contro 450 mm della vecchia piastra. Sul mobile P355 significherebbe sbalzo **45–65 mm soltanto davanti**, invece di 95 mm. Nessuna di queste quote è congelata.

## 2. Telaio ultraleggero: distinta tagli da verificare
Si abbandona la betulla piena e anche la piastra lignea reticolare: **reticolo in profilati di alluminio più giunti e controventi realmente necessari**. Profilo di studio Meccania D01.8 20×20 mm, 0,39 kg/m, Ix=0,68 cm⁴ e Iy=0,59 cm⁴ (asse debole). La seguente **NON è una distinta da ordinare**, ma testa l'ordine di grandezza della precedente ipotesi di 9,5 m:

| Parte | Quantità × taglio concettuale | Totale |
|---|---:|---:|
| Longheroni longitudinali (bassi e alti) | 4 × 1305 mm | 5,220 m |
| Traverse di estremità / interne | 4 × 410 mm | 1,640 m |
| Montanti verticali | 6 × 334 mm | 2,004 m |
| Controventi diagonali corti | 2 × 529 mm | 1,058 m |
| Riserva per altri rinforzi / modifiche | non allocata | 0,378 m |
| **Budget** | | **10,300 m** |

Massa teorica profili **4,017 kg**. Il vecchio R-4 aveva 9,5 m ×0,39=3,705 kg: la spina costa in questa ipotesi **+0,312 kg**. La sezione 410 delle traverse assume due guide da 20 mm entro profondità esterna 450; se la profondità passa a 400–420, le traverse cambiano. I collegamenti e la diagonale longitudinale non sono ancora calcolati: **il telaio non può essere fabbricato da questa tabella**.

**Controllo semplificato flessione**: ipotizzati 17 kg uniformemente su due longheroni da 1305 mm semplicemente appoggiati, E=69 GPa, I=0,59 cm⁴ (asse più debole): una campata da 1305 mm senza supporti intermedi darebbe circa **5,9 mm** di freccia (non accettabile senza progetto diverso). Tre stazioni d'appoggio per lato, campate ~565 mm, danno circa **0,21 mm per campata** nel medesimo modello ideale. Non sono verificate torsione, racking, giunti, carichi concentrati e impatti: i **sei appoggi** hanno grande valore strutturale, ma soltanto se trasferiscono il peso al piano idoneo.

## 3. Massa: riconciliazione R-4 e R-5
La pagina ARCTIC del modello P14 PWM PST ACFAN00125A distingue **194 g ventola** da **230 g confezione**. La precedente R-4 pubblicata usava 4×230g=0,920kg; corretto 4×194g=**0,776 kg**, dunque **R-4 corretta 15,046 kg** invece di 15,190kg. Sei ventole pesano 1,164kg e aggiungono +0,388kg rispetto a quattro, non +0,460.

| Variazione rispetto alla R-4 corretta | kg |
|---|---:|
| R-4 corretta (4 ventole, 1 PSU, 7 schede ipotetiche, no HDD, no betulla) | 15,046 |
| Profilati extra R-5, +0,8m ×0,39 | +0,312 |
| SSD locali: prudenzialmente 0,28kg invece di 0,12kg per 7 | +0,160 |
| **R-5 nominale, 4 ventole, 1 PSU** | **15,518** |
| Con **6 ventole, 1 PSU** | **15,906** |
| Con **6 ventole, 2 PSU totali** | **17,206** |
| Con **6 ventole, 3 PSU totali** | **18,506** |
| Con **6 ventole, 4 PSU totali** | **19,806** |
| Con 6 ventole, 2 PSU e +2 kg schede | **19,206** |

**TUTTE stime scenario**, non probabilità, certificazioni o una previsione accurata al grammo. Rimangono sconosciuti 4 donatori, numero PSU, massa giunti, supporti, connettori e reale lunghezza delle traverse. Nessun HDD, DAS o UPS grava sul mobile. Target prudente **≤17 kg pesati nell'assetto completo**, soglia costruttore **20 kg** mai derogabile; il superamento comporta collocazione a pavimento/su supporto realmente indipendente. Non escludere masse necessarie per sicurezza pur di risparmiare peso.

## 4. Sei appoggi sul piano interno dell'HAUGA, non sulla spalletta
Con telaio teorico 1305 mm centrato sul mobile 1370, estremi Y~32,5 e 1337,5. Ipotesi stazioni Y=120,685,1250 mm (campata max 565), ciascuna con due supporti X=60 e 285 mm, piastre indicative Y80×X70 mm. Per ogni X la piastra deve rimanere nel top interno, fuori dalla U posteriore e laterale spessa ~10 mm. Rialzi corti ~105 mm per oltrepassare H90 della U, senza forare il mobile. Le zone sottostanti, le giunzioni del truciolare e il divisorio centrale devono essere **verificati fisicamente**. Non sostenere carichi sulla spalletta sottile.

Con massa di studio 15,518 kg, se il baricentro X è a 225 mm dal retro, la fila anteriore di supporti a X285 assume **11,38 kg equivalenti**, la posteriore **4,14 kg**. A X250 diventano 13,10/2,41; a X275 14,83/0,69: la fila posteriore si scarica quasi del tutto. Il baricentro reale e la risposta dei singoli pattini NON sono noti; le reazioni calcolate assumono un corpo rigido senza tiranti e appoggio semplice.

**Ribaltamento: rischio bloccante.** Anche prendendo il margine statico estremo della piastra anteriore fino a X320, con Xcg225 e massa 15,5kg il momento gravitazionale è appena ~14,5 N·m. Una forza orizzontale di ~32 N applicata a 45 cm sopra il piano può uguagliarlo in un modello semplificato. L'estrazione verticale, lo strappo dei cavi o un urto possono generare forze superiori. Questo NO è uno stato sicuro: servono ritenute antiribaltamento **a struttura indipendente dal mobile** verificate, oppure un supporto con appoggi a pavimento. Il fissaggio IKEA obbligatorio del mobile alla parete è separato e non si può usare implicitamente come ancoraggio della Torre.

La sola maggiore estensione del telaio **non aumenta** la portata complessiva del mobile oltre 20 kg: può diminuire sollecitazioni di alcune travi e distribuire pressioni locali, da verificare. Il mobilio è in truciolare; la pressione media delle sei piastre da 80×70 mm non certifica resistenza a flessione o alle giunzioni.

## 5. Ventilazione e cablaggio
Quattro P14 PWM PST da 140 mm: massa totale 0,776 kg, 0,48 A/5,76W nominali, portata totale teorica **495 m³/h a bocca libera** (non attraversante le schede). Sei: 1,164kg, 0,72 A/8,64W e 743 m³/h liberi. Il bilancio d'aria globale con rho=1,18kg/m³, cp=1005 J/(kg K), deltaT=8K richiede circa **95 m³/h a 250 W**, **171 a 450 W**, **228 a 600 W** di calore. Quattro ventole coprirebbero teoricamente lo scenario a 600W solo conservando almeno il **46%** della portata di targa libera: **non è garantito** da griglie, cable routing, dissipatori e ricircolo. Tutte le CPU conservano le proprie ventole. Nessuna fan-count definitiva prima di test di carico con 7 moduli.

L'I/O dovrebbe rimanere raggiungibile sul retro con uscita differenziata dei cavi per moduli ruotati, fascette di servizio ed estrazione soltanto dopo disconnessione. Non distribuire alimentazione 230 V artigianale; alimentatori commerciali idonei, prove elettriche/terra e nessun collegamento PSU tra nodi.

## 6. Gating e decisione
1. **G0 geometria n1**: verificare orientazione 80×249×251 e spessore operativo 80/90/100 mm includendo ATX24, dissipatore e curve cavo; foto/dima 1:1. Rilievo reale della luce HAUGA.
2. **G1 layout completo**: CAD di 7 cartucce a 25°, P108 o passo adattato, con SSD+PSU, ventole, connettori e guide; ricalcolare il residuo di 474 mm e la profondità 400–420; collisioni ed estrazione verticale.
3. **G2 metallo + massa**: distinta tagli esecutiva, giunti, controventi in X-Z e Y-Z, masse e baricentro misurati, verifiche deformazione e anti-ribaltamento, sistema che può poggiare autonomamente a terra.
4. **G3 prototipo inerte**: appoggi U-free; verifica della struttura HAUGA, delle reazioni e della sicurezza anti-ribaltamento su piano e a terra, senza elettronica.
5. **G4 termico/elettrico**: dopo test meccanico, prove n1 e 7 nodi con consumi, temperature, rpm, alimentazione idonea e ventilazione.
6. **G5 render e acquisto**: aggiornare il render e comprare/far stampare soltanto dopo esito delle verifiche precedenti.

**Stato:** R-5 è *la variante principale da affinare*, non una macchina sicura e pronta da costruire. La R-4 resta il riferimento di massa e la R-2 a pavimento un'alternativa di sicurezza. Questa pagina non descrive alcuna modifica fisica né un render aggiornato.

## Fonti e modelli
- [IKEA HAUGA, portata 20 kg e fissaggio obbligatorio](https://www.ikea.com.tr/en/product/hauga-white-138x36x54-cm-tv-bench-00415047)
- [ARCTIC P14 PWM PST ACFAN00125A, 194 g prodotto / 230 g imballaggio](https://www.arctic.de/en/P14-PWM-PST/ACFAN00125A/)
- [Meccania D01.8, 20×20 mm, 0,39 kg/m, Ix0,68/Iy0,59 cm⁴](https://www.meccania.com/en/industrial-extrusions/aluminium/20-mm-base/20x20-face-aluminium-extrusions-d01-8)
- [R-4 bilancio precedente](H7_R4_BUDGET_MASSA_2026-11-23.md) · [DAS H-4](TORRINO_DAS_H4_2026-11-23.md)
- I parametri e i risultati macchina sono conservati nel registro privato su n1/n2: `calcola_h7_r5_pettine.py` e `risultati_h7_r5_pettine_2026-11-23.json`.
