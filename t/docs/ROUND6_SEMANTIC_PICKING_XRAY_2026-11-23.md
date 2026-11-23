# Round 6 — Raffinamento tecnico, picking semantico, xray e metadati · H-7 FB-1

**Ramo:** `night/torre-geometry-20261123`
**Data:** 2026-11-23
**Stato:** concept non esecutivo. Nessun acquisto, nessuna stampa, nessun collaudo fisico.

## 1. Obiettivo del round
Raffinare i dettagli tecnici e il picking semantico, la visibilità xray e i test del modello;
migliorare i metadati ingegneristici senza appesantire la geometria (nessun nuovo solido).

## 2. Modifiche al renderer (t/assets/viewer.js)
- Scorciatoia tastiera `X` per attivare/disattivare la vista a raggi X (oltre al pulsante).
- Classe `xray-on` su `body` per feedback visivo dell'overlay (testo "VISTA A RAGGI X").
- Rispetto della preferenza `prefers-reduced-motion` (classe `reduce-motion`).
- Mappa `PART_META` con metadati ingegneristici (materiale, massa, stato, da misurare) per i gruppi principali.
- I metadati vengono mostrati nell'ispettore al momento della selezione (campo `part-specific`).
- Filtro di ricerca semantica sopra il selettore componenti (`#part-search`).
- Nessun nuovo box/solido aggiunto: la geometria e i test SAT restano invariati.

## 3. Picking semantico
- Il selettore componenti ora è filtrabile per testo.
- I metadati ingegneristici accompagnano la selezione, distinguendo componenti verificati,
  segnaposto e non misurati.
- Il picking per clic sul canvas resta basato sui gruppi esistenti (nessuna regressione).

## 4. Visibilità X-ray
- Toggle da pulsante e da tastiera (`X`).
- Indicatore visivo nell'overlay quando attivo.
- Nessuna modifica alla logica di opacità esistente (compatibilità con test).

## 5. Metadati ingegneristici
- `PART_META` copre: FBGUIDE, FBCRADLE, FRAME, PCB, SSD, STANDRAIL, UPS, DAS4, HUB4.
- I valori sono segnaposto/concettuali fino a misura reale (vedi MISURE_DA_EFFETTUARE_FB1.md).
- Nessun valore inventato viene presentato come verificato.

## 6. Test
- `t/tests/test_round6_model.py` — controlli statici del round 6.
- Test esistenti invariati: `blundercheck_fb1.py`, `test_geometry.py`, `test_loadpath.py`,
  `test_fb1_guides.py`, `test_motherboard_realities.py`, `test_round5_structural_safety.py`,
  `test_screenshots.py`.

## 7. Rischi irrisolti (invariati)
- Nessun PSU dimensionato o collocato (gate elettrico).
- n1 vero ≠ fantoccio 3D (226 × 175 mm vs 208 × 180 mm).
- Massa totale non riconciliata; limite HAUGA 20 kg.
- Estrazione reale (cavi, mani, deformazioni) non provata.
- Base autonoma non validata strutturalmente.
- Variazione termica reale non misurata.

## 8. Gate
G0–G3 invariati (vedi BLUNDERcheck_FB1_COLLISIONI_2026-11-23.md).
