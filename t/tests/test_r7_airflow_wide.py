#!/usr/bin/env python3
from math import cos,sin,radians,isclose
from itertools import product

def geom(a,p,w=92,d=284,g=18):
    t=radians(abs(a))
    return 6*p+w*cos(t)+d*sin(t),w*sin(t)+d*cos(t),p*cos(t)-w-g

def bounds(a,p,L,D):
    vals=[geom(a+da,p+dp,w,d,g) for da,dp,w,d,g in product((-1,0,1),(-.5,.5),(92,94),(284,286),(18,20))]
    t=radians(a); e=radians(1)
    return (L-max(v[0] for v in vals))/2,(D-max(v[1] for v in vals))/2,min(v[2] for v in vals),(p-.5)*cos(t)-94*cos(e)-286*sin(e)-20

cases=[(42,164,1310,305),(38,175,1325,305),(35,175,1325,310),(36,175,1325,310),(37,175,1325,310),(36,176,1325,310),(0,200,1325,310)]
for a,p,L,D in cases:
    x,y,g=geom(a,p); mx,my,b,ind=bounds(a,p,L,D)
    print(f"{a}/{p} {L}x{D}: gap {g:.2f}; nominal margins {(L-x)/2:.2f}/{(D-y)/2:.2f}; sensitivity {mx:.2f}/{my:.2f}, gap {b:.2f}, independent {ind:.2f}")
x,y,g=geom(36,175)
assert (1325-x)/2>=12 and (310-y)/2>=12
assert all(v>=10 for v in bounds(36,175,1325,310)[:2])
assert bounds(36,175,1325,310)[3]>20
assert g>2.6*geom(42,164)[2]
assert bounds(36,176,1325,310)[0]<10
assert isclose(0.39*(2*.015+5*.005),.02145)
print("PASS Wide study geometry, sensitivity and incremental profile mass; no construction approval")
