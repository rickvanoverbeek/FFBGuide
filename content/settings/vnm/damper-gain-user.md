---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Damper Gain (User Effects)"
concept: damping
category: damping
summary: "Base-generated resistance against rapid wheel movement."
impact: "Higher calms fast movement and suppresses oscillation while making the wheel feel heavier. Lower keeps it free and immediate."
value_range:
  min: 0
  max: 100
  note: "Defaults to 100 in the User Effects group."
related_settings:
  - vnm/damper-gain-game
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
The User Effects group on the Basic tab holds Damper, Friction, Inertia and Spring gains. Unlike their namesakes on the Game Settings tab, these belong to the base rather than to the simulator.

VNM gives in-app descriptions for the Game Settings versions but not for these, so the label is exact while this explanation is inferred from that split.
