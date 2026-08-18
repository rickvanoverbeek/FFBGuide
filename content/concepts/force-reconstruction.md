---
label: "Force reconstruction / interpolation"
category: filter_smoothing
summary: "Interpolates between the discrete force updates a game sends, raising the effective update rate."
order: 10
---
Titles send force values at a finite rate. Reconstruction fills in between those values so torque changes continuously instead of stepping, which removes the notchy or grainy feel of a low update rate.

The trade is detail and immediacy: smoothing across a longer window also smooths across genuine texture and adds a small delay.
