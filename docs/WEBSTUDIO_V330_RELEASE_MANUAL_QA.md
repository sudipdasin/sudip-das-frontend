# WebStudio v3.30.0 — Six-Theme, Five-Engine Experience Release

**Release target:** `preview-personalweb` / `https://preview-personalweb.sudip-das-frontend.pages.dev/?v=3.30.0`

**Verification:** New source checks and a simulated DOM interaction pass have been executed. Browser QA and Cloudflare deployment confirmation are **PENDING**. GitHub Actions/CircleCI remain default-disabled due to the owner's usage limits. Nothing here authorizes production promotion.

## Substantial improvements

| Engine | v3.30.0 change | Preserved behavior |
|---|---|---|
| **Hero Display Layout** | New `measure()` exposes actual title/portrait dimensions, single-stage count, mode and horizontal overflow for manual browser diagnostics | Approved Neon portrait, headline, video/GitHub action hierarchy |
| **Atmosphere** | New renderer state reports sitewide region coverage, active canvas, target frame budget, capabilities and safe `refresh()`; existing Auto/Cinematic/Balanced/Eco/Off safeguards remain | No remote rendering, respects reduced motion, data saver, and fallbacks |
| **Theme Engine** | New `getHealth()` reports five-engine readiness and selected theme synchronization | All six native compositions, no theme replacement |
| **Quick Menu** | New public `openTab(id)`, `close()` and `getStatus()` APIs, plus translated command palette with `Alt+Shift+P` shortcut | Four tabs and owner-safe visitor controls |
| **Portfolio** | Avoids full card reorder on every search character; validated `setFocus`, `setSort`, `search` APIs; translated category chips and live count | Public approved data only; read-only project links |
| **Integrated UX** | New modal command search (17 commands: 6 sections, 6 themes, 5 engine actions), focus trap/return, RTL, theme-native panels and distinctive project card shapes | No private API, no background auditing, no new tracking |

## Theme identity — six distinct design grammars

| Theme | Primary accent | Surface | Typography / shape / motion |
|---|---|---|---|
| Orbit | `#75efdb` | `#092938` | Rounded orbital controls and soft glass surfaces |
| Editorial | `#805337` | `#fffaf2` | Serif, warm paper, copper borders, static |
| Terminal | `#73ffa9` | `#081d16` | Square, monospaced phosphor and dashed geometry |
| Aurora Peak | `#dce8ad` | `#1c3c32` | Alpine arch and field-note surfaces |
| Neon Studio | `#61f5e4` | `#0d273a` | Electric glass, compact luminance accents; approved portrait unchanged |
| Cosmic | `#d2c0ff` | `#1a1a42` | Angular constellations and prism-like cards |

Static computed contrast against new shared surfaces (foreground / accent):
Orbit 14.65:1 / 10.91:1; Editorial 13.42:1 / 6.29:1; Terminal 16.46:1 / 13.87:1; Aurora 11.05:1 / 9.29:1; Neon 14.50:1 / 11.47:1; Cosmic 14.94:1 / 10.02:1. These are design-token calculations, **not a measured WCAG audit of every rendered element**.

## Localization coverage

The new `webstudio-experience-v330.js` contains **42 explicit strings in each of 10 locales**: English, Hindi, Bengali, Spanish, French, German, Portuguese, Arabic, Simplified Chinese, Japanese. Included: launcher, search and empty states, categories, section navigation, engine commands, keyboard instructions, status labels, active selection and accessibility labels. Proper theme names stay unchanged. Arabic command dialog uses `dir=rtl`. The older v3.29 five-engine layer retains its separate 34-key translations per locale, six descriptions and five atmosphere quality options.

## Verification executed without hosted CI

- New JS and modified five engine JS files parsed successfully.
- All ten translation dictionaries have 42 nonempty entries; all six theme style selectors are present.
- Controlled DOM simulation exercised 23 interactions/state assertions (ten locales, six themes, command modal, filtering, navigation, focus).
- Source-inventory and manual CI guard checks performed using GitHub connector.
- Palette foreground contrast was calculated on the six proposed base surfaces.
- No real Chromium screenshots, video/caption verification, touch tests or end-to-end accessibility tests were run in this task.
- Do not treat source checks, simulated DOM, or GitHub commits as proof that Cloudflare deployed or that all UI features work in a real browser.

## Owner manual acceptance checklist

1. Open the preview URL; confirm `meta[name="portfolio-visual-build"]` is `preview-five-engine-experience-v3.30.0`.
2. Check six themes at **1906×927, 1440×900, 768×1024 and 390×844**. Inspect layouts, hero, CTA four-card grid, portrait/name overlap, scroll and horizontal overflow.
3. Open **Quick Menu → Tools → Open command palette**, or use **Alt+Shift+P**. Search for sections, engines and themes; use Arrow Up/Down, Enter and Escape. Verify focus returns to the visible launcher and keyboard controls function.
4. Under Projects, use new category chips (All, Linux & desktop, AI & media, Web & apps); check counts, existing filters, sorting, empty-result recovery, links and shortlist.
5. Switch among English, Hindi, Bengali, Spanish, French, German, Portuguese, Arabic, Simplified Chinese and Japanese. Verify all new controls, statuses and accessibility labels in each.
6. Change Atmosphere modes and scroll through all eight sections; confirm sitewide renderer and safe fallbacks, including reduced motion and data-saver.
7. Verify intro video, GitHub disclosure, header/footer, portrait caption, theme library and mobile Quick Menu are still operable.
8. Open `?theme-audit=1` to run the preexisting 187-probe theme audit; separately use the manual five-engine diagnostic from v3.29 for its 54 scoped probes. Send both reports with screenshots. Never merge the counts.
9. Mark `MANUAL_QA_PASSED` only after review. Until then keep `manualQAStatus: pending`, `hostedCI: NOT_RUN`, production unchanged.

**Rollback:** The v3.30 script and stylesheet are additive; remove the two HTML includes and restore older engine script query parameters to isolate this release. Preserve earlier backups and don't modify approved Neon source.
