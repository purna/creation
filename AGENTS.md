# Creation — AI agent instructions

Read ARCHITECTURE.md, FEATURES.md and TESTING.md before making changes. Inspect the actual implementation first; do not assume frameworks, file paths or scripts.

## Development workflow
1. Identify affected files, acceptance criteria and existing behaviour.
2. Make the smallest compatible change; avoid duplicate services and unnecessary dependencies.
3. Preserve persistence formats, existing features and deployment configuration.
4. Add or update relevant tests; run supported checks and report their actual results.
5. Update FEATURES.md, ARCHITECTURE.md (if needed) and CHANGELOG.md.
6. Commit focused changes with descriptive messages. Prefer a feature branch for risky changes; never force push or merge without review.

## Project-specific context
Physics challenge graphs, reusable mathematical nodes, GCSE/A Level validators, simulations, autosave, mobile touch input. Preserve saved graph formats and assessment contracts.

## Testing baseline
npm ci; npm run test; npm run build.
