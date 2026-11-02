# Creation: Visible Payoff, Play and Replay

Design addendum to Source of Truth v1.0 · Draft for review · 2 November 2026

## 1. What this adds

Creation currently validates a learner’s maths graph and reports pass or fail. This addendum makes every solved challenge something the player can see, adds play modes that test knowledge directly, and gives each day a ‘just right’ (Goldilocks) target so there is a reason to come back after a day is complete.

**Status: everything here is proposed. Nothing described is built yet.**

Guiding rules:

- **Seen, not just ticked.** Every challenge has a visible animation, and the first one (Day 1, hydrogen fuel) is the starter level.
- **Animation tells the truth.** Visuals are driven by the real validator outputs. They are never scripted to show success when the physics says otherwise.
- **Fun never grants completion.** The existing rule stands: a graph connection or a play-mode result alone never awards day completion. Stars, achievements and play modes sit beside progression, not inside it.
- **Replay comes from chasing ‘just right’,** not from repeating the same solution.
- **GCSE and A Level are difficulty levels,** applied as modifiers to one challenge bank (section 8).

## 2. Starter level: Day 1, Challenge 1 (hydrogen fuel)

**Goal:** a first success within about 90 seconds of landing on Day 1.

**Scene.** A dark, empty space with one prompt: ‘Give the star some fuel.’

**Flow**

1. The player connects the hydrogen fuel input to its first formula node (map this onto the existing guided steps where possible rather than adding a new tutorial).
2. **Live feedback.** While they wire and tune, a cloud of hydrogen particles appears in the scene. Cloud density follows the current fuel value, and a small gauge shows the fraction. Too little fuel gives a thin cloud, and an out-of-range value gives a visibly wrong cloud (see the Fail state in section 3).
3. **Success (about 3 seconds).** The validator passes, so the particles swirl inward, the glow warms from grey to amber, the gauge ring completes, a soft chime plays, and a chip reads ‘Fuel loaded ★’.
4. **Persistence.** The cloud stays in the scene as the starting state for Challenge 2. A Replay button and a Skip button are always available.

**Acceptance**

- The success animation fires only when the validator passes, and fires once automatically, then on demand via Replay.
- Reduced-motion users see a static before/after with the same information (section 3).
- A new player can reach the success state without reading documentation.

## 3. The payoff contract (all 65 challenges)

Every challenge defines four visual states:

| State | When | Purpose |
| --- | --- | --- |
| Idle | Challenge not started | Shows the starting world and what is missing |
| Live | While wiring or tuning | Scene reacts continuously to current values, even before correct |
| Success | Validator passes | One-shot celebration plus a persistent improvement to the world |
| Fail | Validator rejects | Shows the cause physically (cool core stalls, orbit spirals out) rather than just turning red |

Rules:

- Visuals read validator residuals and margins, so the picture matches the model.
- Success plays once automatically on first pass, then is replayable. The world keeps the improved state afterwards.
- No animation can set or change completion status.
- **Accessibility:** a reduced-motion setting replaces motion with an equivalent static before/after; no flashing above 3 times per second; sound is optional and off by default on first visit.
- **Performance:** target a smooth frame rate on a mid-range phone, cap particle counts, degrade gracefully on low-spec devices, and use no remote assets so the offline PWA keeps working.
- Every animation is skippable.

## 4. Animation catalogue

One line per challenge: what the player sees while wiring (Live) and when it passes (Success). All of these are proposals for review.

### Day 1: Genesis 1:3 (7 challenges)

| # | Challenge | Payoff |
| --- | --- | --- |
| 1 | Hydrogen fuel | Hydrogen cloud density follows fuel value. Success: cloud swirls inward, glows, fuel ring completes. |
| 2 | Gravity | Cloud collapse speed follows gravity strength. Success: cloud condenses to a dense ball with ripple rings. |
| 3 | Core conditions | Core colour warms from dull red toward white as temperature and pressure rise. Success: core reaches ignition glow. |
| 4 | Fusion | Reaction rate drives a flicker at the core. Success: ignition flare with rays. |
| 5 | Hydrostatic equilibrium | Inward gravity arrows versus outward pressure arrows. The star wobbles, then settles. Fail: collapses or balloons. |
| 6 | Thermal equilibrium | Energy-in and energy-out meters. Surface brightness steadies. Fail: pulsing overheat or fading. |
| 7 | Sustained stable star | Fast-forward clock over a steady shine. Success: stable star, and a light beam toward Day 2. |

### Day 2: Genesis 1:6 (8 challenges)

