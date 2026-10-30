# BEFORE ADAM — Creation Studio v1.1

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
