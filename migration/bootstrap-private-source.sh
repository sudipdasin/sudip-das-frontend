#!/usr/bin/env bash
# One-time migration: mirror existing PUBLIC source history into a NEW PRIVATE
# repository. It does not change visibility or delete the public repository.
# Requires local GitHub CLI authentication with permission to create repos.
set -Eeuo pipefail

PUBLIC="sudipdasin/sudip-das-frontend"
PRIVATE="sudipdasin/webstudio-private"
ROOT=$(cd -- "$(dirname -- "$0")/.." && pwd -P)

fail() { printf 'ERROR: %s\n' "$*" >&2; exit 1; }
for executable in git gh mktemp cmp; do
  command -v "$executable" >/dev/null || fail "Missing command: $executable"
done
git -C "$ROOT" rev-parse --is-inside-work-tree >/dev/null ||
  fail "Run from a checked-out copy of the public repository."
WORKTOP=$(git -C "$ROOT" rev-parse --show-toplevel)
[[ "$WORKTOP" == "$ROOT" ]] || fail "Run the script from the repository root checkout."
git -C "$ROOT" diff --quiet && git -C "$ROOT" diff --cached --quiet ||
  fail "Commit or stash your local changes before migration."

gh auth status >/dev/null || fail "Authenticate with: gh auth login"
VISIBLE=$(gh repo view "$PUBLIC" --json visibility --jq '.visibility')
[[ "$VISIBLE" == PUBLIC ]] || fail "Public hosting repository was not confirmed as public."

if gh repo view "$PRIVATE" --json visibility >/dev/null 2>&1; then
  VISIBILITY=$(gh repo view "$PRIVATE" --json visibility --jq '.visibility')
  [[ "$VISIBILITY" == PRIVATE ]] || fail "Refusing to push into a non-private destination."
  BRANCHES=$(gh api "repos/$PRIVATE/branches" --jq 'length')
  [[ "$BRANCHES" == 0 ]] ||
    fail "Destination repository is not empty. No branches were overwritten."
else
  printf 'Creating new private source repository %s\n' "$PRIVATE"
  gh repo create "$PRIVATE" --private --description \
    "Private WebStudio source, tests and reviewed deployment automation"
fi

VISIBILITY=$(gh repo view "$PRIVATE" --json visibility --jq '.visibility')
[[ "$VISIBILITY" == PRIVATE ]] || fail "Private repository visibility could not be verified."
gh auth setup-git >/dev/null

TEMP=$(mktemp -d)
trap 'rm -rf "$TEMP"' EXIT
printf 'Mirroring public source history into private repository...\n'
git clone --mirror --quiet "https://github.com/$PUBLIC.git" "$TEMP/mirror.git"
git -C "$TEMP/mirror.git" remote add private "https://github.com/$PRIVATE.git"
# Push only ordinary branches and tags. Never force-update a destination.
git -C "$TEMP/mirror.git" push --quiet private --all
git -C "$TEMP/mirror.git" push --quiet private --tags

printf 'Installing PRIVATE workflow, initially manual-only...\n'
git clone --quiet "https://github.com/$PRIVATE.git" "$TEMP/private-worktree"
mkdir -p "$TEMP/private-worktree/.github/workflows"
cp "$ROOT/migration/private-release-to-public.yml" \
  "$TEMP/private-worktree/.github/workflows/webstudio-release-to-public.yml"
git -C "$TEMP/private-worktree" add .github/workflows/webstudio-release-to-public.yml
if ! git -C "$TEMP/private-worktree" diff --cached --quiet; then
  git -C "$TEMP/private-worktree" -c user.name="WebStudio migration" \
    -c user.email="webstudio-migration@users.noreply.github.com" \
    commit -m "ci: prepare opt-in verified public Pages promotion from private source"
  git -C "$TEMP/private-worktree" push --quiet origin HEAD:main
fi

[[ $(gh repo view "$PRIVATE" --json visibility --jq '.visibility') == PRIVATE ]] ||
  fail "Post-migration private visibility verification failed."
git -C "$TEMP/private-worktree" rev-parse --verify HEAD >/dev/null

printf '\nSUCCESS: private source repository initialized: https://github.com/%s\n' "$PRIVATE"
printf 'The PUBLIC repository and BOTH live website deployments remain unchanged.\n'
printf 'NEXT: configure the PUBLIC_DEPLOY_TOKEN secret in the PRIVATE repository.\n'
printf 'NEXT: populate public-pages/ and switch public GitHub Pages to the prepared artifact-only workflow.\n'
printf 'IMPORTANT: historical public code already indexed, forked or downloaded cannot be made secret retroactively.\n'
