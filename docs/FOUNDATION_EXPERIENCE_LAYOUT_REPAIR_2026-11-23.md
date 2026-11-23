# Portfolio Foundation / Experience — screenshot defect repair
**Date:** 2026-11-23  
**Environment:** `sudipdasin/sudip-das-frontend@preview-personalweb` only.  
**Release label:** `webstudio-personal-preview-v1.5.0-foundation-layout-repair`.

## Defect from owner's screenshot
The Editorial theme's **03 / THE FOUNDATION** section displayed a rounded
left card ("Calm under pressure …") next to a plain-text "PUBLIC LOCATION /
Address / Country — India" block with no matching surface, balance, or
meaningful professional-experience detail. The screenshot was a different
defect from the previously fixed dark Strengths section and private form
input contrast.

Root cause verified in preview HTML/CSS:
- `index.html` had `.work-grid` with `aside.work-aside` plus a
  plain `div.reveal` containing only address copy.
- Original CSS defined `.work-grid{grid-template-columns:.72fr 1.28fr;gap:75px}`
  and a sticky `.work-aside`. An additional theme rule styled
  `.work-aside` as a surface, **not** the adjacent location block.
- "Address" was a misleading label because only the country is public.

## Repair
- `index.html`: Replace the unstyled location column with a semantic
  `article.foundation-summary` containing three grounded, non-sensitive
  public experience themes: systems/technology, service/collaboration and
  independent software-building. Keep existing left summary and LinkedIn
  link. Move country-only location into a small integrated footer.
- `personal-foundation-v1.css`: Two equal cards on desktop; responsive
  stacked panels at <=900px; cancel sticky behavior in this section;
  consistent padding, line-height, card borders and accessible foreground
  contrast across six themes. Editorial uses opaque `#fffaf3` surfaces.
- `scripts/verify-foundation-redesign.mjs`: source/privacy/style contract,
  CSS brace balance and WCAG contrast math.
- `.circleci/config.yml`: Chromium checks for all themes and responsive
  widths: 3 public themes, 2 balanced cards, no "Address" heading, computed
  Editorial heading contrast and layout geometry/overflow.
- `site-release.json`: Preview release metadata and isolation evidence.

## Verification evidence
Fresh GitHub source readback of HTML, CSS, test script, CircleCI YAML and
manifest; **20/20 source/layout-contract and mathematical color checks PASS**.
The color pairs selected in the Editorial override calculate to:
- Main heading `#26352e` on `#fffaf3`: **12.40:1**
- Body `#4f5c54` on `#fffaf3`: **6.76:1**
- Location kicker `#704c36` on `#f3ede2`: **6.49:1**

**Still unverified:** CircleCI execution, live Chromium screenshot of the
exact deployed preview, Cloudflare Pages build and asset version. Static
tests cannot prove provider deployment or actual render. The preview
private-request submission remains explicitly disabled; do not test with
real personal information.

## Safety / rollback
No public production main, DNS, Worker, D1, secrets or user private address
were changed. Keep owner-approved Editorial hero intact. Roll back only
the v1.5.0 preview HTML/CSS/QA/manifest commits if visual review fails;
preserve the prior inline WebStudio footer and contrast fixes.
