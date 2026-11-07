# Creation — Testing guide

## Current approach
npm ci; npm run test; npm run build.

## Minimum acceptance checks
- Review the diff and affected entry points.
- Check errors and regressions in changed flows.
- Check desktop and touch/mobile interactions where relevant.
- Validate persistence, data migration and offline behaviour if affected.
- Run only commands actually supported by the repository.
- Record exact commands, pass/fail results and untested scenarios in the PR or commit summary.

## Future automation
Add targeted tests and CI as the project structure permits; do not replace existing deployment workflows.
