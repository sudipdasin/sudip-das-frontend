# Personal portfolio preview — v1.9.0 smart quick actions and intro-video popup

**Branch:** `sudipdasin/sudip-das-frontend@preview-personalweb` only.
**Owner directive:** Fix the screenshot-driven Foundation/header layout, relocate Quick
Actions to a bottom-right contextual floating button, and place Intro Video beside
the Interactive Portfolio heading at the top with a stylish in-page YouTube player.

## Implementation

1. The prior Quick Actions source `webstudio-parity.js` no longer inserts
   the visitor navigation UI into the sticky header; instead it appends it
   to the body so the header width and breakpoints are unaffected.
2. `personal-smart-navigation-v1.js` enhances the existing **read-only**
   Quick Actions with a floating pill and a **Suggested next** panel.
   The suggestion derives solely from the visible section's bounding
   rectangle (or currently selected Terminal section), e.g. Projects →
   Strengths. Updates are throttled with `requestAnimationFrame` on
   passive scroll and resize listeners. It has no API calls, analytics,
   profiling or persistent site mutations. Existing permitted
   **visitor-local theme switching** remains unchanged.
3. `personal-smart-navigation-v1.css` styles the floating pill and
   upward-opening panel using each theme's actual color tokens, including
   warm paper Editorial and Terminal. Fixed position respects mobile safe
   area insets; RTL mode moves the launcher to the left. Reduced-motion
   users are not subjected to pop animations.
4. A visitor-facing **Intro video** button is inserted immediately beside
   `SUDIP DAS / INTERACTIVE PORTFOLIO` in the existing preview utility
   band. Activating it opens an accessible full-screen-backdrop, contained
   16:9 player overlay with Close, Escape, focus retention, backdrop close,
   mobile layout and reduced-motion support.
5. The YouTube player is **not hard-coded to a random third-party video**.
   The current portfolio only has an owner YouTube **channel** link, not a
   verified *individual introduction video*.
   An explicit, initially empty configuration is included in `index.html`:

   ```html
   <meta name="portfolio-intro-youtube-url" content="">
   ```

   To activate after obtaining the owner's approved recording, edit it
   on the **preview branch** to e.g.

   ```html
   <meta name="portfolio-intro-youtube-url"
         content="https://www.youtube.com/watch?v=OWNER_VIDEO_ID">
   ```

   It accepts HTTPS `youtube.com/watch?v=ID`, `youtu.be/ID` and canonical
   embed/shorts/live URL forms with an exact eleven-character YouTube ID.
   It rejects channels, non-HTTPS URLs, scripts and unrelated hosts.
   **Only when configured** does the video modal create a
   `https://www.youtube-nocookie.com/embed/{id}` iframe with
   `autoplay=1&mute=1&playsinline=1&controls=1&rel=0`. Autoplay may
   still be prevented by the user's browser policy. Visitors may unmute
   or control playback using official YouTube controls. Closing the
   modal **removes** the iframe immediately to stop playback and restore
   keyboard focus.
6. Existing Foundation two-card layout is preserved and its section
   rhythm refined; no bare Address block was reintroduced. The overlay,
   floating guide, and popup are local visitor presentation only.

## Security / production boundary
No account editing, site settings mutation, back-end requests, private
address exposure, database writes, tracking calls, secret injection,
experimental WebStudio editor controls, or production branch changes
were introduced. `window.PORTFOLIO_PREVIEW_MODE=true` and
`window.PUBLIC_API_BASE=""` remain intact. No public release merge.
The visitor WebStudio footer inline demo remains separate from Intro Video.

## Evidence and limitations
- GitHub connector source readback established JavaScript parses and
  CSS braces balance, with explicit source guards for sandboxed public
  behavior and strict video URL parsing.
- `scripts/verify-smart-navigation.mjs` was executed as a source-level
  assertion harness using fresh connector readbacks (all assertions passed);
  this is **not** a browser end-to-end test.
- `.circleci/config.yml` now checks the fixed Quick Actions placement,
  the intro modal open/close and focus, and context-sensitive suggestion
  flow. Its older requirement that Quick Actions remain docked in the
  header was updated. CircleCI credit availability and actual runs are
  not established, so no full-site browser pass is claimed.
- Real Cloudflare Pages preview branch deployment and actual YouTube
  playback are **unverified**. Without an owner video URL the popup
  truthfully displays a no-video message instead of a misleading
  working player.

## Rollback
Revert only v1.9.0 changes on `preview-personalweb`:
`index.html`, `webstudio-parity.js`,
`personal-smart-navigation-v1.{js,css}`, source/CI tests and the
release manifest. Retain the prior Editorial, Foundation and WebStudio
inline-footer updates. Do not reset main or modify Cloudflare production.
