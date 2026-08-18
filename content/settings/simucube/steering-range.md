---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Steering Range"
concept: rotation-range
category: other
summary: "Sets the rotation range from maximum left to maximum right."
impact: "A narrower range makes steering feel faster and heavier per degree of hand movement. A wider range gives finer control but needs more hand travel for the same correction."
related_settings:
  - simucube/static-force-reduction
  - simucube/ultra-low-latency
  - simucube/bumpstop-feel
  - simucube/bumpstop-range
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
Steering Range defines the travel available between the two steering locks. Where a title manages the range itself, a conflicting fixed value here produces either a soft stop short of the limit or a mismatch between your hands and the car's front wheels.
