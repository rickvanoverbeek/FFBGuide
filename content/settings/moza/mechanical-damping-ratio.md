---
manufacturer: moza
software: "Moza Pit House"
setting_name: "Mechanical damping ratio"
concept: damping-ratio
category: damping
summary: "Balances damping against the other force settings instead of setting it outright."
impact: "Raising it adds damping in proportion to the rest of your configuration, so the wheel calms down without a single fixed amount being imposed. Lowering it lets the other settings dominate."
related_settings:
  - moza/mechanical-damping
sources:
  - https://support.mozaracing.com/en/support/solutions/articles/70000625635-moza-pit-house-user-manual
status: verified
last_reviewed: "2026-08-18"
---
Moza documents this as adjusting the mechanical damping force comprehensively according to the mechanical return strength, mechanical force feedback strength, natural inertia and game force feedback intensity.

Because it is relative to those settings, its effect changes when any of them change — which is what separates it from the plain Mechanical damping control.
