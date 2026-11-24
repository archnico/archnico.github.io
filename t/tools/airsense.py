#!/usr/bin/env python3
"""Passive, unprivileged AirSense snapshot. No control, stress, writes or daemon."""
import argparse,json
from pathlib import Path
from datetime import datetime,timezone

def read(p):
    try: return p.read_text().strip()
    except (OSError,UnicodeError): return None

def number(p):
    try: return int(read(p))
    except (ValueError,TypeError): return None

def sample(root=Path('/sys')):
    out={'utc':datetime.now(timezone.utc).isoformat(),'cpu_temp_c':{},'unverified_sensors':{},'fan_rpm_unmapped':{},'rapl_energy_uj':{},'throttle_counts':{},'ambient_c':None,'ac_watts':None,'ssd_temp_c':{},'mode':'passive_snapshot_not_baseline'}
    for d in sorted((root/'class/hwmon').glob('hwmon*')):
        name=read(d/'name') or 'unknown'
        for p in sorted(d.glob('temp*_input')):
            n=number(p)
            if n is None: continue
            label=read(d/(p.stem.replace('_input','_label'))) or p.stem
            key=f'{d.name}/{name}/{label}'
            if name=='coretemp' and (label.startswith('Package id ') or label.startswith('Core ')):
                out['cpu_temp_c'][key]=n/1000
            elif name in ('drivetemp','nvme'):
                out['ssd_temp_c'][key]=n/1000
            else:
                out['unverified_sensors'][key]=n/1000
        for p in sorted(d.glob('fan*_input')):
            out['fan_rpm_unmapped'][f'{d.name}/{name}/{p.stem}']=number(p)
    for d in sorted((root/'class/powercap').glob('intel-rapl:*')):
        name=read(d/'name')
        if name: out['rapl_energy_uj'][f'{d.name}/{name}']=number(d/'energy_uj')
    for d in sorted((root/'devices/system/cpu').glob('cpu[0-9]*')):
        for p in sorted((d/'thermal_throttle').glob('*throttle_count')):
            out['throttle_counts'][f'{d.name}/{p.name}']=number(p)
    temps=[v for v in out['cpu_temp_c'].values()]
    out['n1_candidate_stop_temp_c']=80
    out['n1_candidate_stop_temp_reached']=max(temps)>=80 if temps else None
    out['notes']=['No ambient/AC measurement unless instrumented separately.','Fan labels and unverified sensors require physical identification.','RAPL energy is not wall power; cumulative throttle counters require deltas.','80 C is an n1 test stop threshold, not a controller or universal limit.']
    return out

if __name__=='__main__':
    ap=argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--sys-root',type=Path,default=Path('/sys'),help='read-only sysfs root or fixture')
    args=ap.parse_args()
    print(json.dumps(sample(args.sys_root),indent=2))
