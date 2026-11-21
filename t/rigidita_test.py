#!/usr/bin/env python3
"""Torre H-9: screening numerico riproducibile, NON test fisico o FEM."""
from math import ceil,hypot

E = 800.0          # N/mm^2; PETG effettivo IPOTIZZATO (conservativo)
B, H = 14.0, 22.0 # mm sezione longherone
I = B*H**3/12
G = 9.81
MAX_SEG = 165       # mm diagonali stampate
MAX_FRECCIA = 0.5   # criterio di progetto preliminare, non norma


def supporti(n):
    width = 356+n*96
    xs = [23,163]
    x = 355
    while x < width-23:
        xs.append(x)
        x += 192
    xs.append(width-23)
    return width, xs


def uniforme(mass, n, span=192):
    width,_ = supporti(n)
    q = mass*G / (2*width)
    d = 5*q*span**4/(384*E*I)
    sigma = (q*span**2/8)*(H/2)/I
    return d,sigma


def puntuale(mass, span=192):
    p=mass*G/2
    d=p*span**3/(48*E*I)
    sigma=(p*span/4)*(H/2)/I
    return d,sigma


def handle(mass=4.0,impact_factor=3.0):
    ih=36*8**3/12; p=mass*G*impact_factor; span=70
    return p*span**3/(48*E*ih), (p*span/4)*(8/2)/ih


def print_lengths():
    diagonal_base=hypot(192,367)
    diagonal_rear=hypot(176,225)
    return diagonal_base,ceil(diagonal_base/MAX_SEG),diagonal_rear,ceil(diagonal_rear/MAX_SEG)


def run():
    print('SCREENING MECCANICO TORRE H9 / H7 · Eeff=800 MPa · senza FEA o prova fisica')
    print(f'Longherone 14×22 mm, I={I:.1f} mm^4; limite di confronto freccia 0,5mm.')
    for n in (9,7):
        width,xs=supporti(n)
        gaps=[b-a for a,b in zip(xs,xs[1:])]
        assert max(gaps)<=192, (n,max(gaps))
        assert len(xs)==(8 if n==9 else 7)
        print(f'\nH{n}: larghezza {width}mm, {len(xs)} appoggi/longherone = {2*len(xs)} piedi; luce max {max(gaps)}mm')
        print('Appoggi X:',xs)
        for mass in (15,25,40):
            d,s=uniforme(mass,n)
            assert d<MAX_FRECCIA
            print(f'  uniformemente {mass:2d}kg : freccia={d:.3f}mm | σ={s:.2f}MPa [screening PASS]')
        for mass in (4,5,8):
            d,s=puntuale(mass)
            verdict='sotto soglia' if d<MAX_FRECCIA else 'oltre soglia: ridurre luce o rinforzare localmente'
            print(f'  cassetto concentrato {mass:2d}kg : freccia={d:.3f}mm | σ={s:.2f}MPa | {verdict}')
    old9,_=uniforme(25,9,879)
    print(f'\nCon vecchia luce 879mm e carico uniformemente 25kg: indice matematico {old9:.1f}mm [FUORI CAMPO piccole deformazioni, NO previsione fisica]')
    hd,hs=handle()
    print(f'Maniglia 36×8mm, luce 70mm, carico 4kg×3g: freccia {hd:.3f}mm, σ {hs:.2f}MPa [non valuta giunti/creep]')
    db,nb,dr,nr=print_lengths()
    print(f'Controvento base lunghezza {db:.1f}mm, {nb} pezzi da {db/nb:.1f}mm')
    print(f'Controvento retro lunghezza {dr:.1f}mm, {nr} pezzi da {dr/nr:.1f}mm')
    assert db/nb<=MAX_SEG and dr/nr<=MAX_SEG
    print('Cassette uguali: 80 × 280 × 280 mm (solo envelope nominale)')
    print('NON ESEGUITI: test a torsione, vibrazione, creep a caldo, tenuta incastri, viti M4, ribaltamento con baricentro reale, interferenze/airflow GPU.')

if __name__=='__main__':run()