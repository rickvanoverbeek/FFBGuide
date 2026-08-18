---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Ultra Low Latency"
concept: latency
category: other
summary: "Reduces latency in the torque control loop."
impact: "More of it makes the base respond sooner to what the title sends. Too much can excite resonance, which arrives as ringing rather than as extra information."
related_settings:
  - simucube/steering-range
  - simucube/static-force-reduction
  - simucube/bumpstop-feel
  - simucube/bumpstop-range
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
The setting shortens the delay inside the torque control loop.

Simucube warns that adding too much can have unintended resonance consequences in some simulators, naming rFactor 2 and Le Mans Ultimate.