| # | Challenge | Payoff |
| --- | --- | --- |
| 1 | Gravity | A gas layer clings to the planet; weak gravity lets it drift away. |
| 2 | Atmospheric pressure | The sky layer thickens; a barometer reads the value. |
| 3 | Incoming light | Sunlight rays strike the planet and the day side lights up. |
| 4 | Temperature balance | A thermal map shifts from ice-blue to red; a balance arrow centres. |
| 5 | Liquid water | Oceans fill when temperature is in band, or turn to ice or vapour when it is not. |
| 6 | Evaporation | Vapour rises from the sea surface at a rate following temperature. |
| 7 | Clouds and rain | Clouds form and rain falls, closing the water loop. |
| 8 | Climate and water-budget stability | A time-lapse of the water cycle with steady sea level. |

### Day 3: Genesis 1:9–11 (12 challenges)

| # | Challenge | Payoff |
| --- | --- | --- |
| 1 | Interior layers | A cutaway shows core, mantle and crust forming. |
| 2 | Radiogenic and primordial heat | Interior glow that slowly decays over time. |
| 3 | Heat transport | Convection currents circulate in the mantle. |
| 4 | Plates | The crust cracks into separate plates. |
| 5 | Plate movement | Plates drift with direction arrows. |
| 6 | Uplift and volcanism | Mountains rise and a volcano erupts. |
| 7 | Sea level | Shorelines shift and land emerges. |
| 8 | Rivers | Rivers carve from mountains to the sea. |
| 9 | Soil | Bare rock weathers into a soil layer. |
| 10 | Photosynthesis | Light turns into a green glow and rising oxygen bubbles. |
| 11 | Plant populations | Green cover spreads and grows. |
| 12 | Geological and ecological stability | A time-lapse of stable continents and forests. |

### Day 4: Genesis 1:14 (12 challenges)

| # | Challenge | Payoff |
| --- | --- | --- |
| 1 | Gravity | Field lines and the pull on a test mass. |
| 2 | Orbital speed | A planet with a speed trail. Too slow spirals in; too fast flies out. |
| 3 | Earth orbit | Earth completes a loop and its trail closes. |
| 4 | Eight planets | Planets light up one by one from Mercury to Neptune. |
| 5 | Encounters and integration | A close encounter perturbs an orbit and trails stay bounded. |
| 6 | Orbital stability | A long time-lapse with tidy trails. Fail: a planet is ejected. |
| 7 | Rotation | The day and night terminator sweeps across the planet. |
| 8 | Moon | The Moon orbits and raises a tidal bulge. |
| 9 | Lunar phases | A phase strip updates as the Moon orbits. |
| 10 | Axial tilt and seasons | The tilted planet shows changing light angle and seasonal colour. |
| 11 | Calendar | A year clock ticks, including leap-year correction. |
| 12 | Orbital and environmental audit | A full orrery with every check turning green. |

### Day 5: Genesis 1:20 (12 challenges)

| # | Challenge | Payoff |
| --- | --- | --- |
| 1 | Underwater light | Light shafts dim with depth. |
| 2 | Oxygen | Bubbles rise and an oxygen gauge fills. |
| 3 | Nutrients | Nutrient plumes upwell from the deep. |
| 4 | Plankton | A plankton bloom spreads and glows. |
| 5 | Trophic energy | An energy pyramid fills level by level. |
| 6 | Fish | Shoals appear and school. |
| 7 | Lift | Lift arrows on a fin or wing change with speed and area. |
| 8 | Flight energy | A flap-by-flap energy budget bar. |
| 9 | Birds | Birds take off and glide. |
| 10 | Connected food webs | Web lines light up between species. |
| 11 | Biodiversity | Species tiles fill in. |
| 12 | Multigeneration stability | A time-lapse of stable population cycles. |

### Day 6: Genesis 1:24–27 (14 challenges)

| # | Challenge | Payoff |
| --- | --- | --- |
| 1 | Habitat | Land patches fill with suitable cover. |
| 2 | Herbivores | Grazers move across the cover and the cover regrows. |
| 3 | Predators | Predator and prey counts oscillate in step. |
| 4 | Biodiversity | Species count and balance indicator rise. |
| 5 | People | A small settlement appears. |
| 6 | Food | Fields and a supply-versus-need bar. |
| 7 | Freshwater | A water source feeds the settlement; a supply gauge fills. |
| 8 | Land allocation | A map re-colours as land is divided between uses. |
| 9 | Energy | Power sources light up against demand. |
| 10 | Waste | A waste flow is reduced and recycled. |
| 11 | Conservation | Protected areas shade in and species recover. |
| 12 | Climate and carbon | A carbon gauge and a temperature trend line. |
| 13 | Resilience | A shock is applied and the world recovers. |
| 14 | Six-day planetary audit | The whole six-day world appears as one living planet, with World Challenge Mode unlocked on success. |

