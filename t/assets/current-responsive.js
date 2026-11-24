(()=>{const q=document.getElementById('scene-quick'),caption=document.getElementById('scene-caption');if(!q)return;
q.addEventListener('change',()=>document.querySelector('[data-scene="'+q.value+'"]')?.click());
const sync=()=>{const active=document.querySelector('[data-scene].active');if(active)q.value=active.dataset.scene};
new MutationObserver(sync).observe(caption,{childList:true,characterData:true,subtree:true});sync();
const docs=document.querySelector('.docs-menu');document.addEventListener('pointerdown',e=>{if(docs.open&&!docs.contains(e.target))docs.open=false});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){docs.open=false;const menu=document.getElementById('menu-toggle');if(menu.getAttribute('aria-expanded')==='true')menu.click()}});
})();
