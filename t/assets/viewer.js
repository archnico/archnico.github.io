(()=>{'use strict';
const canvas=document.getElementById('c'),vp=document.getElementById('vp'),ctx=canvas.getContext('2d'),tip=document.getElementById('tooltip');
const $=id=>document.getElementById(id);
const C={guide:'#81d6d8',guide2:'#2e858f',frame:'#5bb49e',frame2:'#447c77',corner:'#dfa962',pcb:'#214e58',pcb2:'#3a7981',chip:'#1b343c',metal:'#90adb6',disk:'#668c9a',diskEdge:'#b3c7c8',psu:'#4c6570',plug:'#65a7c2',orange:'#dfa962',cable:'#da817b',fan:'#8cb9a6',accent:'#f9d48b',empty:'#4c6570',ups:'#465665',upsFace:'#627888',upsBackup:'#63c7bb',upsSurge:'#d7a65f'};
// BEGIN REGISTRO MISURE (generato da Registro/registro_torre_v1.json)
const M={"cab":{"width":1370,"depth":355,"height":450,"lipHeight":90,"lipThickness":10},"desk":{"width":1000,"depth":550,"height":800},"r2":{"profile":40,"sideClearance":10,"topRailBottom":560,"topRailTop":600,"platformBottom":600,"platformThickness":18,"frontOverhang":95,"frameWidth":1470,"frameDepth":450},"r3":{"supportHeight":105,"baseThickness":12,"estimateWeightKg":17.8,"targetWeightKg":17,"frontOverhang":95}};
// END REGISTRO MISURE
const state={n:7,yaw:2.77,pitch:.45,zoom:1,explode:0,xray:false,labels:true,disks:true,wiring:true,grid:false,dims:false,clearance:false,selected:null,selectedName:'',focusIndex:0,scene:'tower',standpads:false,moduleExploded:false,lifted:null,locked:true,showUPS:false,loadEstimate:450,cooling:true,airflow:false,heat:450,delta:8};

// Layer controls are independent of scene/camera and never mutate source geometry.
const DEFAULT_LAYERS={
 pareti:true,finestra:true,mobilio:true,haugaStruttura:true,haugaCassetti:true,haugaPomelli:true,monitor:true,bracci:true,
 scrivania:true,sedia:true,audio:true,periferiche:true,usbC:true,das:true,hub:true,connessioneDas:true,usbDrives:true,telaio:true,baseTerra:true,moduli:true,schede:true,
 dischi:true,ventole:true,cavi:true,ups:false,semitrasparente:false,
 isola:false,quote:false,griglia:false,etichette:true,ingombri:false
};
state.layers={...DEFAULT_LAYERS};state.isolate=false;
function layerFor(group){
 if(!group)return null;
 if(/^PCB[1-7]$/.test(group))return 'schede';
 if(/^(P|A)[1-7]$/.test(group))return 'moduli';
 if(/^F[1-6]$/.test(group)||group==='FANMOUNT'||group==='AIRFLOW')return 'ventole';
 if(['WALL','WALLCUT'].includes(group))return 'pareti';
 if(group==='WINDOW'||group==='ROOMLABEL')return 'finestra';
 if(['WHITECAB','LIP','RACK','DARKDRAWER','PRINTER','RACKMODEM','HAUGABACK','HAUGASHELF','HAUGAOPEN','HAUGAGUIDE','HAUGADRAWER','HAUGAKNOB'].includes(group))return 'mobilio';
 if(['DESK','LAPTOP','LAPTOPSTAND'].includes(group))return 'scrivania';
 if(['KEYBOARD','MOUSE','PHONE','PHONESTAND'].includes(group))return 'periferiche';
 if(group==='USBC')return 'usbC';
 if(group==='DAS4')return 'das';
 if(group==='HUB4')return 'hub';
 if(group==='USBDRIVE')return 'usbDrives';
 if(group==='DASCABLE')return 'connessioneDas';
 if(['STANDRAIL','STANDCROSS','STANDPAD','STANDRUBBER','STANDJOINT','FLOORREF'].includes(group))return 'baseTerra';
 if(group==='CHAIR')return 'sedia';
 if(['MONVGA','MONHDMI','MONMID'].includes(group))return 'monitor';
 if(['ARMLEFT','ARMCENTER','ARMRIGHT'].includes(group))return 'bracci';
 if(['AUDIOLEFT','AUDIORIGHT','AUDIOCENTER','DESKSATLEFT','DESKSATRIGHT','SUBWOOFER'].includes(group))return 'audio';
 if(['FRAME','GUIDE','GUIDEFRAME','BACKBONE','DOCK','LOCK','FOOT','ADAPTER','ALIGN','PORTAL','PORTALBRACE','PORTALFOOT','PORTALLOCK','LIGHTSUPPORT','LIGHTBASE','LIGHTPAD'].includes(group))return 'telaio';
 if(group==='STORAGE'||group==='SSD')return 'dischi';
 if(['POWER','IO','NETDUCT','ACDUCT','ACFLEX','NETPATCH','OUTLETAC','OUTLETLAN','FANPOWER','UPSCABLE'].includes(group))return 'cavi';
 if(['UPS','UPSPORT','UPSLOC','UPSCLEAR'].includes(group))return 'ups';
 return null;
}
function isVisibleGroup(group){
 if(group==='GRID')return state.grid;
 if(group==='DIM')return state.dims;
 if(group==='CLEAR')return state.clearance;
 const layer=layerFor(group);
 if(layer!==null&&state.layers[layer]===false)return false;
 const sl=({'WHITECAB':'haugaStruttura','LIP':'haugaStruttura','HAUGABACK':'haugaStruttura','HAUGASHELF':'haugaStruttura',
 'HAUGAOPEN':'haugaStruttura','HAUGAGUIDE':'haugaCassetti','HAUGADRAWER':'haugaCassetti','HAUGAKNOB':'haugaPomelli'})[group];
 return !sl||state.layers[sl]!==false;
}
// The parent reflects all / none / partial, including changes made one layer at a time.
const CHAPTER_LAYERS={
 contesto:['pareti','finestra','mobilio'],
 postazione:['monitor','bracci','scrivania','sedia','audio','periferiche','usbC'],
 torrino:['das','hub','usbDrives','connessioneDas'],
 torre:['telaio','baseTerra','moduli','schede','dischi','ventole','cavi','ups'],
 overlay:['semitrasparente','isola','quote','griglia','etichette','ingombri']
};
function syncLayerControls(){
 for(const el of document.querySelectorAll('[data-layer]')){
  const active=!!state.layers[el.dataset.layer];
  el.classList.toggle('on',active);
  el.setAttribute('aria-checked',String(active));
 }
 for(const button of document.querySelectorAll('[data-group-toggle]')){
  const layers=CHAPTER_LAYERS[button.dataset.groupToggle];
  const selected=layers.filter(layer=>state.layers[layer]).length;
  const mode=selected===0?'false':selected===layers.length?'true':'mixed';
  button.setAttribute('aria-checked',mode);
  button.classList.toggle('on',mode==='true');
  button.classList.toggle('mixed',mode==='mixed');
  button.title=mode==='true'?'Nascondi tutti gli strati':('Mostra tutti gli strati'+(mode==='mixed'?' (selezione parziale)':''));
 }
}
// A single batch redraw keeps the 3D preview responsive when a whole chapter changes.
function setLayers(changes){
 for(const [layer,on] of Object.entries(changes)){
  if(!(layer in state.layers))continue;
  state.layers[layer]=on;
  if(layer==='semitrasparente')state.xray=on;
  if(layer==='isola')state.isolate=on;
  if(layer==='quote')state.dims=on;
  if(layer==='griglia')state.grid=on;
  if(layer==='etichette')state.labels=on;
  if(layer==='ingombri')state.clearance=on;
  if(layer==='ups')state.showUPS=on;
  if(layer==='cavi')state.wiring=on;
  if(layer==='dischi')state.disks=on;
  if(layer==='ventole')state.cooling=on;
 }
 if(state.selected&&!isVisibleGroup(state.selected)){
  state.selected=null;state.selectedName='';$('inspector').hidden=true;
 }
 syncLayerControls();redraw();
}
function toggleLayer(layer,on){setLayers({[layer]:on})}
document.querySelectorAll('[data-group-toggle]').forEach(el=>{
 el.addEventListener('click',event=>{
  event.preventDefault();event.stopPropagation(); // don't collapse the heading
  const layers=CHAPTER_LAYERS[el.dataset.groupToggle];
  // Partial selection counts as "not all": one click completes, next hides.
  const enable=!layers.every(layer=>state.layers[layer]);
  setLayers(Object.fromEntries(layers.map(layer=>[layer,enable])));
 });
});
document.querySelectorAll('[data-layer]').forEach(el=>{
 el.addEventListener('click',()=>toggleLayer(el.dataset.layer,!state.layers[el.dataset.layer]));
});
$('layers-reset').onclick=()=>{
 for(const [layer,active] of Object.entries(DEFAULT_LAYERS))state.layers[layer]=active;
 Object.assign(state,{xray:false,isolate:false,dims:false,grid:false,labels:true,clearance:false,showUPS:false,wiring:true,disks:true,cooling:true});
 state.selected=null;$('inspector').hidden=true;syncLayerControls();redraw();
};
$('clear-quick').onclick=()=>clearSelection();
function openPreset(preset){
 if(preset==='iso'){view('iso');return;}
 if(preset==='autonoma'){scene('standalone');return;}
 scene(preset);
}
document.querySelectorAll('[data-preset]').forEach(el=>el.onclick=()=>openPreset(el.dataset.preset));

let W=0,H=0,dpr=1,faces=[],lines=[],labels=[],pick=[],drag=null,partsFingerprint='';
const partDescriptions={STANDRAIL:'Due longheroni metallici a terra (studio)',STANDCROSS:'Tre traverse basse per ripartire il carico (studio)',STANDPAD:'Pattini stabilizzatori aggiuntivi, opzionali (studio)',STANDRUBBER:'Appoggi antiscivolo sul pavimento (studio)',STANDJOINT:'Piastre di collegamento rimovibili (studio)',FLOORREF:'Suolo di riferimento, NON una piastra in legno',USBDRIVE:'HDD USB esterni: 8 TB su n3 / 4 TB su n2, migrazione non eseguita',DAS4:'DAS a 4 bay SATA indipendenti · inizialmente vuoto',HUB4:'Hub alimentato 4 porte USB · espandibile',DASCABLE:'Collegamento dati alla Torre verso n2',USBC:'Sei USB-C sul lato sinistro della scrivania',KEYBOARD:'Tastiera',MOUSE:'Mouse',PHONE:'Telefono su leggio',PHONESTAND:'Leggio smartphone',LAPTOPSTAND:'Leggio laptop',WINDOW:'Finestra 210 × 160 cm',F1:"Ventola candidata 1",F2:"Ventola candidata 2",F3:"Ventola candidata 3",F4:"Ventola candidata 4",F5:"Ventola legacy 5",F6:"Ventola legacy 6",FANMOUNT:"Supporti ventole rimovibili",FANPOWER:"Cablaggi ventole 12 V",DESKSATLEFT:'Satellite audio 3 · multilivello',DESKSATRIGHT:'Satellite audio 4 · multilivello',WHITECAB:'HAUGA · pannelli',HAUGABACK:'HAUGA · schienale',HAUGASHELF:'HAUGA · ripiano e divisorio',HAUGAOPEN:'HAUGA · vani aperti',HAUGAGUIDE:'HAUGA · guide cassetti',HAUGADRAWER:'HAUGA · due cassetti',HAUGAKNOB:'HAUGA · quattro pomelli',LIP:'HAUGA · spalletta a U',ADAPTER:'Kit storico R-1 NON utilizzabile',PORTAL:'Portale R-2 portante a pavimento',PORTALBRACE:'Controventi laterali portale',PORTALFOOT:'Piedi portale esterni al mobile',PORTALLOCK:'Agganci Torre-portale removibili',LIGHTSUPPORT:'R-3 rialzi metallici su piano HAUGA',LIGHTPAD:'R-3 basi ripartizione carico',LIGHTBASE:'R-3 base reticolare alleggerita',STANDPAD:'Pattino opzionale Torre',OUTLETAC:'Presa elettrica 230 V',OUTLETLAN:'Presa Ethernet RJ45',ACDUCT:'Canaletta elettrica',NETDUCT:'Canaletta LAN',ACFLEX:'Bretella AC',NETPATCH:'Bretella Ethernet',CHAIR:'Sedia gaming a 5 razze',DESK:'Scrivania 45°',RACK:'Mobile multilivello',PRINTER:'Stampante',RACKMODEM:'Modem/router',AUDIOLEFT:'Satellite audio 1',AUDIORIGHT:'Satellite audio 2',SUBWOOFER:'Subwoofer',UPS:'UPS indipendente',MONVGA:'Monitor Acer VGA',MONHDMI:'Monitor HDMI',MONMID:'Terzo monitor intermedio',ARMLEFT:'Braccio VESA sinistro',ARMCENTER:'Braccio VESA centrale',ARMRIGHT:'Braccio VESA destro',POWER:'Alimentazioni Torre',IO:'Porte I/O',STORAGE:'Banchi dischi',FOOT:'Piedi centrali',FLOOR:'Pavimento',WALL:'Pareti',GUIDE:'Guide alte',DOCK:'Sedi a U inferiori',FRAME:'Telaio',LOCK:'Fermi',BACKBONE:'Schienale',GUIDEFRAME:'Traverse superiori'};
function refreshPartPicker(){
 const ids=[...new Set(faces.map(f=>f.group).filter(id=>id&&!['DIM','GRID'].includes(id)&&isVisibleGroup(id)))];
 ids.sort((a,b)=>((partDescriptions[a]||a).localeCompare((partDescriptions[b]||b),'it')));
 const signature=state.scene+'|'+ids.join(',');
 const el=$('part-picker');
 if(signature!==partsFingerprint){
  partsFingerprint=signature;el.replaceChildren();
  const opt=document.createElement('option');opt.value='';opt.textContent='Seleziona un componente…';el.appendChild(opt);
  for(const id of ids){const o=document.createElement('option');o.value=id;o.textContent=partDescriptions[id]||(id.startsWith('P')?'Modulo PC '+id:id.startsWith('A')?'Adattatore '+id:id.startsWith('PCB')?'Scheda '+id:id);el.appendChild(o)}
 }
 el.value=state.selected&&ids.includes(state.selected)?state.selected:'';
}

const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Nominal dimensions verified for 10121124; 100 mm rear routing is an ASSUMED design reserve,
// not a PowerWalker-mandated ventilation clearance. No load is transferred to printed parts.
const UPS={w:99,d:410,h:280,mass:13.1,W:900,VA:1500,batterySockets:4,surgeOnly:4,sideGap:66,serviceRear:110};
function rgb(hex){const a=hex.replace('#','');return [parseInt(a.slice(0,2),16),parseInt(a.slice(2,4),16),parseInt(a.slice(4,6),16)]}
function tint(color,k,alpha=1){const x=rgb(color).map(c=>clamp(Math.round(c*k),0,255));return `rgba(${x[0]},${x[1]},${x[2]},${alpha})`}
function pushBox(x,y,z,sx,sy,sz,color,group='',name='',opa=1,emphasis=false){
 const p=[[x,y,z],[x+sx,y,z],[x+sx,y+sy,z],[x,y+sy,z],[x,y,z+sz],[x+sx,y,z+sz],[x+sx,y+sy,z+sz],[x,y+sy,z+sz]];
 const fs=[[0,3,2,1],[4,5,6,7],[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7]];
 for(let k=0;k<6;k++){faces.push({p:fs[k].map(i=>p[i]),color,group,name,opa,emphasis,normal:[[0,0,-1],[0,0,1],[0,-1,0],[1,0,0],[0,1,0],[-1,0,0]][k]})}
}
// A physical, printable brace represented as a complete rectangular-section prism.
// For the YZ plane it sits behind the motherboard, not across its component face.
function beamYZ(x,y1,z1,y2,z2,web=7,thick=5,color=C.corner,group='ADAPTER',name='Diagonale stampata completa'){
 const dy=y2-y1,dz=z2-z1,L=Math.hypot(dy,dz);if(L<1)return;
 const py=-dz/L*web/2,pz=dy/L*web/2;
 const b=[[x,y1+py,z1+pz],[x,y2+py,z2+pz],[x,y2-py,z2-pz],[x,y1-py,z1-pz]];
 prism([...b,...b.map(v=>[v[0]+thick,v[1],v[2]])],color,group,name);
}
function beamXZ(y,x1,z1,x2,z2,web=8,thick=10,color=C.frame2,group='BACKBONE',name='Diagonale posteriore bassa'){
 const dx=x2-x1,dz=z2-z1,L=Math.hypot(dx,dz);if(L<1)return;
 const px=-dz/L*web/2,pz=dx/L*web/2;
 const b=[[x1+px,y,z1+pz],[x2+px,y,z2+pz],[x2-px,y,z2-pz],[x1-px,y,z1-pz]];
 prism([...b,...b.map(v=>[v[0],v[1]+thick,v[2]])],color,group,name);
}
function prism(p,color,group,name){
 const f=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]];
 for(const a of f){faces.push({p:a.map(i=>p[i]),color,group,name,opa:1,emphasis:false,normal:[.22,-.35,.92]})}
}
// Solid rectangular objects with the same rendering/picking model as the Torre.
// Used by the room layout to rotate desk, monitors and chair in the horizontal plane.
function polyPrism(p,color,group,name,opa=1,emphasis=false){
 const f=[[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]];
 const normals=[[0,0,-1],[0,0,1],[0,-1,0],[1,0,0],[0,1,0],[-1,0,0]];
 for(let i=0;i<f.length;i++) faces.push({p:f[i].map(j=>p[j]),color,group,name,opa,emphasis,normal:normals[i]});
}
function rotBox(cx,cy,z,w,d,h,angle,color,group='',name='',opa=1,emphasis=false){
 const hw=w/2,hd=d/2,cs=Math.cos(angle),sn=Math.sin(angle);
 const bottom=[[-hw,-hd],[hw,-hd],[hw,hd],[-hw,hd]].map(([x,y])=>[cx+x*cs-y*sn,cy+x*sn+y*cs,z]);
 const top=bottom.map(([x,y])=>[x,y,z+h]);
 polyPrism([...bottom,...top],color,group,name,opa,emphasis);
}

