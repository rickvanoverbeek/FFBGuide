---
manufacturer: fanatec
software: "Fanatec Control Panel"
setting_name: "FOR (Force)"
concept: constant-effect-scale
category: other
summary: "Scales the strength of the force feedback signals a game provides."
impact: "Higher amplifies the pushing forces a title sends; lower thins them out. It acts only on what the game actually requests."
value_range:
  min: 0
  max: 120
related_settings:
  - fanatec/sen
sources:
  - https://www.fanatec.com/eu/en/s/faq-what-can-be-set-wheel-tuning-menu
status: verified
last_reviewed: "2026-08-18"
---
FOR modifies the strength of the force feedback signals a game provides, applying to effects the title pushes in a direction.

It belongs to the same family as SPR and DPR: all three scale game-sent effects rather than generating anything in the base.
