# Torre H-7 · UX Round 3 — Transparent/isolated selection modes

Date: 2026-11-23
Scope: UI/UX only (`index.html`, `assets/viewer.css`, `assets/viewer-enhancements.js`, tests and docs). No geometry worker changes.

## Goal

Make the selected part immediately readable when the scene is crowded or when it would normally sit behind room walls, while keeping enough context and orientation aids to avoid getting lost.

## What changed

### 1. Visual feedback for transparency modes

The viewport now gets `isolate-active` and/or `xray-active` CSS classes whenever the corresponding layer switches are on. The classes are driven from `viewer-enhancements.js` via `MutationObserver`, so they stay in sync whether the user toggles the switches manually, uses keyboard shortcuts (`I`, `X`), or triggers auto-isolate by selecting a part.

A subtle cyan border glow is drawn on the viewport canvas area to remind the user that a non-default visibility mode is active. The selection HUD also gets a stronger outline so the active part is never visually lost.

### 2. Stronger selection affordances

- The existing auto-isolate behaviour (enable «Isola selezione» + «Semitrasparente» when a part is selected) is preserved.
- The HUD is kept visible and readable; the inspector card keeps the cyan focus ring introduced in Round 1.
- The help panel now explicitly states that selection activates isolate/semi-transparent modes so the part does not disappear behind walls.

### 3. Unresolved-measurement markers

Layers that still contain studio dimensions, placeholder components or unverified hardware are marked with `data-unresolved` in the sidebar. A small `≈` glyph appears next to their label, and the help panel explains the symbol. The actual caveats remain in `README.md` and the engineering docs; the UI only flags the presence of unresolved data without adding long prose inside the preview.

### 4. Tests

- `tests/test_ux_r3.py`: headless Chromium tests that verify selection enables isolate/semi-transparent layers, activates the HUD, toggles the viewport CSS classes, and produces non-empty screenshots in both desktop and mobile viewports.
- `tests/ux_r3_dom.html`: lightweight DOM interaction test for the new CSS-class sync and focus-selected behaviour, runnable by opening the file in any browser.

### 5. Performance

No continuous animations, no extra canvas redraws, no geometry generation. The only new JS work is attribute observation and class toggling. The 2D canvas renderer remains event-driven, keeping the preview lightweight on low-power devices such as Samsung Flip/mobile.

## Known limits

- The exact opacity values used for isolate and semi-transparent rendering are still owned by `assets/viewer.js` (the geometry worker). This Round-3 pass adds UI-level guards and indicators; any deeper change to the canvas compositing would need to be coordinated with the geometry branch to avoid regressions in the collision/render tests.
- «Prevent selection disappearing behind room walls» is handled by auto-enabling transparency and by sorting selected geometry to the front of the paint order inside `viewer.js`; the UI cannot change the paint order from a separate script.
