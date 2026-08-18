---
manufacturer: moza
software: "Moza Pit House"
setting_name: "Mechanical force feedback strength"
concept: mechanical-force-strength
category: force_limit
summary: "Scales the base's own synthesised force effects as a group."
impact: "Higher gives more mechanical character — weight, damping and friction together. Lower leaves the game's own forces dominant."
related_settings:
  - moza/game-force-feedback-intensity
  - moza/maximum-output-torque-limit
sources:
  - https://support.mozaracing.com/en/support/solutions/articles/70000625635-moza-pit-house-user-manual
status: verified
last_reviewed: "2026-08-18"
---
This controls the overall strength of the mechanical force feedback the base motor generates through its own algorithm, independent of the forces the game sends.

It is the counterpart to Game force feedback intensity: one scales the simulator, the other scales the base's own contribution.
