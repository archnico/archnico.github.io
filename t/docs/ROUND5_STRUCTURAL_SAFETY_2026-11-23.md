# Round 5 — Structural safety (concept only) · H-7 FB-1

**Ramo:** `night/torre-geometry-20261123`
**Data:** 2026-11-23
**Stato:** concept non esecutivo. Nessun acquisto, nessuna stampa, nessun collaudo fisico.

## 1. Invarianti strutturali ribaditi

- HAUGA 004.150.47: luce nominale 1345 × 330 mm, portata massima piano superiore **20 kg**, ancoraggio a parete **obbligatorio**.
- Nessuna vite aggiuntiva nel mobile: la Torre R-2 si sostiene su telaio indipendente a terra (portale 1470 mm esterno).
- R-3 (massa stimata 17,8 kg) carica il piano HAUGA **solo se** peso effettivo, baricentro e stabilità saranno certificati.
- Variante autonoma a terra (`standalone`) disponibile: stessa H-7, base metallica a terra, nessun mobile.
- Nessun claim di portata/anti-ribaltamento va presentato come collaudato: i valori sono studi.

## 2. Supporti fissi e percorsi di carico

- I montanti laterali fissi (`FBGUIDE`) restano a |u| = 54 mm, fuori dall'involucro PCB 208 × 180 mm e dall'inviluppo di incertezza n1 (~226 × 175 mm).
- Il sostegno apparentemente "attraverso" la motherboard è un'illusione prospettica: la distanza planare minima è ~46,5 mm (locale u ≈ 62,5 mm); nessun solido FBGUIDE interseca la PCB nei test SAT.
- Carico: cartuccia → pattini z = 127 → traversa sotto vano z = 91 → longheroni → rialzo HAUGA (o base a terra).
- Le guide rimangono in sede durante l'estrazione verticale 0–155 mm (verificato SAT).

## 3. Stabilità e anti-ribaltamento (non validati)

- Le quattro ali stabilizzatrici (`STANDPAD`) sono **opzionali** e aumentano il poligono di appoggio, ma non sostituiscono una verifica anti-ribaltamento con carico reale.
- Il portale R-2 ha piedi a pavimento indipendenti; il vincolo a parete è la vera trattenuta dal ribaltamento.
- Il pavimento reale, l'attrito e il livellamento devono essere misurati (vedi MISURE_DA_EFFETTUARE_FB1.md, sezioni 4–5).

## 4. Termica e ventilazione (senza dati misurati)

- Calcolo teorico di portata minima da ΔT ipotizzato (4–15 °C): **non** è una simulazione CFD né una verifica termica.
- Sei icone 67 mm sono segnaposto: nessun HDD in H-7; una ventola ARCTIC P14 140 mm non entra in una cartuccia larga 92 mm.
- Le ventole reali, la portata CFM e il consumo 12 V devono essere scelti da datasheet (G1).

## 5. UX e prestazioni

- Banner di sicurezza concettuale aggiunto in `index.html`.
- Nuovo `t/assets/viewer-enhancements.js` per miglioramenti UX a basso impatto (caricamento differito, non modifica la geometria).
- Rendering ottimizzato per dispositivi a bassa potenza: nessuna modifica alla geometria, solo overlay leggeri.

## 6. Test eseguiti / da eseguire

- `t/tests/blundercheck_fb1.py` — SAT completo su tower, module (×7), rear, thermal, standalone.
- `t/tests/test_geometry.py`, `test_loadpath.py`, `test_fb1_guides.py`, `test_motherboard_realities.py`.
- `t/tests/test_screenshots.py` — smoke headless Chromium su tutte le scene.
- Nuovo `t/tests/test_round5_structural_safety.py` — controlli statici Round 5.

## 7. Rischi irrisolti

- Nessun PSU dimensionato o collocato (gate elettrico).
- n1 vero ≠ fantoccio 3D (226 × 175 mm vs 208 × 180 mm).
- Massa totale non riconciliata; limite HAUGA 20 kg.
- Estrazione reale (cavi, mani, deformazioni) non provata.
- Base autonoma non validata strutturalmente.
- Variazione termica reale non misurata.
