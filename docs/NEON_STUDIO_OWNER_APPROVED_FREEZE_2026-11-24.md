# OWNER-APPROVED NEON STUDIO DESIGN LOCK — 24 NOV 2026

## Approval and recovery
The owner approved the existing Personal Neon Studio preview appearance in v3.9.1 and explicitly requested a lock and backup. Protected visual baseline commit:

`d8f97f3b7219007ca55f4793e3c9ec4bb03f4d7e`

Verified GitHub backup branch:
`backup/neon-studio-approved-v3.9.1-2026-11-24`

Original immutable Cloudflare deployment:
`https://0584e181.sudip-das-frontend.pages.dev`

This backup contains the **entire frontend preview tree**, including the approved theme, contact panel, media, translations and WebStudio preview integrations. Never force-push or delete it.

## Preview default (v3.9.2)
Neon Studio is now the initial HTML `data-theme` and selected theme option. Startup overrides stale `localStorage` values to show Neon Studio each time the preview loads. The other five themes stay available as temporary in-page comparisons; only Neon is the owner-approved launch presentation. Do not change the approved theme's existing visual CSS, Javascript geometry, portrait or media assets in this locking commit.

## Future development rules
- **Immutable approval:** do not alter the approved Neon Studio appearance unless the owner explicitly asks. The baseline Git blob SHA-1 hashes in `theme-visual-contract.json` record 5 core visual assets.
- **Guard:** `node scripts/check-approved-neon-studio.mjs` checks these hashes and preview startup/safety invariants. This is not server-side branch protection or a rendered screenshot test.
- **Owner approval before merge:** preserve all working themes, identity, portrait, motion, video, Quick Hub, connect links, private request safety and accessibility. Review visual effects of shared CSS and JS too; hashing the 5 assets does not guarantee pixel-identical rendering.
- **Rollback:** reset/copy from the verified backup SHA above; preferably restore through a tested forward commit rather than rewriting shared branches.

## Production migration NOT performed
Production `main` was verified to be 308 commits behind the approved preview. `gh-pages` serves a DIFFERENT WebStudio demo and must not be merged as the personal portfolio. Preview deliberately has `noindex` headers and `PORTFOLIO_PREVIEW_MODE=true` with `PUBLIC_API_BASE=""` to disable sensitive request forms. Production requires an explicit staging release that retains real correct domains, indexing, Cloudflare access/Turnstile, owner-reviewed Worker request protections, and production CSP/headers. This user turn only asked whether full transfer was possible, NOT to publish production.

## Rollout acceptance criteria
- Compare reference visual snapshot and candidate at desktop/tablet/mobile, including color, portrait fidelity, orbit geometry, typography, and motion/reduced-motion.
- Verify JS/CSS syntax and cross-theme behavior, all menus, tabs, video hover & expanded player, email and social links, screen-reader/keyboard navigation.
- Separate security/privacy review for `PUBLIC_API_BASE`, Worker API, Turnstile, CORS, rate-limits and request consent. Never expose secrets in public files.
- Back up current production, stage a distinct production-ready branch, run realistic functional tests, confirm domain routing, deploy with rollback.
- Zero defects cannot honestly be guaranteed; explain the actual evidence and residual risk.

No Github Actions or CircleCI workflows triggered by this freeze commit; owner has requested avoiding CI-credit consumption.
