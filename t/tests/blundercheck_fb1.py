#!/usr/bin/env python3
"""Non-esecutive collision audit of the actual FB-1 JS box geometry.

Uses Chromium's JS engine to build the SAME 3D geometry as the public preview
and intersects the recorded oriented bounding boxes (SAT 2D + Z overlap).
This cannot model bolts, mesh details, wires, measured component envelopes,
thermals, strength, or the real path of a lifted cartridge.

Round-2 update (night geometry branch):
- audits tower, module, standalone, rear and thermal scenes
- fixed-structure vs fixed-structure SAT checks now cover the connected ladder frame
- corner posts rise from the base frame (z=107) instead of floating
- base frame has per-bay cross ties so runners/posts share a load path
- keeps the PSU box gate (no fictitious supply is drawn)
- standalone floor base is shifted downward to avoid solid intersections with the
  lowered tower frame; it remains a concept, not a validated load-bearing base
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


def recorded_boxes(scene='tower', focus=0, standpads=False):
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
        (" for(const l of labels)l.pos[2]-=90;\n floorStandingKit(FB.length);",
         " for(const l of labels)l.pos[2]-=90;\n // Capture the REAL drawn Z after the standalone lift-down operation.\n"
         " __auditBoxes.forEach(box=>{box.z-=90;});\n floorStandingKit(FB.length);"),
        ("\n})();", "\nwindow.__auditBoxesMake=function(scene,focus,standpads){state.focusIndex=focus||0;state.scene=scene;"
          "state.standpads=!!standpads;__auditBoxes.length=0;make();return __auditBoxes;};\n})();"),
    ]
    for needle, replacement in changes:
        if original.count(needle) != 1:
            raise AssertionError("Viewer changed, instrumentation not safely applicable: " + needle[:90])
        original = original.replace(needle, replacement, 1)

    with tempfile.TemporaryDirectory(prefix=".fb1-audit-", dir=T) as tmp:
        folder = Path(tmp)
        audit_js = folder / "audit.js"
        audit_html = folder / "audit.html"
        audit_js.write_text(original)
        audit_html.write_text(
            HTML.read_text()
            .replace('href="assets/viewer.css"', f'href="{(T / "assets/viewer.css").as_uri()}"')
            .replace('src="assets/viewer.js"', f'src="{audit_js.as_uri()}"')
            .replace('</body>',
                     f'<pre id="audit-out"></pre><script>window.addEventListener("load",()=>{{'
                     'document.getElementById("audit-out").textContent='
                     f'JSON.stringify(window.__auditBoxesMake("{scene}",{focus},{str(standpads).lower()}));'
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


def assert_clear(description, pairs, max_hits=25):
    hits = [(a, b) for a, b in pairs if intersects(a, b)]
    if hits:
        for a, b in hits[:max_hits]:
            print(f"  COLLISION: [{a['group']}] {a['name']}  X  [{b['group']}] {b['name']}")
        raise AssertionError(description + f": {len(hits)} solid intersections")
    print("OK:", description)


def structural_groups():
    # Unlike the historical test, include *all* floor-base solids.  The former
    # fixed-structure whitelist silently excluded STANDCROSS and all outriggers.
    return {"FRAME", "FBCRADLE", "FBGUIDE", "LIGHTSUPPORT", "LIGHTPAD", "FOOT",
            "STANDRAIL", "STANDCROSS", "STANDPAD", "STANDRUBBER", "STANDJOINT"}


def audit_scene(scene, focus=0, standpads=False):
    boxes = recorded_boxes(scene, focus, standpads)
    boards = [o for o in boxes if o["name"].startswith("Scheda madre illustrativa")]
    ssd = [o for o in boxes if o["group"] == "SSD"]
    cheek = [o for o in boxes if "Fianco e guida rimovibile" in o["name"]]
    fixed_struct = [o for o in boxes if o["group"] in structural_groups()]
    supply = [o for o in boxes if o["name"].startswith("Alimentatore")]

    print(f"\n--- Scene {scene}" + (f" focus={focus+1}" if focus else "") +
          (" wings=ON" if standpads else " wings=OFF") + f" ---")
    print(f"{len(boxes)} solids, {len(boards)} board(s), {len(ssd)} SSD(s), "
          f"{len(fixed_struct)} fixed-structure solids")

    # PSU gate: no fictitious supply box is drawn in any audited scene.
    assert not supply, f"Danger: unmeasured power supply boxes reintroduced in {scene}"

    if scene == "tower":
        assert len(boxes) > 200 and len(boards) == len(ssd) == 7, "7 cartridges were not generated"
        fbg = [o for o in boxes if o["group"] == "FBGUIDE"]
        fbc = [o for o in boxes if o["group"] == "FBCRADLE"]
        assert len(fbg) == 56, f"expected 56 FBGUIDE boxes, got {len(fbg)}"
        assert len(fbc) == 56, f"expected 56 FBCRADLE boxes, got {len(fbc)}"
    elif scene == "module":
        assert len(boards) == 1, "detail scene must show exactly one illustrative motherboard"
    elif scene == "standalone":
        # Actual floor variant lowering: the canvas renderer lowers ALL board
        # solids by 90mm.  Tests now capture the same coordinates (not stale z).
        assert len(boards) == 7
        assert all(abs(b["z"] - 71) < .05 for b in boards), (
            "standalone PCB must be lowered from z=161 to z=71")
        # No second pair of long skids/crossbars at floor height.  The SAME
        # upper seven-cross-tie ladder rests on SIX compact shoes at z=-5..1.
        assert not any(o["group"] in ("STANDCROSS", "STANDRAIL") for o in boxes), (
            "redundant floor beam reintroduced; could appear to cross a PCB")
        shoes = [o for o in boxes if o["group"] == "STANDJOINT"]
        assert len(shoes) == 6, f"expected 6 low load-transfer shoes, got {len(shoes)}"
        assert all(abs(s["z"] + 5) < .05 and abs(s["z"] + s["h"] - 1) < .05
                   for s in shoes), "shoe must sit below lowered FRAME bottom z=1"
        wings = [o for o in boxes if o["group"] == "STANDPAD"]
        assert len(wings) == (4 if standpads else 0), (
            "optional wings must be controlled by the toggle")
        assert all(not intersects(board, foot) for board in boards
                   for foot in boxes if foot["group"].startswith("STAND")), (
            "standalone board vs shoe/wings intersection")
        print("OK: lowered PCB z=71..251 mm; six foot plates z=-5..1 mm;"
              " no floor beams or crossbars; optional wings tested")

    # Core requirement: motherboards never intersect fixed structure.
    assert_clear(f"motherboards vs ALL fixed structural objects ({scene})",
                 ((b, f) for b in boards for f in fixed_struct))

    # Motherboards vs other non-PCB volumes (excluding the touching standoff geometry).
    assert_clear(f"motherboards vs other non-PCB volumes ({scene})",
                 ((b, x) for b in boards for x in boxes
                  if x is not b and x["group"] not in
                  structural_groups() | {f"PCB{b['bay'] + 1}", f"A{b['bay'] + 1}"}
                  and x["name"].startswith(("SSD", "Fianco", "Traversa e fermo"))))

    # SSD trays must clear their own cartridge cheeks.
    assert_clear(f"SSD trays vs their own moving side walls ({scene})",
                 ((a, b) for a in ssd for b in cheek if a["bay"] == b["bay"]))

    # Mobile pieces (extractable) must not collide with fixed structure, except intended
    # runner/cartridge bottom contacts which are separated by group membership above.
    assert_clear(f"mobile pieces vs fixed supports ({scene})",
                 ((a, f) for a in boxes for f in fixed_struct
                  if a["bay"] is not None and a["group"] not in ("FBGUIDE", "FBCRADLE")
                  and a["group"].startswith(("PCB", "P", "A", "F", "SSD", "IO"))))

    # Fixed-structure self-intersection check: different groups must not overlap,
    # except designed joints where a support/cradle/post meets the FRAME (these
    # parts are intentionally connected and share an attachment volume).
    CONNECTED_JOINTS = {frozenset(("LIGHTSUPPORT", "FRAME")),
                        frozenset(("LIGHTPAD", "FRAME")),
                        frozenset(("FBGUIDE", "FRAME")),
                        frozenset(("FBCRADLE", "FRAME")),
                        # Any real wing connection still needs a fastening
                        # design: the illustrated wing merely touches the shoe.
                        }
    assert_clear(f"fixed-structure parts vs each other ({scene})",
                 ((a, b) for i, a in enumerate(fixed_struct)
                  for b in fixed_struct[i + 1:]
                  if a is not b and a["group"] != b["group"]
                  and frozenset((a["group"], b["group"])) not in CONNECTED_JOINTS))

    # Exact straight-up 0..155 mm swept solid for the lifted bay vs everything else.
    movable = [x for x in boxes if x["bay"] is not None and x["group"] not in ("FBGUIDE", "FBCRADLE")]
    obstacles = [x for x in boxes if x not in movable]
    sweep_hits = []
    for bay in range(7):
        if scene == "module" and bay != focus:
            continue
        obs = obstacles + [x for x in movable if x["bay"] != bay]
        for x in (x for x in movable if x["bay"] == bay):
            swept = {**x, "h": x["h"] + 155}
            for obstacle in obs:
                if intersects(swept, obstacle):
                    sweep_hits.append((bay + 1, x["name"], obstacle["name"]))
    assert not sweep_hits, f"Vertical removal collides in {scene}: " + repr(sweep_hits[:10])
    print(f"OK: straight-up 0..155 mm swept solids clear in {scene}")
    return boxes


def main():
    audit_scene("tower")
    for i in range(7):
        audit_scene("module", focus=i)
    audit_scene("rear")
    audit_scene("thermal")
    audit_scene("standalone", standpads=False)
    audit_scene("standalone", standpads=True)

    # Independent checks of critical nominal-only clearances.
    angle = math.radians(42)
    gap = 54 - 6 / 2 - 92 / 2
    adj_gap = 164 * math.cos(angle) - 2 * (54 + 6 / 2)
    assert gap > 4, gap
    assert adj_gap > 5, adj_gap
    print(f"OK: lateral nominal clearance {gap:.1f} mm; adjacent guide clearance {adj_gap:.2f} mm")

    support_mm3 = sum(x["w"] * x["d"] * x["h"] for x in recorded_boxes("tower")
                      if x["group"] in ("FBGUIDE", "FBCRADLE"))
    print(f"WARN: supports shown as {support_mm3 / 1e6:.3f} L gross solid bounding-box"
          " geometry including overlapping joints; weight not included in validated BOM")
    print("NOT TESTED: power supply envelope, real 226×175 n1 board, real cable bends,"
          " fastening holes, thermal flow, tipping, physical extraction,"
          " standalone floor-base structural validation (concept only).")


if __name__ == "__main__":
    main()
