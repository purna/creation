# Creation — AI instructions

## Context loading (minimise tokens)
Read this file first. Inspect only files relevant to the request. Open `ARCHITECTURE.md` for cross-module work, `FEATURES.md` for roadmap/status questions, and `TESTING.md` for unfamiliar checks. Do not load every document by default or repeatedly summarise the entire repository.

## Implement
- Reuse existing graph engine, node definitions, physics validators, Three.js and Firebase services; avoid duplicate systems.
- Preserve GCSE/A Level separation, assessment contracts, saved graph formats, offline behaviour and touch controls.
- Prefer focused patches and targeted tests; avoid unrelated rewrites and new dependencies.
- For substantial changes, state acceptance criteria and affected modules briefly before editing.

## Verify and report
- Run relevant Vitest tests and `npm run build` when available; never claim unrun checks passed.
- Update `FEATURES.md` only when status changes, `ARCHITECTURE.md` only when interfaces change, and `CHANGELOG.md` only for meaningful user-facing changes.
- Summarise changed files, checks/results, remaining issues and commit SHA concisely.
- Use focused commits; use branches for risky changes. Do not force push.
