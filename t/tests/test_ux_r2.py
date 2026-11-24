#!/usr/bin/env python3
"""R2 UX smoke tests: camera presets, nested subgroups and responsive layout.

Requires a Chromium-based browser in PATH. The tests exercise the new
Round-2 controls wired by viewer-enhancements.js without touching geometry.
"""
import html
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
CSS = ROOT / "assets" / "viewer.css"
VIEWER = ROOT / "assets" / "viewer.js"
ENH = ROOT / "assets" / "viewer-enhancements.js"


def chromium_path():
    for name in ("chromium", "chromium-browser", "google-chrome", "google-chrome-stable"):
        p = shutil.which(name)
        if p:
            return p
    return None


def chrome_base():
    return [
        chromium_path(),
        "--headless",
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
        "--hide-scrollbars",
        "--virtual-time-budget=3000",
    ]


def _parse_out(stdout):
    m = __import__("re").search(r'<pre id="ux-out">(.*?)</pre>', stdout, __import__("re").S)
    if not m:
        raise AssertionError("No UX test output rendered")
    return json.loads(html.unescape(m.group(1)))


def test_camera_presets_and_subgroups():
    """Click camera presets and subgroup masters through the real HTML."""
    chrome = chromium_path()
    if not chrome:
        raise RuntimeError("Chromium not found; install chromium to run UX tests")

    dom_script = r"""
<script>
window.addEventListener('load', () => {
  function $(s){return document.querySelector(s);}
  function wait(ms){return new Promise(r=>setTimeout(r,ms));}
  async function run(){
    const out = document.getElementById('ux-out');
    try{
      await wait(700);
      // 1. Camera preset: room
      document.querySelector('[data-cam-preset="room"]').click();
      await wait(120);
      const roomCaption = $('#scene-caption').textContent.toUpperCase().includes('STANZA');
      // 2. Camera preset: tower
      document.querySelector('[data-cam-preset="tower"]').click();
      await wait(120);
      const towerCaption = $('#scene-caption').textContent.toUpperCase().includes('TORRE');
      // 3. Orientation presets
      document.querySelector('[data-cam-preset="side"]').click();
      await wait(80);
      const sideActive = document.querySelector('[data-cam-preset="side"]').classList.contains('active');
      document.querySelector('[data-cam-preset="top"]').click();
      await wait(80);
      const topActive = document.querySelector('[data-cam-preset="top"]').classList.contains('active');
      // 4. Fit preset
      document.querySelector('[data-cam-preset="fit"]').click();
      await wait(80);
      const fitActive = document.querySelector('[data-cam-preset="fit"]').classList.contains('active');
      // 5. Subgroup master: HAUGA details
      const haugaMaster = document.querySelector('[data-subgroup-toggle="hauga"]');
      haugaMaster.click();
      await wait(80);
      const haugaOff = ['haugaStruttura','haugaCassetti','haugaPomelli'].every(layer => {
        const sw = document.querySelector('[data-layer="'+layer+'"]');
        return sw && sw.getAttribute('aria-checked') === 'false';
      });
      haugaMaster.click();
      await wait(80);
      const haugaOn = ['haugaStruttura','haugaCassetti','haugaPomelli'].every(layer => {
        const sw = document.querySelector('[data-layer="'+layer+'"]');
        return sw && sw.getAttribute('aria-checked') === 'true';
      });
      // 6. Focus hint present
      const focusHint = !!$('#focus-hint');
      out.textContent = JSON.stringify({
        roomCaption, towerCaption, sideActive, topActive, fitActive,
        haugaOff, haugaOn, focusHint,
        caption: $('#scene-caption').textContent
      });
    }catch(err){
      out.textContent = JSON.stringify({error: err.message, stack: err.stack});
    }
  }
  run();
});
</script><pre id="ux-out"></pre>
"""
    with tempfile.TemporaryDirectory(prefix=".ux-r2-", dir=ROOT) as tmp:
        folder = Path(tmp)
        test_html = folder / "r2.html"
        source = (
            INDEX.read_text()
            .replace('href="assets/viewer.css"', f'href="{CSS.as_uri()}"')
            .replace('src="assets/viewer.js"', f'src="{VIEWER.as_uri()}"')
            .replace('src="assets/viewer-enhancements.js"', f'src="{ENH.as_uri()}"')
            .replace("</body>", dom_script + "</body>")
        )
        test_html.write_text(source)
        proc = subprocess.run(
            chrome_base() + ["--dump-dom", test_html.as_uri()],
            capture_output=True, text=True, timeout=45, check=True
        )
    result = _parse_out(proc.stdout)
    if "error" in result:
        raise AssertionError("R2 DOM test internal error: " + result["error"])
    assert result.get("roomCaption"), f"Room preset failed, caption={result.get('caption')}"
    assert result.get("towerCaption"), f"Tower preset failed, caption={result.get('caption')}"
    assert result.get("sideActive"), "Side camera preset did not become active"
    assert result.get("topActive"), "Top camera preset did not become active"
    assert result.get("fitActive"), "Fit camera preset did not become active"
    assert result.get("haugaOff"), "HAUGA subgroup master did not turn off details"
    assert result.get("haugaOn"), "HAUGA subgroup master did not turn on details"
    assert result.get("focusHint"), "Focus hint missing"
    print("OK: R2 camera presets and subgroups", result)


def test_camera_preset_screenshots():
    """Capture non-empty screenshots for the new camera presets."""
    chrome = chromium_path()
    if not chrome:
        raise RuntimeError("Chromium not found; cannot run R2 screenshots")

    presets = ["room", "tower", "cabinet", "standalone", "side", "rear", "top"]
    try:
        from PIL import Image
        have_pil = True
    except Exception:
        have_pil = False

    with tempfile.TemporaryDirectory(prefix=".ux-r2-shot-", dir=ROOT) as tmp:
        folder = Path(tmp)
        outputs = []
        for preset in presets:
            out = folder / f"{preset}.png"
            url = INDEX.as_uri() + f"?cam={preset}"
            subprocess.run(
                chrome_base()
                + [
                    "--window-size=1280,800",
                    f"--screenshot={out}",
                    url,
                ],
                capture_output=True, text=True, timeout=45, check=True,
            )
            assert out.exists() and out.stat().st_size > 2048, f"Empty screenshot for {preset}"
            if have_pil:
                im = Image.open(out)
                assert im.size == (1280, 800), f"Unexpected screenshot size for {preset}: {im.size}"
            outputs.append((preset, out.stat().st_size))

        mobile_out = folder / "mobile-r2.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=390,844",
                f"--screenshot={mobile_out}",
                INDEX.as_uri() + "?cam=room",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert mobile_out.exists() and mobile_out.stat().st_size > 2048, "Empty mobile screenshot"
        outputs.append(("mobile", mobile_out.stat().st_size))

    sizes = ", ".join(f"{s}={b//1024}KB" for s, b in outputs)
    print(f"OK: R2 camera screenshots ({sizes})")


def main():
    if not chromium_path():
        print("SKIP: Chromium not available, cannot run R2 UX tests")
        return
    test_camera_presets_and_subgroups()
    test_camera_preset_screenshots()


if __name__ == "__main__":
    main()
