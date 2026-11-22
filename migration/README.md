# WebStudio — GitHub Free private source / public deployment migration

## Goal and current state

The existing public repository `sudipdasin/sudip-das-frontend` has **two
different published sites**:

- Real personal portfolio (Cloudflare Pages): `sudip-das-frontend.pages.dev`
  and its custom-domain alias `sudipdas.is-a.dev`. Its *public* HTML and
  assets live in the repository root.
- Fictional WebStudio (GitHub Pages):
  `https://sudipdasin.github.io/sudip-das-frontend/`. The current workflow
  builds `examples/customer-demo/` with tests, then deploys it.

GitHub Free cannot reliably continue that GitHub Pages project if the
source repository itself is made private. The public repository must remain
public. Instead, **move the development repository to a separate private
location and leave only deployable client assets publicly accessible.**

**Do not make `sudip-das-frontend` private, delete it, change DNS or force
rewrite its history.** Previous public commits, forks and copies cannot be
made retroactively secret.

## Already completed safeguards

The public `main` version at the start of the migration is preserved on
branch `backup/pre-private-source-split-20261122` at commit
`601806de9fd885513facdec3aa0efb62a4d3b58c`.

The scripts and workflows in this directory are **staged migration tools**.
They are NOT activated by simply merging them: the existing GitHub Pages and
Cloudflare production deployments remain unchanged.

## Phase 1 — One-time private source initialization

**Requires a GitHub CLI login by the repository owner**, since the current
ChatGPT GitHub connector cannot create repositories or change visibility.
The script creates the new repository itself; you do not need to pre-create it.

From a *clean local checkout* of the public `main` branch:

```bash
gh auth login
git clone https://github.com/sudipdasin/sudip-das-frontend.git
cd sudip-das-frontend
bash migration/bootstrap-private-source.sh
```

This verifies that the existing host remains public, creates
`sudipdasin/webstudio-private` as **private**, verifies its visibility,
mirrors the complete Git branch/tag history to it without force pushing,
and installs a private-only GitHub Actions pipeline.

If the proposed private repository already exists and is nonempty, the
script stops instead of overwriting it. The existing separate personal
portfolio/history repository `sudip-das-profile` is never touched.

## Phase 2 — Add strictly scoped publishing authorization

Create a **fine-grained GitHub personal access token**, restricted to the
public repository `sudipdasin/sudip-das-frontend`, with only repository
**Contents: Read and write** (and any minimally required actions GitHub
reports during setup). Save it in the new private repo under the GitHub Actions
secret `PUBLIC_DEPLOY_TOKEN`.

Do not paste the token into a workflow, source file, issue, chat, command-line
argument or public logs. You can enter the secret interactively:

```bash
gh secret set PUBLIC_DEPLOY_TOKEN -R sudipdasin/webstudio-private
```

The secret is stored encrypted by GitHub. Do not create it in the public
repository. Treat anyone allowed to edit private workflows as able to use
the token's granted public-repo permissions.

The private publisher's first release is manual-only. In
`sudipdasin/webstudio-private` -> Actions -> **Verify and publish WebStudio
artifact**, select **Run workflow** and approve `publish=true`.

That workflow runs the **real unit and Chromium browser suites**, builds
the allowlisted fictional website, verifies no private source/secrets are
in the artifact, and writes **only** `public-pages/` in the public repository.
It cannot modify the personal homepage at the repo root. At this stage the
old GitHub Pages workflow is still live, so this is a non-disruptive staging
publication.

## Phase 3 — Switch the public site to deployment-only mode

After Phase 2 produced a public `public-pages/index.html`, in a newly
updated clean local checkout of the **public main** branch, run:

```bash
git pull --ff-only
bash migration/stage-public-cutover.sh
```

This performs these actions **in a new pull request**, not by force-pushing
production:

1. Creates and pushes a pre-cutover rollback branch.
2. Replaces the existing GitHub Pages workflow with the prebuilt-artifact-only
   deployment workflow at `.github/workflows/customer-demo-pages.yml`.
3. Replaces the public CI with limited dual-site deployment integrity checks.
4. Removes development source, tests, generators, private-service code,
   backups and internal documentation from the current **public branch tree**.
5. Keeps the exact root personal portfolio files, public WebStudio `public-pages/`
   content, existing repository name and deployment environment.
6. Opens a reviewable PR for all the changes.

**Inspect PR CI and both target builds before merging.** After the PR is
merged, GitHub Pages continues at the same URL, now deploying
`public-pages/` directly. Cloudflare keeps using the unchanged portfolio
root. No DNS cutover is required.

## Phase 4 — Enable future automatic live releases

Only after the staged cutover is published and both websites verified,
enable the private repository's release variable:

```bash
gh variable set WEBSTUDIO_AUTO_PUBLISH -R sudipdasin/webstudio-private --body true
```

A merge/push into private `main` then runs tests and builds a distributable
WebStudio bundle before updating `public-pages/` in the public repository.
That new public commit triggers the existing GitHub Pages deployment-only
workflow. Failed private tests block publishing.

The public repository remains public for GitHub Free. The private source and
future Pro modules stay in the private repository; only intentionally
distributed client assets may appear in public Pages content.

## Critical limitations

- The current source and its historical commits were already **public**.
  Deleting them from the newest branch does not erase previously accessible
  copies or forks and may not erase all previous GitHub history.
- JavaScript, HTML, CSS, public JSON and images served by a browser are
  inherently accessible to users. Keep proprietary Pro algorithms,
  credential material, payment entitlements and private customer records in
  an access-controlled backend.
- Archive encryption protects downloads **at rest**, not browser-executable
  code after site deployment.
- The separate feedback Worker remains unconfigured until real CAPTCHA
  and email provider secrets are provisioned; do not claim it is live.
- The public repository's Cloudflare integration may have other settings
  outside Git; verify its next deployment succeeds before removing any
  unexpected root-level build dependency.

## Rollback

The original public main snapshot and the pre-cutover branch are preserved.
To recover the GitHub Pages website without rewriting history, restore the
last known-good deployment workflow and its artifact source on a reviewed
branch. Do not force-push the public repository or reset its history solely
to hide source. Restore files through a normal PR and verify the personal
Cloudflare site remains unchanged.
