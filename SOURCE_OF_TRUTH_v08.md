# BEFORE ADAM — Creation Studio v0.8

## Core vision
Six-day Genesis-inspired maths/physics creation game for GCSE and A-level learners. Students connect formula graphs and observe the resulting simulations. The narrative is distinct from scientific chronology.

## Implemented
- Six days, shared Vite/TypeScript node editor, mobile tap-to-connect, Nodes/Maths/Parameters tabs.
- Editable nested arithmetic groups and graph evaluation.
- Day 4: additional **Orbits** tab with all eight planets and optional Moon.
- Newtonian planar N-body gravitational integration using velocity Verlet; AU, years, solar masses.
- Editable per-planet mass, semi-major-distance-like starting radius, initial angle and circular-speed multiplier; stellar mass, Moon toggle, inner/outer view, speed and reset.
- Three measurable classroom stability challenges, based on orbital radial departure and numerical energy drift; earned results persist locally.
- Parameters persist locally and can be restored to defaults.

## Constraints and honesty
- Starting positions are approximate circular orbits, not JPL ephemerides.
- This is a 2D coplanar model, not a complete astronomical solar system; no relativistic effects or accurate tidal locking.
- The Moon is exaggerated in the inner-planet view to make it visible.
- The eight-planet model is a separate Day 4 orbital laboratory; the main node graph still drives the original orbital speed calculation and gates the simulation. Planet-level parameter editing is not yet graph-wired.
- Challenge stability is limited to a few simulated years, not proof of long-term dynamical stability.
- The numerical energy drift is a diagnostic, not an independent physical stability criterion.

## Next engineering priorities
1. Wire planetary orbital properties directly to typed graph sockets.
2. Adaptive simulation time stepping and higher-fidelity orbital initial conditions.
3. Touch device testing, automated tests and accessible keyboard alternatives.
4. Save/import complete orbital projects and teacher assessment artifacts.