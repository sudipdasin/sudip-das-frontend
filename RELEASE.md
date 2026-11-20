# V2 Frontend Release Candidate — 0.2.0-rc.1

## Scope
- Public source repository: `sudipdasin/sudip-das-frontend`.
- Private backend: `sudipdasin/sudip-das-backend` (separate release gate).
- Retains the existing public portfolio HTML, translations, and portrait.
- Includes a fail-closed site/domain readiness checker and regression tests.
- Adds provider-compatible baseline HTTP security headers and a branded 404 document.

## Verification
- `node --check languages.js`
- `node --check scripts/site-readiness.mjs`
- `node --test tests/*.test.mjs`
- Confirm expected static assets exist and that cloud deployment includes `_headers` and `404.html`.
- Test mobile presentation, translations, API and contact flows manually at the deployed preview URL.
- Check `sudipdas.is-a.dev` domain ownership, DNS, TLS and Cloudflare Pages attachment before cutover.

## Publication rules
Passing source checks permits promotion of **repository source**; it does not constitute a verified live website or API release.
Do not redirect `sudipdas.is-a.dev` away from its current URL record until the Pages host and custom domain association are verified.
Do not include secrets, private-profile vault content, backend source, or database exports in public artifacts.
Preserve the previous published site and the original is-a.dev registration record for rollback.
