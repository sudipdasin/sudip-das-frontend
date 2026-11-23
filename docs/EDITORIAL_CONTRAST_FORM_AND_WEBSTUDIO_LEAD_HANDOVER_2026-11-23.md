# Editorial request-form contrast / WebStudio lead — 2026-11-23

## Scope
**Personal website preview only**: `preview-personalweb` in `sudipdasin/sudip-das-frontend`.
Do not merge or promote to public production until release approval. Public Pages production
and the unrelated LifeSphere/WebStudio private backend are unchanged.

## Changes
- `personal-editorial-contrast.css`: Added scoped light Editorial form and vault surface
  treatment to complement the earlier Strengths section repair. All six themes remain
  supported; only `body.ws-parity[data-theme="editorial"]` overrides were added.
- `index.html`: Bumped the contrast CSS URL to `v=1.0.1` for cache invalidation.
- `scripts/verify-editorial-webstudio-footer.mjs`: Added source assertions for form
  labels, field contrast, radio controls, focus indicators and card backgrounds.
- `site-release.json`: Recorded `webstudio-personal-preview-v1.3.1-editorial-form-contrast`.

## Evidence and limitations
GitHub connector readback from `preview-personalweb` confirms updated HTML, CSS,
source-check script, WebStudio footer, and fail-closed Pages Function. A separate
20-point inline static source and contrast audit passed **20/20**. Calculated WCAG
contrast ratios for known opaque colors:

| Pair | Calculated contrast |
| --- | ---: |
| Editorial input text on input background | 14.81:1 |
| Editorial form labels on paper | 10.30:1 |
| Editorial helper text on paper | 6.42:1 |
| Editorial radio label on radio background | 11.69:1 |

This is a **source and mathematical color audit**, **NOT** a completed Chromium
functional/pixel test, Cloudflare deployment verification, or inbox delivery test.
CircleCI combined status for the final source commit exposed zero status contexts.

## WebStudio lead-capture readiness
The footer includes a preview-only clickable WebStudio demo, expanding one-field
email form, and a truthful `mailto:` fallback. Automated email is still disabled.
The optional same-origin endpoint `/api/webstudio-interest` is staged to send to
`OWNER_EMAIL` through an HMAC-signed Gmail bridge, but only after **preview-only**
configuration: `WEBSTUDIO_INTEREST_ENABLED=true`,
`WEBSTUDIO_INTEREST_APPROVED_HOST`, `MAIL_BRIDGE_URL`, `MAIL_BRIDGE_SECRET`,
`OWNER_EMAIL`, `TURNSTILE_SECRET_KEY`, `WEBSTUDIO_RATE_SALT`, and dedicated
`INTEREST_DB` migration from `docs/webstudio-interest-rate-limits.sql`.
Then verify a real visitor challenge and successful owner inbox receipt. Never
copy production's private-profile database into preview, expose secrets in static
HTML, or claim automated mail delivery before a real receipt.

The client meta flags remain absent by design until those checks complete, and
`PUBLIC_API_BASE=""` still blocks private-profile request submission in preview.

## Rollback
Revert only commits belonging to this styling patch on
`preview-personalweb`; don't reset the previous WebStudio footer or
Strengths-section work. Original Editorial hero/portrait CSS was not touched.
