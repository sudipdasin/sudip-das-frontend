# WebStudio Signature Panel v3.32.0 — design system and manual QA

**User screenshot:** 2026-11-24, Neon Studio hero action cluster: GitHub, Explore my work, Interactive portfolio, Professional Introduction, Creative Direction badge and collaboration location.

**Component name:** **Signature Panel** (`ws-signature-host` / `ws-signature-actions`).

## Intent

Turn a set of unrelated hero tiles into one recognizable, distinctive high-quality portfolio entry point. The Signature Panel is a lightweight presentational enhancement around existing functional elements. It does not change application routing, fetch APIs, plugin registration, public repository links, the video player, the hero portrait, or the standalone GitHub disclosure portal.

## Implemented

- Unified 2×2 action frame with consistent spacing, large accessible hit areas, explicit hierarchy and a clean premium surface
- “Explore my work” as the primary action; GitHub, interactive portfolio and professional introduction as secondary actions
- Video caption rendered on an opaque high-contrast text plate; actual poster/video remains behind it. Editorial intentionally keeps its non-dark video-overlay behavior
- Matching identity badge and compact availability row, as a connected footer to the action area
- Small translated **Signature Panel** heading and localized subtitle: *Explore · Discover · Connect*
- Six distinct color, typography, shape and surface grammars, without reparenting the original controls
- Responsive: two columns for wide layouts, single-column controls at narrow viewports; 44px+ interactive targets
- Keyboard focus outlines, reduced-motion mode, forced-colors support, no new network calls
- All new copy translated in 10 current languages: English, Hindi, Bengali, Spanish, French, German, Portuguese, Arabic, Simplified Chinese and Japanese
- Separate JS module `signature-panel-v332.js` and CSS module `signature-panel-v332.css`; loaded after existing site engines

## Theme direction

| Theme | Surface | Accent | Geometry |
|---|---|---|---|
| Orbit | Deep Atlantic glass | Mint teal | Rounded instrumentation |
| Editorial | Warm paper | Copper brown | Restrained square folio |
| Terminal | Green-black console | Phosphor green | Dashed square modules |
| Aurora Peak | Pine forest glass | Pale alpine lime | Soft field-note arches |
| Neon Studio | Midnight technology glass | Bright cyan | Polished electric radii |
| Cosmic | Deep-indigo prism | Soft lavender | Asymmetric constellation corners |

Theme-level contrast calculations for the selected primary CTA background/text were all above **5.48:1**. Main secondary card ink contrast against its background was above **9.2:1** across all six themes. These are CSS token calculations, not a full browser accessibility audit.

## Non-regression contract

- Do NOT wrap, move, replace or remove `.hero-text > .actions`. Older modules and CSS query this exact direct child.
- Do NOT wrap/replace the `.gh-hero-shell` and `.gh-hero-panel`; the portaled GitHub popup remains independent and fully opaque as in v3.31.3.
- Do NOT replace `.pv-intro-tile`, `.portfolio-gallery-hero-launch`, `.ws29-hero-dossier`, `.location` or any video/media resources.
- Add heading as sibling **before** `.actions`; add classes and accessible metadata only.
- No production deployment; keep GitHub Actions and CircleCI stopped.

## Owner manual acceptance

Testing URL: https://preview-personalweb.sudip-das-frontend.pages.dev/?v=3.32.0

1. Confirm HTML `portfolio-visual-build` marker equals `preview-signature-panel-v3.32.0`.
2. Inspect the Signature Panel in all six themes at **1906, 1440, 768 and 390px**.
3. Confirm Explore my work remains primary, four actions are visible, evenly sized, non-overlapping and keyboard-clickable.
4. In Neon and Cosmic, confirm the GitHub menu retains the opaque themed backing and appears above the marquee; click outside, Escape, re-open, resize.
5. Check Professional Introduction video poster is legible and **actual video playback** works after expanding. Editorial must not acquire a dark overlay.
6. Confirm Interactive portfolio opens, identity badge and collaboration status remain visible, and main portrait is untouched.
7. Change through all ten languages; check the new heading/subtitle, Arabic RTL, text wrapping and high contrast.
8. Turn on reduced motion and forced-colors. Check focus rings and that the page has no horizontal overflow.
9. Send screenshot feedback and mark `manualQAStatus: passed` only after all owner checks. The 187-theme audit and plugin-platform QA remain separate.

## Verification and limitations

GitHub repository readback and JavaScript syntax/CSS source checks, six-theme contrast-token calculations, and a synthetic DOM runtime check were performed. They are **not a replacement for a real browser test**. No Cloudflare deployment completion or live page screenshot has been independently verified. The release is **MANUAL_QA_PENDING**.
