# Personal portfolio v2.1 — hero video + discovery redesign

**Repository:** `sudipdasin/sudip-das-frontend`
**Branch:** `preview-personalweb`
**Scope:** visitor preview only; no production promotion, private access activation,
secret handling or personal-profile document exposure.

## Owner visual feedback
The 2026-11-23 screenshots highlighted a vacant slot beside
**Interactive Portfolio** and an oversized, visually repetitive
**Explore the portfolio** gallery that buried actual project discovery.

## Changes actually committed
- `personal-smart-navigation-v1.js?v=1.3.0` appends the **Watch my story**
  launch button to `.hero .actions`, immediately after the existing
  Interactive Portfolio button created earlier by the deferred gallery.
  The cinematic popup itself keeps its real MP4, official HTML5 controls,
  optional approved YouTube override, captions, muted autoplay and safe
  video teardown on closing.
- `portfolio-showcase-v2.css?v=2.1.0` gives that CTA a 44-second duration
  label, clear play icon, theme-matched card appearance, hover/focus states
  and mobile wrapping. It is no longer in the smaller utility header.
- `webstudio-portfolio-gallery.js?v=2.1.0` adds a featured real public
  project spotlight, source-derived project description and development
  status, previous/next buttons, and direct story modal navigation.
  Data comes from published project cards only: no fake portfolio data.
- The six site-theme samples now include different mini-layout structures
  and theme-specific shapes (Editorial paper, Terminal code, Aurora peaks,
  Neon graphics, Cosmic orbit, Orbit). Selecting one still updates the
  actual site theme, and the active choice is marked.
- Original two-project comparison remains intact, but its control group
  is placed within a native `<details>` disclosure that is closed on
  first view to simplify the page's vertical rhythm.
- `scripts/render-portfolio-intro.py` has been enhanced with the
  portrait already publicly displayed on the portfolio, public-facing
  CRM/team/MIS evidence banners, a cinematic chapter progress sequence,
  short turquoise transition strokes, opening/finale original sonic
  accents and improved H.264 encoding quality (CRF 18).
  No copyright-protected external music or fake employer claims.

## Validation evidence
- **Video GitHub Actions run #45142369163: SUCCESS.** Verified build,
  H.264 1280×720, 24 fps, 44 seconds, AAC stereo, full FFmpeg decode;
  committed improved MP4 to `preview-personalweb`.
- **Site GitHub Actions run #45142889441: SUCCESS.** Static source
  contracts; Chromium browser at 1440×900 and 390×844 (Editorial
  theme), correct hero action order, six distinct thumbnail visuals,
  featured LinWin → iVivid carousel, working comparison disclosure,
  native video modal opening/closing, keyboard focus return, no horizontal
  overflow, and FFprobe metadata/caption checks all passed.
- Cloudflare's Turnstile hostkey doesn't authorize localhost; the
  test harness filters **only** its known error 110200, not unrelated
  JavaScript errors. The live Turnstile service was not modified.
- An additional Chromium media-playback check confirms the video has a
  44-second duration, matches the self-hosted MP4 path, includes English
  captions and begins muted playback. Its GitHub Actions result is
  recorded separately after completion; do not report an unexecuted
  run as passing.

## Production boundary
Cloudflare Pages deployment and public network access to the preview
alias have not been independently established by this workflow. The
primary public production site, Cloudflare tokens, DNS, private
request Worker, repository main and protected professional details
were not changed. The previously built WebStudio inline footer demo
stays on-page with no external WebStudio link.
