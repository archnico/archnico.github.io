// H7 R8.1 · n4 / U-Fujitsu P0.3 / ServiceDock · parametrico, NO-GO fabbricazione
// Conserva C120 P0.1; solo adattatori ridisegnati.
use <../n4.scad>
mode="assembly"; // assembly, lifted, bench, carrier, A, B, tools, collision, tool_collision, sweep
model="dummy"; // Q510,Q910,Q520,Q920,dummy
variant="A";  // VESA OEM (A) oppure selle + ritenute (B)
show_fixed=true;
locked=true;
lift=0;
show_tools=false;
show_handle=true;
handle_y=75; handle_x=75; pin_d=5; pin_hole_d=5.5; pin_z=7.5;
// M5 candidate; lengths/grade/torque from selected stock, not fabricated yet.
bolt_x=52.5; bolt_y=134; hole_d=5.5; head_d=10; tool_d=10;
shoe_thickness=.5;
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
 // P0.3: remove full-width axial crossbars to clear all four ServiceDock screws.
 // Two small arms at each end use existing saddle as load path.
 // Structural joints shown as contiguous volumes, actual folded/bolted joint to verify.
 for(side=[-1,1]){
  yy=side<0?front-4:back+2;
  yc=side<0?saddle_y[0]:saddle_y[1];
  ya=side<0?yy:yc+10; yb=side<0?yc-10:yy+2;
  for(x=[-pcw/2+2,pcw/2-10]){
    // short hollow tube 8×10×1.5, below sole; end face against saddle.
    color(alu)difference(){
      bx(x,ya,11.5,8,yb-ya,10);
      bx(x+1.5,ya-1,13,5,yb-ya+2,7);
    }
    color(orange)bx(x,yy,21.5,8,2,12);
    if(pads)color(pad)bx(x,side<0?front-2:back,sole,8,2,10);
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
module bolt_positions(){for(x=[-bolt_x,bolt_x])for(y=[-bolt_y,bolt_y])translate([x,y,0])children();}
module punched_carrier(){
 difference(){
   universal();
   bolt_positions()translate([0,0,-1])cylinder(h=4,d=hole_d);
   // Four side lift holes, outside PC and guides. Drill only after real material / fatigue tests.
   for(side=[-1,1])for(y=[-handle_y,handle_y])translate([side<0?-61:57,y,pin_z])rotate([0,90,0])cylinder(h=4,d=pin_hole_d);
 }
}
module guides_p03(){
 // guide extends below seating datum into support; above h=0 unchanged C120 138 mm envelope.
 color([.35,.41,.46])for(x=[-66,66])for(y=[-110,110]){
   // chamfer last 3 mm at inner lip; 1 mm lead-in.
   s=x<0?-1:1;
   difference(){
    bx(x-3,y-12.5,-20,6,25,117);
    for(dy=[-6,6])translate([x-4,y+dy,-8])rotate([0,90,0])cylinder(h=8,d=3.3);
   }
   hull(){bx(x-3,y-12.5,96.99,6,25,.01);
      bx(x<0?x-3:x-2,y-12.5,100,5,25,.01);}
   // optional non-load-bearing wear strip included as conservative 0.5 mm inward
   color([.20,.24,.25])bx(x<0?x+3:x-3-shoe_thickness,y-12.5,2,shoe_thickness,25,90);
 }
}
module guide_brackets(){
 // Outside of guides below Z0: L-foot 4 mm (stock choice TBD).
 // M4 screw axes across X, two per guide, no exposed tips into seating beam.
 color([.56,.61,.65])for(x=[-66,66])for(y=[-110,110]){
   side=x<0?-1:1; xx=side<0?-87:69; vv=side<0?-73:69;
   difference(){
     union(){bx(xx,y-12.5,-20,18,25,4);bx(vv,y-12.5,-16,4,25,16);}
     translate([side*79,y,-21])cylinder(h=6,d=5.5);
     for(dy=[-6,6])translate([side<0?-74:68,y+dy,-8])rotate([0,90,0])cylinder(h=6,d=4.5);
   }
 }
}
module stock2020_x(x,y,z,L){bx(x,y-10,z,L,20,20);}
module stock2020_y(x,y,z,L){bx(x-10,y,z,20,L,20);}
module bench(){
 // P0.1 380×310 two-pitch test bench, not a full H-7 base.
 // Z=0 top of 284 mm seating beams; below is second profile layer.
 color([.55,.60,.65]){
  for(y=[-145,145])stock2020_x(-190,y,-40,380);
  for(x=[-180,180])stock2020_y(x,-135,-40,270);
  for(y=[-110,110])stock2020_x(-170,y,-40,340);
  for(x=[-bolt_x,bolt_x])stock2020_y(x,-142,-20,284);
 }
 guides_p03();guide_brackets();
 // T-nut/slot conceptual reference: real vendor profile cross-section not fabricated here.
 // slot center is on beam centerline; top surface is seating datum.
}
module screw_heads(){
 color([.19,.22,.24])bolt_positions(){
   translate([0,0,1.5])cylinder(h=1,d=head_d); // washer outside diameter budget
   translate([0,0,2.5])cylinder(h=2.75,d=9.5);
   // visible shaft inside hole only; engagement length external to model
   translate([0,0,-.05])cylinder(h=2.55,d=5);
 }
}
module tool_envelopes(){
 color([.2,.65,.9,.25])bolt_positions()translate([0,0,2.5])cylinder(h=278,d=tool_d);
}
// Two removable cold-service portals. Pin locking and handle fabrication require rated hardware.
// 162 mm temporary width; no change to 120 mm powered carrier or 138 mm fixed envelope.
module portal(y,pins=true){
 color([.84,.48,.13]){
   for(side=[-1,1]){
     // 12×12 tube + solid end insert candidate, 1.5 wall.
     xx=side*handle_x-6;
     difference(){
       union(){
         bx(xx,y-6,0,12,12,20); // reinforced pin zone, assembly method TBD
         difference(){bx(xx,y-6,20,12,12,298);bx(xx+1.5,y-4.5,19.9,9,9,298.2);}
       }
       translate([xx-1,y,pin_z])rotate([0,90,0])cylinder(h=14,d=pin_hole_d);
     }
     if(pins)color([.18,.22,.26])translate([side<0?-81:56,y,pin_z])rotate([0,90,0])cylinder(h=25,d=pin_d);
   }
   // hollow cross tube and concept corner joint, exact connector TBD
   difference(){bx(-81,y-6,318,162,12,12);bx(-81.1,y-4.5,319.5,162.2,9,9);}
 }
}
module lift_yoke(pins=true){for(y=[-handle_y,handle_y])portal(y,pins);}
// Exclusion (hand clearance): up to 350 from carrier datum; +110 lift => 460.
module lift_reserve(){color([.9,.55,.2,.12])bx(-81,-85,330,162,170,20);}
module adapter_selected(pads=true){if(variant=="A")A(pads);else B(pads);}
module moving(){
 punched_carrier(); adapter_selected(); dummy_pc();
}
if(mode=="A")A();
else if(mode=="B")B();
else if(mode=="A_metal")A(false);
else if(mode=="B_metal")B(false);
else if(mode=="carrier")punched_carrier();
else if(mode=="bench")bench();
else if(mode=="tools")tool_envelopes();
else if(mode=="guides")guides_p03();
else if(mode=="screws")screw_heads();
else if(mode=="yoke")lift_yoke();
else if(mode=="collision"){
 intersection(){
  translate([-pcw/2+.05,front+.05,sole+.05])cube([pcw-.1,pcd-.1,pch-.1]);
  union(){punched_carrier();guides_p03();adapter_selected();}
 }
}
else if(mode=="tool_collision"){
 intersection(){tool_envelopes();union(){punched_carrier();adapter_selected();dummy_pc();guides_p03();}}
}
else if(mode=="yoke_collision"){
 intersection(){lift_yoke();union(){moving();bench();}}
}
else if(mode=="yoke_sweep"){
 intersection(){bench();for(y=[-handle_y,handle_y])translate([0,0,.05])hull(){portal(y);translate([0,0,110])portal(y);}}
}
else if(mode=="sweep"){
 // nominal vertical extraction: no screws, cables, AirRail or lift fixture.
 intersection(){bench();translate([0,0,.05])hull(){moving();translate([0,0,110])moving();}}
}
else{
 if(show_fixed)bench();
 translate([0,0,mode=="lifted"?110:lift])moving();
 if(locked&&mode!="lifted"&&lift==0)screw_heads();
 if(show_tools)tool_envelopes();
 if(show_handle&&!locked||show_handle&&mode=="lifted")translate([0,0,mode=="lifted"?110:lift]){lift_yoke();lift_reserve();}
}
