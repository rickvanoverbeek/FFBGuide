---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Spring (Game Effects)"
concept: spring-effect-scale
category: spring_centering
summary: "Scales the centering spring effect a title requests."
impact: "Reducing it weakens a game-requested return to centre. In sims that model self-centering in physics, it has nothing to act on."
value_range:
  min: 0
  max: 100
  unit: "%"
  note: "Defaults to 100%."
related_settings:
  - simucube/centering-force
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
This scales the spring effect a title sends. Simucube notes that via DirectInput a simulator can place the spring's centre point somewhere other than the wheel's centre, so the effect does not always pull towards straight ahead.

Centering Force is the base-generated alternative.