// FB-1 canonical tower: herringbone is an IN-PLAN rotation, like angled parking bays.
// 7 identical cartridges, 42 degrees. Envelope study 1310 x 318 mm vs 1345 x 330 mm HAUGA inner top.
// No load on lip; no birch plywood, no HDD inside compute H-7.
const FB={length:1310,depth:318,angle:Math.PI*42/180,pitch:164,first:162,cy:159};
function fbPoint(i,u,v,z){const a=FB.angle,c=Math.cos(a),sn=Math.sin(a);return [FB.first+i*FB.pitch+u*c-v*sn,FB.cy+u*sn+v*c,z];}
function fbBox(i,u,v,z,w,d,h,color,group,name,opa=1){
 const p=fbPoint(i,u,v,z);
 const lifted=state.lifted==='P'+(i+1)?155:0;
 const exploded=state.explode*(i%2?1.3:1.65);
 const adapterLift=state.scene==='module'&&state.moduleExploded&&(group==='PCB'+(i+1)||group==='A'+(i+1))?65:0;
 rotBox(p[0],p[1],z+lifted+exploded+adapterLift,w,d,h,FB.angle,color,group,name,opa);
}
function fbWire(i,pts,color,group,width=2){wire(pts.map(([u,v,z])=>fbPoint(i,u,v,z)),color,width,group);}
function fishboneTower(onlyIndex=null){
 const L=FB.length,D=FB.depth;
 if(onlyIndex===null){
 // These six tall HAUGA risers exist ONLY for the cabinet-based variant, not the floor-standing variant.
 if(state.scene!=='standalone')for(const xx of [100,655,1210])for(const yy of [68,248]){
  pushBox(xx-36,yy-27,0,72,54,5,'#4d6f78','LIGHTPAD','Pattino sul top interno HAUGA: nessuna vite nel mobile',1);
  pushBox(xx-12,yy-12,5,24,24,104,'#739aa1','LIGHTSUPPORT','Rialzo metallico rimovibile di 109 mm totali',1);
  pushBox(xx-25,yy-23,103,50,46,9,C.frame,'FRAME','Nodo portante del telaio aperto',1);
 }
 for(const yy of [14,D-32])pushBox(10,yy,109,L-20,18,18,C.frame,'FRAME','Longherone 2020 candidate, nessuna betulla',1);
 for(const xx of [10,L-28])pushBox(xx,14,109,18,D-28,18,C.frame2,'FRAME','Testata della base metallica aperta',1);
 for(const xx of [190,655,1120])pushBox(xx,30,109,14,D-60,16,C.frame2,'FRAME','Traversa di ripartizione da dimensionare',1);
 }
 const nodeColors=['#db9b66','#72bcc2','#b3c89e','#e4bf6a','#a9a2c9','#70a8dc','#cf817a'];
 for(let i=0;i<7;i++){
  if(onlyIndex!==null&&i!==onlyIndex)continue;
  const id='P'+(i+1),pcb='PCB'+(i+1),ad='A'+(i+1);
  fbBox(i,0,0,127,92,284,10,C.frame2,id,'Cartuccia uniforme 92 × 284 mm ruotata 42° in pianta',1);
  for(const u of [-42,42])fbBox(i,u,0,137,8,282,33,nodeColors[i],id,'Fianco e guida rimovibile della cartuccia',1);
  for(const v of [-137,137])fbBox(i,0,v,137,92,8,16,nodeColors[i],id,'Traversa e fermo cartuccia',1);
  fbBox(i,-14,0,161,5,208,180,C.pcb,pcb,'Scheda madre illustrativa: ingombri e fori da verificare',.98);
  for(const v of [-91,91])fbBox(i,-23,v,162,9,10,176,C.corner,ad,'Adattatore dedicato scheda madre PETG: geometria da rilevare',1);
  fbBox(i,4,-17,236,20,59,55,C.metal,pcb,'CPU e dissipatore rappresentativi',1);
  for(const v of [-75,-58])fbBox(i,-6,v,242,9,8,80,C.pcb2,pcb,'RAM illustrativa',1);
  fbBox(i,19,-105,150,48,67,9,C.disk,'SSD','SSD locale di sistema del nodo',1);
  fbBox(i,12,105,151,62,55,47,C.psu,'POWER','Alimentatore singolo: ingombro e tipo da verificare',1);
  fbBox(i,0,142,171,68,8,17,C.plug,'IO','Porte rete, USB e alimentazione lato posteriore',1);
  fbBox(i,0,-145,163,56,8,16,nodeColors[i],id,'Maniglia frontale accessibile in diagonale',1);
  if(state.wiring)fbWire(i,[[0,134,188],[0,155,188],[0,158,131]],C.plug,'POWER',1.6);
  text3(fbPoint(i,0,-122,355),id,C.accent,11,id,id);
  if([0,2,4,6].includes(i)){
   const f='F'+([0,2,4,6].indexOf(i)+1);
   fbBox(i,0,-142,209,67,12,67,C.fan,f,'Ventola candidata: numero, flusso e sicurezza da validare',.88);
   fbBox(i,0,-150,223,52,3,39,'#163b45',f,'Griglia frontale',.91);
  }
 }
 if(state.wiring&&onlyIndex===null)pushBox(36,D-24,115,L-72,8,10,C.cable,'POWER','Canalina dati ed elettricità dei singoli nodi da separare e dimensionare',.90);
 if(state.dims&&onlyIndex===null){
  dimension([0,0,109],[L,0,109],'1310 mm · LUNGHEZZA STUDIO',[0,-76,0]);
  dimension([L,0,109],[L,D,109],'318 mm · PROFONDITÀ',[70,0,0]);
  text3([655,160,380],'7 PC · SPINA DI PESCE 42° · NO BETULLA / NO HDD',C.accent,11,'DIM');
  text3([655,40,20],state.scene==='standalone'?'APPOGGIO A TERRA · STABILITÀ NON COLLAUDATA':'MASSA NON COLLAUDATA · HAUGA MAX 20 KG',C.accent,10,'DIM');
 }
 if(state.dims&&onlyIndex!==null){
  const x=FB.first+onlyIndex*FB.pitch;
  text3([x,FB.cy,376],'CARTUCCIA P'+(onlyIndex+1)+' · 42° IN PIANTA · 92 × 284 mm',C.accent,10,'DIM');
 }
 $('variant-pill').textContent=onlyIndex===null?'H-7 · FB-1 · SETTE PC':'MODULO · P'+(onlyIndex+1);
 return L;
}

// Dimension geometry and extension lines are fixed in world millimetres; no fake measurements.
function dimension(a,b,label,offset,color=C.accent){
 if(!state.dims)return;
 const v=p=>p.map((q,i)=>q+offset[i]);const aa=v(a),bb=v(b),d=b.map((q,i)=>q-a[i]);
 wire([a,aa],color,.8,'DIM',[3,4],.68);wire([b,bb],color,.8,'DIM',[3,4],.68);
 wire([aa,bb],color,1.25,'DIM',[],.96);
 const nonzero=offset.findIndex(x=>Math.abs(x)>0);const j=nonzero>=0?nonzero:(Math.abs(d[0])>0?1:0);
 for(const p of [aa,bb]){const u=[...p],v=[...p];u[j]-=5;v[j]+=5;wire([u,v],color,1.5,'DIM')}
 text3(aa.map((q,i)=>(q+bb[i])/2),label,color,11,'DIM');
}
function wire(points,color='#7ec6bd',width=1,group='',dash=[],opa=1){lines.push({points,color,width,group,dash,opa})}
function text3(pos,value,color='#bdd6d8',size=11,group='',code=''){labels.push({pos,value,color,size,group,code})}
function fastener(x,y,z,group,name){
 pushBox(x-3,y-3,z-1.5,6,6,3,'#cbd7d5',group,name,1);
 wire([[x-2,y-2,z+2],[x+2,y+2,z+2]],'#34464e',1.15,group);
 wire([[x-2,y+2,z+2],[x+2,y-2,z+2]],'#34464e',1.15,group);
}
// Actual load path of BOTH lower cradles, not free-floating U receivers.
// Dock -> transverse printed web -> two fixed longitudinal rails -> bay-edge crosspieces -> base beams.
function cradleLoadPath(cx){
 for(const sy of [71,291]){
  pushBox(cx-41,sy+9,39,82,13,13,C.frame,'DOCK','Traversino inferiore collegato ai due longheroni fissi e alla sede centrale',1);
  for(const side of [-1,1]){
   const x=side<0?cx-52:cx+30;
   pushBox(x,sy+7,32,22,17,17,C.frame2,'DOCK','Nodo di trasferimento carico: traversa campata -> longherone -> sede',1);
  }
 }
}
function dockSocket(cx,y,id){
 // A U-shaped, open-top receiver.  External cheeks stay on the frame when the cartridge lifts.
 pushBox(cx-17,y,49,7,30,40,C.frame2,'DOCK','Sede femmina fissa: guancia sinistra',1);
 pushBox(cx+10,y,49,7,30,40,C.frame2,'DOCK','Sede femmina fissa: guancia destra',1);
 pushBox(cx-17,y,46,34,30,6,C.frame,'DOCK','Fondo di battuta della sede',1);
 pushBox(cx-21,y+2,49,4,26,27,C.frame,'DOCK','Nervatura laterale fissa',1);
 pushBox(cx+17,y+2,49,4,26,27,C.frame,'DOCK','Nervatura laterale fissa',1);
 for(const d of [-12,12])fastener(cx+d,y+15,86,'DOCK','Fissaggio sede/traversa (schema)');
}
function fitTongue(cx,y,z,id){
 pushBox(cx-8,y+4,52+z,16,22,36,C.corner,id,'Maschio fino al fondo della sede: contatto a quota 52',1,true);
 pushBox(cx-14,y+3,89+z,28,25,7,'#f6c67e',id,'Spalla di appoggio: contatto sopra guance a quota 89',1,true);
 pushBox(cx-8,y+7,52+z,16,16,5,'#a87345',id,'Smusso illustrativo: superficie inferiore d’appoggio',1);
 // Triangular web from each male seat into the moving lower carrier rail.
 const yy=y<180?y+41:y-24;
 beamYZ(cx-8,y+15,85+z,yy,78+z,8,5,C.corner,id,'Costola triangolare stampata: linguetta -> longherone inferiore');
 beamYZ(cx+3,y+15,85+z,yy,78+z,8,5,C.corner,id,'Seconda costola: ripartisce lo sforzo senza affaticare il solo maschio');
}
function lockPin(cx,y,id,station){
 // Removable crossbar is ABOVE the moving shoulder, not interpenetrating it.
 // Shoulder z=89..96; crossbar underside z=100: 4 mm illustrative lift play.
 for(const d of [-23,17])pushBox(cx+d,y-8,84,6,12,22,C.frame2,'LOCK',`Staffa fissa fermo ${station}`,1);
 pushBox(cx-22,y-6,100,45,7,5,C.metal,'LOCK',`Spina anti-sollevamento ${station}: libera sopra la spalla di 4 mm`,1);
 pushBox(cx+21,y-9,98,7,13,10,C.orange,'LOCK',`Presa manuale fermo ${station}`,1);
 fastener(cx+24,y-2,109,'LOCK',`Testa del fermo ${station}, non vite sulla scheda`);
}
// TWO POINTS OF LATERAL RESTRAINT per cartridge: front and back, high above the bottom sockets.
// Carrier verticals: x = cx-4..cx+4.  Receiver cheeks: x <= cx-6 and x >= cx+6.
// Nominal lateral free gap = 2 mm per side; PROTOTYPE TARGET, not a manufacturing clearance.
function upperGuide(cx,station, id){
 const front=station==='front';const y=front?71:309, ybase=front?59:332;
 for(const side of [-1,1]){
  const cheekX=side<0?cx-13.5:cx+6;
  pushBox(cheekX,y,191,7.5,17,97,C.guide,'GUIDE',`Guancia fissa ${station}: fessura 12 mm / montante 8 mm`,1);
  // Short, PRINTED gusset tying the cheek to the continuous OUTBOARD top tie-bar.
  const earX=side<0?cx-14:cx+6;
  pushBox(earX,front?63:323,245,8,13,25,C.guide2,'GUIDE',`Nodo guida ${station} -> traversa alta esterna`,1);
  fastener(side<0?cx-10:cx+10,front?66:338,257,'GUIDE','Bulloneria o incastro rinforzato: da dimensionare');
 }
 // Contrast line marks the freely-open TOP; nothing crosses the cartridge's vertical lifting path.
 wire([[cx-6,y+8,288],[cx+6,y+8,288]],'#c3edf0',1,'GUIDE',[3,3],.8);
}
// Top tie-bars lie OUTSIDE cartridge footprint y=74..323; no obstacle over the handles.
// Their 96 mm printed sections need tested shear/moment-resisting joints, not only snap fit.
function guideBridge(width){
 const n=state.n, left=178,step=96;
 for(const station of ['front','back']){
  const y=station==='front'?56:332;
  for(let i=0;i<n;i++){
   pushBox(left+i*step,y,251,step,11,17,C.frame2,'GUIDEFRAME',`Traversa alta ${station} stampabile a segmenti da 96 mm`,.99);
   if(i>0)pushBox(left+i*step-11,y-1,247,22,13,25,C.guide2,'GUIDEFRAME',`Giunto di taglio/flessione sul bordo campata ${i}`,1);
  }
  // Uprights every third bay transfer top side loads to the lower perimeter frame.
  for(const i of [...new Set([0,3,6,n])]){
   const x=left+i*step;
   pushBox(x-7,y,43,14,13,225,C.frame2,'GUIDEFRAME',`Montante per traversa ${station}: bordo tra tre campate`,1);
   pushBox(x-15,y-4,39,30,21,18,C.frame,'GUIDEFRAME','Piede montante e giunto col telaio inferiore',1);
   beamXZ(y+1,x-26,44,x-4,166,8,9,C.frame,'GUIDEFRAME','Nervatura inclinata verso sinistra');
   beamXZ(y+1,x+4,166,x+26,44,8,9,C.frame,'GUIDEFRAME','Nervatura inclinata verso destra');
  }
 }
}
function rearSkeleton(width){
 // Load path: tongues -> base receiving sockets -> longitudinal beams -> feet.
 // High X braces were REMOVED: they would intersect I/O/service corridor z=120..230.
 // Only slim posts stand at bay boundaries; tall tie stays above the highest I/O panel.
 const xs=[178];for(let i=3;i<state.n;i+=3)xs.push(178+i*96);xs.push(178+state.n*96);
 for(const x of xs){
  pushBox(x-7,386,30,14,13,279,C.frame2,'BACKBONE','Montante stretto sul confine tra i vani (non appoggio delle cartucce)',.97);
  pushBox(x-17,382,27,34,23,19,C.frame,'BACKBONE','Piede di montante sulla trave posteriore',1);
  pushBox(x-15,381,298,30,21,14,C.frame,'BACKBONE','Nodo della traversa alta, sopra le prese',1);
  for(const z of [40,302])fastener(x,404,z,'BACKBONE','Connessione montante/trave · concettuale');
 }
 // Fully joined low triangulated pairs, all under z=112; cables/ports start above z=126.
 for(let k=0;k<xs.length-1;k++){
  const x1=xs[k]+10,x2=xs[k+1]-10,m=(x1+x2)/2;
  beamXZ(384,x1,38,m,104,7,10,'#67b39d','BACKBONE','Controvento basso A: estremi collegati a trave e nodo');
  beamXZ(384,m,104,x2,38,7,10,'#67b39d','BACKBONE','Controvento basso B: estremi collegati a trave e nodo');
  pushBox(m-10,383,94,20,13,16,C.frame,'BACKBONE','Piastra centrale di continuità del controvento basso',1);
  for(const x of [x1,m,x2])pushBox(x-9,384,30,18,13,17,C.frame,'BACKBONE','Piastra di innesto al traverso posteriore',1);
 }
 pushBox(163,383,309,width-326,13,12,C.frame,'BACKBONE','Traversa superiore continua SOLO sopra il corridoio I/O',.96);
 pushBox(163,380,40,width-326,13,13,C.frame2,'BACKBONE','Trave posteriore di base: porta i montanti, NON i cassetti',1);
 // Permanent visual representation of the unobstructed connector band.
 if(state.clearance){
   for(const z of [118,238])wire([[178,435,z],[178+state.n*96,435,z]],'#70c5e7',1.3,'CLEAR',[9,5],.9);
   for(const x of [178,178+state.n*96])wire([[x,435,118],[x,435,238]],'#70c5e7',1,'CLEAR',[9,5],.8);
   if(state.dims)text3([178+state.n*96/2,435,251],'CORRIDOIO PRESE 118–238 mm','#8ad6f3',10,'DIM');
 }
}
function rearPanel(cx,id){
 // I/O service patch faces the back; no exposed backplane/mains shown.
 pushBox(cx-36,416,155,72,7,54,C.metal,'IO','Piastra I/O posteriore rimovibile · '+id,.97);
 pushBox(cx-31,423,179,22,4,16,'#193f4b','IO','RJ45 / LAN · '+id,1);
 pushBox(cx-28,427,184,16,2,6,'#88d39f','IO','Contatti LAN · '+id,1);
 for(let j=0;j<2;j++){
  pushBox(cx-3+j*18,423,180,14,4,9,'#145a7a','IO','Porta USB · '+id,1);
  pushBox(cx-1+j*18,428,182,10,1.5,4,'#99cfe9','IO','Linguetta USB · '+id,1);
 }
 pushBox(cx-31,423,162,60,3,7,'#334f5d','IO','Scarico trazione cablaggi · '+id,1);
 if(state.wiring)for(let j=0;j<3;j++)wire([[cx-26+j*22,200,170],[cx-26+j*22,382,154],[cx-9+j*11,328,183]],C.plug,1.5,'IO');
}
function handle(x,y,z,id){
 // Large inverted-U handle, rigid carrier: no sliding mechanical guides
 wire([[x-2,y-27,z-4],[x-2,y-27,z+20],[x-2,y+27,z+20],[x-2,y+27,z-4]],C.corner,4,id);
 pushBox(x-5,y-29,z+17,10,58,7,C.corner,id,'Maniglia · '+id,.95,true);
}
function fan(x,y,z,r,id){
 const pts=[];for(let a=0;a<=24;a++){let t=2*Math.PI*a/24;pts.push([x,y+Math.cos(t)*r,z+Math.sin(t)*r])}
 wire(pts,C.fan,1.65,id);for(let j=0;j<6;j++){const t=j*Math.PI/3;wire([[x,y+4*Math.cos(t),z+4*Math.sin(t)],[x,y+(r-4)*Math.cos(t+.33),z+(r-4)*Math.sin(t+.33)]],C.fan,1,id)}
}
function diskBank(side,n,width){if(!state.disks)return;const x0=side==='left'?24:width-145;
 pushBox(x0-11,48,42,140,300,7,C.frame2,'STORAGE',`Banco HDD ${side}`,1);
 for(let i=0;i<4;i++){const x=x0+i*30;
  pushBox(x,82,63,24,190,100,C.disk,'STORAGE','HDD 3,5″ · alloggiamento '+(side==='left'?i+1:i+5),.98);
  pushBox(x-1,75,61,26,13,105,C.diskEdge,'STORAGE','Cartuccia HDD estraibile',.95);
  pushBox(x+3,103,165,18,146,3,C.metal,'STORAGE','Copertura disco',.95);
  pushBox(x+3,115,171,18,36,2,'#8cb9bd','STORAGE','Indicazione HDD',.9);
  wire([[x+12,74,168],[x+12,74,183],[x+12,92,183]],C.corner,2.5,'STORAGE');
 }
 text3([x0+55,160,210],side==='left'?'HDD • A':'HDD • B',C.metal,11,'STORAGE');
}
function module(i,wx){const id='P'+(i+1),aid='A'+(i+1),cx=178+(i+.5)*96,zlift=state.explode*(i%2?1.3:1.65)+(state.lifted===id?155:0)+(state.scene==='module'&&state.moduleExploded?44:0);const z=zlift;const s=i%3;
 // fixed receiving cradles and vertical anti-shear slots
 pushBox(cx-40,52,43,8,270,9,C.frame,'DOCK','Longherone fisso sinistro · '+id,1);
 pushBox(cx+32,52,43,8,270,9,C.frame,'DOCK','Longherone fisso destro · '+id,1);
 pushBox(cx-41,65,50,12,31,13,C.frame2,'DOCK','Battuta anteriore fissa',1);
 pushBox(cx+29,296,50,12,31,13,C.frame2,'DOCK','Battuta posteriore fissa',1);
 cradleLoadPath(cx);
 for(const socketY of [71,291]){dockSocket(cx,socketY,id);fitTongue(cx,socketY,z,id)}
 for(const station of ['front','back'])upperGuide(cx,station,id);
 if(state.locked&&!(state.scene==='module'&&state.moduleExploded)){lockPin(cx,86,id,'anteriore');lockPin(cx,306,id,'posteriore')}
 // carrier perimeter, partly rail-like, with board held on standoffs
 pushBox(cx-4,74,72+z,8,249,9,C.corner,id,'Traversa inferiore portante · '+id,.98,true);
 pushBox(cx-4,74,81+z,8,8,231,C.corner,id,'Montante cartuccia · '+id,.98,true);
 pushBox(cx-4,315,81+z,8,8,231,C.corner,id,'Montante cartuccia · '+id,.98,true);
 pushBox(cx-4,74,304+z,8,249,7,C.corner,id,'Traversa superiore · '+id,.98,true);
 // The board-specific adapter is introduced below, after actual illustrative board size is known.
 handle(cx,192,310+z,id);
 // board adapt to donor specific height sizes while retaining identical carrier outer envelope
 const bpY=88+(s===1?10:0),bpZ=94+(s===2?25:0),bph=(s===2?179:204),bpD=(s===1?208:224);
 // PRINTED ADAPTER (orange): complete X behind the PCB, attached at all four corners.
 // Neither the printed X nor the carrier directly touches the copper traces.
 const ay1=bpY+9,ay2=bpY+bpD-9,az1=bpZ+10+z,az2=bpZ+bph-10+z;
 for(const y of [ay1,ay2]){
  pushBox(cx-21,y-4,az1-4,8,8,az2-az1+8,C.corner,aid,'Montante adapter stampato dietro i punti di fissaggio',1);
  for(const hh of [az1,az2])pushBox(cx-23,y-6,hh-6,12,12,12,C.corner,aid,'Nodo stampato pieno, diagonali unite',1);
 }
 beamYZ(cx-24,ay1,az1,ay2,az2,7,5,C.corner,aid,'Diagonale 1/2 completa dell’adattatore');
 beamYZ(cx-24,ay1,az2,ay2,az1,7,5,C.corner,aid,'Diagonale 2/2 completa dell’adattatore');
 pushBox(cx-25,(ay1+ay2)/2-7,(az1+az2)/2-7,10,14,14,'#eec384',aid,'Nodo centrale integrato delle due diagonali',1);
 // Six distinct support positions: printed boss at x<= -11.5; metal standoff
 // spans x=-11.5..-1.5; motherboard (3 mm) begins x=-1.5; screws are outside x=+1.5.
 // These are NOT real hole coordinates until the donor motherboard is surveyed.
 for(const y of [ay1+8,ay2-8])for(const h of [az1+8,(az1+az2)/2,az2-8]){
  pushBox(cx-17.5,y-5,h-5,6,10,10,C.corner,aid,'Piazzola stampata adapter / appoggio distanziatore',1);
  pushBox(cx-11.5,y-2.5,h-2.5,10,5,5,'#cbd7d5',aid,'Distanziatore metallico M3 da 10 mm · schema',1);
  pushBox(cx+1.5,y-3,h-3,3.5,6,6,'#e4d8a9',aid,'Testa vite M3 sul foro reale da verificare',1);
  wire([[cx+4,y-2.5,h],[cx+4,y+2.5,h]],'#5a6264',1,id);
 }
 // Four printed tie-struts make continuous load transmission from the X adapter
 // into the cartridge's bottom and top longitudinal rails (not through the rear frame).
 for(const y of [ay1,ay2]){
   pushBox(cx-20,y-5,76+z,18,10,az1-(76+z)+5,C.corner,aid,'Puntone inferiore: adattatore -> traversa bassa cartuccia',1);
   pushBox(cx-20,y-5,az2-5,18,10,310+z-az2+5,C.corner,aid,'Puntone superiore: adattatore -> traversa alta cartuccia',1);
 }
 // Load path from adapter into the mobile cartridge: four feet integral to the perimeter.
 for(const y of [ay1,ay2])for(const h of [az1,az2]){
   pushBox(cx-23,y-5,h-5,19,10,10,C.corner,aid,'Braccetto solidale a telaio mobile: carico PCB -> cartuccia',1);
 }
 const pcbId='PCB'+(i+1);
 pushBox(cx-1.5,bpY,bpZ+z,3,bpD,bph,C.pcb,pcbId,'Scheda madre · '+id,.94);
 // silkscreen copper traces, cpu and socket
 for(let j=0;j<7;j++){const yy=bpY+16+j*27;wire([[cx+2,yy,bpZ+14+z],[cx+2,yy+16,bpZ+14+z],[cx+2,yy+16,bpZ+22+j%4*10+z]],'#3d8790',.85,pcbId)}
 pushBox(cx+2,bpY+93,bpZ+70+z,8,60,56,C.chip,pcbId,'CPU / socket · '+id,.95);
 pushBox(cx+10,bpY+100,bpZ+77+z,22,46,44,C.metal,pcbId,'Dissipatore CPU · '+id,.95);
 for(let f=0;f<7;f++)pushBox(cx+12+f*2.5,bpY+103,bpZ+80+z,1.2,40,38,'#abc3c1',pcbId,'Lamelle dissipatore',.93);
 fan(cx+36,bpY+122,bpZ+97+z,19,pcbId);
 // RAM banks
 for(let j=0;j<2;j++){
  pushBox(cx+3,bpY+42+j*16,bpZ+66+z,7,7,98,C.pcb2,pcbId,'Modulo RAM',.96);
  for(let k=0;k<6;k++)pushBox(cx+10,bpY+42+j*16,bpZ+73+k*14+z,1,7,8,C.chip,pcbId,'Chip RAM',.95)
 }
 // peripheral chips / sockets / front IO
 pushBox(cx+3,bpY+156,bpZ+25+z,7,40,29,'#172d36',pcbId,'Chipset',.95);
 pushBox(cx+3,bpY+24,bpZ+15+z,7,54,10,C.metal,pcbId,'Slot PCIe',.94);
 pushBox(cx+3,bpY+24,bpZ+29+z,7,54,10,C.metal,pcbId,'Connettore espansione',.94);
 pushBox(cx-6,bpY+bpD-18,bpZ+30+z,5,14,90,C.metal,pcbId,'Piastra porte motherboard',.94);
 for(let k=0;k<5;k++)pushBox(cx+2,bpY+115+k*12,bpZ+28+z,3,8,6,'#487c89',pcbId,'Chip di servizio della scheda',.98);
 pushBox(cx+2,bpY+65,bpZ+158+z,4,58,9,'#d6d2a6',pcbId,'Connettore ATX / alimentazione',.95);
 // rear cable down to PSU individual: simple, deliberately not a proprietary backplane
 if(state.wiring && zlift<5){wire([[cx+1,315,163+z],[cx+1,332,163+z],[cx+1,347,118],[cx+1,404,118]],C.cable,2.5,'POWER');
 wire([[cx-10,318,197+z],[cx-10,338,197+z],[cx-10,401,141]],C.plug,1.7,'POWER');}
 // PSU commercial individual, along rear bench, serviced independently
 if(state.wiring){pushBox(cx-32,345,57,64,55,50,C.psu,'POWER','Alimentatore commerciale individuale · '+id,.99);
  pushBox(cx-27,344,63,19,2,35,C.metal,'POWER','Griglia PSU',.93);
  for(let j=0;j<4;j++)wire([[cx-25+j*4,343,64],[cx-25+j*4,343,93]],'#284755',.8,'POWER');
  pushBox(cx-31,403,126,64,6,13,C.plug,'POWER','Porte posteriori LAN / USB · '+id,.96);
  pushBox(cx-24,409,129,12,4,6,'#9cd6a9','POWER','LAN',1);
  pushBox(cx+4,409,129,14,4,6,'#8bc5e8','POWER','USB',1);
 }
 rearPanel(cx,id);
 text3([cx,191,343+z],id,C.accent,12,id,id);
 return cx;
}

