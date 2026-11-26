"""Geometric / structural screening only; no fastener or thermal certification."""
import pathlib,re,math
P=pathlib.Path(__file__).parent
def mesh(p):
 v=[tuple(map(float,x)) for x in re.findall(r'vertex\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)',p.read_text())]
 assert len(v)%3==0 and v
 a=[min(x[i] for x in v) for i in range(3)];b=[max(x[i] for x in v) for i in range(3)]
 volume=0
 for i in range(0,len(v),3):
  x,y,z=v[i:i+3]
  cross=(y[1]*z[2]-y[2]*z[1],y[2]*z[0]-y[0]*z[2],y[0]*z[1]-y[1]*z[0])
  volume+=sum(t*u for t,u in zip(x,cross))/6
 return a,b,abs(volume)
for f in ('A','B','A_metal','B_metal'):
 a,b,v=mesh(P/(f+'.stl'))
 assert all(a[i]>=lo-1e-3 and b[i]<=hi+1e-3 for i,(lo,hi) in enumerate(zip([-60,-142,0],[60,142,280])))
 print(f, 'bounds',a,b,'vol cm3',round(v/1000,2),'Al-equivalent g',round(v*.0027,1))
_,_,v0=mesh(P.parent/'adapter.stl')
_,_,vB=mesh(P/'B.stl')
print('P0.1 -> B full-CAD volume reduction %',round(100*(1-vB/v0),1))
_,_,vA=mesh(P/'A_metal.stl')
_,_,vBm=mesh(P/'B_metal.stl')
_,_,vAc=mesh(P/'A.stl')
_,_,vBc=mesh(P/'B.stl')
print('Metal + pads at 1.2 g/cm3 A/B g',round(vA*.0027+(vAc-vA)*.0012,1),round(vBm*.0027+(vBc-vBm)*.0012,1))
def section(rects):
 A=sum(w*h for x,z,w,h in rects);cx=sum((x+w/2)*w*h for x,z,w,h in rects)/A
 I=sum(h*w**3/12+w*h*(x+w/2-cx)**2 for x,z,w,h in rects)
 edge=max(cx-min(x for x,z,w,h in rects),max(x+w for x,z,w,h in rects)-cx)
 return I,edge
F=2*9.81*3/2;E=69000
I,e=section([(0,0,2,25),(-13,23,13,2)])
for name,I,e,L,beam in [
 ('A L25x15x2',I,e,225,True),
 ('B rejected L15x10x1.5',*section([(0,0,1.5,15),(1.5,0,8.5,1.5)]),190,False),
 ('B selected 12x15x1.5',(15*12**3-12*9**3)/12,6,190,False)]:
 M=F*L/(4 if beam else 1);stress=M*e/I;delta=F*L**3/((48 if beam else 3)*E*I)
 print(name,'I',round(I,2),'sigma MPa',round(stress,2),'deflection mm',round(delta,3))
 if 'selected' in name: assert delta<1
print('All geometry envelope checks passed; ideal bending screen only, joints and alloy to validate.')
