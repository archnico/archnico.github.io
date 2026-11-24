#!/usr/bin/env python3
"""C120 interface and scenario budget, not a construction certificate."""
from math import cos,sin,radians,isclose
W,P,L,D=120,190,1325,310
g=W+18
assert 6*P+g==1278
assert (L-6*P-g)/2==23.5
assert (D-284)/2==13
assert P-g==52 and P-W==70
assert (W-92)/2==14
a=radians(1)
mx=(L-6*(P+.5)-(142*cos(a)+286*sin(a)))/2
my=(D-(142*sin(a)+286*cos(a)))/2
gap=(P-.5)-(142*cos(a)+286*sin(a))
assert min(mx,my)>10 and gap>42
assert 52<63.5<86
assert 107-86==21
assert 284-175==65+44
assert 284-244<65
base=14.585-1.3+.02145+14*.028*.1154
assert base+7*1.3>20
for n in (0,1,2,3,5,7): print(n,'ATX on top:',round(base+1.3*n,2),'kg scenario')
print(f'C120 margins worst {mx:.2f}/{my:.2f}; independent gap {gap:.2f}; PASS analytic only')
