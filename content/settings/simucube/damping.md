---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Damping"
concept: damping
category: damping
summary: "Base-generated resistance proportional to how fast the wheel is rotating."
impact: "Higher calms fast wheel movement and settles oscillation around centre, at the cost of a slower, syrupy response. Lower keeps the wheel free and detailed but makes self-oscillation easier to trigger."
related_settings:
  - simucube/center-damping
  - simucube/game-damping
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
Listed under Mechanical Feel, this creates a resistive force proportional to rotation speed: the faster the wheel turns, the more torque opposes it.

It is separate from the Game Effects damping slider, which only scales a damper effect the title requests. This one applies in every title.
