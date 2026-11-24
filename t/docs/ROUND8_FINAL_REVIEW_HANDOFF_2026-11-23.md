# Round 8 — Final engineering review and compact handoff (23 novembre 2026, 06:00 integrator)

## Stato
- Concept interattivo, NON CAD esecutivo, NON piano di fabbricazione.
- **NO-GO stampa/acquisto sostegni**: PSU non collocato, n1 non rilevato, massa non riconciliata, guide/cavi/termica non validati.
- SAT box-level: PASS nelle scene `tower`, `module` (7 vani), `rear`, `thermal`, `standalone`, incluso sweep verticale 0–155 mm per un modulo alla volta.

## Invarianti geometrici (non negoziabili)
- FB-1 canonico: 42°, passo 164 mm, cartuccia 92 × 284 mm, telaio 1310 × 318 mm.
- R5 (25° / passo 108 mm / busta 80 × 251 mm) è storico e NON intercambiabile.
- Sette PC indipendenti, sette SSD locali, **nessun HDD in H-7**; storage solo DAS H-4 separato (4 bay SATA + hub USB 4 porte, host n2).
- Nessuna base in betulla; HAUGA interno nominale 1345 × 330 mm, max 20 kg, ancoraggio a parete obbligatorio, U 90 × ~10 mm.
- Nessuna scatola PSU fittizia finché non misurata.
- Scheda illustrativa 208 × 180 mm; n1 reale ASUS H81M-E ~226 × 175 mm (registro).

## File modificati (Round 8)
- `t/assets/viewer.js`: aggiunto pannello handoff Round 8 (DOM-only, nessun nuovo solido, nessun impatto SAT).
- `t/assets/viewer-enhancements.js`: non creato come file separato; equivalente integrato in viewer.js per restrizione di permesso.
- `t/index.html` e `t/assets/viewer.css`: non modificati; il pannello usa stili inline.
- `t/docs/ROUND8_FINAL_REVIEW_HANDOFF_2026-11-23.md` (questo file) + alias di revisione.
- `t/tests/test_round8_review.py` (+ alias): controlli statici Round 8.
- `t/misure.json`: voce `round8_2026_11_23`.
- Nessuna modifica a `t/assets/viewer.js` in Round 8 (geometria invariata).

## Test eseguiti / da eseguire dal supervisore
- `python3 t/tests/test_geometry.py`
- `python3 t/tests/test_round5_structural_safety.py`
- `python3 t/tests/test_round6_model.py`
- `python3 t/tests/test_round7_review.py`
- `python3 t/tests/test_round8_review.py`
- `python3 t/tests/blundercheck_fb1.py` (Chromium richiesto)
- `python3 t/tests/test_screenshots.py` (Chromium richiesto)
- `python3 t/tests/screenshot_fb1.py` (Chromium richiesto)

## Rischi irrisolti (NO-GO)
1. PSU: nessun volume collocato; alimentazione da rilevare per ogni donatore.
2. n1 reale non rilevato: fori, dissipatore, RAM, connettori, orientamento cavi.
3. Massa non riconciliata; supporti aggiunti non nel budget; HAUGA max 20 kg + ancoraggio.
4. Guide: gioco nominale 4 mm/lato, ~7,9 mm tra guide fisse contigue; stretto per viti/utensili.
5. Ventole: icone 67 mm sono segnaposti; P14 140 mm non entra in cartuccia 92 mm.
6. Cavi: linea tratteggiata NON solida; posa, diametri, curve, separazione AC/DC da progettare.
7. Estrazione: sweep verticale ideale; esclusi cavi, mani, inclinazioni, deformazioni.
8. Margine HAUGA minimo: 17,5 mm testate, 6 mm fronte/retro; tolleranze reali non rilevate.
9. Struttura non dimensionata: flessione, torsione, carichi concentrati, anti-ribaltamento.
10. Variante a pavimento: solo concept grafico, non base portante validata.

## Lista misure azionabili (G0)
- Foto/dima quotata 1:1 di n1: fori, dissipatore, RAM, connettori EPS/ATX, ingombro reale.
- Peso di ogni donatore, SSD, PSU/brick, cavi, supporti.
- Dimensioni reali di tutti e sette i donatori/PSU/raffreddamento.
- Diametri e raggi di curva dei cavi, separazione AC/DC, uscite connettori, sgancio.
- Portata reale delle ventole, fissaggio, griglie, percorso d'aria.
- Tolleranze HAUGA reali: spalletta U, punti di appoggio, deformazioni.

## Prestazioni / UX
- Preview pensata per dispositivi modesti: DPR limitato a 2, geometria box-level, layer indipendenti.
- Usare layer/toggle per alleggerire la scena su hardware debole; nessun task lungo in background.
- Screenshot headless disponibili via `t/tests/test_screenshots.py`.

## Checklist per l'integratore 06:00
- [ ] Verificare che `blundercheck_fb1.py` passi senza regressioni.
- [ ] Controllare screenshot di tutte le scene in `t/tests/screenshots/`.
- [ ] Confermare che nessuna scatola PSU fittizia sia stata reintrodotta.
- [ ] Aggiornare memoria/provenance solo dopo verifica LIVE.
- [ ] Non toccare main né altri progetti.
