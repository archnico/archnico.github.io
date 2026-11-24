#!/usr/bin/env python3
"""Analytical study only: no CFD, no construction approval."""
from math import sin, cos, radians, isclose
from pathlib import Path

def geom(a,p):
    t=radians(a)
    x=6*p+92*cos(t)+284*sin(t)
    y=92*sin(t)+284*cos(t)
    g=p*cos(t)-110
    return x,y,g,x<1286 and y<281 and g>0

for a,p in [(42,164),(35,164),(38,164),(38,170),(38,172),(39,170),(39,172)]:
    x,y,g,ok=geom(a,p)
    print(f"{a:2} deg / {p}: X={x:.2f} Y={y:.2f} gap={g:.2f} fit={ok}")
assert geom(42,164)[3]
assert not geom(35,164)[3]
assert geom(38,170)[3] and geom(38,172)[3]
assert geom(39,170)[3]
assert geom(38,170)[2] > 2*geom(42,164)[2]
assert geom(38,170)[0] < geom(38,172)[0]
for p in [210,420,630]:
    q=3600*p/(1.2*1005*10)
    print(f"{p} W, deltaT 10 K: {q:.1f} m3/h")
assert isclose(3600*420/(1.2*1005*10),125.3731343283582)
print("PASS analytic geometry and heat balance; no hardware/CFD validation")
