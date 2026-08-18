---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Bumpstop Feel"
concept: bumpstop-feel
category: other
summary: "Sets how the software-generated rotation limits feel."
impact: "A firmer setting gives a definite wall at the end of the range. A softer one cushions it, which is kinder to your wrists but vaguer about where the limit is."
related_settings:
  - simucube/steering-range
  - simucube/static-force-reduction
  - simucube/ultra-low-latency
  - simucube/bumpstop-range
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
The bumpstop effect is generated in software, and this controls its character. It is independent of Max Strength, so the end stops keep their firmness when overall force is lowered.
