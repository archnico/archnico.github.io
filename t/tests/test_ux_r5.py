#!/usr/bin/env python3
"""R5 UX smoke tests: accessibility and mobile polish.

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


def test_accessibility_and_mobile():
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
      await wait(800);
      const menu = $('#menu-toggle');
      const fs = $('#fullscreen-btn');
      const help = $('#help-btn');
      const menuLabel = !!menu.getAttribute('aria-label');
      const fsLabel = !!fs.getAttribute('aria-label');
      const helpLabel = !!help.getAttribute('aria-label');
      const quickBtns = [...document.querySelectorAll('#quicktools button, #quicktools .quick')];
      const quickLabels = quickBtns.length > 0 && quickBtns.every(b => !!b.getAttribute('aria-label'));
      const minH = parseFloat(getComputedStyle(menu).minHeight);
      const touchTargetOk = !isNaN(minH) && minH >= 40;
      const qt = $('#quicktools');
      const r = qt.getBoundingClientRect();
      const toolbarFits = r.left >= -1 && r.right <= window.innerWidth + 1;
      // Focus restore after help dialog.
      help.focus();
      help.click();
      await wait(120);
      const close = $('#help-panel').querySelector('.close');
      if (close) close.click();
      await wait(120);
      const focusRestored = document.activeElement === help;
      // HUD has status role.
      const hudStatus = $('#selection-hud').getAttribute('role') === 'status';
      out.textContent = JSON.stringify({
        menuLabel, fsLabel, helpLabel, quickLabels, touchTargetOk, toolbarFits,
        focusRestored, hudStatus, quickCount: quickBtns.length, minH: minH
      });
    }catch(err){
      out.textContent = JSON.stringify({error: err.message, stack: err.stack});
    }
  }
  run();
});
</script><pre id="ux-out"></pre>
"""
    with tempfile.TemporaryDirectory(prefix=".ux-r5-", dir=ROOT) as tmp:
        folder = Path(tmp)
        test_html = folder / "r5.html"
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
        raise AssertionError("R5 DOM test internal error: " + result["error"])
    assert result.get("menuLabel"), "Menu toggle missing aria-label"
    assert result.get("fsLabel"), "Fullscreen button missing aria-label"
    assert result.get("helpLabel"), "Help button missing aria-label"
    assert result.get("quickLabels"), "Quicktools buttons missing aria-labels"
    assert result.get("touchTargetOk"), f"Touch target too small: {result.get('minH')}"
    assert result.get("toolbarFits"), "Quicktools toolbar clipped/out of viewport"
    assert result.get("focusRestored"), "Focus not restored after help dialog"
    assert result.get("hudStatus"), "Selection HUD missing status role"
    print("OK: R5 accessibility and mobile", result)


def test_accessibility_screenshots():
    chrome = chromium_path()
    if not chrome:
        raise RuntimeError("Chromium not found; cannot run R5 screenshots")

    with tempfile.TemporaryDirectory(prefix=".ux-r5-shot-", dir=ROOT) as tmp:
        folder = Path(tmp)
        outputs = []
        for vp_size, url in [
            ("1280,800", INDEX.as_uri() + "?screenshot=1&cam=room"),
            ("390,844", INDEX.as_uri() + "?screenshot=1&cam=tower"),
        ]:
            out = folder / f"{vp_size.replace(',','x')}.png"
            subprocess.run(
                chrome_base()
                + [
                    f"--window-size={vp_size}",
                    f"--screenshot={out}",
                    url,
                ],
                capture_output=True, text=True, timeout=45, check=True,
            )
            assert out.exists() and out.stat().st_size > 2048, f"Empty screenshot for {vp_size}"
            outputs.append((vp_size, out.stat().st_size))

    sizes = ", ".join(f"{s}={b//1024}KB" for s, b in outputs)
    print(f"OK: R5 accessibility screenshots ({sizes})")


def main():
    if not chromium_path():
        print("SKIP: Chromium not available, cannot run R5 UX tests")
        return
    test_accessibility_and_mobile()
    test_accessibility_screenshots()


if __name__ == "__main__":
    main()
