---
label: "Notchy, grainy or rattly"
summary: "The force feels stepped or gritty rather than continuous, especially on smooth tarmac."
group: feel
keywords:
  - "notchy"
  - "grainy"
  - "stepped"
  - "hakkelig"
  - "korrelig"
  - "ruw"
  - "rattly"
  - "buzz"
  - "trillingen"
  - "gritty"
  - "coarse"
advice:
  - concept: force-reconstruction
    direction: raise
    priority: 1
    why: "Games send force values at a finite rate. Interpolating between them turns the steps into a continuous curve, which is precisely the notchiness you are feeling."
  - concept: high-frequency-cut
    direction: lower
    priority: 2
    why: "Lowering the frequency limit strips the top of the range, where buzz and rattle live. It costs fine texture, so move it in small steps."
  - concept: effect-sharpness
    direction: lower
    priority: 3
    why: "Delivering effects less abruptly rounds off their edges. This changes how forces arrive, not how strong they are."
  - concept: damping
    direction: raise
    priority: 4
    why: "A last resort: damping masks grain by resisting fast movement. It works, but it costs response everywhere — prefer the filters above."
related_symptoms:
  - delayed-response
  - wheel-oscillates
sources: []
status: draft
---
Notchiness is usually not the base's fault. A title updating forces at 60 Hz delivers a new value roughly every 16 milliseconds, and a direct drive motor is fast enough to reproduce each step as a distinct edge. Filtering fills in between those steps.

Rattle at a single frequency is a different problem: that is resonance in the rig or the wheel, and a notch filter aimed at that one frequency removes it without dulling everything else. Only Simucube exposes such a filter today.
