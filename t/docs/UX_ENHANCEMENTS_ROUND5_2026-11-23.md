# UX Enhancements — Round 5 (2026-11-23)

## Scope

UI-only pass. No edits to `assets/viewer.js`. Changes limited to
`index.html`, `assets/viewer.css`, `assets/viewer-enhancements.js`,
tests and docs.

## What changed

- Accessibility: stronger focus indicators, ARIA labels on previously
  unlabelled buttons and range inputs, `role="status"` on the selection
  HUD, `role="toolbar"` on the quicktools bar, `tabindex="-1"` on the
  left panel for focus management.
- Mobile: minimum 44px touch targets (48px on coarse pointers), safe-area
  insets, reduced backdrop blur on small screens, and horizontal scrolling
  for the quicktools bar instead of clipping.
- Focus behavior: help dialog now moves focus to its close button on open
  and restores focus to the trigger on close; a simple focus trap keeps
  Tab inside the dialog; mobile sidebar moves focus into the panel and
  back to the menu toggle on close.
- No clipping/overlap: quicktools is constrained to the viewport width,
  z-index ordering keeps HUD, toolbar and viewmark from overlapping.
- New tests: `tests/test_ux_r5.py` and `tests/ux_r5_dom.html`.

## Non-goals

- No geometry changes, no purchasing, no hardware control.
- No false construction approval: labels keep studio/non-executive status.
