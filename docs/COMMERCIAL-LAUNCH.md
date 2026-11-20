# Personal Profile Web Studio — Commercial Launch and Growth Plan

**Status:** Product exploration and prototype, not a functioning production checkout or paid hosted service.

## Product positioning
Sell a portable, beginner-friendly personal website studio that removes configuration friction. The most compelling activation event is **a visitor edits the fictional portfolio, chooses a layout, and exports their own profile within a single visit**. Do not claim the product is the most downloaded, reviewed, or rated until independent evidence exists.

## Current tested public-demo scope
- Free no-account fictional sample with editable identity, projects, links, colors, metadata, and offline JSON export/import.
- Three layouts, six-language navigation labels, project filtering, keyboard-friendly product tour, and fictional illustrative portrait.
- No production API, merchant account, private profile, payment processing, multi-tenant storage or customer-specific deployment.
- The site is a **demo**, not a sold subscription or licensed download.

## Immediate UX and QA targets
- At 390, 768, 1280 px: no horizontal overflow, visible portrait, coherent hierarchy, operable nav.
- At all three layouts: portrait and hero visible, theme differences clear, persistent settings, contrast verified, reduced-motion safe.
- Tour: optional and short, hands-on actions, Esc support, explicit skip, no forced signup.
- Local editor: persisted values, valid JSON import/export, URL validation, errors communicated visibly.
- Full automated browser checks on every relevant pull request and after deploy.
- Keep screenshots from each layout as CI artifacts for visual regression inspection.

## Monetization and security gates
1. Select hosting that permits commerce and use a separate customer-facing sales domain. GitHub Pages explicitly disallows primarily commercial/e-commerce or SaaS hosting. Keep GitHub Pages as a prototype/demo while moving commercial pages elsewhere.
2. Establish the seller entity, tax/legal notices, privacy policy, terms, refund policy, support contact, and entitlement/delivery rules.
3. Create a verified merchant account. For India-first hosted payments, consider Razorpay Payment Pages; for global software, evaluate Paddle as Merchant of Record (verify seller eligibility); Stripe Payment Links are an option depending on merchant eligibility.
4. Configure a real hosted checkout page with the merchant's *public payment URL*. Do **not** store API keys, webhook secrets, customer credit card details, or a private signing key in frontend assets.
5. Deploy the dedicated commercial origin; only then set `commerce.json` to a recognized provider and enable a merchant-created payment page. The demo's checkout stays disabled on `github.io` even if config is mistakenly enabled.
6. Use a **private backend** to verify signed payment webhooks, store an idempotent transaction record, confirm the purchased SKU, provision entitlement/license/download, and process refund/revoke events. Never unlock a paid download simply because a browser visits a success URL.
7. Test sandbox checkout, failed card, cancellation, webhook retry, duplicate webhook, refund, currency, and download delivery before a single live charge.
8. Stage and review return URLs/branding; then conduct a supervised low-value live smoke test where permitted and verify merchant payout settings. Do not advertise checkout until all gates pass.

## Marketing experiments (test hypotheses, not guaranteed outcomes)
| Funnel step | Experiment | Measurement |
| --- | --- | --- |
| Discovery | Search-targeted tutorials, template galleries, useful open-source samples, developer demos | Qualified unique visitors / source |
| First impression | Fast portrait hero with clear product CTA; mobile-first layout | Tour start and first-edit rate |
| Activation | Guided 5-step tour vs direct 'Try the editor'; no mandatory account | Profile edit + export completion |
| Retention | Portable profile JSON, trustworthy updates, reusable project templates | Repeat visits and saved imports |
| Trust | Public changelog, tested releases, honest limitations, accessible preview | Support resolution, crash rates |
| Purchase | Clearly differentiated real plans, hosted checkout with honest pricing/refunds | Verified paid conversion |
| Referral | Shareable *public* example templates, attribution optional, no dark patterns | New qualified visitors from referral |

## Release quality bars
- All CI and browser interaction checks pass on the exact candidate.
- Real production preview visually inspected, including portrait/hero in each theme.
- Lighthouse performance/accessibility/security targets set and measured before claims.
- Accessibility review follows WCAG 2.2 (keyboard, focus, reduced motion, readable contrast).
- No invented customer testimonials, fake reviews, countdown pressure, fabricated installs, unauthorized marketing messages, or undisclosed tracking.
- Security testing, licensing review, branding/trademark review, and reproducible build documentation.

## Research references
- GitHub Pages limitations: https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- Razorpay Payment Pages: https://razorpay.com/payment-pages/
- Paddle developer documentation: https://developer.paddle.com/
- Stripe Payment Links: https://stripe.com/payments/payment-links
- Paddle signed webhooks: https://developer.paddle.com/webhooks/about/signature-verification/
- W3C WCAG 2.2: https://www.w3.org/TR/WCAG22/
