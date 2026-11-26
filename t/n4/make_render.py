import pathlib,re,math
import numpy as np
from PIL import Image,ImageDraw,ImageFont
P=pathlib.Path(__file__).parent
meshes={}
for name in ('carrier','adapter','pc','guides','cables'):
 s=(P/f'{name}.stl').read_text()
 v=np.array([list(map(float,i)) for i in re.findall(r'vertex\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)',s)]).reshape(-1,3,3)
 meshes[name]=v
colors={'carrier':(160,181,192),'adapter':(193,155,101),'pc':(45,49,52),'guides':(87,106,119),'cables':(72,147,177),'base':(86,105,116)}
def box(x,y,z,w,d,h):
 v=np.array([[x,y,z],[x+w,y,z],[x+w,y+d,z],[x,y+d,z],[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]])
 return np.array([v[f] for f in [[0,3,2],[0,2,1],[4,5,6],[4,6,7],[0,1,5],[0,5,4],[1,2,6],[1,6,5],[2,3,7],[2,7,6],[3,0,4],[3,4,7]]])
def render(mode,filename):
 W,H=1600,1000
 im=Image.new('RGB',(W,H),'#17232d'); dr=ImageDraw.Draw(im)
 font=lambda n: ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',n)
 yaw=-.9 if mode!='tower' else -.28; pitch=.42; cy,sy,cp,sp=math.cos(yaw),math.sin(yaw),math.cos(pitch),math.sin(pitch)
 target=np.array([570,0,100] if mode=='tower' else [0,0,174 if mode=='exploded' else 130])
 scale=1.04 if mode=='tower' else 2.0
 def project(v):
  v=v-target; a=cy*v[...,0]-sy*v[...,1]; b=sy*v[...,0]+cy*v[...,1]; z=v[...,2]
  return np.stack([W/2+a*scale,520-(z*cp+b*sp)*scale,b*cp-z*sp],axis=-1)
 faces=[]
 def add(name,t,offset=(0,0,0)):
  for tri in t+np.array(offset):
   pr=project(tri); n=np.cross(tri[1]-tri[0],tri[2]-tri[0]); norm=np.linalg.norm(n) or 1; lit=.62+.38*abs(np.dot(n/norm,[-.4,-.4,.82])); color=colors[name]
   if name=='pc':
    m=tri.mean(axis=0)
    if m[1]<-135.11 and m[0]<-25:color=(165,32,37)
    elif m[1]<-135.13:color=(165,171,176)
    elif m[0]>32.5:color=(180,185,189)
   faces.append((pr,tuple(int(c*lit) for c in color)))
 for k,v in meshes.items():
  if k!='cables': add(k,v,(0,0,105 if mode=='exploded' and k=='pc' else 40 if mode=='exploded' and k=='adapter' else 0))
 if mode=='tower':
  for i in range(1,7):add('guides',meshes['guides'],(i*190,0,0))
  for y in [-155,135]:add('base',box(-92.5,y,-20,1325,20,20))
  for i in range(7):add('base',box(i*190-10,-135,-20,20,270,20))
 pixels=np.array(im); depth=np.full((H,W),np.inf)
 for poly,col in faces:
  x0=max(0,int(np.floor(poly[:,0].min())));x1=min(W-1,int(np.ceil(poly[:,0].max())))
  y0=max(0,int(np.floor(poly[:,1].min())));y1=min(H-1,int(np.ceil(poly[:,1].max())))
  if x1<x0 or y1<y0:continue
  X,Y=np.meshgrid(np.arange(x0,x1+1)+.5,np.arange(y0,y1+1)+.5)
  a,b,c=poly
  den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
  if abs(den)<1e-9:continue
  u=((b[1]-c[1])*(X-c[0])+(c[0]-b[0])*(Y-c[1]))/den
  v=((c[1]-a[1])*(X-c[0])+(a[0]-c[0])*(Y-c[1]))/den
  w=1-u-v; z=u*a[2]+v*b[2]+w*c[2]
  Z=depth[y0:y1+1,x0:x1+1]; patch=pixels[y0:y1+1,x0:x1+1]
  mask=(u>=-1e-8)&(v>=-1e-8)&(w>=-1e-8)&(z<Z)
  Z[mask]=z[mask];patch[mask]=col
 im=Image.fromarray(pixels);dr=ImageDraw.Draw(im)
 dr.text((60,55),'H–7 / R–8.1  ·  MODULO PIONIERE',font=font(24),fill='#87cddc')
 dr.text((60,100),{'assembly':'n4 / C120 + U-Fujitsu','exploded':'n4 / Vista esplosa','tower':'n4 / Prima sede della Torre'}[mode],font=font(44),fill='#f2f4f6')
 dr.text((60,915),'DIMA 65 × 195 × 190 mm   •   C120 120 × 284 × 280 mm   •   STUDIO / NO-GO FABBRICAZIONE',font=font(20),fill='#b5c6d1')
 im.save(P/filename)
for mode in ['assembly','exploded','tower']:render(mode,mode+'.png')
