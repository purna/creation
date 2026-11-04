# BEFORE ADAM — Source of Truth v1.0
Date: 2026-10-30
Status: approved six-day product plan and engineering requirements. Implementation tracked separately.

## Product vision
An installable, offline-capable, mobile-first, educational Genesis creation simulation for GCSE/A-level learners. Players build one connected mathematical world across six days. Top: responsive simulation. Bottom: typed node editor and domain tabs. Each day opens with its Bible verse and a challenge list. Science models are educational approximations, not assertions about the literal chronology of Genesis.

## Progression
**Day 1 open; Days 2–6 locked for new games.** Complete all required mathematical validators plus a sustained stability test to unlock the next day. Day statuses locked, available, in_progress, complete, stale. Revisit completed days; upstream changes trigger dependency-aware revalidation. A graph connection alone never awards completion. Development-only diagnostics may bypass gates, never production saves.

## Day missions and challenge counts
- Day 1 / Genesis 1:3 / 7: hydrogen fuel, gravity, core conditions, fusion, hydrostatic equilibrium, thermal equilibrium, sustained stable star.
- Day 2 / Genesis 1:6 / 8: gravity, atmospheric pressure, incoming light, temperature balance, liquid water, evaporation, clouds/rain, climate and water-budget stability.
- Day 3 / Genesis 1:9–11 / 12: interior layers, radiogenic/primordial heat, heat transport, plates, plate movement, uplift/volcanism, sea level, rivers, soil, photosynthesis, plant populations, geological/ecological stability. Core heat is not the sole driver of plate motion; long-term cooling is expected.
- Day 4 / Genesis 1:14 / 12: gravity, orbital speed, Earth orbit, eight planets, encounters/integration, orbital stability, rotation, Moon, lunar phases, axial tilt/seasons, calendar, orbital/environmental audit. Reuse current N-body lab.
- Day 5 / Genesis 1:20 / 12: underwater light, oxygen, nutrients, plankton, trophic energy, fish, lift, flight energy, birds, connected food webs, biodiversity, multigeneration stability.
- Day 6 / Genesis 1:24–27 / 14: habitat, herbivores, predators, biodiversity, people, food, freshwater, land allocation, energy, waste, conservation, climate/carbon, resilience, six-day planetary audit. Unlock World Challenge Mode after success.
**65 required challenges.** Stability is finite-time, testable and appropriate to each timescale; not proof of perpetual equilibrium.

## User accounts, saving and installation
Guest/offline play with browser IndexedDB persistence. Optional Firebase Authentication via Google or GitHub, with Firestore cloud saves, secure per-user rules, conflict resolution and offline queue. Never require sign-in to start. Progressive web app with service worker, /creation/ manifest/scope, install icons, creation.svg favicon, offline app shell, landing/loading spinner, error/retry, and version-change modal offering Update now/Later. SVG favicon is not a binary .ico file; optionally generate .ico for compatibility.

## Detailed engineering source
[IMPLEMENTATION_PLAN_v10.md](IMPLEMENTATION_PLAN_v10.md) is the authoritative step-by-step backlog, file layout, state schema, security requirements, dependency order, test fixtures and release gates. Earlier v0.8/v0.9 docs remain as history.

## Implementation status
Current code implements introductory Day 1–3 calculators, roadmap checklists and an existing Day 4 orbital lab. **The new day locks, full physics challenges, Firebase login/sync, IndexedDB, PWA, landing screen and update modal are specifications until delivered and verified.** The SVG favicon asset may be delivered independently; do not infer feature completion from this plan.