function upsSidecar(width){
 if(!state.showUPS)return;
 const x=width+UPS.sideGap,y=8,h=UPS.h,z=3;
 // Floor-mounted commercial UPS. Printed markers only define the installation footprint.
 // NO printed cantilever, NO fabricated mains bus, NO overhead enclosure; not a battery drawer.
 for(const px of [x-10,x+UPS.w+4])for(const py of [y-5,y+UPS.d-9]){
  pushBox(px,py,0,7,15,5,'#557f83','UPSLOC','Marcatore stampato di posizione (non portante)',1);
 }
 // Floor landing shadow — outline only; equipment's 13.1 kg goes into the ground.
 wire([[x-13,y-12,0],[x+UPS.w+13,y-12,0],[x+UPS.w+13,y+UPS.d+12,0],[x-13,y+UPS.d+12,0],[x-13,y-12,0]],'#668f9c',1.3,'UPSLOC',[6,5]);
 // Upright factory-built UPS; all surfaces remain free, left/right ventilation unblocked.
 pushBox(x,y,z,UPS.w,UPS.d,UPS.h,C.ups,'UPS','PowerWalker VI 1500 CSW IEC · apparecchio commerciale, non costruito in 3D',1);
 pushBox(x+6,y-1,z+18,UPS.w-12,3,UPS.h-36,C.upsFace,'UPS','Pannello frontale e accesso batteria da mantenere raggiungibili',1);
 pushBox(x+19,y-2,z+195,61,2,39,'#103746','UPS','Display LCD anteriore UPS',1);
 pushBox(x+25,y-3,z+216,49,1,6,'#70c7b4','UPS','Barra display UPS',1);
 pushBox(x+24,y-3,z+202,35,1,5,'#87c4b6','UPS','Indicatori LCD',1);
 pushBox(x+43,y-3,z+178,14,2,14,'#193d4a','UPS','Tasto ON/OFF commerciale accessibile',1);
 for(const xx of [x-1,x+UPS.w]){
  for(let i=0;i<10;i++){
   pushBox(xx,82+i*22,z+90,1.5,12,75,'#78919e','UPS','Griglie laterali · lasciare libere',.92);
  }
 }
 // Back service face toward the rear: 8 IEC C13 divided into 4 BACKUP and 4 SURGE ONLY.
 pushBox(x+5,y+UPS.d,z+32,UPS.w-10,4,UPS.h-46,'#283f4c','UPSPORT','Retro commerciale UPS · uscite IEC C13',1);
 for(let i=0;i<8;i++){
  const col=Math.floor(i/4),row=i%4;
  const sx=x+14+col*50,sz=z+95+row*36;
  pushBox(sx,y+UPS.d+4,sz,27,3,19,col===0?C.upsBackup:C.upsSurge,'UPSPORT',col===0?`IEC ${row+1} · CON BATTERIA`:`IEC ${row+5} · SOLO PROTEZIONE SOVRATENSIONI`,1);
  pushBox(sx+4,y+UPS.d+7,sz+5,19,1.5,8,'#172c37','UPSPORT','Presa IEC C13',1);
 }
 pushBox(x+42,y+UPS.d+4,z+50,18,3,13,'#ddd4a9','UPSPORT','Ingresso rete IEC C14 · connessione certificata',1);
 pushBox(x+14,y+UPS.d+4,z+50,14,3,11,'#81c3d2','UPSPORT','USB HID verso un host NUT, non USB di alimentazione',1);
 // Rear cable-bend/service corridor; intentionally not an enclosed chassis volume.
 const yy=y+UPS.d+10;
 wire([[x-16,yy,0],[x+UPS.w+16,yy,0],[x+UPS.w+16,535,0],[x-16,535,0],[x-16,yy,0]],'#d6ac70',1.5,'UPSCLEAR',[8,5]);
 for(let k=0;k<4;k++)wire([[x+19,y+UPS.d+9,z+111+k*36],[x+19,468,z+117+k*31],[x+2,500,z+90+k*29]],'#66c0b2',1.35,'UPSCABLE',[5,3]);
 wire([[x+50,y+UPS.d+8,z+55],[x+51,495,z+65],[x+65,518,z+65]],'#df9983',1.7,'UPSCABLE',[4,3]);
 // OPEN side gap between chassis and UPS, not a wall or pressure-loaded connector.
 wire([[width+8,12,0],[x-8,12,0],[x-8,410,0],[width+8,410,0],[width+8,12,0]],'#5cbcb7',1.0,'UPSCLEAR',[4,8],.65);
 if(state.dims){
  dimension([x,y-14,15],[x+UPS.w,y-14,15],'99 mm · L UPS',[0,-36,0],'#e5ba83');
  dimension([x+UPS.w+9,y,10],[x+UPS.w+9,y+UPS.d,10],'410 mm · P UPS',[46,0,0],'#a9d0de');
  dimension([x+UPS.w+6,y,3],[x+UPS.w+6,y,283],'280 mm · H UPS',[65,0,0],'#a1c5f3');
  dimension([width,100,20],[x,100,20],'66 mm · intercapedine libera',[0,0,70],'#86dbd1');
  dimension([x+UPS.w+15,y+UPS.d,0],[x+UPS.w+15,535,0],'~117 mm · accesso cavi',[68,0,0],'#e5ba83');
  text3([x+UPS.w/2,215,302],'13,1 kg → PAVIMENTO',C.accent,10,'DIM');
  text3([x+UPS.w/2,490,25],'DIETRO LIBERO · IEC + USB',C.accent,10,'DIM');
 }
}

// Inserimento 1:1 dei dettagli della vera Torre H-7 nell'allestimento ambientale.
// L'assemblaggio usa la STESSA funzione meccanica dell'anteprima isolata, nessuna seconda torre.
// Cooling kit attached to the fixed FRONT beam, not to the extractable carriers.
// Nominal y=16..49; holders are outside the moving carrier footprint y=74..323.
const FAN_LAYOUT=[{x:89,z:133,hdd:true},{x:262,z:152},{x:430,z:152},{x:598,z:152},{x:766,z:152},{x:939,z:133,hdd:true}];
function fanHousing(cx,cz,id){
 const dark='#344954',rim='#597981',blade='#8eb9bd',metal='#a8c5ca';
 const p=(angle,r,y)=>[cx+Math.cos(angle)*r,y,cz+Math.sin(angle)*r];
 // Square frame surrounding a circular open aperture, extrusion 27 mm (y=18..45).
 for(let i=0;i<32;i++){
  const a=2*Math.PI*i/32,b=2*Math.PI*(i+1)/32,outer=t=>70/Math.max(Math.abs(Math.cos(t)),Math.abs(Math.sin(t)));
  const q=[p(a,outer(a),18),p(b,outer(b),18),p(b,63,18),p(a,63,18)];
  polyPrism([...q,...q.map(v=>[v[0],45,v[2]])],dark,id,'Scocca 140×140×27 mm · '+id,.99);
 }
 // Rotor and stylized curved blades in the XZ plane; not a blade design for manufacture.
 for(let i=0;i<20;i++){const a=i*2*Math.PI/20,b=(i+1)*2*Math.PI/20;
  faces.push({p:[[cx,32,cz],p(a,20,32),p(b,20,32)],color:metal,group:id,name:'Mozzo rotore · '+id,opa:1,normal:[0,-1,0]});}
 for(let i=0;i<7;i++){const a=i*2*Math.PI/7,pts=[p(a,18,32),p(a+.22,48,32),p(a+.43,60,32),p(a+.83,56,32),p(a+.52,36,32),p(a+.49,18,32)];
  faces.push({p:pts,color:blade,group:id,name:'Girante illustrativa · '+id,opa:1,normal:[0,-1,0]});}
 // Guard outlines at both faces, no bare accessible blades. Geometry indicative, select actual guards.
 for(const yy of [16,47]){
  for(const r of [22,35,48,61,67])wire(Array.from({length:33},(_,i)=>p(i*2*Math.PI/32,r,yy)),rim,1.05,id);
  for(let k=0;k<4;k++){const a=k*Math.PI/2+Math.PI/4;wire([p(a,65,yy),p(a+Math.PI,65,yy)],metal,1,id);}
 }
 for(const u of [-1,1])for(const v of [-1,1])pushBox(cx+u*62-2.5,16,cz+v*62-2.5,5,2,5,metal,id,'Fissaggio griglia / ventola · '+id,1);
 // Two seat brackets per fan fixed to front beam; metal fasteners and retention TBD.
 for(const u of [-1,1]){const x=cx+u*60;
  pushBox(x-5,16,43,10,14,cz-70-43,'#679f94','FANMOUNT','Staffa removibile fissata alla trave anteriore; verifica carico e vibrazioni',1);
  pushBox(x-6,16,35,12,14,12,'#679f94','FANMOUNT','Scarpa di fissaggio alla trave, accoppiamento intenzionale',1);
  pushBox(x-5,18,cz-70,10,27,4,'#679f94','FANMOUNT','Battuta inferiore della ventola; viti da dimensionare',1);
 }
}
function airArrow(pts,col){wire(pts,col,2.6,'AIRFLOW',[],.87);const a=pts.at(-2),b=pts.at(-1),dx=b[0]-a[0],dy=b[1]-a[1],dz=b[2]-a[2],L=Math.hypot(dx,dy,dz);if(!L)return;
 const end=[b[0]-dx/L*19,b[1]-dy/L*19,b[2]-dz/L*19];for(const sign of [-1,1])wire([[end[0]+sign*10,end[1],end[2]],b],col,2.1,'AIRFLOW',[],.9);}
function coolingKit(width){
 if(!state.cooling)return;
 for(let i=0;i<FAN_LAYOUT.length;i++){const f=FAN_LAYOUT[i];fanHousing(f.x,f.z,'F'+(i+1));
  if(state.wiring){wire([[f.x+62,46,f.z-61],[f.x+62,46,46],[f.x+62,35,44]],'#c8b382',1.6,'FANPOWER');}
 }
 if(state.wiring){pushBox(25,31,30,width-50,10,10,'#575c68','FANPOWER','Canalina bassa dedicata 12 V DC; controller e alimentatore commerciali esterni',1);}
 if(state.airflow){
  const blue='#56bde8',hot='#e99b6a';
  for(const f of FAN_LAYOUT){airArrow([[f.x,-62,f.z],[f.x,14,f.z]],blue);}
  // Seven inter-module air routes, not six supposed isolated sealed ducts.
  for(let j=0;j<7;j++){const x=178+(j+.5)*96+26;airArrow([[x,58,155],[x,130,155],[x,245,158]],blue);airArrow([[x,245,158],[x,345,210],[x,380,355]],hot);}
  for(const x of [89,939]){airArrow([[x,56,132],[x,150,132],[x,267,145]],blue);airArrow([[x,267,145],[x,340,195],[x,375,310]],hot);}
  if(state.dims&&state.scene==='thermal'){text3([514,-68,255],'6 INGRESSI · 4 COMPUTE + 2 HDD',blue,11,'DIM');text3([514,355,420],'USCITA ALTA / RETRO · SCHEMA, NON CFD',hot,11,'DIM');}
 }
}
function thermalCalc(){const q=state.heat*3600/(1.18*1005*state.delta);$('heat-label').textContent=state.heat+' W';$('delta-label').textContent=state.delta+' °C';$('thermal-result').textContent='Portata minima teorica '+Math.ceil(q)+' m³/h. Quattro ventole sono segnaposto: portata reale e orientamento delle cartucce da verificare, nessuna simulazione CFD.';}
function embedTowerAt(originX,originY,baseZ,where){
 const prev={faces,lines,labels,scene:state.scene,n:state.n,showUPS:state.showUPS,standpads:state.standpads};
 let donorFaces=[],donorLines=[],donorLabels=[];
 try{
  state.scene='tower';state.n=7;state.showUPS=false;state.standpads=false;
  make();donorFaces=faces;donorLines=lines;donorLabels=labels;
 }finally{
  faces=prev.faces;lines=prev.lines;labels=prev.labels;
  state.scene=prev.scene;state.n=prev.n;state.showUPS=prev.showUPS;state.standpads=prev.standpads;
  $('variant-pill').textContent=where==='floor'?'UNA TORRE H-7 · AUTONOMA':'UNA TORRE H-7 · SUL MOBILE';
  if(where!=='floor')$('scene-subtitle').textContent='H-7 FB-1 in pianta · 7 PC · 6 appoggi smontabili · massa e struttura da verificare';
 }
 // Rotazione rigida +90° (nessuna specchiatura); il retro I/O è verso x minore, cioè il muro.
 const place=p=>[originX+FB.depth-p[1],originY+p[0],baseZ+p[2]];
 const normal=n=>[-n[1],n[0],n[2]];
 for(const f of donorFaces){if(f.group==='DIM'||f.group==='GRID')continue;faces.push({...f,p:f.p.map(place),normal:normal(f.normal)})}
 for(const l of donorLines){if(l.group==='DIM'||l.group==='GRID')continue;lines.push({...l,points:l.points.map(place)})}
 for(const lab of donorLabels){if(lab.group==='DIM')continue;labels.push({...lab,pos:place(lab.pos)})}
}
// R-2. CARICO SOLO A TERRA: il mobile HAUGA candidato ha limite di 20 kg sul piano.
// Le quattro colonne SONO ESTERNE al mobile e non lo toccano.
// 1470 di larghezza esterna, piattaforma L1130 x P450, sporge 95 mm solo davanti.
// Variante DIMENSIONALE, NON certificazione; il telaio puo richiedere tiranti a parete.
const R2=M.r2; // portale pilotato dal registro canonico
const R3=M.r3; // variante lightweight su piano IKEA entro 20kg (solo stima, non collaudata)
function portalFrame(bx,by,showDeck=true){
 const w=M.cab.width,depth=M.cab.depth;
 const ys=[by-R2.profile-R2.sideClearance,by+w+R2.sideClearance];
 const xs=[bx+10,bx+410],p=R2.profile;
 // Le quattro gambe vanno dal pavimento ai traversi, NON poggiano su HAUGA.
 for(const y of ys)for(const x of xs){
  pushBox(x,y,0,p,p,R2.topRailBottom,'#467e84','PORTAL','Montante portante 40×40 · carico scaricato a terra',1);
  const shoeY=y===ys[0]?by-55:by+w+5;
  pushBox(x-25,shoeY,0,90,50,8,'#405e6b','PORTALFOOT','Scarpa 90×50 mm fuori dal perimetro mobile · livellamento da verificare',1);
 }
 // Due travi a campata piena 1430 mm tra i centri, esempio 40×40 serie rigida.
 for(const x of xs)pushBox(x,ys[0],R2.topRailBottom,p,R2.frameWidth,p,'#5f9da5','PORTAL','Trave trasversale 40×40 portante, luce 1430 mm (studio)',1);
 // Due fianchi irrigiditi esterni al mobile: nessun traverso sul fronte dei cassetti.
 for(const y of ys){
  pushBox(bx+50,y+2,32,360,36,36,'#476d77','PORTALBRACE','Traversa bassa esterna al mobile',1);
  pushBox(bx+50,y+2,R2.topRailBottom,360,36,24,'#5a9299','PORTALBRACE','Traversa alta di collegamento fianchi',1);
  beamXZ(y+16,bx+42,120,bx+428,520,16,12,'#d7ae69','PORTALBRACE','Controvento diagonale laterale: lunghezza e giunti non validati');
 }
 // Blocco di testata non invasivo; la parete, non HAUGA, deve trattenere il portale dal ribaltamento.
 // La piastra si smonta assieme alla Torre con quattro fissaggi positivi riutilizzabili.
 const py=by+(w-1130)/2;
 if(showDeck){
  pushBox(bx,py,R2.platformBottom,450,1130,R2.platformThickness,'#b99c75','PORTAL','Piastra rimovibile 1130×450×18 mm: nessun contatto con mobile',.97);
  for(const yy of [py+28,py+1102])for(const xx of [bx+25,bx+418]){
    pushBox(xx-8,yy-8,R2.platformBottom+R2.platformThickness,16,16,15,'#f3bf72','PORTALLOCK','Fissaggio meccanico rimovibile Torre-portale; M6 solo ipotetico',1);
  }
 }
 if(state.dims){
  dimension([bx,by,R2.platformBottom],[bx+450,by,R2.platformBottom],'450 mm · PIASTRA',[0,-90,0],'#e7c38a');
  dimension([bx+depth,by,540],[bx+450,by,540],'95 mm · SBALZO AVANTI',[0,-125,0],'#e7ad75');
  dimension([bx,ys[0],10],[bx,ys[1]+p,10],'1470 mm · IMPRONTA ESTERNA',[-110,0,0],'#8adecf');
  dimension([bx,ys[0],0],[bx,ys[0],R2.platformBottom+R2.platformThickness],'618 mm · PIANO TORRE',[-110,-60,0],'#8adecf');
 }
 return {plateX:bx,plateY:py,baseZ:R2.platformBottom+R2.platformThickness};
}


