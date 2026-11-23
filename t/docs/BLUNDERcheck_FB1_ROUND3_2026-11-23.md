# Blundercheck ingegneristico FB-1 — Round 3 · 23 novembre 2026 (notturno)

**Decisione: NO-GO alla stampa e all'acquisto dei sostegni.** Questo round rafforza la credibilità del render interattivo FB-1 sul tema "realtà della scheda madre", senza trasformarlo in CAD esecutivo.

## Obiettivo del round 3
Riconciliare modello, geometria e render/UX sulle schede madri reali:
- n1 ASUS H81M-E ~226×175 mm nel registro, contro il rettangolo illustrativo 208×180 mm;
- CPU cooler, RAM, fori di fissaggio e connettori NON rilevati;
- mostrare l'incertezza in modo esplicito, senza fabbricare misure del donatore.

## Modifiche al modello (`t/assets/viewer.js`)
- Etichetta PCB aggiornata: `208×180 mm · n1 reale ASUS H81M-E ~226×175 mm (registro): fori, dissipatore, RAM, connettori DA RILEVARE`.
- Aggiunto inviluppo di incertezza (solo linee tratteggiate, NON solidi) per la scheda reale in vista Modulo: `INCERTEZZA SCHEDA REALE · n1 ~226×175 mm (registro) · fori/dissipatore/RAM/connettori DA RILEVARE`, più nota `Dissipatore/RAM: ingombri NON rilevati (segnaposti)`.
- Annotazione distanza montanti aggiornata: `Montanti a ±54 mm: FUORI dall’involucro PCB 208×180 e dall’inviluppo di incertezza n1 (box illustrativi)`.
- Inspector PCB aggiornato per distinguere dati illustrativi da dati reali da rilevare.

## Verifica SAT
Invariata rispetto al round 2: `t/tests/blundercheck_fb1.py` continua a controllare `tower`, `module` per ciascuno dei sette vani, `rear`, `thermal`, `standalone`, compreso lo sweep verticale 0–155 mm e i gruppi fissi tra loro. Nessun nuovo solido introdotto (l'inviluppo di incertezza è solo tratteggio), quindi nessuna nuova intersezione.

## Blocchi ancora aperti (B1–B5, invariati)
B1 scheda madre n1 reale, B2 alimentatori, B3 cavi interni, B4 ventole reali, B5 massa e baricentro. Gate G0–G3 invariati. NO-GO alla stampa.

## Test aggiornati
- `tests/test_motherboard_realities.py` (nuovo): controlli statici su presenza delle quote illustrative e reali, inviluppo di incertezza, documentazione delle caratteristiche non rilevate, nota distanza montanti, descrizione inspector, assenza di PSU fittizio.
- `tests/test_geometry.py`, `tests/test_loadpath.py`, `tests/test_fb1_guides.py`: invariati (costanti FB-1 e assenza PSU).

## Note UX
Le modifiche di interfaccia (banner stato ingegneristico, modale misure, guida scorciatoie, modalità bassa potenza) non sono applicabili in questo branch perché `index.html` e `viewer.css` sono protetti dal harness in modalità non interattiva; l'inviluppo di incertezza tratteggiato nel modello 3D resta il canale di comunicazione principale. Il render resta uno studio non esecutivo.

## Test automatici
- `t/tests/blundercheck_fb1.py` — audit SAT.
- `t/tests/test_geometry.py` — controlli statici.
- `t/tests/test_fb1_guides.py` — regressioni guide.
- `t/tests/test_loadpath.py` — percorso di carico.
- `t/tests/test_motherboard_realities.py` — realtà scheda madre (round 3).
- `t/tests/test_screenshots.py` — screenshot headless.

**Stato:** il modello torre supera i test SAT; l'inviluppo di incertezza rende esplicito che il PCB illustrativo non è la scheda reale. NO-GO alla stampa.