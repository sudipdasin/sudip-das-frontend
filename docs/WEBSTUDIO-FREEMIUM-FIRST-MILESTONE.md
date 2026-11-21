# WebStudio Free / Pro Architecture — First functional milestone

## Free available now

The community/free edition has **two exportable themes: Orbit and Editorial**.
These are the first two selections in the studio theme menu. All six designs
remain visible in the interactive demo for evaluation, but Terminal,
Aurora Peak, Neon Studio, and Cosmic are **Pro previews**, not distributable
free packages.

The Free section's five illustrated walkthrough chapters cover design,
editing, portable export, privacy, and feedback. All five must be completed
to start a Free export; the regular demo may be explored at any time.

The working Free export:
- Reads the locally saved demo profile through the existing validated
  `StudioDemo.getProfile()` API.
- Requires a name, role, tagline, SEO fields and at least one project.
- Validates HTTPS project/social URLs, sizes and dangerous secret markers.
- Renders all user-provided text as escaped HTML.
- Produces a browser-local standard ZIP containing `site/index.html`,
  `site/assets/base.css`, `site/themes/{orbit|editorial}.css`,
  `site/data/profile.json`, `site/config/modules.json`, and
  `site/README.txt`.
- Uses no third-party package, upload, telemetry, hosting or deployment.
  The user extracts and publishes the `site/` contents manually.

**Module architecture:** edition boundaries are declared in
`examples/customer-demo/webstudio-editions.json`. The static generator
uses a small explicit theme registry and separate, selectable theme CSS.
The configuration file reserves a plugins list for future reviewed modules.
It is intentionally empty; no arbitrary third-party plugin JavaScript is
executed or imported automatically.

## Email, feedback, and privacy limits

After approximately 48 hours of local Free usage, the browser may display a
dismissible detailed-feedback reminder. The user can write feedback and open
their own email client addressed to the developer. The browser cannot confirm
whether the message was actually sent or received. No automatic account
verification or verified email identity exists in this release, and no
existing site or previously exported package is disabled for not sending
feedback. A local device clock or storage can be changed: it is not a
tamper-proof licensing trial.

An email field accepts only a format-valid optional reply address and stays
local until the tester chooses to compose feedback. Adding a real server-side
email-confirmation flow requires: consent/privacy terms, rate limiting,
anti-abuse controls, time-limited single-use token storage, email provider,
and live end-to-end delivery verification. **Do not label syntactically
valid addresses as verified users.**

## Security boundary

Publicly served HTML, CSS, JavaScript and JSON cannot be encrypted in a way
that prevents a site visitor from reading or copying them: the visitor's
browser must decrypt or execute them. Static ZIPs must contain no secrets or
private records. Private/proprietary services and source belong in a separate
access-controlled backend, not in this free static package. Premium claims
about secure vaults, hosted publishing or automation remain **planned**.

The demo has no payment button activated; it must remain disabled until
commerce and fulfillment are independently validated.

## WebStudio -> Personal adaptation

Use the reviewed `contracts/personal-port-v1.json` pipeline when moving
visual design or features to the real private personal portfolio. Never
copy the fictional Dev Das profile, local editable-content demo, developer
feedback onboarding, unverified email trial, or demo-specific ZIP exporter
into the real public visitor profile. Theme token and accessible UI
components can be adapted after review and private site acceptance tests.

## Tests

```bash
node --test tests/webstudio-freemium.test.mjs
node --test tests/customer-demo-build.test.mjs
node browser-tests/customer-demo.mjs
node scripts/build-customer-demo.mjs
node scripts/verify-customer-demo.mjs
```

This milestone does not include backend email verification, real cloud
hosting, paid entitlements, encrypted server code, or automatic publication.
