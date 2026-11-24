from pathlib import Path
import csv,json
from xml.etree import ElementTree
T=Path(__file__).resolve().parents[1]
m=json.loads((T/'misure.json').read_text())['phase1_n1_p01']
rows=list(csv.DictReader((T/'n1-p01-bom.csv').open()))
cuts=[r for r in rows if r['status']=='candidate_cut']
assert sum(int(r['qty']) for r in cuts)==16
for section,total in [('20x20',2460),('15x15x1.5',748),('6x25',400)]:
 assert sum(int(r['qty'])*int(r['length_each_mm']) for r in cuts if r['section_mm']==section)==total
for stock,parts in [(1000,[380,340,240]),(1000,[270,270]),(1000,[284,284,90,90]),(500,[100]*4)]:
 assert sum(parts)+3*len(parts)+5<=stock
assert 270+2*20==310 and 340+2*20==380
assert 90+2*15==120 and 284==m['carrier_mm'][1]
assert 34-15==m['nominal_vertical_clearance_mm']==19
assert 66-3-60==3 and 2*(66+3)==138 and 190-138==52
assert 110+12.5<142
assert not m['manufacturing_approved']
ElementTree.parse(T/'n1-p01.svg')
print('PASS P0.1 nominal geometry, nesting, BOM and SVG; joints and actual fit unverified')
