# FB-1 · Elenco azionabile di misure e blocchi

Questo documento è parte del round 1 di riconciliazione geometria/render.
Il modello 3D è uno **studio non esecutivo**: ogni quota qui sotto deve essere rilevata sull'hardware reale prima di qualsiasi stampa o acquisto.

## Blocchi di progetto (NO-GO fino a risoluzione)

| ID | Elemento | Cosa misurare | Perché blocca |
|---|---|---|---|
| B1 | Scheda madre n1 (ASUS H81M-E) | Dimensioni reali 226×175 mm, fori M3, posizione CPU/RAM, altezza dissipatore, connettori ATX/EPS, uscita cavi | L'adattatore stampato e i distanziali dipendono dai fori reali; il PCB illustrativo 208×180 mm è sbagliato |
| B2 | Alimentatori | Per ogni donatore: tipo (ATX/SFX/DC brick), ingombro, connettori, cavi, spunti, posizione nel vano 92 mm | Nessun PSU è modellato; un ATX standard non entra in 92 mm di larghezza |
| B3 | Cavi interni | Diametri, curve minime, lunghezze, separazione AC/DC, modo di sganciarsi prima dell'estrazione | La canalina precedente intersecava il telaio; il tratteggio attuale non è una posa |
| B4 | Ventole reali | Modello scelto, dimensioni, fissaggio, portata, sicurezza dita | I segnaposto 67×67 mm non sono ARCTIC P14 140 mm, che non entra nella cartuccia |
| B5 | Massa e baricentro | Pesare scheda, dissipatore, PSU, SSD, cavi, profilati, stampati per n1; stimare gli altri 6 nodi | Limite HAUGA 20 kg e ancoraggio a parete sono vincolanti; nessuna pesata disponibile |

## Verifiche meccaniche da fare su prototipo inerte

1. **Cartuccia singola n1** in un banco di prova temporaneo:
   - scorrimento verticale reale con cavi scollegati
   - gioco laterale dopo stampa (tolleranze PETG, deformazione sotto peso)
   - tenuta dei fermi anti-sollevamento
   - accesso alle porte posteriori
2. **Base su HAUGA**: i sei appoggi metallici non devono caricate la spalletta a U; verificare distribuzione del carico e antiscivolo.
3. **Variante a terra**: il basamento autonomo è solo un concept; risolvere le intersezioni fisse prima di collaudarlo.

## Quote nominali del render dopo il round 2

- Angolo in pianta: 42°
- Passo tra assi cartuccia: 164 mm
- Larghezza cartuccia esterna: 92 mm
- Guide fisse laterali: centri a u = ±54 mm, spessore 6 mm
- Gioco laterale nominale cartuccia-guida: ~5 mm/lato
- Gioco tra guide fisse contigue: ~7,9 mm
- Base del telaio: top a z = 107 mm
- Pattini inferiori dei cassetti: top a z = 127 mm (coincide con fondo cartuccia)
- Montanti laterali fissi: da z = 107 mm a z = 240 mm (collegati al telaio base)
- Traverse di ripartizione del telaio base: una per vano, 92 mm di larghezza in x, dal centro di ogni cartuccia

## Test automatici

- `t/tests/blundercheck_fb1.py` — audit SAT su `tower`, `module` per ogni vano, `rear`, `thermal`, `standalone`; controlla intersezioni madre/supporti fissi, SSD/guancia, pezzi mobili/supporti fissi, supporti fissi/supporti fissi, sweep verticale 0–155 mm.
- `t/tests/test_fb1_guides.py` — regressioni su quote guide, conteggio supporti e assenza di PSU.
- `t/tests/test_geometry.py` — controlli statici su costanti FB-1, ingombro HAUGA, assenza pattern PSU, routing scena modulo.
- `t/tests/test_loadpath.py` — controlli statici sul percorso di carico (round 2).
- `t/tests/test_screenshots.py` — screenshot headless delle scene principali.

**Stato:** il modello torre ha un percorso di carico geometricamente collegato e supera i test SAT nel branch notturno; la base autonoma è stata riallineata per evitare intersezioni solide ma resta un concept non collaudato strutturalmente. Round 3: aggiunte annotazioni di percorso di carico in vista Torre e Modulo; nessun nuovo solido.
