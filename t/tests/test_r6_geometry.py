#!/usr/bin/env python3
"""R-6 Metal-Lite: invariants for concept dimensions, NOT a structural certificate."""
from math import radians, sin, cos, isclose
from pathlib import Path
import re

HERE = Path(__file__).resolve().parents[1]
PAGE = HERE / "r6.html"
DOSSIER = HERE / "docs" / "H7_R6_METAL_LITE_2026-11-23.md"

A, P, W, D = 42, 164, 92, 284
FRAME_L, FRAME_D = 1310, 305
CAB_L, CAB_D = 1345, 330
theta = radians(A)
project_x = W * cos(theta) + D * sin(theta)
project_y = W * sin(theta) + D * cos(theta)
span = 6 * P + project_x
normal_gap = P * cos(theta) - W
guide_center = W / 2 + 6
guide_width = 6
mobile_guide_clearance = guide_center - guide_width / 2 - W / 2
fixed_between_guides = P * cos(theta) - 2 * guide_center - guide_width

assert span < FRAME_L - 24, (span, FRAME_L)
assert project_y < FRAME_D - 24, (project_y, FRAME_D)
assert normal_gap > 29
assert isclose(mobile_guide_clearance, 3.0)
assert fixed_between_guides > 11.0, fixed_between_guides
assert FRAME_L < CAB_L and FRAME_D < CAB_D
assert (CAB_L - FRAME_L) / 2 == 17.5
assert (CAB_D - FRAME_D) / 2 == 12.5

# Concept-only cut budget, aluminum 2020 + light angle. Not a signed BOM.
profile2020 = 2*1310 + 5*265 + 6*104
angle = 14*280 + 14*92 + 14*230 + 14*240
assert profile2020 == 4569, profile2020
assert angle == 11788, angle
mass_2020 = profile2020 / 1000 * 0.39
ang_area_mm2 = 2 * 15 * 1.5 - 1.5**2
mass_angle = angle / 1000 * ang_area_mm2 * 0.0027
assert isclose(mass_2020, 1.78191)
assert 1.35 < mass_angle < 1.38
mass_total = sum([6.2, mass_2020, mass_angle, .086, .90, .50, .80, .776, .28, 1.30, .60])
assert 14.5 < mass_total < 14.7
assert mass_total + 0.388 + 3*1.3 < 20, "4 PSU/6 fan scenario currently >20"
assert mass_total + 0.388 + 4*1.3 > 20, "5 PSU/6 fan must exceed HAUGA limit"

html = PAGE.read_text()
doc = DOSSIER.read_text()
for x in ['var N=7, FRAME_L=1310,FRAME_D=305,CAB_L=1345,CAB_D=330',
          '["ang",42]', '["pitch",164]', '["w",92]', '["d",284]',
          'PETG = INTERFACCIA', 'docs/H7_R6_METAL_LITE_2026-11-23.md']:
    assert x in html, f"Not in preview: {x}"
for x in ["4,569 m", "11,788 m", "1345 × 330", "20 kg", "NO-GO"]:
    assert x in doc, f"Not in dossier: {x}"
print("OK R6 projections X %.1f Y %.1f, 7-span %.1f, adjacent clear %.2f, fixed-guide free %.2f mm"
      % (project_x, project_y, span, normal_gap, fixed_between_guides))
print("OK R6 2020 %.3f kg, light angle %.3f kg, nominal mass %.3f kg, no real hardware certified"
      % (mass_2020, mass_angle, mass_total))
