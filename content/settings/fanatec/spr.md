---
manufacturer: fanatec
software: "Fanatec Control Panel"
setting_name: "SPR (Spring)"
concept: spring-effect-scale
category: spring_centering
summary: "Scales game-sent spring effects that pull the wheel towards the centre."
impact: "Higher strengthens a game-requested return to centre. In sims that derive centering from physics, it has nothing to scale."
value_range:
  min: 0
  max: 120
related_settings: []
sources:
  - https://www.fanatec.com/eu/en/s/faq-what-can-be-set-wheel-tuning-menu
status: verified
last_reviewed: "2026-08-18"
---
SPR modifies spring effects a game sends, which pull the wheel towards its centre.

Because modern racing titles usually model self-centering through tyre and suspension forces instead of requesting a spring effect, this parameter is frequently inert in them.
