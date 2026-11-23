#!/usr/bin/env python3
"""R6 UX smoke tests: visual polish and technical information density.

Requires a Chromium-based browser in PATH.
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


def test_visual_polish_and_tech_density():
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
      const compactSidebar = !!$('.left.compact') || !!$('[data-compact-menu="true"]');
      const techDetails = !!$('#tech-details');
      const geomHelper = typeof window.towerGeometryInspection === 'function';
      const geomAlias = typeof window.towerInspect === 'function';
      const before = document.body.classList.contains('geometry-inspection');
      const activated = window.towerGeometryInspection(true) === true;
      await wait(120);
      const inspectionOn = document.body.classList.contains('geometry-inspection');
      const quoteOn = document.querySelector('[data-layer="quote"]') && document.querySelector('[data-layer="quote"]').getAttribute('aria-checked') === 'true';
      window.towerGeometryInspection(false);
      await wait(80);
      const inspectionOff = !document.body.classList.contains('geometry-inspection');
      // Selection still auto-isolates
      document.querySelector('[data-cam-preset="tower"]').click();
      await wait(150);
      const picker = $('#part-picker');
      const pickerHasOptions = picker.options.length > 1;
      let hudActive = false, semiOn = false, isoOn = false, viewportClasses = false, techVisible = false;
      if(pickerHasOptions){
        picker.value = picker.options[1].value;
        picker.dispatchEvent(new Event('change',{bubbles:true}));
        await wait(200);
        hudActive = $('#selection-hud').classList.contains('active');
        semiOn = document.querySelector('[data-layer="semitrasparente"]').getAttribute('aria-checked') === 'true';
        isoOn = document.querySelector('[data-layer="isola"]').getAttribute('aria-checked') === 'true';
        viewportClasses = $('#vp').classList.contains('isolate-active') && $('#vp').classList.contains('xray-active');
        const tech = $('#tech-details');
        techVisible = !!tech && !tech.hidden;
      }
      out.textContent = JSON.stringify({
        compactSidebar, techDetails, geomHelper, geomAlias,
        activated, inspectionOn, quoteOn, inspectionOff, before,
        pickerHasOptions, hudActive, semiOn, isoOn, viewportClasses, techVisible
      });
    }catch(err){
      out.textContent = JSON.stringify({error: err.message, stack: err.stack});
    }
  }
  run();
});
</script><pre id="ux-out"></pre>
"""
    with tempfile.TemporaryDirectory(prefix=".ux-r6-", dir=ROOT) as tmp:
        folder = Path(tmp)
        test_html = folder / "r6.html"
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
            capture_output=True, text=True, timeout=45, check=True,
        )
    result = _parse_out(proc.stdout)
    if "error" in result:
        raise AssertionError("R6 DOM test internal error: " + result["error"])
    assert result.get("compactSidebar"), "Compact sidebar not present"
    assert result.get("techDetails"), "Tech details block missing"
    assert result.get("geomHelper"), "Geometry inspection helper missing"
    assert result.get("geomAlias"), "Geometry inspection alias missing"
    assert result.get("activated"), "Geometry inspection did not activate"
    assert result.get("inspectionOn"), "Geometry inspection state missing"
    assert result.get("quoteOn"), "Geometry inspection did not enable quote layer"
    assert result.get("inspectionOff"), "Geometry inspection did not deactivate"
    assert result.get("pickerHasOptions"), "Part picker was not populated"
    assert result.get("hudActive"), "Selection HUD did not activate"
    assert result.get("semiOn"), "Selection did not enable semi-transparent layer"
    assert result.get("isoOn"), "Selection did not enable isolate layer"
    assert result.get("viewportClasses"), "Viewport isolate/xray classes missing"
    assert result.get("techVisible"), "Tech details not visible on selection"
    print("OK: R6 visual polish and tech density", result)


def test_r6_screenshots():
    chrome = chromium_path()
    if not chrome:
        raise RuntimeError("Chromium not found; cannot run R6 screenshots")

    with tempfile.TemporaryDirectory(prefix=".ux-r6-shot-", dir=ROOT) as tmp:
        folder = Path(tmp)
        outputs = []

        out = folder / "compact.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=1280,800",
                f"--screenshot={out}",
                INDEX.as_uri() + "?screenshot=1&cam=room",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert out.exists() and out.stat().st_size > 2048, "Empty compact screenshot"
        outputs.append(("compact", out.stat().st_size))

        out2 = folder / "inspect.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=1280,800",
                f"--screenshot={out2}",
                INDEX.as_uri() + "?screenshot=1&select=P1&cam=tower",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert out2.exists() and out2.stat().st_size > 2048, "Empty inspection screenshot"
        outputs.append(("inspect", out2.stat().st_size))

        mobile_out = folder / "mobile-r6.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=390,844",
                f"--screenshot={mobile_out}",
                INDEX.as_uri() + "?screenshot=1&cam=room",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert mobile_out.exists() and mobile_out.stat().st_size > 2048, "Empty mobile screenshot"
        outputs.append(("mobile", mobile_out.stat().st_size))

    sizes = ", ".join(f"{s}={b//1024}KB" for s, b in outputs)
    print(f"OK: R6 screenshots ({sizes})")


def main():
    if not chromium_path():
        print("SKIP: Chromium not available, cannot run R6 UX tests")
        return
    test_visual_polish_and_tech_density()
    test_r6_screenshots()


if __name__ == "__main__":
    main()