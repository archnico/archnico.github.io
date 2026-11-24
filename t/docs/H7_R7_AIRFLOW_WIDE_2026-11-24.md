# H-7 R-7 Airflow Wide — 24 novembre 2026
Direzione: sfruttare quasi tutto il piano HAUGA, mantenere 7 nodi obliqui, DAS H-4 separato, carrier R-7 sostituibili. Studio candidato, NO-GO produzione. R-7 Airflow resta riferimento per protocollo termico. Non è una CFD, né una verifica strutturale.

## Pianta
Luce catalogo 1345×330 mm (misura reale pendente), basamento candidato 1325×310, margine esterno nominale 10 mm per lato; non usare la spalletta come supporto. Misurare luce in almeno tre sezioni, diagonali, sporgenze, raggi, planarità; se minimo reale <1345×330, ridimensionare il basamento o scegliere configurazione a terra. Margine 10 mm è ipotesi progettuale, non certificazione. Cassetti nominali 92×284×280; A dalla normale al fronte, P passo orizzontale. X=6P+92cos A+284sin A; Y=92sin A+284cos A; luce guide=Pcos A−110. Margine nominale cartuccia/base >=12 mm, scenario sensibilità >=10 mm.

| A/P | Base | X | Y | luce nominale | margini nominali X/Y |
|---|---|---:|---:|---:|---:|
|42/164|1310×305|1242,40|272,61|11,88|33,80/16,19|
|38/175|1325×305|1297,34|280,44|27,90|13,83/12,28|
|35/175|1325×310|1288,26|285,41|33,35|18,37/12,30|
|36/175|1325×310|1291,36|283,84|31,58|16,82/13,08|
|37/175|1325×310|1294,39|282,18|29,76|15,31/13,91|

Candidato principale 36°/175, alternative 35°/175 e 37°/175: centri X=137,5+175i, Y=155. Il 35° massimizza luce fra questi ma ha margine profondità più esiguo. Provare dima prima di congelare. P176 aumenta gap di soli 0,81 mm e perde 3 mm di margine a ogni estremità: non preferito. Variante ortogonale 0°/200 ha gap 90 mm, X1292 Y284; è controllo utile per isolare vantaggio termico, non sostituisce direzione obliqua richiesta e non ha verifica stabilità/cavi. Non attribuire superiorità termica intrinseca alla spina di pesce.

## Sensibilità
Scenari uniformi A±1°, P±0,5 mm per passo, W=92..94, D=284..286, extra guide=18..20. Minimi luce uniforme: riferimento 5,58, Wide 38° 21,61, Wide 36° 25,36, Wide 35° 27,17. Margini minimi rispetto alla base per 36°/175: 12,40 mm X, 10,90 Y; 35°/175: 13,92 X, 10,17 Y; 37°/175: 10,92 X, 11,68 Y. Non assumere errore comune: bound aggiuntivo proiettando due cartucce con errori indipendenti sulla normale nominale: (P−0,5)cos A − [94 cos1°+286 sin1°] −20. Risultati 2,53 / 18,53 / 22,20 / 23,96 mm rispettivamente per riferimento / Wide38 / Wide36 / Wide35. È una stima conservativa di separazione per ingombri rettangolari; non include traslazioni locali, fissaggi reali o collisioni 3D. Misurare guide e ingombri, ripetere SAT quando CAD disponibile. Sensibilità non garantisce tolleranze reali.

## Raffreddamento
Gap lordo fra carrier: 175cos36−92 = 49,58 mm. Luce locale 31,58; riferimento 11,88. Rapporto 2,66, NON rapporto portata. Se la stessa portata attraversasse sezioni rettangolari di pari altezza, velocità locale scenderebbe al 37,6% e termine dinamico al 14,1%; è solo modello di restringimento ideale, non perdita totale. Bypass, griglie, dissipatori e PSU dominano potenzialmente. Ventole si selezionano sul punto di lavoro curva pressione-portata, non CFM a bocca libera. Fonti ASHRAE https://handbook.ashrae.org/Handbooks/S24/SI/S24_Ch21/S24_Ch21_si.aspx e AMCA https://www.amca.org/educate/articles-and-technical-papers/amca-inmotion-articles/straightening-out-fan-curves.html.
AirRail: mantenere apertura in alto, staffe modulari rimovibili, nessun ingombro dentro sweep; provare ventilazione locale vs estrazione, misurare zona centrale ed estremità. Nessuna dimensione o numero ventole congelato; AirGuide soltanto in caso di bypass dimostrato. Lasciare gap come riserva termica e accesso: non riempirlo con PSU/cavi. A 420 W e deltaT 10 K circa 125 m³/h reali; a 630 W circa 188. Verificare anche estate e monitor sovrastanti, aspirazione/espulsione PSU.

## Massa, telaio e stabilità
Due longheroni +15 mm ciascuno, cinque traverse +5 mm ciascuna se stessa topologia R-6: +55 mm profilato, +21,45 g a 0,39 kg/m (esclude rail e fissaggi). Non equivale a massa finale. Piedi 3×2, proposta X=100,662,5,1225 e Y=45,265 con base 1325×310; span X tra piedi 562,5 contro 555 mm. Modello elementare campata semplice con stesso carico per metro, stesso EI: rapporto flessione (562,5/555)^4=1,055; non è calcolo telaio/giunti. Base più profonda non migliora automaticamente il ribaltamento: supporti reali, CG e forze estrazione contano. Ritenuta autonoma, HAUGA ancorato secondo IKEA, 20 kg totale inderogabile, target pesato <=17 kg; appoggi ampi e in corrispondenza dei percorsi di carico reali del mobile, verificare reazioni e posizione dei divisori, non soltanto distribuzione longitudinale. PSU indipendenti da localizzare e pesare. Non ordinare profilati.

## Fase 1
Dima fredda regolabile con tre vani (n1 centrale e due sagome dei vicini), punti 35/36/37/38° e interassi 164/170/175; non acquistare tutti i carrier. Primo rilievo case, cooler, cavi e PSU; non simulare elettronica calda con materiali combustibili. A parità di carico e ambiente confrontare 42/164, 36/175, 35/175 e 0/200 come controllo su piano adatto, con CPU cooler sempre attivo. Riutilizzare protocollo R-7 Airflow; temperatura aria ai lati, NPS, watt AC, rumore, no nuovo throttling. Fase successiva test contemporaneo multinodo e prova manutentiva, verifica termica e strutturale. Gate NO-GO fino a rilievi, sweep reale, stabilità e collaudo.
