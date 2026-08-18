---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Reconstruction Filter"
concept: force-reconstruction
category: filter_smoothing
summary: "Smooths a low update rate torque signal up to the highest rate the base can produce."
impact: "Higher settings prioritise smoothness and remove the notchy feel of a slow update rate. Lower settings keep the signal accurate to what the title sent, including its graininess."
related_settings:
  - simucube/torque-bandwidth
  - simucube/notch-filter
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
The filter reconstructs a continuous torque curve from the stepped values a simulator delivers, raising the effective rate inside the wheel base.

Simucube frames the trade directly: low values maintain accuracy, high values prioritise smoothness. Titles with a low or unstable update rate need more of it than well-behaved ones.