## 5. Play modes

All modes run in a sandbox that does not affect day completion unless a rule below says otherwise.

### 5.1 Break-it mode

Change a key quantity, watch what fails, then fix it.

- Each day exposes a small set of perturbation controls, for example gravity, stellar mass, albedo, axial tilt or fish population.
- The perturbation applies to a saved copy of the player’s working graph, so the original is never lost.
- Failing checks highlight with their cause, so the player sees what broke and why.
- Goals: **Free break** (explore), **Fix in N edits** (a par target), or **Survive the shock** (hold stability for a set simulated time after a disturbance).

### 5.2 Predict-then-run

Tests knowledge before the answer is revealed.

1. A scenario card asks a question, for example ‘What happens if the star is twice as massive?’
2. The player commits to an outcome (direction of change, or one of several outcomes).
3. The simulation runs with the visible animation.
4. A reveal compares prediction with result and gives a short explanation.

Rules:

- **The correct answer comes from running the real model,** never from a hard-coded key. Each scenario needs a test that the outcome is robust across a sensible parameter range, so the answer does not flip on small changes.
- Optional confidence dial (‘how sure are you?’) for extra stars.
- Example scenarios: Day 1, a more massive star; Day 2, higher albedo; Day 3, faster cooling; Day 4, a heavier planet at the same distance; Day 5, less light at depth; Day 6, more land given to farming.

### 5.3 Fix-the-world puzzles

Handcrafted broken graphs, each with one deliberate flaw (extending the existing ‘nearly working’ and ‘unstable’ presets).

- Flaw types: swapped inputs, a wrong unit, a missing link, a value out of band, an unstable parameter.
- Each puzzle has a par number of edits and a three-step hint ladder. Hints cost stars.
- Examples: Day 1 radiation too high; Day 2 albedo so high that the planet freezes (‘snowball’); Day 4 orbital speed one factor off.

### 5.4 Mini-challenges (about 60 seconds, one concept)

Untimed by default. An optional timer exists for players who want it.

- Light the star
- Hold the orbit
- Balance the star (hydrostatic)
- Find the habitable zone
- Make it rain
- Tilt for seasons
- Pull the tides
- Stop the snowball
- Raise a mountain
- Bloom the plankton
- Fill the food pyramid
- Just-right oxygen

### 5.5 Share links

A student sends a broken world to a friend to fix, with no accounts.

- The link carries the graph in the URL fragment: a compressed, URL-safe encoding of a versioned JSON payload (schema version, day, challenge, graph, parameters, mode, optional short message). No personal data.
- On open, the app **validates before use**: schema check, size cap, unknown node types rejected, custom formulas go only through the existing restricted parser (never evaluated as code).
- A friendly landing screen shows ‘Someone sent you a broken world. Can you fix it?’
- A copy-link button and optionally a QR code. Scores stay local.

## 6. Scoring and achievements

**Stars (separate from completion)**

- ★ Challenge passed.
- ★★ Passed within par nodes or edits.
- ★★★ No hints used and the Goldilocks band reached (section 7).
- Speed counts only in optional timed mini-challenges, so slower thinkers are not penalised in the main game.

**Achievements (stored locally)**

- *First Light:* complete the starter level.
- *Too Hot to Handle:* create an unstable star.
- *Snowball:* freeze a planet.
- *Venus Mode:* run a planet into runaway heat.
- *Century World:* hold a world stable for 100 simulated years.
- *Long Haul:* hold a world stable for 1000 simulated years.
- *Eight Wonders:* keep all eight planets stable.
- *Sharp Eye:* five correct predictions in a row.
- *Wrong Again, Right Next Time:* get a prediction wrong, then right on the same topic.
- *Minimalist:* solve a challenge in the fewest nodes.
- *Fixer:* repair a shared world.
- *No Hints Day:* finish a day without hints.
- *Goldilocks:* reach the perfect band on a day.

## 7. Replay and the Goldilocks solution

**The idea.** Passing means being inside the acceptable range. The Goldilocks solution means being just right: centred in the band, stable for a long time, and efficient. Each day gets a score for how close the world is to that target.

**How it is scored**

