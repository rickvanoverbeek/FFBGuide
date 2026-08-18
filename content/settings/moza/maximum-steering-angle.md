---
manufacturer: moza
software: "Moza Pit House"
setting_name: "Maximum steering angle"
concept: rotation-range
category: other
summary: "Sets the angle the wheel turns between its left and right limits."
impact: "A smaller angle makes steering feel quicker and heavier per degree of hand movement. A larger angle gives finer control but demands more hand travel."
related_settings:
  - moza/maximum-steering-wheel-speed-limit
  - moza/hand-off-protection
  - moza/auxiliary-centering-control
sources:
  - https://support.mozaracing.com/en/support/solutions/articles/70000625635-moza-pit-house-user-manual
status: verified
last_reviewed: "2026-08-18"
---
The setting defines the maximum angle from the left limit to the right limit.

Where a title manages steering lock itself, a conflicting value here produces either a soft stop before the mechanical limit or hands that no longer match the car's front wheels.
