# Portfolio preview: original professional introduction film and interaction update

Date: 2026-11-23
Repository/branch: `sudipdasin/sudip-das-frontend@preview-personalweb`.
This is preview-only work; **not** a production promotion.

## Editorial basis and privacy
The film's content comes exclusively from existing owner-approved public
portfolio copy in `index.html`, `data/site.json` and the public
repositories linked in Projects. The nine short chapters are:

1. **Technology with Purpose** — Sudip Das, technology professional and
   independent builder.
2. **Enterprise IT. Human Clarity.** — CRM platforms, global technical
   support and systems.
3. **People Make the Difference.** — team leadership, collaboration and
   service delivery.
4. **From Complexity to Clarity.** — SQL, automation, business systems
   and MIS.
5. **Make Technology Approachable.** — LinWin and Tux Steward; clearly
   presented as public software projects in development.
6. **Imagination, in Motion.** — iVivid and Animation Studio, as creative
   projects rather than completed commercial releases.
7. **Build. Share. Improve.** — open-source collaboration.
8. **Systems. Service. People. Building.** — the four public strengths.
9. **Let's Make Something Useful.** — collaboration invitation.

No employer-specific private CV history, exact street location, unreleased
professional achievements, fictional identity, passwords or protected
profile documents are exposed.

## Delivered media

A finished **44-second, 1280×720, 24 fps H.264 MP4** with 44.1 kHz
stereo AAC audio has been rendered and decoded in the assistant runtime.
It contains original motion graphics, art-directed typography, abstract
technology illustrations, and procedural music/SFX synthesised by the
included Python renderer. The audio does not reuse copyrighted samples
or depend on external music services.

Reproducible source:
`scripts/render-portfolio-intro.py`.

Public preview media path:
`media/sudip-das-professional-introduction-720p.mp4`.

Intro poster:
`media/sudip-das-intro-poster.svg`.

The GitHub workflow
`.github/workflows/build-portfolio-intro-preview.yml` uses an Ubuntu runner
with FFmpeg, Pillow, NumPy, SciPy and open fonts, renders the MP4, uses
`ffprobe` and a full `ffmpeg -f null` decoder check, uploads an Action
artifact, and commits **only to preview-personalweb**. It does not
push to main or touch private profile backend systems.

## In-page playback
`personal-smart-navigation-v1.js` uses an approved YouTube watch URL if
one is configured, otherwise serves the first-party media file above
inside the existing Intro Video modal. The HTML5 video element has
controls, initial muted autoplay, playsinline, poster and explicit load
error handling. Browser autoplay restrictions can still block playback:
controls remain available. Closing the modal removes/purges the player
so playback/audio stops. A missing asset displays an accurate pending
publication message rather than a broken player or invented live state.

## Quick Actions change
The floating round Quick Actions button's halo no longer spins or
pulses continuously when idle. A **single short sweep** triggers on
hover, focus-visible or click-expanded. Its contextual suggestions and
glass overlay are preserved. The existing reduced-motion media query
disables the animation.

## Verification / limitations
- Local rendered MP4: 44.0s, H.264, 1280×720, 24 fps, AAC stereo.
  FFmpeg full decode found no errors; a nine-frame scene contact sheet
  was visually inspected.
- GitHub Actions preview-run #45111247382 independently rendered and
  **passed video/audio metadata and decode checks**, and uploaded a ZIP
  artifact containing the MP4. The final git push failed due to a
  branch-head race (ongoing UI commits landed between rebase and push).
  An explicit bounded retry is being added to the workflow; **do not**
  claim the Pages MP4 exists until a branch readback confirms it.
- Chrome full-portfolio test and actual Cloudflare branch deployment
  remain separate verification gates. The new preview tests explicitly
  permit a missing video asset while providing truthful feedback.
- Automatic email requests remain disabled and no private profile records
  are bundled or transmitted.
