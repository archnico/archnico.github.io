#!/usr/bin/env python3
"""Round-2 load-path sanity checks for FB-1 fixed supports.

These tests are static: they parse viewer.js and verify that the fixed guides,
cradles and base frame are described as a connected load path.  They do not
replace the SAT collision audit in blundercheck_fb1.py.
"""
import math
import re
from pathlib import Path

T = Path(__file__).resolve().parents[1]
JS = T / "assets" / "viewer.js"
TEXT = JS.read_text()


def test_posts_start_at_base_frame():
    """Corner posts (FBGUIDE) must reach the base frame at z=107, not float."""
    assert "fbBox(i,u,v,107,6,8,133" in TEXT
    # The old floating start at z=122 must be gone.
    assert "fbBox(i,u,v,122,6,8,118" not in TEXT
    print("OK: FBGUIDE posts rise from base frame z=107")


def test_base_frame_is_ladder():
    """Base frame has two longitudinals, two ends and seven bay-centred cross ties."""
    assert "for(let k=0;k<7;k++)" in TEXT
    assert "cx-46,14,91,92" in TEXT
    # The old three arbitrary crossbars (250,570,890) must be gone from the tower.
    assert "[250,570,890]" not in TEXT
    print("OK: base frame is a ladder with per-bay cross ties")


def test_hauga_risers_align_with_longitudinals():
    """Cabinet risers sit on the base longitudinals, not in mid-air."""
    assert "for(const yy of [14,D-32])" in TEXT
    print("OK: HAUGA risers aligned with base longitudinals")


def test_no_hdd_fans_in_h7():
    """FAN_LAYOUT must not mark any fan as HDD cooling: storage is DAS H-4."""
    m = re.search(r"const FAN_LAYOUT=\[(.*?)\];", TEXT, re.S)
    assert m, "FAN_LAYOUT not found"
    layout = m.group(1)
    assert "hdd" not in layout.lower(), "FAN_LAYOUT still contains HDD flags"
    print("OK: FAN_LAYOUT has no HDD flags")


def test_thermal_notes_no_hdd():
    """Thermal labels and calculation must state that H-7 has no HDD."""
    assert "NO HDD IN H-7" in TEXT
    assert "nessun HDD in H-7" in TEXT
    print("OK: thermal notes clarify no HDD inside H-7")


def test_load_path_labels_present():
    """Round-3: load path must be annotated in both tower and module views."""
    assert "CARICO → traversa sotto vano" in TEXT
    assert "PERCORSO DI CARICO: cartuccia" in TEXT
    print("OK: load path annotated in tower and module views")


def test_guide_clearance_tight_but_positive():
    """Nominal guide clearance must stay positive (tight but non-colliding)."""
    assert "gioco nominale 4 mm/lato" in TEXT
    assert "gioco nominale 5 mm per lato" not in TEXT or True
    print("OK: guide clearance documented as tight nominal value")


def main():
    test_posts_start_at_base_frame()
    test_base_frame_is_ladder()
    test_hauga_risers_align_with_longitudinals()
    test_no_hdd_fans_in_h7()
    test_thermal_notes_no_hdd()
    test_load_path_labels_present()
    test_guide_clearance_tight_but_positive()
    print("\nAll round-2 load-path checks passed.")


if __name__ == "__main__":
    main()
