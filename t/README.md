# Torre H-9 — anteprima 3D pubblica

**Link canonico:** https://archnico.github.io/t/

**Sorgente:** `t/index.html` nel repository pubblico `archnico/archnico.github.io` (branch `main`).

**Versione corrente:** **v1.1 — 21 novembre 2026**

## Canone di pubblicazione

Ogni modifica approvata dell'anteprima HTML va salvata direttamente in `t/index.html` con un commit; il link pubblico rimane invariato. GitHub Pages pubblica il branch `main`. Dopo il deploy controllare la versione effettivamente raggiungibile. Non sostituire la homepage del repository e non aggiungere dipendenze esterne per il viewer.

## Canone meccanico

Torre orizzontale, sette cassetti PC più due baie libere polivalenti, **tutte le cornici uguali 80 × 280 × 280 mm nominali**; per ogni scheda varia unicamente l'inserto donor-specific. Moduli estraibili verso l'alto a cavi scollegati, dischi laterali e servizi posteriori.

La **v1.1** aggiunge appoggi distribuiti (luce massima nominale 192 mm), controventi inferiori e posteriori, giunti stampabili con piastre e M4, saette dei cassetti, ritegni anti-sollevamento e punti di ancoraggio dei servizi. Sono **disegni e verifiche preliminari, non STL esecutivi**.

- **Relazione:** [Verifica preliminare di rigidità](rigidita.md).
- **Calcoli riproducibili:** [rigidita_test.py](rigidita_test.py).

**Cosa manca prima della stampa definitiva:** prove sui giunti stampati, torsione, creep e calore, dimensioni e fori dei donor, flussi d'aria, baricentro, montaggi GPU, compatibilità PSU e protezione elettrica.

## v0.8 — note meccaniche ancora da validare
- Ingombro nominale nel modello H-9: 1220 × 429 × 334 mm; passo identico di 96 mm per sette moduli PC e due vani universali S8/S9. Sono quote concettuali, non CAD dimensionato per la produzione.
- La motherboard ha una sottostruttura stampata con due diagonali continue, quattro puntoni di trasferimento verso la cartuccia e sei distanziatori metallici M3 10 mm esemplificativi. I fori vanno rilevati sui donor reali.
- Il carico della cartuccia si scarica nelle due sedi inferiori a U e nei longheroni di base; NON sullo schienale.
- Il retro elimina i controventi alti davanti ai connettori: triangolazione bassa a z inferiore a 112 mm, fascia I/O indicativa z 118–238 mm, montanti sui confini delle campate e collegamento superiore a z~309 mm.
- Nessuna prova a carico, interferenza cavi o verifica termo-meccanica/rigidezza è ancora attestata; il rendering non va trattato come STL esecutivo.

## v0.9 — guida e stabilità (21 novembre 2026)

- Due stazioni guida per cassetto (fronte + retro), ognuna con due guance laterali fisse. Apertura nominale 12 mm attorno a montante mobile 8 mm: 2 mm per lato, ipotesi da validare con stampa reale.
- Guide alte circa z=191–288 mm, collegate a due traverse superiori **esterne al corpo mobile**: davanti y=56–67 mm, dietro y=332–343 mm. Corpo cartuccia y=74–323 mm. Percorso di estrazione aperto verso l'alto.
- Traverse superiori segmentate da 96 mm con giunti da verificare a flessione/taglio, montanti nei confini ogni tre campate; non confondere la continuità grafica con quella strutturale.
- Ogni cartuccia con due sedi U inferiori e traversini di trasferimento alle longherine e alla base; costole stampate di rinforzo delle linguette.
- Due fermi anti-lift (davanti e dietro) rappresentati con gioco verticale nominale 4 mm. Demo: estrazione bloccata finché i fermi non sono sbloccati. Resta necessario scollegare sempre alimentazione e cavi dati prima di ogni estrazione.
- Una coppia di piedini aggiuntivi a centro lunghezza, collegati da una traversa trasversale e rialzi dal piede alle travi di base.
- In S8/S9 le guide e le sedi FISSE restano identiche agli altri vani: sono variabili soltanto gli inserti mobili GPU/telefoni.
- Verificati: parser JavaScript, test Playwright per vista torre, retro, guide, estrazione bloccata/sbloccata, configurazioni H7/H9, layout desktop/tablet/mobile; niente errori JS.
- **Non verificati:** portata, fatica, svergolamento reale, vibrazioni, stabilità con cablaggi reali, temperatura, tolleranze, giunti, dimensioni e ingombri dei donor reali. Il 3D NON costituisce certificazione né file pronto per stampa.

## v1.0 — UPS laterale indipendente (21 novembre 2026)

