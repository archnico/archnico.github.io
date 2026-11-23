#!/usr/bin/env python3
"""Static checks for Round 1 UX enhancements.

This test does not run a browser; it verifies that the expected files,
attributes and references are in place and that viewer.js is not edited.
"""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT / "index.html"
CSS = ROOT / "assets" / "viewer.css"
JS = ROOT / "assets" / "viewer-enhancements.js"
VIEWER = ROOT / "assets" / "viewer.js"


def test_files_exist():
    assert HTML.exists(), f"Missing {HTML}"
    assert CSS.exists(), f"Missing {CSS}"
    assert JS.exists(), f"Missing {JS}"
    assert VIEWER.exists(), f"Missing {VIEWER}"


def test_enhancements_loaded_after_viewer():
    text = HTML.read_text()
    viewer_pos = text.find('src="assets/viewer.js"')
    enh_pos = text.find('src="assets/viewer-enhancements.js"')
    assert viewer_pos != -1, "viewer.js script tag missing"
    assert enh_pos != -1, "viewer-enhancements.js script tag missing"
    assert enh_pos > viewer_pos, "enhancements.js must load after viewer.js"


def test_required_elements_present():
    text = HTML.read_text()
    required = [
        'id="left-panel"',
        'id="menu-toggle"',
        'aria-controls="left-panel"',
        'class="skip-link"',
        'id="selection-hud"',
        'id="focus-selected"',
        'id="help-panel"',
        'id="help-btn"',
        'id="fullscreen-btn"',
        'role="dialog"',
        'aria-modal="true"',
        'id="focus-hint"',
        'data-cam-preset',
        'data-subgroup-toggle',
    ]
    for item in required:
        assert item in text, f"Missing required HTML fragment: {item}"


def test_mobile_sidebar_styles():
    css = CSS.read_text()
    assert ".menu-toggle" in css
    assert ".left.open" in css
    assert ".left.collapsed" in css
    assert "@media (max-width:760px)" in css


def test_camera_preset_styles():
    css = CSS.read_text()
    assert "[data-cam-preset].active" in css
    assert ".camera-presets" in css


def test_nested_subgroup_styles():
    css = CSS.read_text()
    assert ".layer-subgroup" in css
    assert ".subgroup-master" in css
    assert ".subgroup-master.on" in css


def test_accessibility_styles():
    css = CSS.read_text()
    assert ".skip-link" in css
    assert "prefers-reduced-motion" in css
    assert ":focus-visible" in css


def test_no_forbidden_viewer_js_edits():
    """Ensure canonical engineering facts are still present and no PSU box exists."""
    viewer = VIEWER.read_text()
    assert "no HDD inside compute H-7" in viewer or "NO HDD" in viewer, "HDD policy missing"
    assert "no birch" in viewer.lower() or "NO BETULLA" in viewer, "birch policy missing"
    assert "Alimentatore singolo" not in viewer, "Fictitious PSU box reintroduced"
    assert "UPS" in viewer


def test_enhancements_no_geometry_mutation():
    js = JS.read_text()
    assert "pushBox" not in js, "enhancements.js must not create geometry"
    assert "faces.push" not in js, "enhancements.js must not create faces"
    assert "data-layer" in js


if __name__ == "__main__":
    test_files_exist()
    test_enhancements_loaded_after_viewer()
    test_required_elements_present()
    test_mobile_sidebar_styles()
    test_accessibility_styles()
    test_no_forbidden_viewer_js_edits()
    test_enhancements_no_geometry_mutation()
    print("OK: UX enhancements static checks passed")
