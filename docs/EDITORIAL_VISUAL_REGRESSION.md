# Personal preview — Editorial Gold-Master & Six-Theme Visual Regression

## Why this exists
The owner explicitly prefers the PERSONAL website's Editorial theme. It must not be replaced by WebStudio DEMO Editorial or modified accidentally when fixing other themes. This pipeline protects its **rendered baseline** and captures reproducible screenshots of the other five designs so reviewers can identify missing/mixed visual components.

**One moving preview URL:** https://preview-personalweb.sudip-das-frontend.pages.dev/  
**Immutable Editorial source snapshot:** `c5383df1ebda7a0e5f05d9f59048a136dc99dac5`  
**Do-not-move archive branch:** `archive/editorial-favorite-2026-11-23-c5383df`

## Actual test jobs
1. `node scripts/verify-theme-contract.mjs` — fast, offline, dependency-free validation of six theme IDs, edition-label distinctions, Editorial baseline source SHA, visitor-only controls, and no live private-request API.
2. `node scripts/verify-editorial-visual.mjs` — uses **real headless Chromium**, downloads the public archived branch, **verifies the archive still points at the exact commit**, renders the archived site and current build separately with the same browser settings, selects Editorial and produces full-page screenshots at **1440×900 and 390×844**.
3. Compares PNG pixels with `pixelmatch` (AA-tolerant threshold 0.15; fail when more than 0.1% of pixels differ). Writes `editorial-<viewport>-GOLD.png`, `...-candidate.png`, `...-DIFF.png`.
4. Captures a **24-shot six-theme gallery** (1833×858, 1672×941, 820×900, 390×844) with measurements of hero, portrait, badge counts, overflow, and Aurora-only sections. Saves `visual-audit/results.json`.
5. CircleCI's `browser-visual-regression` job stores screenshots and JSON as `editorial-gold-master-and-six-theme-gallery` artifacts **even when visual diff fails**. Inspect actual screenshots before declaring a theme finished.

## Reproducible manual CI command
On a Linux environment with Node 22, Git, tar and Chromium available:

```bash
npm install --no-save --no-package-lock playwright@1.56.1 pngjs@7.0.0 pixelmatch@6.0.0
node scripts/verify-theme-contract.mjs
node scripts/verify-editorial-visual.mjs
```

This needs read-only GitHub network access to fetch the public archive. The screenshot stage requires a compatible Playwright Chromium executable; CircleCI uses `mcr.microsoft.com/playwright:v1.56.1-noble`. No API keys, passwords, Cloudflare login cookies, private repositories or external browsers are required.

## Boundaries / limitations
- This compares the personal website's *rendered Editorial* with the recovered personal-site baseline, **NOT with fictional WebStudio Editorial**. Other theme images form an audit gallery, **not** a proof of WebStudio pixel parity.
- The screenshots use locally served static artifacts, abort network requests to outside third-party services, and disable animations/transitions to reduce noise. Exact production CDN rendering and Google Fonts should be checked separately on an authorized browser.
- Screenshots and screenshot tests need CI to run. A passing source check or successful Cloudflare deployment **does not mean these screenshots were captured**.
- A 0.1% visual threshold is a regression heuristic, not a cryptographic lock; file and branch backups preserve exact source. Any intended Editorial visual change requires owner approval and baseline policy update.
- Images and scripts produced by this job are public static website assets only, and preview request submission stays disabled. Do not duplicate personal portrait assets into the PRIVATE WebStudio demo.
- If the pipeline finds mismatches, fix the CSS/DOM or investigate nondeterminism. **Do not update the immutable commit or threshold simply to obtain green tests**.

## Reference issues
- Private project: `sudipdasin/sudip-das-profile#19`
- WebStudio theme catalog: `sudipdasin/webstudio-private#11`
- Owner-approved snapshot: `docs/EDITORIAL_STYLE_FREEZE_2026-11-23.md` in private personal-site repository.
