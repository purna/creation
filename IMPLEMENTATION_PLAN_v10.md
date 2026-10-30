# BEFORE ADAM — Detailed Implementation Plan v1.0
Updated: 2026-10-30
Repository: https://github.com/purna/creation
Status: **Implementation specification**, not a declaration that features below are complete.

## Product requirements and non-negotiable acceptance
- Six narrative days; Day 1 available to new players, Days 2–6 locked. Each subsequent day unlocks only after the immediately preceding day passes **all** graph-linked challenge validators and its finite-time stability simulation.
- A player may revisit completed days. Changes to upstream parameters mark dependent completion evidence **stale** and revalidate; do not silently erase progress. Store last valid snapshots separately from current experimental state.
- Google and GitHub sign-in through Firebase Authentication; anonymous/guest browser play remains available. Cloud saves in Cloud Firestore; local saves in IndexedDB with localStorage migration. Offline-first, sync after reconnection, visible sync state.
- Installable PWA: web app manifest, service worker, offline shell, SVG creation favicon + install icons, landing/loading experience and version-change modal.
- Mobile-first split simulation/node editor, accessibility and keyboard/touch parity. A node only validates when actual connected quantities, units, solver state and evidence meet a documented criterion.
- A real deployment must be tested on the GitHub Pages subpath /creation/ with OAuth redirects and service-worker scope.

## Curriculum and day definitions
### Day 1 — Stable star (Genesis 1:3; 7 challenges)
1 Hydrogen composition/fuel; 2 gravity/compression; 3 core temperature/pressure/density; 4 fusion energy Δmc²; 5 hydrostatic balance; 6 fusion/radiation thermal balance; 7 sustained stable-star test. Output to shared state: luminosity, spectrum, mass, radius, stellar age/fuel and stability evidence. Numerical one-zone model with bounded evolution and clear assumptions.

### Day 2 — Atmosphere and water (Genesis 1:6; 8 challenges)
1 Surface gravity; 2 atmospheric mass/pressure; 3 stellar flux; 4 radiative equilibrium/albedo/greenhouse; 5 liquid-water phase conditions; 6 latent heat/evaporation; 7 condensation/clouds/precipitation; 8 conserved water budget and climate stability. Inputs: Day 1 luminosity and Day 4 orbital parameters once available. Outputs: atmospheric pressure, temperature, reservoirs, rainfall, humidity.

### Day 3 — Tectonics, land and plants (Genesis 1:9–11; 12 challenges)
1 Core/mantle/crust geometry; 2 primordial and radiogenic heating; 3 C dT/dt = H−Q heat transport; 4 plates and boundaries; 5 plate velocities including simplified slab pull/buoyancy; 6 uplift/subduction/volcanism; 7 ocean volume/sea level/continental exposure; 8 river runoff/drainage; 9 soil/weathering/erosion; 10 photosynthetic production; 11 plant carrying capacity; 12 geological/ecological stability. Cooling over time is normal; exact H=Q is not required. Couple volcanic outgassing and weathering to Day 2 carbon/climate.

### Day 4 — Celestial bodies, orbits and time (Genesis 1:14; 12 challenges)
1 Newtonian gravity; 2 circular orbital velocity; 3 stable Earth orbit; 4 eight-planet initial conditions; 5 close encounters and integration diagnostics; 6 planetary orbital stability; 7 rotation/day-night; 8 Moon orbit; 9 lunar phases; 10 axial tilt/seasons; 11 days/months/years calendar; 12 orbital **and environmental** stability audit. Reuse existing Newtonian N-body orbital lab; add Moon, rotation and seasonal insolation. Distinguish numerical drift from physical instability.

### Day 5 — Marine and aerial life (Genesis 1:20; 12 challenges)
1 Ocean light attenuation; 2 dissolved oxygen; 3 nutrients/recycling; 4 phytoplankton production; 5 trophic energy transfer; 6 fish reproduction/predation; 7 bird lift; 8 flight power; 9 bird populations/habitat; 10 connect marine and aerial food webs; 11 biodiversity viability; 12 multigeneration ecosystem stability. Dynamic resource-limited food webs; predator–prey oscillations may be healthy. Inputs from Days 1–4.

### Day 6 — Land animals, humanity and stewardship (Genesis 1:24–27; 14 challenges)
1 Habitat area; 2 herbivore food budget; 3 predators; 4 biodiversity; 5 human population; 6 food production; 7 clean freshwater; 8 land allocation; 9 energy supply; 10 waste/pollution; 11 habitat protection; 12 carbon/climate budget; 13 disturbance recovery; 14 complete six-day planetary audit. Include trade-offs among food, energy, water and conservation. Unlock replayable World Challenge Mode only after audit.

**Total: 65 challenges** (7+8+12+12+12+14). Every challenge gets stable ID, dependencies, solver inputs, units, numerical bounds, test duration, hints, output feedback and completion evidence.

