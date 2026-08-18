---
label: "Damper effect scaling"
category: damping
summary: "Scales the damper effect a game sends, rather than generating damping in the base."
order: 20
---
DirectInput lets a title request a damper effect. This kind of setting only scales that request, so in a title that sends no damper effect it does nothing at all.

That dependency explains why the same value feels decisive in one game and inert in another, and why it behaves differently from base-generated damping.
