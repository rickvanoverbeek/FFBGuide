---
manufacturer: moza
software: "Moza Pit House"
setting_name: "Maximum steering wheel speed limit"
concept: wheel-speed-limit
category: other
summary: "Caps how fast the wheel may rotate, as a safety measure."
impact: "A lower cap keeps the rim from spinning fast enough to hurt you. A higher cap allows the base to snap round at full speed."
related_settings:
  - moza/maximum-steering-angle
  - moza/hand-off-protection
  - moza/auxiliary-centering-control
sources:
  - https://support.mozaracing.com/en/support/solutions/articles/70000625635-moza-pit-house-user-manual
status: verified
last_reviewed: "2026-08-18"
---
The limit intervenes when wheel velocity exceeds the allowable maximum, which Moza documents as driver protection.

It caps the wheel's own rotational speed rather than the rate at which torque changes, which is what a slew rate limit does.
