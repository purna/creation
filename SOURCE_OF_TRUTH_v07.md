# BEFORE ADAM — Source of Truth v0.7

## Product vision
Students construct the rules of a universe by connecting a mathematical node graph, rather than just moving sliders. All six Genesis-themed days share one Vite + TypeScript application. The narrative sequence is thematic, not a scientific chronology.

## Interface
Top half: live simulation. Bottom half: tabs for Nodes, Maths and Parameters. Mobile sockets are at least 44px tall and use tap-output/tap-input interactions. The node workspace scrolls independently.

## New in v0.7
- Editable compound formula groups: add a group, open its internal graph, change arithmetic wiring, save back to the parent graph. Groups accept two numeric inputs and produce one numeric output. Internal arithmetic is evaluated for real.
- Day 4 Sun/Earth/Moon planar Newtonian N-body solver in astronomical units/years/solar masses, integrated by velocity Verlet. The orbital-speed graph is still a circular two-body approximation, distinct from the N-body visualisation. Relative energy drift is shown.
- Persistent JSON graphs and existing six-day educational models retained.

## Six days
1. Light: wavelength to frequency.
2. Atmosphere and water: simplified phase model.
3. Land and gravity: mass/radius to surface gravity.
4. Heavenly bodies: circular orbital speed, plus Sun/Earth/Moon three-body visualisation.
5. Sea and sky life: stellar flux as a habitability input.
6. Living world: logistic population growth.

## Next milestones
1. Arbitrary-depth nested groups with typed units and editable group inputs/outputs.
2. Eight-planet N-body controls, time scaling, orbital trails and reproducible stability tests.
3. Correct physical scale toggles, Moon synchronous spin and more explicit scientific caveats.
4. Real 3D Three.js and Voxel Forge integration.
5. Missions, assessment, accessibility and cloud persistence.

## Known limitations
Educational approximations on Days 1, 2, 3, 5 and 6; no full 3D yet. Day 4 model has only three bodies, no full tidal-locking physics and exaggerated Moon screen scale. No physical device QA.