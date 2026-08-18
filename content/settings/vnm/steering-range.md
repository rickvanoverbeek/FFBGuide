---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Steering Range"
concept: rotation-range
category: other
summary: "Sets the rotation range available between the steering limits."
impact: "A narrower range makes steering feel faster per degree of hand movement. A wider range gives finer control but more travel."
value_range:
  unit: "°"
  note: "Shown at 900 degrees by default, with Center and Calibrate actions alongside it."
related_settings:
  - vnm/constant-gain
  - vnm/ramp-gain
  - vnm/sine-gain
  - vnm/static-force-reduction-ratio
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
Steering Range sits on the Basic tab next to the Center and Calibrate actions, which set the reference the range is measured from.

A separate Bumpstop Range on the Advanced tab controls where the base's own end stops sit.
