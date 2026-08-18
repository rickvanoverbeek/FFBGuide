---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Crash Effect Reduction"
concept: crash-effect-reduction
category: other
summary: "A toggle that limits the force spikes produced by crashes."
impact: "Enabled, impacts arrive with their worst spike taken off. Disabled, crashes come through at whatever the title sends."
related_settings:
  - vnm/constant-gain
  - vnm/ramp-gain
  - vnm/sine-gain
  - vnm/steering-range
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
This targets the crash case specifically rather than capping all force change, so ordinary driving is unaffected.

It is a toggle rather than a slider, and VNM provides no in-app description.
