import {spawn} from 'node:child_process';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {resolve, dirname} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const cp=spawn('chromium',['--headless','--no-sandbox','--disable-gpu','--disable-dev-shm-usage','--remote-debugging-port=19382','--user-data-dir=/tmp/torre-cdp-19382','about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
try{
let targets;for(let i=0;i<30;i++){try{targets=await(await fetch('http://localhost:19382/json/list')).json();break}catch{await sleep(150)}}
const ws=new WebSocket(targets.find(x=>x.type==='page').webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));let id=0;const pending=new Map(),errors=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id){const cb=pending.get(m.id);pending.delete(m.id);m.error?cb.reject(m.error):cb.resolve(m.result)}else if(m.method==='Runtime.exceptionThrown')errors.push(m.params.exceptionDetails.text)});
const send=(method,params={})=>new Promise((resolve,reject)=>{const n=++id;pending.set(n,{resolve,reject});ws.send(JSON.stringify({id:n,method,params}))});
const ev=async expression=>(await send('Runtime.evaluate',{expression,returnByValue:true})).result.value;
await send('Runtime.enable');await send('Page.enable');await send('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:2});
for(const [width,height] of [[393,873],[873,393],[320,640]]){
await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:2.75,mobile:true});
await send('Page.navigate',{url:pathToFileURL(root+'/t/index.html').href+'?test='+width+'#tower'});await sleep(650);
const r=await ev(`(()=>{const v=document.getElementById('vp'),q=document.getElementById('quicktools'),m=document.getElementById('menu-toggle'),p=document.getElementById('left-panel');m.click();let s=document.querySelector('[data-layer="pareti"]'),b=s.getAttribute('aria-checked');s.click();const stays=p.classList.contains('open')&&b!==s.getAttribute('aria-checked');document.getElementById('mobile-close').click();return {w:innerWidth,h:innerHeight,fit:document.documentElement.scrollWidth===innerWidth&&document.documentElement.scrollHeight===innerHeight,toolbar:q.scrollWidth<=q.clientWidth+1,stays,canvas:v.clientHeight,closed:!p.classList.contains('open')}})()`);
await sleep(250);
const center=await ev(`(()=>{const r=document.getElementById('c').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2}})()`);
const touch=(type,touchPoints)=>send('Input.dispatchTouchEvent',{type,touchPoints});
const point=(id,x,y)=>({id,x,y});
const before=await ev("document.getElementById('c').toDataURL()");
await touch('touchStart',[point(1,center.x-30,center.y),point(2,center.x+30,center.y)]);
await touch('touchMove',[point(1,center.x-65,center.y),point(2,center.x+65,center.y)]);
await sleep(180);await touch('touchEnd',[]);await sleep(180);
r.pinch=before!==await ev("document.getElementById('c').toDataURL()");r.noSelection=await ev("document.getElementById('inspector').hidden");r.errors=errors;
console.log(JSON.stringify(r));if(!r.fit||!r.toolbar||!r.stays||!r.closed||!r.pinch||!r.noSelection||errors.length)process.exitCode=1;
}
ws.close();
}finally{cp.kill()}
