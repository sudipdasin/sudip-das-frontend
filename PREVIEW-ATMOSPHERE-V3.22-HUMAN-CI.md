# WebStudio v3.22 — Adaptive Atmosphere: Human CI and Technical Specification

**Branch:** `preview-personalweb` (production `main` unchanged).  
**Testing site:** https://preview-personalweb.sudip-das-frontend.pages.dev/  
**Six-theme audit:** https://preview-personalweb.sudip-das-frontend.pages.dev/?theme-audit=1

## What Atmosphere does

The header now contains a universal **Atmosphere** settings control. It is separate from theme selection and works on all six portfolio themes, including the Aurora Peak scenery. The earlier Aurora-only motion toggle is hidden when the shared control is initialized.

| Setting | Actual renderer | Intended hardware |
|---|---|---|
| Auto | Conservative capability-based selection of the tiers below | Recommended default |
| Cinematic | WebGL2 GPU fragment shader, alpha-blended decorative highlights, procedural direct light and analytic ray/sphere occlusion shadows | Modern GPU-capable desktops and eligible mobiles |
| Balanced | Canvas 2D animated gradients, particles, light traces | Mid-range, older GPU and browsers without WebGL2 |
| Eco | CSS-only static gradients; no Canvas or WebGL animation | Old phones, low RAM/CPU, reduced-motion or data-saver |
| Off | Removes the additional rendering layer and pauses selected decorative animation | Minimum usage / accessibility |

**Important technical truth:** This is not full hardware ray tracing of real HTML elements, photographs, or 3D geometry. Cinematic uses WebGL2 procedural fragments with analytically traced decorative spheres and a secondary ray used for occlusion shadows in **Neon Studio, Orbit and Cosmic**. Editorial, Terminal and Aurora Peak use distinct shader-generated lighting and atmospheric patterns. None requires RTX hardware.

## Six distinct scenes

- **Neon Studio:** luminous cyan/magenta photon lanes, glass highlights and analytic light.
- **Orbit:** teal orbital paths, luminous satellites, shadowed sphere and motion.
- **Editorial:** quiet textured paper, grazing sunshine and warm page illumination rather than neon particles.
- **Terminal:** green phosphor scanlines, terminal grid and an efficient moving sweep.
- **Aurora Peak:** mountain sunrise, soft atmospheric haze, layered aurora light curtains.
- **Cosmic:** procedural violet nebula, gravitation-inspired distortion, luminous stars and traced sphere.

## Built-in safety / privacy boundaries

1. Auto only chooses Cinematic for known capable devices (at least 4 GB reported RAM and 6 hardware threads with WebGL2). Unknown device memory is treated conservatively.
2. Cinematic caps rendering to **1152×704 at approximately 22–30 fps**, Balanced caps **800×520 at approximately 18–24 fps**. Actual display size can be larger; only backing render resolution is capped.
3. Frame-time watchdog downgrades rendering after sustained slowdown. Shader compilation failures, unsupported GPU or lost WebGL context fall back to Canvas 2D or CSS.
4. Page visibility and IntersectionObserver suspend frame generation when the page or hero is not visible.
5. Reduced motion or data saver forces Eco; forced-colors accessibility forces Off. Optional Battery Status API, if supported, can force Eco on low charge. Websites cannot directly monitor GPU temperature, thermal throttling or reliably measure actual RAM/GPU capacity.
6. Atmosphere control is keyboard-operable using native `details` and radio inputs, Escape closes the menu, and only the chosen mode is stored locally. No mode, performance or device data is sent to servers.
7. Eco avoids continuous animation and the heavier layer blend mode. Off removes the overlay and stops targeted ambient loops; essential content remains.

## Reproducible verification

From the repository root, run:

```sh
node scripts/verify-atmosphere-v322.mjs
```

The gate exercises source checks and a simulated browser/WebGL matrix. **It does not prove GLSL compilation on real devices, visual quality or deployed Cloudflare content.** Previous verification of this revision: 43/43 offline source + simulated runtime checks, 11/11 simpler simulation cases, and six theme-control palette contrast calculations (all meet at least 4.5:1 for chosen text/panel and accent/panel colors). Review the actual browser rendering separately.

## Human acceptance checklist

1. Hard-refresh the preview and inspect the page-source build marker `preview-adaptive-atmosphere-v3.22.0`. Confirm the **Atmosphere** selector is present in the header.
2. On modern desktop Chrome/Edge with WebGL2, choose Cinematic. Confirm status says **WebGL2 GPU** (or describes an honest fallback), then switch between all six themes and check appropriate distinct motion and materials.
3. Change to Balanced and compare. Check that typography, navigation, photographs, project links, intro film, caption transcript and WebStudio footer remain readable and clickable.
4. Select Eco, then Off. Confirm animations are stopped in Eco; Off removes the atmospheric layer with no blank page, black canvas, freeze or change to personal content. Switch back to Auto.
5. Use a mobile device with its own performance limitations (e.g. 390px and 320px wide). Check no horizontal overflow, no header wrap or dropdown clipping, and reasonable interaction latency.
6. Test reduced-motion (OS accessibility setting), battery saver / data saver if supported, and browser settings with hardware acceleration or WebGL disabled. Record the status text and which fallback actually runs.
7. Use Human CI (25 checks) and attach screenshots/recordings. Export `webstudio-human-ci-v3.22.json`, plus `webstudio-preview-diagnostics-v3.22.json` and/or `webstudio-theme-audit-v3.22.json`.
8. Verify effects pause when the tab is hidden and resume when visible. Test browser zoom, keyboard navigation and reduced contrast. Inspect GPU / CPU / RAM activity with developer tools if available.

## Release conditions

Source changes are in `preview-personalweb`; actual Cloudflare deployment, shader compilation in a real GPU browser, pixel-level screenshot approval, energy consumption, mobile/legacy browser functionality and heat management are **not independently verified** until human CI. Paid CircleCI jobs remain excluded for this preview branch. Keep `main` unchanged; do not promote without explicit approval.
