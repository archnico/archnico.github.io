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
