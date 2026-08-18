---
manufacturer: moza
software: "Moza Pit House"
setting_name: "Mechanical damping"
concept: damping
category: damping
summary: "Base-generated damping that rises linearly with wheel speed."
impact: "Higher calms fast movement and suppresses oscillation while making the wheel feel heavier to move. Lower keeps it free and immediate."
related_settings:
  - moza/mechanical-damping-ratio
sources:
  - https://support.mozaracing.com/en/support/solutions/articles/70000625635-moza-pit-house-user-manual
status: verified
last_reviewed: "2026-08-18"
---
This simulates damping independent of the game's forces, increasing linearly as wheel speed rises.

Since it does not depend on the title sending a damper effect, it applies in every game — unlike settings that only scale a game-requested effect.
