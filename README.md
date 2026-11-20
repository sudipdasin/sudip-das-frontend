# Sudip Das — Public Portfolio Frontend

This public repository is the **authoritative frontend** for Profile Website Project V2.

The backend is developed separately in the **private** `sudipdasin/sudip-das-backend` repository. The earlier private `sudipdasin/sudip-das-profile` repository is retained as migration history until its Worker and encrypted-profile workflows have been safely transferred and independently verified.

## Files

- `index.html` — website page and styles
- `languages.js` — translations and multilingual content
- `sudip-das-portrait.jpg` — public portfolio portrait

## Deployment and portability

This is a plain static website. Deploy the same HTML, JavaScript, and public assets to Cloudflare Pages, GitHub Pages, Netlify, Vercel, or any compatible static host. The preferred domain is `sudipdas.is-a.dev`, **subject to actual DNS registration and TLS verification**. Do not assume the domain is active merely because it is named in configuration.

Before changing providers:

1. Create a preview deployment on the new host.
2. Check desktop and mobile layouts, language switching, project links, and contact form behavior.
3. Confirm the backend permits the new origin and the CAPTCHA provider allows the new hostname.
4. Verify HTTPS, API health, form delivery and response handling.
5. Change DNS only after the target is proven working; keep the old host available for rollback.

## Security boundary

Do not commit passwords, API tokens, private profile records, D1 database exports, OAuth secrets, encrypted-vault private keys, or restricted personal data here. Static deployment files are **publicly accessible**, even if a host interface labels them private. Backend application code and migrations remain in the private repository.

Changes must be validated through preview deployment before promotion. Production publication and DNS changes are intentionally separate operations.

## Fictional customer web preview

A separate fictional buyer demo resides in [`examples/customer-demo/`](examples/customer-demo/README.md). The GitHub Pages workflow publishes an allowlisted copy of that demo rather than the personal website. The live preview address should only be used after a successful `Publish fictional customer demo preview` Actions deployment.

Preview locally:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/examples/customer-demo/`.
