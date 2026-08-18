---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Constant Gain (Game Settings)"
concept: constant-effect-scale
category: other
summary: "Scales the steady forces a game sends, such as sustained cornering load."
impact: "Higher makes sustained loads heavier; lower lightens them. It acts only on constant-force effects the title produces."
related_settings:
  - vnm/ramp-gain
  - vnm/sine-gain
  - vnm/steering-range
  - vnm/static-force-reduction-ratio
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: verified
last_reviewed: "2026-08-18"
---
VNM's in-app help describes Constant Gain as covering steady forces such as sustained cornering load.

It sits on the Game Settings tab, which applies to effects games produce in DirectInput mode — so everything there scales the simulator's own output rather than generating anything in the base.
