---
manufacturer: simucube
software: "Simucube Tuner"
setting_name: "Sine Wave (Game Effects)"
concept: periodic-effect-scale
category: other
summary: "Scales the sine wave vibration a title adds to the torque signal."
impact: "Higher passes the title's vibration through in full; lower thins it out. It only affects titles that actually request waveform effects."
value_range:
  min: 0
  max: 100
  unit: "%"
  note: "Defaults to 100%."
related_settings:
  - simucube/steering-range
  - simucube/static-force-reduction
  - simucube/ultra-low-latency
  - simucube/bumpstop-feel
sources:
  - https://docs.simucube.com/TunerSoftware/wheelbases/wheelbaseeffects.html
status: verified
last_reviewed: "2026-08-18"
---
Sine Wave scales one of four waveform sliders in the Game Effects tab. Square Wave, Sawtooth Wave and Triangle Wave sit alongside it with the same role for their own waveforms, and the sawtooth slider covers both the up and down variants.
