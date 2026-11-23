#!/usr/bin/env python3
"""Round-3 motherboard-reality static checks for FB-1.

Verifies that the render distinguishes the illustrative 208×180 mm board from the
real n1 ASUS H81M-E ~226×175 mm (registro), exposes the uncertainty envelope and
documents unmeasured features, without fabricating donor measurements.  These
checks are static (no Chromium) and complement blundercheck_fb1.py.
"""
from pathlib import Path

T = Path(__file__).resolve().parents[1]
JS = T / "assets" / "viewer.js"
TEXT = JS.read_text()


def test_illustrative_board_dimensions_present():
    assert "208×180 mm" in TEXT
    print("OK: illustrative 208×180 mm board label present")


def test_real_n1_dimensions_present():
    assert "226×175 mm" in TEXT
    assert "ASUS H81M-E" in TEXT
    print("OK: real n1 ASUS H81M-E ~226×175 mm reference present")


def test_uncertainty_envelope_present():
    assert "INCERTEZZA SCHEDA REALE" in TEXT
    assert "MBREAL" in TEXT
    # Non-solid: dashed wires only, no pushBox for the real board between the markers.
    segment = TEXT.split("INCERTEZZA SCHEDA REALE", 1)[1].split("Dissipatore/RAM", 1)[0]
    assert "pushBox" not in segment, "Real-board uncertainty envelope must not introduce solids"
    print("OK: uncertainty envelope is a dashed (non-solid) aid")


def test_unmeasured_features_documented():
    assert "fori" in TEXT.lower() or "FORI" in TEXT
    assert "dissipatore" in TEXT.lower() or "Dissipatore" in TEXT
    assert "RAM" in TEXT
    assert "connettori" in TEXT.lower() or "CONNETTORI" in TEXT
    print("OK: unmeasured features (holes, cooler, RAM, connectors) documented")


def test_side_support_distance_note():
    assert "FUORI dall" in TEXT
    assert "inviluppo di incertezza" in TEXT
    print("OK: side-support distance note mentions uncertainty envelope")


def test_pcb_inspector_mentions_real_board():
    assert "n1 ASUS H81M-E ~226×175 mm nel registro" in TEXT
    print("OK: PCB inspector describes real board and unmeasured features")


def test_no_psu_box_still():
    assert "Alimentatore" not in TEXT or "NON DIMENSIONATA" in TEXT
    print("OK: no fictitious PSU solid reintroduced")


def main():
    test_illustrative_board_dimensions_present()
    test_real_n1_dimensions_present()
    test_uncertainty_envelope_present()
    test_unmeasured_features_documented()
    test_side_support_distance_note()
    test_pcb_inspector_mentions_real_board()
    test_no_psu_box_still()
    print("\nAll round-3 motherboard-reality checks passed.")


if __name__ == "__main__":
    main()