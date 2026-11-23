# Preview v3.9.5 — Sudip Das capsule fitted to enlarged ring
User explicitly requested adjusting the name and surrounding box after the widened Neon Studio circular orbit.

**Scope**: preview-personalweb branch only. Production main remains at 97ff4fd5dded005e6b0d55c42320fe9870624f7b.

**Before-change backup**: backup/neon-v3.9.4-before-nameplate-refine-2026-11-24 at 7f895b460743a9a7ace5cf08a140ab63993a4c24.
**Golden backup**: backup/neon-studio-approved-v3.9.1-2026-11-24, unchanged.

## Fix
Previously the 174px × 40px pill was fixed just 9px above the lowest point of the wider outer ring. The box corners could cross outside the circular contour despite being vertically within its height. At >=1100px, the pill is now positioned only 6px below the unchanged portrait's lower edge. The width and height scale with the actual widened diameter:
- Height clamp 34–40px; width clamp 132–184px, further reduced if necessary by the true bottom-edge chord of the circle
- Bold 16.2–19.2px centered 'Sudip Das' with balanced padding and cyan outlined acrylic capsule
- Geometric invariant: pill bottom two corners stay >3px inside the expanded orbit across checked viewports
- All other themes and below 1100px retain their previous geometry; no icon, portrait, video, contact or mobile changes
- The original protected reference stylesheet remains untouched. A standalone preview-only Neon stylesheet overlays visual styling.
- Theme SHA guard retains original immutable baseline and authorizes precisely one new JS blob: a34fbb59f40fe1aca48afeb86bb561fcd2d51736.

## Testing and limitations
17 viewport geometry checks (320 to 2560px) and JavaScript syntax checks passed. Preview safety guards checked. Browser screenshots not independently captured; no GitHub Actions or CircleCI credits consumed. Cloudflare deployment must be confirmed after pushing.
