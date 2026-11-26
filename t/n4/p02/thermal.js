// R8.1 / P0.2 — conservative orthogonal clearance screening, not thermal qualification.
// Coordinates X lateral, Y front(-)/rear(+), Z upward. Dima default.
const MODELS={dummy:[65,195,190],Q510:[54,188,185],Q910:[54,188,185],Q520:[58.7,191,185],Q920:[58.7,191,185]};
const FACES={left:[0,-1,1,2],right:[0,1,1,2],front:[1,-1,0,2],rear:[1,1,0,2],top:[2,1,0,1],bottom:[2,-1,0,1]};
function geometry(o){
 const [w,d,h]=MODELS[o.model],front=-135,rear=front+d,sole=23.5;
 const pc=[[-w/2,front,sole],[w/2,rear,sole+h]];
 const ob=[];function b(n,x,y,z,W,D,H){ob.push({n,lo:[x,y,z],hi:[x+W,y+D,z+H]})}
 for(let x of [-60,58.5])b('Longherone C120',x,-142,0,1.5,284,15);
 for(let y of [-142,127])b('Testata C120',-45,y,0,90,15,15);
 for(let y of [-127.5,112.5])b('Montante A1',-60,y,15,15,15,255);
 b('Traversa superiore A1',-60,-112.5,255,15,225,15);
 // Diagonal bbox subdivided conservatively so it does not behave like an invented full panel.
 for(let i=0;i<12;i++)b('Controvento A1',-59,-119+i*228/12,18+i*237/12,2,228/12+10,237/12+10);
 for(let j=0;j<7;j++)for(let x of [-66,66])for(let y of [-110,110])b(j===0?'Guida propria':'Guida sede '+(j+1),j*190+x-3,y-12.5,0,6,25,100);
 for(let y of [-105,30])b('Sella inferiore',-52,y-10,1.5,104,20,20);
 if(o.variant==='A'){
  for(let z of [sole+h/2-50,sole+h/2+50]){
   b('Traversina VESA',-59,-112.5,z-12.5,15,225,25);
   for(let y of [-127.5,112.5])b('Attacco traversina VESA',-58,y,z-12.5,14,15,25)
  }
 }else{
  for(let y of [-105,30]){
   for(let x of [-w/2-5,w/2+2])b('Ganascia laterale',x,y-8,21.5,3,16,14);
   b('Montante tubolare U-Fujitsu',43,y-7.5,21.5,12,15,h+5);
   b('Dito di ritenuta',w/2-8,y-9.5,sole+h+2,55-(w/2-8),15.5,3)
  }
  for(let y of [front-4,rear+2])for(let x of [-w/2+2,w/2-10])b('Riscontro assiale',x,y,11.5,8,2,22)
 }
 if(o.next>0)b('Carrier occupato più vicino',190*o.next-60,-142,0,120,284,280);
 b('Parete posteriore',-2000,155+o.wallRear,-100,4000,10,1000);
 b('Ostacolo frontale',-2000,-155-o.wallFront-10,-100,4000,10,1000);
 b('Ostacolo superiore',-2000,-1000,o.top,4000,2000,10);
 b('Parete a sinistra',-92.5-o.leftWall-10,-1000,-100,10,2000,1000);
 return {pc,ob};
}
function screen(o){
 const {pc,ob}=geometry(o),[axis,dir,u,v]=FACES[o.face];let f=pc[dir>0?1:0][axis],du=pc[1][u]-pc[0][u],dv=pc[1][v]-pc[0][v];
 const r=[o.u0,o.u1,o.v0,o.v1];
 if(!(r[0]>=0&&r[2]>=0&&r[1]>r[0]&&r[3]>r[2]&&r[1]<=du&&r[3]<=dv))return {error:'Rettangolo fuori dalla faccia o non valido.',du,dv};
 let u0=pc[0][u]+r[0],u1=pc[0][u]+r[1],v0=pc[0][v]+r[2],v1=pc[0][v]+r[3];
 let hits=[];
 for(let b of ob){
  if(b.hi[u]<=u0||b.lo[u]>=u1||b.hi[v]<=v0||b.lo[v]>=v1)continue;
  if(dir>0&&b.hi[axis]<=f||dir<0&&b.lo[axis]>=f)continue;
  const dist=Math.max(0,dir>0?b.lo[axis]-f:f-b.hi[axis]);
  if(dist<200)hits.push([b.n,Math.round(dist*10)/10])
 }
 hits.sort((a,b)=>a[1]-b[1]);return {hits,du,dv,exception:o.face==='bottom'};
}
if(typeof module!=='undefined')module.exports={geometry,screen,MODELS,FACES};
