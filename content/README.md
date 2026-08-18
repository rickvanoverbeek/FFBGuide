# Content

All site content lives here as markdown with YAML frontmatter. No CMS, no
database — editing a file and committing it is the whole publishing workflow.
`npm run build` validates every file and fails on anything malformed or dangling,
so a broken reference can never reach the site silently.

```
content/
  manufacturers/<manufacturer>.md      one per brand
  concepts/<concept>.md                one per FFB concept — the matrix rows
  settings/<manufacturer>/<setting>.md one per setting in that brand's software
  symptoms/<symptom>.md                one per complaint — the troubleshooter
```

## The concept key is what makes the cross-reference work

`aliases` are **not** written by hand. Every setting names a `concept`, and the
site derives the cross-manufacturer links from that: any two settings sharing a
concept are each other's equivalents. Adding one Simucube setting automatically
fills in the Simucube column on the Fanatec, Moza, Logitech and Thrustmaster
pages for that row.

Practical consequence: to add a manufacturer you only write that manufacturer's
own files. You never edit existing settings.

## Adding a setting

Create `content/settings/<manufacturer>/<slug>.md`. The folder name must match
the `manufacturer` field, and the filename becomes the URL slug.

```markdown
---
manufacturer: fanatec                    # must exist in content/manufacturers/
software: Fanatec Control Panel          # must match that manufacturer's `software`
setting_name: DPR (Damper)               # exact label from the software, verbatim
concept: damping                         # must exist in content/concepts/
category: damping                        # must match the concept's category
value_type: percentage                   # percentage | numeric | toggle | enum (optional)
summary: One line for cards and the matrix.
impact: >-
  What you feel with it higher, and what you feel with it lower.
value_range:                             # optional, FACTUAL: the control's own range
  min: 0
  max: 120
  unit: "%"
  note: Anything the manufacturer states about the range itself.
recommended_range:                       # optional, EDITORIAL: a starting point
  min: 0
  max: 20
  unit: "%"
  note: Nuance that the numbers alone do not carry.
related_settings:                        # optional, `manufacturer/slug` ids
  - fanatec/nfr
sources:                                 # URLs to official docs, links only
  - https://example.com/official-manual
source_note: >-                          # optional, provenance without a URL
  Labels taken from the software itself, version 1.2.3.
status: draft                            # draft | verified
last_reviewed: "2026-08-18"              # quote it, or YAML makes it a Date
---

The technical explanation goes in the body as normal markdown. This is the
"what it does" section on the page, so describe the mechanism rather than the
feel — the feel belongs in `impact`.
```

### Rules the build enforces

- `manufacturer`, `concept` and every `related_settings` id must resolve
- `category` must match the concept's category, and `software` the manufacturer's
- the folder name must match the `manufacturer` field
- the body may not be empty
- `status: verified` requires either an entry in `sources` or a `source_note`
- `related_settings` may not point at itself, and ids must be unique

Keep `value_range` and `recommended_range` apart: the first is what the
manufacturer documents about the control, the second is editorial advice and is
always rendered with a disclaimer. Never put a guess in `value_range`.

`npm run check:content` additionally warns about empty matrix rows and columns,
and about two settings from one manufacturer claiming the same concept.

## Adding a concept (a new matrix row)

```markdown
---
label: Slew rate limit          # neutral, manufacturer-independent name
category: slew_rate             # damping | friction | inertia | spring_centering
                                # filter_smoothing | force_limit | slew_rate | other
summary: One line, shown in the matrix row header.
order: 10                       # row order in its category, lower first (default 50)
---

Longer explanation of the concept itself, independent of any brand.
```

Categories are a fixed enum in [`src/lib/content/schema.ts`](../src/lib/content/schema.ts).
Concepts are free to add — each one becomes a row.

## Adding a manufacturer (a new matrix column)

```markdown
---
name: Simucube
software: Simucube Tuner        # exact name of the tuning tool
summary: One line for the manufacturers overview.
website: https://simucube.com   # optional
order: 1                        # optional, lower sorts first
---

Notes about the software itself: how it stores profiles, what is per-game and
what is not.
```

No logo or image fields exist by design — manufacturer artwork is an IP risk and
is deliberately not part of the model.

## Adding a symptom (a troubleshooter page)

Symptoms point at **concepts**, never at settings, so one file covers all eight
manufacturers and adding a brand never means editing symptoms.

```markdown
---
label: Wheel shakes or oscillates      # the complaint in a driver's words
summary: One line, shown in search results and on cards.
group: stability                       # feel | stability | strength | response | comfort
keywords:                              # phrasings people type, Dutch included
  - oscillation
  - schudt
advice:
  - concept: damping                   # must exist in content/concepts/
    direction: raise                   # raise | lower | on | off
    priority: 1                        # lower runs first; unique per symptom
    why: Oscillation is velocity-driven, and damping opposes velocity directly.
related_symptoms: [dead-around-centre]
status: draft
---

Why the complaint happens, mechanically.
```

`direction` is written as if every control were `direct`. The renderer flips it
for a setting marked `polarity: inverted`, and refuses to state a direction for
`polarity: unclear`. That is the whole reason polarity exists: telling a driver
to raise a control that runs backwards is worse than telling them nothing.

The build rejects unknown concepts, duplicate priorities, dangling
`related_symptoms` and an empty body, and `check:content` complains when a
symptom resolves to settings for fewer than half the manufacturers — which
usually means the advice leans on concepts almost nobody exposes.

## Status and sources

`verified` means the label and the explanation come from a citable source: the
manufacturer's own documentation (`sources`) or the software's own UI and in-app
help text (`source_note`). `draft` means the label is right but the explanation
is inferred — typically where a manufacturer exposes a control without
documenting it. Draft entries are labelled as such on the site, including inside
the matrix.

Promoting an entry means: confirm the label verbatim in the software or manual,
record where that came from, set `status: verified`, and set `last_reviewed`.
Never paste quotes from a manual — link it and write the explanation yourself.

### The distinction that matters most

Most manufacturers ship two different kinds of control with near-identical
names: effects the wheel base generates itself, and gains that merely scale an
effect the game sends over DirectInput. Fanatec's NDP versus DPR, Simucube's
Mechanical Feel versus Game Effects tabs, VNM's User Effects versus Game
Settings, Simagic's Mechanical Damper versus Game Damper — all the same split.
VRS is the only one that asks outright, with a Device/Game dropdown per effect.

Keep them on separate concepts (`damping` versus `damper-effect-scale`). Mapping
both to one concept would claim two settings are equivalent when one of them
does nothing in a title that sends no such effect.
