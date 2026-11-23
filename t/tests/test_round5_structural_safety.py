#!/usr/bin/env python3
"""Round-5 structural safety static checks for FB-1.

These checks are deliberately conservative: they verify that the render and docs
keep the HAUGA 20 kg limit, the wall-anchor requirement, the no-drilling-in-
furniture rule, the floor-standing alternative and the anti-tip concept visible.
They do NOT validate any load, stiffness or stability calculation.
"""
from pathlib import Path

T = Path(__file__).resolve().parents[1]
JS = (T / "assets" / "viewer.js").read_text()
HTML = (T / "index.html").read_text()
DOC = T / "docs" / "ROUND5_STRUCTURAL_SAFETY_2026-11-23.md"


def test_hauga_20kg_limit_documented():
    assert "20 kg" in JS or "20 kg" in HTML
    assert DOC.exists()
    text = DOC.read_text()
    assert "20 kg" in text
    print("OK: HAUGA 20 kg limit documented")


def test_wall_anchor_documented():
    text = DOC.read_text() + JS
    assert "ancoraggio" in text.lower() or "anchor" in text.lower()
    print("OK: wall anchor requirement documented")


def test_no_drilling_furniture():
    text = JS + DOC.read_text()
    assert ("nessuna vite nel mobile" in text.lower()
            or "nessun carico sul piano ikea" in text.lower()
            or "no drilling" in text.lower())
    print("OK: no-drilling-in-furniture rule documented")


def test_floor_standing_alternative_present():
    assert "standalone" in JS
    assert "AUTONOMA" in JS or "autonoma" in JS.lower()
    print("OK: floor-standing alternative present")


def test_anti_tip_concept_present():
    text = (JS + DOC.read_text()).lower()
    assert "anti-ribaltamento" in text or "anti-tip" in text or "anti tip" in text
    print("OK: anti-tip concept present")


def test_side_supports_outside_pcb_envelope():
    assert "for(const u of [-54,54])" in JS
    assert "Scheda madre illustrativa" in JS
    print("OK: fixed side supports remain at u=+-54 mm, outside the PCB envelope")


def test_round5_marker_present():
    assert "Round 5 (concept only)" in JS
    print("OK: Round 5 marker present in viewer.js")


def test_no_psu_box_gate():
    import re
    forbidden = [
        r"pushBox\([^)]*C\.psu[^)]*Alimentatore",
        r"pushBox\([^)]*'#4c6570'[^)]*Alimentatore",
    ]
    for pat in forbidden:
        assert not re.search(pat, JS), f"Forbidden PSU box pattern found: {pat}"
    print("OK: no fictitious PSU box")


# UX/banner enhancements are not available in this permission scope; keep this
# test file focused on geometry and structural-safety invariants.


def main():
    test_hauga_20kg_limit_documented()
    test_wall_anchor_documented()
    test_no_drilling_furniture()
    test_floor_standing_alternative_present()
    test_anti_tip_concept_present()
    test_no_psu_box_gate()
    test_side_supports_outside_pcb_envelope()
    test_round5_marker_present()
    print("\nAll round-5 structural safety checks passed.")


if __name__ == "__main__":
    main()
