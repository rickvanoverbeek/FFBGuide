---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Static Force Reduction Rate"
concept: static-force-reduction-rate
category: other
summary: "How quickly sustained torque is bled away once reduction engages."
impact: "A faster rate lightens the wheel sooner in a long corner. A slower one lets the load fade gradually."
related_settings:
  - vnm/constant-gain
  - vnm/ramp-gain
  - vnm/sine-gain
  - vnm/steering-range
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
The rate works alongside Static Force Reduction Ratio, which sets how much is removed.

Simucube exposes the same pairing on its Ultimate models, which makes this one of the clearer cross-manufacturer matches in the advanced filters. VNM provides no in-app description.
