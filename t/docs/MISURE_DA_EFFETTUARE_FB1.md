# FB-1 — Lista azionabile di misure da effettuare

**Progetto:** La Torre H-7 FB-1 · ramo `night/torre-geometry-20261123`  
**Data:** 2026-11-23  
**Scopo:** raccogliere in un unico punto tutte le misure, pesi e verifiche reali che mancano per trasformare il concept grafico in un progetto meccanico/termico/elettrico affidabile.  
**Regola:** nessun valore qui sotto deve essere inventato; ogni riga indica cosa misurare, con quale strumento e a cosa serve.

## 1. Donatori (n1 prioritario, poi n2…n7)

| # | Cosa misurare | Strumento | Perché | Blocca |
|---|---------------|-----------|--------|--------|
| 1.1 | Scheda madre n1 ASUS H81M-E: lunghezza × larghezza × spessore esatti, fori di fissaggio (posizioni relative, diametro), orientamento connettori | Calibro digitale, foglio A4 in scala 1:1, foto dall'alto | Adattatore stampato, distanziali, ritenuta PCB | G0 |
| 1.2 | Altezza dissipatore CPU n1 (con ventola se presente) e ingombro totale x,y,z | Calibro / righello | Clearance interna cartuccia, flusso d'aria | G0 |
| 1.3 | RAM installata: altezza modulo, numero di banchi, distanza dalla PCB | Calibro | Verifica contatto/interferenza con lato cartuccia | G0 |
| 1.4 | Connettori posteriori (USB, RJ45, audio, video): posizione dal bordo scheda, altezza dal piano scheda, direzione di uscita | Calibro, foto | Pannello I/O e curvatura cavi | G0 |
| 1.5 | Connettore ATX/EPS e eventuali PCIe: direzione, lunghezza libera dal connettore, rigidezza | Calibro, osservazione | Posizionamento PSU/cavo e raggio minimo | G0 |
| 1.6 | Peso totale n1 (scheda + CPU + dissipatore + RAM + SSD + cavi) | Bilancia da cucina/cantina | Budget massa, carico HAUGA, baricentro | G0 |
| 1.7 | Stesse misure per n2…n7, identificando il donatore "peggiore" (maggior ingombro, peso, dissipatore) | Come sopra | Il progetto deve funzionare per tutti | G1 |

## 2. Alimentazione

| # | Cosa misurare/verificare | Strumento | Perché | Blocca |
|---|--------------------------|-----------|--------|--------|
| 2.1 | Tipo di PSU di ogni donatore: ATX, SFX, TFX, brick esterno, 12 V DC? | Ispezione etichetta/case | Scegliere se riutilizzare o sostituire | G0 |
| 2.2 | Dimensioni PSU effettive (l × p × h) per ogni tipo | Calibro | Alloggiamento nella cartuccia 92 × 284 mm | G0 |
| 2.3 | Potenza reale e spunto (12 V, 5 V, 3,3 V) | Etichetta + misuratore di potenza | Dimensionamento UPS, cavi, sicurezza | G0 |
| 2.4 | Lunghezza e spessore cavi ATX/EPS/SATA | Calibro | Curvatura, posa, canalina | G0 |
| 2.5 | Temperatura di esercizio PSU sotto carico (se possibile senza smontare) | Termometro a infrarossi | Ventilazione e separazione termica | G1 |
| 2.6 | Decidere se un solo PSU alimenta più nodi (NO distribuzione 230 V autocostruita) | Analisi requisiti | Architettura elettrica | G1 |

## 3. SSD locali

| # | Cosa misurare | Strumento | Perché | Blocca |
|---|---------------|-----------|--------|--------|
| 3.1 | Dimensioni SSD 2,5" effettive (spessore 7 vs 9,5 mm) | Calibro | Staffa SSD nella cartuccia | G0 |
| 3.2 | Posizione connettore SATA+alimentazione sul disco | Calibro | Curvatura cavo, ingombro | G0 |
| 3.3 | Lunghezza cavo SATA dati e alimentazione necessaria | Metro | Posa senza interferenze | G1 |

## 4. Sostegni e telaio FB-1

| # | Cosa misurare/verificare | Strumento | Perché | Blocca |
|---|--------------------------|-----------|--------|--------|
| 4.1 | Cartuccia 92 × 284 mm: verificare che sia una sagoma realizzabile in stampa 3D (PETG) e che accetti la scheda più grande | Prototipo inerte/prova di montaggio | Validazione geometrica | G3 |
| 4.2 | Gioco laterale cartuccia-guida: 4 mm/lato sono sufficienti? | Prototipo + calibro | Evitare incollaggio, permettere estrazione | G3 |
| 4.3 | Altezza e sezione guide fisse: 8 mm × 252 mm sono sufficienti a resistere a carichi laterali? | Simulazione/prova | Oscillazioni e momenti | G2 |
| 4.4 | Sezione e giunti profilati 2020 candidati: verificare flessione su luce 1310 mm | Calcolo/prova | Portata, deformazione | G2 |
| 4.5 | Rialzi HAUGA: verificare che i sei piedini da 109 mm non carichino la spalletta a U | Prototipo + carico inerte | Rispetto vincolo "nessuna vite nel mobile" | G2 |
| 4.6 | Attrito e stabilità della base autonoma a terra con e senza ali stabilizzatrici | Prova su pavimento reale | Anti-ribaltamento | G2 |

