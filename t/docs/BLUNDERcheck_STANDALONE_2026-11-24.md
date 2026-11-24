# Vista autonoma a terra — correzione geometricovisiva e QA del 24 novembre 2026

## Problema osservato

In una schermata da telefono, quattro ampie sporgenze grigie sembravano elementi permanenti e una traversa appariva attraversare una motherboard. Le sporgenze erano le **quattro ali opzionali**, ma la vista le attivava automaticamente: questa scelta visiva era fuorviante.

Il secondo problema aveva due cause:
- La base alternativa comprendeva **una seconda coppia di lunghi longheroni esterni e tre traverse basse**. Un lungo longherone di pavimento, pur non collidendo in quota con le PCB, veniva proiettato dalla camera obliqua davanti alle schede, simulando un attraversamento.
- Il precedente test SAT *non includeva* i gruppi `STANDRAIL`, `STANDCROSS`, `STANDJOINT`, `STANDRUBBER`, `STANDPAD` fra gli ingombri strutturali. Inoltre, registrava le PCB **prima** della traslazione verso il suolo di 90 mm. Pertanto il precedente PASS della vista standalone era incompleto.

## Soluzione di fattibilità (non esecutiva)

Nella vista autonoma il **medesimo telaio principale FB-1** viene abbassato di 90 mm; conserva due longheroni e sette traverse sotto i vani. La base separata a pavimento non duplica più i longheroni e non prevede traverse supplementari. Sotto il telaio sono rappresentate **sei scarpe metalliche basse** (tre posizioni longitudinali × due lati), con una suola elastomerica. Il loro contatto schematico è a `z=1 mm`, sotto i PCB illustrativi che, dopo l'abbassamento, occupano `z=71..251 mm`.

Le scarpe sono un **esempio di appoggio**, non un disegno dei fori o una conferma di carichi ammissibili. La lunghezza del telaio resta 1310 mm; la larghezza **nominale di studio** delle scarpe è circa 418 mm. Quattro ali semplicemente accostate alle scarpe, con giunzioni e bulloneria non progettate, per estendere la base a circa 616 mm **restano selezionabili ma disattivate per impostazione iniziale**. Il render non prescrive di costruirle: servono rilievi di peso, baricentro, altezza del centro di gravità, attrito, urti laterali, rigidezza del telaio e fissaggi per stabilire se siano necessarie.

## Blundercheck migliorato

`tests/blundercheck_fb1.py` ora strumenta il JS reale ed esegue le seguenti verifiche:
- Trasforma i dati di collisione quando la geometria del telaio viene abbassata per la vista autonoma, invece di lasciare gli ingombri alla quota sbagliata.
- Include tutte le scarpe e le ali fra i solidi strutturali, oltre al vecchio telaio.
- Controlla in modo esplicito che non siano rimasti né `STANDRAIL` né `STANDCROSS` supplementari, che ci siano esattamente sei scarpe e che il loro piano superiore tocchi il fondo del telaio a `z=1 mm`.
- Prova separatamente le ali nascoste e le ali aperte, verificando collisioni con PCB, SSD, moduli mobili e il movimento verticale schematico dei cassetti.
- Continua a verificare tutte le altre scene H-7.

**Limite:** SAT su parallelepipedi illustrativi non è una verifica strutturale, termica, di stabilità né una clearance per la motherboard reale ASUS H81M-E. Non autorizza la fabbricazione. Le ali potrebbero essere necessarie, inutili o insufficienti: nessun valore è certificato.

## Decisione

**NO-GO alla stampa dei supporti della Torre o delle ali** prima del rilievo dell'hardware e delle prove fisiche di stabilità. Prima realizzare un singolo modulo, misurare pesi/altezza CG, simulare carichi laterali e verificare il rischio di rovesciamento con adeguato fattore di sicurezza.
