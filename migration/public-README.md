# Public website deployment artifacts

This repository remains **public** because the owner uses GitHub Free and
must keep the existing GitHub Pages address accessible without upgrading.

## Two independent live websites

| Website | Public URL | Files in this repository |
| --- | --- | --- |
| Personal portfolio | https://sudipdas.is-a.dev/ and https://sudip-das-frontend.pages.dev/ | Root `index.html`, `languages.js`, public portrait and `data/` |
| Fictional WebStudio | https://sudipdasin.github.io/sudip-das-frontend/ | Prebuilt website in `public-pages/` |

**These are separate websites.** The Cloudflare Pages hostname and custom
domain are two ways to access the personal site, and the GitHub Pages URL is
WebStudio's interactive fictional demo. Neither project should overwrite the
other.

## Release model

Development source, tests, generator, private services and future Pro code
are maintained in a **separate private source repository**. Approved
WebStudio output is built and tested there. A credential scoped solely to
this public repository allows the private release workflow to update only
`public-pages/` on the public `main` branch.

GitHub Pages' repository-side workflow **deploys** that prebuilt directory;
it does not rebuild from private source. Public frontend code (HTML, CSS,
JavaScript, image assets and any embedded data) is necessarily inspectable
by users of the website and must contain no private logic or credentials.

## Security boundaries

- Never commit backend code, API credentials, encryption keys, customer data,
  private release tokens, or proprietary Pro algorithms.
- The personal Cloudflare homepage at the root is a distinct deployment
  target and must not be changed by WebStudio releases.
- The private CI pipeline must reject deployment artifacts containing
  sensitive files before copying them here.
- Preserving a private source repository **does not retract previously
  published Git history, forks, cached files or downloaded code**.
- GitHub Pages remains publicly accessible; the source repository may be
  private, but compiled/distributed browser assets remain public.

## Recovery

The owner retains protected pre-migration backup branches on this public
repository and the original history is mirrored to the private source.
A deployment rollback should restore the last known-good `public-pages/`
artifact, not force-rewrite the public repository history.

## Release prerequisites

A new private-source build must pass unit tests, browser acceptance,
artifact inspection and manual or explicitly enabled automatic publishing.
Do not turn on the private publisher until the public deployment-only
cutover is complete and both URLs have been independently verified.
