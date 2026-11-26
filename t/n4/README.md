# n4 — Modulo pioniere · H-7 R-8.1 / P0.1
26 novembre 2026 · Progetto parametrico, **NO-GO fabbricazione definitiva / accensione in Torre**.

**Revisione successiva:** [P0.2 — VESA, selle alleggerite, tavola quotata e calcolatore termico](p02/README.md) · [Render A/B](p02/index.html). Questo documento resta P0.1 storico.

**P0.3 — [ServiceDock e estrazione](p03/index.html) · [dossier](p03/README.md).**

## Scelta progettuale
n4 è il primo nodo da collaudare senza toccare n1. Conservare il Fujitsu nel case OEM, PSU interno, alimentazione commerciale originale, SSD SATA solo dopo inventario/backup. Il carrier resta C120 universale; nessuna modifica al passo 190 o alla base 1325×310. Proposta di fase al canone del 24/11: **n4 prima, n1 resta in servizio**. Ruolo iniziale worker ausiliario; GUI solo dopo benchmark. Una sede all'estremità è il primo candidato, non un'assegnazione irrevocabile.

[Anteprima 3D interattiva](index.html) · [OpenSCAD](n4.scad) · [Dima STL](dummy.stl) · [Distinta](bom.csv) · [Rilievo Udine](survey.csv) · [Verifica dimensionale](check.py).

## 1. Parametri e coordinate
X=u trasversale; Y=v frontale negativo, retro positivo; Z=h verso l'alto rispetto al fondo mobile. Quote in mm. Origine C120 al centro planare. Modelli Q510/Q910 54×188×185 e Q520/Q920 58,7×191×185 in verticale; dima prudenziale 65×195×190. Manuale comune p.63 riporta anche 58×187,5×185 e ~1,8 kg; non è un dato più preciso del modello reale. Dima massa di prova 2,0 kg, opportunamente vincolata, non una stampa piena.

| Voce | Coordinate / quota |
|---|---|
| Inviluppo C120 | X ±60, Y ±142, Z 0–280 |
| Guide fisse P0.1 | X ±66, Y ±110, piattina 6×25×100, gioco 3 per lato |
| Fondo | 2 L15×15×1,5 L284; 2 L15×15×1,5 L90 |
| Montanti A1 P0.2 | lato X−, ingombro X−60..−45; Y−127,5..−112,5 e 112,5..127,5; Z15..270 |
| Traversa alta | L225, Z255..270, X−60..−45; controvento metallico lato X− (giunti da verificare) |
| Dima | X±32,5; Y−135..60; Z23,5..213,5 |
| Modello Q520/920 | X±29,35; Y−135..56; Z23,5..208,5 |
| Modello Q510/910 | X±27; Y−135..53; Z23,5..208,5 |
| Selle U-Fujitsu | 2 tubi Al 20×20×1,5 L104, Y−105/+30 (posizione registrabile); Z1,5..21,5 |
| Contatti | 4 tasselli elastomero 10×16×2; quota appoggio Z23,5 |
| Ganasce | 4 corpi L/spessori regolabili, pad 2 mm, da stringere come riscontro non morsa |
| Fermi assiali | due riscontri inferiori rimovibili, Y−139/62 per dima; su ponticelli metallici |
| Ritenuta superiore alternativa | 2 montanti corti sezione candidata 12×5, X43..48, Y delle selle; dita metalliche con pad 2 |
| VESA alternativa prioritaria | griglia 100×100, su X−: Y−37,5±50, Z118,5±50 (solo centri teorici dima) |
| Tasca cavi dima | Y60..142 =82; 86 per Q520/920; 89 per Q510/910 |
| Spazio superiore entro envelope | 66,5 dima; non luce termica garantita |
| Estrazione | +Z, cold swap, 280 + circa 70 mano/impugnatura = 350 min di studio sopra piano carrier; verificare con AirRail rimossa |

