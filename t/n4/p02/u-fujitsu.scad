// H7 R8.1 · n4 / U-Fujitsu P0.2 · parametrico, NO-GO fabbricazione
// Conserva C120 P0.1; solo adattatori ridisegnati.
use <../n4.scad>
mode="assembly";  // assembly, A, B, A_metal, B_metal, collision, fit_A
model="dummy"; // Q510,Q910,Q520,Q920,dummy
variant="A";  // VESA OEM (A) oppure selle + ritenute (B)
show_fixed=true;
show_socket_proxy=false;
$fn=40;
pcw=model=="dummy"?65:(model=="Q510"||model=="Q910"?54:58.7);
pcd=model=="dummy"?195:(model=="Q510"||model=="Q910"?188:191);
pch=model=="dummy"?190:185;
front=-135; back=front+pcd; sole=23.5;
saddle_y=[-105,30];
vesa_y=front+pcd/2;  // centro teorico: non è la quota del gancio OEM
vesa_z=sole+pch/2;
vesa_d=6.5; // foro-asola di studio, da sostituire dopo verifica viti OEM
vesa_travel=10;
cover_gap=0; // sporgenza cover reale dal piano nominale macchina (da rilevare)
alu=[.67,.72,.76]; black=[.10,.12,.14]; pad=[.23,.27,.25]; orange=[.91,.48,.16]; blue=[.23,.64,.84];
W=120;D=284;H=280;pitch=190;
module bx(x,y,z,w,d,h){translate([x,y,z])cube([w,d,h]);}
module tube(y){difference(){bx(-52,y-10,1.5,104,20,20);bx(-53,y-8.5,3,106,17,17);}}
module support(pads=true) {
 color(alu)for (y=saddle_y)tube(y);
 if(pads)color(pad)for(y=saddle_y)for(x=[-pcw/2+2,pcw/2-12])bx(x,y-8,21.5,10,16,2);
}
// A: angle rails with open centre and slots along Y, manufacturing details subject to measurement.
// L25×15×2 web plane x=-46..-44, open flanges point away from PC.
module slot_y(y,z){
 hull(){for(dy=[-vesa_travel,vesa_travel])translate([-47,y+dy,z])rotate([0,90,0])cylinder(h=4,d=vesa_d);}
}
module vesa_rail(z){
 color(orange)difference(){
  union(){bx(-46,-112.5,z-12.5,2,225,25);bx(-59,-112.5,z+10.5,13,225,2);}
  for(y=[vesa_y-50,vesa_y+50])slot_y(y,z);
 }
 // Separate end bridges meet rail end; ideal support volume, real joint hardware TBD
 color(alu)for(y=[-127.5,112.5])bx(-58,y,z-12.5,14,15,25);
}
module A(pads=true){
 support(pads);
 for(z=[vesa_z-50,vesa_z+50])vesa_rail(z);
 // Allow OEM cover and standoffs exclusively after actual measurement.
 // Here no invented screw/retaining tab is considered structure.
 if(show_socket_proxy)color([.25,.65,.9,.35])for(y=[vesa_y-50,vesa_y+50])for(z=[vesa_z-50,vesa_z+50])
  bx(-44,y-7,z-7,44-pcw/2-cover_gap,14,14);
}
// B: light metallic angle masts with replaceable fingers and small corner stops.
// no parts through front/control region except candidate 8 mm lower corner contacts.
module B(pads=true){
 support(pads);
 for(y=saddle_y){
  // lower lateral stops, metal + contact pads
  for(s=[-1,1]){
   color(alu)bx(s<0?-pcw/2-5:pcw/2+2,y-8,21.5,3,16,14);
   if(pads)color(pad)bx(s<0?-pcw/2-2:pcw/2,y-8,23.5,2,16,12);
  }
  // B post corrected after bending screen: rectangular closed 12×15×1.5.
  // X43..55, Y±7.5. Tube lower end sits on foot; fastener holes depend on actual stock.
  color(orange)difference(){
    bx(43,y-7.5,21.5,12,15,pch+5);
    bx(44.5,y-6,21,9,12,pch+6);
  }
  color(orange){
    bx(40,y-9.5,21.5,15,19,2);
    // Bent top finger behind mast: 25 mm downturned leg in plane Y.
    bx(43,y-9.5,sole+pch-20,12,2,25);
    bx(pcw/2-8,y-9.5,sole+pch+2,55-(pcw/2-8),15.5,3);
  }
  if(pads)color(pad)bx(pcw/2-8,y-6,sole+pch,8,12,2);
 }
 // transverse light rectangular tube, 10 x 10 x 1.5, two stop pairs.
 // front tube centre -137 within C120. rear centre back+3, below socket zone.
 for(y=[front-2,back+3]){
  // front tube is shifted 0.5 back to stay inside y=-142 and not occupy fascia.
  yy=y==front-2?front-1.5:y;
  color(alu)difference(){bx(-52,yy-5,1.5,104,10,10);bx(-53,yy-3.5,3,106,7,7);}
  for(x=[-pcw/2+2,pcw/2-10]){
   // Metal ears rise from tube along corner of face. Pads touch nominal chassis face.
   yy2=y==front-2?front-4:back+2;
   color(orange)bx(x,yy2,11.5,8,2,22);
   if(pads)color(pad)bx(x,y==front-2?front-2:back,sole,8,2,10);
  }
 }
}
module bare(){translate([-pcw/2,front,sole])cube([pcw,pcd,pch]);}
module dummy_pc(){
 color(black)bare();
 // schematic front facia, no certainty on exact coordinates
 color([.7,.05,.08])bx(-pcw/2+4,front-.2,sole+8,3,.2,pch-16);
 color([.72,.74,.76])translate([3,front-.3,sole+pch-16])rotate([90,0,0])cylinder(h=.3,r=4);
 color([.65,.66,.68])for(z=[sole+60,sole+78])bx(-7,front-.25,z,14,.25,6);
}
module carrier_ref(){
 // exact outer geometry of P0.1, variables supplied by this file
 universal();
 if(show_fixed)fixed_guides();
}
module adapter_selected(pads=true){if(variant=="A")A(pads);else B(pads);}
if(mode=="A")A();
else if(mode=="B")B();
else if(mode=="A_metal")A(false);
else if(mode=="B_metal")B(false);
else if(mode=="collision"){
 intersection(){
  translate([-pcw/2+.05,front+.05,sole+.05])cube([pcw-.1,pcd-.1,pch-.1]);
  union(){carrier_ref();adapter_selected();}
 }
}
else if(mode=="fit_A"){carrier_ref();A();dummy_pc();}
else{carrier_ref();adapter_selected();dummy_pc();}
