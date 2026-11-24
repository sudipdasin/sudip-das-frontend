# Web Studio v3.27 — Hero Display Layout Engine

**Source branch:** `preview-personalweb`. **Production:** `main` unchanged.  
**Human testing URL:** https://preview-personalweb.sudip-das-frontend.pages.dev/  
**Six-theme browser audit:** https://preview-personalweb.sudip-das-frontend.pages.dev/?theme-audit=1

## Corrected scope

**Hero Display Layout Engine** is the complete **top portfolio region**: decorative background, eyebrow, prominent name, role headline, description, original hero action buttons, original introduction-video tile, dynamic GitHub button, geographic availability note, portrait and portrait ornaments. This is **not** an explorer popup or a replacement for the established About/Projects/Contact sections.

The unrelated, unlinked `hero-explorer-engine-v326.js` proof of concept has been deleted. No extra hero dialog was shipped.

## Architecture

The new `hero-display-engine-v327.js` reads six immutable visual profiles and mounts one `aria-hidden`, pointer-transparent decorative stage inside the existing `main > .hero`. It never replaces personal copy, portrait source, video, contact links or interactive buttons. The independent style module `hero-display-layout-v327.css` owns the composition, shape, light, materials and breakpoints.

Theme changes use the existing `#theme-select` and body `data-theme` signals. The engine observes theme and Atmosphere changes, responds to element size without requiring full-screen layout reflow, reports wide/stacked/compact modes, and suspends its small CSS ambient animations when the section is offscreen, device is low-powered, Data Saver is active, Atmosphere is Off or reduced motion is requested. It makes no network calls, saves no personal data, and creates no new canvases.

The engine exposes a read-only **`window.__wsHeroDisplay327.getStatus()`** for diagnostics.

## Six individually art-directed hero designs

| Theme | Compositional identity | Portrait / scene |
|---|---|---|
| **Orbit** | Ocean-teal mission control with a coordinate rail and rings | Orbital aperture, circular portrait and technical lightlines |
| **Editorial** | Warm magazine lead, serif rhythm and copper print rules | Tall photographic folio, minimal static contours |
| **Terminal** | Bordered Linux-like command screen, sharp green grid | Square console portrait frame and clear CLI accents |
| **Aurora Peak** | Full-width layered alpine atmosphere, field notes and sunrise | Original mountain landscape and arched portrait preserved |
| **Neon Studio** | Approved neon-tech reference, soft glass and dual-color glow | Original portrait, ring sizing and mobile spacing protected |
| **Cosmic** | Night observatory with starfield, violet trajectory and depth | Orbital portrait framing with restrained stellar motion |

The layouts use distinct background geometry and typographic/material treatments—not just palette switching.

## Verify in source

```sh
node scripts/verify-hero-display-v327.mjs
```

The source and simulated-DOM gate passed **54/54 tests**, including all six theme transitions, original portrait/actions preservation, browser-free theme identity, mobile/desktop density, Atmosphere Off, reduced-motion, low-power modes and stage idempotence.

**This is not real-browser screenshot validation.** The Cloudflare URL is not reachable to the current verifier, and the result does not establish that CSS stacking, portrait alignment or GPU backdrop layers are visually correct in Chrome, Safari and Firefox.

## Human CI acceptance (32 items in console)

1. Confirm the served page has build marker `preview-six-theme-hero-display-v3.27.0`.
2. Use the Theme selector to inspect all six hero layouts. Compare the shape, typography, backdrop, portrait treatment and spacing, not only colors. Check that returning to Neon does not change its approved profile composition.
3. Examine at desktop 1440/1920px, tablet 768/900px, and mobile 320/390px. Capture screenshots of the **entire hero including buttons and image**. Look for clipped portrait, floating controls, overlapping headline/actions, background over text, horizontal overflow or lost content.
4. Open the existing GitHub hero preview; exercise hover, tap, Tab and Escape. Open the intro-video tile/inline video and check controls, transcript and playback. These should sit above noninteractive decorative layers.
5. Switch to Editorial to confirm static print styling; Terminal to confirm the green command frame; Aurora Peak to confirm the existing mountains, sunrise, arched photograph and field notes have not disappeared.
6. Toggle Atmosphere Auto/Cinematic/Balanced/Eco/Off. The Hero Display ornaments must stop moving for Off, Eco, low-power and reduced-motion settings. In Off, new background glows/traces disappear while the base theme remains readable.
7. Open `?theme-audit=1` and run the browser-computed six-theme checks. Review the structural results in Human CI → Browser diagnostics. Export the local JSON reports and include actual screenshots for visual feedback.
8. Verify no sensitive/private requests, accounts or telemetry became accessible, and no new modal or duplicate hero elements appear after repeated theme switching.

Expected report names: `webstudio-human-ci-v3.27.json`, `webstudio-preview-diagnostics-v3.27.json`, `webstudio-theme-audit-v3.27.json`.

## Release gate

Verified source is committed on `preview-personalweb` only. **Real-device CSS/pixel reviews, Cloudflare branch deployment and CI status remain independently unverified.** Do not promote to production `main` without explicit human review and owner approval.
