"""Tavola quotata P0.2 nominale (non disegno esecutivo)."""
from pathlib import Path
S=[]
def raw(v):S.append(v)
def rect(x,y,w,h,fill='none',stroke='#476272',sw=1):raw(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"/>')
def line(x,y,x2,y2,col='#4f7081',sw=1,dash=''):raw(f'<line x1="{x}" y1="{y}" x2="{x2}" y2="{y2}" stroke="{col}" stroke-width="{sw}" {("stroke-dasharray="+chr(34)+dash+chr(34)) if dash else ""}/>')
def txt(x,y,t,size=15,col='#183b4c',anchor='start',weight=400):raw(f'<text x="{x}" y="{y}" font-family="sans-serif" font-size="{size}" font-weight="{weight}" fill="{col}" text-anchor="{anchor}">{t}</text>')
def dim(x,y,x2,y2,t,vert=False):
 line(x,y,x2,y2,'#196c8b');raw(f'<path d="M{x} {y} l{(-5 if vert else 0)} {0 if vert else -5} m{(5 if vert else 0)} {0 if vert else 5} l{(5 if vert else 0)} {0 if vert else 5}" stroke="#196c8b" fill="none"/>')
 if vert:
  line(x-5,y,x+5,y,'#196c8b');line(x2-5,y2,x2+5,y2,'#196c8b');txt(x+8,(y+y2)/2,t,13,'#196c8b')
 else:
  line(x,y-5,x,y+5,'#196c8b');line(x2,y2-5,x2,y2+5,'#196c8b');txt((x+x2)/2,y-7,t,13,'#196c8b','middle')
raw('<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="800" viewBox="0 0 1200 800">')
rect(0,0,1200,800,'#f4f7f8','none')
txt(40,49,'LA TORRE / H-7 R-8.1',20,'#247189',weight=700)
txt(40,88,'n4 · U-Fujitsu P0.2 — tavola dimensionale di studio',27,weight=700)
txt(40,113,'Quote in mm · dima massima 65 × 195 × 190 · NO-GO alla fabbricazione',16)
# side elevation Y/Z
k=1.35; ox=90; oy=530
X=lambda y:ox+(y+142)*k; Z=lambda z:oy-z*k
txt(ox,138,'LATO X− / A VESA OEM',17,weight=700)
rect(ox,Z(280),284*k,280*k,'none','#578594')
rect(X(-135),Z(213.5),195*k,190*k,'#d5dde0','#344f5d',1.5)
for y in [-127.5,112.5]:rect(X(y),Z(270),15*k,255*k,'#a6bac5','#58788a')
rect(X(-112.5),Z(270),225*k,15*k,'#a6bac5','#58788a')
for z in [68.5,168.5]:
 rect(X(-112.5),Z(z+12.5),225*k,25*k,'#f0c78a','#af7b37')
 for y in [-87.5,12.5]:
  raw(f'<rect x="{X(y-13.25)}" y="{Z(z+3.25)}" width="{26.5*k}" height="{6.5*k}" rx="{3.25*k}" fill="#fff" stroke="#af7b37"/>')
for y in [-105,30]:rect(X(y-10),Z(21.5),20*k,20*k,'#ecc391','#af7b37')
dim(X(-142),550,X(142),550,'284');dim(X(-135),575,X(60),575,'195 chassis');dim(X(60),600,X(142),600,'82 cavi')
dim(X(-87.5),Z(168.5)-35,X(12.5),Z(168.5)-35,'100 VESA')
dim(X(12.5)+24,Z(168.5),X(12.5)+24,Z(68.5),'100',True)
dim(49,Z(280),49,Z(0),'280',True)
txt(X(-135),Z(23.5)+17,'Z=23,5 appoggio',12)
# plan x/y
k2=1.35; ox2=591; oy2=165
PX=lambda x:ox2+(x+69)*k2; PY=lambda y:oy2+(y+142)*k2
txt(550,138,'PIANTA / INTERFACCIA C120',17,weight=700)
rect(PX(-60),PY(-142),120*k2,284*k2,'none','#578594')
rect(PX(-32.5),PY(-135),65*k2,195*k2,'#d5dde0','#344f5d')
for x in [-69,63]:
 for y in [-122.5,97.5]:rect(PX(x),PY(y),6*k2,25*k2,'#a6bac5','#58788a')
for y in [-105,30]:rect(PX(-52),PY(y-10),104*k2,20*k2,'#f0c78a','#af7b37')
rect(PX(-32.5),PY(60),65*k2,82*k2,'#c4e8ef','#328eab')
dim(PX(-69),PY(142)+26,PX(69),PY(142)+26,'138 guide')
dim(PX(-60),PY(142)+50,PX(60),PY(142)+50,'120 carrier')
dim(PX(-32.5),PY(142)+74,PX(32.5),PY(142)+74,'65 dima')
txt(PX(-32.5),PY(60)+24,'82 cavi',13)
txt(PX(-60),PY(-135)+23,'FRONTE',12)
# front 
k3=1.35; of=905; oz=530
F=lambda x:of+(x+69)*k3; Q=lambda z:oz-z*k3
txt(865,138,'FRONTE / VARIANTE B',17,weight=700)
rect(F(-60),Q(280),120*k3,280*k3,'none','#578594')
rect(F(-32.5),Q(213.5),65*k3,190*k3,'#394751','#344f5d')
rect(F(-28.5),Q(205.5),3*k3,174*k3,'#a62b35','#a62b35')
rect(F(43),Q(216.5),12*k3,195*k3,'#f0c78a','#af7b37')
rect(F(24.5),Q(218.5),30.5*k3,3*k3,'#f0c78a','#af7b37')
rect(F(-52),Q(21.5),104*k3,20*k3,'#f0c78a','#af7b37')
for x in [-69,63]:rect(F(x),Q(100),6*k3,100*k3,'#a6bac5','#58788a')
dim(F(-60),550,F(60),550,'120')
dim(F(-32.5),575,F(32.5),575,'65')
dim(F(32.5),Q(175),F(43),Q(175),'10,5')
# notes
rect(40,635,1120,125,'#e7eef1','none')
txt(57,660,'NOTE DI PROGETTO',15,weight=700)
txt(57,683,'A: due traversine a L25×15×2, lunghezza 225; asole 26,5×6,5 soltanto ipotesi. Cover e viti OEM da rilevare.',15)
txt(57,706,'B: due montanti tubolari 12×15×1,5 con ritenuta positiva rimovibile, non morsa. Posizioni da mappa griglie.',15)
txt(57,729,'Contatti e giunti schematici; non ricavare quote di foratura, filetti o lunghezze viti da questa tavola.',15)
raw('</svg>')
Path(__file__).with_name('tavola.svg').write_text('\n'.join(S))