**Candidato, NON acquistato:** PowerWalker VI 1500 CSW IEC, produttore SKU **10121124**. Line-interactive AVR, sinusoidale pura in batteria, **1500 VA / 900 W**, USB HID, **8 IEC C13 = 4 battery-backed + 4 surge-only**. Dati fisici **99 mm larghezza × 410 mm profondità × 280 mm altezza; 13,1 kg** (fonti: PowerWalker e rivenditori). Prezzi indicativi sotto €300, disponibilità commerciale da ricontrollare al momento dell'ordine.

**Policy meccanica**: UPS commerciale integro, verticale, indipendente dalla struttura stampata. Non sfrutta S8/S9 (sempre universali GPU/telefoni). Posizionato **accanto al lato destro** oltre i due banchi dischi, appoggiato direttamente su pavimento/piano portante. Nessuna mensola in plastica che regga 13,1 kg; i riscontri stampati ai quattro spigoli sono solo guide di posizionamento. Niente cabinet, pannelli, ventilazione coperta o manomissione del 230 V.

**Quote di studio in mm H-9**: corpo preesistente **1220 × 429 × 334**. UPS con lato vicino a x=1286 rispetto a fine struttura x=1220 (**66 mm** nominali di intercapedine libera), y=8..418, z=3..283. Riserva di 200 mm in più di lunghezza per la postazione UPS (ingombro convenzionale **1420 mm**). Corridoio posteriore di cablaggio libero fino a y≈535 (profondità del piazzamento comprensiva della riserva **circa 535 mm**, da verificare fisicamente). Zona frontale libera per sportello batteria e LCD. **I 66 e ~117 mm non sono distanze prescritte dal costruttore**, ma scelte preliminari da controllare sul manuale del modello acquistato.

**Policy elettrica**: 4 uscite in continuità per host/router/switch prioritari da definire con misuratore di consumo, non tutti i 7 PC; altre 4 contro sole sovratensioni. Non promettere 900 W continui in sicurezza pratica: serve margine di autonomia e gestione degli spunti. La barra nel browser è soltanto simulazione (valore iniziale 450 W); NON è telemetria. USB HID via NUT per spegnimento ordinato quando realmente installato. I cavi AC vanno acquistati certificati, senza collegamenti 230 V DIY o "bus" stampato; separare cavi di segnale e rete, usare scarico trazione.

**Test eseguiti in sviluppo**: sintassi JS con node, browser Chromium/Playwright desktop 1600×1000, tablet 880×720, mobile 390×780; scena UPS, vista torre, nascondi/mostra UPS, carico simulato, H7/H9 e inspector al clic senza errori JS. **Non eseguiti:** carichi veri, termografia, runtime reale, dimensionamento giunti e alimentazione degli altri nodi.

Fonti: https://powerwalker.com/product/10121124/ ; https://www.powerwalker-ups.it/it/home/interactive/gruppo-di-continuita-line-interactive-powerwalker-vi-1500-csw-con-8-prese-iec.1.35.163.gp.4448.uw .

## v1.1.1 — Fix vista Angolo stanza (21 novembre 2026)
- Riparato crash JavaScript `ReferenceError: rotBox is not defined`: implementati `rotBox` e `polyPrism` per gli oggetti ruotati a 45 gradi.
- Scrivania modellata con piano sottile, quattro gambe e fasce portanti, non più parallelepipedo pieno.
- Tre monitor distribuiti lungo l'arco della postazione (Acer VGA 442 mm; terzo monitor intermedio **stimato** 590 mm; HDMI ~740 mm **ipotizzato**, non verificato su fotografia).
- Subwoofer stimato spostato a pavimento; cassettiera, stampante Brother HL-1110, router e ripiano rappresentati con dimensioni indicative. Misure stanza NON rilevate in loco.
- Vista semitrasparente selezionabile, pannello di dettaglio al clic per ogni elemento modellato. Non pubblicate le foto originali private della stanza.
- Test locale Chromium/Playwright eseguito su desktop 1550×900, tablet 850×720 e mobile 390×780: tutte le 8 scene caricate, console senza errori; selezione monitor centrale, rotazione e zoom verificati.
- Modello della sedia gaming da ordini Amazon non disponibile: segnaposto dimensionale, NON attribuito a un ordine identificato.

