# Aurora Peak — Alpine Edition v3.18.1

**Testing site:** https://preview-personalweb.sudip-das-frontend.pages.dev/  
**Audit:** https://preview-personalweb.sudip-das-frontend.pages.dev/?theme-audit=1  
**Branch:** `preview-personalweb` (production `main` deliberately unchanged)

## Creative direction and scope

Aurora Peak now has a distinct **alpine-sunrise / field-notes visual language**, rather than reusing Neon Studio's orbital portrait structure. Its palette uses forest ink, misty mountain greens, lichen yellow, pale stone and soft sunrise apricot. The existing real personal content, original portrait, project descriptions, public links and disabled private-request workflow are preserved.

Theme-only visual implementation:
- `aurora-peak-alpine-v318.css`: full scenic hero, mountain ridge layers, sky glow, arched portrait, trail-marker chips, field-note typography, alpine cards and form treatments; desktop, tablet and mobile breakpoints.
- `aurora-peak-scene-v318.js`: mounts only on the `aurora-peak` theme, unmounts on other themes, restores the original aria-label, and provides a reversible, local-only atmosphere motion control. The system `prefers-reduced-motion` setting disables ambient animation.
- `personal-theme-library.js` and `theme-visual-contract.json`: Alpine Edition swatch/description and canonical contract.
- `preview-theme-audit-v316.js`: Aurora-specific browser tests for landscape presence, arched portrait, hidden orbital rings, three mountain layers, unique identity and motion preference.
- `human-ci-preview-v1.js`: fresh v3.18 report, no passing results carried over from earlier builds.

## Human CI checklist

1. **Desktop (1440px to 1920px):** select Aurora Peak. Confirm the light apricot sunrise, three mountain layers, arched portrait, field-notes badge, trail-marker labels, warm lichen primary action and the distinct two-column composition. Check title and controls do not overlap and there is no horizontal scrollbar.
2. **All other themes:** switch Neon Studio, Editorial, Terminal, Orbit and Cosmic. Confirm none shows the Alpine landscape or field notes. Neon Studio's approved circular/orbit design must be unchanged.
3. **Atmosphere:** click *Pause atmosphere* and *Resume atmosphere*. On an OS with reduced motion enabled, the control should be disabled and ridge/mist/halo movement stopped.
4. **Real device:** test at about 768px, 390px and 320px wide. Confirm the stacked hero, intact photo framing, readable skill tags, tappable video expand button, no clipped cards and no overflow.
5. **Functional smoke:** navigate project links, project search/filters, recruiter shortlist, intro video/captions, menus, contact links and human CI export. Private requests must remain disabled.
6. **Accessibility:** keyboard focus order, visible outlines, zoom at 200%, reduced-motion behavior, usable dark contrast, and readable content without hover effects.
7. **Audit:** open the URL with `?theme-audit=1`, run the six-theme audit and export `webstudio-theme-audit-v3.17.json`. Its computed-style checks complement but cannot replace visual inspection.
8. **Feedback:** complete Human CI and export `webstudio-human-ci-v3.18.json` with screenshots describing actual versus expected behavior, viewport and reproduction steps.

## Verification boundaries

Completed: source syntax, isolation/safety checks, contrast calculations and mock-DOM theme-switch/motion interaction tests. The **new CSS text and runtime were verified in the repository**, not visually in deployed browsers. Cloudflare deployment, screenshot/pixel fidelity, real responsive behavior and media playback **remain unverified** here.

No private source, credentials, analytics or external requests were added. Preview `noindex`, the protected API flag, anti-framing header and disabled CircleCI branch filter remain in place. **Do not promote to production without human acceptance and explicit authorization.**
