"""Produce P0.2 interactive browser preview from P0.1 reference renderer and new meshes."""
import pathlib,re,json
P=pathlib.Path(__file__).parent
s=(P.parent/'make_preview.py').read_text()
html=s.split("html='''",1)[1].split("'''\n(P/",1)[0]
parts={}
for name,file in {'carrier':'../carrier.stl','adapterA':'A.stl','adapterB':'B.stl','pc':'../pc.stl','guides':'../guides.stl','cables':'../cables.stl'}.items():
 pts=[list(map(float,i)) for i in re.findall(r'vertex\s+([-+\d.eE]+)\s+([-+\d.eE]+)\s+([-+\d.eE]+)',(P/file).read_text())]
 parts[name]=[pts[i:i+3] for i in range(0,len(pts),3)]
html=html.replace('<a href="p02/index.html">Nuova P0.2 A/B</a> · ','').replace('P0.1','P0.2').replace('U-Fujitsu / selle','U-Fujitsu / adattatore')
html=html.replace('<h3>Vista</h3>','<h3>Adattatore</h3><button data-variant="A" class="active">A · VESA OEM</button><button data-variant="B">B · Selle e ritenute</button><h3>Vista</h3>')
html=html.replace('<a href="README.md">Dossier tecnico</a> · <a href="n4.scad">CAD OpenSCAD</a> · <a href="dummy.stl">STL dima inerte</a>','<a href="README.md">Dossier P0.2</a> · <a href="u-fujitsu.scad">CAD</a> · <a href="thermal.html">Verifica griglie</a> · <a href="../index.html">P0.1 storico</a>')
html=html.replace('main{display:grid;grid-template-columns:240px 1fr;min-height:75vh}','main{display:grid;grid-template-columns:240px 1fr;height:calc(100dvh - 200px);min-height:480px}')
html=html.replace('aside{padding:16px;','aside{overflow:auto;padding:16px;')
html=html.replace('canvas{width:100%;height:100%;min-height:480px','canvas{display:block;position:absolute;inset:0;width:100%;height:100%;min-height:0')
html=html.replace('.stage{position:relative;min-width:0}', '.stage{position:relative;min-width:0;min-height:0}')
html=html.replace('main{display:flex;flex-direction:column-reverse}', 'main{display:flex;flex-direction:column-reverse;height:auto;min-height:0}')
html=html.replace("const parts=DATA, c=", "const allParts=DATA,parts={carrier:allParts.carrier,adapter:allParts.adapterA,pc:allParts.pc,guides:allParts.guides,cables:allParts.cables}, c=")
# robust auto-fit by corners of each layout's fixed envelope; no cumulative CSS or view drift
start=html.index("let target=mode==='tower'")
end=html.index("\nfunction project",start)
html=html[:start]+"""let cy=Math.cos(yaw),sy=Math.sin(yaw),cp=Math.cos(pitch),sp=Math.sin(pitch);
let bounds=mode==='tower'?[[-92.5,-155,-20],[1232.5,155,280]]:mode==='exploded'?[[-269,-142,0],[240,142,280]]:[[-69,-142,0],[69,142,280]];
const target=bounds[0].map((a,i)=>(a+bounds[1][i])/2);
let corners=[];for(let x of [bounds[0][0],bounds[1][0]])for(let y of [bounds[0][1],bounds[1][1]])for(let z of [bounds[0][2],bounds[1][2]]){let a=cy*(x-target[0])-sy*(y-target[1]),b=sy*(x-target[0])+cy*(y-target[1]);corners.push([a,(z-target[2])*cp+b*sp])}
let spans=[0,1].map(i=>Math.max(...corners.map(c=>c[i]))-Math.min(...corners.map(c=>c[i])));
let scale=Math.min((w-36)/Math.max(1,spans[0]),(h-56)/Math.max(1,spans[1]))*.92*zoom;""" +html[end:]
html=html.replace("mode==='exploded'?[0,0,k==='pc'?105:k==='adapter'?40:0]:[0,0,0]","mode==='exploded'?[k==='pc'||k==='cables'?200:k==='adapter'?0:-200,0,0]:[0,0,0]")
html=html.replace("[0,-137,221+(mode==='exploded'?105:0)]","[mode==='exploded'?200:0,-137,221]")
html=html.replace("yaw=mode==='rear'?2.5:mode==='front'?0:mode==='tower'?-.15:-.76","yaw=mode==='rear'?2.5:mode==='front'?0:mode==='tower'?-.15:mode==='exploded'?-.38:-.76")
html=html.replace("document.querySelectorAll('[data-mode]').forEach(b=>b.onclick", "document.querySelectorAll('[data-variant]').forEach(b=>b.onclick=()=>{parts.adapter=allParts['adapter'+b.dataset.variant];document.querySelectorAll('[data-variant]').forEach(x=>x.classList.toggle('active',x===b));draw()});document.querySelectorAll('[data-mode]').forEach(b=>b.onclick")
# cable overlay footprint to right of PC in exploded view, no group overlaps in X; fit x extent 240 adequate
html=html.replace('Trascina per ruotare · rotella per zoom · le porte sono schematiche.','Trascina per ruotare · rotella per zoom · esploso separato in tre gruppi. VESA: cover OEM non modellata.')
(P/'index.html').write_text(html.replace('DATA',json.dumps(parts,separators=(',',':'))))
