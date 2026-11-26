"""Static CAD visualisation. Colours distinguish parts; no fabricated hardware claims."""
from pathlib import Path
import re,math
import numpy as np
from PIL import Image,ImageDraw,ImageFont
P=Path(__file__).parent
def mesh(path):
 return np.array([list(map(float,m)) for m in re.findall(r'vertex\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)',path.read_text())]).reshape(-1,3,3)
parts={k:mesh(P/f'{k}.stl') for k in ['bench','carrier','A','B','screws','yoke','tools']}
parts['pc']=mesh(P.parent/'pc.stl')
colors={'bench':(105,128,141),'carrier':(171,189,200),'A':(202,157,94),'B':(202,157,94),'pc':(43,48,54),'screws':(31,47,55),'yoke':(224,145,55),'tools':(65,173,215)}
def render(mode,variant):
 W,H=1600,1100;yaw=-.64;pitch=.34
 cy,sy,cp,sp=math.cos(yaw),math.sin(yaw),math.cos(pitch),math.sin(pitch)
 offset=110 if mode=='lifted' else 0
 target=np.array([0,0,190 if offset else 125]);scale=1.7 if offset else 2.0
 im=Image.new('RGB',(W,H),'#14212b');pixels=np.array(im);zb=np.full((H,W),np.inf)
 def project(v):
  v=v-target;a=cy*v[...,0]-sy*v[...,1];b=sy*v[...,0]+cy*v[...,1];z=v[...,2]
  return np.stack([W/2+a*scale,590-(z*cp+b*sp)*scale,b*cp-z*sp],axis=-1)
 def drawpart(k,zoff=0):
  for tri in parts[k]+np.array([0,0,zoff]):
   p=project(tri);x0=max(0,int(np.floor(p[:,0].min())));x1=min(W-1,int(np.ceil(p[:,0].max())));y0=max(0,int(np.floor(p[:,1].min())));y1=min(H-1,int(np.ceil(p[:,1].max())))
   if x1<x0 or y1<y0:continue
   a,b,c=p;den=(b[1]-c[1])*(a[0]-c[0])+(c[0]-b[0])*(a[1]-c[1])
   if abs(den)<1e-8:continue
   X,Y=np.meshgrid(np.arange(x0,x1+1)+.5,np.arange(y0,y1+1)+.5)
   u=((b[1]-c[1])*(X-c[0])+(c[0]-b[0])*(Y-c[1]))/den;v=((c[1]-a[1])*(X-c[0])+(a[0]-c[0])*(Y-c[1]))/den;w=1-u-v;z=u*a[2]+v*b[2]+w*c[2]
   D=zb[y0:y1+1,x0:x1+1];pp=pixels[y0:y1+1,x0:x1+1];mask=(u>=-1e-8)&(v>=-1e-8)&(w>=-1e-8)&(z<D)
   n=np.cross(tri[1]-tri[0],tri[2]-tri[0]);norm=np.linalg.norm(n) or 1
   light=.65+.35*abs(np.dot(n/norm,[-.4,-.4,.82]));col=colors[k];m=tri.mean(axis=0)
   if k=='pc':
    if m[1]<-135.11 and m[0]<-25:col=(155,39,44)
    elif m[1]<-135.13 or m[0]>32.5:col=(170,180,186)
   D[mask]=z[mask];pp[mask]=tuple(round(a*light) for a in col)
 drawpart('bench')
 for k in ['carrier',variant,'pc']:drawpart(k,offset)
 drawpart('yoke',offset) if offset else drawpart('screws')
 im=Image.fromarray(pixels);d=ImageDraw.Draw(im);font=lambda n:ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',n)
 d.text((55,42),'H–7 / R–8.1 · n4 / SERVICEDOCK P0.3',font=font(26),fill='#93d0e0')
 d.text((55,94),('Estrazione a freddo · +110 mm' if offset else 'Banco pilota · quattro ritenute verticali')+' · '+variant,font=font(39),fill='#edf4f8')
 d.text((55,1030),'380 × 310 mm banco  •  120 × 284 × 280 mm carrier  •  nessuna approvazione di fabbricazione',font=font(20),fill='#b5c7d1')
 im.save(P/(mode+'.png'))
render('locked','A');render('lifted','B')
