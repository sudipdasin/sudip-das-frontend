# Personal preview v1.2 — Safe Theme Library deployment record

**Date:** 2026-11-23  
**Owner-requested target:** `https://preview-personalweb.sudip-das-frontend.pages.dev/?utm_source=chatgpt.com#contact`  
**Repository:** `sudipdasin/sudip-das-frontend`  
**Testing branch:** `test/personal-preview-safe-theme-library-20261123`  
**Deployment branch:** `preview-personalweb` (**Cloudflare named preview alias only**).  
**Production branch:** `main` — DO NOT CHANGE.

## Intent and boundaries

The private WebStudio incubator `sudipdasin/webstudio-private@incubator/webstudio-untested-theme-platform-20261123` contains experimental **demo/editor features**. The real personal site is different: it contains real approved portfolio information and public read-only visitor controls; editor, owner administration, secret data, JSON import/export and backend private-request functionality **must never be shipped there**. Therefore this preview release implements **only the visitor-safe theme-library UX** and Aurora styling isolation, using the existing personal site's six-theme contract, rather than directly deploying the full fictional WebStudio incubator.

## Changed public static artifacts

- `personal-theme-library.js` — safe six-card gallery opened only from existing Quick Actions; same-origin `theme-visual-contract.json` input; curated IDs only; filters for light/dark and text, guarded native theme selection, restore prior theme; accessible Escape, focus loop, close, and status updates; no profile modification or network writes.
- `personal-theme-library.css` — CSS isolated to `.pv-theme-*` classes; popup hidden by default; no global body, hero, portrait, Editorial, projects or backend changes; responsive and reduced-motion modes.
- `index.html` — loads the two preview-safe assets, preserves `#contact` section, `noindex`, disabled private request form, `window.PUBLIC_API_BASE=""` and `window.PORTFOLIO_PREVIEW_MODE=true`. Keeps owner management scripts absent.
- `webstudio-parity.js` — borrows the separately reviewed Aurora DOM isolation fix: `.ws-aurora-reference` is mounted only for `neon-studio` and fully removed for other five themes, including protected Editorial. Does not alter the original owner-favorite CSS.
- `scripts/verify-personal-theme-library.mjs` and CI source/browser checks — enforce six-theme registry, source archive SHA, no owner controls, disabled request boundary, Aurora-only DOM and gallery hidden on initial load.
- `scripts/verify-editorial-visual.mjs` — updates 24-shot future Chromium matrix to require Aurora-only DOM absent in five other themes.
- `site-release.json` — accurately labels a **preview-only** release with Chromium acceptance deferred owing to exhausted CircleCI credits; production deployment not approved.

## Preserved reference and rollback

The exact Editorial owner-favorite source snapshot remains `c5383df1ebda7a0e5f05d9f59048a136dc99dac5` and branch `archive/editorial-favorite-2026-11-23-c5383df`. No original Editorial styles or portrait data were edited. Always compare this snapshot in future image-based regression jobs; never silently update the gold master.

## Verified vs deferred

**Performed:** authenticated GitHub source read/commit; source integrity checks for preview safety, all six IDs, unchanged editorial source SHA, script order and disabled backend; syntax parsing of new personal gallery, Aurora runtime and source verifier; CSS-brace validation; controlled JavaScript gallery runtime showing six cards, switching Cosmic and restoring Editorial. The existing source contract was not swapped.

**Deferred:** actual `node`/CircleCI full test suite; real browser screenshot pixel comparison and accessibility review; physical browser behavior of the final Cloudflare alias (requires platform confirmation). CircleCI has exhausted credits (provider screen showed next refill 2026-12-17). Cloudflare build success, if observed, is **only an artifact/deployment check**, not a browser visual pass.

## Deployment criteria

Only the `preview-personalweb` branch may receive this candidate after the owner explicitly requested the preview go live. Do not merge into public `main`, private owner-management source, `gh-pages`, or WebStudio incubator. Retain the testing branch and reviewed pull request for replayable history. Once Cloudflare reports success for the exact branch SHA, the user-facing **single** preview alias should serve the new feature. Direct URL fragment `#contact` remains client navigation and does not require a separate Cloudflare route.

**If a regression appears:** redeploy/restore the previous tested preview commit `d10d6cac061a550ac46545f1ad307e9a2e066390`, or consult immutable original Editorial `c5383df`. Do NOT change production while repairing preview.

## CircleCI credit-return acceptance

Run `node scripts/verify-personal-theme-library.mjs`, existing six-theme fidelity/aurora/editorial source checks, pinned Chromium smoke, real popup interactions, 24-theme screenshot matrix including archived Editorial GOLD-vs-candidate pixel differences, keyboard/focus/RTL/mobile accessibility and zero requests to private APIs. Fix and rerun before considering any broader promotion. The personal preview stays nonindexed, protected and separate from production.
