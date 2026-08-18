---
manufacturer: vrs
software: "VRS DirectForce Pro configuration tool"
setting_name: "Smoothing"
concept: force-reconstruction
category: filter_smoothing
summary: "Filters the stepped force signal from a title's fixed update rate."
impact: "Higher values reduce notchiness from a coarse update rate. Lower values keep the signal immediate, steps included."
value_range:
  min: 0
  note: "Documented example values are 0, 1 and 2."
related_settings: []
sources:
  - https://virtualracingschool.com/academy/hardware/vrs-directforce-pro-wheel-base-settings/
status: verified
last_reviewed: "2026-08-18"
---
A simulator updating forces at 60 Hz delivers them in discrete steps roughly 16 ms apart. Smoothing filters between those steps so the result feels continuous.

VRS documents the cost plainly: higher values reduce notchiness but add a slight delay.
