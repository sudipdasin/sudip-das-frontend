# Personal preview v3.5.1 — Hover-only tile preview and Kolkata location

Target: `sudipdasin/sudip-das-frontend@preview-personalweb` only. Production main, backend, private address, original MP4 and public WebStudio Aurora source are unchanged.

**CTA:** On desktop hover with fine pointer, the original muted six-second teaser loads *only when the pointer is over the visible tile*. When the video emits the playing event, the title and its dark overlay disappear, leaving only a 31 px expand control and unobstructed video. On pointer leave, visibility loss, offscreen intersection, reduced-motion and Save-Data, the teaser is paused, removed and unloaded. The preview does not load or play on initial viewport entry or keyboard focus. The separate expand control continues to open the full first-party 60-second inline video with accessible controls and captions; it restores focus on close.

**Location:** Exactly `Kolkata, India - Open to Collaboration` in the static hero and in all 10 translation dictionaries, so every visual theme and language receives it. The owner-approved city is reflected in the public foundation location and notes; full street/postal address remains private.

CI is intentionally not run. Source syntax and safety invariants were checked; browser interaction and pixel parity require user validation on the Cloudflare preview.
