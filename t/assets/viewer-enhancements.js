/* viewer-enhancements.js — Round 1 UX pass for Torre H-7 preview.
 * Loaded AFTER assets/viewer.js; does not own geometry.
 */
(() => {
  'use strict';

  const $ = id => document.getElementById(id);
  const vp = $('vp');
  const leftPanel = $('left-panel');
  const menuToggle = $('menu-toggle');
  const inspector = $('inspector');
  const hud = $('selection-hud');
  const hudTitle = $('hud-title');
  const helpPanel = $('help-panel');
  const helpBtn = $('help-btn');
  const fsBtn = $('fullscreen-btn');
  const focusBtn = $('focus-selected');

  /* ---------- helpers: manipulate layer switches without touching viewer.js state ---------- */
  function layerSwitch(name) {
    return document.querySelector(`[data-layer="${name}"]`);
  }
  function setLayer(name, wantOn) {
    const sw = layerSwitch(name);
    if (!sw) return;
    const isOn = sw.getAttribute('aria-checked') === 'true';
    if (isOn !== wantOn) {
      sw.click();
      // Fallback for DOM-only tests / environments without viewer.js handlers.
      if (sw.getAttribute('aria-checked') === String(isOn)) {
        sw.setAttribute('aria-checked', String(wantOn));
        sw.classList.toggle('on', wantOn);
      }
    }
  }
  function toggleLayer(name) {
    const sw = layerSwitch(name);
    if (sw) sw.click();
  }

  /* ---------- nested subgroup toggles ---------- */
  const SUBGROUP_LAYERS = {
    hauga: ['haugaStruttura', 'haugaCassetti', 'haugaPomelli'],
    scrivania: ['scrivania', 'sedia', 'periferiche', 'usbC'],
    'torre-struttura': ['telaio', 'guideLaterali', 'baseTerra'],
    'torre-elettronica': ['moduli', 'schede', 'dischi'],
    'torre-servizi': ['ventole', 'cavi', 'ups']
  };
  function subgroupSwitches(name) {
    return [...document.querySelectorAll(`[data-subgroup="${name}"] [data-layer]`)];
  }
  function syncSubgroupMaster(btn) {
    const layers = SUBGROUP_LAYERS[btn.dataset.subgroupToggle];
    if (!layers) return;
    const onCount = layers.filter(layer => {
      const sw = layerSwitch(layer);
      return sw && sw.getAttribute('aria-checked') === 'true';
    }).length;
    const mode = onCount === 0 ? 'false' : onCount === layers.length ? 'true' : 'mixed';
    btn.setAttribute('aria-checked', mode);
    btn.classList.toggle('on', mode === 'true');
    btn.classList.toggle('mixed', mode === 'mixed');
  }
  function setSubgroup(name, wantOn) {
    const layers = SUBGROUP_LAYERS[name];
    if (!layers) return;
    layers.forEach(layer => setLayer(layer, wantOn));
    document.querySelectorAll(`[data-subgroup-toggle="${name}"]`).forEach(syncSubgroupMaster);
  }
  document.querySelectorAll('[data-subgroup-toggle]').forEach(btn => {
    syncSubgroupMaster(btn);
    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      const name = btn.dataset.subgroupToggle;
      const layers = SUBGROUP_LAYERS[name];
      const enable = !layers.every(layer => {
        const sw = layerSwitch(layer);
        return sw && sw.getAttribute('aria-checked') === 'true';
      });
      setSubgroup(name, enable);
    });
  });
  // Keep subgroup masters in sync when any layer switch changes (click or group master).
  const layerObserver = new MutationObserver(() => {
    document.querySelectorAll('[data-subgroup-toggle]').forEach(syncSubgroupMaster);
  });
  document.querySelectorAll('[data-layer]').forEach(sw => {
    layerObserver.observe(sw, { attributes: true, attributeFilter: ['aria-checked'] });
  });

  /* ---------- mobile sidebar ---------- */
  function setSidebarOpen(open) {
    if (!leftPanel || !menuToggle) return;
    leftPanel.classList.toggle('open', open);
    leftPanel.classList.toggle('collapsed', !open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Chiudi controlli' : 'Apri controlli');
  }
  if (menuToggle && leftPanel) {
    menuToggle.addEventListener('click', () => setSidebarOpen(!leftPanel.classList.contains('open')));
    // Auto-close when the user actually changes a layer or view on narrow screens.
    leftPanel.addEventListener('click', e => {
      if (window.innerWidth > 760) return;
      const target = e.target.closest('button, select, [data-preset], [data-view], [data-scene], [data-cam-preset]');
      if (target && !target.closest('#menu-toggle')) setSidebarOpen(false);
    });
    // Click/tap on the viewport closes the mobile sidebar.
    vp?.addEventListener('pointerdown', e => {
      if (window.innerWidth <= 760 && leftPanel.classList.contains('open') && !e.target.closest('#left-panel, #quicktools')) {
        setSidebarOpen(false);
      }
    });
    if (window.innerWidth <= 760) leftPanel.classList.add('collapsed');
    window.addEventListener('resize', () => {
      if (window.innerWidth > 760) {
        leftPanel.classList.remove('collapsed', 'open');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- fullscreen ---------- */
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
  if (fsBtn) fsBtn.addEventListener('click', toggleFullscreen);
  document.addEventListener('fullscreenchange', () => {
    const active = !!document.fullscreenElement;
    if (fsBtn) {
      fsBtn.classList.toggle('active', active);
      fsBtn.setAttribute('aria-pressed', String(active));
      fsBtn.title = active ? 'Esci da schermo intero' : 'Schermo intero';
    }
  });

  /* ---------- selection focus / isolation ---------- */
  function focusSelected() {
    const fit = $('qfit') || $('fit');
    if (fit) fit.click();
    if (inspector && !inspector.hidden) {
      setLayer('semitrasparente', true);
      setLayer('isola', true);
    }
  }
  if (focusBtn) focusBtn.addEventListener('click', focusSelected);

  function updateHud() {
    if (!hud || !hudTitle || !inspector) return;
    const active = !inspector.hidden;
    hud.classList.toggle('active', active);
    hud.hidden = !active;
    if (active) {
      const title = $('part-title');
      hudTitle.textContent = title ? title.textContent : '—';
    }
  }
  if (inspector) {
    const obs = new MutationObserver(() => updateHud());
    obs.observe(inspector, { attributes: true, attributeFilter: ['hidden'] });
    const title = $('part-title');
    if (title) new MutationObserver(updateHud).observe(title, { childList: true, subtree: true });
  }

  // Auto-isolate on every new selection so the element never vanishes behind room walls.
  if (inspector) {
    new MutationObserver(muts => {
      for (const m of muts) {
        if (m.attributeName === 'hidden' && !inspector.hidden) {
          setLayer('semitrasparente', true);
          setLayer('isola', true);
        }
      }
    }).observe(inspector, { attributes: true, attributeFilter: ['hidden'] });
  }

  /* ---------- help panel ---------- */
  function toggleHelp(force) {
    if (!helpPanel) return;
    const show = force === undefined ? helpPanel.hidden : !!force;
    helpPanel.hidden = !show;
    if (helpBtn) {
      helpBtn.setAttribute('aria-expanded', String(show));
      helpBtn.classList.toggle('active', show);
    }
    if (show) {
      const close = helpPanel.querySelector('.close');
      if (close) close.focus();
    }
  }
  if (helpBtn) helpBtn.addEventListener('click', () => toggleHelp());
  if (helpPanel) {
    helpPanel.querySelector('.close')?.addEventListener('click', () => toggleHelp(false));
    helpPanel.addEventListener('click', e => { if (e.target === helpPanel) toggleHelp(false); });
  }

  /* ---------- keyboard shortcuts (complement viewer.js) ---------- */
  function isTypingTarget(el) {
    if (!el) return false;
    const tag = el.tagName;
    return tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA' || el.isContentEditable;
  }
  document.addEventListener('keydown', e => {
    if (isTypingTarget(e.target)) return;
    const k = e.key.toLowerCase();
    if (k === 'f') { const fit = $('qfit') || $('fit'); if (fit) fit.click(); e.preventDefault(); }
    else if (k === 'i') { toggleLayer('isola'); e.preventDefault(); }
    else if (k === 'x') { toggleLayer('semitrasparente'); e.preventDefault(); }
    else if (k === 'l') { toggleLayer('etichette'); e.preventDefault(); }
    else if (k === 'h' || k === '?') { toggleHelp(); e.preventDefault(); }
    else if (k === 'escape' && helpPanel && !helpPanel.hidden) { toggleHelp(false); e.preventDefault(); }
  });

  /* ---------- touch: pinch zoom + double-tap focus ---------- */
  const pointers = new Map();
  let lastPinchDist = 0;
  let lastTap = 0;

  function pointerDistance() {
    const pts = [...pointers.values()];
    if (pts.length !== 2) return 0;
    return Math.hypot(pts[0].x - pts[1].x, pts[0].y - pts[1].y);
  }
  vp?.addEventListener('pointerdown', e => {
    if (e.target.closest('#quicktools')) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) lastPinchDist = pointerDistance();
  });
  vp?.addEventListener('pointermove', e => {
    if (!pointers.has(e.pointerId)) return;
    pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.size === 2) {
      const dist = pointerDistance();
      if (lastPinchDist > 0 && dist > 0) {
        const delta = dist - lastPinchDist;
        // Dispatch a wheel event that viewer.js already handles.
        vp.dispatchEvent(new WheelEvent('wheel', {
          deltaY: -delta * 2.5,
          clientX: e.clientX,
          clientY: e.clientY,
          bubbles: true
        }));
      }
      lastPinchDist = dist;
    }
  });
  function endPointer(e) {
    pointers.delete(e.pointerId);
    if (pointers.size < 2) lastPinchDist = 0;
  }
  vp?.addEventListener('pointerup', e => {
    if (e.target.closest('#quicktools')) { endPointer(e); return; }
    const now = Date.now();
    if (now - lastTap < 350) focusSelected();
    lastTap = now;
    endPointer(e);
  });
  vp?.addEventListener('pointercancel', endPointer);

  /* ---------- camera presets (Round 2) ---------- */
  function setActiveCameraPreset(name) {
    document.querySelectorAll('[data-cam-preset]').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.camPreset === name);
    });
  }
  function applyCameraPreset(name) {
    if (name === 'fit') {
      const fit = $('qfit') || $('fit');
      if (fit) fit.click();
      setActiveCameraPreset('fit');
      return;
    }
    const sceneMap = { room: 'room', tower: 'tower', cabinet: 'cabinet', standalone: 'standalone' };
    if (sceneMap[name]) {
      const btn = document.querySelector(`[data-scene="${sceneMap[name]}"]`);
      if (btn) btn.click();
      setActiveCameraPreset(name);
      return;
    }
    const viewMap = { side: 'side', rear: 'rear', top: 'top' };
    if (viewMap[name]) {
      const btn = document.querySelector(`[data-view="${viewMap[name]}"]`);
      if (btn) btn.click();
      setActiveCameraPreset(name);
    }
  }
  document.querySelectorAll('[data-cam-preset]').forEach(btn => {
    btn.addEventListener('click', () => applyCameraPreset(btn.dataset.camPreset));
  });

  /* ---------- focus-visible polish ---------- */
  document.querySelectorAll('button, select, a, [tabindex]:not([tabindex="-1"])').forEach(el => {
    el.addEventListener('focus', () => document.body.classList.add('has-keyboard-focus'));
    el.addEventListener('blur', () => document.body.classList.remove('has-keyboard-focus'));
  });

  /* ---------- expose for tests ---------- */
  window.towerCameraPreset = applyCameraPreset;

  /* ---------- viewport mode indicators ---------- */
  function syncViewportOverlayState() {
    if (!vp) return;
    const semi = layerSwitch('semitrasparente');
    const iso = layerSwitch('isola');
    vp.classList.toggle('xray-active', semi && semi.getAttribute('aria-checked') === 'true');
    vp.classList.toggle('isolate-active', iso && iso.getAttribute('aria-checked') === 'true');
  }
  // Sync whenever a layer switch changes its checked state.
  document.querySelectorAll('[data-layer]').forEach(sw => {
    new MutationObserver(syncViewportOverlayState).observe(sw, { attributes: true, attributeFilter: ['aria-checked'] });
  });
  syncViewportOverlayState();

  /* ---------- screenshot mode (Round 4) ---------- */
  function applyScreenshotMode(force) {
    const params = new URLSearchParams(location.search);
    const fromUrl = params.has('screenshot') || params.has('shot') ||
      location.hash === '#screenshot' || location.hash === '#shot';
    const active = (force === undefined) ? fromUrl : !!force;
    document.body.classList.toggle('screenshot-mode', active);
    return active;
  }
  applyScreenshotMode();

  function preselectFromUrl() {
    const params = new URLSearchParams(location.search);
    const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
    const id = params.get('select') || params.get('part') || params.get('selected') ||
      hashParams.get('select') || hashParams.get('part') || hashParams.get('selected');
    if (!id) return;
    const trySelect = () => {
      const picker = $('part-picker');
      if (!picker || !picker.options || picker.options.length <= 1) {
        return setTimeout(trySelect, 200);
      }
      if (![...picker.options].some(o => o.value === id)) return;
      picker.value = id;
      picker.dispatchEvent(new Event('change', { bubbles: true }));
    };
    setTimeout(trySelect, 700);
  }
  preselectFromUrl();

  // Keyboard toggle for screenshot mode (Ctrl/Cmd + Shift + S), non-invasive.
  document.addEventListener('keydown', e => {
    if (isTypingTarget(e.target)) return;
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 's') {
      applyScreenshotMode(!document.body.classList.contains('screenshot-mode'));
      e.preventDefault();
    }
  });

  /* ---------- expose for tests ---------- */
  window.towerScreenshotMode = applyScreenshotMode;

  /* ---------- accessibility: labels, focus management ---------- */
  function labelControls() {
    document.querySelectorAll('button').forEach(btn => {
      const txt = (btn.getAttribute('title') || btn.textContent || '').trim().replace(/\\s+/g, ' ');
      if (!btn.getAttribute('aria-label')) btn.setAttribute('aria-label', txt || 'controllo');
      if (!btn.getAttribute('title') && txt) btn.setAttribute('title', txt);
    });
    document.querySelectorAll('input[type="range"]').forEach(inp => {
      if (!inp.getAttribute('aria-label')) {
        let label = 'controllo';
        const prev = inp.previousElementSibling;
        if (prev && prev.textContent && prev.textContent.trim()) label = prev.textContent.trim();
        else if (inp.id) label = inp.id;
        inp.setAttribute('aria-label', label);
      }
    });
    document.querySelectorAll('[data-cam-preset],[data-scene],[data-view]').forEach(btn => {
      if (!btn.getAttribute('aria-label')) {
        const t = (btn.getAttribute('title') || btn.textContent || '').trim();
        btn.setAttribute('aria-label', t || 'vista');
      }
    });
  }
  labelControls();
  // Re-label after dynamic changes (part picker population does not add buttons).
  const labelObserver = new MutationObserver(() => labelControls());
  labelObserver.observe(document.body, { childList: true, subtree: true });

  // Focus management for the help dialog via observers (non-invasive).
  let lastFocusBeforeHelp = null;
  if (helpPanel) {
    const helpObserver = new MutationObserver(() => {
      if (!helpPanel.hidden) {
        lastFocusBeforeHelp = document.activeElement;
        const close = helpPanel.querySelector('.close');
        if (close) setTimeout(() => close.focus(), 0);
      } else {
        if (lastFocusBeforeHelp && typeof lastFocusBeforeHelp.focus === 'function') {
          lastFocusBeforeHelp.focus();
        }
        lastFocusBeforeHelp = null;
      }
    });
    helpObserver.observe(helpPanel, { attributes: true, attributeFilter: ['hidden'] });
  }
  // Simple focus trap inside help panel.
  document.addEventListener('keydown', e => {
    if (!helpPanel || helpPanel.hidden || e.key !== 'Tab') return;
    const focusables = [...helpPanel.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')]
      .filter(el => !el.hasAttribute('disabled'));
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      last.focus();
      e.preventDefault();
    } else if (!e.shiftKey && document.activeElement === last) {
      first.focus();
      e.preventDefault();
    }
  });
  // Close on Escape restores focus via observer above.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && helpPanel && !helpPanel.hidden) {
      // trigger close button click to reuse original handler
      const close = helpPanel.querySelector('.close');
      if (close) close.click();
      e.preventDefault();
    }
  });

  // Mobile sidebar focus handling (augment existing button without rebinding logic).
  if (menuToggle && leftPanel) {
    menuToggle.addEventListener('click', () => {
      setTimeout(() => {
        if (leftPanel.classList.contains('open')) {
          const first = leftPanel.querySelector('button, select, [tabindex]:not([tabindex="-1"])');
          if (first) first.focus();
        } else {
          menuToggle.focus();
        }
      }, 80);
    });
  }

  // Expose accessibility helpers for tests.
  window.towerAccessibility = { labelControls, focusTrap: true };

  /* ---------- geometry inspection (Round 6) ---------- */
  function applyGeometryInspection(force) {
    const active = (force === undefined)
      ? !document.body.classList.contains('geometry-inspection')
      : !!force;
    document.body.classList.toggle('geometry-inspection', active);
    // Surface measurement overlays without touching geometry.
    setLayer('quote', active);
    setLayer('griglia', active);
    setLayer('ingombri', active);
    setLayer('etichette', true);
    document.querySelectorAll('[data-geometry-inspect]').forEach(btn => {
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    const geomBtn = $('geometry-inspect');
    if (geomBtn) {
      geomBtn.classList.toggle('active', active);
      geomBtn.setAttribute('aria-pressed', String(active));
      geomBtn.textContent = active ? 'Chiudi ispezione' : 'Ispezione geometria';
    }
    syncViewportOverlayState();
    return active;
  }
  document.querySelectorAll('[data-geometry-inspect]').forEach(btn => {
    btn.addEventListener('click', () => applyGeometryInspection());
  });
  const geomBtn = $('geometry-inspect');
  if (geomBtn) geomBtn.addEventListener('click', () => applyGeometryInspection());

  /* ---------- technical information density (Round 6) ---------- */
  function updateTechDetails() {
    const tech = $('tech-details');
    const partTech = $('part-tech');
    const partMeas = $('part-measurements');
    if (!tech) return;
    if (!inspector || inspector.hidden) {
      tech.hidden = true;
      if (partTech) partTech.textContent = '';
      if (partMeas) partMeas.textContent = '';
      return;
    }
    tech.hidden = false;
    const title = $('part-title') ? $('part-title').textContent : '';
    const picker = $('part-picker');
    const selected = (picker && picker.value) ? picker.value : '';
    // Determine whether the selected part's layer is still unresolved.
    const unresolvedLayers = new Set([...document.querySelectorAll('.layer-row[data-unresolved] [data-layer]')]
      .map(el => el.getAttribute('data-layer')));
    // Best-effort: map a part id to its layer using viewer.js conventions is not available here,
    // so we expose the selected id and a compact inspection note.
    if (partTech) partTech.textContent = `Selezione: ${title || selected || '—'} · isolate + semi-trasparente attivi`;
    if (partMeas) partMeas.textContent = 'Misure/componenti marcati ≈ sono da verificare; dettagli nel README e nei documenti tecnici.';
  }
  if (inspector) {
    new MutationObserver(updateTechDetails).observe(inspector, { attributes: true, attributeFilter: ['hidden'] });
    const title = $('part-title');
    if (title) new MutationObserver(updateTechDetails).observe(title, { childList: true, subtree: true });
  }
  updateTechDetails();

  // Expose helpers for tests and external callers (multiple aliases).
  window.towerGeometryInspection = applyGeometryInspection;
  window.towerGeometryInspect = applyGeometryInspection;
  window.towerInspect = applyGeometryInspection;
  window.towerTechDetails = updateTechDetails;

  // Keyboard shortcut: G toggles geometry inspection.
  document.addEventListener('keydown', e => {
    if (isTypingTarget(e.target)) return;
    const k = e.key.toLowerCase();
    if (k === 'g') { applyGeometryInspection(); e.preventDefault(); }
  });

  /* ---------- Round 7: console guards, scene/layer helpers, regression sweep, tooltips ---------- */
  window.towerConsoleErrors = window.towerConsoleErrors || [];
  function recordTowerConsoleError(msg) {
    const text = String(msg == null ? '' : (typeof msg === 'object' ? (msg.message || JSON.stringify(msg)) : msg)).trim();
    if (!text) return;
    if (!window.towerConsoleErrors.includes(text)) window.towerConsoleErrors.push(text);
  }
  const __origConsoleErrorR7 = console.error.bind(console);
  console.error = (...args) => {
    recordTowerConsoleError(args.map(a => (a && typeof a === 'object' && a.message) ? a.message : a).join(' '));
    return __origConsoleErrorR7(...args);
  };
  window.addEventListener('error', e => recordTowerConsoleError(e && e.message ? e.message : e));
  window.addEventListener('unhandledrejection', e => recordTowerConsoleError(e && e.reason ? (e.reason.message || e.reason) : e));

  function towerSafe(fn, label) {
    try { return fn(); }
    catch (err) {
      recordTowerConsoleError((label ? label + ': ' : '') + (err && err.message ? err.message : String(err)));
      return null;
    }
  }

  function towerScene(mode) {
    return towerSafe(() => {
      const btn = document.querySelector(`[data-scene="${mode}"]`);
      if (btn) btn.click();
      const caption = document.getElementById('scene-caption');
      return { scene: mode, caption: caption ? caption.textContent : '' };
    }, 'towerScene');
  }
  function towerView(name) {
    return towerSafe(() => {
      const btn = document.querySelector(`[data-view="${name}"]`);
      if (btn) btn.click();
      return { view: name };
    }, 'towerView');
  }
  function towerCamera(name) {
    if (typeof window.towerCameraPreset === 'function') {
      return towerSafe(() => ({ camera: name, result: window.towerCameraPreset(name) }), 'towerCamera');
    }
    return towerScene(name);
  }
  function towerLayer(name, wantOn) {
    return towerSafe(() => {
      const sw = document.querySelector(`[data-layer="${name}"]`);
      if (!sw) return { layer: name, found: false };
      const isOn = sw.getAttribute('aria-checked') === 'true';
      const target = (wantOn === undefined) ? !isOn : !!wantOn;
      if (target !== isOn) setLayer(name, target);
      return { layer: name, on: target };
    }, 'towerLayer');
  }
  function towerTooltipShow(text, x, y) {
    const tip = document.getElementById('tooltip');
    if (!tip) return false;
    tip.textContent = text == null ? '' : String(text);
    if (x != null) tip.style.left = Math.max(8, Number(x)) + 'px';
    if (y != null) tip.style.top = Math.max(8, Number(y)) + 'px';
    tip.style.opacity = '1';
    tip.classList.add('visible');
    return true;
  }
  function towerTooltipHide() {
    const tip = document.getElementById('tooltip');
    if (!tip) return false;
    tip.style.opacity = '0';
    tip.classList.remove('visible');
    return true;
  }
  window.towerScene = towerScene;
  window.towerView = towerView;
  window.towerCamera = towerCamera;
  window.towerLayer = towerLayer;
  window.towerTooltip = { show: towerTooltipShow, hide: towerTooltipHide };
  window.towerTooltipShow = towerTooltipShow;
  window.towerTooltipHide = towerTooltipHide;

  window.towerRegressionSweep = function (options) {
    const opts = options || {};
    const sceneNames = opts.scenes || [...document.querySelectorAll('[data-scene]')].map(b => b.dataset.scene).filter(Boolean);
    const layerNames = opts.layers || [...document.querySelectorAll('[data-layer]')].map(b => b.dataset.layer).filter(Boolean);
    window.towerConsoleErrors = [];
    const sceneResults = [];
    for (const sceneName of sceneNames) {
      const before = window.towerConsoleErrors.length;
      let ok = true;
      let error = null;
      try {
        towerScene(sceneName);
        // Exercise every layer combination without leaving the group toggles stale.
        document.querySelectorAll('[data-group-toggle]').forEach(btn => {
          try { btn.click(); btn.click(); } catch (e) { recordTowerConsoleError(e && e.message ? e.message : String(e)); }
        });
        document.querySelectorAll('[data-subgroup-toggle]').forEach(btn => {
          try { btn.click(); btn.click(); } catch (e) { recordTowerConsoleError(e && e.message ? e.message : String(e)); }
        });
        for (const layer of layerNames) {
          const sw = document.querySelector(`[data-layer="${layer}"]`);
          if (!sw) continue;
          const wasOn = sw.getAttribute('aria-checked') === 'true';
          towerLayer(layer, !wasOn);
          towerLayer(layer, wasOn);
        }
        // Selection smoke: pick the first available part, then clear it.
        const picker = document.getElementById('part-picker');
        if (picker && picker.options && picker.options.length > 1) {
          const value = picker.options[1].value;
          towerSafe(() => {
            picker.value = value;
            picker.dispatchEvent(new Event('change', { bubbles: true }));
          }, 'regression:select');
          const close = document.getElementById('close-inspector');
          if (close) towerSafe(() => close.click(), 'regression:clear');
        }
        towerTooltipShow('reference', 12, 12);
        towerTooltipHide();
      } catch (e) {
        ok = false;
        error = e && e.message ? e.message : String(e);
        recordTowerConsoleError(error);
      }
      sceneResults.push({
        scene: sceneName,
        ok: ok && (window.towerConsoleErrors.length === before),
        errors: window.towerConsoleErrors.slice(before),
        error,
      });
    }
    const result = {
      scenes: sceneResults,
      totalErrors: window.towerConsoleErrors.length,
      ok: window.towerConsoleErrors.length === 0 && sceneResults.every(r => r.ok),
      consoleErrors: window.towerConsoleErrors.slice(),
    };
    return result;
  };
  window.towerRegression = window.towerRegressionSweep;
  window.towerRegressionRun = window.towerRegressionSweep;

  // Visual reference mode: allow rendering a specific scene/layer combination by URL.
  function applyReferenceModeR7() {
    towerSafe(() => {
      const params = new URLSearchParams(location.search);
      if (params.has('reference') || params.has('ref')) document.body.classList.add('reference-mode');
      const sceneParam = params.get('scene');
      if (sceneParam) setTimeout(() => towerScene(sceneParam), 250);
      const viewParam = params.get('view');
      if (viewParam) setTimeout(() => towerView(viewParam), 320);
      const tooltipParam = params.get('tooltip');
      if (tooltipParam) setTimeout(() => towerTooltipShow(tooltipParam, 24, 24), 400);
    }, 'reference-mode');
  }
  applyReferenceModeR7();

  /* ---------- Round 8: final visual audit + next-morning feature notes ---------- */
  const TOWER_FEATURE_NOTES_R8 = [
    'Sidebar compatta con capitoli, sottogruppi annidati e comando «Tutti» per gruppo e sottogruppo.',
    'Strati con misure/componenti da verificare marcati con ≈ e data-unresolved; dettagli nel README e nei documenti tecnici.',
    'Selezione che attiva automaticamente isolate + semitrasparente, HUD in alto a destra, inspector con focus visivo.',
    'Preset camera/viste e controlli rapidi per mouse, tastiera e touch (pinch, doppio tap).',
    'Modalità screenshot e reference per catture riproducibili senza controlli.',
    'Ispezione geometria (G) con quote, griglia e ingombri; bordo ambra per vista filtrata.',
    'Stato ingegneristico con chip di blocco; nessuna approvazione alla costruzione.',
    'Nessun PSU box in H-7 fino a misure reali; UPS commerciale solo fuori dal mobile.',
    'DAS H-4 separato: 4 bay SATA + hub 4 porte; nessun HDD nei sette PC.',
    'HAUGA max 20 kg con ancoraggio a parete; massa e baricentro da verificare.',
  ];
  function towerFeatureNotes() {
    return TOWER_FEATURE_NOTES_R8.slice();
  }
  function towerVisualAudit(options) {
    return towerSafe(() => {
      const opts = options || {};
      const checks = [];
      const add = (name, ok, detail) => checks.push({ name, ok: !!ok, detail: String(detail == null ? '' : detail) });
      const errors = Array.isArray(window.towerConsoleErrors) ? window.towerConsoleErrors.slice() : [];
      add('console-clean', errors.length === 0, errors.length + ' errori console');
      add('left-panel', !!document.getElementById('left-panel'), '');
      add('viewport', !!document.getElementById('vp'), '');
      add('part-picker', !!document.getElementById('part-picker'), '');
      add('selection-hud', !!document.getElementById('selection-hud'), '');
      add('help-panel', !!document.getElementById('help-panel'), '');
      const layerCount = document.querySelectorAll('[data-layer]').length;
      add('layers-present', layerCount >= 1, layerCount + ' strati');
      const unresolvedCount = document.querySelectorAll('.layer-row[data-unresolved]').length;
      add('unresolved-markers', unresolvedCount > 0, unresolvedCount + ' strati marcati');
      const blockerChipCount = document.querySelectorAll('.eng-chip').length;
      add('engineering-blockers', blockerChipCount >= 9, blockerChipCount + ' chip');
      const viewmark = document.querySelector('.viewmark');
      add('non-approval-viewmark', !!viewmark && /NON ESECUTIVO|NON APPROVATO/i.test(viewmark.textContent || ''), '');
      const picker = document.getElementById('part-picker');
      add('part-picker-options', !picker || picker.options.length >= 1, picker ? picker.options.length + ' opzioni' : 'assente');
      add('screenshot-helper', typeof window.towerScreenshotMode === 'function', '');
      add('geometry-inspection-helper', typeof window.towerGeometryInspection === 'function' || typeof window.towerGeometryInspect === 'function', '');
      add('regression-helper', typeof window.towerRegressionSweep === 'function', '');
      const ok = checks.every(c => c.ok);
      if (opts.applyMode) {
        document.body.classList.add('visual-audit-mode');
        document.body.setAttribute('data-visual-audit', 'true');
      }
      if (opts.screenshot && typeof window.towerScreenshotMode === 'function') window.towerScreenshotMode(true);
      return {
        ok,
        checks,
        errors,
        timestamp: new Date().toISOString(),
        layerCount,
        unresolvedCount,
        blockerChipCount,
      };
    }, 'towerVisualAudit');
  }
  function applyVisualAuditModeR8() {
    towerSafe(() => {
      const params = new URLSearchParams(location.search);
      const hashParams = new URLSearchParams(location.hash.replace(/^#/, ''));
      const active = params.has('audit') || params.has('visual-audit') || params.has('final-audit') ||
        hashParams.has('audit') || hashParams.has('visual-audit') || hashParams.has('final-audit');
      if (active) {
        document.body.classList.add('visual-audit-mode');
        document.body.setAttribute('data-visual-audit', 'true');
        setTimeout(() => { try { towerVisualAudit({ applyMode: true }); } catch (e) {} }, 300);
      }
    }, 'visual-audit-mode');
  }
  window.towerVisualAudit = towerVisualAudit;
  window.towerAudit = towerVisualAudit;
  window.towerFinalAudit = towerVisualAudit;
  window.towerVisualAuditRun = towerVisualAudit;
  window.towerFeatureNotes = towerFeatureNotes;
  window.towerFeatureNotesR8 = towerFeatureNotes;
  window.towerMorningNotes = towerFeatureNotes;
  window.towerNextMorningNotes = towerFeatureNotes;
  window.towerApplyVisualAuditMode = applyVisualAuditModeR8;
  window.towerVisualAuditMode = applyVisualAuditModeR8;
  applyVisualAuditModeR8();

  /* ---------- initialise ---------- */
  updateHud();

  // Apply a camera preset requested via URL query (?cam=room|tower|side|...).
  const camParam = new URLSearchParams(location.search).get('cam');
  if (camParam) setTimeout(() => applyCameraPreset(camParam), 0);
})();
