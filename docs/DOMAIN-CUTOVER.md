# Domain Cutover Runbook — sudipdas.is-a.dev

The is-a.dev registration PR [#62076](https://github.com/is-a-dev/register/pull/62076) merged on 2026-11-20. Its `domains/sudipdas.json` initially used a URL redirect to `https://github.com/sudipdasin`.

## Ownership
- Public website source: `sudipdasin/sudip-das-frontend` (this repository).
- Private Worker source: `sudipdasin/sudip-das-backend` (migration underway).
- Old site fallback: `https://sudip-das-portfolio.grittyonyx10.chatgpt.site`.
- Proposed Pages hostname: `https://sudip-das-frontend.pages.dev` (must be verified, not assumed active).
- Domain: `sudipdas.is-a.dev` (registered; deployment not inferred from registration).

## Safe one-time cutover
1. Set up Cloudflare Pages for this *public* repository and ensure its `pages.dev` origin serves the expected portfolio, translations, portrait, and contact UI.
2. Use the official is-a.dev [Cloudflare Pages guide](https://docs.is-a.dev/guides/cloudflare-pages/) to **attach the custom domain via Cloudflare's API** (is-a.dev's Public Suffix List status affects ordinary dashboard attachment).
3. Verify domain ownership, certificate provisioning, and the Pages domain state in Cloudflare before changing the is-a.dev redirect.
4. On is-a-dev/register, submit a follow-up PR replacing `records.URL` with `records.CNAME: sudip-das-frontend.pages.dev` in `domains/sudipdas.json`. Never include both URL and CNAME for the same label.
5. After merge, run `node scripts/site-readiness.mjs`. This is a **read-only** DNS/HTTP probe that exits nonzero on failure. It cannot validate the Cloudflare attachment itself.
6. Check `https://sudipdas.is-a.dev` directly for valid TLS, correct content, translation and theme controls, accessibility and mobile layout.
7. Verify API health, CORS allow/deny, Turnstile hostnames, private-profile request, email delivery, and vault access using test data. Update backend allowlists before production forms go live.
8. Keep the existing origin available as fallback and retain a copy of the previous is-a.dev JSON. For rollback, restore the previous redirect through a new is-a-dev registration PR; DNS rollback is subject to upstream review and propagation.

## Safety boundaries
This guide does **not** authorize live DNS modifications, publishing secrets, automatic deployment, or deleting the old site. Avoid deploying the private Worker or D1 content to the public repository. Do not interpret passing local tests as proof of live readiness.
