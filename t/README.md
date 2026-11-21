# Torre H-7 R-1 — candidato consolidato

21 novembre 2026 · **Candidato ingegneristico, non esecutivo: non stampare o installare prima delle verifiche pertinenti.**

- [Anteprima dettagliata corrente](index.html) · [Schema tecnico R-1](schema-r1.html) · [Scheda tecnica](r1.html) · [Anteprima storica v2.1](v2.1.html).
- Sette cartucce identiche estraibili dall'alto, passo nominale 96 mm; I/O verso il retro; eventuale GPU futura esterna, nessun vano telefoni.
- Corpo nominale 1028×429×334 mm; pannello candidato 1130×450×18 mm. Quote da congelare dopo rilievo. La cornice CAD di studio 80×249×251 mm deve essere riconciliata con la precedente altezza illustrativa di 239 mm.
- Scelta preliminare: profilati 2020 in alluminio pretagliati, base in multistrato di betulla, PETG solo per interfacce e campioni; nessun percorso di carico strutturale stampato non verificato.
- CAD candidato con 16 geometrie esportate in STL, STEP facettato e 3MF. 137/137 controlli digitali del modello registrati; non costituiscono prove di resistenza, compatibilità hardware o certificazione. Anteprima dettagliata basata sul modello visivo precedente con architettura R-1 dichiarata; schema R-1 separato, entrambe illustrative, non copie esatte del CAD. File di fabbricazione non pubblicati.
- Prima fase: misurare chassis e scheda madre, porte, dissipatore e cavi; validare la geometria dei campioni; preventivo e piccolo lotto di prova; prototipo vuoto con prove di carico; collaudo elettrico e termico prima dell'installazione.
- Sei ventole sono un'ipotesi da verificare; analisi termica e strutturale preliminari, non CFD/FEA. Nessuna misura di portata o carico reale. UPS da dimensionare dopo rilevazione degli assorbimenti.
- Campioni PETG: ordine aggregato, stima indicativa 16–23 EUR al netto di IVA, spedizione ed extra; non un preventivo.

## Archivio delle specifiche v2.1 (storico, non prevale sulla R-1)

# Torre H-7 — Specifiche di progetto v2.1

21 novembre 2026 · configurazione scelta: sette PC, nessun vano di riserva. Modello concettuale, non CAD esecutivo.

## 1. Architettura
- Sette cartucce PC P1–P7 estraibili dall'alto, passo 96 mm, cornice identica, adattatore motherboard specifico. Due fermi rimovibili per cartuccia: scollegare tutti i cavi prima del sollevamento.
- Eliminati S8 e S9: zero vani riservati a GPU, telefoni o accessori; nessun telefono/dock previsto. Una sola Torre nell'ambiente.
- Due banchi laterali per dischi, quattro sedi illustrative per banco. Capacità effettiva, massa, alimentazione e connessione di ciascun disco da definire.
- Eventuale GPU futura esterna su supporto indipendente; non riservare volume interno. Scelta del nodo host, interfaccia PCIe reale, riser/adattatore compatibile, alimentazione, raffreddamento, massa e ritenuta da verificare prima di acquisto. Non è una eGPU USB generica, né un dispositivo condiviso automaticamente fra tutti i PC.
- Telaio aperto, traverse basse e alte, guida anti-oscillazione, doppia sede inferiore, controventi bassi dietro, dieci piedi (cinque coppie); ultimo montante alto aggiunto a campata 7. Niente cassetti su guide scorrevoli. Quattro pattini opzionali per installazione autonoma.

## 2. Ingombri nominali (mm)
| Voce | H-9 precedente | H-7 v2.1 |
|---|---:|---:|
| Numero di vani PC + extra | 7+2 | 7+0 |
| Lunghezza corpo | 1220 | 1028 |
| Profondità corpo nominale | 429 | 429 |
| Altezza corpo nominale | 334 | 334 |
| Passo cartuccia | 96 | 96 |
| Piastra rimovibile L×P×spessore | 1320×450×18 | 1130×450×18 |
| Altezza appoggio adattatore | 41 | 51 |
| Quota superiore Torre dal pavimento sul mobile | 893 | 903 |

Il telaio risparmia 192 mm (15,7%) in lunghezza. Formula geometrica vigente: 356 mm di fasce terminali + 7×96 mm. Il corpo nominale mantiene le quote del modello precedente; non comprende il volume per disconnessione, cavi, sollevamento o GPU. I 249×239 mm della cornice mobile sono quote illustrative: il supporto reale e le schede donatrici, in particolare quelle grandi, devono essere rilevati prima di congelare l'interfaccia; non dichiarare compatibilità ATX/microATX universale.

