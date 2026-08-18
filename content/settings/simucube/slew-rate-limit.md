---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Slew Rate Limit"
concept: slew-rate
category: slew_rate
summary: "Limits how quickly torque may change, in Nm per millisecond."
impact: "A lower limit blunts crashes and kerb strikes and protects your hands and the hardware. A higher limit lets force arrive as abruptly as the title asks, which is more informative but far more violent."
value_range:
  unit: "Nm/ms"
  note: "Documented as a rate of torque change rather than a torque value."
related_settings: []
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
The limit produces a smooth signal by constraining the rate at which torque may change. Full force remains reachable; it simply takes a minimum amount of time to get there.

Simucube notes the cost explicitly: abrupt signal changes and details in the torque may lag behind what the title sent.
