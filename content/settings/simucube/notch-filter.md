---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Notch Filter"
concept: notch-filter
category: filter_smoothing
summary: "Removes a single frequency band from the force signal."
impact: "Correctly targeted it removes a resonance you could not otherwise get rid of. Set too wide it takes surrounding detail with it."
related_settings:
  - simucube/reconstruction-filter
  - simucube/torque-bandwidth
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
The filter is defined by three fields. Center Frequency picks the frequency to remove, Attenuation dB sets how much of it is removed, and Q Factor controls how narrowly that removal is applied — a higher Q factor targets the chosen frequency precisely, a lower one also removes force content from around it.