// R-3, PESO PROGETTUALE 17,800 kg, NON MISURATO. La struttura scarica sul piano HAUGA,
// non sulla spalletta. Sei rialzi metallici corti, base reticolare aperta; stessa H-7 autoportante.
// I piedini e la resistenza del mobile non sono ancora provati con masse inerti.
function lightKit(bx,by){
 const py=by+(M.cab.width-1130)/2,z=M.cab.height,h=R3.supportHeight,th=R3.baseThickness;
 for(const yy of [by+185,by+685,by+1185])for(const xx of [bx+60,bx+285]){
  // Piattello di ripartizione sul piano interno, più lontano di 5mm dai tre bordi a U.
  pushBox(xx-45,yy-40,z,90,80,5,'#49717d','LIGHTPAD','Pattino 90×80×5mm a 5mm dal bordo U posteriore, non sulla spalletta',1);
  pushBox(xx-10,yy-10,z+5,20,20,h-5,'#7fa4a9','LIGHTSUPPORT','Rialzo H105 metallico (non torretta plastica portante)',1);
 }
 // Perimetro e traverse locali sottili; non una piastra chiusa da 18mm.
 for(const xx of [bx+6,bx+410])pushBox(xx,py,z+h,34,1130,th,'#c4ab82','LIGHTBASE','Longherone leggero, multistrato congiunto a profili rigidi',.96);
 for(const yy of [py,by+185,by+450,by+685,by+900,by+1185,py+1118])
  pushBox(bx+6,yy,z+h,438,12,th,'#c4ab82','LIGHTBASE','Traversa base reticolare R-3, massa ed inflessione non validate',.97);
 if(state.dims){
  dimension([bx,py,z+h],[bx+450,py,z+h],'450 mm · PROFONDITÀ',[0,-75,0],'#e1bb7b');
  dimension([bx+M.cab.depth,py,z+h],[bx+450,py,z+h],'95 mm · SBALZO SOLO ANTERIORE',[0,-120,0],'#e4ac75');
  dimension([bx+50,py,z],[bx+50,py,z+h],'105 mm · RIALZO',[-85,0,0],'#a9d5d0');
  text3([bx+545,by+M.cab.width/2,z+h+420],'R-3 17,8 kg STIMATI · MAX 20 kg IKEA · NESSUN COLLAUDO','#edbc85',11,'DIM');
 }
 return {plateX:bx,plateY:py,baseZ:z+h+th};
}

// IKEA HAUGA 004.150.47 — modulo 3D parametrico; non è un CAD esecutivo.
// Valori M.cab = misurazione utente, quote catalogo 1380x360x540 esposte separatamente.
function haugaEndCheek(x,y,z,d,th,h){
 const q=[[x,z],[x+d,z],[x+d,z+h-38],[x+d-36,z+h],[x,z+h]],group='LIP',
       name='Fianco alto HAUGA con smusso anteriore';
 for(const yy of [y,y+th])faces.push({p:q.map(t=>[t[0],yy,t[1]]),color:'#e7eae6',
   group,name,opa:1,emphasis:false,normal:[0,yy===y?-1:1,0]});
 for(let i=0;i<q.length;i++){
  const a=q[i],b=q[(i+1)%q.length];
  faces.push({p:[[a[0],y,a[1]],[b[0],y,b[1]],[b[0],y+th,b[1]],[a[0],y+th,a[1]]],
   color:'#d7dcda',group,name,opa:1,emphasis:false,normal:[1,0,0]});
 }
}
function haugaKnob(x,y,z){
 const ring=[],n=12,r=9;
 for(let i=0;i<n;i++){const th=i*2*Math.PI/n;ring.push([y+Math.cos(th)*r,z+Math.sin(th)*r])}
 const group='HAUGAKNOB',name='Pomello scuro originale IKEA HAUGA · dimensione indicativa';
 faces.push({p:ring.map(p=>[x+13,p[0],p[1]]),color:'#323937',group,name,opa:1,emphasis:false,normal:[1,0,0]});
 for(let i=0;i<n;i++){
  const a=ring[i],b=ring[(i+1)%n];
  faces.push({p:[[x,a[0],a[1]],[x,b[0],b[1]],[x+13,b[0],b[1]],[x+13,a[0],a[1]]],
   color:'#555b58',group,name,opa:1,emphasis:false,normal:[1,0,0]});
 }
}
function drawHaugaReal(bx,by,showDimensions=false){
 const w=M.cab.width,d=M.cab.depth,h=M.cab.height,lipH=M.cab.lipHeight;
 const side=17.5,mid=18,board=18,shelfZ=210,drawerZ=39,drawerH=153;
 const bayW=(w-2*side-mid)/2,midY=by+w/2;
 const white='#e7eae6',shadow='#d3d9d5';
 // Carcassa cavae a pannelli, invece di un unico blocco che ostruiva i vani.
 pushBox(bx,by,0,d,side,h,white,'WHITECAB','Fianco sinistro · truciolare rivestito',1);
 pushBox(bx,by+w-side,0,d,side,h,white,'WHITECAB','Fianco destro · truciolare rivestito',1);
 pushBox(bx+8,by+side,0,d-8,w-2*side,22,shadow,'WHITECAB','Base e zoccolo continuo HAUGA',1);
 pushBox(bx+10,by+side,22,d-14,w-2*side,18,white,'WHITECAB','Piano inferiore HAUGA',1);
 pushBox(bx+10,by+side,h-board,d-10,w-2*side,board,white,'WHITECAB','Piano superiore · portata max 20 kg',1);
 pushBox(bx+10,midY-mid/2,24,d-13,mid,h-24,white,'HAUGASHELF','Divisorio centrale fra i 2 vani e i 2 cassetti',1);
 pushBox(bx+13,by+side,shelfZ,d-15,w-2*side,board,white,'HAUGASHELF','Mensola superiore ai cassetti · portata 12–13 kg/vano',1);
 // Schienale in fibra: il passaggio cavi non è stato misurato; finestrella in render esplicativa.
 pushBox(bx+10,by+side,40,11,w-2*side,shelfZ-40,shadow,'HAUGABACK','Schienale inferiore in fibra',1);
 // Finestrine di servizio PICCOLE: ubicazione reale non rilevata.
 pushBox(bx+10,by+side,shelfZ+board,11,w-2*side,102,shadow,'HAUGABACK','Schienale vano aperto',1);
 pushBox(bx+10,by+side,370,11,w-2*side,h-board-370,shadow,'HAUGABACK','Schienale superiore in fibra',1);
 for(let i=0;i<2;i++){
  const by0=by+side+i*(bayW+mid),end=by0+bayW;
  // Una piccola feritoia grafica per vano, NON una misura o prescrizione di modifica.
  const slotHalf=45,slotY=by0+bayW/2;
  pushBox(bx+10,by0,330,11,slotY-slotHalf-by0,40,shadow,'HAUGABACK',
    'Schienale · zona passacavo illustrativa',1);
  pushBox(bx+10,slotY+slotHalf,330,11,end-(slotY+slotHalf),40,shadow,'HAUGABACK',
    'Schienale · zona passacavo illustrativa',1);
  pushBox(bx+28,by0+3,shelfZ+board,d-34,bayW-6,3,'#f3f4ee','HAUGAOPEN',
    'Vano superiore '+(i+1)+' · IKEA larghezza 660 mm, altezza 175 mm',1);
  // Frontali pieni, solo nella metà bassa, lasciando veri vani aperti sopra.
  pushBox(bx+d-18,by0+3,drawerZ,18,bayW-6,drawerH,'#f0f1ed','HAUGADRAWER',
    'Cassetto '+(i+1)+' · max 9 kg per cassetto',1);
  for(const frac of [.22,.78])haugaKnob(bx+d+1,by0+(bayW-6)*frac+3,drawerZ+drawerH*.52);
  pushBox(bx+40,by0+9,drawerZ+15,d-70,7,drawerH-30,'#a3b0af','HAUGAGUIDE',
    'Guida cassetto illustrativa, da verificare sul mobile',1);
  pushBox(bx+40,end-16,drawerZ+15,d-70,7,drawerH-30,'#a3b0af','HAUGAGUIDE',
    'Guida cassetto illustrativa, da verificare sul mobile',1);
 }
 // Spalletta a U: tutti i tre bordi sono visualizzati spessi 10mm come da misura utente.
 pushBox(bx,by,h,M.cab.lipThickness,w,lipH,'#d4dcd8','LIP',
   'Spalletta posteriore · H90 e spessore 10mm riferiti dall utente',1);
 haugaEndCheek(bx,by,h,d,M.cab.lipThickness,lipH);
 haugaEndCheek(bx,by+w-M.cab.lipThickness,h,d,M.cab.lipThickness,lipH);
 if(showDimensions&&state.dims){
  dimension([bx+d,by,10],[bx+d,by+w,10],'1370 MISURATO · 1380 IKEA',[100,0,0],'#91d8d4');
  dimension([bx,by,10],[bx+d,by,10],'355 MISURATO · 360 IKEA',[0,-95,0],'#91d8d4');
  dimension([bx,by,h],[bx,by,h+lipH],'90 mm · RIALZO',[-85,0,0],'#c6e4e3');
  text3([bx+580,by+w/2,940],'HAUGA 004.150.47 · 2 VANI · 2 CASSETTI · 4 POMELLI','#92dfd9',11,'DIM');
  text3([bx+580,by+w/2,880],'IKEA 1345×330 mm LUCE CATALOGO DA VERIFICARE · 660×175 mm PER VANO','#b6d3d3',10,'DIM');
  text3([bx+580,by+w/2,820],'PIANO MAX 20 kg · OBBLIGO ANCORAGGIO A PARETE','#f2be82',10,'DIM');
  text3([bx+580,by+w/2,770],'PASSACAVO, GUIDE E SPESSORI INTERNI: SCHEMA NON QUOTATO','#acc7ce',9,'DIM');
 }
}
function haugaDetailScene(){
 const bx=90,by=120;
 if(state.grid)for(let x=0;x<600;x+=100)wire([[x,0,-9],[x,1700,-9]],'#285061',.6,'GRID');
 drawHaugaReal(bx,by,true);
 return M.cab.width;
}

function lipDetailScene(){
 const bx=90,by=120;
 if(state.grid)for(let x=0;x<650;x+=100)wire([[x,0,-9],[x,1600,-9]],'#285061',.6,'GRID');
 drawHaugaReal(bx,by,true);
 const c=portalFrame(bx,by);
 embedTowerAt(c.plateX+2,c.plateY+51,c.baseZ,'cabinet');
 if(state.dims){
  dimension([bx,by,450],[bx,by,540],'90 mm · BORDINO',[-60,0,0],'#b4d7ee');
  dimension([bx,by,540],[bx+10,by,540],'10 mm', [0,-45,0],'#b4d7ee');
  text3([bx+520,by+M.cab.width/2,1030],'PORTALE PORTANTE SOLO A TERRA · HAUGA NON CARICATO',C.accent,10,'DIM');
 }
 return R2.frameWidth;
}

// Variant on the floor: same seven cartridges / same upper structural frame.
// The native FB-1 sits at z=109 on HAUGA risers. To sit on floor skids, the whole
// assembled upper geometry is lowered by 90 mm. No cabinet risers or wood panel.
function floorStandingKit(length){
 const skids=[-32,332],stations=[88,655,1222];
 // Datum floor only: does NOT represent a structural slab.
 faces.push({p:[[-85,-176,-7],[length+85,-176,-7],[length+85,508,-7],[-85,508,-7]],
  color:'#193b42',group:'FLOORREF',name:'Pavimento di riferimento, non piastra di legno',
  opa:.18,emphasis:false,normal:[0,0,1]});
 for(let x=0;x<=length;x+=200)wire([[x,-160,-6],[x,490,-6]],'#426267',.65,'FLOORREF',[],.32);
 for(const y of [-100,0,100,200,300,400])wire([[-70,y,-6],[length+70,y,-6]],'#426267',.65,'FLOORREF',[],.32);
 // Low metal skids and six real-contact pads.
 for(const y of skids){
  pushBox(19,y,7,length-38,20,14,'#6e999b','STANDRAIL','Longherone metallico basso da collaudare, nessuna betulla',1);
  for(const x of stations){
   pushBox(x-33,y-8,0,66,36,7,'#253f47','STANDRUBBER','Pattino elastomerico sul pavimento, carico/attrito da misurare',.99);
   pushBox(x-26,y-5,17,52,30,7,'#bcac83','STANDJOINT','Giunto smontabile tra profilati, bulloneria da definire',1);
  }
 }
 // Crossbars intersect native base frame, now lowered to near z=19.
 for(const x of stations){
  pushBox(x-10,-29,14,20,388,10,C.frame2,'STANDCROSS','Traversa bassa di ripartizione tra i due longheroni',1);
  for(const y of [54,244])pushBox(x-14,y-19,19,28,38,9,C.frame,'STANDJOINT','Nodo strutturale removibile tra basamento e telaio',1);
 }
 // Four optional front/rear anti-tip wings, not a certified restraint.
 if(state.standpads)for(const x of [88,1222]){
   pushBox(x-47,-125,7,94,104,13,'#638e94','STANDPAD','Ala frontale stabilizzatrice rimovibile, studio',.97);
   pushBox(x-47,350,7,94,130,13,'#638e94','STANDPAD','Ala posteriore stabilizzatrice rimovibile, studio',.97);
   pushBox(x-34,-130,0,68,38,7,'#273f46','STANDRUBBER','Appoggio esterno ala anteriore, da collaudare',.98);
   pushBox(x-34,448,0,68,38,7,'#273f46','STANDRUBBER','Appoggio esterno ala posteriore, da collaudare',.98);
 }
 if(state.dims){
  dimension([0,-42,0],[length,-42,0],'1310 mm · L CORPO',[0,-55,0],'#c9e5df');
  dimension([length,-42,0],[length,376,0],'~418 mm · APPOGGI BASE',[90,0,0],'#d6cc9d');
  if(state.standpads)dimension([length+20,-130,0],[length+20,486,0],'~616 mm · ALI APERTE',[130,0,0],'#efba78');
  text3([length/2,475,265],'AUTONOMA · PIEDI RIMOVIBILI / NO MOBILI · SOLO STUDIO',C.accent,10,'DIM');
 }
}
function standaloneTower(){
 fishboneTower();
 // The entire original seven-module assembly is lowered with no change in its plan geometry.
 for(const f of faces)for(const p of f.p)p[2]-=90;
 for(const l of lines)for(const p of l.points)p[2]-=90;
 for(const l of labels)l.pos[2]-=90;
 floorStandingKit(FB.length);
 $('variant-pill').textContent='H-7 · AUTONOMA A TERRA · STUDIO';
 return FB.length;
}