I bracci di ritenuta devono essere regolabili in X e Z (corsa laterale almeno 6 mm per lato per i modelli elencati, 10 mm candidata; quota superiore 185–190), le selle in Y (corsa obiettivo ±20 a partire dai centri, non asole già disegnate). I giunti delle selle scaricano sulle flange inferiori del C120 con staffe metalliche e bulloni, non su clip o colla. Foratura, asole, serraggi, resistenza dei giunti, maniglia e quattro ritenute del carrier da dettagliare dopo scelta minuteria; CAD mostra corpi nominali, non i fissaggi esecutivi. Non usare STL carrier/adapter come componenti da stampare.

## 2. U-Fujitsu: due modi di fissaggio, un solo acquisto dopo rilievo
**A / VESA OEM, preferito se disponibile:** identificare la copertura originale 100 mm, gli agganci e le viti previste da Fujitsu. Due traversine metalliche aperte montate su A1, centri fori 100×100 con piastrine registrabili anziché una parete chiusa. Verificare spessore cover, offset distanziali, viti ammesse, compatibilità con gancio/sgancio, orientamento e aria. Nessun foro diretto supposto nel PC. La cover trattiene il PC contro ribaltamento/scorrimento/sollevamento; le selle inferiori scaricano il peso senza precaricare la cover. Sostegno e ritenuta vanno verificati anche nel trasporto. Il modello VESA è una griglia di centri, non un collegamento meccanico già risolto. Non montare contemporaneamente i ponticelli superiori della variante B.
**B / selle e ritenute metalliche indipendenti:** se manca la cover OEM, usare 2 selle registrabili, 4 ganasce laterali, 2 fermi assiali, 2 dita antisollevamento, tutti a contatto su zone non ventilate e resistenti; dita sganciabili con attrezzo; pad sostituibili senza adesivo su PC. I traversi portano su flange, i montanti antisollevamento devono essere fissati alle selle con giunti metallici verificati; antiscorrimento non per solo attrito. Non stringere pannelli fragili, controlli o lettore ottico. Variante B è mostrata dall'anteprima come dima di ingombro; ID reali dei fissaggi e zone di appoggio TBD. Se nessuna variante rispetta griglie e cover, fermarsi e cambiare solo adattatore.
**Elettricità:** non modificare PSU/cablaggio OEM; accesso a spina e pulsante. Qualificare il percorso di protezione/terra del telaio metallico (senza collegamenti improvvisati al PC). Niente bus 230 V custom e niente hot swap.

## 3. Geometria e falsificazione termica
Dima: margine lordo 55×89×90, ma margini effettivi non simmetrici. Tra faccia dima X− e montante più interno X−45 =12,5 (prima di traversina, pad, bulloni, cover); tra X+ e post X43 =10,5. Per Q520: 15,65 e 13,65. Tra dima e bordo carrier 27,5 per lato. Guida interna X63 -> 30,5 dalla dima (prima di ferri).
Vicino identico al passo190: gap tra scocche dima 125, Q520 131,3. Vicino pieno fino al suo bordo C120: 97,5 dalla dima. Una sede vuota tra PC e vicino pieno: 287,5 alla scocca/limite vicino, ma le guide e i montanti intermedi possono invadere la zona richiesta. L'estremità esterna libera, se presente, non risolve automaticamente il lato interno né il retro.
**Manuale Fujitsu p.16 e 63:** 10 mm dai lati non ventilati, 200 mm dalle feritoie, salvo lato inferiore in assetto verticale. La distanza va misurata dalla superficie/area effettiva ventilata all'ostacolo (compresi i ferri, non solo i PC). Le selle non devono occludere l'eccezione inferiore. Se griglia lato largo o bordo incontra guide, montante, ritenute, vicino o cavo entro 200, non dichiarare compatibilità. Una ventola ausiliaria non deroga ai 200. Il rear pocket non è spazio termico libero: distanza da faccia retro dima a bordo base 95; parete deve stare almeno altri 105 mm oltre bordo base se griglia posteriore impone 200 (calcolo rettilineo, da rilevare). Sopra la dima: nessun ostacolo entro Z413,5 nella proiezione della griglia se presente sul lato alto; rimuovere AirRail. Per fronte ventato, escludere mobili/monitor di fronte entro 200. Se ostacoli della struttura non consentono il requisito, n4 opera sul banco separato e la Torre resta prototipo freddo fino a redesign. Nessuna simulazione CFD o misura fisica.
**Test termico G4:** baseline OEM verticale in aria libera, stessa temperatura ambiente (intervallo prudente 15–35°C), stessi job ripetibili e stessa durata fino a regime (minimo 30 min, prolungare se non stabile). Log ogni 5–10 s: temperature CPU disponibili, frequenza, throttling, potenza se misurabile, temperatura aria davanti/dietro e rumore. Prima prova n4 su banco approvato, poi sede esterna vuota, poi dima o nodi reali adiacenti solo se clearance rispettata. Arresto se throttling, anomalie, temperatura vicino ai limiti OEM/CPU oppure aumento significativo rispetto alla baseline; obiettivo conservativo delta ≤5°C a pari carico/ambiente, non sostituisce limiti OEM. Nessun test acceso in violazione del manuale.

