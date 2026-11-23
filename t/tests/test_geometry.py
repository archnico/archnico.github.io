#!/usr/bin/env python3
"""Static geometry sanity checks independent of Chromium.

These tests verify that the canonical FB-1 constants and helper functions in
viewer.js are self-consistent.  They do not replace the SAT collision audit but
catch regressions quickly without launching a browser.
"""
import json
import math
import re
from pathlib import Path

T = Path(__file__).resolve().parents[1]
JS = T / "assets" / "viewer.js"


def fb_constants():
    """Parse the FB-1 canonical constants from viewer.js."""
    text = JS.read_text()
    m = re.search(r"const FB=\{length:(\d+),depth:(\d+),angle:Math\.PI\*(\d+)/(\d+),pitch:(\d+),first:(\d+),cy:(\d+)\}", text)
    assert m, "FB constants not found"
    length, depth, anum, aden, pitch, first, cy = map(int, m.groups())
    angle = math.pi * anum / aden
    return {"length": length, "depth": depth, "angle_deg": anum / aden * 180,
            "angle_rad": angle, "pitch": pitch, "first": first, "cy": cy}


def test_herringbone_spacing():
    fb = fb_constants()
    # Perpendicular distance between adjacent bay axes.
    perp = fb["pitch"] * math.cos(fb["angle_rad"])
    # 92 mm moving cartridge, 8 mm fixed guide thickness, 4 mm nominal clearance per side.
    guide_center = 92 / 2 + 4 + 8 / 2
    assert abs(guide_center - 54) < 0.1, "Fixed guide centre inconsistent with clearance"
    # Adjacent fixed-guide clearance.
    adj = perp - 2 * guide_center
    assert adj > 5, f"Adjacent guide clearance too small: {adj:.2f} mm"
    print(f"OK: perp spacing {perp:.2f} mm, adjacent guide clearance {adj:.2f} mm")


def test_envelope_fits_hauga():
    fb = fb_constants()
    misure = json.loads((T / "misure.json").read_text())
    cab = misure["furniture"]["identified"]["catalog_dimensions"]
    inner = misure["furniture"]["identified"]["nominal_inner_top_mm"]
    # FB-1 footprint vs HAUGA internal nominal light and measured outer dims.
    assert fb["length"] <= inner[0] - 30, "FB-1 length exceeds HAUGA nominal inner light"
    assert fb["depth"] <= inner[1] - 10, "FB-1 depth exceeds HAUGA nominal inner light"
    assert fb["length"] <= cab["larghezza"] - 20, "FB-1 length exceeds HAUGA catalog width"
    assert fb["depth"] <= cab["profondita"] - 30, "FB-1 depth exceeds HAUGA catalog depth"
    print(f"OK: FB-1 {fb['length']}×{fb['depth']} mm fits inside HAUGA"
          f" inner {inner[0]}×{inner[1]} mm and catalog {cab['larghezza']}×{cab['profondita']} mm")


def test_no_psu_strings_in_source():
    """Ensure no fictitious PSU box can be accidentally re-enabled."""
    text = JS.read_text()
    forbidden = [
        r"pushBox\([^)]*C\.psu[^)]*Alimentatore",
        r"pushBox\([^)]*'#4c6570'[^)]*Alimentatore",
    ]
    for pat in forbidden:
        assert not re.search(pat, text), f"Forbidden PSU box pattern found: {pat}"
    print("OK: no fictitious PSU box patterns in viewer.js source")


def test_module_scene_uses_fbmoduledetail():
    text = JS.read_text()
    assert "fbModuleDetail(state.focusIndex)" in text, "Module scene must use fbModuleDetail"
    assert "function fbModuleDetail(" in text, "fbModuleDetail must be defined"
    print("OK: module scene routed through fbModuleDetail")


def test_fishbone_cartridge_exists():
    text = JS.read_text()
    assert "function fishboneCartridge(" in text, "fishboneCartridge must be defined"
    print("OK: fishboneCartridge factored out")


def main():
    test_herringbone_spacing()
    test_envelope_fits_hauga()
    test_no_psu_strings_in_source()
    test_module_scene_uses_fbmoduledetail()
    test_fishbone_cartridge_exists()
    print("\nAll static geometry checks passed.")


if __name__ == "__main__":
    main()
