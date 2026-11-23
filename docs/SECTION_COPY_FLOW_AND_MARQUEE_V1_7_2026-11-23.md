# Personal portfolio preview — v1.7.0 paragraph flow + marquee repair

**Owner directive (2026-11-23):** Preserve these three exact sentences but stop them
breaking the layout and blend them with the selected theme. Fix the marquee ticker
so it obeys the page layout without overflowing or jumping between copies.

## Source / precise defect
- Repository: `sudipdasin/sudip-das-frontend`, branch `preview-personalweb`.
- Before repair, three sections `#about`, `#projects` and `#experience`
  had right descriptions as plain `.section-head > p` children of a
  two-item flex layout. Large headings and a max 400px description
  could compete horizontally, especially under theme-specific type rules.
- The ticker was twelve direct `.ticker-in > span` items and animated
  `translateX(-50%)`. Inter-item gap/padding at the duplicated boundary
  were not measured as one of two identical structural units; the track
  was also unbounded `max-content` without a page-container viewport.
- `languages.js` specifically translated `.ticker-in > span`;
  modifying the markup without this translator would silently break
  non-English ticker labels. This dependency was updated intentionally.

## Changes made (preview only)
1. `index.html`: Kept all three owner-supplied sentences byte-for-byte in
   the same `section-head > p` nodes; appended
   `personal-layout-flow-v1.css?v=1.0.0` after all prior styles.
   Rebuilt ticker into a visible `ticker-window` around **two identical
   six-item ticker-group nodes**, and added a screen-reader-only public
   summary to avoid duplicate announcements.
2. `personal-layout-flow-v1.css`: Constrained the three headings and
   description blocks using responsive `minmax(0,...)` grid columns,
   paragraph max widths and safe wrapping. Description surfaces inherit
   each theme's panel, ink, accent and border tokens; Editorial receives
   specific warm-cream paper styling, without altering its archived hero.
   RTL border alignment is preserved.
3. Ticker viewport is clamped to the same 1160px page max (48px gutters,
   34px on phones) with overflow clipped and faded edges. The two group
   copies have *identical flex widths* including the trailing inter-group
   gap. A 42-second `translate3d(-50%,0,0)` loop now ends on the exact
   start of the second identical group. Hover/focus pauses; on reduced
   motion or explicit motion-off the animation stops and the first group
   becomes horizontally scrollable. Terminal intentionally still hides
   the ticker.
4. `languages.js`: Targets `.ticker-group > span` (both visual groups)
   and localizes `.ticker-screenreader` from `data.ticker`.
5. `scripts/verify-layout-flow.mjs`: Dedicated source regression for all
   three exact strings, repeating ticker group equality, CSS structure,
   localization hooks and preview-only safeguards.
6. `.circleci/config.yml`: Added source QA and Playwright assertions
   for all six theme IDs at existing responsive widths, paragraph
   bounding boxes, clipping, equal group width, correct animation and
   Arabic translation of both copies.

## Verification
- **24/24 source/structural/contrast checks PASSED** on the actual remote
  branch readback after changes.
- Editorial measured contrast from explicit source colors:
  paragraph #3b4b41 on #fffbf5 **8.98:1**; ticker #33483e on
  #eee7dc **8.00:1**.
- **48/48 isolated Chromium fixture cases PASSED**, across six theme
  palettes and eight viewport widths (320, 390, 600, 820, 980, 1024,
  1440, 1833px). A reduced-motion check also passed (no animation,
  second duplicate hidden and viewport scrollable).
- **Do not conflate isolated fixture with deployed full-site validation.**
  The fixture used the relevant replicated markup and styles, not a
  byte-for-byte build of all actual portfolio CSS/JS. Source guards
  and the full-site CircleCI suite are committed, but no CircleCI run
  success or real Cloudflare-served browser inspection is established
  here. A read-only web request to the branch alias manifest was not
  accessible in this environment, which does not establish a deployment
  failure or success.

## Safety and rollback
No content rewording, personal address disclosure, ownership/session
behavior, production API access, GitHub main, DNS, Worker, D1, or secrets
were changed. The animated WebStudio footer and the earlier Foundation
and Editorial fixes are preserved. If needed, revert only the v1.7
preview HTML, added layout CSS, ticker translation hook, test contracts
and manifest; retain the earlier approved work.
