# BEFORE ADAM — v1.1 Implementation Notes
Date: 2026-10-30

## Delivered in this release
- New landing screen with Creation branding, Begin Creation and installation affordance where supported.
- Accessible loading spinner and reduced-motion fallback.
- SVG favicon linked in HTML; web manifest and scoped service worker for offline repeat visits.
- Update modal when a replacement service worker is waiting; Update now/Later and local graph save before reload.
- Day 1 available; Days 2–6 locked for new players. A locked day cannot be selected through the normal UI. Challenge completion is **not yet implemented**; no arbitrary button can unlock days.
- Existing Day 1 calculator and node editing remain available, along with previously implemented Day 4 code for later phases.

## Not yet delivered
- Stable-star physics and seven Day 1 validators, so Day 2 cannot legitimately unlock yet.
- Firebase Google/GitHub sign-in, Firestore saves and IndexedDB storage. Existing graph autosave remains localStorage only.
- PNG 192/512/maskable install icons. SVG manifest icons may be insufficient for installation on some browsers.
- Detailed Day 2–6 physics and 65 validation contracts.
- Automated device/browser tests. CI build result is the initial smoke test.

## Security and release follow-up
- Do not enable cloud login before obtaining a Firebase project configuration, enabling Google/GitHub providers and deploying Firestore security rules.
- The service worker is scoped to /creation/ and excludes cross-origin network calls and Firebase auth callbacks.
- PWA install support varies; Android Chrome typically expects 192/512 PNG icons, so generate and add them in the next iteration.
- Add IndexedDB and real challenge evidence before any unlock becomes persistent.
