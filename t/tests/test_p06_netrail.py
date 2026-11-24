from pathlib import Path
import json,csv,math
T=Path(__file__).resolve().parents[1]
m=json.loads((T/'misure.json').read_text())['phase1_p06_netrail']
assert min(m['link_mbps']['n2'],m['storage_usb_mbps']['n2'])/8==60
assert min(m['link_mbps']['n3'],m['storage_usb_mbps']['n3'])/8==12.5
assert math.isclose(1000/8/6,20.8333333333333)
assert math.isclose(2500/8/6,52.0833333333333)
assert 5000/8==625 and 10000/8==1250
assert 8-(7+1)==0 and 16-(7+1+1+1)==6
assert not m['actual_throughput_measured'] and not m['network_upgrade_approved']
rows=list(csv.DictReader((T/'netrail-survey.csv').open()))
assert len(rows)==4 and all(not r['actual_lan_MBps'] and not r['actual_storage_MBps'] for r in rows)
assert 'NetRail P0.6' in (T/'index.html').read_text()
print('PASS NetRail theoretical limits, port budget, survey and navigation; no measured throughput')
