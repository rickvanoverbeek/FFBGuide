---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Static Force Reduction Ratio"
concept: static-force-reduction
category: other
summary: "How much sustained, unchanging torque is bled away."
impact: "Higher removes more of the constant load, lightening the wheel like power steering. Lower keeps the sustained weight and the cues that come with it."
related_settings:
  - vnm/constant-gain
  - vnm/ramp-gain
  - vnm/sine-gain
  - vnm/steering-range
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
Static force reduction targets torque that is not changing — the load you hold rather than the detail you feel.

A companion Static Force Reduction Rate controls how quickly that removal happens. VNM provides no in-app description for either.
