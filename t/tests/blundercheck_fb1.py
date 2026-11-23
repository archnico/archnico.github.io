#!/usr/bin/env python3
"""Non-esecutive collision audit of the actual FB-1 JS box geometry.

Uses Chromium's JS engine to build the SAME 3D geometry as the public preview
and intersects the recorded oriented bounding boxes (SAT 2D + Z overlap).
This cannot model bolts, mesh details, wires, measured component envelopes,
thermals, strength, or the real path of a lifted cartridge.
"""
import html
import json
import math
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

T = Path(__file__).resolve().parents[1]
JS = T / "assets/viewer.js"
HTML = T / "index.html"


def recorded_boxes():
    chrome = shutil.which("chromium")
    if not chrome:
        raise RuntimeError("Install Chromium to audit actual viewer geometry")
    original = JS.read_text()
    changes = [
        ("let W=0,H=0,dpr=1,faces=[]", "let __auditBoxes=[];\nlet W=0,H=0,dpr=1,faces=[]"),
        ("function pushBox(x,y,z,sx,sy,sz,color,group='',name='',opa=1,emphasis=false){",
         "function pushBox(x,y,z,sx,sy,sz,color,group='',name='',opa=1,emphasis=false){\n"
         " __auditBoxes.push({type:'box',x,y,z,w:sx,d:sy,h:sz,angle:0,group,name,bay:null});"),
        ("function rotBox(cx,cy,z,w,d,h,angle,color,group='',name='',opa=1,emphasis=false){",
         "function rotBox(cx,cy,z,w,d,h,angle,color,group='',name='',opa=1,emphasis=false){\n"
         " __auditBoxes.push({type:'rot',x:cx,y:cy,z,w,d,h,angle,group,name,bay:null});"),
        (" rotBox(p[0],p[1],z+lifted+exploded+adapterLift,w,d,h,FB.angle,color,group,name,opa);",
         " rotBox(p[0],p[1],z+lifted+exploded+adapterLift,w,d,h,FB.angle,color,group,name,opa);"
         " __auditBoxes[__auditBoxes.length-1].bay=i;"),
        ("\n})();", "\nwindow.__auditBoxesMake=function(scene){state.scene=scene;__auditBoxes.length=0;"
          "make();return __auditBoxes;};\n})();"),
    ]
    for needle, replacement in changes:
        if original.count(needle) != 1:
            raise AssertionError("Viewer changed, instrumentation not safely applicable: " + needle[:90])
        original = original.replace(needle, replacement, 1)

    # The files are created alongside the viewer only for the duration of the test.
    with tempfile.TemporaryDirectory(prefix=".fb1-audit-", dir=T) as tmp:
        folder = Path(tmp)
        # The page assets are linked by absolute file: URLs.
        audit_js = folder / "audit.js"
        audit_html = folder / "audit.html"
        audit_js.write_text(original)
        audit_html.write_text(
            HTML.read_text()
            .replace('href="assets/viewer.css"', f'href="{(T / "assets/viewer.css").as_uri()}"')
            .replace('src="assets/viewer.js"', f'src="{audit_js.as_uri()}"')
            .replace('</body>',
                     '<pre id="audit-out"></pre><script>window.addEventListener("load",()=>{'
                     'document.getElementById("audit-out").textContent='
                     'JSON.stringify(window.__auditBoxesMake("tower"));'
                     '});</script></body>'))
        run = subprocess.run(
            [chrome, "--headless", "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu",
             "--virtual-time-budget=2500", "--dump-dom", audit_html.as_uri()],
            capture_output=True, text=True, timeout=30, check=True
        )
    match = re.search(r'<pre id="audit-out">(.*?)</pre>', run.stdout, re.S)
    if not match:
        raise AssertionError("No audit data: viewer failed to run")
    return json.loads(html.unescape(match.group(1)))


def obb(box):
    # Axis-aligned pushBox uses the minimum corner; rotBox uses its centre.
    cx = box["x"] + box["w"] / 2 if box["type"] == "box" else box["x"]
    cy = box["y"] + box["d"] / 2 if box["type"] == "box" else box["y"]
    ang = box["angle"]
    vec = ((math.cos(ang), math.sin(ang)), (-math.sin(ang), math.cos(ang)))
    return cx, cy, vec


def intersects(a, b, eps=.05):
    z = min(a["z"] + a["h"], b["z"] + b["h"]) - max(a["z"], b["z"])
    if z <= eps:
        return False
    ax, ay, av = obb(a)
    bx, by, bv = obb(b)
    for axis in av + bv:
        separation = abs((ax - bx) * axis[0] + (ay - by) * axis[1])
        extent_a = sum(width / 2 * abs(axis[0] * p[0] + axis[1] * p[1])
                       for width, p in zip((a["w"], a["d"]), av))
        extent_b = sum(width / 2 * abs(axis[0] * p[0] + axis[1] * p[1])
                       for width, p in zip((b["w"], b["d"]), bv))
        if separation + eps >= extent_a + extent_b:
            return False
    return True


