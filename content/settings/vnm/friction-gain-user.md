---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Friction Gain (User Effects)"
concept: friction
category: friction
summary: "Base-generated constant resistance, independent of wheel speed."
impact: "Higher gives a heavier, more mechanical rim and suppresses small oscillation. Lower keeps the wheel light and detailed."
value_range:
  min: 0
  max: 100
  note: "Defaults to 100 in the User Effects group."
related_settings:
  - vnm/friction-gain-game
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
This is the base's own friction, as opposed to the Friction Gain on the Game Settings tab that scales what a title requests.

Because most racing titles send no friction effect, this is generally the friction control that has any effect at all.
