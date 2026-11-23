#!/usr/bin/env python3
"""Round-6 model/static checks for FB-1.

Verifies that the Round 6 refinements are present in viewer.js and docs,
without changing geometry or introducing new solids.
"""
from pathlib import Path
import re

T = Path(__file__).resolve().parents[1]
JS = T / "assets" / "viewer.js"
DOC = T / "docs" / "ROUND6_SEMANTIC_PICKING_XRAY_2026-11-23.md"

text = JS.read_text()


def test_round6_doc_exists():
    assert DOC.exists(), "Round 6 doc missing"
    print("OK: Round 6 doc present")


def test_part_meta_map_present():
    assert "const PART_META={" in text
    assert "function partMetaFor(" in text
    for key in ["FBGUIDE", "FBCRADLE", "FRAME", "PCB", "SSD", "STANDRAIL", "UPS", "DAS4", "HUB4"]:
        assert key in text, f"PART_META missing {key}"
    print("OK: PART_META engineering metadata present")


def test_xray_keyboard_shortcut():
    assert "if(k==='x'){" in text or 'if(k==="x"){' in text or "k==='x'" in text
    assert "xray-on" in text
    print("OK: xray keyboard shortcut and body class present")


def test_reduced_motion_handling():
    assert "prefers-reduced-motion" in text
    assert "reduce-motion" in text
    print("OK: reduced-motion handling present")


def test_part_search_filter_present():
    assert "part-search" in text
    assert "Cerca componente" in text
    print("OK: semantic part search filter present")


def test_metadata_shown_in_inspector():
    assert "Metadati (concept)" in text
    print("OK: engineering metadata shown in inspector")


def test_no_new_solids_round6():
    # Round 6 must not introduce additional pushBox/rotBox geometry calls beyond
    # the existing ones. Check that no PSU box pattern reappears.
    forbidden = [r"pushBox\([^)]*C\.psu[^)]*Alimentatore", r"pushBox\([^)]*'#4c6570'[^)]*Alimentatore"]
    for pat in forbidden:
        assert not re.search(pat, text), f"Forbidden PSU box reintroduced: {pat}"
    print("OK: no fictitious PSU box reintroduced")


def test_geometry_invariants_still_present():
    assert "const FB={length:1310,depth:318" in text
    assert "fbBox(i,u,v,107,6,8,133" in text
    assert "for(let k=0;k<7;k++)" in text
    print("OK: core geometry invariants intact")


def test_misure_round6_entry():
    import json
    m = json.loads((T / "misure.json").read_text())
    assert "round6_2026_11_23" in m
    assert m["round6_2026_11_23"].get("geometry_changed") is False
    print("OK: misure.json round6 entry present")


def main():
    test_round6_doc_exists()
    test_part_meta_map_present()
    test_xray_keyboard_shortcut()
    test_reduced_motion_handling()
    test_part_search_filter_present()
    test_metadata_shown_in_inspector()
    test_no_new_solids_round6()
    test_geometry_invariants_still_present()
    test_misure_round6_entry()
    print("\nAll round-6 model checks passed.")


if __name__ == "__main__":
    main()
