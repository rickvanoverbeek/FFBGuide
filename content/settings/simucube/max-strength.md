---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Max Strength"
concept: max-force
category: force_limit
summary: "Sets the maximum torque that simulator-generated force feedback may produce."
impact: "Higher gives a heavier wheel until forces reach the ceiling and flatten, hiding the detail inside peaks. Lower keeps peaks intact but lets small forces fade below what you notice at the rim."
related_settings:
  - simucube/torque-linearity
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
Max Strength caps the torque resulting from force feedback the simulator generates. Bumpstop forces are not affected by it, so the end stops stay as firm as their own settings make them.

The game applies its own force scale before this, so effective torque is the product of the two. Two moderate values give the same weight as one extreme value while leaving headroom before clipping.
