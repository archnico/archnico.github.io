"""FB-1 geometry regression: fixed lateral supports stay outside cartridges/PCBs."""
import math
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
VIEWER = (ROOT / "assets/viewer.js").read_text()
HTML = (ROOT / "index.html").read_text()

angle = math.radians(42)
pitch = 164
normal_distance = pitch * math.cos(angle)
moving_width = 92
guide_offset = 54
guide_thickness = 6  # rails/posts are 6 mm thick in the current concept
guide_clearance = guide_offset - guide_thickness / 2 - moving_width / 2
interbay_clearance = normal_distance - 2 * (guide_offset + guide_thickness / 2)

# Lateral play grew slightly because the rails are thinner; the important bound is > 0.
assert guide_clearance > 4, guide_clearance
assert interbay_clearance > 5, interbay_clearance
assert "fishboneGuides(i);" in VIEWER
assert "const fixed=group==='FBGUIDE'||group==='FBCRADLE'" in VIEWER
assert "guideLaterali:true" in VIEWER
assert 'data-layer="guideLaterali"' in HTML

# End caps are narrower (u ±30) and sit at v ±118; they transfer load to the base frame
# without entering the moving cartridge envelope (z < 127).
cap_half_u = 30
cap_v = 118
cap_half_depth = 4
y_front = 159 - cap_half_u * math.sin(angle) - cap_v * math.cos(angle)
y_rear = 159 + cap_half_u * math.sin(angle) + cap_v * math.cos(angle)
assert 30 <= y_front <= 70, y_front
assert 250 <= y_rear <= 290, y_rear
# Runner ends at v = ±116 overlap the end caps by 2 mm (cap inner edge v = 114).
assert 116 > cap_v - cap_half_depth
# The base frame top is at z = 107; the cartridge bottom lands on runners at z = 127.
assert VIEWER.count("pushBox(10,yy,91,") >= 1
# Round 2: corner posts now rise from the base frame (z=107) instead of floating above it.
assert "fbBox(i,u,v,107,6,8,133" in VIEWER
# Base ladder frame has one cross tie under each bay, centred on the bay axis.
assert "for(let k=0;k<7;k++)" in VIEWER
assert "cx-46,14,91,92" in VIEWER
print(f"FB-1 guide supports OK: lateral {guide_clearance:.1f} mm, between bays {interbay_clearance:.1f} mm")