def assert_clear(description, pairs):
    hits = [(a, b) for a, b in pairs if intersects(a, b)]
    if hits:
        for a, b in hits[:25]:
            print(f"  COLLISION: [{a['group']}] {a['name']}  X  [{b['group']}] {b['name']}")
        raise AssertionError(description + f": {len(hits)} solid intersections")
    print("OK:", description)


def main():
    boxes = recorded_boxes()
    boards = [o for o in boxes if o["name"].startswith("Scheda madre illustrativa")]
    ssd = [o for o in boxes if o["group"] == "SSD"]
    cheek = [o for o in boxes if "Fianco e guida rimovibile" in o["name"]]
    fixed = [o for o in boxes if o["group"] in ("FBGUIDE", "FBCRADLE", "FRAME", "LIGHTSUPPORT")]
    supply = [o for o in boxes if o["name"].startswith("Alimentatore singolo")]
    assert len(boxes) > 200 and len(boards) == len(ssd) == 7, "7 cartridges were not generated"
    assert len([o for o in boxes if o["group"] == "FBGUIDE"]) == 56
    assert len([o for o in boxes if o["group"] == "FBCRADLE"]) == 56
    # PSU location remains an explicit unresolved decision. Do not draw fictitious boxes.
    assert not supply, "Danger: unmeasured power supply boxes reintroduced"

    assert_clear("7 motherboard faces vs ALL fixed structural objects",
                 ((b, f) for b in boards for f in fixed))
    assert_clear("motherboards vs other non-PCB volumes (except the touching standoff geometry)",
                 ((b, x) for b in boards for x in boxes if
                  x is not b and x["group"] not in
                  ("FBGUIDE", "FBCRADLE", "FRAME", "LIGHTSUPPORT", "PCB" + str(b["bay"] + 1),
                   "A" + str(b["bay"] + 1))
                  and x["name"].startswith(("Alimentatore", "SSD", "Fianco", "Traversa e fermo"))))
    assert_clear("7 SSD trays vs their coloured moving side walls",
                 ((a, b) for a in ssd for b in cheek if a["bay"] == b["bay"]))
    assert_clear("all mobile pieces vs the fixed supports, without intentional contacts",
                 ((a, f) for a in boxes for f in fixed
                  if a["bay"] is not None and a["group"] not in ("FBGUIDE", "FBCRADLE")
                  and a["group"].startswith(("PCB", "P", "A", "F", "SSD", "IO"))))
    # Exact nominal straight-up swept solid (continuous, not a sampled animation):
    # extending each mobile box upward by 155 mm represents all intervening z positions.
    # Other cartridges and ALL fixed hardware are treated as stationary obstacles.
    movable = [x for x in boxes if x["bay"] is not None
               and x["group"] not in ("FBGUIDE", "FBCRADLE")]
    obstacles_fixed = [x for x in boxes if x not in movable]
    sweep_hits = []
    for bay in range(7):
        obstacles = obstacles_fixed + [x for x in movable if x["bay"] != bay]
        for x in (x for x in movable if x["bay"] == bay):
            swept = {**x, "h": x["h"] + 155}
            for obstacle in obstacles:
                if intersects(swept, obstacle):
                    sweep_hits.append((bay + 1, x["name"], obstacle["name"]))
    assert not sweep_hits, "Vertical removal collides with other geometry: " + repr(sweep_hits[:10])
    print("OK: 7 exact straight-up 0..155 mm nominal swept solids"
          " vs all other moving/fixed boxes (no modelled cables)")
    # All volume numbers count overlaps in joints; they are NOT net CAD solids.
    support_mm3 = sum(x["w"] * x["d"] * x["h"] for x in boxes
                      if x["group"] in ("FBGUIDE", "FBCRADLE"))
    print(f"WARN: supports shown as {support_mm3 / 1e6:.3f} L gross solid bounding-box"
          " geometry including overlapping joints; weight not included in validated BOM")
    # Independent checks of critical nominal-only clearances.
    gap = 54 - 8 / 2 - 92 / 2
    adj_gap = 164 * math.cos(math.radians(42)) - 2 * (54 + 8 / 2)
    assert abs(gap - 4) < 1e-9 and adj_gap > 5
    print(f"OK: {len(boxes)} modelled solids; lateral nominal clearance {gap} mm;"
          f" adjacent guide clearance {adj_gap:.2f} mm")
    print("NOT TESTED: power supply envelope, real 226×175 n1 board, real cable bends,"
          " fastening holes, thermal flow, load path, tipping, physical extraction.")


if __name__ == "__main__":
    main()
