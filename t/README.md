# Torre H-7 — Specifiche di progetto v2.0

21 novembre 2026 · configurazione scelta: sette PC, nessun vano di riserva. Modello concettuale, non CAD esecutivo.

## 1. Architettura
- Sette cartucce PC P1–P7 estraibili dall'alto, passo 96 mm, cornice identica, adattatore motherboard specifico. Due fermi rimovibili per cartuccia: scollegare tutti i cavi prima del sollevamento.
- Eliminati S8 e S9: zero vani riservati a GPU, telefoni o accessori; nessun telefono/dock previsto. Una sola Torre nell'ambiente.
- Due banchi laterali per dischi, quattro sedi illustrative per banco. Capacità effettiva, massa, alimentazione e connessione di ciascun disco da definire.
- Eventuale GPU futura esterna su supporto indipendente; non riservare volume interno. Scelta del nodo host, interfaccia PCIe reale, riser/adattatore compatibile, alimentazione, raffreddamento, massa e ritenuta da verificare prima di acquisto. Non è una eGPU USB generica, né un dispositivo condiviso automaticamente fra tutti i PC.
- Telaio aperto, traverse basse e alte, guida anti-oscillazione, doppia sede inferiore, controventi bassi dietro, dieci piedi (cinque coppie); ultimo montante alto aggiunto a campata 7. Niente cassetti su guide scorrevoli. Quattro pattini opzionali per installazione autonoma.

## 2. Ingombri nominali (mm)
| Voce | H-9 precedente | H-7 v2.0 |
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

## 6. Verifica digitale
HTML v2.0 verificato in Chromium: 12 scene su desktop 1550×950 e mobile 390×800, zero errori JS; nelle scene Torre, stanza, mobile e autonoma il selettore contiene esattamente P1–P7, nessun S8/S9; scheda adattatore coerente 1130 mm. Validazione di resa e interazione, non di resistenza strutturale. Le vecchie revisioni restano nello storico Git; v2.0 sostituisce H-9 come configurazione corrente.