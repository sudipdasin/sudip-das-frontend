# WebStudio inline animated reveal — preview v1.6.0

**Owner requirement:** The WebStudio demo must pop out with animation when
clicked and collapse back into the footer when closed. Keep the demonstration
on the personal portfolio page, preserve all three original SVG scenes, and
offer no external WebStudio demo link.

## Source change
Only the public static preview `sudipdasin/sudip-das-frontend@preview-personalweb` was modified.

- `index.html`: **Explore the inline demo** button starts
  `aria-expanded="false"`, the showcase starts `data-open="false"`,
  `aria-hidden="true" inert`, and includes a visible **Close demo** button.
  Added a clipping inner wrapper so the panel can animate to/from zero height.
- `webstudio-footer.css` v1.2.0: grid-track interpolation `0fr → 1fr`,
  opacity, scale and vertical movement; reverse animation for closing;
  dark/Editorial styling, responsive presentation, reduced-motion bypass.
- `webstudio-footer.js` v1.2.0: click to toggle, Close button, Escape,
  focus restoration, explicit `aria-expanded`/`aria-hidden`/`inert`
  state, smooth in-page scrolling. Existing three scene navigation and
  email-only lead field unchanged.
- CircleCI browser assertions updated for the default collapsed state,
  opening to visible content, Close and Escape reverse, and zero-height
  closed geometry. Source contract in
  `scripts/verify-editorial-webstudio-footer.mjs` updated to v1.2.0.

## Verified local evidence
A local **isolated Chromium 144.0.7559.96** fixture reproduced the relevant
CSS and toggling logic to test the disclosure behavior. The first run caught
a real defect: `padding-top:23px` plus a one-pixel border on the collapsing
grid item left **24px** in the closed state. The fix moved both onto the
first inner row and removed them from the collapsing grid child.

After correction the isolated browser tests passed:

| Viewport / preference | Closed | Open | Closed again | Escape + focus |
| --- | ---: | ---: | ---: | --- |
| 1280px desktop, normal motion | 0px | 433px | 0px | PASS |
| 390px mobile, normal motion | 0px | 578.9px | 0px | PASS |
| 1280px desktop, reduced motion | 0px | 433px | 0px | PASS |

The test fixture was **not** a full Cloudflare-served portfolio;
this demonstrates the actual animation pattern in an isolated browser,
not the complete site's deployed behavior. Current GitHub connector
readback also found **16/16 preview source-contract checks passing**,
JavaScript syntax parse passing, and balanced CSS braces.

## Preservation and boundaries
- The preview private-profile request stays disabled, `PUBLIC_API_BASE=""`.
- Only local, read-only visitor demo state changes; no owner/site editor
  controls are exposed, no private address leaks or new outbound link.
- Existing email-only interest action remains a mail client compose fallback;
  automatic notification requires separately verified service credentials.
- The production main branch, primary domains, Cloudflare DNS, Worker,
  production DB and secrets were not modified.
- Cloudflare Pages branch deployment and full-site CircleCI browser runs
  have not been independently verified; do not misreport as passing.

## Rollback
Revert the v1.6.0 `index.html`, `webstudio-footer.css`,
`webstudio-footer.js`, source/CI tests and release manifest changes from
`preview-personalweb`. Keep the earlier Foundation and Editorial contrast
repairs and the three original local SVG illustrations.
