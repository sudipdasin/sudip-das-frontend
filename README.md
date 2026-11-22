# Sudip Das — Public Personal Portfolio Deployment

This public branch contains only approved static website assets, a non-secret CircleCI integrity configuration, and public release metadata. The development source of truth is the **private** `sudipdasin/sudip-das-profile` repository. Public browser CSS, HTML and JavaScript are necessarily visible to website visitors; never put proprietary server logic, vault records, authentication secrets or credentials in client assets.

- Real personal portfolio: `https://sudipdas.is-a.dev/` (Cloudflare Pages target: `sudip-das-frontend.pages.dev`)
- Independent fictional WebStudio demo: `gh-pages` branch of this repository
- CI provider: CircleCI; GitHub-managed Pages delivery is separate from application CI
- Rollback branch: `backup/pre-personal-static-private-source-cutover-20261122`

Deployment requires the Cloudflare Pages project to follow the **correct Git repository and `main` branch**, using the repository root as the output directory and no development build command. If it is instead connected to the private source repository, use `node scripts/build.mjs` with `dist/` output and authorized non-secret `TURNSTILE_SITE_KEY`/`PUBLIC_API_BASE` build variables; do not switch repository or DNS without reviewing the Cloudflare project configuration.

`site-release.json` is a public, non-secret release fingerprint. This branch deliberately does not contain developer tests, Workers source, LifeSphere modules, or private CI credentials.
