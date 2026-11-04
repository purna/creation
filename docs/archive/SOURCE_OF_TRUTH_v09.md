# BEFORE ADAM — Creation Studio: Source of Truth v0.9 (Day 1–3 Design Update)
Date: 2026-10-30
Status: Approved design direction / partial UI scaffold; **not** a claim of implemented stellar, climate or tectonic physics.

## Vision and narrative
A mobile-first Vite + TypeScript educational creation game for GCSE/A-level learners. Six Genesis days, each beginning with its corresponding Bible verse and a progressively unlocked mathematical challenge checklist. Players connect typed mathematical/physics nodes, inspect formulas and units, and demonstrate stability over simulated time. The Genesis narrative is the game's framing, **not** a claim that the text specifies modern scientific chronology.

## Core UX contract
- Top half: live physical simulation. Bottom half: node graph, Maths, Parameters and applicable domain tabs; mobile-first, touch-to-connect.
- Group nodes by domain and mathematical role. Every node should open an accessible modal explaining purpose, equation, symbols, units, example, common mistakes, graph inputs/outputs and its effect on the world.
- Checklist is visible per day; each challenge has an ID, prerequisites, required graph outputs, validator, tolerances, feedback and simulation milestone.
- Locked tasks explain their dependencies. **Only physics validators may tick off a challenge**; never award completion for merely adding nodes, selecting a preset or making a single output.
- Persist graph, parameters, per-challenge evidence and successful stability runs. Allow replay, inspection and teacher export.
- Distinguish tutorial approximations from research-grade models and disclose limitations.

## Day 1 — Let There Be Light (Genesis 1:3)
Opening verse: “And God said, ‘Let there be light,’ and there was light.”
**Goal:** sustained stellar fusion, hydrostatic support and thermal/energy balance; not a flash of light.
Seven required challenges, sequential for initial implementation:
1. Gather hydrogen fuel; define mass and composition.
2. Calculate gravitational compression (Newtonian gravity).
3. Establish core pressure, temperature and density.
4. Model hydrogen fusion and mass defect: E = Δmc². A threshold temperature alone is insufficient for sustained fusion.
5. Balance inward gravity against outward pressure (hydrostatic equilibrium).
6. Balance core energy generation and radiation/transport; estimate luminosity and spectrum.
7. Run a sustained numerical stability test: bounded radius, core temperature, luminosity, fuel and energy residuals over a specified simulated window.
Feedback: contracting, expanding, cooling, fusion igniting, steady shining. Real stars evolve and consume fuel; stability is finite-time and approximate.

## Day 2 — Sky and Waters (Genesis 1:6)
Opening verse: “Let there be a vault between the waters to separate water from water.”
**Goal:** persistent atmosphere, liquid surface water and a cycling hydrosphere under Day 1's luminosity.
Eight challenges:
1. Planetary gravity: g = GM/R².
2. Atmospheric mass and surface pressure: P ≈ Mg/A.
3. Incoming stellar flux: F = L/(4πd²).
4. Global radiative balance, albedo and simplified greenhouse warming: T_eq = [S(1−α)/(4σ)]^(1/4).
5. Liquid water conditions from temperature and pressure.
6. Evaporation and latent heat: Q = m L_v.
7. Humidity, condensation, clouds and precipitation.
8. Water-budget and climate stability across seasonal cycles; track atmosphere, ocean and surface reservoirs.
Prerequisites: 1→2; 3→4; (2,4)→5→6→7→8. The surface system must conserve water and account for energy inputs. A single phase threshold is a tutorial only.

## Day 3 — Dry Land and Vegetation (Genesis 1:9–11)
Opening verses: Genesis 1:9 (“let dry ground appear”) and 1:11 (“let the land produce vegetation”).
**Goal:** a thermally evolving, tectonically active planet with exposed continents, sustainable drainage, soil and vegetation.
Twelve challenges in four stages:
**Interior:** (1) calculate core/mantle/crust geometry and masses; (2) model primordial + radiogenic heat; (3) calculate interior heat balance C dT/dt = H−Q.
**Tectonics:** (4) define plates and boundaries; (5) model plate velocity and direction; (6) calculate uplift, subduction and mountain/continent formation.
**Surface:** (7) conserve ocean water and compute sea level/land exposure; (8) route rainfall into catchments and rivers; (9) balance weathering, soil formation and erosion.
**Life:** (10) calculate photosynthetic energy/resource availability; (11) model plant growth with resource-limited carrying capacity; (12) pass geological/climate/ecosystem stability test over simulated geological and seasonal windows.
Dependencies: 1→2→3→4→5→6; 6→7→8→9→10→11→12. Some independent tasks may be parallelised in later revisions.
Important: plate tectonics are driven by coupled mantle/lithosphere dynamics, including slab pull, buoyancy and rheology; **core heat alone does not drive plates**. Long-term interior cooling is normal, so H=Q is not a universal success condition. Carbon–silicate cycling connects volcanism, weathering and Day 2 climate. Earthquakes/volcanism may occur in an otherwise viable world.

## Day 4–6 continuity
Preserve existing Day 4 Newtonian N-body orbital lab, Day 5 stellar-flux exercise and Day 6 logistic-population exercise. Future work should couple Day 1 luminosity, Day 2 hydrology, Day 3 terrain/tectonics and Day 4 orbits into shared saved world state. Avoid claiming these links are already implemented.

## Current implementation boundary (v0.9)
- The repository's original Day 1 wavelength→frequency, Day 2 temperature/pressure→phase and Day 3 mass/radius→gravity calculators remain the **working tutorial prototypes**.
- The updated opening verse and mission for Days 1–3 and a visible checklist roadmap are included. The checklist is explicitly **unvalidated**; physics solvers, graph-linked challenge validators, unlocks, simulation effects, and educational explanation modals are still pending.
- Existing Day 4 orbital lab and nested formula groups are preserved.

## Engineering order
1. Typed quantities/units and reusable grouped nodes; explanatory accessible modal and challenge state machine with prerequisite DAG.
2. Day 1 coupled stellar model, numerical integration and stability validation.
3. Day 2 atmosphere/radiation/hydrology model and conservation tests.
4. Day 3 mantle heat, simplified plate motion, elevation, hydrology, soil, carbon cycle and vegetation; validate conservation and stability.
5. Shared universe persistence, cross-day propagation, reproducible challenge fixtures, teacher assessment and mobile accessibility tests.

## Acceptance criteria
No day completes without passing its full checklist and stability run; results must be calculated from the actual graph and simulated state. Failures must identify which physical balance or prerequisite is violated. Expose the simplifications and simulation timescales to students.
