---
manufacturer: vrs
software: "VRS DirectForce Pro configuration tool"
setting_name: "Damping"
concept: damping
category: damping
summary: "Resistance that acts against the wheel's current rotation and grows with its speed."
impact: "Small amounts reduce oscillation from the game's force feedback. Larger amounts make the wheel less responsive to both your inputs and the simulator's."
value_range:
  min: 0
  max: 100
  unit: "%"
  note: "VRS notes that professional drivers tend to use 10% to 20%."
related_settings: []
sources:
  - https://virtualracingschool.com/academy/hardware/vrs-directforce-pro-wheel-base-settings/
status: verified
last_reviewed: "2026-08-18"
---
Damping is a force acting against the current rotation of the wheel, stronger for quicker rotation, and is used mostly to reduce oscillation from the game's force feedback.

Damping, Friction, Inertia and Spring each carry a dropdown that selects whether the device generates the effect, the game provides it, or both combine — VRS's recommendation is to stay on Device Effect Only. That dropdown makes explicit the distinction other manufacturers leave implicit in their naming.
