# Torre H‑9 · Verifica meccanica preliminare v1.1

**Data:** 21 novembre 2026  
**Stato:** screening numerico e revisione della geometria HTML; **non** prova fisica, simulazione FEM certificata, né progetto esecutivo/STL.  
**Sorgente riproducibile:** `rigidita_test.py` (stessi parametri del pannello nell'HTML).  
**Anteprima canonica:** https://archnico.github.io/t/

## Canone meccanico

- Torre **orizzontale**, aperta, 7 moduli PC e 2 campate vuote multifunzione; dischi sui lati, I/O/PSU commerciali sul retro.
- **Un'unica cornice stampabile per ogni modulo:** inviluppo **80 × 280 × 280 mm**, passo **96 mm**. È un ingombro di studio, non un'affermazione di compatibilità di tutte le motherboard.
- Gli inserti sono *donor-specific*: n1 H81M‑E; n2 laptop i5‑5200U; n3 HP 250 G4; P556/2 e Lenovo M93p ancora **candidati**; GPU soltanto opzione futura su riser/baia.
- Nessun cassetto scorrevole: inserimento **verticale a gravità**, quattro sedi chiavettate, battute anti-taglio e fermo anti-sollevamento **meccanico e rimovibile**. Non si estrae con cavi collegati.
- **Telaio base** con due longheroni frontale/posteriore, traverse ripetute alle campate, X inferiori, trave + montanti + X della vertebra posteriore, due rinforzi per banco HDD, fermacavi e punti di ancoraggio dei servizi.
- **Appoggi a terra/bancone:** H‑9 → **16 piedi** (8 per longherone), H‑7 → **14 piedi** (7 per longherone). Distanza massima fra appoggi lungo il telaio **192 mm** in entrambe le configurazioni. Il banco è un piano rigido e livellato.
- I membri oltre il piatto stampa devono essere **segmentati**, con doppie piastre/manicotti e viti metalliche M4; *non* semplici linguette stampate a incastro portante.
- **Ogni carrier** contiene 8 saette corte di irrigidimento agli angoli (4 inferiori e 4 superiori), 4 appoggi positivi, rinforzi M4 alle giunzioni dei montanti, maniglia con ritegno metallico, inserto con distanziali, guide/fermi. Le quote dei fori non sono congelate.

## Ipotesi numeriche esplicite

| Parametro | Valore di screening | Validazione necessaria |
|---|---:|---|
| PETG, modulo efficace a flessione **Eeff** | **800 MPa** | Provini della stampante e orientazione di stampa; temperatura |
| Longherone, sezione nominale | **14 × 22 mm** | Sezione resistente effettiva e solidità dei giunti |
| Momento d'inerzia ideale della sezione | **12.422,7 mm⁴** | Vuoti/infill riducono la rigidezza: `Eeff` non sostituisce la prova |
| Carico totale H‑9 | **25 kg** (test anche 15 e 40 kg) | Pesare moduli, HDD, alimentatori e cavi reali |
| Carico distribuito | diviso ugualmente fra due longheroni | Reazioni reali non uniformi |
| Modello elastico | trave semplicemente appoggiata | Non rappresenta i momenti/cedimenti dei giunti |
| Criterio interno **di comparazione** | freccia ≤ **0,5 mm** | Non è un requisito normativo o certificazione |

**Fonte materiale:** Prusament PETG datasheet: https://prusament.com/wp-content/uploads/2023/07/PETG_V0_ENG.pdf ; la scheda riporta un modulo a flessione di circa 1,0 GPa per suoi provini. Abbiamo assunto 0,8 GPa come valore **ipotetico cautelativo**; il PETG stampato ha proprietà legate alla stampa, alla geometria e ai giunti.

Formule (piccole deformazioni, vincoli ideali):

- Carico distribuito su ciascun longherone: `q = m*g/(2*lunghezza_torre)` N/mm.
- Freccia in campata: `δ = 5*q*L^4 / (384*Eeff*I)`.
- Tensione massima flessionale: `σ = (q*L²/8) * (h/2) / I`.
- Carico concentrato al centro su **entrambi** i longheroni: `δ = (m*g/2)*L³/(48*Eeff*I)`.

## Risultati riproducibili

| Prova | H‑9 | H‑7 | Lettura |
|---|---:|---:|---|
| Carico distribuito 25 kg, luce **192 mm** | **0,179 mm** | **0,212 mm** | Sotto la soglia interna 0,5 mm **solo per la trave ideale** |
| Carico distribuito 40 kg, luce **192 mm** | **0,286 mm** | **0,340 mm** | Ancora sotto soglia per la trave ideale |
| Un modulo locale **5 kg**, luce **192 mm** | **0,364 mm** | **0,364 mm** | Sotto soglia; da valutare collocazione reazioni |
| Un modulo locale **8 kg**, luce **192 mm** | **0,582 mm** | **0,582 mm** | **Supera** soglia → seconda scarpa/piede o riduzione luce nella campata pesante |
| Longherone precedente, luce **879 mm**, 25 kg uniformi | **78,6 mm*** | — | **Progetto precedente respinto**, valore oltre validità della formula lineare |
| Maniglia 36×8 mm, luce 70 mm, 4 kg e fattore dinamico 3 | **0,685 mm** | uguale | Screening locale della trave; non verifica perni e strati |

\*L'indice 78,6 mm **non** è una deflessione fisica prevedibile: per una deformazione così alta il modello lineare diventa inapplicabile. Serve solo a identificare una criticità strutturale nella soluzione senza appoggi intermedi.

## Stampabilità e giunzioni (orientative)

- Longheroni frontale/posteriore: segmenti lungo X **≤175 mm**, con **doppie piastre M4** su ogni giunzione.
- Traverse da ~407 mm: suddivisione in **3 segmenti** (140 + 140 + 127 mm), piastre M4 ai due giunti.
- Saette inferiori X da **414,2 mm**: **3 segmenti da ~138,1 mm** e 2 manicotti avvitati per saetta.
- Saette posteriori da **285,7 mm**: **2 segmenti da ~142,8 mm** e 1 manicotto avvitato per saetta.
- Montanti posteriori da 264 mm: **2×132 mm** con giunzione M4.
- Inserti P556/2 con trave teorica 244 mm: **2×122 mm** e giunto; sagoma e foro ancora indicativi.
- PCB e piastra I/O **non devono portare** peso del telaio; le ventole non devono essere schiacciate da saette; coperture/tappi non sostituiscono ritegni meccanici.

> Le sagome dei manicotti rappresentano la loro **necessità**, non una geometria di collegamento ingegnerizzata: geometria vite, distanze dai bordi, profondità inserti, coppia di serraggio, orientazione strati e percorsi di carico richiedono prova sui campioni.

## Prove fisiche minime, prima dello STL finale

1. **Primo prototipo**: stampare un solo giunto longherone, una saetta segmentata completa, un angolo di carrier e la maniglia. Fare provini di trazione/strappo delle boccole e delle connessioni M4; non usare carichi non controllati su hardware vero.
2. **Prova flessione a freddo**: con masse campione e comparatore/calibro, testare una campata di 192 mm a 5, 10 e 20 N; misurare carico e freccia, con e senza giunti. Ricavare `Eeff` effettivo e rivalutare il foglio.
3. **Prova locale modulo**: cassette vuote con massa fittizia di 2, 4 e 5 kg, sollevamenti ripetuti e verifica dei ritegni. L'uso a 8 kg è sospeso finché non si aggiungono appoggi ravvicinati.
4. **Prova a caldo/creep**: mantenere carico statico per almeno 72 ore in un ambiente termico comparabile al funzionamento; registrare cedimento iniziale, nel tempo, e residuo. Separare i pezzi da sorgenti di calore come CPU e GPU.
5. **Torsione e spinta laterale**: applicare forze note a struttura vuota, registrare rotazione della spina posteriore e disallineamento degli innesti; verificare se i giunti si allentano.
6. **Stabilità**: pesare e trovare posizione del baricentro reale con HDD pieni, GPU e alimentatori; testare spinta laterale controllata senza rischio di ribaltamento.
7. **Interferenze**: misurare la **H81M-E reale** (socket, dissipatore, DIMM, porte, ATX PSU), poi laptop n2/n3, quindi eventuali P556/M93; garantire 80mm di involucro **inclusi** cablaggi e tolleranze. Verificare che l'estrazione dall'alto sia libera.
8. **Sicurezza elettrica/termica**: usare esclusivamente alimentatori e distribuzione AC certificati, ancorati e protetti; prevedere la gestione dei cavi, massa/terra dove richiesta e raffreddamento GPU. Non realizzare una ciabatta AC stampata in 3D.

## Esito

- **PASS di screening numerico** per le sole travi semplicemente appoggiate con piedi ≤192 mm sotto 25/40 kg distribuiti e 5 kg concentrati, secondo le ipotesi sopra.
- **FAIL** per la vecchia luce ~879 mm e per una cartuccia **8 kg** se si usa una soglia interna di 0,5 mm senza appoggi supplementari.
- **NON VERIFICATO** (bloccante per il CAD/STL finale): rigidezza dei giunti, FEM 3D con contatti reali, creep, coppie viti, ventilazione, baricentro, comportamento termico, sicurezza elettrica e montabilità dei donor.

**Conclusione:** la v1.1 è un **concept strutturalmente più completo e verificabile**, ma il prodotto non è ancora certificato o pronto per essere stampato integralmente.