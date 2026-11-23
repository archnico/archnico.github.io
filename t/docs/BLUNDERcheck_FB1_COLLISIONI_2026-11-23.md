# Blundercheck ingegneristico FB-1 — 23 novembre 2026

**Decisione: NO-GO alla stampa e all'acquisto dei sostegni.** Le correzioni seguenti rendono più coerente il modello grafico, non validano il progetto meccanico, termico o elettrico.

## Verifica realmente eseguita

Il test riproducibile tests/blundercheck_fb1.py avvia Chromium e intercetta i box realmente generati dal medesimo JavaScript dell'anteprima, senza ricopiarli a mano. Applica il Separating Axis Theorem ai rettangoli anche ruotati e agli intervalli verticali; controlla motherboard, guide, montanti, telaio, SSD e l'intero volume percorso durante 155 mm di estrazione verticale di un modulo per volta, con tutti gli altri fermi.

Il modello corretto presenta **271 box geometrici**. Nei controlli mirati non si rilevano intersezioni rigide non volute. Questo esito vale soltanto per i box illustrativi: non comprende le forme reali dei donatori, dissipatori, viti, connettori, flessione, moto non verticale o cavi.

## Errori trovati e risposta

| Gravità | Errore | Intervento sul render |
|---|---|---|
| BLOCCANTE | Alimentatore fittizio 62 × 55 × 47 mm attraversava tutte e sette le PCB (attraversa lo spessore della PCB per 26,5 mm in longitudine e 37 mm in altezza) | Eliminato il volume inventato. PSU reali **non ancora dimensionati né collocati**: gate elettrico e meccanico |
| ALTA | SSD toccava il fianco destro della cartuccia e l'area della traversa anteriore | Spostato il solo segnaposto grafico, ora 40 × 60 × 9 mm; staffa SSD da progettare |
| ALTA | Canalina posteriore solida penetrava nel longherone posteriore e in altre connessioni | Sostituita con linea tratteggiata NON solida: passaggio cavi irrisolto |
| ALTA | Barre adattatore dietro il PCB a 2 mm nominali, nessun distanziale | Barre arretrate, distacco nominale 10,5 mm e 4 distanziali visivi. Fori e numero reali da misurare |
| MEDIA | Dissipatore e RAM sospesi a distanza dalla faccia PCB | Corretta la sola geometria illustrativa di contatto, non gli ingombri reali |
| ALTA | Etichette legacy promettevano passo 96, X, sei distanziali e P14 reali da 140 mm in vani 67 mm | Schede informative aggiornate per distinguere segnaposti e componenti verificati |

Il sostegno laterale che pare attraversare la motherboard **non attraversa geometricamente la PCB illustrata** nei box dell'ultima FB-1: la minima distanza planare della PCB dai montanti fissi nel controllo è circa 32,5 mm. La prospettiva e la PCB fittizia possono ingannare: l'assenza di collisione nel render non garantisce compatibilità con schede reali.

## Blocchi ingegneristici ancora aperti

1. **n1 vero ≠ fantoccio 3D**: ASUS H81M-E circa 226 × 175 mm nel registro, contro il rettangolo illustrato 208 × 180 mm. Fori, orientamento, cavi EPS/ATX e dissipatore ancora da rilevare; altri donatori ignoti.
2. **Alimentazione**: ciascun PC indipendente richiede una fonte appropriata. Numero, tipo, potenza, collocazione e cavi PSU/brick da determinare. Un PSU ATX standard non è automaticamente alloggiabile in 92 mm. Nessuna distribuzione domestica 230 V autocostruita.
3. **Guide e ferramenta**: 4 mm nominali tra cartuccia e guida, soli **5,88 mm** tra guide fisse contigue. Non garantisce spazio per teste viti/dadi, utensili, assestamenti, sfregamento e manutenzione. Guide fino a circa z=170 mm, mentre la PCB sale a z=341 mm: momento laterale e oscillazioni non calcolati. Manca ritenuta reale.
4. **Peso non riconciliato**: le 112 forme del sostegno fisso totalizzano **2,045 litri di solidi lordi geometrici** (sovrapposizioni contate più volte). Non è volume netto, peso di stampa o distinta materiali. I supporti aggiunti mancano nel budget massa, così il vecchio 15,518 kg R-5 NON è la massa della FB-1. Limite HAUGA 20 kg, ancoraggio obbligatorio e verifica anti-ribaltamento.
5. **Ventole finte**: quattro segnaposti circa 67 × 67 mm, NON le ARCTIC P14 reali da 140 mm. Una P14 non entra individualmente nella cartuccia larga 92 mm. Servono fissaggio reale, griglie, percorso d'aria, portata e test termici.
6. **Cavi irrisolti**: la precedente canalina occupava una trave. La linea tratteggiata attuale non è una posa. Mancano diametri, curve, separazione AC/DC, uscita dei connettori e sgancio.
7. **Estrazione solo ideale**: il test dello spazzamento verticale continuo 0–155 mm non trova urti tra i box; esclusi cavi, mani, inclinazioni e deformazioni, perciò non prova la reale sfilabilità.
8. **Margine HAUGA minimo**: sagoma 1310 × 318 mm su luce nominale 1345 × 330 mm, equivalenti a 17,5 mm teorici alle testate e **6 mm fronte/retro**. Spalletta U, tolleranze, deformazioni e punti di appoggio reali non rilevati.
9. **Struttura non dimensionata**: profilati, giunti, montanti, flessione, torsione, carico concentrato sui sei appoggi, anti-ribaltamento e variante a pavimento ancora senza verifica.

## Gates obbligatori

- **G0**: foto/dima quotata n1 in scala 1:1, fori, PSU reale, connettori e dissipatore; pesatura di ogni parte.
- **G1**: CAD parametrico completo sul donatore peggiore, ingombro dei cavi e fissaggi veri, tolleranze e cinematica completa.
- **G2**: distinta materiali completa inclusi sostegni e PSU, massa, baricentro, portata, vibrazioni e anti-ribaltamento su HAUGA e a terra.
- **G3**: prototipo inerte n1, prova meccanica e manutenzione. Solo dopo, progetto esecutivo per la prima stampa.

**Un render senza collisioni fra forme approssimate non è autorizzazione alla stampa.**