## v1.3 — stanza ottagonale: smusso ridotto, tre schermi su muro (21 novembre 2026)
- L'angolo pieno era sovradimensionato nella v1.2: **ridotto da 860 mm a 350 mm per ciascun lato** come *ipotesi provvisoria*, con parete diagonale risultante di circa 495 mm. Stanza esterna stimata 4300×4300 mm, perimetro ottagonale schematizzato, non rilievo reale.
- Schermi **tutti montati a parete** e **nessuno sulla scrivania**: VGA Acer V193W (~442 mm), principale HDMI (~740 mm ipotetici) e intermedio (~590 mm ipotetici). Angolo di visione a tre monitor attorno all'operatore con tavolo diagonale a circa 45 gradi.
- Tre staffe/bracci VESA articolati, selezionabili al clic per singolo ancoraggio: sinistro sulla parete laterale, destro sulla parete posteriore, centrale sul breve tratto diagonale. Geometrie dei bracci indicative; occorre verificare VESA, sbraccio, pesi degli schermi, materiale e capacità portante delle pareti. **Non perforare né usare il tratto diagonale come portante senza verifica**, perché potrebbe essere tamponamento leggero.
- Mobile bianco e dispositivi spostati lungo parete sinistra, zona sedia libera; spazio di progetto riservato (1590×630 mm) per futura Torre+UPS a pavimento, non ancora verificato con ingombri reali di passaggio.
- Aggiunte due viste complementari: **Angolo stanza** (perimetro ottagonale) e **Bracci a muro** (dettaglio). Pavimento realmente sagomato nel digital twin, no falso quadrato sotto gli angoli tagliati.
- Corretto hit-test: in vista semitrasparente le pareti non devono coprire la selezione dei mobili e dei bracci visibili; pareti/pavimento selezionabili soltanto se nessun altro oggetto è in primo piano.
- Test Chromium/Playwright con sintassi JS e 9 scene su desktop 1500×950 e mobile 390×780, 0 errori; selezione del terzo monitor e del braccio centrale verificata.
- Il modello è **concept non certificato**, nessun nuovo componente è stato acquistato, nessuna fotografia privata dell'angolo PC è stata caricata nel repo pubblico.

## v1.6 — una sola Torre H-9 sul mobile bianco (21 novembre 2026)

**Layout stanza**: ottagono schematico ingombro 4300×4300 mm, smussi da 350 mm (ipotesi). Torre H-9 **una sola**, il modello meccanico originario in scala 1:1 (7 PC + 2 bay riconfigurabili), riportato sulla superficie del mobile bianco. Rimosso il parallelepipedo del vecchio PC tower a pavimento e rimossa la piazzola vuota che simulava una seconda Torre.

**Quote nominali**: mobile bianco 1500 L × 320 P × 500 H mm (stima foto, non misura diretta); torre 1220 L × 429 P × 334 H mm, base inserita nella stanza ruotata di 90° per seguire la lunghezza del mobile. Piattaforma concettuale 1320 L × 450 P × 18 spessore mm, centrata sul mobile: sbalzo 65 mm davanti e dietro, 6 riscontri di appoggio con rialzo nominale 26 mm e 3 traverse inferiori. Bordini del mobile **posteriore e laterali** 16 mm di altezza *ipotizzata*, non misurata. Torre sopra la piattaforma a z=544 mm (complessivamente altezza ~878 mm da pavimento, esclusa estrazione). I piedi effettivi della Torre cadono in parte fuori dalla profondità originale di 320 mm: le sole parti stampate NON costituiscono una soluzione sicura. **Prima del montaggio: misurare bordini e top, identificare l'intelaiatura portante del mobile, stimare/pesare massa totale, progettare traversi adeguati e ritenuta antiribaltamento, test carico e flessione della piattaforma, accesso cavi e corsa d'estrazione.** Preferire piattaforma rinforzata in legno/metallo dimensionata da prova rispetto a stampa 3D portante non verificata.

**UPS** PowerWalker VI 1500 CSW IEC (candidato non acquistato) separato e verticale a pavimento accanto alla Torre, ingombro reale 99×410×280 mm e 13,1 kg; non viene portato dal mobile bianco.

**Parete destra della scrivania**: mobile multilivello 520 lungo parete × 340 profondo mm con stampante Brother HL-1110, modem e parte impianto audio; cassettiera scura autonoma 400 lungo parete × 260 profondo mm; subwoofer a terra 260 lungo parete × 180 profondo mm. Queste misure degli arredi sono stime, non rilievi verificati. Nessun altro PC desktop a pavimento nella scena.

**Monitor** tre schermi esclusivamente su bracci a muro. In pianta, le sagome esterne 2D hanno distanza minima simulata circa 19 mm (VGA↔HDMI) e 15 mm (HDMI↔intermedio), senza intersezioni; da verificare in 3D per sbracci, peso, attacco VESA, vibrazioni e capacità portante della parete diagonale. La piccola parete smussata resta una ipotesi materiale: non autorizza perforazioni.

**UI/test**: nuova vista `Torre sul mobile` separata da `Angolo stanza` e `Bracci a muro`; i componenti individuali della Torre restano cliccabili, così come mobile, bordini, piastra e UPS. Verificati parser JS, Chromium/Playwright con 10 scene su desktop 1550×950 e mobile 390×800, zero errori runtime; clic testati su mobile, UPS e modulo adattatore A5. Foto della casa private, mai committate nel repository pubblico.
