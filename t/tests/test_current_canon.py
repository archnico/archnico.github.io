#!/usr/bin/env python3
"""Ensure current canonical docs, registry and render agree; not physical validation."""
import json
from pathlib import Path
T=Path(__file__).resolve().parents[1]
m=json.loads((T/'misure.json').read_text())
t=m['tower']; c=m['universal_r81']
assert t['base_mm']==c['base_mm']==[1325,310]
assert t['angle_degrees_study']==c['angle_deg']==0
assert t['module_pitch_mm']==c['pitch_mm']==190
assert t['module_envelope_study_mm']==c['carrier_envelope_mm']==[120,284,280]
assert t['guide_gap_mm']==c['guide_gap_mm']==190-138==52
assert c['carrier_gap_mm']==190-120==70
assert t['module_count']==7 and t['internal_hdd_count']==0
assert t['manufacturer_max_top_load_kg']==20 and t['target_loaded_mass_kg']==17
assert t['loaded_mass_kg'] is None and not t['manufacturing_approved']
assert m['historical_fb1_tower_2026_11_23']['angle_degrees_study']==42
assert not any(m['current_decision']['gates'].values())
assert 'length:1325,depth:310,angle:Math.PI*0/180,pitch:190,first:92.5,cy:155' in (T/'assets/universal-viewer.js').read_text()
assert 'assets/universal-viewer.js' in (T/'index.html').read_text()
for f in ['README.md','registro.html','index.html']:
    assert 'H7_R81_CANONE_2026-11-24.md' in (T/f).read_text()
print('PASS canonical registry, viewer, docs and historical separation; NO-GO production')
