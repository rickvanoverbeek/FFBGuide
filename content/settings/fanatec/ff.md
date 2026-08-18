---
manufacturer: fanatec
software: "Fanatec Control Panel"
setting_name: "FF (Force Feedback)"
concept: max-force
category: force_limit
summary: "Sets the maximum strength of the wheel base's force feedback motor."
impact: "Higher makes everything heavier until forces reach the motor's maximum and flatten. Lower protects those peaks but lets fine forces fade."
value_range:
  min: 0
  max: 100
  unit: "%"
  note: "Adjustable in steps of 1%."
related_settings:
  - fanatec/lin
sources:
  - https://www.fanatec.com/eu/en/s/faq-what-can-be-set-wheel-tuning-menu
status: verified
last_reviewed: "2026-08-18"
---
FF adjusts the maximum strength the force feedback motors will produce. Every other parameter is shaped inside that limit.

The title's own gain multiplies with it, so stacking a high in-game gain on a high FF is the usual cause of flattened peaks.
