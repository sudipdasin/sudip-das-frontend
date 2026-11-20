# Fictional Customer Profile Demo

**This demo is entirely separate from the real personal website.** It illustrates how an eventual buyer can create a unique portfolio using Personal Profile Web Studio.

- Demo identity: **Avery Example** (fictional)
- Demo location: **Example City (fictional)**
- Email: `demo@example.com` (reserved example address; not monitored)
- Portfolio project URLs: `example.com` (reserved illustrative addresses)
- Social URLs: illustrative only

## Preview locally

From repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/examples/customer-demo/`.

Select **Customize demo** to edit identity, role, tagline, location, skills and color. Choose **Preview changes** to update the visible page. **Export profile JSON** creates a local JSON download; **Reset demo** restores the original sample. No information is sent to a commercial API, database, email service or real account.

The profile is intentionally a minimal stand-alone example; it is **not yet** a complete authenticated CMS, production setup wizard, or integrated deployment solution.

## Independent profiles and future commercial packaging

The `profile.json` file is the portable unit of customer profile data. A buyer should duplicate the example into their **own** storage/account rather than modify the developer's live portfolio. Keep user-specific data out of application source, isolate all backend/database resources by customer, and replace sample emails/links with verified real destinations.

This static demo should be deployed to a separate preview path/host. Do not use the developer's real portrait, domain, forms, production API or credentials. Review licensing and all third-party dependencies separately before commercial distribution.

## Source validation

Run `node --check examples/customer-demo/app.js` and `node --test tests/customer-demo.test.mjs`. These cover fixture structure, public-only data, link safety, and basic HTML/JS contract checks. They do not replace browser tests or a production security review.

## Online web preview (GitHub Pages)

After GitHub Pages is enabled for this repository and the `Publish fictional customer demo preview` workflow succeeds, the standalone demo is served at the Pages project URL (typically `https://sudipdasin.github.io/sudip-das-frontend/`).

The Pages build uses `scripts/build-customer-demo.mjs`, an explicit allowlist that exports **only** this fictional demo and disallows publishing the author's actual portfolio or API.

If a deployment reports that GitHub Pages has not been enabled, visit **Settings → Pages → Build and deployment**, select **GitHub Actions** as the source, then rerun the workflow. Until deployment succeeds, the address should not be presented as a live preview.

## Fully functional standalone editor
The online preview includes edit-and-save for customer identity, about, skills, background and accent colors, contact display, SEO metadata, projects and social links. It also supports adding/removing projects and links, JSON profile import/export, persistence across reloads in the same browser and reset to the original fictional profile. Inputs are constrained and text rendered safely.

**Production boundaries:** These features work entirely in the browser. A real multi-user backend, authentication, hosted custom domains, storage synchronization, payment flows, email delivery and an installer are separate product milestones, not simulated as working services.

The preview workflow runs real Chromium interaction tests as a publishing gate; a successful GitHub Actions build alone must not be confused with a verified Pages deployment.

## Portfolio-inspired buyer features (v0.2.0-rc.7)
This edition adapts the personal portfolio's visual patterns without duplicating its identity: three switchable layout modes (Orbit, Editorial, Terminal), six-language navigation, mobile menu, scroll progress, interactive hero illustration, project search/category filters, case-study panels, fictional experience timeline, strengths cards and an offline project-inquiry brief generator.

Everything still runs in a standalone static preview. The new SVG is an original illustration of a **fictional** developer, not a portrait of the software author. The language selector localizes navigation and section labels only; customer-written content remains as entered. Live GitHub status and secure private-profile/email workflows are deliberately not imported because those need independently configured customer accounts and backend permissions.

## Interactive product tour and commercial preview (v0.2.0-rc.8)
The fictional starter is **Nico Vale**, not a real person. A five-step opt-in guided tour introduces the portfolio, layout selector, editor, projects and plans. Layout styles are materially different and the fictional portrait remains visible in all three modes. Use **Try the editor**, **Take the tour** or **Explore plans**; the tour can be skipped and has a keyboard Escape exit.

**No active payment gateway:** The plan panel explains that checkout is unavailable. `commerce.json` is a disabled merchant-hosted payment-link configuration. `commerce.js` validates trusted external URL formats and refuses to activate on GitHub Pages, which is not a permitted primary host for an e-commerce/SaaS business. A private backend, verified account, signed webhooks, and real fulfillment must be connected before accepting payment. This public demo will never process card data.

Commercial launch planning: `../../docs/COMMERCIAL-LAUNCH.md`.
