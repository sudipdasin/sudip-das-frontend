# WebStudio v3.21 — Six-Theme Experience & Human CI

**Testing branch:** `preview-personalweb`  
**Review website:** https://preview-personalweb.sudip-das-frontend.pages.dev/  
**Browser audit:** https://preview-personalweb.sudip-das-frontend.pages.dev/?theme-audit=1  
**Production:** `main` remains protected and unchanged.

## What this update delivers

1. **Theme-native WebStudio footer:** five separately composed footer designs and nested demo/interest controls. Neon Studio retains its approved reference presentation; the other designs have individual typography, materials, corners, ornaments, button fills and media panels.
2. **Shareable theme reviews:** a URL with `?preview_theme=editorial`, for example, selects the requested theme after initialization (only six known IDs are accepted). If a valid section anchor is present, the copied link includes it too.
3. **Local browser diagnostics:** inside the Human CI panel, expand *Browser diagnostics and reproducible review link* and click **Check this viewport**. It checks theme synchronization, overflow, footer markup, missing loaded images, minimal control sizes, palette contrast and theme art. Export the JSON or copy the exact theme link. No network submission or tracking.
4. **Human CI usability:** v3.21 requires fresh review results; old notes may be recovered but previous PASS scores cannot certify this build. Escape closes the panel and returns keyboard focus.
5. **Reproducible source verification:** `node scripts/verify-preview-experience-v321.mjs` runs 36 zero-dependency static checks. Separately, the opt-in six-theme browser audit checks footer materials, controls and contrast for each selected theme.

## Visual contract and required manual checks

| Theme | Expected footer visual identity | Accent | Ornament |
|---|---|---|---|
| Orbit | Rounded technical instrument panel | Teal | Dashed orbital rings |
| Editorial | Warm serif magazine folio | Copper brown | Flat W paper panel; no rings |
| Terminal | Dark green command-console module | Mint green | Sharp square glyph; no rings |
| Aurora Peak | Alpine landscape / arched panel | Lichen | Arch-shaped W; no rings |
| Cosmic | Dark violet nebula portal | Lavender | Purple cosmic rings |
| Neon Studio | Approved and unchanged original | Cyan | Original reference composition |

In **all six**, open *Explore the inline demo*. Switch chapters, use previous/next and Close/Escape. Check that text, chapter tabs, outlines, buttons, the optional contact disclosure and its disabled private submission workflow inherit the selected style. The request must remain disabled on preview.

Test at **1440–1920px desktop**, **768–900px tablet**, and **320/390px mobile**. Look for clipping, horizontal overflow, low contrast, hidden buttons, focus loss, ornamental overlap, inappropriate animations and unresponsive media controls. Verify the portrait, video/captions, portfolio search and shortlist remain functional.

## Reproducible feedback

- Switch to the theme and section where the issue occurs.
- Open Human CI → Browser diagnostics. Run checks and export `webstudio-preview-diagnostics-v3.21.json`.
- Click *Copy theme link* and paste it with the screenshot and expected-versus-actual description.
- Complete the 20 Human CI checks, add any issues and export `webstudio-human-ci-v3.21.json`.
- For a full six-theme computed-style pass, open `?theme-audit=1` and export `webstudio-theme-audit-v3.21.json`.

## Verified vs pending

**Verified against committed GitHub source:** 36/36 reproducible source-gate assertions, 30/30 integration invariants, JavaScript syntax parsing; no new external media or telemetry. A simulated DOM harness exercised diagnostic activation and theme link handling; this is **not** an end-to-end deployed-browser test.

**Not independently verified:** Cloudflare branch deployment status, actual painted pixels and responsive rendering, real keyboard accessibility across browsers, real-device touch behavior and video/caption playback. The preview URL is not reachable from the current development environment.

**Safety:** `window.PUBLIC_API_BASE=""`, `PORTFOLIO_PREVIEW_MODE=true`, noindex, anti-framing headers and the existing CircleCI filter for this preview branch must remain intact. No automatic production promotion.
