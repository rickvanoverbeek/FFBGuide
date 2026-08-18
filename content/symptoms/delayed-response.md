---
label: "Response feels delayed"
summary: "Forces arrive a moment after they should, so corrections feel like they are chasing the car."
group: response
keywords:
  - "delay"
  - "lag"
  - "vertraagd"
  - "traag"
  - "te laat"
  - "rubber band"
  - "disconnected"
  - "loopt achter"
  - "sluggish"
  - "laggy"
advice:
  - concept: force-reconstruction
    direction: lower
    priority: 1
    why: "Smoothing is computed across a window of the signal, and that window is delay. Less of it makes forces arrive when they happen, roughness included."
  - concept: latency
    direction: raise
    priority: 2
    why: "Some bases can shorten the torque control loop directly. Pushed too far this can excite resonance, which arrives as ringing rather than as detail."
  - concept: slew-rate
    direction: raise
    priority: 3
    why: "A low rate cap means torque needs time to change, so abrupt detail arrives late by design. Raising it hands the sharpness back."
  - concept: damping
    direction: lower
    priority: 4
    why: "Damping slows the wheel's own movement, which reads as the base responding late to your hands."
  - concept: inertia
    direction: lower
    priority: 5
    why: "Simulated mass delays the start of every direction change, including yours."
related_symptoms:
  - notchy-or-grainy
  - no-front-end-feel
sources: []
status: draft
---
Perceived delay comes from two places: filters inside the base that deliberately spread changes over time, and mass or resistance that slows the wheel physically. The filters are worth checking first because they are free to change and cost nothing but roughness.

Be aware that this complaint and a notchy wheel pull in opposite directions. The same reconstruction filter that removes steps is the one adding delay, so the honest answer is a setting you are content with rather than one that fixes both.
