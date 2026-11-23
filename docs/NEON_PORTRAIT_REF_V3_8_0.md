# Personal Neon Studio portrait/orbit reference refinement — v3.8.0

Branch: `sudipdasin/sudip-das-frontend@preview-personalweb`; no production or private API changes.

Owner reference shows a centered portrait with cyan/blue layered glow, two static concentric outer rings, five evenly placed right-edge badges with visible separation from rings, and a short centered lower identity capsule **Sudip Das** inside the bottom of the outer ring.

## Implemented
- Added a final **Neon-only** stylesheet `personal-neon-portrait-refinement-v1.css` after the Aurora parity layer.
- Portrait retains the exact existing user portrait asset and natural facial fidelity. Stronger cyan rim, diffuse cyan-blue bloom, faint violet secondary glow, central stationary backglow. Orbit circle geometry remains script-locked to 50%/50%; only independent arcs and sparkles may animate.
- Five badges: right-only, ordered CRM & SQL, Linux tools, Systems, Creative technology, Technical support, smooth vertical arc; independent glyphs and labels intentionally separated from outer circular ring by at least 10px at the widest point.
- Caption: Neon Studio only, literal **Sudip Das** with no dot, 176px wide desktop / 146px phone, anchored *inside* lower boundary of outer ring by changing the inline-important `syncNeonRing()` vertical placement. Other themes regain their original caption on theme switching.
- 1100-1380px laptops shift the **whole** orbit stage inward by 26px; mobile preserves the pre-existing icon-only satellites with reduced halo intensity.
- Existing personal hero name, intro video, all published links, contact, Quick Hub and owner-reviewed request form unchanged.
- Source syntax, fixed geometry contracts and preview noindex/no API guards checked. CI intentionally not run. Browser visual validation was not performed.

