import json,csv
from pathlib import Path
from xml.etree import ElementTree
T=Path(__file__).resolve().parents[1]
m=json.loads((T/'misure.json').read_text())['phase1_n1_p03']
assert 142-77==m['rear_gross_mm']==65
assert 112.5-77==m['aligned_rear_upright_clearance_mm']==35.5
assert (330-284)/2==m['nominal_external_furniture_margin_mm']==23
assert (310-284)/2==13
s=sum([20,5,15,5]); assert 35.5<s<=65
assert sum([35,10,25,5])>65
assert m['storage_blocker']['mount']=='/srv' and not m['storage_blocker']['migration_approved']
assert not m['manufacturing_approved'] and not m['physical_survey_complete']
rows=list(csv.DictReader((T/'n1-p03-cables.csv').open()))
assert len(rows)==13 and all(r['measured_fit']=='pending' for r in rows)
assert all(r['physical_connector']=='' and r['plug_projection_mm']=='' for r in rows)
ElementTree.parse(T/'n1-p03.svg')
print('PASS P0.3 envelope screening, cable survey, storage block and SVG; no real routing approval')
