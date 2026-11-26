function clearance(w,g,y,t,o,h){
 if (![w,g,y,t,o,h].every(Number.isFinite)||w<=0||g<=0||y<0||y>15||t<0||t>15||o<0||h<0) return null;
 const Y=y*Math.PI/180,T=t*Math.PI/180;
 const required=w*Math.abs(Math.cos(Y)*Math.cos(T))+284*Math.abs(Math.sin(Y)*Math.cos(T))+280*Math.abs(Math.sin(T))+2*Math.abs(o);
 return {required,remaining:g-required,vertical:h-460};
}
if(typeof module!=='undefined') module.exports=clearance;
if(typeof document!=='undefined'){
 const ids=['w','g','y','t','o','h'], fields=ids.map(i=>document.getElementById(i));
 const res=document.getElementById('res'),explain=document.getElementById('explain');
 function draw(){
 const values=fields.map(f=>f.value===''?NaN:Number(f.value)),r=clearance(...values);
 if(!r){res.textContent='Valori non validi';res.className='bad';explain.textContent='Inserire misure positive e angoli da 0 a 15°.';return}
 const valid=r.remaining>0&&r.vertical>=0;
 res.textContent=(r.remaining>=0?'+':'')+r.remaining.toFixed(2)+' mm · '+(valid?'luce teorica':'interferenza / spazio insufficiente');
 res.className=valid?'':'bad';explain.textContent='Proiezione richiesta: '+r.required.toFixed(2)+' mm; riserva verticale rispetto ai 460 mm: '+r.vertical.toFixed(0)+' mm. '+(valid?'Screening favorevole, verificare fisicamente.':'Non procedere.');
 }
 fields.forEach(f=>f.addEventListener('input',draw));
 document.getElementById('reset').addEventListener('click',()=>{[120.5,124,.2,.2,.5,460].forEach((v,i)=>fields[i].value=v);draw()});draw();
}
