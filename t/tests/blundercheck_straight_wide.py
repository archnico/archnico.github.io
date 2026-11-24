#!/usr/bin/env python3
"""Audit actual new viewer solids; historical audit preserved separately."""
import blundercheck_fb1 as old
from pathlib import Path
T=Path(__file__).resolve().parents[1]
old.JS=T/'assets/straight-viewer.js'
old.HTML=T/'index.html'
# Existing instrumentation uses the legacy filename. Supply a matching
# temporary HTML via the audit helper by allowing either filename there.
for scene,focus,wings in [('tower',0,False),('rear',0,False),('thermal',0,False),('standalone',0,False),('standalone',0,True)]+[('module',i,False) for i in range(7)]:
    boxes=old.audit_scene(scene,focus,wings)
    movable=[x for x in boxes if x['bay'] is not None and x['group'] not in ('FBGUIDE','FBCRADLE')]
    fixed=[x for x in boxes if x not in movable]
    for x in movable:
        assert abs(x['angle'])<1e-9
        others=fixed+[o for o in movable if o['bay']!=x['bay']]
        assert not any(old.intersects({**x,'h':x['h']+280},o) for o in others), ('280 sweep',scene,x)
    if scene=='tower':
        for i in range(7):
            b=[x for x in boxes if x['bay']==i]
            assert b
            assert all(x['x']-x['w']/2>=0 and x['x']+x['w']/2<=1325 and x['y']-x['d']/2>=0 and x['y']+x['d']/2<=310 for x in b), ('bay out of base',i)
            guides=[x for x in b if x['group']=='FBGUIDE']
            assert max(x['x']+x['w']/2 for x in guides)-min(x['x']-x['w']/2 for x in guides)==110
        feet=[x for x in boxes if x['group']=='LIGHTPAD']
        assert len(feet)==6
        assert all(x['x']>=0 and x['x']+x['w']<=1325 and x['y']>=0 and x['y']+x['d']<=310 for x in feet)
    print('OK: R8 280 mm illustrative box sweep',scene,focus)
print('PASS R8 viewer audit; no real PSU/cables/thermal/structural certification')
