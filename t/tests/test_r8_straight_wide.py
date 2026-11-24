#!/usr/bin/env python3
"""Rectangular conservative plan bounds; not CAD or safety certification."""
from math import cos,sin,radians,isclose
from itertools import product

def proj(w,d,a):
    t=radians(abs(a))
    return w*cos(t)+d*sin(t),w*sin(t)+d*cos(t)
def calc(a,p,w=92):
    x,y=proj(w+18,284,a)
    nominal=((1325-6*p-x)/2,(310-y)/2,p*cos(radians(a))-w-18)
    vals=[proj(w+22,286,a+da) for da in [-1,0,1]]
    xx=max(v[0] for v in vals); yy=max(v[1] for v in vals)
    worst=((1325-6*(p+.5)-xx)/2,(310-yy)/2,(p-.5)*cos(radians(a))-proj(w+22,286,1)[0])
    # Separate actual nominal centered guide vs carrier envelope
    c=proj(w,284,a); g=proj(w+18,240,a)
    separate=((1325-6*p-max(c[0],g[0]))/2,(310-max(c[1],g[1]))/2)
    return nominal,worst,separate
for a,p,w in [(36,175,92),(0,200,92),(0,196,92),(0,190,120),(0,187,140)]:
    n,b,s=calc(a,p,w)
    print(f"{a}/{p}/W{w}: nominal {tuple(round(v,2) for v in n)}; worst {tuple(round(v,2) for v in b)}; separate centered guides margins {tuple(round(v,2) for v in s)}")
n,b,s=calc(0,196)
assert n==(19.5,13,86)
assert min(b[:2])>10 and b[2]>76
assert calc(0,200)[1][0]<2
assert calc(0,196)[0][2]>2.7*calc(36,175)[0][2]
for w,p in [(120,190),(140,187)]:
    assert min(calc(0,p,w)[1][:2])>10
for cg in [.155,.205]:
    m=17*9.81*(.265-cg)
    print(f"CG {cg*1000:.0f} mm: moment {m:.2f} Nm, F at 0.4m {m/.4:.2f} N")
print("PASS conservative plan, no electrical/thermal/structural certification")
