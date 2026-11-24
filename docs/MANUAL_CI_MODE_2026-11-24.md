# Manual CI / Owner Verification Mode (2026-11-24)

**Current owner directive:** GitHub Actions and CircleCI have exceeded their available usage/credits and are stopped. Do not start, rerun, dispatch, schedule or depend on either service for this project's routine development, tests or releases. Do not change billing, purchase credits, or automatically switch CI providers.

## Operating contract

- GitHub remains source control; direct commits and existing Cloudflare Pages Git integration for the **preview** may continue independently of hosted CI jobs.
- Manual CI means the owner opens the live preview, tests interaction, reviews layout and submits observations/screenshots/audit logs. Developer may perform source inspection and locally executable checks, but those must be labeled with actual evidence.
- Every change should record the branch, commit SHA, preview URL, changed files, relevant static checks, and **manual QA status**: pending / passed by owner / failed by owner. Never infer a manual pass from a successful commit or a page loading.
- Tests that have not been executed are **NOT RUN**, not PASS. A source-only check cannot be called a browser or accessibility acceptance test.
- Production changes and public releases remain separate from preview updates and require review/approval as appropriate. Preserve backups and the approved Neon Studio styling.
- No automatic GitHub Actions or CircleCI validation/release jobs. CircleCI configuration retains definitions with parameters default OFF for later use; do not invoke manual override without a new explicit owner decision.
- The two quota-blocked providers may still show previously queued or skipped pipelines. Disable project-side automatic triggering in CircleCI/GitHub settings as an additional account-level safeguard when access permits. These repository commits do not claim to modify those remote account settings.

## Owner verification checklist

1. Check the deployed preview version/commit marker and refresh with a version query or hard reload.
2. Test all six themes: Orbit, Editorial, Terminal, Aurora Peak, Neon Studio, Cosmic.
3. Verify Editorial CTA layout and video overlay, Neon portrait/title dimensions, navigation, GitHub preview, introductions, footer and Atmosphere.
4. Inspect at desktop, tablet, mobile sizes; touch, keyboard, reduced motion, captions, overflow and text contrast.
5. Send screenshot / results for fixes; mark manual QA passed only after that feedback is reviewed.

**Status:** MANUAL_QA_PENDING until an actual owner test is recorded. Cloudflare deployment success, when verified separately, is not evidence of full functional correctness.
