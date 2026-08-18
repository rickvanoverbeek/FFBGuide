---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Torque Bandwidth"
concept: high-frequency-cut
category: filter_smoothing
summary: "Removes force content above a frequency limit."
impact: "A lower limit strips out more of the fine, high-frequency texture, leaving a calmer but less informative signal. A higher limit keeps detail, including vibration you may not want."
value_range:
  unit: "Hz"
related_settings:
  - simucube/reconstruction-filter
  - simucube/notch-filter
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
Torque Bandwidth removes high frequencies — the details — from the simulator signal. The lower the frequency limit, the more is removed.

Where the Reconstruction Filter fills in between updates, this cuts content that is already there, which makes it the tool for a rig that transmits too much buzz.
