# Interfaccia R-8 (UX) — audit visivo finale e note per la prossima mattina

Data: 23 novembre 2026.

Round 8 chiude il giro notturno dell'interfaccia senza toccare `assets/viewer.js`:

* **Audit visivo finale**: `window.towerVisualAudit()` (alias `window.towerAudit`, `window.towerFinalAudit`, `window.towerVisualAuditRun`) esegue una checklist non distruttiva su console pulita, elementi base, strati, marcatori di misure da verificare, chip di blocco ingegneristici, wording non approvativo, helper screenshot/ispezione/regressione. Attivabile anche con `?audit=1` (classe `visual-audit-mode`).
* **Note per la prossima mattina**: `window.towerFeatureNotes()` (alias `window.towerMorningNotes`, `window.towerNextMorningNotes`) restituisce l'elenco compatto delle funzioni UX già presenti, da usare come base per il lavoro successivo.
* **Nessun testo in più nell'interfaccia**: l'audit resta in console/helper e non aggiunge pannelli o etichette permanenti al canvas.
* **Compatibilità**: mantiene tutti i controlli R-1…R-7, gli screenshot smoke e il regression sweep.
* **Test aggiuntivi**: `tests/test_ux_r8.py` e `tests/ux_r8_dom.html`.

Nessuna geometria nuova, nessun prezzo, nessuna approvazione alla costruzione. Il modello resta un'ipotesi grafica FB-1 a 42° con passo 164 mm, da verificare con hardware reale.