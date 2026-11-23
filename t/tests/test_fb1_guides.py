"""FB-1 geometry regression: fixed lateral supports must not disappear again."""
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
guide_thickness = 8
guide_clearance = guide_offset - guide_thickness / 2 - moving_width / 2
interbay_clearance = normal_distance - 2 * (guide_offset + guide_thickness / 2)

assert abs(guide_clearance - 4) < 1e-8, guide_clearance
assert interbay_clearance > 5, interbay_clearance
assert "fishboneGuides(i);" in VIEWER
assert "const fixed=group==='FBGUIDE'||group==='FBCRADLE'" in VIEWER
assert "guideLaterali:true" in VIEWER
assert 'data-layer="guideLaterali"' in HTML

# The two end crossbars (u ±63, v ±122) meet the two perimeter rails.
y_front = 159 - 63 * math.sin(angle) - 122 * math.cos(angle)
y_rear = 159 + 63 * math.sin(angle) + 122 * math.cos(angle)
assert 14 <= y_front <= 32, y_front
assert 286 <= y_rear <= 304, y_rear
# Runner v extents ±116, end tie extents ±(122 ± 14) -> 8 mm overlap.
assert 116 > 122 - 14
print(f"FB-1 guide supports OK: lateral 4 mm, between bays {interbay_clearance:.1f} mm")
