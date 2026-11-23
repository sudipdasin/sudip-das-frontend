# Preview v3.9.4 — Wider Neon Studio circle (owner request)

**Production unchanged.** The owner expressly requested that the personal Neon Studio ring in the preview be made wider, to resemble the WebStudio reference. This is an approved **preview variation**, not a blanket permission to alter the protected design or release to production.

## Safety checkpoints
- Original approved visual snapshot: `d8f97f3b7219007ca55f4793e3c9ec4bb03f4d7e`
- Original immutable backup: `backup/neon-studio-approved-v3.9.1-2026-11-24`
- Latest pre-change backup: `backup/neon-v3.9.3-before-wider-orbit-2026-11-24`, SHA `c9bbc2c4b7eba2af0c9b35c9f3b2dd71dfcaef97`
- Production main must stay at `97ff4fd5dded005e6b0d55c42320fe9870624f7b`.

## Implementation
- **Desktop 1100px+:** Azure outer ring diameter +14% while retaining 1:1 circle width/height. At wide desktop it becomes ~495px instead of ~434px.
- **Inner violet ring:** 0.96 × old ring diameter (≈84% of new outer diameter), matching the reference's separation between layers.
- **Photo:** uses its original reference diameter, not enlarged with the outer ring. Preserve true portrait proportions and cropping.
- **Five satellites:** remain on the same concentric arc with a computed 10px ring-to-icon gap and order unchanged. Shift entire scene 21px further left at 1100–1380px to compensate for outward growth of right-hand labels.
- **Short name capsule:** remains 40px high with `Sudip Das`; it is positioned just inside the expanded outer circle below the photo without overlap.
- **1380px breakpoint:** smooths original outer diameter discontinuity to avoid visible abrupt shrinkage as window resizes.
- **Tablet/phone below 1100px:** previous orbit dimensions, nameplate and icon-only layout unchanged.
- **Original photo, theme dropdown, intro video, compact contact suite and Quick Hub:** unchanged.
- **Browser behavior:** Orbit circles remain stationary and concentric; orbit particles and other existing animations remain as before.
- **Guardrail:** `theme-visual-contract.json` retains original approved file hashes, and records a single explicitly authorized new hash for `webstudio-parity.js`. The integrity checker verifies that exact exception without loosening protection of four other visual assets.

## Verification
JavaScript syntax and static geometry assertions were checked for 320, 390, 600, 768, 900, 980, 1099, 1100, 1200, 1380, 1381, 1440, 1600, 1892, 1920 and 2560px. No GitHub Actions/CircleCI runs requested. Live browser screenshot and interactive responsive regression **not independently verified**; Cloudflare deployment to be checked after commit.
