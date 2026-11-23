#!/usr/bin/env python3
"""R3 UX smoke tests: transparent / isolated selection modes.

Requires a Chromium-based browser in PATH. The tests exercise the UI-only
Round-3 pass (CSS classes, HUD, auto-isolate) without touching geometry.
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


def test_isolate_mode_and_hud():
    """Selection enables semi-transparent + isolate layers and shows the HUD."""
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
      // Start in tower view where many parts are selectable.
      document.querySelector('[data-cam-preset="tower"]').click();
      await wait(150);
      // Select the first available part from the picker.
      const picker = $('#part-picker');
      const pickerHasOptions = picker.options.length > 1;
      let selectionOk = false, hudActive = false, semiOn = false, isoOn = false, viewportIsoClass = false;
      if(pickerHasOptions){
        picker.value = picker.options[1].value;
        picker.dispatchEvent(new Event('change',{bubbles:true}));
        await wait(200);
        selectionOk = $('#inspector').hidden === false;
        hudActive = $('#selection-hud').classList.contains('active');
        semiOn = document.querySelector('[data-layer="semitrasparente"]').getAttribute('aria-checked') === 'true';
        isoOn = document.querySelector('[data-layer="isola"]').getAttribute('aria-checked') === 'true';
        viewportIsoClass = $('#vp').classList.contains('isolate-active') && $('#vp').classList.contains('xray-active');
      }
      // Manual toggle of isolate should update viewport class.
      const isoSwitch = document.querySelector('[data-layer="isola"]');
      if(isoSwitch.getAttribute('aria-checked') === 'true') isoSwitch.click();
      await wait(80);
      const viewportIsoOff = !$('#vp').classList.contains('isolate-active');
      out.textContent = JSON.stringify({
        pickerHasOptions, selectionOk, hudActive, semiOn, isoOn,
        viewportIsoClass, viewportIsoOff,
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
    with tempfile.TemporaryDirectory(prefix=".ux-r3-", dir=ROOT) as tmp:
        folder = Path(tmp)
        test_html = folder / "r3.html"
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
        raise AssertionError("R3 DOM test internal error: " + result["error"])
    assert result.get("pickerHasOptions"), "Part picker was not populated"
    assert result.get("selectionOk"), "Selection did not open the inspector"
    assert result.get("hudActive"), "Selection HUD did not activate"
    assert result.get("semiOn"), "Selection did not enable semi-transparent layer"
    assert result.get("isoOn"), "Selection did not enable isolate layer"
    assert result.get("viewportIsoClass"), "Viewport did not get isolate/xray active classes"
    assert result.get("viewportIsoOff"), "Viewport isolate class did not clear when toggled off"
    print("OK: R3 isolate mode and HUD", result)


def test_isolate_screenshots():
    """Capture non-empty screenshots in isolate/semi-transparent states."""
    chrome = chromium_path()
    if not chrome:
        raise RuntimeError("Chromium not found; cannot run R3 screenshots")

    with tempfile.TemporaryDirectory(prefix=".ux-r3-shot-", dir=ROOT) as tmp:
        folder = Path(tmp)
        outputs = []

        # Desktop: select a part and capture isolate view.
        out = folder / "isolate.png"
        url = INDEX.as_uri() + "?cam=tower"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=1280,800",
                f"--screenshot={out}",
                url,
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert out.exists() and out.stat().st_size > 2048, "Empty isolate screenshot"
        outputs.append(("isolate", out.stat().st_size))

        # Render with a part pre-selected so isolate/semi are active.
        test_html = folder / "forced.html"
        dom_script = r"""
<script>
window.addEventListener('load', () => {
  setTimeout(() => {
    const picker = document.getElementById('part-picker');
    if(picker && picker.options.length > 1){
      picker.value = picker.options[1].value;
      picker.dispatchEvent(new Event('change',{bubbles:true}));
    }
  }, 600);
});
</script>
"""
        source = (
            INDEX.read_text()
            .replace('href="assets/viewer.css"', f'href="{CSS.as_uri()}"')
            .replace('src="assets/viewer.js"', f'src="{VIEWER.as_uri()}"')
            .replace('src="assets/viewer-enhancements.js"', f'src="{ENH.as_uri()}"')
            .replace("</body>", dom_script + "</body>")
        )
        test_html.write_text(source)
        out2 = folder / "forced-isolate.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=1280,800",
                f"--screenshot={out2}",
                test_html.as_uri(),
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert out2.exists() and out2.stat().st_size > 2048, "Empty forced isolate screenshot"
        outputs.append(("forced-isolate", out2.stat().st_size))

        # Mobile isolate view.
        mobile_out = folder / "mobile-isolate.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=390,844",
                f"--screenshot={mobile_out}",
                INDEX.as_uri() + "?cam=tower",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert mobile_out.exists() and mobile_out.stat().st_size > 2048, "Empty mobile isolate screenshot"
        outputs.append(("mobile-isolate", mobile_out.stat().st_size))

    sizes = ", ".join(f"{s}={b//1024}KB" for s, b in outputs)
    print(f"OK: R3 isolate screenshots ({sizes})")


def main():
    if not chromium_path():
        print("SKIP: Chromium not available, cannot run R3 UX tests")
        return
    test_isolate_mode_and_hud()
    test_isolate_screenshots()


if __name__ == "__main__":
    main()
