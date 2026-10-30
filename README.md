# BEFORE ADAM — Creation Studio v0.8

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