## 5. HAUGA e ambiente

| # | Cosa misurare/verificare | Strumento | Perché | Blocca |
|---|--------------------------|-----------|--------|--------|
| 5.1 | Luce interna effettiva del piano superiore HAUGA (non catalogo) | Calibro | Margine FB-1 1310 × 318 mm | G0 |
| 5.2 | Peso reale del mobile HAUGA vuoto e con cassetti | Bilancia | Calcolo massa totale, inerzia | G0 |
| 5.3 | Posizione e dimensioni passacavi posteriori reali | Calibro/foto | Uscita cavi Torre | G0 |
| 5.4 | Ancoraggio a parete: tipo di muro, tasselli, distanza dal bordo | Ispezione | Sicurezza anti-ribaltamento | G2 |
| 5.5 | Temperatura ambiente stanza e flusso d'aria naturale | Termometro/igrometro | Stima raffreddamento passivo | G1 |

## 6. Ventole e termica

| # | Cosa misurare/verificare | Strumento | Perché | Blocca |
|---|--------------------------|-----------|--------|--------|
| 6.1 | Scegliere ventole reali (ARCTIC P14 140 mm non entra in 92 mm; servono alternative) | Datasheet | Ingombro e portata | G1 |
| 6.2 | Portata CFM/m³h e pressione statica delle ventole scelte | Datasheet | Dimensionamento termico | G1 |
| 6.3 | Consumo e spunto 12 V delle ventole | Datasheet/multimetro | Alimentatore ventole | G1 |
| 6.4 | Temperatura CPU sotto carico per ogni donatore | Software di monitoraggio | Verificare ΔT ipotizzato | G2 |
| 6.5 | Posizione prese d'aria e scarico: flusso fronte→retro? basso→alto? | Prototipo/CFD semplice | Orientamento cartucce e griglie | G2 |

## 7. Cavi e collegamenti

| # | Cosa misurare/verificare | Strumento | Perché | Blocca |
|---|--------------------------|-----------|--------|--------|
| 7.1 | Lunghezza cavi di rete necessari dalla Torre al modem/router | Metro | Acquisto cavi CAT6 | G1 |
| 7.2 | Lunghezza cavi USB per DAS e hub H-4 | Metro | Posizione torrino | G1 |
| 7.3 | Percorso canaletta AC vs dati: separazione ≥ 50 mm, nessun incrocio ravvicinato | Metro/ispezione | Normativa e interferenze | G1 |
| 7.4 | Raggio minimo di curvatura dei cavi in uscita dai moduli | Prova con cavo reale | Estrazione senza danneggiare | G3 |

## 8. DAS H-4 e torrino

| # | Cosa misurare/verificare | Strumento | Perché | Blocca |
|---|--------------------------|-----------|--------|--------|
| 8.1 | Confermare ingombro DAS 4 bay e hub USB scelti | Datasheet/calibro | Disposizione sulla cassettiera | G1 |
| 8.2 | Consumo elettrico DAS + HDD esterni 8 TB e 4 TB | Misuratore di potenza | UPS e alimentazione hub | G1 |
| 8.3 | Verificare che i dischi esterni USB attuali (8 TB su n3, 4 TB su n2) possano rimanere nelle custodie senza smontare | Ispezione | Nessuna migrazione forzata | G0 |

## Come usare questa lista

1. Misurare n1 per primo: è il donatore noto e il più probabile "caso limite" per ingombro scheda.
2. Per ogni voce completata, aggiornare `misure.json` e `registro.html` con valore, strumento e data.
3. Quando tutte le voci G0 sono chiuse, si può passare al prototipo inerte n1 (G3).

## 9. Round 5 — verifica strutturale (concept only)

| # | Cosa misurare/verificare | Strumento | Blocca |
|---|--------------------------|-----------|--------|
| 9.1 | Massa reale totale H-7 (7 moduli + telaio + sostegni) vs limite HAUGA 20 kg | Bilancia | G2 |
| 9.2 | Baricentro e poligono di appoggio su HAUGA e a terra | Prova con carico inerte | G2 |
| 9.3 | Attrito e stabilità della base autonoma con/senza ali stabilizzatrici | Prova su pavimento reale | G2 |
| 9.4 | Ancoraggio a parete: tipo muro, tasselli, distanza dal bordo | Ispezione | G2 |
| 9.5 | Estrazione reale di un modulo con cavi scollegati (mani, inclinazioni, deformazioni) | Prototipo inerte | G3 |
4. Non inserire in questo elenco valori stimati o desiderati: solo misure reali.
