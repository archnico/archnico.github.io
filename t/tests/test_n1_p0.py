from pathlib import Path
import json
from math import isclose
from xml.etree import ElementTree
T=Path(__file__).resolve().parents[1]
m=json.loads((T/'misure.json').read_text()); p=m['phase1_n1_p0']
assert 44+175+65==284
assert 34+226+20==280
assert p['board_local_v_mm']==[-142+44,142-65]
assert p['board_local_h_mm']==[34,260]
a=sum(p['component_height_budget_assumptions_mm'].values())
assert isclose(92-a,65.9) and isclose(120-a,93.9)
assert 284-244<65
assert 59==sum([0,15,12,0,8,15,4,5])
assert 166==sum([5,35,28,15,18,35,10,20])
assert not p['physical_survey_complete'] and not p['manufacturing_approved']
root=ElementTree.parse(T/'n1-dima.svg').getroot()
assert root.attrib['width']=='420mm' and root.attrib['height']=='297mm'
rects=[r.attrib for r in root.iter('{http://www.w3.org/2000/svg}rect')]
assert any(r.get('width')=='175' and r.get('height')=='226' for r in rects)
assert any(r.get('width')=='100' and r.get('height')=='100' for r in rects)
print('PASS P0 geometry and budget; dima XML; no physical approval')
