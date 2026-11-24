#!/usr/bin/env python3
"""R4 UX smoke tests: engineering status/blocker labels and screenshot mode.

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


def test_eng_status_and_screenshot_mode():
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
      // 1. Engineering blocker chips present
      const chips = document.querySelectorAll('.eng-chip');
      const blockerChips = chips.length;
      const hasApprovalChip = [...chips].some(c => (c.getAttribute('data-blocker')||'') === 'approval');
      const criticalCount = [...chips].filter(c => c.classList.contains('critical')).length;
      // 2. Screenshot mode class applied from URL
      const screenshotMode = document.body.classList.contains('screenshot-mode');
      // 3. Selection still works and auto-isolates
      document.querySelector('[data-cam-preset="tower"]').click();
      await wait(150);
      const picker = $('#part-picker');
      const pickerHasOptions = picker.options.length > 1;
      let selectionOk = false, hudActive = false, semiOn = false, isoOn = false, viewportClasses = false;
      if(pickerHasOptions){
        picker.value = picker.options[1].value;
        picker.dispatchEvent(new Event('change',{bubbles:true}));
        await wait(200);
        selectionOk = $('#inspector').hidden === false || true;
        hudActive = $('#selection-hud').classList.contains('active');
        semiOn = document.querySelector('[data-layer="semitrasparente"]').getAttribute('aria-checked') === 'true';
        isoOn = document.querySelector('[data-layer="isola"]').getAttribute('aria-checked') === 'true';
        viewportClasses = $('#vp').classList.contains('isolate-active') && $('#vp').classList.contains('xray-active');
      }
      // 4. Viewmark carries non-approval wording
      const viewmark = document.querySelector('.viewmark');
      const nonApproval = viewmark && /NON ESECUTIVO|NON APPROVATO/i.test(viewmark.textContent);
      out.textContent = JSON.stringify({
        blockerChips, hasApprovalChip, criticalCount, screenshotMode,
        pickerHasOptions, hudActive, semiOn, isoOn, viewportClasses, nonApproval
      });
    }catch(err){
      out.textContent = JSON.stringify({error: err.message, stack: err.stack});
    }
  }
  run();
});
</script><pre id="ux-out"></pre>
"""
    with tempfile.TemporaryDirectory(prefix=".ux-r4-", dir=ROOT) as tmp:
        folder = Path(tmp)
        test_html = folder / "r4.html"
        source = (
            INDEX.read_text()
            .replace('href="assets/viewer.css"', f'href="{CSS.as_uri()}"')
            .replace('src="assets/viewer.js"', f'src="{VIEWER.as_uri()}"')
            .replace('src="assets/viewer-enhancements.js"', f'src="{ENH.as_uri()}"')
            .replace("</body>", dom_script + "</body>")
        )
        test_html.write_text(source)
        proc = subprocess.run(
            chrome_base() + ["--dump-dom", test_html.as_uri() + "?screenshot=1"],
            capture_output=True, text=True, timeout=45, check=True,
        )
    result = _parse_out(proc.stdout)
    if "error" in result:
        raise AssertionError("R4 DOM test internal error: " + result["error"])
    assert result.get("blockerChips", 0) >= 9, f"Too few blocker chips: {result}"
    assert result.get("hasApprovalChip"), "Approval blocker chip missing"
    assert result.get("criticalCount", 0) >= 3, f"Too few critical chips: {result}"
    assert result.get("screenshotMode"), "Screenshot mode class not applied from URL"
    assert result.get("pickerHasOptions"), "Part picker was not populated"
    assert result.get("hudActive"), "Selection HUD did not activate"
    assert result.get("semiOn"), "Selection did not enable semi-transparent layer"
    assert result.get("isoOn"), "Selection did not enable isolate layer"
    assert result.get("viewportClasses"), "Viewport isolate/xray classes missing"
    assert result.get("nonApproval"), "Viewmark lacks non-approval wording"
    print("OK: R4 engineering status and screenshot mode", result)


def test_screenshot_mode_screenshots():
    chrome = chromium_path()
    if not chrome:
        raise RuntimeError("Chromium not found; cannot run R4 screenshots")

    with tempfile.TemporaryDirectory(prefix=".ux-r4-shot-", dir=ROOT) as tmp:
        folder = Path(tmp)
        outputs = []

        # Clean screenshot in screenshot mode.
        out = folder / "clean.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=1280,800",
                f"--screenshot={out}",
                INDEX.as_uri() + "?screenshot=1&cam=tower",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert out.exists() and out.stat().st_size > 2048, "Empty clean screenshot"
        outputs.append(("clean", out.stat().st_size))

        # Screenshot with a pre-selected part (isolate + semi-transparent).
        out2 = folder / "selected.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=1280,800",
                f"--screenshot={out2}",
                INDEX.as_uri() + "?screenshot=1&select=P1&cam=tower",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert out2.exists() and out2.stat().st_size > 2048, "Empty selected screenshot"
        outputs.append(("selected", out2.stat().st_size))

        # Mobile screenshot mode.
        mobile_out = folder / "mobile-clean.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=390,844",
                f"--screenshot={mobile_out}",
                INDEX.as_uri() + "?screenshot=1&cam=room",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert mobile_out.exists() and mobile_out.stat().st_size > 2048, "Empty mobile clean screenshot"
        outputs.append(("mobile-clean", mobile_out.stat().st_size))

    sizes = ", ".join(f"{s}={b//1024}KB" for s, b in outputs)
    print(f"OK: R4 screenshot-mode screenshots ({sizes})")


def main():
    if not chromium_path():
        print("SKIP: Chromium not available, cannot run R4 UX tests")
        return
    test_eng_status_and_screenshot_mode()
    test_screenshot_mode_screenshots()


if __name__ == "__main__":
    main()
