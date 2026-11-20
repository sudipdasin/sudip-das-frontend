# V2 Frontend Release Candidate — 0.2.0-rc.5

## Fictional customer web preview

This release adds an independently packaged, automated GitHub Pages preview for the previously created `examples/customer-demo/` sample. The publication artifact contains exactly the demo HTML, JS, fictional JSON profile, `.nojekyll`, and `robots.txt`. It omits the real personal portfolio, portrait, private backend, credentials and source-only files.

## Tests and deployment
- `node --test tests/*.test.mjs`
- `node scripts/build-customer-demo.mjs` (output: `dist/customer-demo-preview/`)
- GitHub Actions workflow `.github/workflows/customer-demo-pages.yml` runs the demo tests and publishes its isolated artifact when `main` changes or on manual dispatch.
- Preview URL is the GitHub Pages project URL, normally `https://sudipdasin.github.io/sudip-das-frontend/`, **only after a successful Pages deployment**.
- If Pages is not enabled, set repository **Settings → Pages → Build and deployment → Source: GitHub Actions**.
- The preview is marked as fictional and noindex by default. This is a demo, not a commercial CMS release.

## Production safety
The portfolio website and `sudipdas.is-a.dev` DNS are not modified. No live private API or customer records are deployed. GitHub Pages deployment success must be independently observed before advertising the preview as live.

## Functional browser-preview acceptance criteria
The customer preview must pass a headless Chromium run that loads the static build, edits and saves text, adds and removes projects, edits social links, rejects unsafe URLs, downloads JSON, restores local changes after reload, imports a valid profile, and resets to the original fictional customer profile. No server-side emails, customer accounts, payments, or hosting-provider configuration are implied by this standalone static demo.

## Premium buyer-demo experience — v0.2.0-rc.6
The fictional portfolio now uses the design language of the existing personal site: typographic hero, circular animated identity, layered gradients, sticky navigation, project cards, marquee, section headings, animated reveals, responsive layout and reduced-motion support. The entire visual layer is independent, editable, and ships only in the isolated customer demo artifact. Existing locally saved customer edits continue working. The browser CI test must exercise the actual published layout assets before promotion.
