# Personal preview: Editorial contrast repair + WebStudio footer

**Date:** 2026-11-23  
**Branch:** `fix/editorial-contrast-webstudio-footer-20261123`  
**Target:** `https://preview-personalweb.sudip-das-frontend.pages.dev/` (single named personal preview)  
**Parent:** `preview-personalweb@cb78c9a07d62dc01bac4546a99b98008eeaab877`  
**Production:** `sudip-das-frontend@main` must remain unchanged.  
**Fidelity:** The saved Editorial theme source `c5383df1ebda7a0e5d05d9f59048a136dc99dac5` remains recoverable and its existing CSS and personal content must not be overwritten.

## User-reported evidence

Two desktop screenshots of the existing preview were provided. In the first, the Editorial contact/profile-vault section looked consistent in warm paper. In the second, the `04 / How I contribute` section used a near-black/forest background while the light Editorial theme applied dark text to its heading and four capability cards. The heading `Where experience turns into value.` and cards became very difficult to read.

**Confirmed source-level cause:** the site's older inline stylesheet defines `.capabilities{background:#141c17}` regardless of theme; Editorial's body variable `--ink:#1c2822` changes text to dark ink without overriding that legacy section. Additional reveal opacity may compound the low contrast. This is not a user/browser caching issue.

**Repair:** `personal-editorial-contrast.css`, loaded last, overrides **only** `body.ws-parity[data-theme="editorial"] section.capabilities` and its headings, copy, four cards and reveal states. Cream paper backgrounds, dark ink and copper accents were chosen to respect the favorite Editorial aesthetic. Source WCAG calculations are checked, but actual computed Chromium screenshots and accessibility testing remain deferred.

## WebStudio brand and demo footer

`index.html` adds a substantial **Made with WebStudio** showcase before the existing footer, with a modular W motif, light/dark variant styling, clear description of the presentation designs and visitor interactions, and a direct demo CTA:

`https://sudipdasin.github.io/sudip-das-frontend/`

The demo remains the separate fictional WebStudio experience. Do not copy Dev Das marketing/demo identity into this real portfolio or promise features labeled as planned.

The second CTA, **Interested? Get in touch**, expands an email-only form via accessible `aria-expanded` and CSS grid-row animation. The only user-visible data field is an email address. The form validates the email in the browser, supports keyboard Escape, reduced motion and responsive layouts, and preserves privacy. It neither requests a password nor grants editing controls.

## Current mail behavior: intentionally explicit

**Preview release mode: CLIENT-EMAIL COMPOSE ONLY.** No `meta[name="webstudio-interest-backend"][content="enabled"]` is present. Submitting the form launches a visitor's configured email application with an encoded subject/body addressed to the existing published contact address. The visitor must explicitly press Send. The page **never claims the email was delivered** merely because `mailto:` was opened.

This fallback does NOT fulfill the later requested automatic notification fully; it is an honest and immediately usable option while the backend is configured and tested. If the visitor has no email client, normal `mailto:` functionality may not work. The personal site already has a separate published Email link.

## Staged automatic email infrastructure — OFF by default

A safe Cloudflare Pages Function is source-staged at `functions/api/webstudio-interest.js` with route `POST /api/webstudio-interest`. It sends an email-only lead to `env.OWNER_EMAIL` via the existing **HMAC-signed Gmail Apps Script bridge**, after Turnstile, origin, preview-host, input, honeypot and D1 hashed rate-limit checks. A successful `202 {ok:true,status:'delivered'}` is returned only when the mail bridge acknowledges the send. A missing secret, binding, Turnstile, preview-host authorization or enablement flag returns an error; it never sends by default. The visitor's email is **not stored** in D1; only salted SHA-256 rate counters are stored.

**Manual one-time security setup required before server mode can safely work:**

1. In Cloudflare Pages `sudip-das-frontend` **Preview environment only**, configure encrypted secrets `MAIL_BRIDGE_SECRET`, `TURNSTILE_SECRET_KEY` and `WEBSTUDIO_RATE_SALT` (a new unpredictable value at least 24 characters). Never put these in GitHub, browser JS or commits.
2. Configure preview runtime values `MAIL_BRIDGE_URL` (the already-authorized Apps Script `https://script.google.com/macros/s/.../exec`), `OWNER_EMAIL` (the recipient), `WEBSTUDIO_INTEREST_ENABLED=true` and `WEBSTUDIO_INTEREST_APPROVED_HOST=preview-personalweb.sudip-das-frontend.pages.dev`. **Production must not be enabled.**
3. Create a **dedicated** Cloudflare D1 database for WebStudio interest rate counters, apply `docs/webstudio-interest-rate-limits.sql`, and bind it in Pages **Preview** as `INTEREST_DB`. Never reuse the private profile-vault database.
4. In Turnstile, register the exact hostname `preview-personalweb.sudip-das-frontend.pages.dev` for the site key; the widget must set action `webstudio-interest`. Verify the server will reject mismatched hostname/action tokens. Test with real challenge responses.
5. **Only after** exact preview host, D1, Turnstile and Gmail bridge checks pass, create a reviewed preview-only HTML commit adding `<meta name="webstudio-interest-backend" content="enabled">` and `<meta name="webstudio-interest-turnstile-sitekey" content="...PUBLIC SITE KEY...">`. Then perform a real two-device email-delivery test from a permitted visitor with consent, confirm the owner receives a message, no duplicate or abuse, and review logs. Do not enable until actual delivery is observed.
6. Review Cloudflare Pages Functions cost and preview deployment behavior. Reference official docs: https://developers.cloudflare.com/pages/functions/get-started/ and https://developers.cloudflare.com/pages/functions/bindings/.

### Why no automatic email claim today?

The earlier Cloudflare Pages configuration supplied by the owner had **no Pages runtime secrets/bindings configured**. The existing Gmail bridge credentials live in a DIFFERENT backend Worker, and are not accessible from this static Pages project by default. Current CI credits are exhausted, and no authenticated Cloudflare account tool exists in this runtime to inspect/configure secrets or prove delivery. Presuming configuration or routing through private request APIs would create an unsafe false-success path.

## Tests and release guardrails

Added `scripts/verify-editorial-webstudio-footer.mjs`: asserts preview-only and private-request disabled, verifies contrast-specific selectors, computes WCAG luminance ratios for key Editorial colors, checks panel/form/JS wiring, confirms no automatic-send mode in HTML and checks backend fail-closed guards. CircleCI source checks and the six-theme Chromium smoke now include this contract, footer presence, collapsed-by-default state, email-only visible input and computed Editorial capability-card contrast.

**Tests actually performed:** source inspection, JS syntax and CSS checks, isolated UI review; source ratio checks are written for execution. **Tests not claimed:** full CircleCI/Playwright browser jobs, automatic email sending, Cloudflare Turnstile test, inbox receipt, pixel-matched screenshot gallery.

**Safety:** No personal biography, photo, original theme source or production deployment changed in this isolated branch. Restore `preview-personalweb` to the previous verified SHA `cb78c9a...` if required. Keep all future user-facing changes in the preview branch until real QA and owner's production approval.
