# Torre H-7 · UX Round 1 (2026-11-23)

## Obiettivo
Primo passo di miglioramento dell’interfaccia del render interattivo in `t/index.html`, mantenendo intatto il geometry worker `t/assets/viewer.js` e operando solo su CSS, sul nuovo `t/assets/viewer-enhancements.js` e sui test.

## File modificati
- `t/index.html` — caricato `viewer-enhancements.js` dopo `viewer.js`; aggiunti skip-link, menu hamburger, HUD selezione, pannello aiuto, pulsanti fullscreen/focus, hint isolamento.
- `t/assets/viewer.css` — stili per i nuovi controlli, sidebar mobile overlay, focus visivo, reduced motion, contrasto elevato.
- `t/assets/viewer-enhancements.js` — logica UX nuova, indipendente dal worker di geometria.
- `t/tests/ux_enhancements_static.py` — controlli statici su file e riferimenti.
- `t/tests/ux_enhancements_dom.html` — test DOM autonomo dell’enhancement script.
- `t/tests/ux_smoke_playwright.spec.js` — smoke test screenshot-based per Playwright.
- `t/README.md` — documentazione dei nuovi controlli.

## Cosa cambia per l’utente
1. **Sidebar compatta e responsive**: su desktop resta a sinistra; su schermi stretti il menu hamburger la apre come pannello inferiore overlay, chiudendosi automaticamente dopo aver scelto uno strato o una vista.
2. **Selezione isolata**: ogni volta che si seleziona un pezzo (click sul canvas o dal selettore), vengono attivati automaticamente *Semitrasparente* e *Isola selezione*, così il pezzo non scompare dietro le pareti e i dintorni si dissolvono.
3. **HUD selezione**: badge in alto a destra che indica l’elemento selezionato e offre il pulsante **Focus** per centrare e isolare.
4. **Touch**: pinch con due dita per zoomare; doppio tap per focus/isolare.
5. **Tasti rapidi aggiuntivi**: `F` centra, `I` isola, `X` semitrasparente, `L` etichette, `H`/`?` aiuto, `Esc` chiude aiuto/deseleziona. `1`, `2`, `+`, `-`, `R` restano gestiti dal viewer di base.
6. **Pannello aiuto**: elenco dei comandi rapidi accessibile dal pulsante `?`.
7. **Fullscreen** tramite il pulsante ⛶ nella barra rapida.
8. **Accessibilità**: skip-link da tastiera, outline `:focus-visible` visibili, rispetto di `prefers-reduced-motion` e `prefers-contrast`.

## Vincoli rispettati
- `t/assets/viewer.js` **non è stato modificato**.
- Nessuna geometria aggiunta in `viewer-enhancements.js`.
- Nessun claim di fabbricazione, prezzo o hardware non misurato aggiunto.
- UPS rimane unità commerciale separata; nessun PSU fittizio introdotto.

## Test
- `python t/tests/ux_enhancements_static.py` — controlla che i file esistano, che l’enhancement venga caricato dopo viewer.js, che gli elementi richiesti siano presenti e che viewer.js non contenga mutazioni proibite.
- Aprire `t/tests/ux_enhancements_dom.html` in un browser — verifica toggle sidebar, pannello aiuto, HUD e focus selezione.
- `npx playwright test t/tests/ux_smoke_playwright.spec.js` — screenshot smoke tests (richiede Playwright installato).

## Rischi irrisolti / limiti noti
1. **Proiezione 3D non accessibile**: `viewer-enhancements.js` non può accedere alle strutture interne di `viewer.js` (faces, camera, state). L’enfasi sulla selezione avviene solo attivando gli strati *Semitrasparente* / *Isola*; non è possibile disegnare un alone attorno all’oggetto selezionato o spostare la camera direttamente sul bounding box.
2. **Frecce direzionali non implementate**: senza accesso a `state.yaw`/`state.pitch`, non è possibile ruotare la visuale da tastiera in modo fluido; il viewer base gestisce già `R`, `1`, `2`, `+`, `-`.
3. **Performance su dispositivi low-power**: il pinch zoom emula eventi `wheel` e forza ridisegni frequenti; su Samsung Flip/mobile molto lenti potrebbe essere necessario limitare la frequenza degli eventi (throttle non ancora applicato).
4. **Selezione dietro pareti**: l’isolamento automatico riduce l’opacità delle pareti ma non le rimuove; oggetti molto lontani o completamente coperti restano difficili da vedere.
5. **Test screenshot**: richiedono un browser esterno; non sono stati eseguiti automaticamente in questo ambiente.
