# WebStudio Plugin Engine v3.31.0 — Modular Five-Engine Platform

Status: preview branch implementation; real-browser acceptance PENDING. GitHub Actions and CircleCI remain stopped per owner instruction. Production is unchanged.

## Architecture and portability

WebStudio now has a separate, opt-in plugin host and five independently installable modules. It works with plain HTML, JavaScript and CSS, without React/Vue, npm, a backend, an API key, or hosted CI.

The host provides: register/use, mount, update, unmount, setTheme, setLocale, setQuality, on, getStatus, getModule, getProfile and getModules. It validates plugin IDs, orders dependencies, rejects missing/cyclic dependencies, isolates module failures, prevents dependent modules from mounting after failure, serializes/coalesces updates, restores namespace attributes/styles after unmount, and cleans up resources in reverse order.

Install only trusted modules. The host does not sandbox untrusted third-party JavaScript.

## Files

- plugins/webstudio-plugin-engine-v331.js — core lifecycle and shared state
- plugins/webstudio-plugin-engine-v331.css — namespaced six-theme styles
- plugins/modules/theme-v331.js — theme controls and native adapter
- plugins/modules/hero-v331.js — responsive hero and geometry, native adapter
- plugins/modules/atmosphere-v331.js — CSS atmosphere fallback and native adapter
- plugins/modules/quick-menu-v331.js — section navigation and theme access, native adapter
- plugins/modules/portfolio-v331.js — search, filtering, sorting, restoration, native adapter
- plugins/webstudio-personal-bridge-v331.js — nonintrusive personal preview adapter
- plugins/webstudio-personal-bridge-v331.css — theme-aware plugin health display
- plugins/webstudio-plugin-manifest-v331.json — machine-readable plugin manifest
- editorial-github-layer-v331.css — specific Editorial GitHub disclosure vs marquee layering fix
- examples/webstudio-plugin-starter/index.html — separate generated-site playground
- examples/webstudio-plugin-starter/starter.js — independent mount/unmount and ten-language example
- scripts/verify-webstudio-plugins-v331.mjs — offline source and lifecycle verifier

## Installing on a generated website

Copy the host CSS, host JavaScript and whichever module JS files you need. Load in this order:

    <link rel="stylesheet" href="/plugins/webstudio-plugin-engine-v331.css">
    <script defer src="/plugins/webstudio-plugin-engine-v331.js"></script>
    <script defer src="/plugins/modules/theme-v331.js"></script>
    <script defer src="/plugins/modules/hero-v331.js"></script>
    <script defer src="/plugins/modules/atmosphere-v331.js"></script>
    <script defer src="/plugins/modules/quick-menu-v331.js"></script>
    <script defer src="/plugins/modules/portfolio-v331.js"></script>
    <script defer src="/my-integration.js"></script>

Example my-integration.js:

    (async () => {
    const root = document.getElementById('my-site');
    const host = WebStudioPluginEngine331.create({
      root, theme:'editorial', locale:'en', quality:'auto',
      slots:{
        hero:root.querySelector('[data-wsp-hero]'),
        tools:root.querySelector('[data-wsp-slot="tools"]'),
        portfolio:root.querySelector('[data-wsp-slot="portfolio"]')
      }
    });
    for(const id of ['theme','hero','atmosphere','quick-menu','portfolio'])
      host.register(WebStudioPlugins331[id]);
    await host.mount();
    host.setTheme('terminal');
    host.setLocale('bn');
    host.setQuality('eco');
    host.getModule('portfolio')?.filter('linux');
    host.getModule('hero')?.measure();
    window.myWebStudioHost = host;    // Retain for later actions.
    })().catch(console.error);

When the site owner wants to remove the modules later, invoke:

    await window.myWebStudioHost.unmount();   // From an async handler.

For partial integration, register only the desired modules. Each module is separately packaged and works without registering the other four.

The generated site can annotate sections with data-wsp-section, heroes with data-wsp-hero, project articles with data-wsp-project and category tags with data-wsp-category="linux", "ai" or "web". Use data-wsp-slot="tools" and data-wsp-slot="portfolio" to place controls.

The host only writes namespaced data-wsp-* attributes and --wsp-* custom properties to its root. Existing data-theme, content, identities and server settings are not replaced. For multiple installations use separate host roots; control IDs are host-specific.

## Personal site bridge

The personal preview loads the host and five modules after existing WebStudio engines, then mounts the explicit bridge adapter. In bridge mode, it reuses:

- Hero: window.__wsHeroDisplay327
- Atmosphere: window.__wsAtmosphere328
- Theme: #theme-select and existing theme controller
- Quick Menu: window.__wsQuickMenu330
- Portfolio: window.__wsPortfolio328

Existing approved layouts, portrait, GitHub disclosure, video playback and owner content remain with the native engines. No duplicate controls are injected. A localized Plugin engines health disclosure and a Plugin engine playground link appear in Quick Menu → Tools.

Use window.WebStudioSitePlugins331.getStatus() to inspect the active host. Use window.WebStudioSitePlugins331.getModule('portfolio') to access an adapter. The separate demo has no dependency on these global native engines.

## Scope, performance and safety

- Zero network calls and no telemetry in the host/modules
- No automatic module mounts merely from loading the scripts
- Existing site adapter is explicitly loaded and preview-only
- No private backend or owner editing integration
- DOM nodes use textContent; no untrusted HTML rendering
- Deterministic module lifecycle and error isolation
- Reversible, bounded project filtering and sorting
- CSS-only standalone atmosphere: Cinematic falls back to CSS; this is NOT GPU ray tracing
- Reduced-motion/forced-colors protections, visible focus and 44px controls
- Ten native translations: English, Hindi, Bengali, Spanish, French, German, Portuguese, Arabic, Simplified Chinese and Japanese
- Right-to-left support for Arabic
- Theme identities remain distinct across Orbit, Editorial, Terminal, Aurora Peak, Neon Studio and Cosmic

## Manual test targets

Personal site:
https://preview-personalweb.sudip-das-frontend.pages.dev/?v=3.31.0

Independent plugin demo:
https://preview-personalweb.sudip-das-frontend.pages.dev/examples/webstudio-plugin-starter/

1. On Editorial, open GitHub from the hero. Its disclosure must appear above the scrolling marquee, not behind it. Sticky header stays above the disclosure. Close and ensure normal layering resumes.
2. Switch all six themes; check footer, headings, portrait and video do not regress.
3. Open Quick Menu → Tools and verify the plugin host reports five mounted modules. Open the standalone playground.
4. On the playground, change language across all ten locales, theme and atmosphere; search, filter and sort projects, and use the Quick Menu.
5. Unload plugins and verify controls disappear, original project order/visibility returns and namespace attributes are restored; reload plugins and retest.
6. Check at 1906, 1440, 768 and 390 px; keyboard, touch, overflow, reduced motion, RTL and forced-colors.
7. Export existing WebStudio audits separately. Source/lifecycle simulation is not equivalent to real browser acceptance.
8. Keep production untouched and hosted CI off until explicitly authorized.

Manual QA remains PENDING. Cloudflare Pages deployment completion has not been independently confirmed by the source checks alone.
