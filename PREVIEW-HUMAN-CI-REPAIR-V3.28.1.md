# Web Studio v3.28.1 — Human CI finding and targeted repair

**Source:** Owner-provided browser audit titled `WebStudio theme audit v3.27`  
**Viewport:** 1906 × 927. **Result:** 185/187 static probes passed, no detected document horizontal overflow.

## Finding A — Editorial: no dark video overlay (FAIL)

The Editorial theme's introductory video CTA inherited a dark Neon-style `::after` pseudo-overlay. Earlier Editorial CSS tried to set `opacity:0`, but the v3.27 browser report measured that check as failed. The new **late-loaded, Editorial-only** `human-ci-theme-repairs-v3281.css` explicitly removes the pseudo-element with `content:none`, `display:none`, `visibility:hidden`, `opacity:0` and `background:none`. Its CTA remains a paper-colored, static publication-style surface. No Neon theme CSS, scripts, or portrait sizes are changed.

The audit now passes the overlay check only when the **computed** pseudo-element is nonrendering (no box, no content, hidden visibility, or effectively zero opacity), rather than relying on one opacity value alone.

## Finding B — Neon Studio: portrait and title geometry (FAIL)

**Root cause is an audit selector false positive, not a missing portrait.**

The owner-approved Neon source intentionally hides `main>.hero .hero-art > .core` and replaces it with `main>.hero .hero-art > .ws-neon-precision-portrait` created in `webstudio-parity.js`. The v3.27 audit measured the hidden legacy `.core`, which is supposed to have a zero-width rectangle.

The corrected audit reads the active precision portrait **only for Neon**. Other five themes still use `.hero-art > .core`. The probe checks computed visibility and width/height, and still rejects hidden/zero-width portraits and collapsed titles. No visual geometry change was made to the approved Neon design.

## Measurable browser evidence

The updated `?theme-audit=1` report exports **v3.28.1** with:

- Page visual build fingerprint and Human CI repair marker
- Selected portrait selector, actual width/height and `display`
- Actual title width/height
- Video overlay `opacity`, `display`, `visibility` and `content`
- Full six-theme results and JSON report file `webstudio-theme-audit-v3.28.1.json`

The correct page source now includes:
```html
<meta name="portfolio-visual-build" content="preview-five-engine-mesh-i18n-audio-v3.28.1">
<meta name="portfolio-human-ci-repair" content="v3.28.1">
```

## Source verification and limitations

```sh
node scripts/verify-human-ci-theme-repairs-v3281.mjs
node scripts/verify-hero-display-v328.mjs
node scripts/verify-atmosphere-v328.mjs
node scripts/verify-five-engine-v328.mjs
node scripts/verify-github-hero-v324.mjs
```

At the v3.28.1 repair commit:

- Targeted overlay, precision portrait, and probe regressions: **33/33 passed**
- Updated Hero Display and build marker regressions: **56/56 passed**
- Earlier v3.28 atmosphere, mesh and GitHub regressions: **43/43**, **70/70**, **38/38** respectively; those engines were not modified by the repair

**The previous v3.27 report cannot establish v3.28.1 has deployed or passed.** External Cloudflare browser access and an end-to-end screenshot comparison were not available to this verifier. The two reported issues need another browser audit from the updated page; the source patch does not constitute live visual approval.

## Human CI reproduction

1. Hard refresh https://preview-personalweb.sudip-das-frontend.pages.dev/?theme-audit=1.
2. Confirm the audit banner is **v3.28.1**, not v3.27 or v3.28. Its report must show the build and repair marker shown above.
3. Switch to Editorial, inspect the pale introduction tile and confirm the computed `::after` is `display:none`/`content:none`. Check the expansion control still opens the video.
4. Switch to Neon Studio and inspect the actual precision portrait rather than the intentionally hidden `.core`; check that neither it nor the title is clipped and that the approved glass layout remains unchanged.
5. Run all six theme checks; send the new exported JSON and screenshots showing any remaining issues.

Changes are committed to `preview-personalweb` only. **Production `main` is not touched.**
