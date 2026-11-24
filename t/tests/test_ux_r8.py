#!/usr/bin/env python3
"""R8 UX smoke tests: final visual audit, feature notes and screenshot audit."""
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


def test_visual_audit_and_feature_notes():
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
      const auditFn = typeof window.towerVisualAudit === 'function';
      const auditAliases = ['towerAudit','towerFinalAudit','towerVisualAuditRun'].every(n => typeof window[n] === 'function');
      const notesFn = typeof window.towerFeatureNotes === 'function';
      const notesAliases = ['towerMorningNotes','towerNextMorningNotes'].every(n => typeof window[n] === 'function');
      const notes = notesFn ? window.towerFeatureNotes() : [];
      const result = auditFn ? await window.towerVisualAudit() : {ok:false,checks:[]};
      const modeOk = (function(){ window.towerVisualAudit({applyMode:true}); return document.body.classList.contains('visual-audit-mode'); })();
      const aliasResult = window.towerAudit ? window.towerAudit() : null;
      const consoleClean = Array.isArray(window.towerConsoleErrors) && window.towerConsoleErrors.length === 0;
      const checksOk = Array.isArray(result.checks) && result.checks.length > 0 && result.checks.every(c => c.ok);
      out.textContent = JSON.stringify({
        auditFn, auditAliases, notesFn, notesAliases,
        notesCount: Array.isArray(notes) ? notes.length : 0,
        auditOk: !!result.ok, checksOk, modeOk,
        aliasOk: !!(aliasResult && Array.isArray(aliasResult.checks)),
        consoleClean, totalErrors: (window.towerConsoleErrors || []).length
      });
    }catch(err){
      out.textContent = JSON.stringify({error: err.message, stack: err.stack});
    }
  }
  run();
});
</script><pre id="ux-out"></pre>
"""
    with tempfile.TemporaryDirectory(prefix=".ux-r8-", dir=ROOT) as tmp:
        folder = Path(tmp)
        test_html = folder / "r8.html"
        source = (
            INDEX.read_text()
            .replace('href="assets/viewer.css"', f'href="{CSS.as_uri()}"')
            .replace('src="assets/viewer.js"', f'src="{VIEWER.as_uri()}"')
            .replace('src="assets/viewer-enhancements.js"', f'src="{ENH.as_uri()}"')
            .replace("</body>", dom_script + "</body>")
        )
        test_html.write_text(source)
        proc = subprocess.run(
            chrome_base() + ["--dump-dom", test_html.as_uri() + "?audit=1"],
            capture_output=True, text=True, timeout=90, check=True,
        )
    result = _parse_out(proc.stdout)
    if "error" in result:
        raise AssertionError("R8 DOM test internal error: " + result["error"])
    assert result.get("auditFn"), "Visual audit helper missing"
    assert result.get("auditAliases"), "Visual audit aliases missing"
    assert result.get("notesFn"), "Feature notes helper missing"
    assert result.get("notesAliases"), "Feature notes aliases missing"
    assert (result.get("notesCount") or 0) > 0, "Feature notes empty"
    assert result.get("auditOk"), "Visual audit failed: " + str(result)
    assert result.get("checksOk"), "Visual audit checks failed"
    assert result.get("modeOk"), "Visual audit mode class missing"
    assert result.get("aliasOk"), "Visual audit alias failed"
    assert result.get("consoleClean"), "Console errors detected: " + str(result.get("totalErrors"))
    print("OK: R8 visual audit and feature notes", result)


def test_r8_screenshots():
    chrome = chromium_path()
    if not chrome:
        raise RuntimeError("Chromium not found; cannot run R8 screenshots")

    scenes = ["room", "tower", "cabinet", "standalone", "desk", "storage", "thermal", "module", "rear", "ups"]
    with tempfile.TemporaryDirectory(prefix=".ux-r8-shot-", dir=ROOT) as tmp:
        folder = Path(tmp)
        outputs = []
        for scene in scenes:
            out = folder / f"{scene}.png"
            subprocess.run(
                chrome_base()
                + [
                    "--window-size=1280,800",
                    f"--screenshot={out}",
                    INDEX.as_uri() + f"?screenshot=1&audit=1&scene={scene}&cam=room",
                ],
                capture_output=True, text=True, timeout=45, check=True,
            )
            assert out.exists() and out.stat().st_size > 1024, f"Empty screenshot for {scene}"
            outputs.append((scene, out.stat().st_size))
        mobile = folder / "mobile-r8.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=390,844",
                f"--screenshot={mobile}",
                INDEX.as_uri() + "?screenshot=1&audit=1&scene=room&cam=room",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert mobile.exists() and mobile.stat().st_size > 1024, "Empty mobile screenshot"
        audit_shot = folder / "audit-mode.png"
        subprocess.run(
            chrome_base()
            + [
                "--window-size=1280,800",
                f"--screenshot={audit_shot}",
                INDEX.as_uri() + "?audit=1&cam=tower",
            ],
            capture_output=True, text=True, timeout=45, check=True,
        )
        assert audit_shot.exists() and audit_shot.stat().st_size > 1024, "Empty audit screenshot"
    print("OK: R8 screenshots", len(outputs) + 2)


def main():
    if not chromium_path():
        print("SKIP: Chromium not available, cannot run R8 UX tests")
        return
    test_visual_audit_and_feature_notes()
    test_r8_screenshots()


if __name__ == "__main__":
    main()
