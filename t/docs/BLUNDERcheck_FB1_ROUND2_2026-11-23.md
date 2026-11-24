# Blundercheck ingegneristico FB-1 — Round 2 · 23 novembre 2026

**Decisione: NO-GO alla stampa e all'acquisto dei sostegni.** Questo round rafforza la coerenza geometrica e il percorso di carico del concept FB-1, ma non valida il progetto meccanico, termico o elettrico.

## Obiettivo del round 2

Rispondere alle osservazioni:

1. Il sostegno laterale *sembrava* attraversare la motherboard in prospettiva.
2. I montanti fissi non erano geometricamente collegati al telaio di base (giunto invalido).
3. Il telaio di base aveva traverse sparse che non allineavano i punti di carico.
4. Le icone ventola erano annotate come se raffreddassero anche HDD in H-7.
5. La base autonoma a terra intersecava il telaio abbassato.

## Modifiche al modello

### `t/assets/viewer.js`

- **`fishboneGuides()`**: i quattro montanti angolari fissi (`FBGUIDE`) salgono ora dal telaio base `z=107 mm` fino a `z=240 mm` (altezza 133 mm). Prima partivano da `z=122 mm`, lasciando un vuoto non collegato di 15 mm sopra la base.
- **Telaio base a scala in `fishboneTower()` e `fbModuleDetail()`**: le tre traverse arbitrarie a `x=250, 570, 890 mm` sono sostituite da sette traverse di ripartizione centrate sotto ogni vano (`cx = 162 + i·164 mm`), larghe 92 mm in x e che coprono tutta la profondità `y=14..304 mm`. In questo modo:
  - i pattini inferiori dei cassetti (`FBCRADLE`, `u=±36`, `v=±30`) poggiano sulla traversa;
  - le battute terminali (`FBCRADLE`, `u=0`, `v=±118`) poggiano sulla traversa;
  - i montanti laterali (`FBGUIDE`, `u=±54`, `v=±120`) poggiano sulla traversa.
- **Rialzi HAUGA**: i sei piedini sono spostati da `y=68, 248` a `y=14, D-32` (centro dei longheroni longitudinali), così il carico scende in linea retta.
- **Ventole / termica**: rimosso il flag `hdd:true` da `FAN_LAYOUT`; aggiornate descrizioni e testi termici per ribadire che in H-7 non ci sono HDD (lo storage è nel DAS H-4 separato) e che una ventola da 140 mm non entra in una cartuccia larga 92 mm.
- **Base autonoma**: `floorStandingKit()` ridisegnata come pila di componenti che termina a `z=1 mm`, in modo che il telaio abbassato di 90 mm (fondo a `z=1 mm`) poggi sopra senza intersezioni solide. Resta uno studio non validato strutturalmente.

### Test

- **`t/tests/blundercheck_fb1.py`**: esteso a `tower`, `module` per ogni vano, `rear`, `thermal`, `standalone`; docstring aggiornata; messaggio finale rivisto.
- **`t/tests/test_fb1_guides.py`**: aggiunti controlli sui montanti che partono da `z=107` e sul telaio a scala con sette traverse.
- **`t/tests/test_loadpath.py`** (nuovo): controlli statici indipendenti da Chromium sul percorso di carico, sull'assenza di flag HDD nelle ventole e sulla coerenza termica.

## Verifica SAT eseguita (progettata)

`blundercheck_fb1.py` avvia Chromium, intercetta i box realmente generati e applica SAT 2D + Z overlap. Nei controlli previsti:

- schede madri vs oggetti strutturali fissi (`FRAME`, `FBCRADLE`, `FBGUIDE`, ...): nessuna intersezione;
- schede madri vs altri volumi non-PCB: nessuna intersezione;
- SSD vs fiancata mobile del proprio vano: nessuna intersezione;
- pezzi mobili vs supporti fissi: nessuna intersezione;
- supporti fissi vs supporti fissi (gruppi diversi): nessuna intersezione;
- sweep verticale 0–155 mm di estrazione di un modulo per volta: nessun urto.

L'esito vale per i box illustrativi; non include dissipatori, connettori, viti, cavi, flessione, deformazioni o estrazione reale.

## Rischi ingegneristici ancora aperti

