# Interfaccia R-7 (UX) — regressione scene/strati e tooltip

Data: 23 novembre 2026.

Round 7 consolida l'interfaccia senza toccare `assets/viewer.js`:

* **Regression sweep**: `window.towerRegressionSweep()` prova tutte le scene, i gruppi e i singoli strati, poi una selezione e i tooltip; gli errori vengono raccolti in `window.towerConsoleErrors`.
* **Helper sicuri**: `window.towerScene`, `window.towerView`, `window.towerLayer`, `window.towerCamera`, `window.towerTooltip` evitano eccezioni non gestite.
* **Riferimenti visivi**: parametri URL `reference`, `scene`, `view`, `tooltip` per catture riproducibili; screenshot smoke test su tutte le scene.
* **Tooltip**: il tooltip `#tooltip` resta leggibile in screenshot/reference e su schermi stretti.
* **Test**: `tests/test_ux_r7.py` e `tests/ux_r7_dom.html`.

Nessuna geometria nuova, nessun prezzo, nessuna approvazione alla costruzione.