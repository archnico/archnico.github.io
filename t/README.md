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
