# Web Studio v3.28 — Five-Engine Major Preview

**Testing branch:** `preview-personalweb` only  
**Human testing site:** https://preview-personalweb.sudip-das-frontend.pages.dev/  
**Six-theme audit:** https://preview-personalweb.sudip-das-frontend.pages.dev/?theme-audit=1  
**Production `main`:** unchanged; no promotion without explicit owner approval.

## Five coordinated engines

| Engine | Major improvement | Scope |
|---|---|---|
| **Theme** | One six-theme presentation contract, stable identity tokens, synced state, compact accessibility controls and low-power policies | Whole website |
| **Hero Display** | Original six art-directed layouts preserved, Eco and Off also stop decorative animation, late theme changes propagated | Top hero only |
| **Atmosphere** | Sitewide viewport GPU light reacts to pointer and scroll position; calendar-day variation without visitor tracking. Original WebGL2 → Canvas 2D → CSS → Off fallback stays | All eight sections |
| **Quick Menu** | Language-aware active-section feedback, Alt+Shift+Q keyboard shortcut, Escape-to-close, focus restoration and direct project search | Floating quick menu |
| **Portfolio** | Stable English source index + localized text search, stable category focus filters, optional alphabetical/featured sort, accessible live result counts, reset | Public Projects |

All visual styles use **distinct per-theme materials, contrast, geometry, edge radii and animation rules**. The new shared stylesheet styles existing control surfaces across the page; it does not replace the approved Neon hero nor the protected Editorial gold master.

## Original opt-in Atmosphere sound

The Atmosphere panel has new optional **Interface sounds**, **Ambient music** and **Volume** controls. Both options are **off by default**; the browser's AudioContext is not even created on ordinary page load. Enabling sound is an explicit user click. Sound effects are short, throttled interface cues and ambient music is synthesized from an original five-note tone sequence, with a different timbre and scale for each of six themes. There are no external tracks, API requests, microphones, recordings or copyrighted compositions. Stop/mute and hidden-tab suspension work without a network connection.

The audio engine does **not** provide hardware ray tracing or a full audio mixer; it is a deliberately lightweight original soundscape with a separate manual activation gate.

## Ten-language localization

The original localization set remains: English, Hindi, Bengali, Spanish, French, German, Portuguese, Arabic, Simplified Chinese and Japanese.

**64 targeted translated phrase mappings** are now supported: 61 newly introduced keys and three previously supported keys retained. Coverage now explicitly includes Atmosphere modes/descriptions, audio opt-in and status, project filters/sorting, GitHub public repo summaries and accessibility text.

The supplemental translator also now processes `input` placeholders and `select` ARIA attributes correctly. A separate dynamic formatter localizes project-result totals, reading progress, and public GitHub/recent repository counts. All translations remain local and are not sent to a remote service.

## Source verification executed

Run these source and mocked-DOM regressions at the repository root:

```sh
node scripts/verify-hero-display-v328.mjs
node scripts/verify-atmosphere-v328.mjs
node scripts/verify-five-engine-v328.mjs
node scripts/verify-github-hero-v324.mjs
```

Validated against this preview source:

- Hero Display: **55/55**
- Atmosphere GPU fallback and scroll theme switching: **43/43**
- Five-engine state, ten-language rows, keyboard Quick Menu, audio opt-in: **70/70**
- Existing GitHub hero explorer: **38/38**

These suites use browser-like mocks. They verify source and simulated behavior, **not physical GPU shader compilation, real sound hardware, screenshots, web vitals, current public GitHub API response, or Cloudflare deployment**.

## Human CI — 42 manual acceptance checks

1. Hard refresh the preview, inspect source meta `portfolio-visual-build` and confirm `preview-five-engine-mesh-i18n-audio-v3.28.0`.
2. Compare the full hero and below-hero visual language across Orbit, Editorial, Terminal, Aurora Peak, Neon Studio and Cosmic. Check their own geometry, typography, panels, colors, effects and unique identity.
3. Test 320px, 390px, 768px, 900px, 1440px and 1920px widths. Look for portrait clipping, navigation overflow, menu collisions, broken project cards, and unclickable buttons.
4. Scroll across **Introduction, About, Projects, Experience, Strengths, Contact, WebStudio showcase and Footer** with Atmosphere enabled. Check the effect still exists below the hero and is appropriate for the selected theme.
5. Set Cinematic, Balanced, Eco, Off and Auto on different themes. On a computer with WebGL2, inspect developer tools for shader compilation failures or excessive GPU use. No claim is made that a device supports Cinematic without checking.
6. Confirm there is **no music or interface sound before opting in**. Enable Interface sounds, try buttons, tabs, Quick Menu and project actions; then enable original Ambient music and change themes. Adjust Volume, stop, test hidden-tab behavior and audio-unavailable fallback. The page must not unexpectedly autoplay on reload.
7. Use **Alt+Shift+Q** to open Quick Menu and Escape to close. Check tab keyboard arrows, selected state, the active-section description, theme buttons, and project-search shortcut.
8. Search a public project in English, then change to Hindi/Bengali/etc. and search again. Confirm filtering still works even after visible card descriptions change. Test Linux/AI/Web focus, alphabetical sort, featured reset and zero-results.
9. Check all **ten** languages, including translated Atmosphere/audio labels, GitHub panel statistics, project sort and input placeholder, ARIA labels, numeric project counts and reading-progress percentage. Test Arabic RTL in particular.
10. Open `?theme-audit=1` and run computed-style six-theme checks. Export `webstudio-theme-audit-v3.28.json`, `webstudio-preview-diagnostics-v3.28.json`, and `webstudio-human-ci-v3.28.json`. Attach screenshots and precise reproduction steps for any failure.
11. Check contact and private-request safety, content preservation, external link targets, translation switching back to English and reduced-motion/low-power fallbacks.
12. Do not promote to production until the human CI review and any discovered regressions are resolved.

## Important delivery boundary

Changes are committed to the GitHub `preview-personalweb` testing branch. Cloudflare Pages may deploy automatically if the Pages project's Git connection and build rules are configured, but GitHub commits **do not by themselves prove the public testing URL has updated**. Browser rendering, audio quality and physical-device performance remain to be verified by the owner.
