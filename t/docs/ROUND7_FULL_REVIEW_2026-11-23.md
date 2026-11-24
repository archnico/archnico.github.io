# Round 7 — Full second-order review (23 novembre 2026)

## Scopo
Revisione di secondo ordine del render FB-1: tutte le scene, regressione storica, casi di confine e rotazione, blocchi ingegneristici in evidenza in UI e documentazione.

## Scene verificate dal test SAT
- `tower`, `module` (7 vani), `rear`, `thermal`, `standalone`: nessuna intersezione rigida non voluta tra box.
- Estrazione verticale 0..155 mm per un modulo alla volta: sweep pulito in tutte le scene auditate.

## Regressione storica (R5 vs FB-1)
- R5 usa 25° / passo 108 mm e busta donatore 80×251 mm: NON intercambiabile con FB-1 (42° / passo 164 mm / cartuccia 92×284 mm).
- FB-1 resta il canone; R5 solo storico.

## Casi di confine e rotazione
- Spaziatura perpendicolare tra assi vano: 121,88 mm.
- Guida fissa a |u|=54 mm, gioco nominale 4 mm/lato; distanza tra guide fisse contigue: 7,88 mm (stretto).
- Envelope scheda illustrativa 208×180 mm; incertezza n1 reale ~226×175 mm (box tratteggiato).
- Montanti fissi a |u|=54 mm, fuori dal volume PCB (minima distanza planare ~62,5 mm).
- HAUGA: sagoma 1310×318 mm su luce nominale 1345×330 mm → 17,5 mm testate, 6 mm fronte/retro.

## Blocchi ingegneristici (NO-GO)
1. PSU non collocato: nessun volume inventato; alimentazione da rilevare per ogni donatore.
2. n1 reale non rilevato: fori, dissipatore, RAM, connettori.
3. Massa non riconciliata; HAUGA max 20 kg + ancoraggio a parete.
4. Guide strette per viti/utensili; ritenuta reale mancante.
5. Ventole 67 mm segnaposto; P14 140 mm non entra in 92 mm.
6. Cavi irrisolti: solo linea tratteggiata non solida.
7. Estrazione ideale: esclusi cavi, mani, inclinazioni, deformazioni.
8. Margine HAUGA minimo: tolleranze non rilevate.
9. Struttura non dimensionata: flessione, torsione, anti-ribaltamento.
10. Variante a pavimento: solo concept grafico.

## UI
- Pannello "BLOCCHI INGEGNERISTICI (NO-GO)" in evidenza nella colonna sinistra.
- Scorciatoia tastiera `B` per aprire/chiudere il pannello.

## Test
- `t/tests/blundercheck_fb1.py`: SAT su scene e sweep.
- `t/tests/test_geometry.py`: costanti e spaziature.
- `t/tests/test_round5_structural_safety.py`, `test_round6_model.py`, `test_round7_review.py`.

## Limiti
Questo render resta un concept, non un CAD esecutivo né un piano di fabbricazione. Nessuna validazione meccanica, termica o elettrica è stata eseguita.