- Each validator check returns a **margin**: 1 at the centre of its target band, 0 at the pass threshold.
- **Goldilocks score** = weighted average of check margins, multiplied by a stability factor (length of stable run) and an efficiency factor (fewer nodes).
- Tiers: **Pass**, then **Silver**, then **Gold (Goldilocks)** for a score above a set threshold.
- Because margins come from the same validators, scoring is deterministic and testable.

**How it looks.** Every important quantity gets a Goldilocks meter: too low, just right, too high. The marker slides along it and sparkles when it is centred.

**Candidate Goldilocks targets per day** (each must be defined by the physics validator and recorded in the Source of Truth):

| Day | What ‘just right’ means (in the model) |
| --- | --- |
| 1 | Core temperature and luminosity centred, hydrostatic and thermal residuals near zero, long stable lifetime |
| 2 | Surface temperature centred in the liquid-water band, albedo and greenhouse in balance, evaporation equal to rainfall |
| 3 | Heat flow and plate speed in band, a healthy land and ocean fraction, soil and plant growth in balance |
| 4 | Near-circular orbits, a period that suits the calendar, tilt giving moderate seasons, a tidal Moon |
| 5 | Oxygen in a healthy band, efficient energy transfer, high biodiversity |
| 6 | Population within carrying capacity, balanced land allocation, carbon in band |

**Where replay comes from**

- **Chase Gold.** Improve a passed day’s Goldilocks score, which is a clear and measurable goal.
- **Coupled worlds.** A better Day 1 star gives steadier conditions on Day 2, and so on. Small errors carry forward as visible ‘drift’, so improving an upstream day improves the whole world. This builds on the existing dependency-aware revalidation in the Source of Truth.
- **Other worlds.** Scenario variants where the Goldilocks band moves: a cool red dwarf, a hot blue star, a Mars-like world, a Venus-like world, a water world. Players must re-derive what ‘just right’ means.
- **Daily world.** A deterministic seed from the date varies the star and planet within safe ranges, the same for everyone, with no server needed.
- **World grade.** A landing-screen grade for the whole world; a Gold six-day world also feeds World Challenge Mode.

Caveat: Goldilocks bands are defined by the educational models, not claims about real planets or about the literal Genesis chronology. Each band and its tolerance should be documented with the challenge.

## 8. Difficulty levels: GCSE and A Level

Both levels use the same challenges and engine, changing only these modifiers:

| Element | GCSE | A Level |
| --- | --- | --- |
| Graph start | Pre-wired or partly wired, fewer nodes to place | Blank graph |
| Hints | On, plentiful | Few, or off |
| Units and tolerances | Wide tolerances, units guided | Tight tolerances, units enforced |
| Predict-then-run | Qualitative (up, down, same) | Numeric within a stated tolerance |
| Break-it | Gentle perturbations | Larger and compound perturbations |
| Extras | None | Add measurement error, fit a relationship to data |
| Stars | Same rules, easier par and Gold thresholds | Stricter par and Gold thresholds |

## 9. Build order and acceptance

| Step | Deliver | Done when |
| --- | --- | --- |
| 1 | Payoff contract and the starter level (Day 1, challenge 1) | A new player reaches the success animation in about 90 seconds; animation is driven by validator output |
| 2 | Payoffs for Day 1 challenges 2 to 7 | All seven play live, success and fail states; reduced-motion path works |
| 3 | Break-it mode and predict-then-run for Day 1 | Predictions are checked by running the model; originals are never overwritten |
| 4 | Stars and the Goldilocks score for Day 1 | Margins are deterministic and covered by tests |
| 5 | Share links | Valid links open and invalid or oversized links are rejected safely |
| 6 | Fix-the-world puzzles and mini-challenges | At least one puzzle and one mini-challenge per implemented day |
| 7 | Achievements | Stored locally and never affecting completion |
| 8 | Payoffs, Goldilocks and variants for Days 2 to 6 | Each day delivered only once its validator exists |

## 10. Risks and open questions

- **Validator readiness.** Days 2 to 6 only have starter labs today. A payoff cannot be honest until the matching validator exists, so animation work follows validator work.
- **Model limits.** Predict-then-run answers must match what the educational model produces. A one-zone, solar-calibrated star may not reproduce real-star scaling, so every scenario needs a robustness test.
- **Performance.** Particle effects need budgets and fallbacks on older school devices.
- **Scope.** The catalogue covers 65 challenges. Consider delivering one day at a time, each fully polished.
- **Faith framing.** Keep the existing statement that these are educational approximations, and consider an optional neutral skin for schools that need one.
- **Assumption.** This addendum was written from the README and Source of Truth, not from the code. The rendering layer, state schema and existing tutorial steps should be checked before estimating effort.
