import json,csv,math
from pathlib import Path
from xml.etree import ElementTree
T=Path(__file__).resolve().parents[1]
m=json.loads((T/'misure.json').read_text())['phase1_n1_p02']
assert 270-15==255 and 255-2*15==225
assert -35+10.5+1.6==-22.9
assert math.isclose(55-(-22.9),77.9)
assert math.isclose(77.9-28,49.9)
assert 244+34+20==298 and 284-244==40
Iflat=20*3**3/12
Itube=(20*10**3-17*7**3)/12
def delta(I):return 10*225**3/(48*69000*I)
assert 0.76<delta(Iflat)<0.77 and 0.029<delta(Itube)<0.030
assert Itube/Iflat>26
assert 2*255+225==735 and 3*255==765
assert all(sum(parts)+3*len(parts)+5<=1000 for parts in [[284,284,90,90],[255,255,225],[255]*3])
rows=list(csv.DictReader((T/'n1-p02-delta.csv').open()))
assert next(r for r in rows if r['id']=='R01')['qty']=='4'
assert m['positive_retainer_qty_candidate']==4 and not m['manufacturing_approved']
ElementTree.parse(T/'n1-p02.svg')
print('PASS P0.2 analytical envelope, stiffness screening, delta BOM, SVG; no physical certification')
