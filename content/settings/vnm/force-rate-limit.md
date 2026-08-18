---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Force Rate Limit"
concept: slew-rate
category: slew_rate
summary: "Caps how fast force is allowed to change."
impact: "A lower limit blunts abrupt spikes such as kerb strikes and impacts. A higher limit lets force arrive as suddenly as the title asks."
related_settings:
  - vnm/force-rate-threshold
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
Force Rate Limit is VNM's rate-of-change cap, the counterpart to a slew rate limit: it constrains how quickly torque may change rather than how strong it may become.

It works together with Force Rate Threshold, which sets the point at which the limit begins to apply. VNM offers no in-app description for either.
