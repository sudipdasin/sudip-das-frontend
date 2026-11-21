# Two separate Web Studio visual references

**Never conflate these screenshots.** This document defines theme identity and is a design acceptance contract. It does not assert a pixel-perfect match has been achieved.

## Design 1 — Aurora Studio
- Source file supplied by user: `design 1.png`.
- Reference canvas: **1833 × 858**.
- Internal existing theme ID: `neon-studio`, visible dropdown title **Design 1 — Aurora Studio**.
- Styling: `studio-reference-layout.css`, `studio-orbit-fidelity.css`, then separately scoped `studio-design-one.css`.
- Visual structure: narrow turquoise/infinity utility strip; dark teal navigation; separate **Studio** and **System** menus; mountain silhouette, aurora glow and cyan flowing ribbon; huge mostly white title with cyan dot; realistic developer portrait inside concentric rings; **five small horizontal role+icon labels down the right orbit edge**; one full-width data-control/infinity band; **six compact rectangular tiles** below.
- Do not add four metric stats, a blue green-shield trust header, or four large colored cards to Design 1.

## Design 2 — Cosmic Studio
- Source file supplied by user: `design 2.png`.
- Reference canvas: **1672 × 941**.
- New theme ID: `design-2`, visible dropdown title **Design 2 — Cosmic Studio**.
- Styling: independent selectors in `studio-design-two.css`, with separate structure from `studio-design-two.js`.
- Visual structure: larger navy/blue utility strip with lime shield icon, brand tagline and green data-control pill; blue-violet glowing abstract waves, not mountain skyline; gradient cyan-purple title; single Studio dropdown grouping features/backup and separate Services menu; a photographic portrait and **four large orbit icon buttons (no labels stacked on right)**; four illustrative demo metrics in translucent hero strip; **four large glowing cards** beneath hero (purple/cyan/green/orange).
- Do not add Design 1's infinity data-control band or six small tiles to Design 2.

## Global functional and safety requirements
- Keep functional navigation, profile editor, language/theme selection, local JSON export and import, and the compose-in-email contact experience.
- Unimplemented hosting, auto-recovery, DNS, commercial checkout and similar tools must use actual `disabled` buttons with a visible Coming soon/Planned indication.
- The demo is fictional; illustrated statistics are **not real metrics**.
- Before a release: run Ubuntu/Chromium regression tests, check desktop screenshots at **both original canvas resolutions**, check 390px mobile, confirm no overflow, and verify actual GitHub Pages publication.
- A CSS-only imitation is not the same as a measured pixel-by-pixel visual comparison; report fidelity honestly.
