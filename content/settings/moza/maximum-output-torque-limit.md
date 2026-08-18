---
manufacturer: moza
software: "Moza Pit House"
setting_name: "Maximum output torque limit"
concept: max-force
category: force_limit
summary: "Caps the torque the motor is allowed to produce."
impact: "A lower cap keeps peaks well within what you can hold, at the cost of ultimate strength. A higher cap allows the full output, including violent spikes."
related_settings:
  - moza/game-force-feedback-intensity
  - moza/mechanical-force-feedback-strength
sources:
  - https://support.mozaracing.com/en/support/solutions/articles/70000625635-moza-pit-house-user-manual
status: verified
last_reviewed: "2026-08-18"
---
The limit sets the maximum output torque the motor may produce, which Moza frames as preventing damage from excessive force feedback.

It is a ceiling rather than a scale: forces below it are unaffected, and everything above it is clipped.
