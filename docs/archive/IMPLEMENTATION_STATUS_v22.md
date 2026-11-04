# v2.2 Coupled optimisation
- New shared world model couples Day 1 luminosity and Day 4 orbit to stellar flux and grey-body equilibrium climate, then Day 2 water temperature/pressure and Day 3 gravity to water suitability, photosynthesis potential and Day 6 effective carrying capacity.
- Live panel shows continuous 0–100 exploratory world quality and individual dimensions.
- Existing supported challenge checks now receive continuous quality scores rather than only 0/100, while validation remains based on existing physics/starter constraints.
- Earlier-day edits mark downstream evidence stale only when the upstream graph fingerprint actually changes.
- Existing best valid attempts remain in the local ledger.
- Educational limitations: fixed albedo, greenhouse offset and heuristic suitability curves; not a full climate/ecology solver. No automatic validation of 65 challenges. Cross-day metrics inform scoring and display but do not yet replace each node-graph solver or cloud-sync the ledger.
