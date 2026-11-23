# Preview v3.7.2 — Quick Hub geometry regression correction

Target: `sudipdasin/sudip-das-frontend@preview-personalweb` only.

Issue reported with screenshot: Quick Actions panel has unused blank space and four tabs aren't on a single row.

Verified source-level cause: CSS `personal-quick-hub-v2.css` retained `grid-template-columns:repeat(3,minmax(0,1fr))` after adding the fourth Connect tab. This forced the last tab onto a second row, leaving two empty grid tracks. Additionally, legacy WebStudio quick-panel `strong` rule adds a 10 px bottom margin to nested heading text.

Fix: four equal minmax(0,1fr) columns, smaller explicit gaps, compact all-viewport tab sizing, natural-height panel and panes, preserved internal scrolling at limited viewport height, legacy inherited heading-gap reset, condensed section spacing, responsive 320px mobile rules, reduced-motion safety and existing keyboard/ARIA semantics unchanged.

No GitHub Actions/CircleCI consumption. CSS/source invariants checked before commit. Cloudflare Pages deployment and actual browser visual QA are separate checks.
