---
manufacturer: vnm
software: "VNM Simcenter"
setting_name: "Force Rate Threshold"
concept: force-rate-threshold
category: slew_rate
summary: "Sets the rate of change at which the force rate limiter engages."
impact: "A lower threshold brings the limiter in sooner, smoothing more of what the title sends. A higher one reserves it for the most abrupt changes only."
related_settings:
  - vnm/force-rate-limit
sources: []
source_note: "Labels taken from VNM Simcenter v6.3.0.2 in the software itself; the Game Settings descriptions are VNM's own in-app help text."
status: draft
---
The threshold decides which changes count as abrupt enough to limit, while Force Rate Limit decides how hard that limit bites.

Splitting the two means ordinary force changes can pass untouched while only genuine spikes are capped. VNM provides no in-app description.
