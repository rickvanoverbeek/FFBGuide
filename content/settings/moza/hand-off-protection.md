---
manufacturer: moza
software: "Moza Pit House"
setting_name: "Hand-off protection"
concept: hands-off-protection
category: other
summary: "Detects that the wheel has been released and holds it neutral."
impact: "Enabled, a released wheel settles instead of thrashing. Disabled, the base keeps delivering full forces to an unheld rim."
related_settings:
  - moza/maximum-steering-angle
  - moza/maximum-steering-wheel-speed-limit
  - moza/auxiliary-centering-control
sources:
  - https://support.mozaracing.com/en/support/solutions/articles/70000625635-moza-pit-house-user-manual
status: verified
last_reviewed: "2026-08-18"
---
When the algorithm detects that your hands have left the wheel it controls the steering wheel to remain in the neutral position, which Moza documents as preventing injuries from violent shaking.
