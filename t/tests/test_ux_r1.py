#!/usr/bin/env python3
"""R1 UX smoke tests: DOM interactions and screenshot renders for the H-7 preview.

Requires a Chromium-based browser in PATH. The tests exercise the UI controls
wired by viewer.js and the enhancements in viewer-enhancements.js.
"""
import html
import json
import shutil
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
CSS = ROOT / "assets/viewer.css"
VIEWER = ROOT / "assets/viewer.js"
ENH = ROOT / "assets/viewer-enhancements.js"


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


def test_dom_interactions():
    """Click layers, scenes, menu, help and selection through the real HTML."""
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
      // 1. Toggle a layer off
      const pareti = document.querySelector('[data-layer="pareti"]');
      pareti.click();
      await wait(50);
      const layerToggled = !pareti.classList.contains('on') && pareti.getAttribute('aria-checked')==='false';
      // 2. Change scene
      document.querySelector('[data-scene="tower"]').click();
      await wait(100);
      const sceneChanged = $('#scene-caption').textContent.toUpperCase().includes('TORRE');
      // 3. Mobile menu toggle
      const menu = $('#menu-toggle');
      const left = $('#left-panel');
      menu.click();
      await wait(50);
      const menuOpened = left.classList.contains('open') && menu.getAttribute('aria-expanded')==='true';
      menu.click();
      await wait(50);
      const menuClosed = !left.classList.contains('open') && menu.getAttribute('aria-expanded')==='false';
      // 4. Help panel
      $('#help-btn').click();
      await wait(50);
      const helpOpen = !$('#help-panel').hidden;
      $('#help-panel').querySelector('.close').click();
      await wait(50);
      const helpClosed = $('#help-panel').hidden;
      // 5. Selection opens HUD and auto-isolates
      const picker = $('#part-picker');
      const pickerHasOptions = picker.options.length > 1;
      if(pickerHasOptions){
        picker.value = picker.options[1].value;
        picker.dispatchEvent(new Event('change',{bubbles:true}));
        await wait(150);
      }
      const hudActive = pickerHasOptions && $('#selection-hud').classList.contains('active');
      const semiOn = pickerHasOptions && document.querySelector('[data-layer="semitrasparente"]').getAttribute('aria-checked')==='true';
      const isoOn = pickerHasOptions && document.querySelector('[data-layer="isola"]').getAttribute('aria-checked')==='true';
      // 6. Fullscreen button present
      const fullscreenOk = !!$('#fullscreen-btn');
      out.textContent = JSON.stringify({
        layerToggled, sceneChanged, menuOpened, menuClosed, helpOpen, helpClosed,
        pickerHasOptions, hudActive, semiOn, isoOn, fullscreenOk,
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
    with tempfile.TemporaryDirectory(prefix=".ux-dom-", dir=ROOT) as tmp:
        folder = Path(tmp)
        test_html = folder / "dom.html"
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
        raise AssertionError("DOM test internal error: " + result["error"])
    assert result.get("layerToggled"), "Layer toggle did not update state"
    assert result.get("sceneChanged"), f"Scene change failed, caption={result.get('caption')}"
    assert result.get("menuOpened"), "Mobile menu did not open"
    assert result.get("menuClosed"), "Mobile menu did not close"
    assert result.get("helpOpen"), "Help panel did not open"
    assert result.get("helpClosed"), "Help panel did not close"
    assert result.get("pickerHasOptions"), "Part picker was not populated"
    assert result.get("hudActive"), "Selection HUD did not activate"
    assert result.get("semiOn"), "Selection did not enable semitransparent layer"
    assert result.get("isoOn"), "Selection did not enable isolate layer"
    assert result.get("fullscreenOk"), "Fullscreen button missing"
    print("OK: DOM interactions", result)


def test_screenshots():
    """Capture non-empty screenshots for key scenes and a narrow viewport."""
    chrome = chromium_path()
    if not chrome:
        raise RuntimeError("Chromium not found; run UX tests")

    scenes = ["room", "tower", "cabinet", "desk", "storage"]
    try:
        from PIL import Image
        have_pil = True
    except Exception:
        have_pil = False

    with tempfile.TemporaryDirectory(prefix=".ux-shot-", dir=ROOT) as tmp:
        folder = Path(tmp)
        outputs = []
        for scene in scenes:
            out = folder / f"{scene}.png"
            url = INDEX.as_uri() + "#" + scene
            subprocess.run(
                chrome_base()
                + [
                    "--window-size=1280,800",
                    f"--screenshot={out}",
                    url,
                ],
                capture_output=True, text=True, timeout=45, check=True,
            )
            assert out.exists() and out.stat().st_size > 2048, f"Empty screenshot for {scene}"
            if have_pil:
                im = Image.open(out)
                assert im.size == (1280, 800), f"Unexpected screenshot size for {scene}: {im.size}"
            outputs.append((scene, out.stat().st_size))

        mobile_out = folder / "mobile.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=390,844",
                f"--screenshot={mobile_out}",
                INDEX.as_uri() + "#room",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert mobile_out.exists() and mobile_out.stat().st_size > 2048, "Empty mobile screenshot"
        outputs.append(("mobile", mobile_out.stat().st_size))

    sizes = ", ".join(f"{s}={b//1024}KB" for s, b in outputs)
    print(f"OK: screenshots ({sizes})")


def main():
    if not chromium_path():
        print("SKIP: Chromium not available, cannot run R1 UX tests")
        return
    test_dom_interactions()
    test_screenshots()


if __name__ == "__main__":
    main()
