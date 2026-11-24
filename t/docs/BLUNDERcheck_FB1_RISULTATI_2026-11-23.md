# Blundercheck FB-1 — Risultati e rischi residui · 23 novembre 2026

**Stato:** audit Round 1 completato sul ramo `night/torre-geometry-20261123`.
**Decisione:** NO-GO alla stampa e all'acquisto dei sostegni. Il modello è più coerente, ma resta un concept grafico, non un CAD esecutivo.

## Cosa è stato verificato

Il test riproducibile `tests/blundercheck_fb1.py` avvia Chromium e intercetta i box realmente generati dal medesimo JavaScript dell'anteprima. Applica il Separating Axis Theorem ai rettangoli anche ruotati e agli intervalli verticali; controlla:

1. **Scene:** `tower`, `module` per ogni vano, `standalone`, `rear`, `thermal`.
2. **Estrazione:** sollevamento verticale ideale di 155 mm di un modulo per volta, con tutti gli altri fermi.
3. **Collisioni:** schede madri vs sostegni fissi, SSD vs fiancate mobili, pezzi mobili vs supporti fissi.
4. **NO PSU fittizio:** nessun box con nome che inizi per "Alimentatore" / "PSU" / "power supply" in nessuna scena.

Il modello corretto presenta **271 box geometrici** nella scena `tower`. Nei controlli mirati non si rilevano intersezioni rigide non volute. Questo esito vale soltanto per i box illustrativi: non comprende le forme reali dei donatori, dissipatori, viti, connettori, flessione, moto non verticale o cavi.

## Modifiche apportate in questa sessione

- `assets/viewer.js`
  - Refactor: estratta `fishboneCartridge(i, detail)` dalla `fishboneTower()` per riusare la geometria FB-1 anche nella vista modulo.
  - Nuova `fbModuleDetail(i)` che mostra una cartuccia isolata con il proprio involucro di clearance PCB+cavi e l'inviluppo di estrazione verticale.
  - Rimosso il vecchio codice morto `module()` e i suoi helper (sedile a U, linguette, controventi alti, pannello I/O legacy).
  - Rimosso il box PSU fittizio che si trovava nel codice morto `module()` ("Alimentatore commerciale individuale").
  - La scena `module` ora usa `fbModuleDetail()` invece di `fishboneTower(state.focusIndex)`.
- `tests/blundercheck_fb1.py`
  - Generalizzata la registrazione per accettare scena, focus, modulo sollevato, esplosione.
  - Aggiunti audit per tutte le scene FB-1 e per l'estrazione di ogni vano.
  - Generato `tests/blundercheck_fb1_summary.json`.
- `tests/test_geometry.py` (nuovo)
  - Controlli statici su spaziatura a spina di pesce, ingombro vs HAUGA, assenza pattern PSU, routing scena modulo.
- `tests/test_screenshots.py` (nuovo)
  - Cattura screenshot headless di tutte le scene principali in `tests/screenshots/`.
- `docs/BLUNDERcheck_FB1_RISULTATI_2026-11-23.md` (questo file)
- `docs/MISURE_DA_EFFETTUARE_FB1.md` (nuovo, lista azionabile)

## Errori storici già corretti (confermati)

| Gravità | Errore | Intervento sul render |
|---|---|---|
| BLOCCANTE | Alimentatore fittizio 62 × 55 × 47 mm attraversava tutte e sette le PCB | Eliminato; PSU reali **non ancora dimensionati né collocati** |
| ALTA | SSD toccava il fianco destro della cartuccia e l'area della traversa anteriore | Spostato il solo segnaposto grafico, ora 40 × 60 × 9 mm |
| ALTA | Canalina posteriore solida penetrava nel longherone posteriore | Sostituita con linea tratteggiata NON solida |
| ALTA | Barre adattatore dietro il PCB a 2 mm nominali, nessun distanziale | Barre arretrate, distacco nominale 10,5 mm e 4 distanziali visivi |
| MEDIA | Dissipatore e RAM sospesi a distanza dalla faccia PCB | Corretta la sola geometria illustrativa di contatto |

## Rischi ingegneristici ancora aperti

1. **n1 vero ≠ fantoccio 3D**: ASUS H81M-E circa 226 × 175 mm nel registro, contro il rettangolo illustrato 208 × 180 mm. Fori, orientamento, cavi EPS/ATX e dissipatore ancora da rilevare; altri donatori ignoti.
2. **Alimentazione**: ciascun PC indipendente richiede una fonte appropriata. Numero, tipo, potenza, collocazione e cavi PSU/brick da determinare. Un PSU ATX standard non è automaticamente alloggiabile in 92 mm.
3. **Guide e ferramenta**: 4 mm nominali tra cartuccia e guida, soli **5,88 mm** tra guide fisse contigue. Non garantisce spazio per teste viti/dadi, utensili, assestamenti, sfregamento e manutenzione.
4. **Peso non riconciliato**: le 112 forme del sostegno fisso totalizzano **2,045 litri di solidi lordi geometrici** (sovrapposizioni contate più volte). Non è volume netto, peso di stampa o distinta materiali.
5. **Ventole finte**: quattro segnaposti circa 67 × 67 mm, NON le ARCTIC P14 reali da 140 mm. Una P14 non entra individualmente nella cartuccia larga 92 mm.
6. **Cavi irrisolti**: la precedente canalina occupava una trave. La linea tratteggiata attuale non è una posa.
7. **Estrazione solo ideale**: il test dello spazzamento verticale continuo 0–155 mm non trova urti tra i box; esclusi cavi, mani, inclinazioni e deformazioni.
8. **Margine HAUGA minimo**: sagoma 1310 × 318 mm su luce nominale 1345 × 330 mm, equivalenti a 17,5 mm teorici alle testate e **6 mm fronte/retro**.
9. **Struttura non dimensionata**: profilati, giunti, montanti, flessione, torsione, carico concentrato sui sei appoggi, anti-ribaltamento e variante a pavimento ancora senza verifica.

## Gates obbligatori (invariati)

- **G0**: foto/dima quotata n1 in scala 1:1, fori, PSU reale, connettori e dissipatore; pesatura di ogni parte.
- **G1**: CAD parametrico completo sul donatore peggiore, ingombro dei cavi e fissaggi veri, tolleranze e cinematica completa.
- **G2**: distinta materiali completa inclusi sostegni e PSU, massa, baricentro, portata, vibrazioni e anti-ribaltamento su HAUGA e a terra.
- **G3**: prototipo inerte n1, prova meccanica e manutenzione. Solo dopo, progetto esecutivo per la prima stampa.

**Un render senza collisioni fra forme approssimate non è autorizzazione alla stampa.**
