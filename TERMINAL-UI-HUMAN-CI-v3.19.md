# WebStudio v3.19 — Terminal Footer & Review Control Screenshot Regression

**Preview:** https://preview-personalweb.sudip-das-frontend.pages.dev/  
**Theme to select:** Terminal · Explorer  
**Branch:** `preview-personalweb` (not production `main`)

## Reported screenshot

At approximately 1785 × 864 px while scrolled to the footer:

1. The WebStudio showcase card retained a large cyan-to-violet, round-corner look inconsistent with Terminal's green, square, command-line design.
2. The floating Human CI launcher was oversized, wrapped multiple counts onto two lines, and obscured page content at the bottom right.

## Fixes committed

- `terminal-footer-ci-polish-v319.css` replaces the Terminal showcase's blue gradient, pill buttons, orbit decorations and glowing cyan logo with dark green console surfaces, square framing, a monospace visual mark, command prompt accent, green status chips, and matching buttons.
- The same stylesheet makes the floating launcher compact on all themes, including a Terminal-specific flat green-on-dark treatment; expanding the review panel still exposes the full checklist and notes.
- `human-ci-preview-v1.js` shows only `N/20` in the closed launcher, puts full pass/fail/pending counts inside the panel and updates accessible launcher labels without losing JSON exports.
- `preview-theme-audit-v316.js` adds six targeted checks for Terminal footer style, mono heading, hidden orbit artwork and compact Human CI badge.
- No requests, credentials, analytics, external assets or owner controls were added.

## Human CI retest

1. Open the preview and select Terminal. Scroll to the section titled **A portfolio is just the beginning.** Verify the card uses a flat green-on-dark terminal appearance instead of a blue/cyan promotional panel.
2. Confirm the left WebStudio mark is a monospace terminal emblem and there are no circular orbits.
3. Test **Explore the inline demo**. It must expand, remain readable in Terminal style, and collapse with Close or Escape while returning focus.
4. At the bottom-right, the closed Human CI launcher should be a compact one-line badge showing a numerical `N/20` count. Opening it must reveal all review details without text spilling off-screen.
5. Switch to Editorial, Aurora Peak, Cosmic, Orbit and Neon Studio; confirm their existing approved designs are unaffected. Test at desktop, tablet and mobile widths.
6. Open `?theme-audit=1` on the preview and run the six-theme audit. Export its JSON and the Human CI JSON. Report any failures with new screenshot, viewport and theme.

## Verification boundaries

Source-level CSS/JavaScript checks run locally against the GitHub preview branch; the Cloudflare preview URL did not respond to independent browser retrieval from this environment. Real browser rendering, pixel-level screenshot comparisons, video playback and mobile layout still need human CI. The preview remains noindexed, private API disabled, and paid CircleCI jobs excluded from this branch. Production `main` is untouched.
