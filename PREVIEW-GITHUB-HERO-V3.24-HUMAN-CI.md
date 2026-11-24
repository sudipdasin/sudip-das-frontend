# Web Studio v3.24 — Hero GitHub Repository Explorer

**Testing branch:** `preview-personalweb` only. **Production:** `main` untouched.  
**Testing URL:** https://preview-personalweb.sudip-das-frontend.pages.dev/  
**Six-theme visual audit:** https://preview-personalweb.sudip-das-frontend.pages.dev/?theme-audit=1

## Delivered behavior

The static hero **GitHub profile** anchor is progressively enhanced after page load into one animated, theme-native GitHub button with an attached summary panel. Without JavaScript, the original direct GitHub link remains functional.

On hover with a mouse, keyboard focus, or tap/click, the card reveals public repositories. It includes a direct **Open GitHub** link, public-repo count when GitHub provides it, a sum of stars for the repositories downloaded, the most frequent language, up to four featured/recently active repository summaries, last-push dates, and links to each repository. A visitor can click to pin, click again to collapse, use Escape to dismiss and return focus, press ArrowDown to focus the panel link, or click outside to close.

No server is contacted simply because the page loaded. The browser makes at most **two unauthenticated public GitHub API GET requests** when the visitor opens the preview or requests a refresh: the public profile and the latest 100 owned repositories. A 10-minute session cache avoids repeated requests. The interface identifies live, cached and fallback results. The displayed star sum refers to loaded repositories, not necessarily all repositories on GitHub.

Data safety: no access token, sign-in, POST, private account endpoint, profile mutation or analytics. Results exclude private, forked and archived repositories, verify owner login, validate repository names, build GitHub URLs only from safe names and use text nodes for remotely supplied descriptions. When GitHub is unavailable, offline, or rate-limited, the card shows the public project summaries already present on this portfolio and leaves numeric metrics blank—no fabricated values.

## Visual contract

| Theme | GitHub hero appearance |
|---|---|
| Neon Studio | Cyan-on-indigo glass card with luminous hover edge |
| Orbit | Ocean teal orbital instrument with circular icon |
| Editorial | Serif ivory paper, thin copper rules, square framing |
| Terminal | Square green phosphor command-console panel |
| Aurora Peak | Forest green, lichen accent and arch-shaped icon |
| Cosmic | Violet nebula with rounded prism effect |

The panel is collision-positioned horizontally to stay within the viewport and can open upward if there is insufficient room below. It is scrollable without changing the original hero layout. All links remain independent of the button. Reduced-motion, high-contrast, Atmosphere Off and mobile touch behavior have explicit styling.

## Verification

Run from the repository root:

```sh
node scripts/verify-github-hero-v324.mjs
```

**Verified against GitHub preview source:** 38/38 JavaScript, CSS, public-data normalization, privacy, hover/keyboard, cache and simulated API failure checks, plus 10/10 release integration checks. These are local/mock checks and are **not** proof that Cloudflare has deployed this revision or that current public GitHub data is reachable from the browser.

## Human CI steps

1. Hard-refresh the preview. Confirm page-source fingerprint `preview-github-hero-explorer-v3.24.0`.
2. Hover the GitHub button with a mouse. Verify the button animates and the repository panel unfolds without shifting other hero cards, covering essential content or overflowing the viewport. Move between button and panel without it disappearing unexpectedly.
3. Verify public repository details (description, language, stars, updated date), the profile link, individual repo links, and the **Browse all** link open correctly. Check current values against public GitHub; do not mark any unavailable data as valid.
4. Click the button to pin and unpin. Use Tab, Shift+Tab, ArrowDown and Escape. Confirm keyboard focus and visible focus indicators.
5. Repeat at 320px, 390px, tablet and desktop. On touch devices, tap once to open and tap again or outside to close; verify panel scrolling and no horizontal overflow.
6. Repeat in all six themes. Verify native colors, typography, geometry and hover effects without cross-theme residue. Test with Atmosphere Off and OS reduced motion.
7. Simulate offline or blocked GitHub API in browser developer tools. The panel should still open with portfolio project summaries and no invented numeric repository statistics.
8. Open Human CI (**28 checks**) and report issues with a theme, device size, steps and screenshots. Export `webstudio-human-ci-v3.24.json` and `webstudio-preview-diagnostics-v3.24.json`. The opt-in six-theme audit exports `webstudio-theme-audit-v3.24.json`.

## Release boundaries

Changes are committed to **preview-personalweb**, not production `main`. GitHub API response time, rate limits, actual deployment, keyboard behavior in real browsers, responsive screenshots and low-powered mobile rendering require human/browser validation. No automatic publication to production and no claim of passing real-browser CI without evidence.
