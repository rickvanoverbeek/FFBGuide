---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Damping (Game Effects)"
concept: damper-effect-scale
category: damping
summary: "Scales the damper effect a title requests, rather than generating damping itself."
impact: "At full scale the title's damper effect arrives as sent. Reducing it thins that effect out; in a title that sends no damper effect, changing it does nothing."
value_range:
  min: 0
  max: 100
  unit: "%"
  note: "Defaults to 100%, i.e. the effect is passed through as the title sends it."
related_settings:
  - simucube/damping
  - simucube/center-damping
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
In the Game Effects tab the slider is labelled simply Damping. It creates a resistive force proportional to wheel speed, but only in response to what the simulator asks for.

The Mechanical Feel damping slider is the base-generated counterpart, and the two stack.
