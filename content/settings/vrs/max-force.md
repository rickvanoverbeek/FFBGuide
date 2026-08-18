---
manufacturer: vrs
software: "VRS DirectForce Pro configuration tool"
setting_name: "Max Force"
concept: max-force
category: force_limit
summary: "Sets the maximum motor torque, independent of in-game force settings."
impact: "Higher gives a heavier wheel until the motor's maximum is reached and peaks flatten. Lower keeps headroom but makes small forces harder to feel."
value_range:
  min: 0
  max: 100
  unit: "%"
related_settings:
  - vrs/non-linearity
sources:
  - https://virtualracingschool.com/academy/hardware/vrs-directforce-pro-wheel-base-settings/
status: verified
last_reviewed: "2026-08-18"
---
Max Force determines the maximum torque the motor will output, adjusting overall strength separately from the title's own force feedback setting.

Because both scales multiply, VRS's documented approach is to set this once and then balance the rest in the title.
