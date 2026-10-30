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