## 4. Cablaggio
Fronte arretrato 7 mm dal limite C120: non aggiungere pannello o maniglia davanti a USB/SD/ODD/pulsante. Lunghezza plug + tratto rigido + curva + tolleranza ≤ tasca posteriore, non assumere 82 sufficienti. Screening puramente geometrico con riserva 5, su dima: budget 77 mm; es. involucro spina 35 + svolta 30 =65, restano 12; grosso DVI con 55 + 30 =85, non passa. Registrare misure di AC, RJ45 (inclusa linguetta e dito), DVI-I, DP/HDMI, USB, audio. Verificare uscita dal fondo o verso alto senza incrociare guide/fermi, non piegare sotto raggio del cavo; preferire plug certificati corti solo se compatibili, nessuna prolunga casuale. Fissaggio strain relief sul telaio, con ansa lato fisso e sgancio prima dell'estrazione; nessun carico sul connettore. Niente cavi trascinati. Slot end candidato consente accesso al fianco. Rete GbE verso switch LAN; indirizzo n4 e SSH/MA dopo installazione, senza toccare n1. Backup completo donor prima di dischi/OS.

## 5. Carico e preventivo
Con 2 kg dima Fg=19,62 N, ~9,81 N/sella con CG centrale tra supporti (se sbilanciato ricalcolare); screening 3g 58,86 N totale, ~29,43 per sella. Tubo Al 20×20×1,5 ideale I=(20^4−17^4)/12≈6373 mm⁴, E=69 GPa, L104, F29,43: freccia ideale ~0,0016 mm. Non certifica giunti/ritenute/torsione. CG della dima h118,5, metà larghezza 32,5: corpo libero in ipotesi rigida ribalta lateralmente a ~0,34g riferito al suo centro sul piano di appoggio (h95); non contare su attrito. Fermi obbligatori. Il carrier vuoto deve essere vincolato al banco 380×310 P0.1 con ritenute metalliche positive, prova fredda e assistita; non tirare/maneggiare il nodo su mobile non vincolato. Sei rialzi HAUGA, baricentro, ancoraggio parete, massa e ripartizione da collaudare.
Budget massa candidato: C120 metallico 0,35–0,55 kg incl. giunti, U-Fujitsu 0,25–0,45 kg incl. giunti, n4 max di studio 2,0; totale mobile 2,60–3,00 kg esclusi guide/base/cavi, da pesare. Sette moduli da 2,6 fanno 18,2 kg prima del basamento: **non** replicare n4 sette volte sotto target 17 kg.
Preventivo gestionale **non offerte** (EUR): carrier 20–45; adattatore 15–35 (VESA OEM eventuale +10–30 in alternativa, non entrambi i sistemi); guide/fermi fissi 12–27; banco riutilizzabile 30–65; cavi se mancanti 0–15; SSD solo se necessario 20–35; stampa dima/campione opzionale 0–12 (cartone/legno inerte o scarto). C120+n4 adattatore+guide+banco ≈77–172, target pratico 100–125 se ferramenta recuperata. Esclusi spedizione e strumenti; non ordinare finché non rilevato. Nessun HDD/UPS sul top.