## Architecture / proposed files
```
src/
  app.ts                 // startup lifecycle, routing and state orchestration
  main.ts                // migration from current monolith, incremental
  core/types.ts          // WorldState, Quantity, ValidationEvidence
  core/units.ts          // dimensional analysis, SI conversions
  core/graph.ts          // typed ports, graph evaluator, nested groups
  core/challenges.ts     // DAG, unlock/revalidation, validation contracts
  core/progression.ts    // day availability, stale/complete states
  core/world.ts          // cross-day shared world and immutable snapshots
  simulations/star.ts
  simulations/climate.ts
  simulations/tectonics.ts
  simulations/orbits.ts
  simulations/ecosystem.ts
  simulations/stewardship.ts
  persistence/local.ts   // IndexedDB adapter, schema version, migration
  persistence/cloud.ts   // Firestore adapter and sync/conflict handling
  auth/firebase.ts       // modular SDK and providers
  ui/landing.ts
  ui/login.ts
  ui/challenges.ts
  ui/nodeHelp.ts         // accessible modal
  ui/updateModal.ts
  pwa/register.ts
public/
  manifest.webmanifest
  icons/creation.svg
  icons/icon-192.png
  icons/icon-512.png
  icons/maskable-512.png
  sw.js                  // or generated by vite-plugin-pwa
tests/
  units.test.ts
  progression.test.ts
  star.test.ts
  climate.test.ts
  tectonics.test.ts
  orbits.test.ts
  ecosystems.test.ts
  auth-sync.test.ts
  pwa.test.ts
```
Prefer `vite-plugin-pwa` with Workbox injectManifest or generateSW over ad hoc caches; choose one and document. Preserve /creation/ base and scope.

## Persistence model
```ts
type DayStatus = 'locked'|'available'|'in_progress'|'complete'|'stale';
type ChallengeEvidence = {id:string; passed:boolean; solverVersion:string; worldHash:string; checkedAt:string; metrics:Record<string,number>};
type SaveGame = {
 schemaVersion:number; revision:number; updatedAt:string; userId?:string;
 world:WorldState; graphs:Record<string,GraphSnapshot>;
 days:Record<number,{status:DayStatus; evidence:ChallengeEvidence[]; lastValidWorldHash?:string}>;
 settings:{difficulty:'gcse'|'alevel'; sound:boolean};
};
```
Local: IndexedDB primary store; debounced autosave after graph edits and at safe simulation checkpoints; transactional writes, migration of existing `before-adam-v06-*` localStorage graph saves, manual export/import, clear guest-data confirmation. Never store OAuth tokens in custom saves.

Cloud: Firebase Auth GoogleAuthProvider and GithubAuthProvider; Firestore document `users/{uid}/saves/main` (or versioned snapshots) scoped by authenticated uid. Explicit sign-in, sign-out, account linking (avoid duplicate identities), anonymous-to-account migration. Sync queued offline writes after reconnection. Resolve conflicts using monotonic revision + server timestamp and explicit user choice for divergent edits; do **not** blindly use last-write-wins for two active devices. Firestore security rules enforce request.auth.uid == uid, restrict paths and validate size/schema as feasible. Firebase web config is public; keep credentials/secrets out of source. Restrict OAuth authorized domains and configure GitHub OAuth app callback per Firebase console. GitHub Pages may require redirect/popup handling; test Google sign-in and GitHub sign-in in production browsers including mobile Safari. No client-side admin credentials.

## Startup / landing / loading
State machine: BOOT → MIGRATING → RESTORING_LOCAL → CHECKING_SESSION → READY or RECOVERABLE_ERROR.
Landing: creation SVG logo, title, short six-day mission, Continue as Guest, Sign in with Google, Sign in with GitHub, Resume Saved World, New Creation (with confirmation), install prompt if supported, privacy note. Loading view: accessible spinner with text status, reduced-motion alternative, timeout/error/retry and offline indicator. Do not block guest play on network/auth failure. Keep first interactive paint fast; defer simulation assets.

## PWA / offline
- Manifest: name BEFORE ADAM — Creation Studio, short_name Creation, start_url /creation/, scope /creation/, display standalone, theme/background colors, 192/512 PNG + maskable icons, SVG icon.
- HTML SVG favicon `<link rel="icon" type="image/svg+xml" href="/creation/icons/creation.svg">`; SVG is a favicon alternative to .ico, not literally an ICO binary. Generate ICO only if legacy browser support required.
- Service worker: precache revisioned Vite assets, offline navigation fallback to app shell, cache-first immutable static assets; do not cache OAuth callback responses, Firebase API requests, private user documents or mutable saves. Use IndexedDB offline for progress.
- Registration only in production and under /creation/ scope. New SW enters waiting; show accessible **App updated** modal only when a genuinely new worker/version is available, with “Update now” and “Later”. “Update now” sends SKIP_WAITING then reloads once on controllerchange **after** flushing local saves. Avoid reload loops. On first install show no update modal.
- Install button via beforeinstallprompt where supported; on iOS show manual Add to Home Screen instructions. PWA installability and browser behavior vary. Test offline refresh and upgrades.

