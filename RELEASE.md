# V2 Frontend Release Candidate — 0.2.0-rc.5

## Fictional customer web preview

This release adds an independently packaged, automated GitHub Pages preview for the previously created `examples/customer-demo/` sample. The publication artifact contains exactly the demo HTML, JS, fictional JSON profile, `.nojekyll`, and `robots.txt`. It omits the real personal portfolio, portrait, private backend, credentials and source-only files.

## Tests and deployment
- `node --test tests/*.test.mjs`
- `node scripts/build-customer-demo.mjs` (output: `dist/customer-demo-preview/`)
- GitHub Actions workflow `.github/workflows/customer-demo-pages.yml` runs the demo tests and publishes its isolated artifact when `main` changes or on manual dispatch.
- Preview URL is the GitHub Pages project URL, normally `https://sudipdasin.github.io/sudip-das-frontend/`, **only after a successful Pages deployment**.
- If Pages is not enabled, set repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- The preview is marked as fictional and noindex by default. This is a demo, not a commercial CMS release.

## Production safety
The portfolio website and `sudipdas.is-a.dev` DNS are not modified. No live private API or customer records are deployed. GitHub Pages deployment success must be independently observed before advertising the preview as live.

## Functional browser-preview acceptance criteria
The customer preview must pass a headless Chromium run that loads the static build, edits and saves text, adds and removes projects, edits social links, rejects unsafe URLs, downloads JSON, restores local changes after reload, imports a valid profile, and resets to the original fictional customer profile. No server-side emails, customer accounts, payments, or hosting-provider configuration are implied by this standalone static demo.

## Premium buyer-demo experience — v0.2.0-rc.6
The fictional portfolio now uses the design language of the existing personal site: typographic hero, circular animated identity, layered gradients, sticky navigation, project cards, marquee, section headings, animated reveals, responsive layout and reduced-motion support. The entire visual layer is independent, editable, and ships only in the isolated customer demo artifact. Existing locally saved customer edits continue working. The browser CI test must exercise the actual published layout assets before promotion.

## Customer Studio Parity — v0.2.0-rc.7
The fictional sample now includes customer-safe adaptations of the source portfolio's most useful presentation patterns: Orbit/Editorial/Terminal modes, animated connected identity art (original fictional SVG), sticky and mobile navigation, scroll-progress feedback, subtle pointer tilt, six-language navigation/section labels, live project search and categories, editable case-study accordions, a fictional experience timeline and capabilities, and a functional offline proposal brief exporter. Existing edit/save, local storage, import/export and reset remain preserved. 

**Security separation:** The owner's real portrait, Cloudflare Turnstile keys, private-information request/vault workflow, backend APIs and email delivery were not copied. The proposal feature only downloads a local text file and explicitly does not send it anywhere. The demo remains a reusable static customer sample, not a production multi-tenant hosted application.

## v0.2.0-rc.8 — Quality and discovery hardening
- New entirely fictional starter developer: Nico Vale.
- Visual redesign ensures the fictional SVG portrait is visible in all Orbit, Editorial and Terminal modes, with distinct backgrounds, typography and responsive layouts.
- Optional five-step guided tour: layout switching, editor, projects and plans, with keyboard Escape and focus return.
- Separate transparent product discovery and prelaunch plan section; no invented prices, payment processing or account claims.
- Fail-closed hosted-checkout adapter supporting configured Stripe Payment Links and Razorpay Payment Pages on a verified commercial host. GitHub Pages **never** enables payment; public config remains disabled.
- Expanded automated tests for all three themes, portrait, mobile overflow, editable identity, tour and gateway safety.

**Release scope:** public customer demonstration only. Live paid purchase, license provisioning and hosted customer publishing remain blocked until merchant and backend integration is verified. See `docs/COMMERCIAL-LAUNCH.md`.

## v0.2.0-rc.9 — Enduring Web Presence USP and expanded multilingual demo
- Central claim changed to the planned **Auto-Regenerative Presence Engine**: detect, preserve with independent local/cloud backups, restore to another provider, and verify recovery.
- Clear warning: website availability cannot be guaranteed against expired domains, DNS caching, security incidents or provider outages; backup/failover orchestration remains planned rather than implemented.
- Added source-owned localized product, page, UI, portfolio and tour copy for ten languages: English, Hindi, Bengali, Spanish, French, German, Portuguese, Arabic, Chinese and Japanese.
- Added right-to-left Arabic layout support and tests for language-switch reversibility, mobile dimensions and demo profile isolation.
- Added `docs/ENDURING-WEB-PRESENCE.md` and `docs/GROWTH-AND-LAUNCH-PLAYBOOK.md` for architectural and commercial release milestones.
- This release concerns the fictional demo. No private backend, production DNS or payment gateway is activated.