function roomScene(){
 // Rilievo utente 22/11: 5×5 m, unico smusso lato PC, finestra sulla parete x=0.
 const roomW=5000,roomD=5000,wallH=3000,cut=350;
 const winWidth=2100,winHeight=1600,winEnd=roomD-500,winStart=winEnd-winWidth,winSill=1000,winTop=winSill+winHeight;
 if(state.grid){for(let x=0;x<=roomW;x+=100)wire([[x,Math.max(0,cut-x),-10],[x,roomD,-10]],'#234451',.55,'GRID',[],.50);
 for(let y=0;y<=roomD;y+=100)wire([[Math.max(0,cut-y),y,-10],[roomW,y,-10]],'#234451',.55,'GRID',[],.50)}
 const wc='#a7b5b8',wo=state.scene==='room'?.74:.15;
 pushBox(cut,0,0,roomW-cut,24,wallH,wc,'WALL','Parete a destra della postazione',wo);
 // Parete del mobile bianco: apertura reale, non un vetro sovrapposto a una parete piena.
 pushBox(0,cut,0,24,winStart-cut,wallH,wc,'WALL','Parete mobile bianco, verso PC',wo);
 pushBox(0,winEnd,0,24,roomD-winEnd,wallH,wc,'WALL','Tratto di 500 mm tra finestra e angolo opposto',wo);
 pushBox(0,winStart,0,24,winWidth,winSill,wc,'WALL','Sottofinestra · davanzale ipotizzato 1000 mm',wo);
 pushBox(0,winStart,winTop,24,winWidth,wallH-winTop,wc,'WALL','Soprafinestra · altezza stanza ipotizzata',wo);
 pushBox(roomW-24,24,0,24,roomD-24,wallH,wc,'WALLCUT','Parete opposta al mobile bianco · sezione visiva',.045);
 pushBox(0,roomD-24,0,roomW-24,24,wallH,wc,'WALLCUT','Parete opposta alla postazione · sezione visiva',.045);
 rotBox(cut/2,cut/2,0,Math.SQRT2*cut,24,wallH,-Math.PI/4,wc,'WALL','Unico smusso: angolo PC · 350 mm ipotizzati',wo);
 const floorOutline=[[cut,0],[roomW,0],[roomW,roomD],[0,roomD],[0,cut]];
 faces.push({p:floorOutline.map(([x,y])=>[x,y,-5]),color:'#a08062',group:'FLOOR',name:'Pavimento 5 × 5 m con unico angolo smussato',opa:.75,emphasis:false,normal:[0,0,1]});
 // Telaio e vetro semitrasparente; divisione in due ante solo illustrativa.
 const f=48,fc='#f5f1e5',wn='WINDOW';
 pushBox(0,winStart,winSill,45,f,winHeight,fc,wn,'Montante finestra',.95);
 pushBox(0,winEnd-f,winSill,45,f,winHeight,fc,wn,'Montante finestra',.95);
 pushBox(0,winStart+f,winSill,45,winWidth-2*f,f,fc,wn,'Traverso inferiore',.95);
 pushBox(0,winStart+f,winTop-f,45,winWidth-2*f,f,fc,wn,'Traverso superiore',.95);
 pushBox(0,winStart+winWidth/2-f/2,winSill+f,45,f,winHeight-2*f,fc,wn,'Montante centrale illustrativo',.95);
 for(const [a,b] of [[winStart+f,winStart+winWidth/2-f/2],[winStart+winWidth/2+f/2,winEnd-f]]){
  faces.push({p:[[18,a,winSill+f],[18,b,winSill+f],[18,b,winTop-f],[18,a,winTop-f]],color:'#8ed6ef',group:wn,name:'Vetro · finestra 2100 × 1600 mm',opa:.85,emphasis:false,normal:[1,0,0]});
 }
 pushBox(0,winStart-18,winSill-25,85,winWidth+36,25,'#e0ddd2',wn,'Davanzale illustrativo',.9);
 if(state.scene==='room'){
  const edge=floorOutline.map(([x,y])=>[x,y,0]);edge.push(edge[0]);
  wire(edge,'#9eabaf',1.5,'WALL',[],.95);
  const ceiling=floorOutline.map(([x,y])=>[x,y,wallH]);ceiling.push(ceiling[0]);
  wire(ceiling,'#9bafb8',1,'WALLCUT',[5,5],.65);
  wire([[roomW,roomD,0],[roomW,roomD,wallH]],'#9bafb8',1,'WALLCUT',[5,5],.65);
  wire([[48,winStart,winSill],[48,winEnd,winSill],[48,winEnd,winTop],[48,winStart,winTop],[48,winStart,winSill]],'#e9f8ff',2.1,'WINDOW',[],1);
  wire([[48,winStart+winWidth/2,winSill],[48,winStart+winWidth/2,winTop]],'#e9f8ff',1.6,'WINDOW',[],1);
  text3([70,(winStart+winEnd)/2,winTop+140],'FINESTRA · 210 × 160 cm','#b8efff',12,'ROOMLABEL');
  // Ceiling height remains explicit in the scene title; avoid a floating label over the chair.
 }
 if(state.dims&&state.scene!=='cabinet'){
  dimension([45,winStart,winTop],[45,winEnd,winTop],'2100 mm · finestra',[0,0,100],'#8ed6ef');
  dimension([45,winEnd,winSill],[45,winEnd,winTop],'1600 mm',[0,115,0],'#8ed6ef');
  dimension([0,winEnd,0],[0,roomD,0],'500 mm · angolo opposto',[-120,0,0],'#8ed6ef');
 }
 // IKEA HAUGA: geometria 2 vani, 2 cassetti, 4 pomelli e spalletta U smussata.
 const cabX=225,cabY=1720;
 drawHaugaReal(cabX,cabY,state.scene==='cabinet'||state.scene==='light');
  const useR2=false; // Historical alternatives remain on separate HTML pages.
  const mount={plateX:cabX+10,plateY:cabY+30,baseZ:M.cab.height};
 // Una sola H-7 indipendente, due supporti alternativi R-2/R-3. R-3 carica il mobile
 // solo SE peso effettivo e stabilità saranno certificati; UPS escluso in entrambi.
 const plateStartX=mount.plateX;
 embedTowerAt(mount.plateX,mount.plateY,mount.baseZ,'cabinet');
 // Fascia dietro I/O: fino a 138 mm liberi tra piastra e muro interno; accesso da testate.
 if(state.clearance){const p0=mount.plateY,z0=mount.baseZ;wire([[24,p0,z0],[plateStartX,p0,z0],[plateStartX,p0+1130,z0],[24,p0+1130,z0],[24,p0,z0]],'#80d4e8',1.4,'CLEAR',[6,4]);}
 // UPS commerciale fuori dal mobile: posto sul pavimento vicino alle prese LAN/230V della parete destra.
 // Ruotato di 90° in pianta: 410 mm lungo il muro, 99 mm verso la stanza, sempre verticale.
 if(state.showUPS){pushBox(1240,140,0,410,99,280,C.ups,'UPS','UPS PowerWalker VI 1500 CSW IEC · 410 lungo parete × 99 P × 280 H',1);
 pushBox(1237,154,190,3,71,55,C.upsFace,'UPS','Pannello LCD anteriore UPS accessibile',1);
 for(let j=0;j<4;j++)pushBox(1651,154,26+j*48,4,25,24,'#66acaf','UPSPORT','Uscita IEC con batteria (schema)',1);}
 // A destra della scrivania: TUTTI e tre con lato lungo parallelo al muro y=0.
 // Scaffale aperto: veri montanti e ripiani, non un volume pieno che nasconde le apparecchiature.
 for(const x of [1970,2472])for(const y of [94,416])pushBox(x,y,0,18,18,1100,'#7f553a','RACK','Montante del mobile multilivello, L 520 × P 340 × H 980 mm stimati',1);
  for(const z of [20,420,695,950])pushBox(1970,94,z,520,340,23,'#6c4832','RACK','Ripiano audio e router',.98);
  pushBox(2040,165,43,265,225,356,'#24272b','SUBWOOFER','Subwoofer sul ripiano basso del mobile multilivello',1);
  pushBox(2040,392,102,265,4,250,'#515e68','SUBWOOFER','Frontale subwoofer rivolto verso la stanza',1);
  pushBox(2045,140,973,220,160,58,'#1f2f38','RACKMODEM','Router sul mobile multilivello',1);
 // Tutti i quattro satelliti già presenti nel modello, ciascuno su un ripiano e rivolto verso la stanza.
  for(const [x,y,z,h,id,n] of [[2240,158,443,210,'AUDIOLEFT',1],[2385,158,443,210,'AUDIORIGHT',2],[2045,190,718,175,'DESKSATLEFT',3],[2340,190,718,175,'DESKSATRIGHT',4]]){
  pushBox(x,y,z,70,90,h,'#1f2326',id,`Satellite audio ${n} nel multilivello`,1);
  pushBox(x+6,y+90,z+10,58,3,h-20,'#46525a',id,`Griglia frontale satellite ${n}`,1);
 }
 pushBox(2600,95,0,400,260,540,'#6e452f','DARKDRAWER','Cassettiera autonoma a terra · lato lungo 400 mm addossato alla parete',.98);
 for(const z of [90,180,270,360,450])pushBox(2604,349,z,392,5,55,'#81563b','DARKDRAWER','Frontale cassetto indipendente',1);
  // Torrino H-4: DAS a quattro bay SATA e hub USB quattro porte. HDD USB 8TB/4TB restano nelle custodie, nessuna migrazione fatta.
  // Due HDD sono mostrati nello scenario; l'8 TB oggi su n3 attende migrazione.
  pushBox(2665,124,540,185,218,206,'#293944','DAS4','DAS USB 4 bay SATA indipendenti, ventola e alimentatore propri; hardware ancora da comprare',1);
  pushBox(2672,340,552,171,6,181,'#638595','DAS4','Frontale di quattro baie SATA',1);
  for(let k=0;k<4;k++){
   const z=565+k*43;
   pushBox(2680,346,z,155,4,34,'#344650','DAS4','Bay SATA '+(k+1)+' libera: nessun HDD USB attuale entra direttamente',1);
   pushBox(2690,351,z+15,13,3,5,'#608d93','DAS4','Indicatore slot vuoto',1);
  }
  pushBox(2689,130,755,132,82,56,'#365663','HUB4','Hub USB 3.x 4 porte alimentato, separato dal DAS',1);
  for(let k=0;k<4;k++)pushBox(2699+k*29,213,771,16,3,12,'#81b8cc','HUB4','Porta USB '+(k+1)+' di 4',1);
  text3([2760,217,833],'DAS 4 BAY + HUB 4 PORTE',C.accent,11,'HUB4');
  text3([2760,217,749],'QUATTRO BAY SATA LIBERE',C.accent,10,'DAS4');
  // Dischi esterni REALI: WD 4 TB USB nativo e Seagate Expansion 8 TB USB,
  // illustrati separati dal DAS; attualmente 8 TB su n3 e 4 TB su n2.
  pushBox(2867,130,540,58,152,175,'#283c45','USBDRIVE','HDD esterno Seagate 8 TB: attualmente collegato a n3, trasferimento al torrino NON eseguito',1);
  pushBox(2928,130,540,61,106,27,'#50616d','USBDRIVE','HDD WD 4 TB USB nativo: attualmente su n2, senza connettore SATA',1);
  text3([2894,212,730],'8 TB · USB',C.accent,10,'USBDRIVE');
  text3([2956,193,583],'4 TB · USB',C.accent,10,'USBDRIVE');
  if(state.wiring){
   wire([[2664,238,650],[2590,238,650],[2590,65,650],[350,65,650],[52,355,650],[52,3000,650],[235,3000,650]],C.plug,3,'DASCABLE',[3,3],.98);
   wire([[2664,244,789],[2540,244,789],[2540,75,789],[360,75,789],[65,365,789],[65,3020,789],[235,3020,730]],C.guide2,2.4,'DASCABLE',[4,4],.95);
   // USB cables from external drives to hub. Cable selection/length not yet verified.
   wire([[2895,128,670],[2895,100,690],[2780,100,760]],C.plug,2,'DASCABLE');
   wire([[2960,128,553],[2972,100,555],[2820,100,760]],C.plug,2,'DASCABLE');
  }
 // PRESE REALI sulla parete a DESTRA della postazione.
 // Distanza: ~1000 mm dal termine dello smusso (inizio della parete diritta x=350); quota dal pavimento solo illustrativa.
 const socketX=1350;
 pushBox(socketX-87,23,260,78,18,100,'#e6e1d3','OUTLETAC','Presa elettrica 230 V sulla parete destra · posizione ~1 m dopo lo smusso',1);
 pushBox(socketX+8,23,260,78,18,100,'#dbe7ea','OUTLETLAN','Presa dati Ethernet RJ45 sulla parete destra · accanto alla presa AC',1);
 pushBox(socketX-60,41,298,28,3,32,'#45505a','OUTLETAC','Frutto 230 V (nessun cablaggio fai-da-te)',1);
 pushBox(socketX+32,41,300,30,3,26,'#3d879b','OUTLETLAN','Frutto RJ45',1);
 if(state.wiring){
  // Canaline a parete distinte: due linee con percorso aderente alla parete, non attraverso la zona sedia.
  // Rosso = alimentazione AC, blu = rete LAN. Quote delle sezioni illustrative.
  pushBox(351,27,108,1590,23,17,'#af7569','ACDUCT','Canaletta AC chiusa · ~23×17 mm (ipotesi), parete destra',1);
  pushBox(351,27,154,1875,20,14,'#478ba1','NETDUCT','Canaletta RJ45 separata · ~20×14 mm, parete destra',1);
  rotBox(190,190,108,Math.SQRT2*440,23,17,-Math.PI/4,'#af7569','ACDUCT','Curve e giunti lungo la smussatura, no cavi liberi sul pavimento',1);
  rotBox(195,195,154,Math.SQRT2*435,20,14,-Math.PI/4,'#478ba1','NETDUCT','Canaletta dati lungo il raccordo parete',1);
  pushBox(27,350,108,23,2850,17,'#af7569','ACDUCT','Canaletta AC dietro il mobile bianco, lontano dalla sedia',1);
  pushBox(60,350,154,20,2850,14,'#478ba1','NETDUCT','Canaletta LAN dietro il mobile bianco, separata dalla rete elettrica',1);
  // Risalite dietro il mobile: restano nel corridoio posteriore, separate e senza passare davanti ai cassetti.
  pushBox(39,2460,108,23,24,455,'#af7569','ACDUCT','Risalita AC nel corridoio dietro la Torre',1);
  pushBox(79,2500,154,20,20,440,'#478ba1','NETDUCT','Risalita LAN separata dietro la Torre',1);
  wire([[socketX-50,45,280],[socketX-50,62,185],[1280,125,190],[1245,170,180]],'#d99b82',2.4,'ACFLEX',[5,4],.95);
  wire([[1400,45,285],[1400,67,174],[2120,67,174],[2120,160,530]],'#69b5ca',2.1,'NETPATCH',[4,5],.96);
  wire([[2150,63,164],[1350,63,164],[350,63,164],[55,350,164],[55,2500,164],[89,2510,594],[178,2500,748]],'#64c8dc',2.0,'NETPATCH',[4,5],.95);
  wire([[1650,185,155],[1650,65,118],[350,65,118],[38,352,118],[50,2472,118],[50,2472,563],[178,2470,635]],'#d3a28f',2.2,'ACFLEX',[5,4],.92);
 }
 if(state.dims)dimension([350,95,0],[1350,95,0],'~1000 mm · presa dal fine smusso',[0,0,75],'#89c9de');
 // Scrivania orientata a 45° verso l'angolo smussato.
 const ang=-Math.PI/4, dcx=1180,dcy=1120, deskTop=M.desk.height-32;
 rotBox(dcx,dcy,deskTop,M.desk.width,M.desk.depth,32,ang,'#8a6247','DESK','Scrivania L1000 P550 H800 mm: misure utente 23/11/2026',.98,true);
 const pt=(lx,ly)=>[dcx+lx*Math.cos(ang)-ly*Math.sin(ang),dcy+lx*Math.sin(ang)+ly*Math.cos(ang)];
 for(const lx of [-(M.desk.width/2-70),M.desk.width/2-70])for(const ly of [-(M.desk.depth/2-65),M.desk.depth/2-65]){const [px,py]=pt(lx,ly);rotBox(px,py,0,60,60,deskTop,ang,'#65432d','DESK','Gamba della scrivania',.98)}
 for(const ly of [-(M.desk.depth/2-57),M.desk.depth/2-57]){const [px,py]=pt(0,ly);rotBox(px,py,deskTop-108,M.desk.width-110,22,108,ang,'#775039','DESK','Fascia strutturale sottopiano illustrativa',.96)}
 // Bracci VESA a muro: tre monitor dispiegati ad arco, quasi bordo-bordo, senza sovrapporsi.
 function wallArm(ax,ay,bx,by,cx,cy,id,label){
  const z=1130,col='#94b5bf';
  rotBox(ax,ay,z-38,83,28,96,Math.atan2(by-ay,bx-ax)+Math.PI/2,col,id,'Piastra a parete · '+label,1);
  const p1=[bx,by], p0=[ax,ay], p2=[cx,cy];
  for(const [a,b] of [[p0,p1],[p1,p2]]){const dx=b[0]-a[0],dy=b[1]-a[1],len=Math.hypot(dx,dy),angle=Math.atan2(dy,dx);rotBox((a[0]+b[0])/2,(a[1]+b[1])/2,z,len,24,27,angle,col,id,'Braccio snodato a parete · '+label,.99)}
  pushBox(bx-19,by-19,z-15,38,38,44,'#ced9db',id,'Snodo centrale · '+label,1);
  rotBox(cx,cy,z-47,105,36,90,ang,col,id,'Piastra VESA posteriore · '+label,1);
  if(state.wiring)wire([[ax,ay,z-40],[bx,by,z-40],[cx,cy,z-40]],'#75abb9',1.7,id,[3,5],.85);
 }
 // Monitor: in pianta due distanze minime misurate nel modello = circa 18 e 15 mm.
 // Un bordo tocca quasi l'altro, senza alcuna intersezione fra i volumi delle scocche.
 wallArm(35,1260,170,1190,301,1070,'ARMLEFT','sinistro VGA');
 wallArm(175,175,355,355,690,600,'ARMCENTER','centrale HDMI');
 wallArm(1370,35,1325,138,1234,195,'ARMRIGHT','destro intermedio');
 const vgaAngle=-1.05,midAngle=-.46;
 rotBox(301,1070,970,442,42,325,vgaAngle,'#141c21','MONVGA','Acer V193W · scocca a muro, distacco ~19 mm dal centrale',.98);
 rotBox(301+23*(-Math.sin(vgaAngle)),1070+23*Math.cos(vgaAngle),985,405,5,295,vgaAngle,'#456383','MONVGA','Schermo Acer VGA sospeso',.99);
 rotBox(690,600,955,740,42,430,ang,'#11181e','MONHDMI','Monitor principale HDMI · supportato dalla parete smussata',.98);
 rotBox(690+23/Math.sqrt(2),600+23/Math.sqrt(2),972,700,5,397,ang,'#357a94','MONHDMI','Schermo HDMI centrale sospeso',.99);
 rotBox(1234,195,963,590,44,360,midAngle,'#141c21','MONMID','Monitor intermedio · ~15 mm dal centrale',.98);
 rotBox(1234+24*(-Math.sin(midAngle)),195+24*Math.cos(midAngle),978,550,5,331,midAngle,'#345f83','MONMID','Schermo intermedio sospeso',.99);
 const [px,py]=pt(280,70);
  // Laptop aperto sul leggio, telefono su leggio, tastiera, mouse e sei prese USB-C.
  const [lx,ly]=pt(225,85);
  rotBox(lx,ly,800,320,215,14,ang,'#99a7a8','LAPTOPSTAND','Leggio per laptop aperto',.99);
  rotBox(lx,ly,840,302,188,12,ang,'#637681','LAPTOPSTAND','Piano inclinato del leggio',1);
  rotBox(lx,ly,853,340,225,13,ang,'#303840','LAPTOP','Base del laptop aperto',1);
  const screenBase=pt(225,192),u=[Math.cos(ang),Math.sin(ang)];
  polyPrism([
    [screenBase[0]-u[0]*170,screenBase[1]-u[1]*170,866],
    [screenBase[0]+u[0]*170,screenBase[1]+u[1]*170,866],
    [screenBase[0]+u[0]*170,screenBase[1]+u[1]*170,1087],
    [screenBase[0]-u[0]*170,screenBase[1]-u[1]*170,1087],
    [screenBase[0]-u[0]*170-4,screenBase[1]-u[1]*170+4,866],
    [screenBase[0]+u[0]*170-4,screenBase[1]+u[1]*170+4,866],
    [screenBase[0]+u[0]*170-4,screenBase[1]+u[1]*170+4,1087],
    [screenBase[0]-u[0]*170-4,screenBase[1]-u[1]*170+4,1087]
  ],'#345a70','LAPTOP','Schermo aperto sul leggio',1);
  const [phx,phy]=pt(-205,73);
  rotBox(phx,phy,800,93,122,13,ang,'#aab6b6','PHONESTAND','Leggio telefono',1);
  rotBox(phx,phy,850,76,28,20,ang,'#6b828a','PHONESTAND','Sostegno smartphone',1);
  rotBox(phx,phy,869,73,30,159,ang,'#273543','PHONE','Telefono in verticale',1);
  const [kx,ky]=pt(0,-151);
  rotBox(kx,ky,800,350,123,24,ang,'#222f36','KEYBOARD','Tastiera davanti ai monitor',1);
  for(let j=0;j<5;j++)for(let k=0;k<14;k++){
   const q=pt(-157+k*23,-196+j*22);
   rotBox(q[0],q[1],826,18,16,3,ang,'#789099','KEYBOARD','Tasto',.97);
  }
  const [mx,my]=pt(355,-150);
  rotBox(mx,my,801,67,106,34,ang,'#263843','MOUSE','Mouse',.99);
  const [ux,uy]=pt(-350,-212);
  rotBox(ux,uy,800,208,40,24,ang,'#344650','USBC','Pannello con sei porte USB-C sul lato sinistro',1);
  for(let k=0;k<6;k++){
   const p=pt(-430+k*32,-235);
   rotBox(p[0],p[1],811,15,5,7,ang,'#7cd0e3','USBC','Porta USB-C '+(k+1),1);
  }
  if(state.wiring){
   const cable0=pt(-430,-235),cable1=pt(-398,-235);
   wire([[cable0[0],cable0[1],816],[cable0[0],cable0[1]-100,822],[phx,phy-30,866]],C.plug,2.5,'USBC');
   wire([[cable1[0],cable1[1],816],[cable1[0]-115,cable1[1]-80,790],[545,1390,780],[540,2930,722]],C.plug,2.5,'USBC');
  }
 // SEDIA GAMING: rappresentazione geometrica articolata (non un blocco pieno).
 // La scheda del prodotto Amazon non e' stata associata in modo verificato a questo modello:
 // ingombri prudenziali, sedia reale da identificare con precisione.
 // Il fronte locale della seduta è -Y; orientarlo verso il centro del monitor HDMI (690,600).
 const ccx=1730,ccy=1700,chairAngle=Math.atan2(690-ccx,ccy-600);
 const cpt=(lx,ly)=>[ccx+lx*Math.cos(chairAngle)-ly*Math.sin(chairAngle),ccy+lx*Math.sin(chairAngle)+ly*Math.cos(chairAngle)];
 // Base stellare con CINQUE razze e cinque ruote; piantone centrale.
 pushBox(ccx-49,ccy-49,64,98,98,60,'#56606b','CHAIR','Mozzo a cinque razze della sedia',1);
 for(let k=0;k<5;k++){
  const a=k*2*Math.PI/5+0.35;
  const ox=ccx+155*Math.cos(a),oy=ccy+155*Math.sin(a);
  rotBox(ox,oy,88,330,52,36,a,'#343e49','CHAIR','Razza '+(k+1)+' della base a cinque stelle',.98);
  const wx=ccx+322*Math.cos(a),wy=ccy+322*Math.sin(a);
  rotBox(wx,wy,12,73,56,60,a,'#1b252d','CHAIR','Ruota piroettante '+(k+1),.97);
 }
 pushBox(ccx-37,ccy-37,120,74,74,350,'#82909a','CHAIR','Colonna a gas regolabile della sedia',.98);
 pushBox(ccx-132,ccy-107,440,264,214,40,'#212932','CHAIR','Meccanismo seduta e piastra inclinazione',.99);
 rotBox(ccx,ccy,478,540,515,87,chairAngle,'#2e3744','CHAIR','Seduta imbottita, sagomata con guance laterali',1);
 const [seatX,seatY]=cpt(0,-10);
 rotBox(seatX,seatY,559,466,445,21,chairAngle,'#42606c','CHAIR','Cuscino seduta e rivestimento',.99);
 // Schienale dietro al bacino e due fianchetti laterali con cuscino lombare.
 const [bx,by]=cpt(0,235);
 rotBox(bx,by,558,525,118,673,chairAngle,'#2d3946','CHAIR','Schienale alto da sedia gaming',.99);
 const [backX,backY]=cpt(0,205);
 rotBox(backX,backY,650,436,105,463,chairAngle,'#43515b','CHAIR','Schiena interna imbottita',.99);
 const [lumX,lumY]=cpt(0,160);
 rotBox(lumX,lumY,758,335,112,92,chairAngle,'#7a8e94','CHAIR','Cuscino lombare',.99);
 for(const u of [-1,1]){
  const [ax,ay]=cpt(u*270,-3);
  pushBox(ax-23,ay-23,535,46,46,178,'#687782','CHAIR','Colonnina bracciolo regolabile',.98);
  rotBox(ax,ay,714,80,325,42,chairAngle,'#242e36','CHAIR','Bracciolo imbottito',.99);
  const [sx,sy]=cpt(u*246,260);
  rotBox(sx,sy,632,67,135,505,chairAngle,'#293948','CHAIR','Aletta laterale schienale',.98);
 }
 const [hx,hy]=cpt(0,278);
 rotBox(hx,hy,1178,355,125,94,chairAngle,'#243543','CHAIR','Poggiatesta integrato imbottito',.99);
 // NESSUN secondo PC tower a pavimento: e' tutta nella H-7 sul mobile bianco.
 if(state.dims){
  dimension([cabX,cabY,0],[cabX+M.cab.depth,cabY,0],'355 mm · profondità MISURATA',[0,-84,0],'#81d6d8');
  dimension([cabX,cabY,0],[cabX,cabY+M.cab.width,0],'1370 mm · mobile MISURATO',[-100,0,0],'#81d6d8');
   dimension([plateStartX,1840,mount.baseZ],[plateStartX+FB.depth,1840,mount.baseZ],'318 mm · profondità FB-1',[0,-85,0],'#e7c38a');
   dimension([plateStartX,1840,mount.baseZ],[plateStartX,1840,mount.baseZ+FB.length],'1310 mm · lunghezza in pianta',[-95,0,0],'#e7c38a');
   dimension([plateStartX,1840,mount.baseZ],[plateStartX,1840,mount.baseZ+360],'360 mm · H studio',[0,-92,0],'#8ac4f1');
  if(state.scene!=='cabinet'){
   dimension([0,0,0],[roomW,0,0],'5000 mm · stanza circa',[0,-118,0],'#a8d6ee');
   dimension([0,0,0],[0,roomD,0],'5000 mm · stanza circa',[-118,0,0],'#a8d6ee');
  }
  dimension([24,1840,573],[160,1840,573],'136 mm · retro libero nominale',[0,-145,0],'#80d4e8');
   text3([390,2405,mount.baseZ+374],'H-7 FB-1 · 7 CARTUCCE INCLINATE · 1310 × 318 mm',C.accent,10,'DIM');
   text3([285,1805,mount.baseZ+430],'FB-1 · NO BETULLA · TOP IKEA MAX 20 KG · PESO DA VERIFICARE',C.accent,10,'DIM');
  if(state.scene!=='cabinet'){
   text3([810,640,1530],'MONITOR A MURO · luce 15–19 mm in pianta',C.accent,11,'DIM');
    text3([2720,480,115],'AUDIO + ROUTER NEL MULTILIVELLO · DAS H-8 SU CASSETTIERA',C.accent,10,'DIM');
  }
 }
 if(['cabinet','light'].includes(state.scene)){
  const hidden=new Set(['UPS','UPSPORT','OUTLETAC','OUTLETLAN','ACDUCT','NETDUCT','ACFLEX','NETPATCH','WALL','WALLCUT','WINDOW','ROOMLABEL','FLOOR','RACK','RACKMODEM','PRINTER','DARKDRAWER','SUBWOOFER','AUDIOLEFT','AUDIORIGHT','DESK','CHAIR','MONVGA','MONHDMI','MONMID','ARMLEFT','ARMCENTER','ARMRIGHT','LAPTOP','LAPTOPSTAND','KEYBOARD','MOUSE','PHONE','PHONESTAND','USBC','DAS4','HUB4','DASCABLE','DESKSATLEFT','DESKSATRIGHT']);
  faces=faces.filter(f=>!hidden.has(f.group));
  lines=lines.filter(l=>!hidden.has(l.group));
  labels=labels.filter(l=>!hidden.has(l.group));
 }
 return roomW;
}

