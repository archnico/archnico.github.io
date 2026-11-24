# Torre H-7 · UX enhancements Round 2 (2026-11-23)

## Goal

Migliorare l’anteprima interattiva di `t/index.html` senza toccare il geometry worker `t/assets/viewer.js`. Questo passo si concentra su:

* navigazione a preset di camera prevedibile;
* sidebar compatta con sottogruppi annidati e "Tutti" per ogni livello;
* controlli accessibili, responsive e leggeri su dispositivi low-power;
* test DOM e screenshot.

## Files changed

* `t/index.html` — struttura della sidebar, preset di camera, `#focus-hint`.
* `t/assets/viewer.css` — stili per sottogruppi, preset attivi, responsive.
* `t/assets/viewer-enhancements.js` — logica sottogruppi, preset di camera, esposizione `window.towerCameraPreset` per i test.
* `t/tests/test_ux_r2.py` — nuovi smoke test DOM + screenshot.
* `t/tests/ux_enhancements_static.py` — controlli statici estesi.
* `t/README.md` — documentazione dei cambiamenti.

## Preset di camera

I pulsanti `data-cam-preset` azionano i comandi di scena/vista già presenti in `viewer.js`, quindi mantengono il framing e lo zoom definiti dal modello:

* `room`, `tower`, `cabinet`, `standalone` — cambiano scena.
* `side`, `rear`, `top` — cambiano orientamento della camera nella scena corrente.
* `fit` — richiama il pulsante di centro esistente.

Nessuna geometria è stata alterata; i preset sono solo un livello UI sopra `viewer.js`.

## Sottogruppi annidati

Ogni capitolo può contenere `<details class="layer-subgroup">` con un proprio `data-subgroup-toggle`. `viewer-enhancements.js` mappa ogni sottogruppo ai suoi `data-layer` e simula il click sui singoli interruttori, sincronizzando lo stato visivo "Tutti".

## Selezione e pareti

Quando si seleziona un componente, lo script attiva automaticamente gli strati *Semitrasparente* e *Isola selezione* in modo che il pezzo evidenziato non venga occultato dalle pareti della stanza. Il messaggio `#focus-hint` spiega il comportamento senza appesantire l’interfaccia.

## Low-power / mobile

Il renderer rimane un canvas 2D con painter’s algorithm; i controlli usano CSS semplice, nessuna animazione continua. Su schermi stretti il pannello laterale diventa un pannello inferiore scorrevole e i pulsanti rapidi rimangono a dimensione tattile.

## Tests

* `python3 t/tests/ux_enhancements_static.py` — verifica esistenza file, ordine di caricamento, elementi richiesti, assenza di mutazione geometrica in `viewer-enhancements.js`.
* `python3 t/tests/test_ux_r1.py` — interazioni DOM e screenshot R1.
* `python3 t/tests/test_ux_r2.py` — preset di camera, sottogruppi, screenshot aggiuntivi.
* `python3 t/tests/blundercheck_fb1.py` — audit geometrico FB-1 (non tocca UI).
* `npx playwright test t/tests/ux_smoke_playwright.spec.js` — smoke test Playwright.

## Unresolved risks

* I preset di camera dipendono dai framing fissi e dall’auto-fit di `viewer.js`; se il modello cambia, i framing potrebbero dover essere ricalibrati lato geometry worker.
* Su dispositivi molto lenti il canvas 2D può ancora scattare nelle scene complesse (stanza con tutti gli strati attivi); in tal caso si può ridurre la viewport o disattivare pareti/mobilio.
* Il sort delle facce della stanza mantiene le pareti sullo sfondo, ma oggetti molto vicini a una parete potrebbero richiedere un ulteriore aggiustamento del painter’s order nel geometry worker.
