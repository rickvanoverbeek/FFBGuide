---
manufacturer: fanatec
software: "Fanatec Control Panel"
setting_name: "FEI (Force Effect Intensity)"
concept: effect-sharpness
category: filter_smoothing
summary: "Adjusts the overall intensity of force effects, from smoothest to sharpest."
impact: "Lower values smooth the delivery and calm rattle at the cost of sharpness. Higher values deliver effects as directly as the title sends them, detail and harshness alike."
value_range:
  min: 0
  max: 100
  note: "Documented as 000 being the smoothest and 100 the sharpest, most direct setting."
related_settings:
  - fanatec/int
sources:
  - https://www.fanatec.com/eu/en/s/faq-what-can-be-set-wheel-tuning-menu
status: verified
last_reviewed: "2026-08-18"
---
FEI adjusts how intensely and how sharply force effects are delivered.

Reading it as a smoothness control rather than a strength control avoids the common mistake: lowering it to tame harshness does not reduce peak force, and raising it does not add torque.
