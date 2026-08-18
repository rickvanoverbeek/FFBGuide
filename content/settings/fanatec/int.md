---
manufacturer: fanatec
software: "Fanatec Control Panel"
setting_name: "INT (Force Feedback Interpolation)"
concept: force-reconstruction
category: filter_smoothing
summary: "Filters and smooths the incoming game signal and raises its refresh rate."
impact: "Higher values reduce the rough, stepped feel of a coarse signal and make the wheel smoother. Lower values keep it raw, including the roughness."
value_range:
  min: 1
  max: 20
  note: "Can also be switched OFF."
related_settings:
  - fanatec/fei
sources:
  - https://www.fanatec.com/eu/en/s/faq-what-can-be-set-wheel-tuning-menu
status: verified
last_reviewed: "2026-08-18"
---
INT filters and smooths a rough incoming game force feedback signal while increasing its refresh rate.

It is the Fanatec counterpart to a reconstruction filter, and distinct from FEI: INT fills in between the values a title sends, while FEI shapes how sharply the result is delivered.
