# UX Enhancements — Round 4 (2026-11-23)

## Scope

UI-only pass. No edits to `assets/viewer.js`. Changes limited to
`index.html`, `assets/viewer.css`, `assets/viewer-enhancements.js`,
tests and docs.

## What changed

- Engineering status and blocker labels are now explicit, colour-coded
  chips in the `#eng-blockers` grid, each carrying a `data-blocker`
  attribute. A dedicated chip states "Non approvato per costruzione".
- The viewmark and footer repeat "STUDIO · NON ESECUTIVO · NON
  APPROVATO PER COSTRUZIONE" so no screenshot can be mistaken for a
  construction approval.
- Screenshot mode: `?screenshot=1` (or `shot`, or `#screenshot`) adds
  `screenshot-mode` to `<body>` and hides header, sidebar, inspector,
  quicktools and footer while keeping the canvas, viewmark, overlay
  title and selection HUD. `?select=P1` (also `part`/`selected`) pre-
  selects a component so screenshots can show an isolated part. Toggle
  via Ctrl/Cmd+Shift+S.
- CSS styles for `.eng-chip` variants and `body.screenshot-mode`.
- New tests: `tests/test_ux_r4.py` and `tests/ux_r4_dom.html`.

## Non-goals

- No geometry changes, no purchasing, no hardware control.
- No false construction approval: every label keeps the studio/non-
  executive status.
