# v1.2 release notes — Day 1 priority
- Added solar-calibrated one-zone star parameters and seven physics validation checks, with bounded 240-step integration and explicit approximation warnings.
- Added Day 1 → Day 2 unlock on successful stability checks; Days 3–6 still require future validators.
- Added IndexedDB saved-world store and migration from existing graph localStorage saves.
- Added Firebase Auth Google/GitHub and Firestore manual cloud save/restore, gated by Firebase web config and provider setup.
- Added PNG PWA install icons, maskable icon and service worker cache bump.
- **Limitations:** star validation uses dedicated controls, not yet graph-linked typed nodes; no full astrophysical simulation; cloud sync is explicit rather than automatic and no multi-device merge; Firebase needs external console setup; Day 2–6 validators remain future work.
