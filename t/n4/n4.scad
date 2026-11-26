// H7 R8.1 · C120 / n4 P0.1 · mm · concept, not fabrication
// X transverse; Y front(-) rear(+); Z upward; local carrier origin.
// Select: assembly, exploded, dummy, tower, carrier, adapter, front, rear
mode="assembly";
model="dummy"; // dummy, Q510, Q910, Q520, Q920
adapter="saddle"; // saddle or vesa (cover and fasteners not certified)
show_cables=true;
show_guides=true;
show_vent_zones=false; // illustrative worst-case zones, not actual grille map
$fn=32;
W=120; D=284; H=280; pitch=190;
pcw=model=="dummy"?65:(model=="Q510"||model=="Q910"?54:58.7);
pcd=model=="dummy"?195:(model=="Q510"||model=="Q910"?188:191);
pch=model=="dummy"?190:185;
front=-135; back=front+pcd; sole=23.5;
saddle_y=[-105,30]; // movable, change after mapping vents and feet
alu=[.67,.72,.76]; black=[.10,.12,.14]; pad=[.23,.27,.25]; orange=[.91,.48,.16]; blue=[.23,.64,.84];
module b(x,y,z,w,d,h){translate([x,y,z])cube([w,d,h]);}
module tube_x(y,z){difference(){b(-52,y-10,z,104,20,20);b(-53,y-8.5,z+1.5,106,17,17);}}
module lower(){
 color(alu){
 for(s=[-1,1]) {
   x=s<0?-60:58.5;
   b(x,-142,0,1.5,284,15);
   b(s<0?-60:45,-142,0,15,284,1.5);
 }
 for(y=[-142,127]){b(-45,y,0,90,15,1.5); b(-45,y==-142?y:y+13.5,0,90,1.5,15);}
 }
}
module universal(){
 lower();
 color(alu){
 for(y=[-127.5,112.5]){
   b(-60,y,15,1.5,15,255); b(-60,y,15,15,1.5,255);
 }
 b(-60,-112.5,255,1.5,225,15);b(-60,-112.5,268.5,15,225,1.5);
 // diagonal external-plane metal brace, idealised. Joint/fastener details TBD.
 hull(){b(-59,-119,18,2,10,10);b(-59,109,255,2,10,10);}
 // candidate metallic front/rear lifting/retention points below top envelope
 for(y=[-110,110])for(x=[-58,48]) b(x,y-7,1.5,10,14,4);
 }
}
module fixed_guides(){
 color([.35,.41,.46])for(x=[-66,66])for(y=[-110,110])b(x-3,y-12.5,0,6,25,100);
}
module pc(){
 color(black)translate([-pcw/2,front,sole])cube([pcw,pcd,pch]);
 // schematic fascia: front control strip, USB and switch not exact placement
 color([.18,.19,.20])b(-pcw/2,front-.1,sole,pcw,.1,pch);
 color([.65,.05,.08])b(-pcw/2+4,front-.3,sole+8,3,.2,pch-16);
 color([.63,.67,.69])for(z=[sole+60,sole+78])b(-7,front-.35,z,14,.25,6);
 color([.75,.78,.79])translate([4,front-.45,sole+pch-16])rotate([90,0,0])cylinder(h=.3,r=5);
 // logo visual cue on broad face; not exact product CAD
 color([.66,.68,.7])translate([pcw/2+.1,front+pcd/2,sole+pch/2])rotate([90,0,90])linear_extrude(.3)text("FUJITSU",size=8,halign="center",valign="center");
 // Q rear ports illustrative only
 color([.56,.58,.59])for(z=[sole+30,sole+55,sole+95,sole+130])b(-12,back,z,24,.3,10);
}
module saddles(){
 for(y=saddle_y){
  color(alu)tube_x(y,1.5);
  color(pad)for(x=[-pcw/2+2,pcw/2-12])b(x,y-8,21.5,10,16,2);
  // short adjustable side jaws, metal structural body & replaceable pad
  for(s=[-1,1]){
    color(alu)b(s<0?-pcw/2-5:pcw/2+2,y-8,21.5,3,16,14);
    color(pad)b(s<0?-pcw/2-2:pcw/2,y-8,23.5,2,16,12);
  }
 }
 // low axial stops with pad, front/rear bottom corners only; survey before use
 for(y=[front-4,back+2]){
  color(alu)b(-52,y-2,1.5,104,6,20);
  color(alu)b(-20,y,sole-2,40,2,14);
  color(pad)b(-20,y==front-4?y+2:y-2,sole,40,2,10);
 }
 // positive top restraint candidate; adjustable vertical metal posts separate from PC,
 // fingers near non-vented corners only. Keep hands/controls clear.
 for(y=saddle_y){
  color(alu)b(43,y-6,21.5,5,12,pch+5);
  color(alu)b(pcw/2-8,y-6,sole+pch+2,48-(pcw/2-8),12,3);
 }
}
module top_pads(){for(y=saddle_y)color(pad)b(pcw/2-8,y-6,sole+pch,8,12,2);}
module vesa(){
 // Open four-point VESA 100 mockup; no assumption of threads or screw depth.
 // Sides x negative; frame on OEM cover needs physical verification.
 color(orange)for(y=[front+pcd/2-50,front+pcd/2+50])
 for(z=[sole+pch/2-50,sole+pch/2+50])
 translate([-42,y,z])rotate([0,90,0])cylinder(h=4,r=8);
 color(alu)for(z=[sole+pch/2-50,sole+pch/2+50])b(-45,-112.5,z-8,7,225,16);
}
module cables(){
 // reserves, not solid wires or established socket locations
 color([.35,.73,.93,.35])b(-pcw/2-4,back,sole+14,pcw+8,142-back,155);
 color([.12,.15,.17])for(z=[sole+35,sole+65,sole+100,sole+135]) {
   b(-6,back,z,12,30,10);
   hull(){b(-5,back+30,z+2,10,2,6);b(-5,back+58,z-16,10,2,6);}
 }
}
module unit(){
 universal();
 if(show_guides)fixed_guides();
 if(adapter=="saddle"){saddles();top_pads();} else {vesa();for(y=saddle_y){color(alu)tube_x(y,1.5);color(pad)for(x=[-pcw/2+2,pcw/2-12])b(x,y-8,21.5,10,16,2);}}
 pc();
 if(show_cables)cables();
 if(show_vent_zones){
 color([1,.2,.1,.13])b(pcw/2,front,sole,200,pcd,pch);
 color([1,.2,.1,.13])b(-pcw/2-200,front,sole,200,pcd,pch);
 color([1,.2,.1,.13])b(-pcw/2,back,sole,pcw,200,pch);
 color([1,.2,.1,.13])b(-pcw/2,front,sole+pch,pcw,pcd,200);
 }
}
if(mode=="dummy") cube([65,195,190]);
else if(mode=="collision"){
 intersection(){
   translate([-pcw/2+.05,front+.05,sole+.05])cube([pcw-.1,pcd-.1,pch-.1]);
   union(){universal();fixed_guides();saddles();top_pads();}
 }
}
else if(mode=="carrier")universal();
else if(mode=="pc")pc();
else if(mode=="guides")fixed_guides();
else if(mode=="cables")cables();
else if(mode=="adapter"){saddles();top_pads();}
else if(mode=="exploded"){
 universal();fixed_guides();
 translate([0,0,40]){saddles();top_pads();}
 translate([0,0,105])pc();
}
else if(mode=="tower"){
 // 7 positions, n4 at end of row, remaining guides empty; base studio approximation.
 color([.36,.40,.44]){b(-92.5,-155,-20,1325,20,20); b(-92.5,135,-20,1325,20,20);for(i=[0:6])b(i*pitch-10,-135,-20,20,270,20);}
 unit();
 for(i=[1:6])translate([i*pitch,0,0])fixed_guides();
}
else unit();