function make(){faces=[];lines=[];labels=[];let width=356+state.n*96,limit=178+state.n*96;
 $('variant-pill').textContent='H-7 FB-1 · SPINA DI PESCE';
 if(state.scene==='haugadetail'){ $('variant-pill').textContent='IKEA HAUGA · 004.150.47';return haugaDetailScene();}
 if(state.scene==='lipdetail'){ $('variant-pill').textContent='R-2 · PORTALE INDIPENDENTE';return lipDetailScene();}
 if(['room','workstation','cabinet','light','storage','desk'].includes(state.scene)){
   $('variant-pill').textContent='FB-1 · 7 PC + DAS H-4 SEPARATO';
  return roomScene();
 }
 if(state.scene==='standalone')return standaloneTower();
 if(['tower','rear','thermal'].includes(state.scene))return fishboneTower();
 if(state.scene==='module')return fishboneTower(state.focusIndex);
 if(state.scene==='ups'){
  // Detail focuses UPS and one neighbouring structural end-frame; no enclosure is placed on UPS.
  pushBox(width-25,16,21,18,405,25,C.frame,'FRAME','Fianco esterno della Torre senza collegamento di carico all’UPS',.99);
  pushBox(width-28,20,34,18,365,9,C.frame2,'FRAME','Struttura di confine PC / banco dischi',.96);
  diskBank('right',state.n,width);
  upsSidecar(width);
  return width;
 }
 if(state.scene==='module'){
  const i=clamp(state.focusIndex,0,6),cx=178+(i+.5)*96;
  pushBox(cx-56,19,21,112,15,26,C.frame,'FRAME','Trave anteriore della campata isolata',1);
  pushBox(cx-56,384,21,112,15,26,C.frame,'FRAME','Trave posteriore della campata isolata',1);
  for(const x of [cx-54,cx+44])pushBox(x,20,24,10,379,18,C.frame2,'FRAME','Traversa strutturale trasversale',.98);
  pushBox(cx-53,385,43,17,15,70,C.frame2,'BACKBONE','Montante posteriore basso, estraneo all’appoggio della cartuccia',1);
  pushBox(cx+37,385,43,17,15,70,C.frame2,'BACKBONE','Montante posteriore basso, estraneo all’appoggio della cartuccia',1);
  pushBox(cx-53,387,43,107,15,11,C.frame,'BACKBONE','Trave posteriore bassa della campata isolata',.98);
   // Isolated front/back exterior top ties and segment end uprights.
   for(const yy of [56,332]){
    pushBox(cx-56,yy,251,112,11,17,C.frame2,'GUIDEFRAME','Tratto di traversa esterna superiore della campata',1);
    for(const xx of [cx-53,cx+44])pushBox(xx,yy,39,10,11,229,C.frame2,'GUIDEFRAME','Montante perimetrale / traversa alta della campata',.98);
   }
  module(i,width);
  if(state.dims){
   dimension([cx-48,66,40],[cx+48,66,40],'96 mm · passo X',[0,-65,0]);
   dimension([cx-4,74,60],[cx-4,323,60],'249 mm · profondità corpo',[66,0,0],'#79dbd3');
   dimension([cx-4,74,72],[cx-4,74,311],'239 mm · altezza illustrativa, R-1 da rilevare',[-73,0,0],'#86aff0');
   dimension([cx-11.5,225,182],[cx-1.5,225,182],'10 mm · M3 (ipotesi)',[0,0,29],'#ffcd83');
   text3([cx,45,120],'6 supporti M3 • foratura da rilevare',C.accent,10,'DIM');
   text3([cx,71,34],'BATTUTE z=52 / 89 mm',C.accent,10,'DIM');
   {
    dimension([cx+20,73,89],[cx+20,73,240],'151 mm · leva laterale (studio)',[56,0,0],'#81d6d8');
    dimension([cx-6,73,291],[cx+6,73,291],'12 mm · luce guida',[0,-37,30],'#81d6d8');
    text3([cx,192,331],'Montante 8 mm · 2 mm gioco/lato (da provare)',C.accent,10,'DIM');
   }
  }
  if(state.moduleExploded){for(const yy of [71,291]){wire([[cx,yy+15,139],[cx,yy+15,91]],'#f4cb84',1.6,'ALIGN',[5,5]);wire([[cx,yy+15,91],[cx-5,yy+15,97]],'#f4cb84',1.6,'ALIGN');wire([[cx,yy+15,91],[cx+5,yy+15,97]],'#f4cb84',1.6,'ALIGN')}}

  return width;
 }

 // Ground grid at 100 mm, extended to sidecar if present.
 if(state.grid){for(let x=-100;x<width+(state.showUPS?280:100);x+=100)wire([[x,-80,-15],[x,state.showUPS?570:510,-15]],'#234451',.7,'GRID',[],.7);
 for(let y=-80;y<(state.showUPS?570:550);y+=100)wire([[-90,y,-15],[width+(state.showUPS?250:90),y,-15]],'#234451',.7,'GRID',[],.7)}
 // nine-cell comb frame, frontal and rear horizontal longitudinal beams; segmented joints every pitch
 pushBox(5,16,21,width-10,14,22,C.frame,'FRAME','Profilato longitudinale anteriore (alluminio 2020 candidato)',.99);
 pushBox(5,411,21,width-10,14,22,C.frame,'FRAME','Profilato longitudinale posteriore (alluminio 2020 candidato)',.99);
 pushBox(5,17,11,18,405,25,C.frame2,'FRAME','Trave laterale sinistra',.96);
 pushBox(width-23,17,11,18,405,25,C.frame2,'FRAME','Trave laterale destra',.96);
 for(let i=0;i<=state.n;i++){
 const x=178+i*96;
 pushBox(x-5,17,22,10,407,19,C.frame,'FRAME','Traversa di campata metallica (proposta 2020)',.88);
 pushBox(x-7,18,42,14,31,12,C.corner,'FRAME','Giunto incastro trave anteriore',.93);
 pushBox(x-7,393,42,14,31,12,C.corner,'FRAME','Giunto incastro trave posteriore',.93);
 }
 // Single paired CENTRAL FOOT, mechanically tied by a printed crossmember below the docks.
 const centerFoot=width/2;
 pushBox(centerFoot-9,23,21,18,395,17,C.frame,'FOOT','Traversa mediana strutturale tra longheroni frontale e posteriore',1);
 for(const x of [23,163,centerFoot,limit+15,width-23])for(const y of [25,404]){
  const central=x===centerFoot;
  pushBox(x-12,y-13,0,24,27,13,central?'#b7d7a7':'#2e5660',central?'FOOT':'FRAME',central?'Piedino centrale regolabile / antivibrante · da dimensionare':'Piede antivibrante',1);
  pushBox(x-10,y-10,10,20,20,16,central?C.frame:C.frame2,central?'FOOT':'FRAME','Colonnina piena di trasferimento carico: piedino -> trave di base',1);
 }
 // side storage banks isolated from motherboard carriers
 diskBank('left',state.n,width);diskBank('right',state.n,width);
 rearSkeleton(width);
 guideBridge(width);
 // dual sided lateral beams
 pushBox(146,43,25,11,339,18,C.frame,'FRAME','Spina divisoria banco dischi / compute',.97);
 pushBox(limit+10,43,25,11,339,18,C.frame,'FRAME','Spina divisoria compute / banco dischi',.97);
 for(let i=0;i<7;i++)module(i,width);
 coolingKit(width);
 // Legacy floor pads are not part of the current render; the standalone scene owns its base.
  // Placeholder for factory-certified cabling only; NO 230 V printed distribution boards or bare mains.
  // UPS rear IEC outputs are a capacity CONSTRAINT (4 backed up + 4 surge-only), not 7 backed-up sockets.
 if(state.wiring){pushBox(52,429,50,width-104,11,15,C.cable,'POWER','Canalina posteriore elettrica protetta',.92);
 pushBox(width-92,415,53,53,27,31,C.psu,'POWER','Punto di raccolta cavi AC commerciali · NON è un distributore 230V autocostruito',.97);
 pushBox(width-30,434,62,18,6,10,C.orange,'POWER','Cavi AC commerciali da UPS, NON contatto scoperto',1);
 for(let j=0;j<5;j++){const x=230+j*196;if(x<width-170){pushBox(x-12,414,48,24,14,15,'#426d73','POWER','Fascetta fissacavo posteriore',1);wire([[x,423,67],[x,426,88]],C.cable,2,'POWER')}}}
 if(state.scene!=='thermal')upsSidecar(width);
 // Overall schematic dimensions (units = millimetres); only authoritative within this drawing.
 // 0..width overall including end allowance, y=16..445 overall incl AC conduit,
 // z=0..334 top of unloaded handle (raised modules intentionally excluded).
 dimension([0,16,0],[width,16,0],`${width.toLocaleString('it-IT')} mm · L`,[0,-79,0]);
 dimension([width,16,0],[width,445,0],'429 mm · P',[75,0,0],'#79dbd3');
 dimension([width,445,0],[width,445,334],'334 mm · H',[98,0,0],'#86aff0');
 dimension([178,45,40],[274,45,40],'96 mm · passo',[0,-8,0],'#f5c17b');
 text3([width*.5,465,50],'RETRO  ·  LAN / USB / AC',C.metal,10,'DIM');
 text3([width*.5,-7,52],'FRONTE  ·  ACCESSO AI MODULI',C.metal,10,'DIM');
 if(state.showUPS&&state.scene!=='thermal'){
  dimension([0,-116,0],[width+200,-116,0],`${(width+200).toLocaleString('it-IT')} mm · INGOMBRO LATERALE CON UPS`,[0,-25,0],'#c6c9ad');
  dimension([width+193,8,0],[width+193,535,0],'~535 mm · con corridoio cavi',[87,0,0],'#d8ad82');
 }
 $('variant-pill').textContent='H-7 FB-1 · SPINA DI PESCE';if(state.scene==='tower')$('scene-subtitle').textContent=state.showUPS?`${width} × 429 × 334 mm corpo; +200 mm fianco UPS; retro libero fino a ~535 mm`:`${width} × 429 × 334 mm · solo corpo`;return width;
}
function basis(){const a=state.yaw,e=state.pitch,dir=[Math.sin(a)*Math.cos(e),Math.cos(a)*Math.cos(e),Math.sin(e)];return {right:[Math.cos(a),-Math.sin(a),0],up:[-Math.sin(a)*Math.sin(e),-Math.cos(a)*Math.sin(e),Math.cos(e)],dir}}
let cam;
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]}
function projection(p){const v=[p[0]-cam.center[0],p[1]-cam.center[1],p[2]-cam.center[2]],depth=dot(v,cam.b.dir),scale=cam.base/(1-depth/cam.distance);
 return {x:W/2+(cam.ox||0)+dot(v,cam.b.right)*scale,y:H/2+(cam.oy||0)-dot(v,cam.b.up)*scale,depth,scale};}