## v0.2.0-rc.9 — customer ownership, resilient web presence and localization
- Launch message: **You are in control of your web presence and your data.**
- A transparent rescue-first product vision: modularity, provider choice, DNS/domain migration, multi-location backup, integrity checks, restoration and verified monitoring (future roadmap, not yet operating in static demo).
- Current demo now gives working one-click manual profile JSON backup and a direct restore entry, independent of a cloud account.
- Re-centered illustrated portrait and animated orbits around common responsive geometry, with tests for Orbit / Editorial / Terminal across desktop, tablet and mobile.
- New full-copy translation catalogs for ten languages, including fictional profile, product message, journey copy and onboarding; RTL Arabic support and reversible switches.
- Adds research-grounded product-growth and distribution plan at `docs/PRODUCT-GROWTH-STRATEGY.md`, and resilience architecture at `docs/ENDURING-WEB-PRESENCE.md`.
- No verified automated cloud backup, monitoring, failover, billing or managed hosting is claimed. This release is limited to the separate fictional demo.

## v0.2.0-rc.11 — Responsive interface refinement
- Reorder the demo so real introductory actions and the profile hero appear before detailed resilience marketing content.
- Consolidate header/navigation, CTA, editor, project-filter, ownership, pricing, tour and form layout rules in a final responsive CSS layer.
- Make action groups wrap/grid responsively with touch-friendly targets, control width limits, readable translated labels and visible keyboard focus.
- Add real Chromium overlap and horizontal-scroll checks for 320/390/600/768/1024/1440px in all three themes, plus translated labels in English, Hindi, German and Arabic.
- Preserve customer editing, backups, languages, avatar/orbit geometry and disabled payment safeguards.

## v0.2.0-rc.12 — Screenshot-verified hero polish
- Correct the obsolete `AE` logo initials to the fictional developer's `NV` and automatically derive new initials after customer profile edits.
- Prevent the portrait caption from overlapping the demo status badge or artwork by placing both labels in separate positions.
- Reduce oversized vertical whitespace between the introductory CTA and hero; keep the subject and animated orbits centered across all themes.
- Align all three primary onboarding buttons on one desktop row with responsive grids at smaller widths.
- Feather the scrolling ticker's left/right edges for less abrupt clipping.
- Add explicit Chromium geometry assertions for portrait-caption and demo-pill intersections, hero vertical spacing, brand monogram update and desktop CTA row.

## v0.2.0-rc.13 — Studio & system menu
- Move manual profile JSON backup/restore from the marketing section into a dedicated top-navigation **Studio & system** menu.
- Group active customer-data actions, demo customization, and restore-defaults separately from planned infrastructure capabilities.
- Make the menu responsive, keyboard operable (Escape, arrows, Home/End), dismissible outside, and localized in all ten languages.
- Preserve the existing profile editor's advanced actions, the local-only backup/restore mechanism, and the separate theme/language selectors.
- Show hosting, domains, DNS/CNAME, APIs, cloud backups and recovery as explicitly **planned**, never as working infrastructure.
- Add regression coverage for menu accessibility, mobile sizing, live backup/restore, editor and reset behavior.

## v0.2.0-rc.14 — Dev Das developer demo & original-inspired experience
- Replace Nico Vale with **Dev Das**, a fictional developer, designer and product builder. Migrate untouched old demo browser saves while preserving genuinely personalized records.
- Ship a separate AI-generated fictional profile portrait, distinct from the real developer's photo, and support optional user photo uploads processed locally in browser and exported as profile JSON.
- Add a layered aurora/gradient/solid background selector, and harmonize three theme palettes with shared responsive orbit and portrait framing.
- Replace proposal TXT downloads with explicit `mailto:` email composition. Demo requests **are not auto-sent or verified as delivered**. Require a real, customer-configured recipient, never reuse the site owner's personal email.
- Expand localization for editor media settings and email enquiry. Keep all management actions local and future infrastructure capabilities marked as planned.
- Verify full source, packaging and Chromium regression suite on the exact release commit before merge.
