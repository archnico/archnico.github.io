# n4 / U-Fujitsu P0.2 — VESA o ritenute, verifica geometrica e termica
26 novembre 2026 · R-8.1 C120 invariato · **NO-GO fabbricazione definitiva o accensione in Torre**.

[Anteprima A/B](index.html) · [Tavola quotata](tavola.svg) · [Calcolatore griglie](thermal.html) · [CAD parametrico](u-fujitsu.scad) · [P0.1 storico](../README.md).

## Decisione
Il carrier universale resta il P0.1: 120×284×280, base 1325×310, passo 190, guide 138. Non serve aggiungere un secondo telaio per il Fujitsu. L'adattatore di n4 diventa un kit removibile in due varianti **alternative** e non cumulabili. Progettazione a freddo indipendente da n1.
- A prioritaria: cover OEM VESA 100 originale se integra e approvata per questa configurazione verticale. Apertura in centro, due traversine e due selle.
- B fallback: sotto e sopra, fermate positive in metallo. Nessun fissaggio alla scocca o magnete. Carico scaricato sulle selle, fermi soltanto di ritenuta.

Il manuale Fujitsu (2013, ed.2, A26361-K1011-Z321-2-7619) p.7–8 distingue il frontale e due configurazioni di retro; le immagini sono schematiche e non forniscono coordinate delle griglie. P.17 orientamento con pulsante in alto; pp.19–22 fissaggio mediante rimozione della cover inferiore e aggancio alla copertura fissata al monitor, con viti fornite. Non si può assumere la filettatura dello chassis, la compatibilità della cover concreta, il verso dei ganci o il diametro vite. Il testo prescrive 10 mm senza griglie e 200 mm con griglie, salvo lato inferiore in verticale. [Documentazione ufficiale](https://support.ts.fujitsu.com/Search/SWP1094945.asp).

## Coordinate di revisione
Origine invariata (X trasversale, Y frontale negativo, Z altezza carrier), dima X±32,5 Y−135..60 Z23,5..213,5. Selle comuni Al tubo 20×20×1,5 L104, Y−105/+30, sopra flange inferiori; pad 10×16×2 e materiali da scegliere dopo rilievo. Nessun carico primario su plastica.

| Voce | A / VESA | B / selle |
|---|---|---|
| Montaggio | 2 traversine ad L25×15×2 L225 | 2 tubi 12×15×1,5 L195 per dima (190 per case nominali) |
| Coordinate | X−59..−44; Y±112,5; Z68,5/168,5 centri teorici | X43..55; Y−105/+30; da Z21,5 a 216,5 |
| Viti / ritenuta | quattro asole in Y 26,5×6,5 (ipotesi ±10, diametro da rilevare), bridge di estremità schematici | dita rimovibili con rientro 8 mm, gamba piegata 25 mm, attacco metallico da risolvere; 4 ganasce laterali |
| Fermo Y | cover OEM certificata + geometria reale dei ganci | 4 riscontri agli angoli inferiori 8 mm ciascuno (due fronte + due retro), supporti tubo 10×10×1,5 L104 |
| Massa geometrica di studio | ~209 g | ~195 g |
| Riserva VESA | tra faccia traversina X−44 e faccia dima X−32,5: 11,5 mm disponibili complessivi; Q510 17 mm, Q520 14,65 mm. Sottrarre sporgenza cover, standoff, viti e relative tolleranze. | n/a |

Asole estranee ai fori OEM: sono sul nuovo adattatore metallico; possono essere modificate senza alterare computer o C120. Le quote centri Y−37,5±50 e Z118,5±50 valgono per dima centrata, **non** per cover reale. Il ponte terminale è un volume di collegamento concettuale, non un giunto già verificato. Per la variante B non usare viti da macchine nel profilo sottile senza scelta collegamento (rivnut/contropiastra/through bolt verificati). Il foro e la lunghezza di taglio dipendono da lega e giunti reali; nessun acquisto autorizzato.

## Blundercheck strutturale
Forza laterale di screening: 2 kg × 3g = 58,86 N totali, ipotesi di ripartizione 29,43 N per traversina o montante. E Al=69 GPa, semplici formule elastiche per confrontare sezioni integre (niente torsione, asole o giunti nel calcolo).
- A L25×15×2: trave L225 incernierata idealmente, I=1345 mm⁴, sigma circa 14,1 MPa, freccia 0,075 mm.
- B prima ipotesi L15×10×1,5 (scartata): mensola L190, I=284 mm⁴, sigma 146 MPa, freccia 3,43 mm.
- B tubo 12×15×1,5 scelto per studio: I=1431 mm⁴, sigma 23,5 MPa, freccia 0,681 mm. Non è approvazione a 3g né verifica torsionale. Le dita positive e i piedi richiedono test di resistenza e serraggio reale. L'angolo scartato era più leggero ma troppo flessibile per questo criterio.
- CAD B riduce il volume complessivo dell'adattatore rispetto a P0.1 di circa 10,2%, prima di viteria e tolleranze. Stime da volume triangolato, densità 2,7 g/cm³ Al e 1,2 g/cm³ pad, non pesate. Carrier circa 202 g geometria metallica ideale, senza bulloni, guide/maniglia; totale reale resta il budget P0.1 (2,6–3,0 kg con PC 2 kg e riserve).
- True boolean interno (inset 0,05 mm sulle facce per escludere contatto) tra dima/4 modelli e carrier + guide + adattatori A e B: 10 risultati vuoti. Non certifica cover OEM, viteria, raggi, fasce, asole, giunti, sporgenze e connettori.

## Termica: mappa ortogonale a rettangoli e ostacoli
Nuova pagina [calcolatore G4](thermal.html). Nearest obstruction entro 200 mm nel prisma di proiezione della griglia; considera guide proprie e di tutte le altre sedi, montanti, traversine, ritenute, vicino pieno, parete dietro e davanti, ostacolo sopra/laterale. Le dimensioni si adattano ai cinque inviluppi. Non è CFD, non valuta ostacoli obliqui, cavi reali, hardware ignoto, cover, ventilazione, accesso mano o ricircolo; un risultato favorevole è solo screening del modello. Una griglia che attraversa la proiezione del montante viola la distanza prudenziale anche con tutti i vicini vuoti.

Test sintetici dima: retro con parete a filo base 95 mm, lato interno con carrier vicino 97,5 mm, guida propria lato interno 30,5 mm, ostacolo alto quota400: 186,5 mm. Quindi **l'assenza di n1 vicino non basta**. Da mappa reale:
1. Reticolo mm di ogni apertura (foto ortogonale con scala). Inserire finestre una alla volta.
2. Se griglia è sul retro, verificare distanza reale tra quella faccia e ostacolo, cavi inclusi: tasca 82 mm non è spazio aria garantito; parete almeno 105 mm dopo bordo base se griglia retro e dima.
3. Se griglia lato largo, escludere overlap tra griglia e A1/VESA/guide/ritenute; se inevitabile usare banco OEM isolato e rivedere adattatore, non aumentare semplicemente numero ventole.
4. Baseline OEM e confronto a pari carico soltanto in condizioni meccaniche e clearance approvate. Niente accensione in configurazioni non conformi.

## Gate successivo — rilievo mirato, non fabbricazione
- [ ] Foto frontale/retro entrambe e quattro lati (chiaro dove sia il verso verticale).
- [ ] Cover VESA smontabile e completa, offset suo piano, 4 centri, viti OEM, apertura/chiusura e accesso.
- [ ] Griglie in coordinate (u0,u1,v0,v1 per ogni faccia), appoggi non ventilati, sporgenze reali, piedi, massa e CG.
- [ ] Cavi originali inseriti con misura, accesso leva Ethernet, DVI, percorso libero.
- [ ] Luce mobile e parete, distanza in altezza, banco fissato, modello viti/profili disponibile.
- [ ] Soltanto allora P0.3: fabbricazione dima/campione, fissaggi esecutivi, prove meccaniche ed elettriche a freddo.

## Riproduzione
`openscad -o A.stl -D 'mode="A"' u-fujitsu.scad` (analogamente B,A_metal,B_metal). `python check.py` confronta ingombri e volumi. `mode="collision"` e `variant="A"`/B per ogni modello (file vuoto previsto, 10 test); log `collision.txt`. `python make_preview.py` produce pagina dalle mesh CAD; `python make_drawing.py` produce tavola SVG. Nessuna mesh strutturale è file di stampa.
