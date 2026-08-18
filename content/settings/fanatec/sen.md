---
manufacturer: fanatec
software: "Fanatec Control Panel"
setting_name: "SEN (Sensitivity)"
concept: rotation-range
category: other
summary: "Sets the wheel's rotation range, or lets the game control it."
impact: "A narrower range makes steering quicker and heavier per degree of movement. A wider range gives finer control but more hand travel."
value_range:
  min: 90
  max: 2520
  unit: "°"
  note: "Maximum depends on the wheel base (900, 1080 or 2520 degrees). Defaults to Auto, which lets the game set the range."
related_settings:
  - fanatec/for
sources:
  - https://www.fanatec.com/eu/en/s/faq-what-can-be-set-wheel-tuning-menu
status: verified
last_reviewed: "2026-08-18"
---
SEN sets the degrees of rotation available lock to lock. Left on Auto it follows whatever range the title requests, which is why Fanatec groups it under the parameters games are allowed to control.

A fixed value that disagrees with the title gives either a soft stop before the mechanical limit or hands that no longer match the car's front wheels.
