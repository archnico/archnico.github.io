#!/usr/bin/env python3
"""Round-8 handoff static checks (alias)."""
from pathlib import Path
import json, re
T = Path(__file__).resolve().parents[1]
JS = T / "assets" / "viewer.js"
MISURE = T / "misure.json"
DOCS = [T/"docs"/"ROUND8_FINAL_REVIEW_HANDOFF_2026-11-23.md", T/"docs"/"HANDOFF_06_00_2026-11-23.md"]

def test_doc_exists():
    assert any(p.exists() for p in DOCS)
    text="".join(p.read_text() for p in DOCS if p.exists())
    assert "NO-GO" in text and "SAT" in text
    print("OK: handoff doc present")

def test_misure_round8():
    m=json.loads(MISURE.read_text())
    assert "round8_2026_11_23" in m
    assert m["round8_2026_11_23"].get("geometry_changed") is False
    print("OK: misure round8 present")

def test_no_psu():
    text=JS.read_text()
    for pat in [r"pushBox\([^)]*C\.psu[^)]*Alimentatore", r"pushBox\([^)]*'#4c6570'[^)]*Alimentatore"]:
        assert not re.search(pat,text)
    print("OK: no PSU box")

def test_fb_constants():
    assert "const FB={length:1310,depth:318" in JS.read_text()
    print("OK: FB constants")

def test_handoff_panel():
    text=JS.read_text()
    assert "round8-handoff" in text and "HANDOFF 06:00" in text
    print("OK: handoff panel")

if __name__=="__main__":
    test_doc_exists(); test_misure_round8(); test_no_psu(); test_fb_constants(); test_handoff_panel()
    print("\nAll round-8 handoff checks passed.")