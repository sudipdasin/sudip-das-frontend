# Neon Studio mobile preview audit — v3.9.9

## Tested scope and evidence
Actual preview source in sudipdasin/sudip-das-frontend, branch preview-personalweb, prior source SHA ad8aca077f7c5a0fef9f64f7a924fa3af3f8a789. Read index.html, 9 loaded interactive JS modules, responsive CSS across core Neon, navigation, portrait, gallery, video, contact, Quick Hub and footer. All nine main JS files compiled with JavaScript source syntax checks. Calculated mobile header clearance for 280, 320, 344, 350, 360, 375, 390, 414, 430, 600, 601, 768, 1024px. Verified real video and captions asset paths in the public Git tree.

## Confirmed working by source (NOT a live DOM/browser assertion)
- Dedicated phone CSS stacks the hero at <=980px and uses a concentric portrait/orbit; phone 250–330px ring.
- Phone nav hides extra selects while Menu is collapsed; they reappear when Menu opens. Theme launcher remains accessible.
- Five orbit icon labels hide on phones; icon-only representation preserves visual scene; source JS creates five.
- Hero action grid is two columns on <=520px; inline Professional Introduction player has tap-accessible expand button, real mp4, native controls and captions; hover teaser is disabled for coarse pointers.
- Quick Hub four tabs retain explicit four-column layout, bounded max height and vertical scrolling; floating launcher is 52px on phones.
- Contact hub has three direct buttons and four native details accordions; mobile grid is single column and hover interactions apply only to fine-pointer mouse.
- Gallery choices reduce to two columns and comparison slots to one at <=480px; tour and visitor actions use buttons.
- Preview private-request form remains guarded, API blank, noindex; production Worker untouched.

## Defects found and repaired
1. Mobile video expand glyph was CSS-forced to a *29px* square and overly small target for touch. The accessible button is now visibly 44×44px with matching CTA right padding.
2. Quick Hub close control was *32px* and 4 tabs *41px* high. Both updated to >=44px; tool shortcuts likewise.
3. Fixed Quick Hub launcher at lower-right could cover bottom footer controls at the end of the page. Neon mobile footer adds 86px + iOS safe-area inset.
4. Very small widths and high zoom can crowd the SD two-line brand, Menu and the 43px theme launcher. Under 350px the monogram/text/gaps are compacted while preserving visible Menu/Theme and 44px buttons.

## Limitations and follow-up
- Direct Cloudflare URL resolution failed in container and web retrieval tool, so no real live screenshots, Chrome browser DOM/overflow measurements, Playwright clicks, network requests, device emulation or physical mobile tests were completed. This remains an **incomplete end-to-end visual audit**, not a certification that every mobile feature works.
- Real on-device QA should run on Chromium Android and Safari iOS at 320, 360, 390, 414, 600 and 768 CSS px, portrait and landscape, 200% text zoom, coarse pointer and reduced motion. Test menu open/close, language/theme selects, orb/card labels, video tap playback and captions, gallery modal focus, Quick Hub four tabs, contact accordions, footer/safe area and consent form preview guard.
- Changes are scoped to Neon Studio on <=600px except new approval record and HTML asset reference. All other themes, desktop, API, production main and golden backups are unchanged. No CI credit-based runs.
