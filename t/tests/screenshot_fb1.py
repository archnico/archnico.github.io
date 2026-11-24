#!/usr/bin/env python3
"""Capture headless Chromium screenshots of the main FB-1 scenes.

Requires Chromium. On a headless server run inside a virtual framebuffer:

    xvfb-run -a python3 t/tests/screenshot_fb1.py

Outputs are written to t/tests/output/.
"""
import base64
import re
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "tests" / "output"
OUT.mkdir(parents=True, exist_ok=True)
JS = ROOT / "assets" / "viewer.js"
HTML = ROOT / "index.html"

SCENES = [
    ("room", "01_stanza.png"),
    ("tower", "02_torre.png"),
    ("module", "03_modulo.png"),
    ("rear", "04_retro.png"),
    ("thermal", "05_termico.png"),
    ("standalone", "06_autonoma.png"),
    ("cabinet", "07_su_hauga.png"),
    ("storage", "08_torrino.png"),
]


def screenshot(scene: str, out_name: str):
    chrome = shutil.which("chromium")
    if not chrome:
        raise RuntimeError("Chromium not found")

    with tempfile.TemporaryDirectory(prefix=".fb1-shot-", dir=ROOT) as tmp:
        folder = Path(tmp)
        shot_html = folder / "shot.html"
        shot_js = folder / "shot.js"
        shot_js.write_text(JS.read_text())
        body = HTML.read_text()
        # Make the viewer initialise into the requested scene via location.hash.
        body = body.replace(
            '<script src="assets/viewer.js" defer></script>',
            f'<script>location.hash="#{scene}";window.__fb1ShotScene="{scene}";</script>'
            f'<script src="{shot_js.as_uri()}" defer></script>'
        )
        # After the viewer has rendered, encode the canvas as PNG into the DOM.
        body = body.replace(
            '</body>',
            '<script>window.addEventListener("load",()=>{setTimeout(()=>{'
            'const c=document.getElementById("c");'
            'document.body.setAttribute("data-png",c.toDataURL("image/png").split(",")[1]);'
            '},1400);});</script></body>'
        )
        shot_html.write_text(body)
        proc = subprocess.run(
            [chrome, "--headless", "--no-sandbox", "--disable-dev-shm-usage",
             "--disable-gpu", "--window-size=1920,1080", "--virtual-time-budget=3000",
             "--dump-dom", shot_html.as_uri()],
            capture_output=True, text=True, timeout=60, check=True
        )
    m = re.search(r'data-png="([^"]+)"', proc.stdout)
    if not m:
        raise AssertionError(f"No screenshot data for scene {scene}")
    (OUT / out_name).write_bytes(base64.b64decode(m.group(1)))
    print(f"Wrote {OUT / out_name}")


def main():
    for scene, name in SCENES:
        screenshot(scene, name)
    print(f"All screenshots saved to {OUT}")


if __name__ == "__main__":
    main()