## 6. Sequenza montaggio / gate
1. Udine: rilevare etichetta, fotografie con scala, dimensioni complessive e sporgenze, sei facce con griglie, meccanismi originali, piedini, cover VESA, massa; censire CPU/RAM/SSD/AC.
2. Provare il PC in verticale OEM libero, a freddo prima dell'alimentazione; se necessario far verificare PSU e cavo. Backup, identificare SSD, installare Cornix senza intaccare sistemi di altri nodi.
3. Banco: realizzare un solo C120 metallico dopo verifica giunti e quote. Dima inerte; test guida, carico, quattro ritenute, ergonomia e sweep verticale. Nessuna stampa strutturale.
4. Scegliere A o B, posizionare selle solo in zone portanti identificate, fermare la dima. Prova fredda con massa 2 kg vincolata, controllare distacchi, giochi e ripetibilità; 20 cicli di inserimento/estrazione come screening, non qualifica a fatica. Validare staffe, serraggio, maniglia e ritenute con tecnico.
5. Inserire PC scollegato; quattro ritenute del carrier, connettere cavi a freddo, verificare terra/isolamento/appoggi e distanze. Test G4 secondo §3. Se non conforme lasciare n4 sul banco OEM.
6. A esito positivo, collocare nello slot candidato con mobile ancorato e base approvata. SSH, rete, gestione MA, prova job e riavvio; estrazione sempre a PC spento, scollegato e da postazione stabile; service cover accessibile sul banco.
7. Fase conclusa solo dopo test G0–G4 con evidenza reale e n4 gestibile; n1 integro, nessun secondo ordine prima del verdetto.

## Fonti e limiti
- [Manuale ufficiale Fujitsu Q5xx/Q9xx](https://support.ts.fujitsu.com/Search/SWP1094960.asp), pp.16–25, 54–63; [edizione inglese](https://support.ts.fujitsu.com/Search/SWP1094945.asp).
- [Scheda Q520](https://sp.ts.fujitsu.com/dmsp/Publications/public/ds-ESPRIMO-Q520.pdf), dimensioni, massa, orientamento, VESA.
- [Canone C120](../docs/H7_R81_CANONE_2026-11-24.md), [P0.1](../docs/H7_C120_N1_P01_DISTINTA_2026-11-24.md), [P0.2](../docs/H7_C120_N1_P02_MOUNT_2026-11-24.md).
- Identificazione Q510 preferita dal handoff, non certificata. Fotografia originale non presente in questa sessione; vista 3D ricostruita per inviluppo e controlli schematici. Rilievi, CAD foratura, ritenute e termica aperti. Nessuna fabbricazione.

## 7. Evidenza digitale P0.1
- OpenSCAD ha compilato carrier, adattatore B, guide, dima, chassis e riserva cavi.
- Il controllo delle bounding box STL e dei cinque inviluppi ha superato i limiti di studio (vedi check-result.txt).
- Booleano chassis contro carrier/guide/adattatore B, inset 0,05 mm per separare contatti nominali: nessun volume interno rilevato per tutti e quattro i modelli e la dima (collision-result.txt). Il metodo non valuta le zone di contatto reale, le decorazioni frontali schematiche, minuterie non modellate, né prove sotto carico.
- Anteprima 3D generata dalle mesh CAD; la facciata è solamente evocativa, non fotografia o rilievo. Il controllo JavaScript è sintattico.
- Per riprodurre: in questa cartella eseguire `openscad -o dummy.stl -D 'mode="dummy"' n4.scad`, ripetere per carrier/adapter/pc/guides/cables, poi `python check.py`, `python make_preview.py`. I solidi di parti metalliche sono reference mesh, non STL per stampa.
