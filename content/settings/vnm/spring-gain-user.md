---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Spring Gain (User Effects)"
concept: centering-force
category: spring_centering
summary: "Base-generated pull back towards centre."
impact: "Higher gives a firmer return to straight ahead regardless of the title. Lower leaves centering to the game's physics."
value_range:
  min: 0
  max: 100
  note: "Defaults to 100 in the User Effects group."
related_settings:
  - vnm/spring-gain-game
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
Because the base generates this centering force, it works in titles that send no spring effect — including outside a game entirely.

In a sim that already models self-centering, it stacks an artificial spring on top of the physics.
