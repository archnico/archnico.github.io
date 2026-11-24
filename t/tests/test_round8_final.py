#!/usr/bin/env python3
"""Round-8 final review static checks (alias)."""
from pathlib import Path
import json, re
T = Path(__file__).resolve().parents[1]
JS = T / "assets" / "viewer.js"
MISURE = T / "misure.json"

def test_doc():
    assert (T/"docs"/"ROUND8_FINAL_REVIEW_HANDOFF_2026-11-23.md").exists()
    print("OK: final review doc present")

def test_misure():
    m=json.loads(MISURE.read_text())
    assert "round8_2026_11_23" in m
    print("OK: misure round8")

def test_no_psu():
    text=JS.read_text()
    assert not re.search(r"pushBox\([^)]*C\.psu[^)]*Alimentatore", text)
    print("OK: no PSU box")

def test_fb():
    assert "const FB={length:1310,depth:318" in JS.read_text()
    print("OK: FB constants")

def test_panel():
    assert "round8-handoff" in JS.read_text()
    print("OK: handoff panel")

if __name__=="__main__":
    test_doc(); test_misure(); test_no_psu(); test_fb(); test_panel()
    print("\nAll round-8 final checks passed.")