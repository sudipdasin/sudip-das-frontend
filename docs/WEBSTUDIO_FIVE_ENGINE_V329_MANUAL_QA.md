# WebStudio v3.29.0 — Five-Engine Integration / Manual CI Handover

**Status:** source committed to `preview-personalweb`; manual browser acceptance pending. GitHub Actions and CircleCI are deliberately disabled by default. Cloudflare Pages Git-based preview delivery is independent of CI.

## Scope and architecture

The existing theme, hero display, atmosphere, quick menu and portfolio implementations remain in place. The new `webstudio-five-engine-v329.js` is a preview-only, additive coordination layer; `webstudio-five-engine-v329.css` provides six isolated visual treatments. Neither file invokes private APIs, sends telemetry, uploads data or changes the Neon portrait geometry. The earlier Editorial no-dark-overlay fix is retained.

| Engine | v3.29 enhancement | How to check |
|---|---|---|
| Hero Display | Responsive, translated visual-identity dossier for each theme; keeps native hero composition | Verify portrait/headline geometry, no overlap |
| Atmosphere | Common quality selector in Quick Menu, reflects native Auto/Cinematic/Balanced/Eco/Off mode | Change tier; verify renderer fallback, reduced motion and scroll |
| Theme | Six distinct shared visual palettes, layouts, motif symbols and shape rules | Switch all six; verify engine controls adapt without cross-theme leakage |
| Quick Menu | Integrated accessible five-engine control rack, native action links and status | Open Quick → Tools; trigger all five actions; keyboard focus |
| Portfolio | Theme-aware translated count, zero-result recovery, optional / search shortcut | Search/filter/sort; clear zero matches; test keyboard focus |

## Localization contract

All **new** controls and messages are translated with explicit native strings in the ten supported locales: English, Hindi, Bengali, Spanish, French, German, Portuguese, Arabic, Simplified Chinese and Japanese. Included: 34 UI string keys per locale, six theme descriptions per locale, and five atmosphere mode labels per locale. Proper theme names remain stable; screen-reader labels and status updates use the selected locale. Existing broad localization remains under `personal-translation-expansion-v1.js`.

## Manual browser protocol (owner-run, never automatic)

1. Open `https://preview-personalweb.sudip-das-frontend.pages.dev/?v=3.29.0` and check the `portfolio-visual-build` metadata for `preview-five-engine-six-theme-v3.29.0`.
2. Select each theme: Orbit, Editorial, Terminal, Aurora Peak, Neon Studio and Cosmic. Confirm unique colors, type shapes, hero caption, portrait and stable grid; inspect at 1906, 1440, 768, 390 px.
3. Open **Quick Menu → Tools → Engine controls**. Confirm all five actions work and that no action accesses owner-only/private data. Check keyboard Tab, Shift+Tab, focus visibility and Escape behavior.
4. Change language to each of the ten locale options. Check dynamic control labels, page direction in Arabic, theme descriptions, atmosphere mode options, and status/empty messages.
5. Set Atmosphere to Auto, Balanced, Eco and Off. Verify reduced-motion and data-saver caps. Cinematic is optional only when hardware supports it; do **not** report GPU operation if renderer fell back.
6. Under Projects, search for nonsense text to trigger the empty state; clear filters. Test category and sort controls and press `/` outside a form to focus search.
7. In Quick Menu → Tools, activate **Run six-theme check**. The diagnostic checks 9 scoped DOM/engine assertions per theme (54 total), restores the original theme, and enables **Export check JSON**. Include the JSON with screenshot feedback. This is NOT the previous 187-check theme audit, nor a security audit.
8. Keep `?theme-audit=1` separate to rerun the existing 187-probe instrument. Do not conflate its results with the 54 new probes.

## Acceptance gates

- **Source checks:** verify all referenced scripts and CSS exist, ten complete dictionaries, six theme CSS profiles, JavaScript syntax and balanced braces. See `scripts/verify-five-engine-v329.mjs`.
- **Manual QA:** screenshots at the requested widths, all five engines tested in all themes, translations checked, no overflow, GitHub/video/intro retained, known 2 old failures reassessed.
- **Production:** do not promote from preview without a separate explicit review. No hosted CI is permitted until usage is restored and the owner authorizes reactivation.
- **Failure reporting:** identify FAIL, NOT RUN or PASS and attach evidence; a GitHub commit or page response is not a browser pass.

Current release gate: **MANUAL_QA_PENDING**.
