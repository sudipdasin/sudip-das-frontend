# Personal preview v3.5.0 — living video CTA and Quick Hub v2

Target: sudipdasin/sudip-das-frontend@preview-personalweb only. Production, worker, private APIs, Editorial structure and all portfolio data left untouched.

## Professional introduction
- The CTA displays a small muted 6-second first-party VP9 preview loop inside its own 88px surface once at least 30% in view.
- No video request before visible; no playback when offscreen, document hidden, reduced-motion is enabled, or Save-Data is active. Poster remains available.
- A separate visible expand icon button opens the existing full 60-second 720p inline player. The thumbnail is a group, not a nested button. Close/Escape restores the tile, stops the large video, and returns keyboard focus to expand.

## Visitor Quick Hub
- Existing Quick Actions floating launcher and contextual section suggestion retained.
- Three tab groups: Explore (contextual next step plus section links), Themes (local theme switches), Tools (guided tour, projects, shortlist, introduction video, back to top).
- Context line and scroll progress update locally. Three ARIA tabs with arrow/Home/End keyboard navigation; native close and Escape behavior retained. Theme choices keep the original private/read-only boundary.
- Acrylic alpha-blended surface, subtle lighting, theme-aware accents, reduced-motion effects and accessible focus states. No AI backend, telemetry, storage, private access or fabricated intelligence.

No GitHub Actions or CircleCI tests requested. JavaScript syntax and source-level invariants checked only; actual browser playback/visual QA is for owner validation on live preview.
