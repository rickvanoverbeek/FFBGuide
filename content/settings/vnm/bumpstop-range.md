---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Bumpstop Range"
concept: bumpstop-range
category: other
summary: "Sets where the base's own end stops sit."
impact: "Bringing the stops in gives a defined limit earlier than the game's own. Moving them out hands the end of travel back to the title."
value_range:
  unit: "°"
related_settings:
  - vnm/constant-gain
  - vnm/ramp-gain
  - vnm/sine-gain
  - vnm/steering-range
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
Bumpstop Range is independent of Steering Range, so the base's end stops can sit inside or outside the rotation range the title uses.

Lock Strength alongside it determines how hard that stop feels. VNM provides no in-app description.