## 3. Mobile bianco e adattatore
- Mobile fotografico stimato 1500×320×500 mm; U posteriore e due testate, fronte aperto; altezza 28 mm e spessore 18 mm ipotetici. Tutte da misurare.
- Piastra centrata 1130×450×18 mm: 185 mm liberi a ogni estremità del mobile. Corpo 1028 mm: 236 mm liberi per estremità. Sbalzo piastra 65 mm davanti/dietro; nessuno sbalzo longitudinale sul mobile stimato. La profondità rimane critica: il peso deve passare ai punti portanti reali, mai sui bordini.
- Sei appoggi interni al perimetro U (tre coppie), 51 mm di altezza; tre traverse di raccordo, sottotraversa a 40 mm sopra il piano, luce 12 mm rispetto alla spalletta ipotetica, sottopiastra a 51 mm, luce 23 mm; superficie piastra a 569 mm da terra. La stessa geometria è usata nella vista esplosa e assemblata.
- Piastra e traverse strutturali in materiale dimensionato e verificato (legno strutturale/metallo da valutare), non stampa 3D portante non collaudata. Fermi anti-scorrimento rimovibili; fissaggio antiribaltamento e carico distribuito da validare sulla struttura reale.
- Retro I/O rivolto al muro, fronte alla stanza. Rotazione rigida della stessa mesh, non specchiatura. Mobile disposto a 201 mm nominali dal muro interno, bordo posteriore piastra a 136 mm; spazio richiesto da connettori e cavi da provare. Accessibilità del retro dalle testate da verificare, senza spostare una Torre carica in modo improvvisato.
- Senza mobile: stessa H-7 sui propri piedi, nessun adattatore necessario; pattini allarganti opzionali da testare. Nessuna seconda Torre.

## 4. Alimentazione, rete e ambiente
- UPS candidato PowerWalker VI 1500 CSW IEC, 1500 VA/900 W, 99×410×280 mm, 13,1 kg. Quattro IEC C13 con batteria, quattro sola protezione. A terra vicino alle prese, mai sulla piastra. Dimensionamento effettivo con wattmetro e autonomia necessaria; priorità ai nodi critici e arresto NUT, nessuna promessa di sette PC tutti a batteria.
- Alimentatori commerciali appropriati ai rispettivi nodi. Nessuna distribuzione AC artigianale o stampata. Presa 230 V e Ethernet sulla parete destra, posizione stimata a circa 1 m dopo lo smusso. Canalizzazione AC e LAN separata, lungo pareti; risalite dietro la Torre, bretelle rimovibili. Sezioni e connettori da calcolare con inventario reale dei cavi. Switch Ethernet e porte da dimensionare se necessarie.
- Tre monitor a muro, seduta verso il principale, quattro satelliti nel multilivello con stampante e modem; subwoofer sulla cassettiera. Conservate le posizioni ambientali della v1.7.2 salvo il distacco del mobile bianco dal muro per il retro.

## 5. Condizioni per fabbricazione
Prima di qualsiasi stampa strutturale definitiva: rilievo del mobile (piano, U, struttura interna, portata e stabilità), ingombri schede incluse porte e dissipatori, pesi reali di tutti i moduli e dischi, dimensionamento delle traverse e dei giunti, prova di flessione/torsione/ritenuta e stabilità, prova estrazione e accesso con cablaggio reale. Se il mobile non è idoneo, scegliere installazione autonoma o un supporto indipendente adeguatamente verificato. Nessuna riduzione di peso quantificata senza distinta materiali. Nessuna prova meccanica fisica o certificazione già ottenuta.

## 6. Verifica digitale precedente (v2.0)
HTML v2.0 verificato in Chromium: 12 scene su desktop 1550×950 e mobile 390×800, zero errori JS; nelle scene Torre, stanza, mobile e autonoma il selettore contiene esattamente P1–P7, nessun S8/S9; scheda adattatore coerente 1130 mm. Validazione di resa e interazione, non di resistenza strutturale. Le vecchie revisioni restano nello storico Git; v2.0 sostituisce H-9 come configurazione corrente.


## 7. Ventilazione modulare v2.1 — configurazione corrente
- Sei ventole commerciali candidate Arctic P14 PWM PST, 140×140×27 mm. Quattro sul fronte compute, due sul fronte banchi HDD. Dati produttore: 123,76 m³/h a bocca libera, 200–1700 rpm, 2,4 mm H₂O pressione statica massima, 0,12 A a 12 V, 194 g ciascuna, temperatura ambiente di funzionamento 0–40 °C. Riferimento: https://www.arctic.de/en/P14-PWM-PST/ACFAN00125A/ . Nessun acquisto eseguito. Massa nominale delle sei sole ventole 1,164 kg, maggiore massa di staffe e griglie da determinare.
- Coordinate centri (x,z) [mm]: F1 (89,133), F2 (262,152), F3 (430,152), F4 (598,152), F5 (766,152), F6 (939,133). Scocche y=18–45 mm; griglie schematiche a y=16 e 47. Staffe doppie fissate a trave frontale, non alle cartucce; attacchi e ritenuta da dimensionare. Ingombro aggiuntivo interno al nominale 429 mm; nessuna modifica alla piastra 1130×450 mm. Non aggiungere copertura superiore.
- Il modello distingue ingressi freddi frontali e uscita libera verso l'alto/retro. Questi sono percorsi desiderati, NON linee di corrente calcolate. Il modello non contiene dissipatori reali dei donatori, curve P-Q di sistema, ostacoli reali dei cablaggi o misure di ricircolo. Raffreddamento CPU dedicato obbligatorio.
- Griglie commerciali su entrambi i lati (ingombri e resistenza da confermare), cavi trattenuti in canalina bassa 12 V separata. Le staffe sono rimovibili per accedere a fermi e dischi; spegnere/scollegare prima della rimozione. Non ostruire la corsia posteriore di 136 mm nominali; verificare con cavi piegati e reale distanza fra muro e retro.
- Alimentazione indipendente: 0,72 A e 8,64 W nominali per sei ventole; scegliere alimentatore commerciale 12 V e controller PWM con margine adeguato a avvio, corrente di picco e protezioni, indicativamente almeno 2 A da verificare. Nessun collegamento di alimentazione fra più PC. Prevedere lettura tachimetrica separata per ciascuna ventola (un semplice splitter PST non espone tutti e sei i tachimetri); comportamento fail-safe e allarme guasto. Arresto o limitazione carico se raffreddamento insufficiente; UPS secondo priorità e carico realmente misurato.

