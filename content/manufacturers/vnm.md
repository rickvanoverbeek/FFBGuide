---
name: "VNM"
software: "VNM Simcenter"
summary: "Direct drive bases configured in VNM Simcenter, which separates base-generated User Effects from per-family Game Settings gains."
website: https://vnmsimulation.com
order: 8
---
Simcenter splits its force settings across tabs. Basic holds Steering Range, Overall Gain, Overall Filter and a User Effects group with Damper, Friction, Inertia and Spring gains that the base generates itself. Game Settings holds one gain per DirectInput effect family — Constant, Ramp, Spring, Damper, Inertia, Friction, Square, Triangle, Sine and Sawtooth Up and Down — which scale what the game produces.

The identical names across the two groups are the thing to watch: Damper Gain on the Basic tab and Damper Gain on the Game Settings tab do different things. Advanced adds force rate limiting, static force reduction, bumpstop controls and a crash effect toggle.

Two controls are exposed without in-app descriptions and are deliberately left undocumented here: Max Torque Mode on the Basic tab and DI Ratio on the Advanced tab. An FFB Mode selector switches the force source between DirectInput and VNM's telemetry engine.
