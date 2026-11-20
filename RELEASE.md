# V2 Frontend Release Candidate — 0.2.0-rc.4

## Separately packaged fictional customer demo

A separate `examples/customer-demo/` application introduces a fictional buyer profile independent of the developer's personal website. This is a product prototype, not an authenticated CMS or complete commercial release.

- JSON-based fictional customer data: profile identity, about, skills, projects, example links, contact labels, appearance, SEO placeholders.
- Responsive sample website and local-only customization wizard (preview, export JSON, reset).
- No active contact endpoint, private backend, Cloudflare credentials or personal portrait.
- Accessibility-minded semantic markup and default `noindex,nofollow` for the demo.
- Nine regression checks for fixture isolation, sample data, restricted example links and safe rendering.
- Existing public site, domain and Worker unaffected.

## Verification gates
GitHub and CircleCI should run `node --test tests/*.test.mjs` and `node --check examples/customer-demo/app.js`. Browser interactions and independent hosting preview must still be tested before making an end-user commercial release.

## Deployment
`python3 -m http.server 8000` at repository root, then open `http://localhost:8000/examples/customer-demo/`.
