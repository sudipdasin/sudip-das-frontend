# WebStudio GitHub disclosure: v3.31.2 manual QA

**Bug reports:** Editorial initially had the GitHub disclosure underneath the marquee. The v3.31.1 shared hero-elevation repair improved Neon stacking but the owner reported Neon appearing to use Cosmic color/layout, with Cosmic still affected by menu overlap.

**Implementation:** The dropdown is no longer nested under the isolated hero while open. The existing original GitHub button stays where it is, but the disclosure is temporarily portaled directly under `document.body`, positioned relative to the trigger using viewport geometry. When closed, the original DOM relationship is restored. This avoids modifying the hero layout/paint stacking layers and prevents backdrop overlap in Cosmic. The menu carries its own `data-gh-theme` and six explicit theme palettes, ensuring Neon remains cyan glass while Cosmic uses violet prisms. The selector's chosen theme is authoritative, including during a switch with the dropdown already open.

**Source changed:** `github-hero-explorer-v324.js`, `github-hero-portal-v3312.css`, `index.html`. Prior CSS hero-elevation layers were *unlinked* (files preserved for rollback). No HTML translation strings were introduced, and the five-plugin bridge remains unchanged.

**Executed verification:** A 26-assertion synthetic DOM run passed: initial attachment, open/skin/close for all six themes, live Cosmic→Neon theme change, outside-pointer dismissal, keyboard handler availability, CSS syntax balance, new stylesheet link and old stylesheet unlink. The repository also contains `scripts/verify-github-portal-v3312.mjs`, a local-only verifier. Cloudflare deployment and live browser rendering are **NOT independently verified**. GitHub Actions/CircleCI remain disabled.

## Owner acceptance checklist

1. Open `https://preview-personalweb.sudip-das-frontend.pages.dev/?v=3.31.2`. Check the version marker `preview-github-theme-isolated-portal-v3.31.2` in the page source.
2. Select **Neon Studio**. Confirm original cyan/blue Neon styling and geometry, expand GitHub, and verify the panel is a cyan/teal 16px-rounded glass disclosure rather than a purple Cosmic prism.
3. Select **Cosmic**. Confirm its own purple/violet GitHub disclosure appears above the marquee and beneath the sticky header. Close and reopen it.
4. Repeat all six themes, while checking that the button's position, portrait, navigation, footer, introduction video and background motion are unchanged.
5. Test keyboard focus: Tab to GitHub, Enter/Space to toggle, Arrow Down to move to the panel, Escape to close and return focus. Click outside, scroll and resize with panel open.
6. Test 1906×927, 1440×900, 768×1024 and 390×844, including touch and reduced-motion settings. Check that the portal does not extend beyond the viewport.
7. While the panel is open, the read-only diagnostic `window.__wsGithubHero324?.getStatus()` should report `open:true`, `portaled:true`, and a `theme` equal to the picker value. It is not a test of actual visual layering.
8. Record screenshots and pass/fail results. Do not promote production or claim browser QA before owner review.

**Release gate:** `MANUAL_QA_PENDING`.
