# Neon Studio v3.8.1 — measured reference corrections

Reference supplied by owner: current personal photo (650×530) versus WebStudio developer portrait example (573×407). Live browser screenshot could not be fetched in the current runtime, so this is NOT a pixel-perfect rendered check; it is source and reference-image geometry validation.

## Diagnosis
- v3.8.0 preserved a .73 photo/outer-ring ratio, when the reference portrait occupies more of its circular frame. Purple inner ring .84 was correspondingly close to photo.
- Five medallion centers had wide ±.68r spread and insufficient visible clearance at the equator; reference is closer to ±.57r and .29r, with visibly detached icon bubbles.
- v3.8.0 portrait was expanded cosmetically by glowing borders but did not enlarge its geometric diameter; caption must be sized relative to the portrait to avoid overlap.

## Changes
- Inner violet ring diameter increases from 0.84× to 0.91× outer ring.
- Portrait ratio is adaptive and approximately .8–.84× outer diameter on desktop, constrained so both real portrait and bottom nameplate fit inside ring, with a 3–5px gap.
- Short caption remains 'Sudip Das' only in Neon; other themes restore original.
- Five arc coordinates now x/r=(1.16,1.24,1.27,1.24,1.16); y/r=(-.57,-.29,0,.29,.57); circle-to-icon gap remains >=20px in calculated 300–434px outer ring.
- Glow strengthened on the real image rim but reduced diffuse spill from v3.8.0.
- Real media, all other themes, user profile data, Quick Hub, video, contact, backend, privacy guards and production untouched.

## Tests
- JavaScript source syntax check
- Numeric geometry checks for viewport widths 390,600,980,1100,1200,1380,1450,1600,1920
- Five icon clearance checks for outer diameter 300px and 434px
- CSS/preview/branch safety checks
- No browser visual check and no CI due to GitHub Actions/CircleCI credit constraints.