function faceAvg(p){return p.reduce((a,q)=>[a[0]+q[0]/p.length,a[1]+q[1]/p.length,a[2]+q[2]/p.length],[0,0,0])}
function polygonPath(points){const path=new Path2D();points.forEach((p,i)=>i?path.lineTo(p.x,p.y):path.moveTo(p.x,p.y));path.closePath();return path}
function redraw(){const width=make(),b=basis(),cx=FB.first+state.focusIndex*FB.pitch;refreshPartPicker();
 const detail=state.scene==='module',rear=state.scene==='rear',standalone=state.scene==='standalone',upsFocus=state.scene==='ups',room=['room','workstation','cabinet','light','storage','desk'].includes(state.scene),focus=['workstation','desk'].includes(state.scene),cabinetFocus=['cabinet','light','storage'].includes(state.scene),lip=state.scene==='lipdetail';
 const frameWidth=state.scene==='haugadetail'?1950:lip?1950:cabinetFocus?2150:focus?2900:room?6600:(upsFocus?680:detail?590:rear?width*1.34:(width+(state.showUPS&&state.scene!=='thermal'?225:0))*1.52);
 const frameHeight=state.scene==='haugadetail'?1850:lip?1900:cabinetFocus?1900:focus?2400:room?6400:(upsFocus?700:detail?700:rear?760:780);
 const dimScale=clamp(Math.min(W/frameWidth,H/frameHeight),.035,4)*state.zoom;
 cam={b,center:state.scene==='haugadetail'?[300,820,380]:lip?[270,850,500]:state.scene==='storage'?[2760,205,750]:cabinetFocus?[440,2405,650]:focus?[1180,1100,880]:room?[1530,1770,1090]:(standalone?[FB.length/2,166,140]:upsFocus?[width+80,230,155]:detail?[cx,FB.cy,244]:rear?[width/2,FB.depth/2,190]:[(width+(state.showUPS&&state.scene!=='thermal'?170:0))/2,210,160]),distance:state.scene==='haugadetail'?2300:lip?2200:cabinetFocus?3200:focus?4900:room?16000:Math.max(850,width*1.45),base:dimScale};
 // Fit the physical tower geometry rather than its nominal bounding envelope.
 if((state.scene==='tower'||state.scene==='room'||state.scene==='standalone')&&!state.dims&&!state.clearance){
  cam.base=1;cam.ox=0;cam.oy=0;
  const pts=[];for(const f of faces){if(isVisibleGroup(f.group) && !['GRID','DIM','CLEAR','FLOORREF'].includes(f.group) && !(state.scene==='room' && ['WALL','WALLCUT','FLOOR'].includes(f.group)))for(const p of f.p)pts.push(projection(p));}
  if(pts.length){let minX=Infinity,maxX=-Infinity,minY=Infinity,maxY=-Infinity;
   for(const p of pts){minX=Math.min(minX,p.x);maxX=Math.max(maxX,p.x);minY=Math.min(minY,p.y);maxY=Math.max(maxY,p.y);}
   const top=W<600?65:75,bottom=W<600?76:70,pad=W<600?16:50;
   const scale=Math.min((W-2*pad)/Math.max(1,maxX-minX),(H-top-bottom)/Math.max(1,maxY-minY));
   cam.base=Math.max(.05,scale)*state.zoom;
   cam.ox=-(minX+maxX-W)/2*cam.base;
   cam.oy=(top-bottom)/2-(minY+maxY-H)/2*cam.base;
  }
 }
 ctx.clearRect(0,0,W,H);
 const grd=ctx.createRadialGradient(W*.5,H*.45,90,W*.5,H*.45,Math.max(W,H)*.75);grd.addColorStop(0,'#15303c');grd.addColorStop(1,'#0a1620');ctx.fillStyle=grd;ctx.fillRect(0,0,W,H);
 // distant vignette horizon / front/back guidance
 const ordered=[];
 for(const f of faces){const center=faceAvg(f.p),pp=f.p.map(projection);ordered.push({...f,center,pp,depth:dot([center[0]-cam.center[0],center[1]-cam.center[1],center[2]-cam.center[2]],b.dir)})}
 // In the cutaway room view, architectural surfaces are a backdrop, never a
 // foreground mask: painter-ordering by face centroid otherwise hides monitors
 // and furniture when the high walls cross the camera's sight lines.
 const roomBackdrop=new Set(['FLOOR','WALL','WALLCUT','WINDOW']);
 ordered.sort((a,z)=>{
  if((state.xray||state.isolate)&&state.selected){
   const k=Number(a.group===state.selected)-Number(z.group===state.selected);
   if(k)return k;
  }
  return state.scene==='room'
   ? Number(!roomBackdrop.has(a.group))-Number(!roomBackdrop.has(z.group)) || a.depth-z.depth
   : a.depth-z.depth;
 });
 pick=[];
 const light=[.36,-.54,.77];
 for(const f of ordered){
  if(!isVisibleGroup(f.group)||(state.scene==='room'&&f.group==='WALLCUT')||f.group==='GRID')continue;
  const chosen=f.group===state.selected,path=polygonPath(f.pp),bright=clamp(.67+.33*dot(f.normal,light),.35,1.12);
  let opacity=f.opa;
  if(state.isolate&&state.selected&&!chosen)opacity*=.14;
  else if(state.xray&&!chosen)opacity*=state.selected?.34:.48;
  if(chosen)opacity=Math.max(opacity,.94);
  ctx.fillStyle=tint(f.color,chosen?1.24:bright,opacity);
  ctx.fill(path);
  ctx.save();
  ctx.lineWidth=chosen?2.2:.52;
  ctx.strokeStyle=chosen?'rgba(100,255,222,1)':'rgba(3,18,27,.42)';
  if(chosen){ctx.shadowColor='#4cebd1';ctx.shadowBlur=9;}
  ctx.stroke(path);ctx.restore();
  if(f.group&&f.group!=='DIM')pick.push({path,group:f.group,name:f.name});
 }
 const orderedLines=lines.filter(l=>isVisibleGroup(l.group)).map(l=>({
  ...l,pp:l.points.map(projection),depth:l.points.reduce((acc,p)=>acc+dot([p[0]-cam.center[0],p[1]-cam.center[1],p[2]-cam.center[2]],b.dir)/l.points.length,0)
 })).sort((a,b)=>a.depth-b.depth);
 for(const l of orderedLines){
  const chosen=l.group===state.selected;
  const opacity=chosen?1:(state.isolate&&state.selected?.15:state.xray?.42:1);
  ctx.beginPath();l.pp.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));
  ctx.lineWidth=l.width*(chosen?2:1)*Math.min(1.65,Math.max(.7,state.zoom));
  ctx.strokeStyle=tint(chosen?'#71ffdc':l.color,1,l.opa*opacity);
  ctx.setLineDash(l.dash);ctx.stroke();ctx.setLineDash([]);
 }
 if((state.labels&&state.selected)||state.dims||state.scene==='room'){
  for(const l of labels){
   if(!isVisibleGroup(l.group))continue;
   if(!((l.group==='ROOMLABEL'&&state.scene==='room')||(l.group==='DIM'&&state.dims)||(l.group!=='DIM'&&state.labels&&l.group===state.selected)))continue;
   const p=projection(l.pos);
   ctx.save();ctx.font=`${l.size<12?'600':'800'} ${l.size}px system-ui, sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';
   const m=ctx.measureText(l.value).width;
   ctx.fillStyle='#0c222de8';ctx.fillRect(p.x-m/2-6,p.y-9,m+12,18);
   ctx.fillStyle=l.group===state.selected?'#8cffe1':l.color;ctx.fillText(l.value,p.x,p.y);ctx.restore();
  }
 }
 // XYZ mini axes, screen-space, from world basis
 const orig={x:W-69,y:76},axis=[[80,0,0,'X','#f5aa62'],[0,80,0,'Y','#6dd9d0'],[0,0,80,'Z','#93b3ef']];
 for(const ax of axis){let p=projection([cam.center[0]+ax[0],cam.center[1]+ax[1],cam.center[2]+ax[2]]),c=projection(cam.center);let dx=(p.x-c.x)*.45,dy=(p.y-c.y)*.45;let k=25/Math.max(5,Math.hypot(dx,dy));dx*=k;dy*=k;ctx.strokeStyle=ax[4];ctx.fillStyle=ax[4];ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(orig.x,orig.y);ctx.lineTo(orig.x+dx,orig.y+dy);ctx.stroke();ctx.font='700 11px system-ui';ctx.fillText(ax[3],orig.x+dx*1.29,orig.y+dy*1.29)}
}
function dimensions(){const r=vp.getBoundingClientRect();dpr=Math.min(devicePixelRatio||1,2);W=Math.max(1,r.width);H=Math.max(1,r.height);canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);redraw()}
function clearSelection(){state.selected=null;state.selectedName='';$('inspector').hidden=true;tip.style.opacity=0;redraw()}
function select(id,name='',at=null){state.selected=id;state.selectedName=name;
 const chosenModule=/^(?:P|A|PCB)([1-7])$/.exec(id);if(chosenModule)state.focusIndex=Number(chosenModule[1])-1;
 const title=$('part-title'),desc=$('part-desc'),tags=$('part-tags');let t='Elemento',d='',tt=[];
 if(/^P\d$/.test(id)){t=`Modulo PC · ${id}`;d='Telaio mobile uguale per tutte le campate (passo 96 mm); X stampata completa e dietro la PCB, collegata a quattro nodi perimetrali. Sei distanziatori M3 metallici tengono la scheda lontana dalla stampa: i fori raffigurati sono indicativi, vanno rilevati sulla scheda reale. Il peso verticale arriva alle due sedi inferiori collegate alle traverse di base, i carichi laterali alle guide alte su fronte e retro; NON alle X basse dello schienale. Prima dell’estrazione scollegare alimentazione e I/O e togliere entrambi i fermi.';tt=['6 appoggi M3 metal · schema','X stampata completa','PCB distaccata dal polimero','foratura donor-specific']}
 else if(/^A\d$/.test(id)){t=`Adattatore stampato · ${id}`;d='La motherboard non appoggia direttamente sulla stampa. Sei distanziali metallici M3 (10 mm illustrativi) attraversano l’intercapedine tra piazzole dell’adattatore e PCB. L’adattatore ha una X a due diagonali complete, nodo centrale pieno e quattro puntoni verso traverse superiore e inferiore della cartuccia. Le coordinate dei sei fori restano da confrontare con la motherboard donatrice, senza forzarne la scheda.';tt=['6 distanziali M3','diagonali continue','4 puntoni verso carrello','foratura da misurare']}
 else if(id==='DOCK'){t='Sede di appoggio reale del cassetto';d='Ogni linguetta mobile entra dall’alto nel ricevitore fisso a U: il fondo è a z=52 mm e la spalla sulle guance è a z=89 mm. La U si collega tramite traversini inferiori ai due longheroni fissi e alle traverse della campata, poi al telaio di base; NON alle X posteriori. Fermo anti-sollevamento separato e rimovibile, ancora da dimensionare.';tt=['2 sedi inferiori','costole di rinforzo','guida superiore distinta','portata da testare']}
 else if(id==='LOCK'){t='Due fermi di ritenuta indipendenti';d='Una spina anteriore e una posteriore passano 4 mm sopra le spalle delle sedi, impedendo il sollevamento oltre quel gioco. Si estraggono a mano prima di sollevare il modulo, dopo avere scollegato tutti i cavi. Staffe, fori e carichi sono da progettare e testare: la demo li tratta come entrambi sbloccati con un comando.';tt=['anteriore + posteriore','4 mm gioco ipotetico','prima scollegare i cavi','prototipo da testare']}
 else if(id==='GUIDE'){t='Guide alte anti-oscillazione';d='Due coppie di guance fisse, davanti e dietro, abbracciano con gioco il montante verticale di 8 mm. La luce illustrativa è 12 mm: 2 mm per lato, valore da verificare in prototipo secondo stampante, materiale e temperatura. Gli sforzi laterali vanno alle traverse esterne (davanti y=56 mm; dietro y=332 mm), poi ai montanti e alla base; la corsia superiore del cassetto resta aperta per l’estrazione verticale.';tt=['2 stazioni per vano','luce 12 / guida 8 mm','apertura sopra libera','rigidezza da provare']}
 else if(id==='GUIDEFRAME'){t='Traverse superiori perimetrali';d='Due binari orizzontali perimetrali paralleli al fronte e al retro, fuori dall’ingombro mobile y=74–323 mm. Segmentati al passo 96 mm, collegati a montanti ogni tre campate e rinforzati alla base. I giunti e il fissaggio finale vanno progettati per flessione e taglio: nessuna certificazione strutturale è ancora disponibile.';tt=['fuori dal percorso dei moduli','giunti ogni 96 mm','montanti ogni 3 vani','prove torsione necessarie']}
 else if(id==='FOOT'){t='Coppia di piedini centrali';d='Due piedini antivibranti sotto la mezzeria, uno davanti e uno dietro, collegati tramite rialzi verticali alle travi principali e una traversa mediana portante sotto le sedi dei cassetti. Riduce la luce libera delle travi lunghe, ma non è una prova della portata definitiva. Altezza e appoggio regolabile da validare sul piano reale.';tt=['2 piedini', 'traversa centrale', 'meno flessione globale','portata da verificare']}
 else if(id==='BACKBONE'){t='Schienale libero alle prese';d='Le grandi X alte sono state eliminate. Due triangoli bassi integrati (sotto quota z=112 mm) irrigidiscono la base; restano montanti snelli tra i vani e una traversa alta sopra le prese. Non sostengono le cartucce: il carico scende dalle linguette nelle sedi di base e poi nelle travi inferiori. La rigidezza va ancora verificata con prove e carichi reali.';tt=['X basse complete','porta I/O z=126–209 mm','NON porta le cartucce','test flessione necessario']}
 else if(id==='IO'){t='Pannello delle prese sul retro';d='Piastra posteriore con LAN RJ45, USB e fascetta di scarico della trazione dei cavi. Il pannello rappresenta un possibile riporto delle porte: ogni cavo si scollega prima di estrarre la cartuccia. Non è un backplane elettronico.';tt=['LAN / USB','scollegabile','accessibile dal retro']}
 else if(id==='STORAGE'){t='Banchi HDD laterali';d='Due cartucciere laterali indipendenti. Numero e dimensioni delle unità raffigurati a scopo illustrativo; ogni disco deve avere alimentazione e connessione dati definite.';tt=['lato destro / sinistro','dischi separati']}
 else if(id==='UPS'){t='UPS candidato · PowerWalker VI 1500 CSW IEC';d='Apparecchio commerciale intatto, collocato in verticale su pavimento o piano strutturalmente indipendente dalla Torre. Ingombro verificato 99 × 410 × 280 mm; massa 13,1 kg. Lo spazio laterale di 66 mm e la riserva posteriore di circa 110 mm sono IPOTESI di allestimento, non prescrizioni del produttore; verificare il manuale. Niente pannelli chiusi attorno, accesso anteriore alla batteria, griglie non ostruite. Erogazione massima 900 W, non autonomia promessa.';tt=['1500 VA / 900 W','99×410×280 mm','13,1 kg a terra','non manomettere il case']}
 else if(id==='UPSPORT'){t='8 IEC: solo 4 con batteria';d='Retro del PowerWalker VI 1500 CSW IEC (SKU 10121124): quattro prese IEC C13 con alimentazione da batteria e quattro prese solo filtraggio/sovratensioni. Le altre quattro NON continuano a funzionare senza rete. I sette computer non risultano tutti sotto continuità: assegnare prima le utenze realmente critiche e misurare il carico totale. Cavi e connettori commerciali certificati; USB HID per NUT e arresto ordinato.';tt=['4× backup','4× solo surge','USB HID → NUT','no multiprese fai-da-te']}
 else if(id==='UPSLOC'){t='Sede di posizionamento non portante';d='Quattro semplici riscontri stampati delimitano la posizione dell’UPS. Nessuna mensola o pavimento stampato sostiene i suoi 13,1 kg: tutto il peso resta sul piano. Prima di spostarlo si scollegano i cavi.';tt=['nessun peso sulla stampa','indipendente dal telaio','niente cassetto']}
 else if(id==='UPSCLEAR'){t='Spazi aperti per ventilazione e cavi';d='I 66 mm laterali e la zona fino a y=535 mm dietro le prese sono riserve di studio, NON clearance approvate dal manuale PowerWalker. Lasciare libero il fronte per LCD e manutenzione batteria. Nessuna copertura superiore e nessun cavo a 230 V esposto.';tt=['lati aperti','retro accessibile','verifica manuale','no enclosure']}
 else if(id==='UPSCABLE'){t='Percorsi cavi solo schematici';d='Linee tratteggiate illustrative per IEC rete e USB HID, non un cablaggio esecutivo. Niente collegamenti fissi o distribuzione rete autocostruita. Le quattro prese con backup vanno assegnate a nodi prioritari; verifica potenza e spunti necessari.';tt=['IEC originali','USB HID','no 230V stampati']}
 else if(id==='POWER'){t='Alimentazione e canalina posteriore';d='Alimentatori commerciali indipendenti, con collegamenti rimovibili e canalina elettrica protetta. La rappresentazione non è uno schema di cablaggio AC esecutivo.';tt=['protezione elettrica','nessun backplane AC fai-da-te']}

  else if(id==='WALL'||id==='WALLCUT'){t='Involucro stanza';d='Pianta circa 5000 × 5000 mm; unico smusso all’angolo dei PC (350 mm ipotizzati), altri tre angoli a 90°. Altezza soffitto 3000 mm dichiarata; vista aperta per non occultare gli arredi.';tt=['5 × 5 m','unico smusso','altezza da rilevare']}
  else if(id==='WINDOW'){t='Finestra · parete mobile bianco';d='Apertura dichiarata 2100 × 1600 mm, con bordo a circa 500 mm dall’angolo opposto al PC. Soffitto a 3000 mm; davanzale a 1000 mm e divisione delle ante sono ipotesi grafiche.';tt=['210 × 160 cm','50 cm dall’angolo','davanzale da rilevare']}
  else if(id==='FLOOR'){t='Pavimento del locale';d='Piano di riferimento dell’angolo stanza. Le misure sono schematiche e servono a confrontare ingombri e percorsi.';tt=['base metrica','solo contesto']}
  else if(id==='LIP'){t='Spalletta a U del mobile';d='Risalto su tre lati, alto 90 mm e spesso 10 mm misurati. Progetto R-2: nessun carico o fissaggio della Torre su HAUGA. Il telaio portante è esterno e arriva a pavimento.';tt=['H90 e spessore 10 mm misurati','non portante per Torre','nessuna vite aggiuntiva']}
 else if(id==='LIGHTBASE'){t='Base reticolare alleggerita R-3';d='Travi reticolari sottili e correnti sul perimetro al posto della pesante piastra piena da 18 mm. La geometria è un concept: non provata a flessione, giunti, vibrazione e resistenza a estrazione dei moduli. Richiesto CAD e collaudo con carico inerte.';tt=['mass budget ~1,8 kg','base autoportante a pavimento','non stampare senza verifica'];}
 else if(id==='LIGHTSUPPORT'){t='Sei rialzi metallici smontabili FB-1';d='Supporti di studio H109 mm, posati sul piano interno HAUGA, senza caricare la spalletta da 90 mm. Da verificare antiscivolo, fissaggi al telaio, reazioni e massa totale entro 20 kg.';tt=['6 appoggi','nessuna vite nel mobile','collaudo necessario'];}
 else if(id==='STANDRAIL'){t='Base autonoma · due longheroni a pavimento';d='Due correnti metallici bassi allineati alla H-7 e separati da traverse. La Torre viene abbassata rispetto alla versione su HAUGA senza cambiare i sette moduli. Il profilo, il fissaggio ai giunti e la portata non sono ancora verificati.';tt=['nessun mobile necessario','solo alluminio/acciaio','base da collaudare'];}
 else if(id==='STANDCROSS'){t='Base autonoma · tre traverse';d='Tre sezioni basse collegano i due longheroni e distribuiscono il peso della Torre. Le connessioni illustrate non sostituiscono verifiche di flessione, torsione, concentrazione degli sforzi e risonanza.';tt=['3 traverse','giunti smontabili','calcoli da eseguire'];}
 else if(id==='STANDPAD'){t='Ali stabilizzatrici opzionali';d='Quattro pattini frontali e posteriori removibili, mostrati aperti. Aumentano il poligono di appoggio ma NON sostituiscono una verifica antiribaltamento con carico reale; non sono fissaggi di sicurezza certificati.';tt=['4 ali opzionali','maggiore profondità','sicurezza da verificare'];}
 else if(id==='STANDRUBBER'){t='Punti di contatto a pavimento';d='Appoggi antiscivolo sotto i longheroni e le ali opzionali. Bisogna determinare attrito e carico puntuale secondo il pavimento reale e decidere se servono vincoli indipendenti a parete o a pavimento.';tt=['nessun truciolare HAUGA','attrito da testare','piano livellato'];}
 else if(id==='STANDJOINT'){t='Giunti smontabili della base a terra';d='Staffette illustrative in corrispondenza delle traverse e dei sei punti di trasferimento del peso. Fissaggio e robustezza devono essere progettati; l’incastro non è una prova meccanica.';tt=['traverse e longheroni','bulloneria da definire','nessun legno'];}
 else if(id==='FLOORREF'){t='Suolo di riferimento';d='Il piano e la griglia rappresentano il pavimento nella vista autonoma: non sono una piastra aggiunta né un elemento di supporto. La Torre è sostenuta dai profilati metallici e dai piedi antiscivolo.';tt=['riferimento visivo','non strutturale'];}
 else if(id==='LIGHTPAD'){t='Piattelli di ripartizione FB-1';d='Sei basi indicative 72 × 54 mm su HAUGA; verificare materiale, posizione rispetto ai pannelli portanti, deformazione, attrito e carico concentrato.';tt=['top max 20 kg','test a carico inerte','non sulla spalletta'];}
 else if(id==='PORTAL'){t='Portale R-2 con quattro montanti a terra';d='Supporto indipendente studiato attorno al mobile: quattro montanti 40×40, due traversi superiori a campata intera, piastra 1130×450 e bracci laterali. Bordo basso dei traversi a 560 mm: 20 mm teorici liberi sopra HAUGA. Larghezza telaio 1470 mm richiede 50 mm per lato, ma le scarpe richiedono 55 mm + tolleranze: riservare almeno 60 mm per lato. Nessuna vite nel mobile né carico sul piano IKEA. Necessari verifiche di spazio, vibrazione, flessione, ribaltamento e controventi; possibili vincoli al muro indipendenti.';tt=['portata HAUGA: 20 kg, non impiegata','R-2 senza viti nel mobile','portale 1470 mm','solo studio']}
 else if(id==='PORTALBRACE'){t='Controventi laterali';d='Ogni fianco fuori sagoma del mobile ha traversa bassa, alta e diagonale; nessun traverso davanti ai cassetti. Il controvento in direzione trasversale e gli eventuali vincoli al muro sono ancora da definire.';tt=['solo sui fianchi','accesso cassetti libero','verifica torsione']}
 else if(id==='PORTALFOOT'){t='Piedi indipendenti a pavimento';d='Quattro piastre orientative per sostenere il portale senza utilizzare il mobile. Verificare livellamento, materiale del pavimento, appoggio e anti-scorrimento; non sostituiscono verifica antiribaltamento.';tt=['quattro contatti pavimento','nessuna vite su HAUGA','non certificato']}
 else if(id==='PORTALLOCK'){t='Quattro agganci rimovibili Torre / portale';d='Staffette e spine metalliche riutilizzabili trattengono la Torre sul portale. Sfilando gli agganci (dopo aver tolto alimentazione e tutti i cavi), l’H-7 si può collocare sul pavimento con i suoi piedini, ed eventualmente pattini allargati. Il materiale e la resistenza degli agganci devono ancora essere verificati.';tt=['stessa Torre in 2 posizioni','nessuna vite sul mobile','fissaggi su metallo']}
 else if(id==='STANDPAD'){t='Pattini opzionali per uso autonomo';d='Il telaio H-7 possiede già dieci piedini integrati e può poggiare su un piano rigido. Quattro pattini opzionali a incastro aumentano l’impronta e contrastano le spinte laterali, senza modificare i sette vani. Incastro e materiale da provare.';tt=['telaio autonomo','4 componenti opzionali','stabilità da provare']}
 else if(id==='OUTLETAC'){t='Presa elettrica a parete';d='Presa 230 V esistente dichiarata sulla parete a destra della postazione, approssimativamente un metro dopo lo spigolo/smusso. La quota 260–360 mm sopra pavimento è illustrativa, non rilevata. Alimentazione UPS con spina/cavo commerciale certificato; nessun 230 V stampato.';tt=['posizione circa 1 m','distanza da rilevare','solo impianto esistente']}
 else if(id==='OUTLETLAN'){t='Presa Ethernet RJ45';d='Punto LAN sulla stessa parete della presa elettrica. Si tratta di un frutto distinto; il cavo va nel proprio passacavo blu, separato dalla canaletta AC e raggiunge il modem/rack e la Torre senza attraversare il passaggio della sedia.';tt=['RJ45','canaletta dati separata']}
 else if(id==='ACDUCT'){t='Canaletta alimentazione AC';d='Percorso protetto lungo la parete destra, lo smusso e dietro il mobile, separato dalla LAN. I segmenti modellati sono sezioni indicative (23×17 mm) da dimensionare in base a numero di cavi, diametro, temperatura, raggi di curva e normative. Solo prolunghe/cavi certificati, niente connessioni domestiche improvvisate.';tt=['perimetro, non sotto la sedia','separata dai dati','sezione ipotetica']}
 else if(id==='NETDUCT'){t='Canaletta Ethernet dati';d='Canalina CAT6 lungo pareti e bordo mobile, fisicamente separata dalla rete 230 V. Il tratto finale arriva alla zona posteriore della Torre con una lunghezza di servizio rimovibile per ogni cartuccia.';tt=['rete dati','servizio sfilabile','separazione AC']}
 else if(id==='ACFLEX'){t='Bretella AC di servizio';d='Tracciato schematico della linea dal muro all’UPS e dall’UPS alle utenze selezionate. I cavi non devono passare sotto ruote o spigoli: verificare lunghezza, spine IEC e connettori prima del montaggio.';tt=['commerciale certificato','niente attraversamenti a pavimento']}
 else if(id==='NETPATCH'){t='Patch Ethernet / bretella di servizio';d='Cavo LAN separato dalla rete elettrica, con riccio di servizio e scollegamento prima di sollevare le cartucce. I percorsi nel browser rappresentano la destinazione, non una posa esecutiva.';tt=['CAT6','scollegare per estrazione']}
  else if(id==='RACKMODEM'){t='Modem nel multilivello';d='Router appoggiato su ripiano arieggiato insieme alla stampante e a tutti i satelliti audio. Alimentazione e connessioni devono rimanere accessibili e separate dal cablaggio IEC dell’UPS.';tt=['nel mobile multilivello','accesso ai cavi']}
  else if(id==='WHITECAB'){t='Mobile bianco · candidato IKEA HAUGA 004.150.47';d='Esemplare L1370×P355×H540 mm; catalogo 1380×360×540. Corpo fino a 450mm, spalletta +90mm. Due vani aperti, due cassetti, quattro pomelli; pannelli di truciolare rivestito e schienale in fibra. Ha almeno tre anni. Limite top 20kg; ancoraggio a parete obbligatorio. La Torre R-2 si sostiene su telaio indipendente a terra.';tt=['IKEA HAUGA candidato da confermare','luce nominale 1345×330','top max 20kg','fissaggio a parete obbligatorio'];}
 else if(id==='HAUGABACK'){t='HAUGA · schienale';d='Pannello di fibra verniciata con passaggio cavi posteriore. La posizione e forma degli intagli nel render sono schematiche: non usare per tagliare o forare.';tt=['fibra verniciata','uscita cavi posteriore','posizione illustrativa'];}
 else if(id==='HAUGASHELF'||id==='HAUGAOPEN'){t='HAUGA · due vani aperti';d='Due vani superiori separati dal divisorio centrale e da un ripiano sopra i cassetti. Misure IKEA nominali 660 mm larghezza, 175 mm altezza, superficie interna superiore profonda 330 mm; portata ripiano 12-13 kg secondo mercati.';tt=['2 vani','660×175 mm nominali','12-13kg/vano'];}
 else if(id==='HAUGADRAWER'){t='HAUGA · due cassetti';d='Un cassetto inferiore per metà, frontale bianco con due pomelli scuri, totale quattro. Portata massima IKEA 9 kg per cassetto; guide e dimensioni di sezione schematizzate.';tt=['2 cassetti','4 pomelli','9kg/cassetto'];}
 else if(id==='HAUGAKNOB'){t='HAUGA · quattro pomelli';d='Quattro maniglie metalliche scure tonde, due per cassetto. Forma rappresentata, diametro illustrativo da verificare.';tt=['4 pomelli','diametro indicativo'];}
 else if(id==='HAUGAGUIDE'){t='HAUGA · guide cassetti';d='Guide metalliche presenti secondo manuale; posizione e dimensioni del 3D sono indicative, non quote utilizzabili in officina.';tt=['schematiche','non esecutive'];}
 else if(id==='LIP'){t='HAUGA · bordi a U';d='Il fianco rialzato è smussato anteriormente. Altezza spalletta riferita +90mm; bordo posteriore dichiarato spesso 10mm, fianchi circa 17,5mm dedotti dal disegno IKEA, non misurati. Nessuna portata certificata del solo bordo.';tt=['U su 3 lati','smusso frontale','non portante per Torre'];}
 else if(id==='DARKDRAWER'){t='Cassettiera autonoma a pavimento';d='Cassettiera scura da 400 × 260 mm ipotetici, posizionata sul pavimento con il lato lungo addossato alla parete a destra della scrivania. Non poggia sul mobile bianco e non sostiene la Torre.';tt=['lato lungo a muro','separata dal bianco']}
  else if(id==='PRINTER'){t='Brother HL-1110 nel multilivello';d='Ingombro nominale 340 × 238 × 189 mm. Si trova sul ripiano inferiore del mobile multilivello, non sul mobile bianco né sulla cassettiera. Lasciare libera la corsa della carta e l’apertura delle coperture.';tt=['340 × 238 × 189 mm','nel mobile multilivello']}
  else if(id==='MODEM'){t='Modem / router';d='Posizione proposta sul mobile basso, arretrata e vicina all’angolo, per distribuire meglio alimentazione e cavi senza passare davanti alla sedia.';tt=['stima 22 × 16 × 5,8 cm','da identificare meglio']}
  else if(id==='SUBWOOFER'){t='Subwoofer sulla cassettiera';d='Subwoofer stimato 260 × 180 × 360 mm, spostato sopra la cassettiera a destra della scrivania. In questo assetto libera il pavimento e resta vicino al rack audio; va comunque verificata la stabilità dinamica e l’eventuale trasmissione di vibrazioni al mobile.';tt=['sopra cassettiera','vibrazioni da verificare']}
  else if(id==='AUDIOLEFT'){t='Satellite 1 · multilivello';d='Satellite grande stimato 70 × 90 × 210 mm sul ripiano centrale, vicino al router.';tt=['7 × 9 × 21 cm','ripiano centrale']}
  else if(id==='AUDIORIGHT'){t='Satellite 2 · multilivello';d='Secondo satellite grande accanto al primo, sul ripiano centrale.';tt=['7 × 9 × 21 cm','ripiano centrale']}
  else if(id==='RACK'){t='Mobile multilivello alla parete destra';d='Ripiano a più livelli orientato con lato lungo 520 mm aderente al muro, profondità 340 mm indicativa. Ospita Brother HL-1110, router e tutti e quattro i satelliti audio; il VGA resta fissato al muro, non sul mobile.';tt=['520×340 mm stimati','stampante / router / audio','VGA sul muro']}
  else if(id==='DESK'){t='Scrivania diagonale';d='Scrivania reale L1000 × P550 × H800 mm comunicata 23/11/2026. Orientamento proposto ruotato di circa 45° verso l’angolo della stanza. Questo migliora il campo visivo dei tre monitor e libera entrambi i fianchi per stampante e cablaggi.';tt=['orientamento 45°','setup principale']}
  else if(id==='CHAIR'){t='Sedia gaming a 5 razze';d='Modello 3D dettagliato con cinque ruote, piantone a gas, seduta, schienale alto, cuscino lombare, poggiatesta e due braccioli. Ingombro prudenziale circa 70 cm alla base e 120–135 cm di altezza. La corrispondenza con il tuo ASIN Amazon B07TYJDM5M non è verificata: non attribuire al prodotto queste quote.';tt=['orientata al monitor centrale','braccioli, lombare, poggiatesta','misure da confermare']}
  else if(id==='ARMCENTER'){t='Braccio VESA · monitor centrale';d='Ancora alla breve parete diagonale, con snodo e piastra VESA. Sbraccio di studio ~45 cm. Verificare materiale, portata della parete (lo smusso potrebbe non essere strutturale), staffa e peso reale dello schermo prima di forare.';tt=['ancoraggio sullo smusso','portata da verificare','nessun piedistallo']}
  else if(id==='ARMLEFT'){t='Braccio VESA · monitor VGA';d='Piastra sulla parete sinistra, con due sezioni snodate e attacco VESA. Posizione e sbraccio di studio; non appoggia sul tavolo.';tt=['parete sinistra','VESA da controllare','nessun piedistallo']}
  else if(id==='ARMRIGHT'){t='Braccio VESA · terzo monitor';d='Piastra sulla parete posteriore, braccio articolato e attacco VESA. Il monitor di dimensione intermedia non pesa sulla scrivania.';tt=['parete posteriore','sbraccio da verificare','nessun piedistallo']}
  else if(id==='MONHDMI'){t='Monitor centrale HDMI';d='Schermo principale fissato a parete con braccio articolato, più grande degli altri due, centrato davanti alla posizione di lavoro. Larghezza illustrativa circa 740 mm, compatibile con un TV/monitor intorno ai 32 pollici.';tt=['monitor principale','~32”']}
  else if(id==='MONVGA'){t='Monitor sinistro VGA';d='Monitor Acer V193W identificato dai dati EDID del nodo n1. Larghezza esterna verificata circa 442 mm. Nella proposta è il pannello secondario sinistro, sospeso con braccio a muro.';tt=['Acer V193W','~442 mm']}
  else if(id==='MONMID'){t='Terzo monitor intermedio';d='Schermo di dimensioni intermedie tra il VGA Acer e il monitor/TV HDMI: stima progettuale circa 590 mm di larghezza, equivalente grossomodo a un 24–25 pollici; è fissato a parete tramite braccio.';tt=['~24–25”','dimensione intermedia']}
  else if(id==='LAPTOP'){t='Laptop aperto sul leggio';d='Laptop su supporto inclinato da scrivania; posizione schematica, cablaggio verso il pannello USB-C da verificare.';tt=['leggio','scrivania']}
  else if(id==='AUDIOCENTER'){t='Speaker centrale da scrivania';d='Piccolo speaker orizzontale sotto il monitor principale, stimato circa 240 × 80 × 75 mm. Aiuta a concentrare l’audio vicino all’utente senza rubare troppo spazio.';tt=['24 × 8 × 7,5 cm','stima']}
  else if(id==='DESKSATLEFT'){t='Satellite 3 · multilivello';d='Satellite piccolo precedentemente sulla scrivania, ora sul ripiano superiore.';tt=['7 × 9 × 17,5 cm','ripiano superiore']}
  else if(id==='DESKSATRIGHT'){t='Satellite 4 · multilivello';d='Altro satellite piccolo, ora sul ripiano superiore; il piano della scrivania resta libero.';tt=['7 × 9 × 17,5 cm','ripiano superiore']}
 else if(/^PCB[1-7]$/.test(id)){t='Scheda madre '+id;d='Scheda e componenti illustrativi, separabili dal modulo con lo strato Schede. Foratura reale e dissipatori da rilevare prima di produrre adattatori.';tt=['scheda madre','dati illustrativi'];}
 else if(/^F[1-6]$/.test(id)){t=partDescriptions[id];d='Ventola commerciale candidata Arctic P14 PWM PST da 140 × 140 × 27 mm. 123,76 m³/h a bocca libera, 200–1700 rpm, 0,12 A a 12 V, temperatura ambiente operativa 0–40 °C. Griglie su entrambe le facce; ingresso dal fronte. Nessuna portata utile garantita: misurare con hardware e cablaggi reali.';tt=['140 mm','PWM 12 V','aspirazione frontale','non acquistata']}
 else if(id==='FANMOUNT'){t='Supporti ventole fissi e rimovibili';d='Due staffe per ventola sulla trave anteriore. Le ventole sono davanti al volume estraibile, non sopra le maniglie; rimozione frontale per servizio dei fermi o degli HDD. Attacchi, viti, materiale e ritenuta da collaudare.';tt=['y=16–49 mm','12 staffe','nessun vano aggiunto']}
 else if(id==='FANPOWER'){t='Alimentazione e controllo indipendenti';d='Sei ventole da 0,12 A nominali ciascuna: 0,72 A e 8,64 W nominali totali a 12 V. Alimentatore commerciale 12 V e controller PWM multi-canale compatibili, margine di avvio e protezione da verificare. Monitoraggio tachimetrico per ventola e profilo fail-safe; niente collegamenti improvvisati a più PC.';tt=['12 V DC','0,72 A nominali','6 tachimetri']}
 else if(id==='FRAME'){t='Telaio portante stampabile';d='Travi longitudinali, traverse segmentate, giunti, supporti intermedi e piedini antivibranti. L’incastro geometrico deve essere accompagnato da adeguata ritenuta meccanica e verifica della deformazione.';tt=['segmentato','stampabile','resistenza da testare']}
 else {t='Torre H-7';d='Elemento del modello orientativo.';tt=[]}
 title.textContent=t;desc.textContent=d;$('part-specific').textContent=name ? 'Elemento preciso: '+name : 'Selezione del sottosistema';
 tags.replaceChildren(...tt.map(x=>{const b=document.createElement('span');b.className='tiny';b.textContent=x;return b}));
 $('inspector').hidden=false;
 if(at){tip.textContent=name||t;tip.style.left=clamp(at.x+14,8,Math.max(8,W-270))+'px';tip.style.top=clamp(at.y-13,55,Math.max(55,H-100))+'px';tip.style.opacity=1}else{tip.style.opacity=0}
 redraw();
}
function buttonGroup(sel,active){document.querySelectorAll(sel).forEach(b=>b.classList.toggle('active',b===active))}
function view(v){if(v==='iso'){state.yaw=state.scene==='room'?.82:2.77;state.pitch=state.scene==='room'?.53:.45}else if(v==='top'){state.yaw=3.14;state.pitch=1.53}else if(v==='front'){state.yaw=3.14;state.pitch=.10}else if(v==='rear'){state.yaw=0;state.pitch=.25}else if(v==='side'){state.yaw=1.57;state.pitch=.23}state.zoom=1;buttonGroup('[data-view]',document.querySelector(`[data-view="${v}"]`));tip.style.opacity=0;redraw()}
function scene(mode){if(state.scene==='thermal'&&mode!=='thermal'){state.airflow=false;$('airflow').classList.remove('on')}state.scene=mode;state.zoom=1;state.lifted=null;state.explode=0;$('explode').value=0;$('explabel').textContent='0%';
 if(mode==='thermal'){state.yaw=2.85;state.pitch=.63;state.cooling=true;$('cooling').classList.add('on');state.airflow=true;$('airflow').classList.add('on');/* no forced dimensions */}
 else if(mode==='room'){state.yaw=.82;state.pitch=.53;state.xray=false;$('xray').classList.remove('on')}
 else if(mode==='cabinet'||mode==='light'||mode==='storage'){state.yaw=1.34;state.pitch=.52;state.xray=false;$('xray').classList.remove('on')}
 else if(mode==='lipdetail'||mode==='haugadetail'){state.yaw=1.48;state.pitch=.62;state.xray=false;$('xray').classList.remove('on')}
 else if(mode==='ups'){state.yaw=2.32;state.pitch=.42}
 else if(mode==='standalone'){state.yaw=2.68;state.pitch=.38;state.standpads=true;$('standpads').classList.add('on');$('standpads').setAttribute('aria-pressed','true')}
 else if(mode==='rear'){state.yaw=0;state.pitch=.28}
 else if(mode==='module'){state.yaw=2.3;state.pitch=.36;}
 else if(mode==='desk'){state.yaw=.82;state.pitch=.57;}
 else {state.yaw=2.77;state.pitch=.45}
 $('module-options').hidden=mode!=='module';$('tower-options').hidden=mode!=='standalone';
 if(mode==='module'){buttonGroup('#module-front,#module-back',$('module-front'));}

 if(mode==='ups'){state.showUPS=true;state.layers.ups=true;syncLayerControls();$('showUPS').classList.add('on')}
 if(mode==='tower'){state.clearance=false;$('clearance').classList.remove('on')}
 /* Scene changes do not overwrite visibility or overlay preferences. */
 const names={
  storage:['TORRINO H-4 · 4 BAY + HUB 4 PORTE','DAS SATA inizialmente vuoto · 8 TB e 4 TB esterni USB nell’hub · n2 host'],
  desk:['POSTAZIONE · LAPTOP E TELEFONO SU LEGGIO','Tastiera, mouse e sei USB-C a sinistra · due cavi collegati'],
  thermal:['VENTILAZIONE · 4 VENTOLE CANDIDATE','Schema da verificare sul prototipo · nessuna simulazione CFD'],
  standalone:['TORRE H-7 · AUTONOMA A TERRA','Stessi sette moduli FB-1 · base metallica bassa + pattini aggiuntivi · stabilità da collaudare'],
  tower:['TORRE H-7 · FB-1 A SPINA DI PESCE','Sette moduli inclinati di 42° in pianta · 1310 × 318 mm · no betulla e HDD'],
  rear:['RETRO · fascia delle prese libera','X basse sotto le porte; appoggio cassetti sulle sedi inferiori'],
  module:['CARTUCCIA FB-1 · DETTAGLIO MODULARE','Un modulo a 42° in pianta; adattatore e scheda da verificare'],
  ups:['UPS LATERALE · indipendente dalla stampa','99×410×280 mm · 13,1 kg sul piano · 4 IEC backup + 4 solo surge'],
  room:['STANZA 5 × 5 × 3 m · H-7 E DAS SEPARATI','Torre sul mobile bianco · DAS sulla cassettiera · audio e router nel multilivello'],
  cabinet:['H-7 FB-1 · DETTAGLIO SUL MOBILE HAUGA','Sei appoggi metallici, senza viti nel mobile · massa e carico da verificare'],
  light:['H-7 FB-1 · SENZA PIASTRA DI BETULLA','Base a profilati metallici aperta · niente HDD dentro · progetto da validare'],
  haugadetail:['IKEA HAUGA · MOBILE REALE','2 vani / 2 cassetti / 4 pomelli · top max 20 kg · catalogo e rilievo'],
  lipdetail:['H-7 R-2 · CONTATTO ZERO COL MOBILE','Sezione: portale portante, U libera, quattro piedi a terra, Torre removibile'],
  workstation:['POSTAZIONE · dettaglio dei tre supporti a muro','Piastra, doppio snodo, attacco VESA: ogni elemento si seleziona al clic']
 };
 $('scene-caption').textContent=names[mode][0];$('scene-subtitle').textContent=names[mode][1];
 const note=document.querySelector('.viewmark'),foot=document.querySelector('footer span:first-child');
 if(note)note.textContent=mode==='standalone'
   ?'AUTONOMA A TERRA · BASE METALLICA, NO BETULLA · PROTOTIPO NON COLLAUDATO'
   :'FB-1 · HAUGA MAX 20 kg · DAS SEPARATO · STUDIO NON ESECUTIVO';
 if(foot)foot.textContent=mode==='standalone'
   ?'H-7 · base a terra ~418 mm / ~616 mm con ali · ingombri e stabilità da verificare'
   :'H-7 FB-1 · studio 1310 × 318 mm · HAUGA max 20 kg · massa da verificare';
 buttonGroup('[data-preset]',document.querySelector('[data-preset="'+(mode==='standalone'?'autonoma':mode)+'"]'));buttonGroup('[data-scene]',document.querySelector(`[data-scene="${mode}"]`));clearSelection();
}
function moduleCamera(side){
 if(state.scene!=='module')return;
 state.yaw=side==='back'?-1.35:2.3;state.pitch=side==='back'?.30:.36;state.zoom=1;
 buttonGroup('#module-front,#module-back',$(side==='back'?'module-back':'module-front'));
 buttonGroup('[data-view]',null);redraw();
}
$('module-front').onclick=()=>moduleCamera('front');
$('module-back').onclick=()=>moduleCamera('back');
$('module-joint').onclick=()=>{
 state.moduleExploded=!state.moduleExploded;
 $('module-joint').classList.toggle('on',state.moduleExploded);
 $('module-joint').setAttribute('aria-pressed',String(state.moduleExploded));
 redraw();
};
$('standpads').onclick=()=>{
 state.standpads=!state.standpads;
 $('standpads').classList.toggle('on',state.standpads);
 $('standpads').setAttribute('aria-pressed',String(state.standpads));
 redraw();
};
document.querySelectorAll('[data-view]').forEach(el=>el.onclick=()=>view(el.dataset.view));
document.querySelectorAll('[data-scene]').forEach(el=>el.onclick=()=>scene(el.dataset.scene));
$('close-inspector').onclick=clearSelection;
$('part-picker').onchange=e=>{if(e.target.value)select(e.target.value);else clearSelection()};
$('showUPS').onclick=()=>{state.showUPS=!state.showUPS;$('showUPS').classList.toggle('on',state.showUPS);state.layers.ups=state.showUPS;syncLayerControls();if(state.scene==='ups'&&!state.showUPS)scene('tower');else redraw();};
$('load').oninput=e=>{state.loadEstimate=Number(e.target.value);const v=state.loadEstimate;$('load-label').textContent=`${v} / 900 W`;$('load-bar').style.width=(v/9)+'%';$('load-bar').classList.toggle('over',v>650);$('load-warning').textContent=v>900?'Supera la potenza massima nominale.':v>650?'Zona da verificare: minore riserva per picchi/autonomia; non è una misura reale.':'Valore di prova: serve misurare a muro il carico reale e gli spunti prima della scelta definitiva.';};
$('fit').onclick=()=>{state.zoom=1;redraw()};
function updateLocks(){
 $('extract').disabled=state.locked;
 $('explode').disabled=state.locked;
 $('unlock').textContent=state.locked?'🔓 Sblocca due fermi / vano':'🔒 Reinserisci i fermi';
 $('lock-status').textContent=state.locked?'Fermi davanti e dietro INSERITI: estrazione bloccata. Prima di estrarre nella realtà scollegare ogni cavo.':'Fermi SBLOCCATI (demo): puoi sollevare la cartuccia. Nella realtà stacca tutti i cavi prima.';
}
$('unlock').onclick=()=>{state.locked=!state.locked;state.lifted=null;state.explode=0;$('explode').value=0;$('explabel').textContent='0%';updateLocks();redraw()};
$('explode').oninput=e=>{if(state.locked){e.target.value=0;return;}state.explode=+e.target.value*1.1;$('explabel').textContent=e.target.value+'%';redraw()};
$('extract').onclick=()=>{if(state.locked)return;const id=/^P\d$/.test(state.selected||'')?state.selected:'P'+(state.focusIndex+1);state.lifted=state.lifted===id?null:id;redraw()};
$('reset').onclick=()=>{state.explode=0;state.lifted=null;$('explode').value=0;$('explabel').textContent='0%';redraw()};
updateLocks();
$('heat').oninput=e=>{state.heat=+e.target.value;thermalCalc()};$('delta').oninput=e=>{state.delta=+e.target.value;thermalCalc()};thermalCalc();
for(const id of ['labels','xray','disks','wiring','grid','dims','clearance','cooling','airflow'])$(id).onclick=e=>{
 state[id]=!state[id];e.currentTarget.classList.toggle('on',state[id]);redraw();
};
vp.addEventListener('pointerdown',e=>{if(e.target.closest('#quicktools'))return;if(e.button!==0)return;vp.setPointerCapture(e.pointerId);drag={sx:e.clientX,sy:e.clientY,yaw:state.yaw,pitch:state.pitch,moved:false};vp.classList.add('dragging')});
vp.addEventListener('pointermove',e=>{
 if(drag){const dx=e.clientX-drag.sx,dy=e.clientY-drag.sy;if(Math.abs(dx)+Math.abs(dy)>4)drag.moved=true;state.yaw=drag.yaw-dx*.007;state.pitch=clamp(drag.pitch+dy*.006,-.22,1.54);redraw();tip.style.opacity=0}
});
vp.addEventListener('pointerup',e=>{if(!drag)return;let clicked=!drag.moved;drag=null;vp.classList.remove('dragging');if(clicked){const rect=vp.getBoundingClientRect(),x=e.clientX-rect.left,y=e.clientY-rect.top;let backdrop=null;for(let i=pick.length-1;i>=0;i--){if(ctx.isPointInPath(pick[i].path,x,y)){const h=pick[i];if(h.group==='WALL'||h.group==='WALLCUT'||h.group==='FLOOR'){backdrop=backdrop||h;continue;}select(h.group,h.name,{x,y});return}}if(backdrop){select(backdrop.group,backdrop.name,{x,y});return}clearSelection()}});
vp.addEventListener('pointercancel',()=>{drag=null;vp.classList.remove('dragging')});vp.addEventListener('pointerleave',()=>{tip.style.opacity=0});
vp.addEventListener('wheel',e=>{if(e.target.closest('#quicktools'))return;e.preventDefault();state.zoom=clamp(state.zoom*Math.exp(-e.deltaY*.0012),.45,3.3);redraw()},{passive:false});
window.addEventListener('keydown',e=>{if(e.target&&e.target.tagName==='INPUT')return;const k=e.key.toLowerCase();if(k==='escape'){clearSelection();return}if(k==='r'){scene('tower');view('iso')}if(k==='1')view('iso');if(k==='2')view('top');if(k==='+')state.zoom=clamp(state.zoom*1.15,.45,3.3);if(k==='-')state.zoom=clamp(state.zoom/1.15,.45,3.3);redraw()});
function syncQuick(){for(const [id,val] of [['qdims',state.dims],['qfan',state.cooling],['qups',state.showUPS]]){const el=$(id);el.classList.toggle('active',val);el.setAttribute('aria-pressed',String(val))}}
 $('qminus').onclick=()=>{state.zoom=clamp(state.zoom/1.18,.45,3.3);redraw()};
 $('qplus').onclick=()=>{state.zoom=clamp(state.zoom*1.18,.45,3.3);redraw()};
 $('qfit').onclick=()=>{state.zoom=1;redraw()};
 $('qdims').onclick=()=>{$('dims').click();syncQuick()};
 $('qfan').onclick=()=>{$('cooling').click();syncQuick()};
 $('qups').onclick=()=>{$('showUPS').click();syncQuick()};
 document.addEventListener('click',syncQuick);syncLayerControls();
 new ResizeObserver(dimensions).observe(vp);dimensions();scene(({'#tower':'tower','#autonoma':'standalone','#standalone':'standalone','#room':'room','#haugadetail':'haugadetail','#hauga':'haugadetail','#cabinet':'cabinet'})[location.hash]||'room');syncQuick();
})();
