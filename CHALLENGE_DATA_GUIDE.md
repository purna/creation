# Challenge definitions v1
Generated from SOURCE_OF_TRUTH_v10.md and IMPLEMENTATION_PLAN_v10.md.
- 65 challenges, each with a separate Level 2 GCSE and Level 3 A Level JSON: 130 files in public/challenges/day-N/level-N/.
- public/challenges/manifest.json lists every challenge.
- public/i18n/en.json holds challenge instructions, hints and UI text separately for future language packs.
- src/challenges/catalog.ts provides loaders and multi-objective scoring helpers.
- Level 2: guided, 3 hints, shorter test, suggested score 60/100.
- Level 3: advanced, 1 hint, longer test, sensitivity and uncertainty, suggested score 80/100.
- Feasibility/stability/efficiency/resilience weighted 35/30/20/15 are provisional design choices, **not universal physical constants**.
- No single solution is definitive. Preserve best valid snapshots; changing earlier days makes affected later evidence stale and requires revalidation.
- IMPORTANT: The JSONs are **definitions only**, not 130 functioning solvers. All validators are explicitly marked not-implemented and do not award completion. Gameplay integration, physical solvers, persistence and revalidation remain to be implemented.
