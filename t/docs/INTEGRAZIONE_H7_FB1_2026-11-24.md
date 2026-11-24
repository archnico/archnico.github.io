# La Torre H-7 — integrazione controllata del 24 novembre 2026

## Origine e strategia

La pubblicazione automatica delle 05:23 è stata sospesa perché l'integratore cercava soltanto riferimenti locali `origin/night/torre-*`, che il fetch predefinito non aveva creato. **Non mancavano i branch remoti**: entrambi erano presenti su GitHub e recuperabili. L'integratore in `~/src/torre-night-integrate-20261123.py` ora tenta anche il fetch esplicito del refspec di ciascun branch; non è stato rieseguito, dato che il limite operativo delle 06:00 era già trascorso.

La revisione manuale è avvenuta in un worktree Git separato, partendo da `main` / `0cdfe0f` e integrando i due branch senza forzature:

- Geometria: `night/torre-geometry-20261123`, `fb17027`.
- Esperienza utente: `night/torre-ux-20261123`, `f7bdc8b8`.

**R-6 Metal-Lite preservata**: i file `r6.html`, `docs/H7_R6_METAL_LITE_2026-11-23.md` e `tests/test_r6_geometry.py` rimangono presenti. Il render FB-1 e la vista geometrica R-6 rimangono proposte distinte, entrambe non esecutive. Nessun dato inventato è stato elevato a quota certificata.

## Correzioni di integrazione

1. Risolto manualmente l'unico conflitto Git nel README, mantenendo le sezioni tecniche e UX.
2. Corretto un crash dell'inizializzazione: la nuova interfaccia non presenta il vecchio bottone `fit`; il vecchio handler era scritto senza controllo dell'esistenza dell'elemento.
3. Corretto il controllo del focus del dialogo Aiuto: il trigger si salva **prima** di spostare il focus sul tasto di chiusura, senza affidarsi a un MutationObserver tardivo.
4. Rimossa la chiamata morta `diskBank()` dalla scena UPS, residuo di una versione con HDD interni, ora incompatibile con H-7 compute + DAS H-4 separato.
5. Rilasciati i blocchi ingegneristici nella sidebar come pannello **chiuso per impostazione predefinita**: l'interfaccia resta navigabile e il NO-GO è consultabile con il pannello o il tasto B.

## QA effettiva sul codice integrato (n0)

- Sintassi `node --check` dei due asset JavaScript: superata.
- `git diff --check`: superato dopo la pulizia di spazi finali in tre documenti.
- Controlli statici: 11 script `test_*.py` di geometria, percorsi di carico, realtà della motherboard e R-6: superati.
- Collisioni Chromium/SAT (`tests/blundercheck_fb1.py`): superate nelle viste Torre, Modulo P1–P7, Retro, Termica e Autonoma, con sweep geometrico verticale di 155 mm, **solo per i box schematici**.
- UX: otto suite R1–R8 eseguite come script Python autonomi; R5 e R7 inizialmente fallite e corrette, poi superate.
- Smoke browser aggiuntivo: desktop 1440×900 e mobile 390×844, dieci scene visitate per viewport, 13 scene nello sweep integrato, **zero errori JavaScript**. Testata anche la pagina R-6 e conservati screenshot di prova su n0.

`pytest` non è installato nell'ambiente n0: i test sono stati avviati direttamente dai rispettivi script, verificando i codici di uscita. Nessuna installazione di pacchetti aggiunta.

## Verifiche che il render non può ancora sostituire

1. Misure reali della motherboard di n1 (ASUS H81M-E circa 226×175 mm nel registro contro il segnaposto 208×180 mm), dei fori, di dissipatori, connettori e PSU; altri donatori da censire.
2. Peso totale completo di sette nodi e strutture, reazioni sui sei appoggi, stabilità e anticaduta; **IKEA HAUGA massimo 20 kg** e ancoraggio a parete.
3. Ingombro di ciascun alimentatore reale, protezione e percorso dei cavi, separazione AC/DC e raggi di curvatura.
4. Resistenza e ferramenta delle guide laterali, oscillazioni, montaggio, estrazione manuale e servizio in condizioni reali.
5. Ventilazione con ventole reali e prove termiche; le icone nel render non definiscono le ventole acquistabili.

**Il risultato è una versione navigabile e geometricamente coerente nei soli ingombri schematici, NON un via libera alla stampa né agli acquisti.**
