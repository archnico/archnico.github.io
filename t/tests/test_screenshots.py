#!/usr/bin/env python3
"""Capture headless Chromium screenshots of every FB-1 scene.

This is a smoke test for the renderer: if a scene crashes or produces a blank
image, the test fails.  Screenshots are saved under tests/screenshots/ for
manual inspection.

Run with: python3 tests/test_screenshots.py
Requires: Chromium installed and accessible as 'chromium' on PATH.
"""
import shutil
import subprocess
import tempfile
from pathlib import Path

T = Path(__file__).resolve().parents[1]
JS = T / "assets/universal-viewer.js"
HTML = T / "index.html"
OUT = T / "tests" / "screenshots"
OUT.mkdir(exist_ok=True)

SCENES = [
    ("room", 0),
    ("tower", 0),
    ("module", 0),
    ("module", 3),
    ("module", 6),
    ("standalone", 0),
    ("rear", 0),
    ("thermal", 0),
    ("ups", 0),
    ("cabinet", 0),
    ("storage", 0),
    ("desk", 0),
    ("haugadetail", 0),
]

WINDOWS = {
    "default": (1280, 900),
    "mobile": (390, 844),
}


def screenshot(scene, focus_index=0, size_name="default"):
    chrome = shutil.which("chromium")
    if not chrome:
        raise RuntimeError("Install Chromium to capture screenshots")
    w, h = WINDOWS[size_name]
    original = JS.read_text()
    # Minimal instrumentation: just force the scene after load.
    instrumented = original.replace(
        "\n})();",
        "\nwindow.addEventListener('load',()=>{state.scene='" + scene + "';"
        "state.focusIndex=" + str(focus_index) + ";make();redraw();});\n})();"
    )
    with tempfile.TemporaryDirectory(prefix=".fb1-screenshot-", dir=T) as tmp:
        folder = Path(tmp)
        audit_js = folder / "audit.js"
        audit_html = folder / "audit.html"
        audit_js.write_text(instrumented)
        audit_html.write_text(
            HTML.read_text()
            .replace('href="assets/viewer.css"', f'href="{(T / "assets/viewer.css").as_uri()}"')
            .replace(f'src="assets/{JS.name}"', f'src="{audit_js.as_uri()}"')
        )
        png = OUT / f"{scene}_{focus_index}_{size_name}.png"
        subprocess.run(
            [chrome, "--headless", "--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu",
             f"--window-size={w},{h}", "--hide-scrollbars", "--virtual-time-budget=2500",
             f"--screenshot={png}", audit_html.as_uri()],
            capture_output=True, text=True, timeout=45, check=True
        )
    size = png.stat().st_size
    assert size > 2048, f"{png.name} looks blank ({size} bytes)"
    return png


def main():
    for scene, focus in SCENES:
        png = screenshot(scene, focus)
        print(f"OK: {png.name}")
    # One mobile viewport smoke test.
    png = screenshot("tower", 0, "mobile")
    print(f"OK: {png.name}")
    print(f"\nScreenshots saved to {OUT.relative_to(T)}")


if __name__ == "__main__":
    main()
