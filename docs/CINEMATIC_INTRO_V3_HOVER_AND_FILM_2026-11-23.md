# Personal portfolio — Cinematic Introduction v3.0

**Owner directive:** Improve the introductory video and CTA alignment, provide a real moving thumbnail on hover, and substantially enhance the film's imagery, storytelling, effects, original sound design and music.

**Scope:** `sudipdasin/sudip-das-frontend@preview-personalweb` only. Production main, DNS, Cloudflare Workers, secrets, private profile data, access-request submission, and owner editor remain untouched.

## Film: 60 seconds / original cinematic media

The upgraded film is a new 60-second, 1280×720, 24 fps H.264 MP4 with original stereo AAC audio. The existing 44-second professional introduction (itself created from public portfolio facts and using the published site portrait) is supplemented at real chapter boundaries with **four original, individually animated, four-second illustrative segments**:

1. **Global CRM service:** 1,000+ users supported across regions, stylized network globe. Public number from the portfolio hero's proof-row.
2. **Custom MIS / SQL:** 200+ users served, illustrated dashboard and data workflows. Explicitly branded **visual concept**, not a working customer screen.
3. **Linux projects:** LinWin, Tux Steward and iVivid in illustrative desktop windows, marked as conceptual UI—not screenshots nor proof of shipped features.
4. **Creative work:** Animation Studio and independent creative experiments, musical waveforms, original procedural render graphics.

The film also contains original synthesis: spatial chord pads, soft arpeggios, bass, percussion, rhythmic accents, scene transitions, low-frequency emblems and chimes. It does not embed licensed third-party music or external video clips.

There are **13 timed English captions** in `media/sudip-das-professional-introduction.en.vtt`. Playback begins muted only when the user explicitly opens the in-page full-film modal; the player includes pause, seek, volume and fullscreen controls. Closing removes the video to stop playback.

Sources:
- `scripts/render-portfolio-intro.py` — existing approved 44-second base with site portrait
- `scripts/render-portfolio-film-v3.py` — original 60-second edit, four new motion-graphic inserts, music/SFX remaster, six-second silent hover encode
- `.github/workflows/build-portfolio-intro-preview.yml` — automatic preview-only rendering and publication
- `media/sudip-das-professional-introduction-720p.mp4` — validated first-party 60-second film, ~4.9MB
- `media/sudip-das-intro-hover-preview.webm` — 480×270 VP9, silent, six seconds, ~70KB

## Hero CTA design

The four original buttons remain publicly visible, in an intentional **two-column / two-row** action grid rather than depending on unpredictable flex wrapping. The media action is paired visually with the other controls and carries a clear play glyph and **60 sec · Cinematic introduction** caption.

Hover/focus reveals a motion preview without changing the hero layout: an absolutely positioned cinema card with poster and a **six-second silent looping VP9** clip, lazy loaded *only* on interaction. Leaving the button pauses the clip and removes its source. Reduced-motion users and coarse-pointer/touch devices do not receive hover autoplay; the full movie remains directly accessible with a click/tap. Focus restoration from the full modal is deliberately suppressed from retriggering teaser playback.

- `personal-smart-navigation-v1.js?v=1.4.0`
- `portfolio-intro-hover-v3.css?v=3.0.1`
- `scripts/verify-hero-hover-v3.mjs`
- `scripts/verify-portfolio-showcase-browser.mjs`

## Verified evidence

**GitHub Actions #45145789099: PASSED** — rendered 44-second base, constructed all four original segments, synthesized additional stereo sound, encoded the 60-second MP4 and silent teaser, verified both codecs/size/duration and decoded both fully, and committed only to the preview branch.

**GitHub Actions #45147449552: PASSED** — static source and privacy checks; actual Chromium at **1440×900 desktop and 390×844 mobile** verified aligned hero rows and no horizontal overflow; full film opened and loaded with correct 60-second duration, muted playback and captions; popup closes, stops and unloads; desktop hover teaser loaded, played, and unloaded on pointer exit; reduced-motion prevented teaser autoplay; existing six-theme interactive gallery and project navigation remained functional. FFprobe validated media assets.

One legitimate regression was caught and fixed: legacy `.hero .actions .button` specificity forced the mobile Work CTA below 48px. The latest style overrides minimum button height to 64px; the subsequent browser run passed.

**Cloudflare Pages live branch delivery remains UNVERIFIED.** This GitHub-side validation uses the actual static website on an Actions Chromium/local HTTP server, not the Cloudflare-hosted deployment. No claims about real Turnstile / private submission or automatic email are made.

## Safe rollback

Revert the preview's new hover CSS/JS and enhanced renderer/workflow changes only. Maintain previous foundation styling, WebStudio inline footer, personal content privacy, and the public/proprietary project separation.
