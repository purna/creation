# BEFORE ADAM — Creation Studio v1.5

Vite + TypeScript educational universe creation prototype.

## Run

```bash
npm install
npm run dev
```

Open the Vite URL. Choose **Day 4**, click **Auto-wire example** on the Nodes tab to activate the simulation, then open the **Orbits** tab. Change the selected planet's orbital radius or velocity multiplier, press Restart, and watch the challenge statuses. Use **Inner planets** to see Mercury–Mars; **All planets** to see Neptune.

## Build

```bash
npm run build
```

## GitHub Pages

Vite is configured for the `creation` repository path via `base: '/creation/'` in `vite.config.ts`. Run `npm run build`, then deploy the `dist` directory using your preferred GitHub Pages workflow.

See `SOURCE_OF_TRUTH_v08.md` for scope and limitations.
## Day 1–3 design roadmap (v0.9)
Day 1 now opens with Genesis 1:3 and a seven-step stable-star challenge roadmap; Day 2 with Genesis 1:6 and eight climate/water challenges; Day 3 with Genesis 1:9 and twelve geology/tectonics/vegetation challenges. These checklists are **planned, not yet physics-validated**; the original calculators remain functional. See [SOURCE_OF_TRUTH_v09.md](SOURCE_OF_TRUTH_v09.md) for detailed requirements, equations, dependencies and implementation boundaries.

## Product plan v1.0 (Days 1–6)
- [Source of Truth v1.0](SOURCE_OF_TRUTH_v10.md)
- [Detailed implementation plan](IMPLEMENTATION_PLAN_v10.md)
- [Creation SVG favicon](public/icons/creation.svg)

**Status:** The complete progression, Firebase login/cloud sync, PWA installation, loading/landing and update modal are specified for implementation; they are not yet built. The SVG icon is included as an asset.

## v1.1 application shell
Landing screen, loading spinner, locked Days 2–6, SVG favicon, manifest, scoped service worker and service-worker update prompt are now in the code. **Day 1 completion is not implemented yet**, so Days 2–6 intentionally remain locked. Google/GitHub Firebase sign-in and Firestore sync are still planned, not operational. See [v1.1 implementation notes](RELEASE_NOTES_v11.md) and [full plan](IMPLEMENTATION_PLAN_v10.md).

## v1.2 — Day 1, local and cloud saving
- Day 1 has a simplified **seven-check one-zone star lab** with physical quantities, hydrostatic/thermal residuals and a bounded integration test. The model is solar-calibrated and not research-grade. The original graph wavelength exercise remains separate; the new star checks are **not yet wired to typed graph nodes**.
- Day 2 unlocks when all Day 1 checks pass. Days 3–6 remain locked until their own physics validators are delivered.
- Browser IndexedDB stores star and graph state; legacy localStorage graphs are migrated. Firebase Google/GitHub login and explicit upload/restore controls activate when environment config and provider setup are supplied.
- 192/512 PNG icons and maskable icon are included for PWA installation.
- See [Firebase setup](FIREBASE_SETUP.md) and [release notes](RELEASE_NOTES_v12.md).

## v1.3 — Day 1 node-driven validation
Day 1 now opens an **unwired stellar mathematics graph** with five physical inputs, seven formula nodes and a final output. Connect formula inputs in the stated order and tune values in Parameters. Completion is computed from required connected equations **and** the simplified one-zone physics validator; merely entering values or using Auto-wire cannot complete Day 1. Older Day 1 wavelength graphs are preserved under the `before-adam-v06-0-legacy` browser key. Existing v1.2 star-only unlock evidence is rejected and must be re-earned. See [release notes](RELEASE_NOTES_v13.md).

## v1.4 — Guided Day 1 tutorial
The star panel now walks learners through eight graph-wiring steps, with mathematical explanations, worked examples, required input units and visual focus on the target node. Incorrect source connections, mismatched units and cycles are rejected with explanatory feedback. The validator also checks units on required graph nodes. See [v1.4 release notes](RELEASE_NOTES_v14.md).

## v1.5 — dimensional algebra, socket guidance, tests
Generic Add/Multiply/Divide/Sqrt nodes now propagate SI dimensions (M,L,T,K), flag incompatible addition and warn when calibrated stellar units cannot safely be combined without conversion. The maths panel displays derived units. Day 1 highlights compatible target sockets when a source is selected. Vitest regression tests cover a complete stable star, wrong/missing connections, bad units, unstable parameters, cycles and SI algebra. Run `npm test` and `npm run build`. **Scope:** this is SI dimension analysis for generic maths operations, not a universal unit-conversion system or dimensional proof of the solar-calibrated stellar proxies.

## v1.7 — Fun / Test Mode
Day 1 includes three runnable graph presets: **Working solution** (all equations connected, 7/7 physics checks), **Nearly working** (all wires present but radiation is too high), and **Unstable example** (cool core). A backup of the current graph is made before applying a preset and can be restored. The presets use the real validator, so the working one unlocks Day 2 through the normal rules. The other days do not yet have complete physics validators or full-solution presets.

## v1.8 — Days 2–6 tutorial/test starter labs
Explore/Test opens all days in a non-credit sandbox. Days 2–6 each have mathematical guidance, editable graphs, working/near/broken presets, result checking, and backup/restore. **These are starter models, not the complete 65-challenge scientific curriculum.** They do not grant full-day completion.

## v2.0 — GCSE and A Level entry, tour, editable maths
Landing page offers Level 2 GCSE or Level 3 A Level. The six-step guided demo and in-game help explain nodes, wiring, split view, maths, and test presets. Maths cards offer Jump to node and Edit equation. Custom formulas use a restricted arithmetic parser (A, B, numbers, parentheses and + - * / ^), not JavaScript eval. Editing a built-in physics formula replaces it with a generic maths formula; original Day 1 physics validation still requires the original formula node. Both levels currently share the same educational simulation engines; a separate A Level challenge bank is future work.
