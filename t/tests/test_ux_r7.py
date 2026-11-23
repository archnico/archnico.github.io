#!/usr/bin/env python3
"""R7 UX regression smoke tests: all scenes, layers, console cleanliness, tooltips."""
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
        "--virtual-time-budget=5000",
    ]


def _parse_out(stdout):
    m = __import__("re").search(r'<pre id="ux-out">(.*?)</pre>', stdout, __import__("re").S)
    if not m:
        raise AssertionError("No UX test output rendered")
    return json.loads(html.unescape(m.group(1)))


def test_regression_sweep_and_tooltips():
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
      await wait(1200);
      const helper = typeof window.towerRegressionSweep === 'function';
      const result = helper ? await window.towerRegressionSweep() : {ok:false,scenes:[],totalErrors:1};
      const tooltipOk = window.towerTooltip && window.towerTooltip.show('r7', 12, 12) === true;
      window.towerTooltip.hide();
      const consoleClean = Array.isArray(window.towerConsoleErrors) && window.towerConsoleErrors.length === 0;
      const scenes = result.scenes || [];
      const allScenesOk = scenes.length > 0 && scenes.every(s => s.ok);
      out.textContent = JSON.stringify({
        helper, tooltipOk, consoleClean, allScenesOk,
        sceneCount: scenes.length, totalErrors: result.totalErrors || 0,
        consoleErrors: window.towerConsoleErrors || []
      });
    }catch(err){
      out.textContent = JSON.stringify({error: err.message, stack: err.stack});
    }
  }
  run();
});
</script><pre id="ux-out"></pre>
"""
    with tempfile.TemporaryDirectory(prefix=".ux-r7-", dir=ROOT) as tmp:
        folder = Path(tmp)
        test_html = folder / "r7.html"
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
            capture_output=True, text=True, timeout=90, check=True,
        )
    result = _parse_out(proc.stdout)
    if "error" in result:
        raise AssertionError("R7 DOM test internal error: " + result["error"])
    assert result.get("helper"), "Regression sweep helper missing"
    assert result.get("tooltipOk"), "Tooltip helper failed"
    assert result.get("consoleClean"), "Console errors detected: " + str(result.get("consoleErrors"))
    assert result.get("allScenesOk"), "Not all scene/layer combinations passed"
    print("OK: R7 regression sweep", result)


def test_r7_screenshots():
    chrome = chromium_path()
    if not chrome:
        raise RuntimeError("Chromium not found; cannot run R7 screenshots")

    scenes = ["room", "tower", "cabinet", "standalone", "desk", "storage", "thermal", "module", "rear", "ups"]
    with tempfile.TemporaryDirectory(prefix=".ux-r7-shot-", dir=ROOT) as tmp:
        folder = Path(tmp)
        outputs = []
        for scene in scenes:
            out = folder / f"{scene}.png"
            subprocess.run(
                chrome_base()
                + [
                    "--window-size=1280,800",
                    f"--screenshot={out}",
                    INDEX.as_uri() + f"?screenshot=1&scene={scene}&cam=room",
                ],
                capture_output=True, text=True, timeout=45, check=True,
            )
            assert out.exists() and out.stat().st_size > 1024, f"Empty screenshot for {scene}"
            outputs.append((scene, out.stat().st_size))
        mobile = folder / "mobile-r7.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=390,844",
                f"--screenshot={mobile}",
                INDEX.as_uri() + "?screenshot=1&scene=room&cam=room",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert mobile.exists() and mobile.stat().st_size > 1024, "Empty mobile screenshot"
    print("OK: R7 screenshots", len(outputs) + 1)


def main():
    if not chromium_path():
        print("SKIP: Chromium not available, cannot run R7 UX tests")
        return
    test_regression_sweep_and_tooltips()
    test_r7_screenshots()


if __name__ == "__main__":
    main()
