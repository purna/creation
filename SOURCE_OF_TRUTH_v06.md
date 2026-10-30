# BEFORE ADAM — Source of Truth v0.6

## Core vision
Students construct a universe by wiring mathematical nodes. The six Genesis creation days are narrative framing rather than a claim of scientific chronology. Target: ages 14+, GCSE/A-level.

## Interaction contract
- Vite + TypeScript application.
- Top half is live output, bottom half is tabbed Nodes / Maths / Parameters.
- Mobile-friendly tap-output then tap-input connections, with draggable node headers.
- Typed graph evaluator with cycle protection and missing-connection diagnostics; freely add arithmetic nodes.
- Formula nodes can be inspected; editable internal graphs remain planned.
- Save per-day graph locally and export/import JSON.

## Six missions
1. **Light**: wavelength → frequency, compare visible spectrum. Next: blackbody and star formation.
2. **Sky and water**: temperature + pressure → simplified water phase. Next: atmosphere, precipitation, phase diagrams.
3. **Land**: mass + radius → gravity. Next: Voxel Forge terrain, erosion and oceans.
4. **Heavenly bodies**: stellar mass + orbit radius → circular orbital speed. Next: Earth–Moon synchronous rotation, eight planets, N-body stability and Hill spheres.
5. **Life in sea and sky**: luminosity + distance → stellar flux. Next: temperature/albedo/atmosphere, buoyancy and lift.
6. **Living world**: carrying capacity + growth rate → logistic population. Next: trophic networks, food webs and ecosystem resilience.

## Physics honesty
All models currently simplify reality. Earth habitability cannot be determined by stellar flux alone. Moon tidal locking is synchronous spin, not being stationary. Planetary gravitational perturbations cannot be eliminated, only assessed for bounded stability.

## Development order
1. Editable compound nodes + unit-safe ports.
2. Day 4 solar system vertical slice with real integrator and 3D output.
3. Extend engine and 3D visuals to six days.
4. Missions, progressive hints, teacher dashboard, collaborative publishing.

## Prototype status
Six days run inside one Vite TypeScript app. Connections affect output values and unlock visuals. Graph has simple arithmetic nodes. Not a validated production physics simulator.