1. **n1 vero ≠ fantoccio 3D**: ASUS H81M-E circa 226 × 175 mm nel registro, contro il rettangolo illustrato 208 × 180 mm. Fori, orientamento, cavi EPS/ATX e dissipatore ancora da rilevare; altri donatori ignoti.
2. **Alimentazione**: nessun PSU è modellato. Un ATX standard non entra in 92 mm di larghezza; servono brick, SFX/TFX o soluzioni per nodo.
3. **Guide e ferramenta**: ~4 mm nominali tra cartuccia e guida, ~7,9 mm tra guide fisse contigue. Resta stretto per teste viti/dadi, utensili, sfregamento e manutenzione.
4. **Peso non riconciliato**: le guide più alte e le sette traverse aggiungono volume geometrico lordo. Non è peso di stampa né distinta materiali; il budget HAUGA 20 kg e l'ancoraggio a parete restano vincolanti.
5. **Ventole finte**: icone 67 × 67 mm; modello reale, fissaggio, griglia dita, portata e sicurezza da validare.
6. **Cavi irrisolti**: la canalina precedente è stata sostituita da linee tratteggiate; la posa reale è ancora da definire.
7. **Estrazione solo ideale**: lo sweep verticale non prova cavi, mani, inclinazioni e deformazioni.
8. **Margine HAUGA minimo**: sagoma 1310 × 318 mm su luce nominale 1345 × 330 mm, 17,5 mm teorici alle testate e 6 mm fronte/retro. Spalletta U, tolleranze e punti di appoggio reali non rilevati.
9. **Base autonoma**: evitate le intersezioni solide, ma flessione, torsione, anti-ribaltamento e giunti non sono verificati.

## Gates obbligatori (invariati)

- **G0**: foto/dima quotata n1 in scala 1:1, fori, PSU reale, connettori e dissipatore; pesatura di ogni parte.
- **G1**: CAD parametrico completo sul donatore peggiore, ingombro dei cavi e fissaggi veri, tolleranze e cinematica completa.
- **G2**: distinta materiali completa inclusi sostegni e PSU, massa, baricentro, portata, vibrazioni e anti-ribaltamento su HAUGA e a terra.
- **G3**: prototipo inerte n1, prova meccanica e manutenzione. Solo dopo, progetto esecutivo per la prima stampa.

**Un render senza collisioni fra forme approssimate non è autorizzazione alla stampa.**

---

## Round 3 — riconciliazione modello/geometria/render/UX (sessione notturna)

### Obiettivo
Rafforzare la credibilità del render interattivo FB-1 senza trasformarlo in CAD esecutivo:
annotare il percorso di carico, rendere espliciti i vincoli termici e di gioco, e
documentare i blocchi aperti. Nessun nuovo solido che possa introdurre collisioni.

### Modifiche al modello (`t/assets/viewer.js`)
- Annotazioni di percorso di carico in modalità Quote sia nella vista Torre sia nella vista
  Modulo: `CARICO → traversa sotto vano · longheroni · rialzo HAUGA` e
  `PERCORSO DI CARICO: cartuccia → pattini z=127 → traversa z=91 → longheroni → rialzo HAUGA`.
- Etichetta `SAT verificato` aggiunta ai tag del componente `FBGUIDE`.
- Confermato: nessun box di alimentatore (gate PSU aperto), nessun HDD in H-7,
  ventole segnaposto 67 mm (una P14 da 140 mm non entra in 92 mm).

### Verifica SAT
Invariata rispetto al round 2: `t/tests/blundercheck_fb1.py` continua a controllare
`tower`, `module` per ciascuno dei sette vani, `rear`, `thermal`, `standalone`,
compreso lo sweep verticale 0–155 mm e i gruppi fissi tra loro. Nessuna nuova
intersezione introdotta (le annotazioni sono solo testo, non solidi).

### Blocchi ancora aperti (vedi `docs/FB1_MISURE_AZIONABILI_2026-11-23.md`)
B1 scheda madre n1 reale, B2 alimentatori, B3 cavi interni, B4 ventole reali,
B5 massa e baricentro. Gate G0–G3 invariati. NO-GO alla stampa.

### Test aggiornati
- `tests/test_loadpath.py`: aggiunti `test_load_path_labels_present` e
  `test_guide_clearance_tight_but_positive`.
- `tests/test_geometry.py`: invariato (costanti FB-1 e assenza PSU).

### Note UX
Le modifiche di interfaccia (banner stato ingegneristico, modale misure, guida
scorciatoie, modalità bassa potenza) non sono state applicabili in questo branch
perché `index.html` e `viewer.css` sono protetti dal harness in modalità non
interattiva; le annotazioni di percorso di carico nel modello 3D restano il
canale di comunicazione principale. Il render resta uno studio non esecutivo.
