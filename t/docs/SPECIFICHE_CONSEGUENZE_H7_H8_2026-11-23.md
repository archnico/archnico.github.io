# Torre H-7 + storage H-8 — specifiche e conseguenze, revisione S-1

**23 novembre 2026 · decisione architetturale con verifiche hardware reali.**
Questa è la specifica funzionale principale. **Non** è un CAD esecutivo, non autorizza montaggi né acquisti. Prevale sui dettagli obsoleti dei vecchi R-2/R-3, del DAS H-4 e sulle proporzioni decorative del render FB-1. Lo studio R-5 sul pettine rimane fonte dei calcoli di massa e dei problemi strutturali.

## A. Invarianti canoniche

| Sottosistema | Specifica fissata | Conseguenza |
|---|---|---|
| Torre H-7 | Sette **moduli PC uniformi** a pettine/spina di pesce **obliqui in pianta**, non due file a V | Involucro esterno uguale, adattatore interno personalizzato; hardware e connettori reali ancora da misurare |
| Modulo | Singolo PC autonomo con SSD locale, CPU/RAM/dissipatore, alimentazione conforme al suo hardware | Nessun HDD meccanico interno, nessuna GPU o telefono integrati |
| Manutenzione | Cartucce accessibili e rimovibili **verso l'alto** dopo arresto, ritenute sbloccate e tutti i cavi disconnessi | Non progettare slide a estrazione obliqua con cavi collegati; corsia libera sopra la cartuccia |
| Telaio | Reticolo di profilati metallici con giunti/controventi verificabili; **nessuna piastra di betulla** | PETG solo per adapter, distanziali e dettagli appropriati, stampa commissionata fuori casa |
| Appoggio H-7 | Peso **direttamente sul piano interno del mobile IKEA HAUGA**; niente nuove viti nel mobile, niente carico sulla U | Rialzi removibili e appoggi antiscivolo; torre anche autonoma a terra con piedi/ritenute adatti |
| HAUGA | Art. 004.150.47, 1370 × 355 × 540 mm misurati, spalletta U h90/t10, top produttore **max 20 kg** | L'ancoraggio del mobile a parete richiesto da IKEA resta obbligatorio. Non usare la portata come obiettivo da raggiungere |
| Torre alimentazione | UPS esterno, alimentatori commerciali propri dei singoli nodi, niente rete 230 V distribuita artigianalmente | Numero e collocazione PSU condizionano massa, cablaggio, vibrazioni e continuità |
| Torrino H-8 | DAS commerciale USB **8 bay SATA** + **hub USB 3.x alimentato 4 porte (secondo hub solo eventuale)**, indipendenti e raffreddati a norma, sulla cassettiera separata | Nessun peso DAS/Hub sul top HAUGA. DAS e hub non sono lo stesso oggetto |
| Storage access | **n2 host iniziale**, volumi condivisi a H-7/n0 tramite LAN NFS/Samba | Un solo host USB alla volta; non confondere DAS con NAS |
| Scrivania | 1000 × 550 × 800 mm; tastiera, mouse, laptop **aperto su leggio**, telefono su leggio | Sei USB-C accessibili a sinistra; una collegata al telefono, una alla postazione PC; tipo di dati/PD da definire |
| Audio e router | Subwoofer e tutti i satelliti nel **mobile multilivello**, router con essi | Cassettiera liberata per DAS+hub; nessun altoparlante sul piano della scrivania |
| Stanza | Circa 5000 × 5000 × 3000 mm, un angolo smussato, finestra 2100 × 1600 mm, tre schermi su bracci a muro | Il render mantiene contesto e gruppi/toggle indipendenti |

## B. Geometria: render e dimensione costruibile NON coincidono

Assunzioni di calcolo **ancora non verificate**: cartuccia W=92 mm (larghezza/spessore in pianta), D=284 mm (sviluppo in pianta), centri distanziati di passo P sull'asse lungo HAUGA, angolo θ rispetto all'asse del mobile. Sette moduli. Formule:

- Lunghezza **solo gruppo moduli**: `Lgruppo = 6P + W cos(θ) + D sin(θ)`.
- Profondità **solo gruppo moduli**: `Dgruppo = W sin(θ) + D cos(θ)`.
- Luce normale nominale tra moduli: `G = P cos(θ) − W`.
- Profondità **d'insieme con servizi**: `Dtotale ≈ Dgruppo + 37 mm (fronte) + 60 mm (retro cavi) + 40 mm (struttura)`. **37/60/40 sono riserve di studio, non obblighi di standard**.

| Variante | θ / P | L gruppo (mm) | D gruppo (mm) | Luce normale (mm) | D completa stimata (mm) | Sbalzo vs 355 mm (mm) |
|---|---|---:|---:|---:|---:|---:|
| **FB-1 pubblicata nel render** | 42° / 164 | **1242** | **273** | **30** | **410** | **55** |
| FB-1 compattata | 42° / 150 | **1158** | **273** | **20** | **410** | **55** |
| Compromesso geometrico | 35° / 140 | **1078** | **285** | **23** | **422** | **67** |
| Compatta in lunghezza | 25° / 120 | **923** | **296** | **17** | **433** | **78** |
| R-5 con W80/D251 (altro modulo) | 25° / 108 | **827** | **261** | **18** | **398** | **43** |

**Problema rilevato:** il rettangolo **1310 × 318 mm** oggi nell'anteprima FB-1 è un envelope illustrativo senza corridoi esterni reali per cablaggi e ventole. Il solo gruppo cassette a 42° occupa ~273 mm in profondità, lasciando 45 mm nella profondità grafica di 318: insufficienti per l'insieme di riserve frontali, posteriori e strutturali adottato qui. Il telaio completo va ridisegnato intorno a **400–435 mm** se queste riserve saranno confermate, con eventuale sbalzo **solo verso la stanza**, appoggi sempre entro il piano interno (nominale catalogo 1345 × 330 mm). Il baricentro potrebbe però far risultare lo sbalzo inaccettabile.

