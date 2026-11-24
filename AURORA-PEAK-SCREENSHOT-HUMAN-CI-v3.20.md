# Aurora Peak v3.20 — Screenshot-Driven Human CI

Testing URL: https://preview-personalweb.sudip-das-frontend.pages.dev/  
Theme: Aurora Peak  
Branch: `preview-personalweb` (production main remains untouched)  
Expected page-source marker: `preview-aurora-human-ci-polish-v3.20.0`

## Findings from the owner's screenshot

- The pale top-navigation **Let's connect** button had white text on a very light green background. The older Aurora `.navlinks a` theme rule overrode its intended dark text.
- The **Explore themes** button remained cyan/blue because the Theme Library ships its own hard-coded button gradient and the Aurora stylesheet did not target `.pv-theme-launch`.
- **People · Systems · Possibility** overlapped or crowded the portrait attribution along the bottom of the alpine illustration.
- The large **Review preview / passed / failed / pending** launcher was an old UI state. The committed v3.19 version uses `N/20` when collapsed; v3.20 makes the version visible as `Review v3.20` to distinguish it from stale assets.

## Changes

- New `aurora-peak-review-polish-v320.css` (last stylesheet) gives the nav action dark green text on lichen yellow, Alpine-specific Theme Library gradients, and controlled width/positioning of trail note and portrait caption.
- The new stylesheet is scoped to Aurora Peak; it does not directly replace the approved Neon Studio or Editorial design.
- The Human CI script has new-release storage, exports `webstudio-human-ci-v3.20.json`, retains old notes without inheriting old PASS results, and visibly identifies itself as v3.20.
- The opt-in six-theme audit now checks the actual computed contrast of the Aurora navigation CTA, theme-launch palette, and trail-note/caption rectangle intersection. This does not replace visual screenshot inspection.

## Verify in a real browser

1. Hard refresh the preview (Ctrl+Shift+R) or open a private window, select **Aurora Peak**, and verify the floating control says **Review v3.20**. If it still says **Review preview** with many words, the new deployment has not been served or the browser is using older assets.
2. Verify **Let's connect** has dark readable text, and **Explore themes** uses lichen/sage instead of cyan.
3. At the supplied desktop screenshot width (~1767 px), inspect the lower-left trail note and portrait caption to ensure a visible gap.
4. At widths 900px, 600px, 390px and 320px, verify text remains readable, the trail note hides on small phones, and no horizontal scrollbar appears.
5. Open `?theme-audit=1`, run the six-theme audit, and export the JSON to verify the targeted Aurora checks.
6. Confirm the other five themes, menus, video, projects and review exports remain operational. Capture screenshots when any issue persists.

## Evidence and boundaries

The changes can be source-verified on GitHub. The Cloudflare Pages preview was not reachable using available browsing tools, so this is **not yet a confirmed live rendering fix**. Real mobile/desktop viewing and Cloudflare deployment status require human CI. No credentials, private request handling or paid CircleCI filters were changed.
