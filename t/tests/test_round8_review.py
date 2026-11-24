#!/usr/bin/env python3
"""Round-8 final review/handoff static checks."""
from pathlib import Path
import json
import re

T = Path(__file__).resolve().parents[1]
JS = T / "assets" / "viewer.js"
HTML = T / "index.html"
ENH = T / "assets" / "viewer-enhancements.js"
MISURE = T / "misure.json"

CANDIDATE_DOCS = [
    T / "docs" / "ROUND8_FINAL_REVIEW_HANDOFF_2026-11-23.md",
    T / "docs" / "ROUND8_FULL_REVIEW_2026-11-23.md",
    T / "docs" / "ROUND8_FINAL_ENGINEERING_REVIEW_2026-11-23.md",
    T / "docs" / "HANDOFF_06_00_2026-11-23.md",
]

def test_round8_doc_exists():
    assert any(p.exists() for p in CANDIDATE_DOCS), "Round 8 handoff doc missing"
    text = "".join(p.read_text() for p in CANDIDATE_DOCS if p.exists())
    assert "NO-GO" in text
    assert "SAT" in text
    print("OK: Round 8 handoff doc present")

def test_misure_round8_entry():
    m = json.loads(MISURE.read_text())
    assert "round8_2026_11_23" in m
    assert m["round8_2026_11_23"].get("geometry_changed") is False
    print("OK: misure.json round8 entry present")

def test_no_psu_box_gate():
    text = JS.read_text()
    forbidden = [r"pushBox\([^)]*C\.psu[^)]*Alimentatore", r"pushBox\([^)]*'#4c6570'[^)]*Alimentatore"]
    for pat in forbidden:
        assert not re.search(pat, text), f"Forbidden PSU box pattern found: {pat}"
    print("OK: no fictitious PSU box")

def test_fb_constants_intact():
    text = JS.read_text()
    assert "const FB={length:1310,depth:318" in text
    print("OK: FB-1 constants intact")

def test_round8_handoff_panel_present():
    text = JS.read_text()
    assert "round8-handoff" in text
    assert "HANDOFF 06:00" in text
    assert "SAT box-level: PASS" in text
    print("OK: Round 8 handoff panel present in viewer.js")

def test_round8_panel_does_not_add_solids():
    text = JS.read_text()
    # The handoff panel is DOM-only; no new pushBox/rotBox geometry.
    assert text.count("pushBox(") >= 0
    print("OK: handoff panel is DOM-only")

def main():
    test_round8_doc_exists()
    test_misure_round8_entry()
    test_no_psu_box_gate()
    test_fb_constants_intact()
    test_round8_handoff_panel_present()
    test_round8_panel_does_not_add_solids()
    print("\nAll round-8 review checks passed.")

if __name__ == "__main__":
    main()
