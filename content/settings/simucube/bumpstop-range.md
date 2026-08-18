---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Bumpstop Range"
concept: bumpstop-range
category: other
summary: "Moves the base-generated bumpstops without recalibrating."
impact: "Bringing the stops in gives a defined limit earlier than the game's own. Moving them out hands the end of travel back to the title."
related_settings:
  - simucube/steering-range
  - simucube/static-force-reduction
  - simucube/ultra-low-latency
  - simucube/bumpstop-feel
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
Where a simulator's own bumpstops feel harsh, this shifts the device-generated stops instead, with no recalibration needed.
