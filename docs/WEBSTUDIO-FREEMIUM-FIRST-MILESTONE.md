# WebStudio Free — Interactive export and verified feedback gate

## Free themes and parity
Orbit, Editorial and Terminal are the **first three exportable Free themes**.
Aurora Peak, Neon Studio and Cosmic are Pro preview designs only.

The live preview iframe loads the **same isolated WebStudio application** as
the setup demo. Saving profile changes refreshes the preview and clears approval.
Changing the selected theme also clears approval. Only the selected, approved
profile/theme may proceed to feedback.

The interactive ZIP is assembled from the exact generated
`webstudio-runtime-manifest.json` emitted by
`scripts/build-customer-demo.mjs`; it includes the working JS/CSS/SVG/HTML
runtime files, substitutes the validated edited `profile.json`, and inserts
`webstudio-free-runtime.js` to set the Free theme policy. It is **not** the
older minimal static website template. All application logic still runs in the
visitor's browser, not on a backend. Manual HTTP(S) hosting is required.
Browser-local edits do not automatically modify hosted files.

## Mandatory feedback workflow

1. Complete the five-chapter introductory tour.
2. Edit and save required personal profile fields.
3. Select Orbit, Editorial or Terminal.
4. Inspect the actual interactive preview and explicitly approve the exact
   saved profile/theme.
5. Enter 60–1800 characters of detailed feedback, optionally a reply email.
6. Complete Turnstile and submit to the configured feedback receiver.
7. **Only** after the server verifies Turnstile and the email provider accepts
   the feedback does it return an opaque `{accepted:true,receiptId:"..."}`.
8. The browser then unlocks interactive ZIP generation for that approved
   profile/theme. Any later profile/theme change revokes its approval.

No `mailto:` action or client-side declaration counts as verified submission.
The exported website ZIP contains no feedback submission token, email delivery
API key, CAPTCHA secret, or backend credentials.

## Required deployment configuration

The public runtime's
`examples/customer-demo/webstudio-editions.json` has two initially blank
fields: `feedback.endpoint` and `feedback.challengeSiteKey`. Until they
are configured, **preview and approval work but ZIP export is intentionally
locked**. Do not advertise a live feedback-enabled release before delivery
checks pass.

Deploy `services/webstudio-feedback/worker.mjs` as a separate Cloudflare
Worker, with protected runtime secrets and variables:

- `ALLOWED_ORIGIN`: the actual demo origin used for previews
  (for GitHub Pages, `https://sudipdasin.github.io`).
- `TURNSTILE_SECRET_KEY`: Cloudflare Turnstile server secret
- `RESEND_API_KEY`: private email provider API key
- `FEEDBACK_FROM`: verified sending address for the email provider
- `FEEDBACK_TO`: developer's private receiving address

From `services/webstudio-feedback/`, with your Cloudflare account already authenticated:
```bash
npx wrangler secret put TURNSTILE_SECRET_KEY
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put FEEDBACK_FROM
npx wrangler secret put FEEDBACK_TO
npx wrangler deploy
```
Each command securely prompts for a secret. Do not paste values into shell
arguments, GitHub files, logs, or browser JavaScript. Verify your sending
domain with the email provider. The checked-in `wrangler.toml` sets the
allowed GitHub Pages origin; do not use the private personal-site API.
Set the *public* Turnstile site key and feedback Worker HTTPS endpoint in
the edition manifest only after successful server and browser testing. Never
put Turnstile secret or email API key into a public manifest.

The Worker accepts POST with strict origin, theme and size validation. It
verifies the Turnstile challenge and hostname, then calls the mail provider.
It returns an accepted receipt only after the provider confirms acceptance.
Provider acceptance is not a guarantee of final inbox placement. Maintain
provider abuse controls and rate limiting before production launch.

## Source and security limits

The exported UI is interactive but remains a publicly readable
HTML/CSS/JavaScript frontend. A browser must download its source, so the
client-side components cannot be made uncopyable by encryption. Free/Pro
entitlements need protected server-side enforcement for any genuinely secret
or billable features. No live paid checkout or hosting automation is included.

The fictional demo and personal portfolio root remain separate; WebStudio
does not automatically copy fictional data to the personal site.

## Verification

```bash
node --test tests/webstudio-freemium.test.mjs tests/webstudio-dynamic-export.test.mjs tests/webstudio-feedback-worker.test.mjs
node --test tests/customer-demo-build.test.mjs
node scripts/build-customer-demo.mjs
node scripts/verify-customer-demo.mjs
node browser-tests/customer-demo.mjs
```

Full interactive export is only **production-ready after** the feedback
Worker, CAPTCHA, provider, and end-to-end receipt/delivery test are live.
