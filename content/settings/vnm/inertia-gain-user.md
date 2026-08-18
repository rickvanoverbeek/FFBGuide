---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Inertia Gain (User Effects)"
concept: inertia
category: inertia
summary: "Base-generated simulated mass, resisting changes in wheel speed."
impact: "Higher makes the wheel feel weightier to start and stop turning. Lower gives instant response with a more nervous feel over bumps."
value_range:
  min: 0
  max: 100
  note: "Defaults to 100 in the User Effects group."
related_settings:
  - vnm/inertia-gain-game
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
The base generates this itself, so it applies regardless of whether the title requests an inertia effect.

Its Game Settings namesake scales the game-sent effect instead.
