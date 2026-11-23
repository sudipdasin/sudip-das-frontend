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

## Follow-up defect repair — visible theme launcher and Access-safe catalog (v1.2.1)

Owner feedback: **"so i dont see any improvements or updates in the new live view"** after Cloudflare successfully deployed v1.2.0 to named preview branch. Investigation found:

1. **Discoverability defect, confirmed in source:** `personal-theme-library.js` mounted its sole launch button **inside the already-hidden Quick Actions panel**, so the otherwise unchanged page looked identical until a visitor opened that menu; this did not meet the owner's expectation for a visible upgrade.
2. **Cloudflare Access compatibility defect, source-level risk:** the gallery fetched `theme-visual-contract.json` with `credentials:'omit'`, explicitly omitting credentials. On Access-protected previews the session cookie may be required, and fetching without it can return a login response/403, silently disabling the gallery. This failure was inferred from source and Access configuration; it was **not reproduced against live Cloudflare**, because the current environment cannot directly browse the protected preview.
3. **Browser cache:** prior JS/CSS asset URLs were unchanged across deployments; new release references `personal-theme-library.js?v=1.2.1` and matching CSS version for a distinct browser cache key.

**Repair:** dedicated test branch `fix/personal-preview-theme-launch-visibility-20261123`, based on exact deployed preview merge SHA `90b04dbe42ac09e4658a61df7d904e23545cef2c`. A prominent **◈ Explore themes [6]** button is now beside existing **⌘ Quick Actions** within the sticky navigation, so it is visible even at `#contact`. Mobile renders two compact icon controls rather than allowing them to crowd language/theme selectors. The gallery modal still starts hidden; the original Editorial hero/CSS, portrait, data, existing sections and Quick Actions remain unchanged. The gallery catalog is compiled locally from the fixed, public six-theme personal contract, validated against the immutable Editorial source SHA; **no runtime fetch, credentials, login or external dependency**. The standalone HTML references cache-busted assets. Version `webstudio-personal-visitor-themes-v1.2.1-preview`.

**Checks actually performed before promotion:** GitHub source inspection for exact prior branch and current files; parser check on changed JS and source verifier; scoped CSS brace/source audit; source comparisons of 6 labels and backup SHA; **executed isolated DOM simulation** with the real updated gallery script: button attached outside hidden menu to sticky header, initially visible/enabled, modal initially hidden, 6 cards shown upon click, Cosmic selection, restore original Editorial, close. These are source-level and isolated-JS results only, **not executed Chromium, real mobile screenshot or real Access session test**; CircleCI credits still unavailable.

**Deployment:** this fix is for `preview-personalweb` ONLY. Record actual merged SHA and exact Cloudflare Pages result below *after* the provider confirms. Do not modify `main`, public WebStudio `gh-pages`, private WebStudio incubator or owner/private API. Roll back to previous preview `90b04dbe42ac09e4658a61df7d904e23545cef2c` if needed; frozen Editorial backup remains `c5383df1ebda7a0e5f05d9f59048a136dc99dac5`.

---
