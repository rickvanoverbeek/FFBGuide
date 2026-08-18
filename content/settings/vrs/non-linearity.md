---
manufacturer: vrs
software: "VRS DirectForce Pro configuration tool"
setting_name: "Non-linearity"
concept: force-linearity
category: force_limit
summary: "Bends the mapping between requested and delivered force."
impact: "Raising it amplifies weak forces while compressing strong ones, which brings up detail at the cost of peak contrast. Zero delivers what the title asks for."
value_range:
  min: 0
  note: "VRS recommends 0 for most titles."
related_settings:
  - vrs/max-force
sources:
  - https://virtualracingschool.com/academy/hardware/vrs-directforce-pro-wheel-base-settings/
status: verified
last_reviewed: "2026-08-18"
---
Non-linearity amplifies weak forces while compressing strong ones, changing the proportions of the force range rather than its ceiling.

It is the setting to reach for when small forces are hard to feel but raising Max Force would make peaks unmanageable.
