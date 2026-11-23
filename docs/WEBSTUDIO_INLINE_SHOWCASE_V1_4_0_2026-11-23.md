# Personal portfolio preview — WebStudio inline showcase v1.4.0
**Date:** 2026-11-23  |  **Source:** `preview-personalweb` (preview only)

## Owner request
Remove the outbound WebStudio demo link from the personal portfolio footer.
Explain the product **in place** through a captivating, image-rich illustrated
walkthrough. Keep the separate email-only interest CTA. Do not send visitors
to a separate WebStudio site or expose site-owner editing capabilities.

## Changes
- Removed the old external demo anchor entirely from `index.html`.
- Added an inline three-scene walkthrough, visible by default in the footer.
- Created three self-contained local SVG images:
  `webstudio-inline-layout.svg`, `webstudio-inline-themes.svg`,
  `webstudio-inline-workflow.svg`.
- Added numbered tabs, previous/next controls, ArrowLeft/ArrowRight/Home/End
  keyboard support, descriptive alt text, a visual concept disclaimer and a
  local **Explore the inline demo** scroll button.
- Added responsive layout and Editorial contrast adaptation in
  `webstudio-footer.css`. Updated `webstudio-footer.js`, preserving the
  pre-existing opt-in mail implementation. Bumped both asset URLs to v1.1.0.
- Extended the source-verification script to require three local images,
  local interactions, and **no external WebStudio demo link**.
- Extended CircleCI browser tests to check a rendered illustration, tabs,
  previous/next flow and link absence.
- Updated the preview release metadata to v1.4.0.

## Transparency
Images are original **illustrative UI concepts**, not screenshots of an
actual functioning WebStudio editor. Public visitor actions control only
the local walkthrough state, not global site configuration. The personal
preview remains non-indexable, private-profile requests remain disabled,
and `PUBLIC_API_BASE` remains blank. No GitHub `main`, Cloudflare DNS,
production Worker, protected database, or secret was modified.

The email-only interest field still uses a `mailto:` compose fallback.
Automated email requires the preview-specific reviewed Cloudflare
config/secrets, dedicated D1 binding and live inbox delivery test already
documented in `PERSONAL_EDITORIAL_CONTRAST_WEBSTUDIO_FOOTER_2026-11-23.md`.
No automatic email claim is made.

## Verification ledger
Connector readback of all updated source files and illustrative images
followed by **19/19 static source/contract checks passed**: no external
WebStudio demo URL, 3 locally referenced SVGs, valid nested SVG tag
structure, 3 tab attributes, action wiring, inactive panel visibility
logic, correct CSS/JS cache versions, balanced CSS braces, parseable
browser JS, existing form and preview API isolation unchanged.

**Not verified:** the Cloudflare branch alias deployment of this exact
commit; actual Chromium browser interaction; images rendered in live
browser; email inbox delivery. An unauthenticated read through the web
retrieval tool could not access the Cloudflare preview alias, which is
not evidence that the site is offline. CircleCI tests are **committed,
not represented as passing without executed run results**.

## Rollback
Revert only the footer HTML, CSS/JS, asset additions, CI assertions, and
release manifest commits for this v1.4.0 change on
`preview-personalweb`. Keep the previously approved Editorial
contrast and personal website content intact.
