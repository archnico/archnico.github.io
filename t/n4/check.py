import pathlib,re,math
p=pathlib.Path(__file__).parent
for name in ('dummy','carrier','adapter','pc','guides','cables'):
 t=(p/f'{name}.stl').read_text()
 v=[tuple(map(float,x)) for x in re.findall(r'vertex\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)',t)]
 assert v
 a=[min(x[i] for x in v) for i in range(3)]
 b=[max(x[i] for x in v) for i in range(3)]
 print(name,a,b)
 if name=='dummy': assert a==[0,0,0] and b==[65,195,190]
 elif name=='guides': assert a==[-69,-122.5,0] and b==[69,122.5,100]
 else:
  for i,(lo,hi) in enumerate(zip([-60,-142,0],[60,142,280])):
   assert a[i]>=lo-1e-3 and b[i]<=hi+1e-3,(name,i,a,b)
for w,d,h in [(54,188,185),(58.7,191,185),(65,195,190)]:
 assert -135+d<=142 and 23.5+h+5<=280
 assert 45-w/2>=10 and 43-w/2>=10
 assert 190-w<200 and 190-60-w/2<200
 print(w,d,h,'rear',277-d,'left',45-w/2,'right',43-w/2,'adjacent same',190-w,'adjacent full',130-w/2)
assert 1325-((6*190)+138)==47
assert 190-138==52
I=(20**4-17**4)/12
print('ideal tube deflection mm',29.43*104**3/(48*69000*I))
print('PASS envelope, pitch, dummy, STL bounds, vent infeasibility screen; NO collision/fastener/structural or thermal certification')
