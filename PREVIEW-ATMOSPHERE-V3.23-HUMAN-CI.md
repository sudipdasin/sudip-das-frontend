# v3.23 — Sitewide, Six-Theme Atmosphere

**Testing site:** https://preview-personalweb.sudip-das-frontend.pages.dev/  
**Audit:** https://preview-personalweb.sudip-das-frontend.pages.dev/?theme-audit=1  
**Branch:** `preview-personalweb` only. Production `main` remains untouched.

## What changed

v3.22 confined its Atmosphere layer to the top hero and used IntersectionObserver to pause when the hero scrolled off-screen. This meant the rest of the portfolio did not retain atmospheric effects. v3.23 solves that root architectural limitation with **one fixed viewport compositor mounted directly under the document body**, not a canvas whose height equals the whole document.

The renderer now follows scrolling and themes across eight regions:

| Region | Effect position |
|---|---|
| Introduction | Hero-focused lighting and original portrait setting |
| About | Left-oriented section light and theme-specific texture |
| Projects | Project-card illumination / orbital or thematic detail |
| Experience | Lower-left ambient glow and texture |
| Strengths | Upper-right controlled highlight |
| Contact | Contextual warm or theme-specific glow |
| WebStudio showcase | Local stage lighting compatible with the separate theme-specific card design |
| Footer | Low-intensity footer detail |

Each region receives a decorative **noninteractive layer** behind content. The fixed canvas renders only the visible viewport and receives a scroll-derived section parameter, producing different light focal points without allocating enormous page-length textures. The active theme still determines the visual language: Orbit teal arcs, Editorial parchment, Terminal phosphor, Aurora Peak sunrise and mountain hues, Neon Studio cyan/magenta, and Cosmic violet particles.

## Controls and performance guarantees

The existing Atmosphere control retains **Auto, Cinematic, Balanced, Eco and Off** and preserves the selected mode locally. Cinematic uses WebGL2 shaders including analytical ray/sphere light and occlusion geometry where appropriate; Balanced uses Canvas 2D; Eco uses static CSS; Off removes the added canvas and hides all eight section overlays. Reduced motion, data saver, forced colors, battery hints, context-loss fallback and frame-time downgrades remain in effect.

The shader's `u_section` uniform and Canvas 2D light-center variation update on scroll. Scroll checking is scheduled through requestAnimationFrame rather than recalculating on every scroll event. The rendering surface is limited to the viewport (Cinematic 1152 × 704 maximum; Balanced 800 × 520 maximum). Rendering pauses when the tab is hidden; it **does not pause merely because the hero is out of view**.

The paint layers use `pointer-events:none`, preserve the existing positioning and text, and respect accessible contrast/reduced-motion modes. The renderer does not modify the page's personal information or communicate with a server.

## Verification

The new reproducible source and simulated-browser suite:

```sh
node scripts/verify-atmosphere-sitewide-v323.mjs
```

**34/34 checks passed** against the committed preview source, covering section selection, eight mount points, scope, capped viewport rendering, GPU shader initialization, scroll to Projects and Contact, Eco/Balanced/Off/Cinematic transitions and return to Cinematic after Off. The regression exercise also exposed and led to correction of a genuine old-shader reference that had silently degraded GPU rendering.

The six-theme browser audit now checks that all eight zones exist and the compositor is fixed. Browser diagnostics exports the active section and confirms sitewide coverage. Human CI now has **26 checks**, including a dedicated full-page Atmosphere acceptance requirement.

## Human CI acceptance

1. Hard-refresh the preview, inspect the page source for the build marker `preview-sitewide-atmosphere-v3.23.0` and confirm Atmosphere appears in the header.
2. On each of the six themes, select Cinematic (or Auto if more appropriate). Scroll slowly from Introduction through About, Projects, Experience, Strengths, Contact, WebStudio and the footer. Confirm each region has perceptible but legible theme-native lighting.
3. Confirm *Atmosphere* remains active on lower sections; the GPU/Canvas renderer should not disappear when the hero leaves the viewport. Check no horizontal overflow or obscured links, particularly on mobile.
4. Switch to Balanced, Eco and Off while scrolled near the bottom. Eco should stop continuous drawing; Off should remove both fixed and section-local atmosphere effects. Then resume Cinematic or Auto and check no duplicates or stale styles.
5. Switch themes without scrolling to the top. Check that the current section remains correct, visuals match the new theme immediately, and the renderer does not replace real content or interfere with portrait/video controls.
6. Test on mobile (320px, 390px), tablet and desktop, including reduced motion, WebGL disabled, and low-power browser settings where available.
7. Open `?theme-audit=1` for browser-computed checks, then use Human CI to log issues. Export `webstudio-human-ci-v3.23.json`, `webstudio-preview-diagnostics-v3.23.json`, and `webstudio-theme-audit-v3.23.json`; include screenshots, theme, selected mode, section and viewport.

## Important verification limit

These tests verify source structure and simulated browser behavior only. Real GPU shader compilation, actual Cloudflare deployment, mobile energy use, heat, real screenshot fidelity, physical-device performance, captions and end-to-end interactions have **not been independently verified** here. No CI status may be represented as passed without an actual run. Existing preview noindex, disabled private API, anti-framing policy and CircleCI-cost exclusion remain preserved. Do not promote this preview to production without human testing and approval.
