---
label: "Little feel in the front end"
summary: "The wheel goes quiet exactly when you need to know what the front tyres are doing."
group: feel
keywords:
  - "vague"
  - "no grip information"
  - "understeer"
  - "front end"
  - "light in corners"
  - "weinig gevoel voorkant"
  - "vaag stuur"
  - "geen grip info"
  - "voorkant licht"
advice:
  - concept: friction
    direction: lower
    priority: 1
    why: "Friction adds a constant torque on top of everything else, and the changes that report the front losing grip are small. Lowering it stops those changes being drowned out."
  - concept: damping
    direction: lower
    priority: 2
    why: "Damping resists movement in proportion to speed, which is exactly the quick, small movement a sliding front tyre produces."
  - concept: force-reconstruction
    direction: lower
    priority: 3
    why: "Smoothing works across a window of the signal, and it cannot tell texture apart from noise. Less of it keeps the surface detail you are trying to feel."
  - concept: static-force-reduction
    direction: lower
    priority: 4
    why: "This bleeds away sustained torque — which is the cornering load itself. Turning it down puts the weight of the front end back in your hands."
  - concept: max-force
    direction: raise
    priority: 5
    why: "If the whole signal is scaled down, its informative part sits below what your hands can notice. Only worth raising once the filters above are out of the way."
related_symptoms:
  - forces-feel-flat
  - dead-around-centre
sources: []
status: draft
---
Front-end feel is carried by small, fast changes in torque: the front tyre approaching its limit shows up as the self-aligning force going soft. Anything that adds a constant force, resists quick movement, or smooths the signal competes directly with that cue.

That is why the fix is nearly always subtraction rather than addition. Raising overall strength makes everything bigger, including whatever is masking the detail — so it comes last, not first.
