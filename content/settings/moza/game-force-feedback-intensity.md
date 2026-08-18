---
manufacturer: moza
software: "Moza Pit House"
setting_name: "Game force feedback intensity"
concept: game-force-scale
category: force_limit
summary: "Scales the overall intensity of the forces the game sends."
impact: "Higher amplifies everything the title produces until the base runs into its torque limit. Lower keeps headroom but thins out fine forces."
value_range:
  note: "The Professional settings view allows up to twice the value available in the Basic view."
related_settings:
  - moza/mechanical-force-feedback-strength
  - moza/maximum-output-torque-limit
sources:
  - https://support.mozaracing.com/en/support/solutions/articles/70000625635-moza-pit-house-user-manual
status: verified
last_reviewed: "2026-08-18"
---
This adjusts the overall intensity of the force feedback coming from the game, separately from the base's own mechanical effects.

That separation is the useful part: mechanical feel can be raised without amplifying the title's signal, or the other way around.