**Scelta ingegneristica non ancora fissata:** provare prima la **coppia 42°/150** e la **35°/140** contro R-5 **25°/108 con W80/D251**, non congelare 42°/164 per semplice fedeltà al render. Il progetto R-5 valuta 25°/108 per **un modulo diverso**, perciò non si possono mischiare acriticamente i suoi risultati con W92/D284. La reale scheda n1 ASUS H81M-E (circa 226 × 175 mm) richiede un supporto PCB diverso da quello solo illustrativo 208 × 180 mm mostrato nel primo render.

**Regola di progettazione:** prima rilievo dimensionale della scheda donatrice più impegnativa (PCB, dissipatore, connettori inseriti, curva ATX, standoff, PSU); poi ricalcolo di W, D, altezza, passo e angolo. Il primo prototipo n1 è il riferimento concreto; la condizione di estrazione verticale senza collisioni va provata 1:1.

## C. Massa, stabilità e raffreddamento

La simulazione R-5 stimava **15,518 kg** con 7 schede ipotetiche, un solo ATX, quattro ventole e telaio metallico: massa **non pesata** e dipendente da quattro donatori ancora ignoti. Con due PSU e sei ventole lo scenario salirebbe a circa **17,206 kg**; con quattro PSU e sei ventole a **19,806 kg**. **Un PC indipendente deve avere alimentazione conforme**: non si può assumere che un solo PSU serva sette PC. Se vi fossero sette PSU di massa aggiuntiva indicativa 1,3 kg ciascuno, si supererebbero 20 kg (a partire dalla base 4 ventole/1 PSU, altre sei PSU aggiungono 7,8 kg). Gli alimentatori laptop possono restare esterni alla Torre se il cablaggio DC commerciale è appropriato, ma vanno conteggiati sui mobili dove poggiano.

**Target di progetto:** ≤17 kg **pesati** sulla superficie HAUGA inclusi 7 moduli, metallo, supporti, fascette, PSU che effettivamente poggiano lì, SSD, ventole, cablaggio e ferramenta. **Limite non negoziabile: 20 kg** (IKEA). Sei appoggi su tre stazioni longitudinali e due file trasversali sono **solo l'ipotesi iniziale**: i carichi non si distribuiscono automaticamente in sei quote uguali.

**Rischio bloccante:** i moduli alti su rialzi e lo sbalzo aumentano rischio di ribaltamento da urti, manutenzione e trazione cavi. Il calcolo R-5 segnala che anche forze orizzontali piccole possono avvicinarsi alla soglia statica di ribaltamento. Servono ritenute antiribaltamento **del sistema Torre indipendenti dal mobile**, fissate opportunamente a parete o struttura su pavimento; fissare HAUGA alla parete come prescrive IKEA resta obbligo separato. Nessuna vite nuova nel truciolare HAUGA.

Le quattro ventole mostrate nel render sono **segnaposto**: le CPU mantengono le proprie ventole, aspirazione/uscita e PWM vanno misurati sui sette nodi montati; le portate nominali a bocca libera non provano il raffreddamento reale. Evitare un plenum unico che ricircoli aria calda fra PCB ravvicinati. Nessun ordine ventole definitivo prima di test di temperatura e polvere.


## D. Hub USB modulare, revisione 23/11/2026

**Decisione di acquisto:** primo hub **USB 3.x a quattro porte**, con alimentazione esterna autonoma e collegamento diretto a una porta di **n2**. **DAS a otto baie invariato**, anch'esso collegato direttamente a n2 su altra porta, senza transitare dall'hub. L'hub a otto porte precedentemente previsto è superato. Se servirà espandere, aggiungere **un secondo hub alimentato a quattro porte** preferibilmente su un'altra porta host, non comprare subito entrambe le unità. Non sommare le bande come se fossero controller separati senza ispezionare la topologia USB.

**Candidato da verificare:** UGREEN 20290 (USB-A upstream, quattro USB-A 3.x; modello con ingresso di alimentazione ausiliaria). Preferire confezione che includa o permetta alimentatore USB 5 V adeguato, con caratteristiche documentate; non assumere alimentatore incluso. Fonti: https://nz.ugreen.com/products/ugreen-20290-usb3-0-4pt-hub-w-usb-c-pwr-bk e https://www.computerstore.it/hub-usb-ugreen-hub-usb3-0-4-porte-usb3-0-0-5m-black-.1.51.144.gp.161681.uw.

**Conseguenza economica:** compriamo ora soltanto l'hub 4 porte; costo accessori e cavi separato dal prezzo DAS. La fascia delle sei prese USB-C sulla scrivania è un altro sottosistema e **non** viene ridotta a quattro; hub torrino e USB-C scrivania sono distinti.

## E. Percorso decisionale

1. Confermare modello hub e alimentatore, porta USB 3.x fisicamente libera di n2 e percorso del cavo fino alla cassettiera.
2. Stabilire se gli attuali 8 TB e 4 TB restano nelle custodie USB sull'hub oppure se si migrano su dischi SATA compatibili con il DAS: non aprire/migrare senza inventario e backup.
3. Testare disco USB da 4 TB oggi enumerato a 480 Mbit/s su porta 5 Gbit/s, verificando che supporti davvero SuperSpeed e senza compromettere i mount attivi.
4. Prima di costruire Torre: misure n1, CAD ingombri effettivi, massa, ribaltamento, ventilazione, accessibilità e ritenute indipendenti dal mobile; rispettare HAUGA 20 kg e ancoraggio.
