# Visible payoff, play and replay: implementation review

Reviewed against `Creation Visible Payoff, Play and Replay.md`, 2 November 2026.

## Delivered: first Day 1 release

The existing star validator remains the authority. No play reward, animation, prediction or sandbox result writes day-completion evidence.

- A “Your first light” invitation and “Play & replay” header button open a native accessible dialog.
- Fuel starter: change the hydrogen fraction, see a bounded particle cloud and gauge, explicitly connect fuel to the existing fusion input, and receive a first-light payoff only when the existing fuel/mass physics check and exact hydrogen connection pass. This does not pass the other seven checks or unlock Day 2.
- Seven payoff views read the current graph checks and physical values. Fuel density, gravitational compression, core colour, fusion rays, pressure geometry, energy bars and the stability trajectory respond to the model. The final star payoff requires the complete validated graph, including final output and level-specific checks.
- Successful views celebrate once per learning level, with manual Replay and Skip. Sound starts off. Reduced motion respects the device preference and has an in-app option. No remote assets; at most 36 particles and 12 rays.
- Break-and-fix mode copies the player's current graph. A stable reference and a one-value radiation puzzle are available. Run experiment applies a candidate atomically; edits count changed fields. The three hints identify the budget, the offending input, then the reference value. Sandbox changes cannot replace the player's graph.
- Predictions run the existing model for three controlled changes. GCSE predicts up/down/same. A Level predicts a number within 5%. The current output is visible before commitment. The result is revealed only after commitment. Robustness tests cover 27 mass/radius/fuel combinations for each scenario.
- Goldilocks margins and a local best score are deterministic. First Light, Star Fixer, Sharp Eye and Goldilocks are local achievements; no time-lifetime achievements are claimed.

## Scoring definition for this release

The proposed “centre of every acceptance band” can conflict across coupled star equations. Instead, this release uses the model's existing self-consistent solar reference, with the existing validator boundaries as the failure edges:

- Mass: target 1 M☉, accepted 0.08–3 M☉.
- Fuel: target 0.70, accepted 0.50–0.80.
- Surface gravity: target 274 m/s², accepted 30–3000 m/s².
- Core temperature: target 15.7 MK, accepted 8–30 MK.
- Compression proxy: target 1, accepted 0.02–80.
- Fusion: target 1 L☉, accepted 0.03–50 L☉.
- Hydrostatic and thermal residuals: target zero; thresholds 0.08, and 0.04 for the final stability check.

For a bounded band, margin rises linearly from zero at a boundary to one at the reference target, then falls to zero at the opposite boundary. Residual margins are `max(0, 1 - residual / threshold)`. Shared prerequisites use their minimum margin. The day score is the mean of seven check margins × the bounded-run factor × `min(1, 13 / node count)` × 100, rounded. It is zero unless the complete graph passes at the selected level. The bounded-run factor requires the existing stable 240-step solver run and all 12 trajectory samples. These steps are **not years or a stellar lifetime**.

Tiers: Pass below 65, Silver at 65–84, Gold at 85–100. One star requires a validated complete graph, two also require at most 13 nodes, three also require Gold and no hints. Sandbox ratings are displayed separately and cannot count towards the working world's completion or best score.

Rewards use `creation-play-rewards-v1`; sound and motion preferences use separate local keys. Saved graph and progression keys are unchanged.

## Deliberate differences and remaining work

1. The document calls Day 1 challenge 1 “hydrogen fuel”; the existing challenge registry and guide start with gravity/compression, and the physics IDs do not match the guide one-for-one. The fuel starter therefore sits beside the existing bank. Renumbering and migration were not silently applied.
2. This is an additive Day 1 play dialog, not a replacement of the existing 3D scene. Persistent fuel wiring and local rewards survive closing it; the proposed continuous six-day 3D visual transformation is not yet delivered.
3. The seven payoff views have data-driven diagrams and static reduced-motion equivalents, but the cinematic catalogue still needs further art and animation work. A new-player 90-second usability study and mid-range phone performance measurement remain to be done.
4. Stars currently use par **nodes**. The repair puzzle counts edits and hints, but does not yet have a separate persistent puzzle leaderboard or an optional timer.
5. Share-link compression, import validation, friend landing screen and QR codes are not implemented. They need a separately tested payload schema, size limits, graph/type validation and restricted-expression validation before release.
6. Only the four achievements listed above are implemented. Century/1000-year rewards would be misleading for the current solver and remain blocked on an actual time-based validator.
7. Days 2–6 now have playable classroom calculations, unlike the document's older assumption that they are absent. However, many are input-budget or ratio checks rather than full planetary/ecological simulations. They must not be used to claim orbit ejection, ecological recovery, real food-web stability or a planetary audit.
8. Days 4–6 payoffs, per-day puzzles and mini-challenges, seeded daily worlds, world variants, landing-world grades and World Challenge Mode remain follow-up work. Build them one day at a time after specifying the required model outputs and acceptance tests.
9. Difficulty is already shared between the two levels in the existing challenge bank. This release adds qualitative versus numeric prediction difficulty; it does not rewrite all starting graphs or tolerances.

## Validation

Automated checks cover fuel gating, duplicate wiring, completion isolation, final-output gating, reference scores at both levels, failure/repair, graph immutability, reversible sandbox copies, margin arithmetic and prediction robustness. Browser verification covers starter loading, the model-based reveal and the sandbox repair workflow. The full application build and regression suite must pass before deployment.

## Delivered: Day 2 and Day 3 diagram prototypes

All eight Day 2 and twelve Day 3 challenges now have individual before/after descriptions and live payoff diagrams. Open “Live payoffs” in the header, or the expandable payoff inside a challenge graph. The gallery can preview a connected reference in an explicitly labelled sandbox; it never applies that reference to saved progress.

`earthPayoffState` reads the existing classroom validator at the selected difficulty. Idle and partial-wire previews never succeed; success requires the original validator, including Hard uncertainty analysis. Wrong, duplicate and missing wires remain rejected. Preview connections exist only in a temporary copy. Animations and local seen-state metadata cannot write challenge or day completion.

Each scene has a distinct visual: gas retention, retention gauge, illumination, heat balance, water phase, vapour, rainfall, water inventory, land/ocean partition, interior heat, heat transport, crust partitions, plate drift, mountains, coastline, rivers, soil, photosynthesis suitability, vegetation and resource-supported forest. Diagrams follow bounded model values. Text explicitly identifies proxy/budget limits: no invented pressure, temperature, interior layering, convection solver, eruption, oxygen production, geological time or ecosystem stability is claimed.

Success celebrates once per challenge/difficulty, with Replay and Skip. Reduced motion uses the device preference and shared in-app setting; Replay also respects it. Sound stays off. SVG counts are bounded and assets are local. These are educational diagram prototypes, not finished cinematic or full-world simulations. Days 4–6 individual payoffs remain planned.

Validation: 83 new tests cover all twenty challenge references at both difficulties, incomplete and duplicate wires, graph immutability, non-finite/negative inputs, substituted formula rejection and Hard analysis gating. Full suite: 1,140 passing; production build passes. Browser checks include reference isolation, accepted/idle scenes, replay, skip and reduced motion.
