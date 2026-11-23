# Personal Neon Studio v3.8.2 — reference-concentric orbit badges

Scope: sudipdasin/sudip-das-frontend preview-personalweb only; no other theme or production changes.

The reference image has five compact icon/label rows outside the right side of the cyan outer ring, with icon centers following an evenly spaced concentric arc. In v3.8.1, badge coordinates followed unequal effective radii, so their clearance differed.

v3.8.2 uses a **single radial distance** for all badges:
- Ring radius `r = --wf-orbit-size / 2`.
- Icon center radius `R = r + 36px`, for all five icons.
- Angles `[-31°, -16°, 0°, +16°, +31°]`, top to bottom.
- Because icon glyph bubbles are 40px wide, geometric edge clearance = `36-20 = 16px` at all five positions, consistent with the owner's example.
- Labels stay upright to the right of each glyph and keep existing real skill names.
- Slightly softened only glyph halo, so the visible outer circle and icons appear distinct.

Checks: CSS/source invariants and mathematical concentricity across diameters 300,324,395,434px; all five center distances equal and non-overlapping. Cloudflare status checked separately. No browser screenshot test; CI not run due owner instruction. Portrait, caption, other themes, contact and private API guards remain unchanged.
