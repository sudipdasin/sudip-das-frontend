#!/usr/bin/env bash
# Stages an auditable public-deployment-only PR. Never merges it automatically.
# Prerequisites: WebStudio source already mirrored into private repo, a tested
# public-pages/ artifact committed by the PRIVATE publisher, clean public main.
set -Eeuo pipefail
PUBLIC="sudipdasin/sudip-das-frontend"
PRIVATE="sudipdasin/webstudio-private"
ROOT=$(cd -- "$(dirname -- "$0")/.." && pwd -P)
fail(){ printf 'ERROR: %s\n' "$*" >&2; exit 1; }

for exe in git gh node;do command -v "$exe" >/dev/null || fail "Missing $exe";done
gh auth status >/dev/null || fail "Authenticate GitHub CLI before cutover."
[[ $(git -C "$ROOT" rev-parse --show-toplevel) == "$ROOT" ]] || fail "Unexpected repository root."
[[ $(git -C "$ROOT" branch --show-current) == main ]] || fail "Check out public main before cutover."
git -C "$ROOT" diff --quiet && git -C "$ROOT" diff --cached --quiet ||
  fail "Local public repository has unsaved changes."
[[ $(gh repo view "$PUBLIC" --json visibility --jq '.visibility') == PUBLIC ]] ||
  fail "Public Pages repository must remain public on GitHub Free."
[[ $(gh repo view "$PRIVATE" --json visibility --jq '.visibility') == PRIVATE ]] ||
  fail "Private source repository does not exist or is not private."
gh api "repos/$PRIVATE/contents/.github/workflows/webstudio-release-to-public.yml" >/dev/null ||
  fail "Private artifact publisher is not configured."
git -C "$ROOT" ls-files --error-unmatch public-pages/index.html >/dev/null ||
  fail "Private publisher has not populated tracked public-pages/index.html."
for file in public-pages/app.js public-pages/profile.json \
  public-pages/webstudio-runtime-manifest.json index.html \
  languages.js sudip-das-portrait.jpg data/site.json data/site.xml;do
  [[ -s "$ROOT/$file" ]] || fail "Required deployment asset missing: $file"
done
node -e "let p=require('./public-pages/profile.json');if(p.demo!==true||p.identity.displayName!=='Dev Das')process.exit(1)" ||
  fail "Public preview identity did not pass verification."
[[ ! -L "$ROOT/public-pages" ]] || fail "Refusing symlinked public-pages directory."

TIMESTAMP=$(date -u +%Y%m%dT%H%M%SZ)
BACKUP="backup/before-deploy-only-cutover-$TIMESTAMP"
BRANCH="chore/webstudio-public-deployment-only-$TIMESTAMP"
git -C "$ROOT" branch "$BACKUP"
git -C "$ROOT" push origin "$BACKUP"
git -C "$ROOT" switch -c "$BRANCH"

# Copy both new workflows and a deployment-only README before deleting
# the migration kit from the public tree.
cp "$ROOT/migration/public-pages-deploy.yml" \
   "$ROOT/.github/workflows/customer-demo-pages.yml"
cp "$ROOT/migration/public-validate.yml" \
   "$ROOT/.github/workflows/validate.yml"
cp "$ROOT/migration/public-README.md" "$ROOT/README.md"

# Keep the personal Cloudflare homepage and all public runtime assets.
# Remove ONLY development source, release tooling and secret-capable services.
git -C "$ROOT" rm -r --ignore-unmatch -- \
  examples scripts tests browser-tests contracts services docs backups \
  .circleci migration RELEASE.md VERSION \
  .github/workflows/webstudio-demo-package.yml

for file in index.html languages.js sudip-das-portrait.jpg data/site.json \
  data/site.xml 404.html _headers favicon.svg; do
  test -s "$ROOT/$file" || fail "Protected Cloudflare site file was removed: $file"
  git -C "$ROOT" diff --quiet HEAD -- "$file" ||
    fail "Protected Cloudflare site file changed: $file"
done
test -s "$ROOT/public-pages/index.html" || fail "Public demo asset missing after split."

git -C "$ROOT" add -A
git -C "$ROOT" -c user.name="WebStudio migration" \
  -c user.email="webstudio-migration@users.noreply.github.com" \
  commit -m "refactor(public): keep deployable site files only; move development to private source"
git -C "$ROOT" push origin "$BRANCH"
gh pr create --repo "$PUBLIC" --base main --head "$BRANCH" \
  --title "Cut over to deployment-only GitHub Pages artifacts" \
  --body "Source mirror is private. This PR preserves personal Cloudflare root assets and public WebStudio browser files under public-pages/. GitHub Pages workflow changes to deploy prebuilt artifacts only; development scripts, tests, services and docs leave the current public tree. The old Git history remains public. Merge only after checking both website deployments and CI. Rollback: $BACKUP."

printf '\nCutover PR created, NOT merged. Review CI and both sites before merging.\n'
printf 'Rollback branch: %s\n' "$BACKUP"
printf 'The pre-existing public Git history cannot be made secret retroactively.\n'
