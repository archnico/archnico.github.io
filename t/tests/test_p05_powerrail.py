from pathlib import Path
import json,csv,math
T=Path(__file__).resolve().parents[1]
m=json.loads((T/'misure.json').read_text())['phase1_p05_powerrail']
loads=[7*w+m['accessory_ac_w_scenario'] for w in [30,60,100,150]]
assert loads==[250,460,740,1090]
assert [round(p*8760/1000,1) for p in loads]==[2190,4029.6,6482.4,9548.4]
assert [p/.8 for p in loads]==[312.5,575,925,1362.5]
assert math.isclose(250*1.25/.8,390.625)
assert math.isclose(150*10/60,25)
assert 7*150+6*20==1170
assert not m['actual_ac_w_measured'] and not m['electrical_validated'] and not m['manufacturing_approved']
assert set(m['pre_migration_storage_hosts'])=={'n2','n3','n1_srv_pending'}
rows=list(csv.DictReader((T/'powerrail-survey.csv').open()))
assert all(not r['ac_idle_w'] and not r['ac_load_w'] and not r['va_load'] for r in rows)
assert 'PowerRail P0.5' in (T/'index.html').read_text()
print('PASS PowerRail scenario arithmetic, inventory and links; no electrical approval')
