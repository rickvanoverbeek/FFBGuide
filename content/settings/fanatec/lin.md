---
manufacturer: fanatec
software: "Fanatec Control Panel"
setting_name: "LIN (Force Feedback Linearity)"
concept: force-linearity
category: force_limit
summary: "Reduces maximum output so that peak and sustained forces stay consistent."
impact: "Switched on, holding forces and peaks relate to each other more evenly, at the cost of maximum output. Off, the full range is available with peaks dominating."
value_range:
  note: "Documented as an ON/OFF setting."
related_settings:
  - fanatec/ff
sources:
  - https://www.fanatec.com/eu/en/s/faq-what-can-be-set-wheel-tuning-menu
status: verified
last_reviewed: "2026-08-18"
---
LIN reduces the maximum force feedback output to keep consistency between peak forces and the forces you hold in a corner.

It changes proportions rather than the character of individual effects, which is why it sits apart from the smoothing and damping parameters.
