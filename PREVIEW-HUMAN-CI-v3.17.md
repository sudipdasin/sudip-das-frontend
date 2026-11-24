# WebStudio / Real Personal Portfolio — v3.17 Human CI Release

**Preview branch:** `preview-personalweb`  
**Testing URL:** https://preview-personalweb.sudip-das-frontend.pages.dev/  
**Opt-in theme audit:** https://preview-personalweb.sudip-das-frontend.pages.dev/?theme-audit=1  
**Production:** `main` remains unchanged by this release.  
**CI cost control:** CircleCI browser jobs are intentionally filtered out on this preview branch. Do not re-enable them without the owner's instruction.

## Delivered engineering

1. **Six-theme identity:** Preserve the v3.16 correction for Editorial paper-and-ink, Terminal console, Orbit teal, Aurora Peak landscape, Cosmic violet, and the approved Neon Studio baseline. The final v3.17 shortlist and review controls inherit the selected theme.
2. **Hiring-team project shortlist:** Choose up to three publicly documented projects; compare their existing descriptions and copy a short source-linked briefing. No login, storage, analytics or server requests.
3. **Human CI v3.17:** Twenty explicit manual checks, a structured defect ledger with theme and severity, reproduction steps, viewport, browser information, local notes and downloadable JSON. Older PASS results do not carry forward.
4. **Real-browser audit:** With `?theme-audit=1`, use **Run six-theme audit** to check computed palettes, text contrast, presentation geometry, horizontal overflow, orbit-badge counts and Editorial portrait-label overlap. Export a JSON report. The theme selection is restored after the run.
5. **Responsive review experience:** The shortlist and review panel have mobile-width layouts and theme-specific materials; physical mobile testing is **not yet verified**.

## Human acceptance protocol

- Hard-refresh the preview and confirm the release fingerprint `preview-six-theme-hiring-human-ci-v3.17.0` exists in the HTML page source.
- Visit **Editorial** at a desktop viewport approximately 1773×864. Verify that there is no cyan Neon video tile and the three role labels form a stable footnote row without overlapping the photograph.
- Test **Terminal**, **Orbit**, **Aurora Peak**, **Cosmic** and **Neon Studio** one at a time. Each should retain its own layout, color, font, card treatment and motion. Return to Neon Studio and verify its protected original composition.
- Open/close the introduction video. Verify English captions and the transcript in the video panel.
- Search projects, shortlist 1–3 projects, copy the briefing, clear the list and try a fourth selection at the three-project limit.
- Run the opt-in theme audit, then export its JSON. Audit PASS means only that a specific in-browser structural probe passed, **not** that the whole theme is visually correct.
- Test keyboard navigation, visible focus, reduced-motion preference and an actual phone at a narrow width. Do not mark an untested device as PASS.
- Open **Human CI** to mark the 20 manual checks. For defects, provide actual versus expected appearance, theme, severity, viewport and reproduction steps. Export `webstudio-human-ci-v3.17.json` and attach screenshots in your feedback.

## Verified and unverified claims

**Verified against GitHub preview sources before final manifest update:** 25/25 static invariants, including source references, preview environment restrictions, all six theme IDs and code parsing. A simulated DOM interaction harness exercised the shortlist selection cap, copy action and reset (10/10 checks). These are **not** substitutes for real Chromium, Firefox, WebKit or device-browser tests.

**Not independently verified:** Cloudflare's deployment status and deployed HTML, real screen captures, actual video caption rendering, mobile touch behavior, visual geometry in a production browser or CircleCI results. The preview branch excludes paid CircleCI jobs by existing owner directive.

## Security and promotion boundaries

- Preview must retain `X-Robots-Tag: noindex`, `X-Frame-Options: DENY`, the disabled private request API and the `PORTFOLIO_PREVIEW_MODE=true` guard.
- Human CI notes and defect records stay in local browser storage until manually copied or downloaded. Never include credentials, private customer records or authentication codes.
- Do not automatically merge or promote this preview into production without verified UI testing and explicit approval.
