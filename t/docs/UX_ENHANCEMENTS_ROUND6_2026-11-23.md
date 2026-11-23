# Interfaccia R-6 (UX) — polish visivo e densità tecnica

Data: 23 novembre 2026.

Round 6 affina l'interfaccia senza toccare il geometry worker `assets/viewer.js`.

* **Menu compatto**: sidebar con classe `compact`, righe più dense, gruppi annidati e comando «Tutti» per capitolo/sottogruppo.
* **Ispezione geometria**: pulsante `Ispezione geometria` (e scorciatoia `G`) attiva quote, griglia e ingombri; bordo ambra segnala vista filtrata. Aliasi JS: `window.towerGeometryInspection`, `window.towerGeometryInspect`, `window.towerInspect`.
* **Densità tecnica**: blocco `#tech-details` nell'inspector con selezione attiva e nota su misure marcate `≈`.
* **Misure non risolte**: il marcatore `≈` resta visibile accanto agli strati con componenti o quote da verificare; dettagli nel README e nei documenti di ingegneria.
* **Selezione sempre visibile**: isolate + semitrasparente automatici, HUD e inspector mantengono il focus; nessuna scomparsa dietro le pareti.
* **Prestazioni mobile**: riduzione blur/animazioni su schermi stretti, target tattili ≥44 px.
* **Test**: `tests/test_ux_r6.py` e `tests/ux_r6_dom.html`.

Nessuna geometria nuova, nessun prezzo, nessuna approvazione alla costruzione.