### Bilancio termico preliminare
Q [m³/h] = 3600 P/(1,18×1005×ΔT), P in W termici, ΔT in K. A ΔT=8 K: 250 W → 95 m³/h; 450 W → 171 m³/h; 600 W → 228 m³/h; 800 W → 304 m³/h (arrotondati per eccesso). Obiettivo iniziale 250–300 m³/h **utili** per lo scenario fino a 600 W, da verificare. La somma di portate a bocca libera (~743 m³/h) è solo un limite nominale ideale: non prova quantità o distribuzione dell'aria attraversante i dissipatori. Non usare la pressione statica massima simultaneamente alla portata nominale. Il calcolatore nel modello è un bilancio globale, non CFD.

### Collaudo fisico prima di uso continuativo
1. Rilevare schede/dissipatori/PSU e dischi; controllare presa d'aria CPU e spazio reale di ogni cartuccia. Provare staffe, griglie, cavi, accesso fermi, estrazione verticale, montaggio su mobile e autonomo. Pesare l'insieme e aggiornare prova di portata e stabilità del mobile.
2. Misurare ambiente, watt a muro, temperature CPU, SMART HDD/SSD e tachimetri; misurare aria in ingresso/fronte e uscita/retro, almeno tre zone fra moduli e presso entrambi i banchi HDD. Verificare con campionamento di velocità su sezioni rilevanti se si vuole stimare la portata utile, non solo al centro delle ventole. Controllare ricircolo vicino alla parete con anemometro o filamenti leggeri non aspirabili.
3. Registrare baseline idle per 20 min; carico singolo nodo, poi 3 nodi, poi 7 nodi e I/O dischi simulati non distruttivi. Stabilizzare ogni gradino; prova simultanea almeno 60–120 min solo se temperature sicure. Ripetere a caldo estivo, con cavi e mobile definitivo, senza superare limiti donatori o temperatura ambiente operativa ventole. Controllare throttling, rumore, vibrazioni e temperatura supporti stampati.
4. Obiettivi iniziali non certificati: aria locale +8–10 K rispetto all'ambiente, CPU preferibilmente <80 °C salvo specifiche del donatore, HDD 30–45 °C, SSD preferibilmente <55 °C salvo limiti produttore; ridurre carico ben prima dei limiti assoluti. Se una zona è calda, modificare direzione/portata locale, cablaggio o aggiungere deflettori rimovibili dopo prova. Non aumentare la velocità indiscriminatamente. Verificare guasto di una ventola a carico ridotto, allarmi e fail-safe prima di prove più severe. Non proseguire se superati limiti o osservato surriscaldamento/odore anomalo.
5. Solo dopo i log: determinare numero realmente necessario, curva PWM minima per zona, soglie e automazione di protezione. Nessuna prova termica fisica svolta nella v2.1.

### Verifica digitale v2.1
- Chromium 1550×950 e 390×800: tutte le 13 scene, 0 errori JS. Sette gruppi P1–P7 e sei gruppi F1–F6 presenti nelle cinque viste di assieme (Torre, termica, stanza, mobile, autonoma); selezione F3, toggle percorsi, calcolatore 600 W/8 K (228 m³/h), estrazione illustrativa P1 verificati.
- AABB dei corpi ventole y=16–45 mm, cartucce incl. adattatori y=74–323: distacco nominale 29 mm dai corpi (27 mm dalle griglie schematiche). Intervalli x delle scocche: 19–159, 192–332, 360–500, 528–668, 696–836, 869–1009 mm. Separazione minima laterale 28 mm. Banco HDD da y=48 per basamento; spazio della griglia reale, accesso al banco, staffe, fissaggi e vibrazioni da verificare. Test AABB non prova CAD completo, tolleranze o assenza di collisioni con componenti reali futuri.
- Il modello mantiene esattamente sette cartucce, nessun vano extra. Validazione visiva e geometrica limitata, nessuna certificazione strutturale o termica.