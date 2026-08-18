---
manufacturer: logitech
software: "Logitech G HUB"
setting_name: "Force Feedback Filter"
concept: force-reconstruction
category: filter_smoothing
summary: "Smooths the incoming force feedback signal."
impact: "High values produce a smoother feeling from the wheel. Low values create a more raw experience, with the roughness that comes with it."
value_range:
  note: "An Auto option is available alongside manual values."
related_settings: []
sources:
  - https://support.logi.com/hc/en-001/articles/8358055253271-In-Game-Settings-for-Pro-Wheels
status: verified
last_reviewed: "2026-08-18"
---
The filter smooths what the title sends before it reaches the motor, which is Logitech's counterpart to a reconstruction filter.

The documented trade is exactly the usual one: smoothness against rawness, with detail sitting on the raw end.
