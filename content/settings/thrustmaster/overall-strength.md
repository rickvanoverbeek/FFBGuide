---
manufacturer: thrustmaster
software: "Thrustmaster Control Panel"
setting_name: "Overall Strength of all forces"
concept: max-force
category: force_limit
summary: "Master scale applied before the individual effect percentages."
impact: "Higher makes everything stronger until the wheel reaches its torque limit and peaks flatten. Lower keeps peaks intact but thins out small forces."
value_range:
  min: 0
  max: 100
  unit: "%"
related_settings: []
sources:
  - https://support.thrustmaster.com/en/kb/107-en/
status: draft
---
This is the first multiplier in the chain: the per-family percentages act on what remains after it.

The official documentation covers the effect families rather than this slider, so the exact label and range here still need confirming against a current control panel.