## Implementation phases and acceptance gates
### P0 — Repository baseline and safety
Tasks: create branch, install dependencies, extract modules incrementally, add Vitest and Playwright, type-check/build CI, record baseline of Day 4 orbital behavior. **Pass:** current calculators and orbital lab still work; GitHub Pages build succeeds.

### P1 — App shell, splash, PWA and icons
Tasks: creation.svg, raster icons, manifest, SW, loading/landing, install UI, update modal and offline state. **Pass:** Lighthouse installability checks; offline app loads after first online visit; update modal only for real updates; update does not lose edits; Android and iOS tested.

### P2 — Local persistence and progression
Tasks: IndexedDB, migration, world snapshots, challenge DAG, day gate UI. All Days 2–6 initially locked; unlock only when actual Day 1 validator succeeds. **Pass:** cannot access locked days by UI or route; reload preserves valid unlocks; tampering with UI checkbox cannot unlock; upstream edits invalidate downstream evidence.

### P3 — Authentication and Firebase
Tasks: Firebase project configuration, enable Google/GitHub providers, OAuth callbacks/authorized domains, Firestore rules/indexes, cloud sync, guest upgrade, account linking and conflict UX. **Pass:** Google and GitHub users can sign in, resume on another device, sign out without deleting local work, work offline, and sync later. Cross-user reads/writes rejected in emulator security tests.

### P4 — Graph engine and education UX
Tasks: typed quantities and unit checks, grouped nodes, explanation modal, hint engine, validator evidence, progress list. **Pass:** invalid units and disconnected graphs fail safely; keyboard and touch editing works; every required node documents assumptions.

### P5 — Day 1 stable star (release gate)
Tasks: one-zone stellar model, fusion, pressure/thermal balance, stable numerical integration, seven challenge validators. **Pass:** stable reference case completes Day 1 and unlocks Day 2; collapse/runaway/insufficient fuel cases fail; persistence records evidence and solver version.

### P6 — Day 2 climate and water
Tasks: gravity, atmosphere, flux, radiation, phase, latent heat, water reservoirs and seasonal stability; eight validators. **Pass:** conservation tests; hot/cold/low-pressure cases fail; Day 3 unlocks only after passing.

### P7 — Day 3 geology and plants
Tasks: mantle thermal budget, plate geometry and simplified movement, uplift, sea level, rivers, erosion, soil, photosynthesis, vegetation, carbon–silicate coupling; twelve validators. **Pass:** plausible finite-time dynamics, conserved water, erosion/resource feedback, Day 4 unlocks.

### P8 — Day 4 orbits and calendar
Tasks: extend existing N-body lab with Earth–Moon, axial tilt, rotation, phases, seasons and energy/angular momentum diagnostics; twelve validators. **Pass:** known orbital fixtures, numerical tolerances, environmental coupling, Day 5 unlocks.

### P9 — Day 5 marine and aerial ecosystems
Tasks: oxygen, nutrient and light budgets, producers/consumers, predators, lift and flight energy, biodiversity; twelve validators. **Pass:** multigeneration survival and realistic failure fixtures; Day 6 unlocks.

### P10 — Day 6 land life, people and final audit
Tasks: land food webs, human resources, land/water/energy allocation, pollution/carbon, disturbances and complete planet stability; fourteen validators; World Challenge Mode. **Pass:** complete six-day audit, resource budgets, viable populations and replay.

### P11 — Release and educational QA
Tasks: accessibility WCAG 2.2 AA target, performance on modest Android, touch drag and connect, reduced motion, cross-browser OAuth, Firestore emulator security, telemetry opt-in, error recovery, teacher export, documentation and backup. **Pass:** no blocker bugs, deterministic fixture suite, offline smoke tests, migration and cloud restore verified.

## Work order and dependency notes
Recommended delivery: P0→P1→P2→P4→P5, with P3 developed in parallel after P2; then P6→P7→P8→P9→P10→P11. Day 4's existing simulation stays accessible to developers/testers in a dev-only test harness even while Day 4 is locked in production.

Avoid hard-coding Firebase project IDs, domains, secrets or OAuth credentials. Ask for Firebase project configuration and provider setup only when beginning P3.

## Definition of done per challenge
A challenge is done only when it has (1) verse/story context, (2) graph inputs and units, (3) node teaching modal, (4) deterministic evaluator, (5) physical solver, (6) failure/success feedback, (7) evidence hash/version, (8) automated passing and failing fixtures, (9) accessible mobile UX, and (10) persistence and downstream invalidation behavior.
