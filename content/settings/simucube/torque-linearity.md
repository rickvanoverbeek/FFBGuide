---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Torque Linearity"
concept: force-linearity
category: force_limit
polarity: unclear
summary: "A gamma filter that changes how the wheel reacts to small torque signals."
impact: "Adjusting it changes how much of the range is spent on weak forces versus strong ones, which alters where detail sits rather than how strong the peaks are."
related_settings:
  - simucube/max-strength
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
The filter applies a gamma curve to the torque signal, affecting the wheel's reactivity to small torque requests when no torque is being applied.

Simucube describes it as very sensitive, so it is a small-steps setting rather than one to explore in large moves.
