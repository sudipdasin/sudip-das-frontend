# Personal website preview v3.7.1 — WhatsApp & Telegram

Scope: `sudipdasin/sudip-das-frontend`, branch `preview-personalweb`. Production main unchanged.

Adds two user-supplied instant messaging contacts across:
- Let's Connect → Instant Messaging
- Bottom-right Quick Hub → Connect / Messaging
- Footer social/contact links

WhatsApp: 10-digit user-supplied number `9007625506`, interpreted using published Kolkata, India locality as India calling code `+91`. Link: `https://wa.me/919007625506`. A manual copy-number action is available.
Telegram: exact submitted URL `https://t.me/sudipdasin`, displayed as `@sudipdasin`, with manual copy-username action.

The links open corresponding service pages; no automated chat delivery, account authentication, message sending or tracking. No tests run in GitHub Actions/CircleCI; source checks only. Cloudflare deployment must be checked separately.
