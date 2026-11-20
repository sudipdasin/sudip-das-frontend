# V2 Frontend Release Candidate — 0.2.0-rc.3

## Improvement: automatic discovery of new public GitHub repositories
- Keeps the editorially reviewed public project cards from `data/site.json`.
- Discovers new public repositories belonging to `sudipdasin` automatically, without changing the manifest.
- Fetches multiple GitHub API pages (up to four), filters private, archived, forked and disabled repositories, and deduplicates names case-insensitively.
- Limits dynamic project summaries to publicly exposed GitHub metadata and renders descriptions as text, not HTML.
- Retains a six-hour local cache and existing curated cards when the public GitHub API is unavailable.
- Adds automated tests for privacy filtering, pagination, safe card metadata and graceful failures.

## Release checks
`node --check languages.js`; `node --check scripts/repo-discovery.js`; `node --test tests/*.test.mjs`.

## Release scope
Source publication is not the same as a verified live website deployment. Do not change `sudipdas.is-a.dev` DNS, backend deployments, private data, or the previous fallback website as part of this release. 
