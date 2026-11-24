#!/usr/bin/env python3
"""Round-7 full second-order review checks for FB-1."""
from pathlib import Path
import json
import math
import re

T = Path(__file__).resolve().parents[1]
JS = T / "assets" / "viewer.js"
DOC = T / "docs" / "ROUND7_FULL_REVIEW_2026-11-23.md"
BLUNDER = T / "tests" / "blundercheck_fb1.py"

text = JS.read_text()


def test_round7_doc_exists():
    assert DOC.exists(), "Round 7 doc missing"
    assert "NO-GO" in DOC.read_text()
    print("OK: Round 7 doc present")


def test_misure_round7_entry():
    m = json.loads((T / "misure.json").read_text())
    assert "round7_2026_11_23" in m
    assert m["round7_2026_11_23"].get("geometry_changed") is False
    print("OK: misure.json round7 entry present")


def test_blocker_panel_present():
    assert "blocker-panel" in text
    assert "BLOCCHI INGEGNERISTICI (NO-GO)" in text
    assert "SAT box-level: PASS" in text
    print("OK: prominent blocker panel present")


def test_blocker_shortcut_present():
    assert "e.key.toLowerCase()==='b'" in text
    print("OK: B keyboard shortcut present")


def test_blundercheck_covers_all_scenes():
    b = BLUNDER.read_text()
    for scene in ['"tower"', '"rear"', '"thermal"', '"standalone"']:
        assert scene in b, f"blundercheck missing scene {scene}"
    assert 'for i in range(7)' in b
    print("OK: blundercheck covers tower/module/rear/thermal/standalone")


def test_boundary_rotation_cases():
    fb = re.search(r"const FB=\{length:(\d+),depth:(\d+),angle:Math\.PI\*(\d+)/(\d+),pitch:(\d+),first:(\d+),cy:(\d+)\}", text)
    assert fb
    length, depth, anum, aden, pitch, first, cy = map(int, fb.groups())
    angle = math.pi * anum / aden
    perp = pitch * math.cos(angle)
    guide_center = 92 / 2 + 4 + 8 / 2
    adj = perp - 2 * guide_center
    assert adj > 5, f"adjacent guide clearance too small: {adj:.2f}"
    assert abs(guide_center - 54) < 0.1
    assert length == 1310 and depth == 318
    assert anum / aden * 180 == 42
    print(f"OK: boundary/rotation cases pass (perp={perp:.2f}, adj={adj:.2f})")


def test_r5_not_canonical():
    # FB-1 constants must not be the R5 donor envelope.
    assert "const FB={length:1310,depth:318" in text
    assert "80×251" not in text or "R5" in text
    print("OK: FB-1 remains canonical, distinct from R5")


def test_no_psu_box_gate():
    import re as _re
    forbidden = [r"pushBox\([^)]*C\.psu[^)]*Alimentatore", r"pushBox\([^)]*'#4c6570'[^)]*Alimentatore"]
    for pat in forbidden:
        assert not _re.search(pat, text), f"Forbidden PSU box pattern found: {pat}"
    print("OK: no fictitious PSU box")


def main():
    test_round7_doc_exists()
    test_misure_round7_entry()
    test_blocker_panel_present()
    test_blocker_shortcut_present()
    test_blundercheck_covers_all_scenes()
    test_boundary_rotation_cases()
    test_r5_not_canonical()
    test_no_psu_box_gate()
    print("\nAll round-7 review checks passed.")


if __name__ == "__main__":
    main()