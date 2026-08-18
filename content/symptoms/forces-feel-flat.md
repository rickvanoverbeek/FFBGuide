---
label: "Forces feel flat or clipped"
summary: "Heavy corners and kerbs all feel the same, as if the force has run into a ceiling."
group: strength
keywords:
  - "clipping"
  - "flat"
  - "afgekapt"
  - "vlak"
  - "plateau"
  - "geen detail in bochten"
  - "saturated"
  - "everything feels the same"
  - "maxed out"
advice:
  - concept: max-force
    direction: lower
    priority: 1
    why: "Once a peak exceeds what the base can deliver, everything above that point arrives as the same maximum. Lowering the ceiling's input is what restores the difference between hard and very hard."
  - concept: game-force-scale
    direction: lower
    priority: 2
    why: "The game's own scale multiplies with the base's, so effective force is the product of the two. Taking it out of the game side keeps the base's headroom intact."
  - concept: force-linearity
    direction: raise
    priority: 3
    why: "Bending the curve compresses the peaks relative to the middle of the range, where most of the information is. It changes proportions rather than the ceiling."
related_symptoms:
  - no-front-end-feel
  - wheel-too-heavy
sources: []
status: draft
---
Clipping is a signal problem, not a strength problem: the base is being asked for more torque than it has, so a range of different forces all come out identical. The giveaway is that the wheel feels strong but uninformative, and that the difference between a fast corner and a kerb strike disappears.

Most cases come from stacking a high in-game gain on a high base gain. Reduce one of the two rather than compensating on the other side, and leave enough headroom that the heaviest moment of a lap still lands below the maximum.
