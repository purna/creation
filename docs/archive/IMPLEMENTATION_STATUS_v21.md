# v2.1 challenge integration
- Loads the JSON challenge manifest and English language pack asynchronously.
- Challenge panel shows 65 challenge definitions split by day and Level 2/3, with contextual objectives.
- Maps the seven existing Day 1 physics checks to challenge evidence; Days 2–6 map **one** existing starter lab each to a preliminary check. Other challenges remain unimplemented and never pass automatically.
- Saves scored attempts and best valid snapshots in localStorage.
- Editing an earlier day marks recorded later-day evidence stale.
- Fixes TypeScript narrow tuple concat that broke v2.0.1 build.
- Current scoring for starter checks is binary 0/100 and **not yet genuine continuous multi-objective optimisation**. Cross-day solver coupling, detailed scientific validators, and durable cloud sync of the new ledger remain future work.
