# V2 Frontend Release Candidate — 0.2.0-rc.2

## Focus: restore essential public project data
- The public `index.html` fetches `data/site.json` to render projects, labels, section configuration and GitHub sync. The previous repository had neither this file nor the advertised `data/site.xml` alternative.
- Add publicly reviewed project summaries, drawn from the five named public repositories and their READMEs.
- Include both structured data endpoints as deployable public assets, with no private profile material.
- Add six manifest regression tests, asset-presence checks and parity between GitHub Actions and CircleCI.
- Preserve v0.2.0-rc.1 HTTPS readiness checks, security headers and custom 404.

## Verification before publication
- `node --check languages.js`
- `node --test tests/*.test.mjs`
- Ensure `data/site.json` contains public-only fields and `data/site.xml` resolves in the preview deployment.
- Inspect project cards and GitHub sync on desktop and mobile.
- Confirm runtime forms, custom domain TLS and API independently before any domain cutover.

## Scope and limitations
- This is a **public frontend source** candidate, not a private backend or standalone Web Studio release.
- No changes to `sudipdas.is-a.dev` DNS or the existing live site are included.
- Passing source tests alone does not establish a verified public deployment or complete end-to-end form functionality.
