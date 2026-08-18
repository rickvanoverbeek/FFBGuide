---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Static Force Reduction"
concept: static-force-reduction
category: other
summary: "Removes static torque after roughly one second."
impact: "Light use adds a power steering sensation that takes the strain out of long corners. Higher values start to confuse the weight transfer cues you steer by."
related_settings:
  - simucube/steering-range
  - simucube/ultra-low-latency
  - simucube/bumpstop-feel
  - simucube/bumpstop-range
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
Sustained, unchanging torque is removed after about a second, while changing forces pass through untouched.

On Simucube 2 Ultimate a companion Static Force Reduction Speed control sets how quickly that removal happens.
