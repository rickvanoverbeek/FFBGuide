---
label: "Kerbs and crashes are too violent"
summary: "Ordinary driving is fine, but impacts snap the wheel hard enough to hurt or to rip it out of your hands."
group: comfort
keywords:
  - "violent"
  - "kerbs"
  - "crashes"
  - "stoepranden"
  - "gewelddadig"
  - "pijnlijk"
  - "hurts"
  - "snaps my wrists"
  - "spikes"
  - "impacts"
  - "te hard"
advice:
  - concept: slew-rate
    direction: lower
    priority: 1
    why: "Capping how fast torque may change blunts the edge of an impact while leaving peak cornering load untouched. This is the setting built for exactly this problem."
  - concept: crash-effect-reduction
    direction: on
    priority: 2
    why: "Where a base has a dedicated crash limiter, it targets the impact case only, so normal driving is unaffected."
  - concept: force-rate-threshold
    direction: lower
    priority: 3
    why: "The threshold decides which changes count as abrupt enough to limit. Bringing it down engages the limiter earlier."
  - concept: inertia
    direction: raise
    priority: 4
    why: "Simulated mass smooths abrupt transitions, taking the sting out of a kerb without lowering overall force."
  - concept: max-force
    direction: lower
    priority: 5
    why: "The blunt instrument: it lowers impacts and everything else in equal measure. Use it only if the controls above are absent or not enough."
related_symptoms:
  - notchy-or-grainy
  - wheel-too-heavy
sources: []
status: draft
---
An impact is not a bigger force so much as a faster one: torque goes from little to maximum in a few milliseconds, and your wrists are the thing stopping it. That is why a rate limit helps where lowering strength does not — you keep the weight of the car and lose only the suddenness.

If your software has neither a rate limit nor a crash limiter, added mass is the next best thing, since it slows how quickly the rim can be accelerated at all.
