from pathlib import Path
import importlib.util,json,tempfile,math
T=Path(__file__).resolve().parents[1]
m=json.loads((T/'misure.json').read_text())['phase1_p04_airrail']
q=lambda p,d:3600*p/(m['density_kg_m3']*m['cp_j_kg_k']*d)
assert [round(q(7*w,10),1) for w in m['heat_scenarios_w_per_node']]==[62.7,125.4,188.1,250.7,313.4]
assert math.isclose(q(1050,5),2*q(1050,10))
for centers in [[92.5+i*190 for i in range(7)],m['fan_center_layout_4_pair_candidate_mm']]:
 assert min(centers)-70>=0 and max(centers)+70<=1325
 assert min(b-a for a,b in zip(centers,centers[1:]))>=140
assert 190-140==50 and 92.5-70==22.5
assert m['local_cooling_required'] and not m['thermal_validated'] and not m['manufacturing_approved']
spec=importlib.util.spec_from_file_location('airsense',T/'tools/airsense.py')
module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
with tempfile.TemporaryDirectory() as td:
 root=Path(td)
 def put(rel,v):
  p=root/rel;p.parent.mkdir(parents=True,exist_ok=True);p.write_text(v)
 put('class/hwmon/hwmon0/name','coretemp')
 put('class/hwmon/hwmon0/temp1_label','Package id 0')
 put('class/hwmon/hwmon0/temp1_input','80000')
 put('class/hwmon/hwmon1/name','nct6791')
 put('class/hwmon/hwmon1/temp1_label','SYSTIN')
 put('class/hwmon/hwmon1/temp1_input','116000')
 put('class/hwmon/hwmon1/fan2_input','1294')
 put('class/powercap/intel-rapl:0/name','package-0')
 a=module.sample(root)
 assert list(a['cpu_temp_c'].values())==[80] and a['n1_candidate_stop_temp_reached']
 assert list(a['unverified_sensors'].values())==[116]
 assert list(a['rapl_energy_uj'].values())==[None]
 assert a['ambient_c'] is None and a['ac_watts'] is None
 assert list(a['fan_rpm_unmapped'].values())==[1294]
with tempfile.TemporaryDirectory() as td: assert module.sample(Path(td))['n1_candidate_stop_temp_reached'] is None
print('PASS P0.4 heat balance, fan outlines, passive sensor fixture and missing-data handling')
