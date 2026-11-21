# Web Studio visual fidelity and publication gates

Primary live demo: https://sudipdasin.github.io/sudip-das-frontend/
Authoritative sources: `examples/customer-demo/` (not the unrelated root portfolio or detached preview).
The supplied visual references are the Dev Das Neon Web Studio and Neon Developer Dashboard desktop screenshots. They are design specifications, not guarantees that the website has already achieved pixel-level equivalence.

## Baseline geometry and visual criteria

Desktop reference canvas: 1777×832. Key design motifs: dark navy base; thin cyan borders; electric cyan, blue and purple glow; compact upper announcement; prominent left-aligned DD icon + two-line Dev Das / WEB STUDIO lockup; modern navigation with independent Studio and System flyouts; large left hero title with white-to-cyan/purple text; readable subtitle and CTAs; realistic portrait centered inside glowing orbit rings; five icon-labeled roles distributed along the orbit circumference (not a vertical list); subtle cinematic aurora and layered mountains; luminous lower infinity strip and six glass feature cards.

At 1777px: all orbit badges must be visible below the nav, not intersect one another, the portrait caption or the value strip. Preserve accessible title text even when CSS effects are unavailable.

At mobile sizes (especially 390×844): no horizontal overflow; reduce ring/pill sizes, permit badge icons without labels if required; keep working Studio/System, editor and backup controls keyboard accessible.

The lower product section can include additional content but must not displace the initial hero and six feature cards from the primary screenshot composition.

## Real capabilities vs placeholders

Preserve the working local fictional profile editor, project editing, language/theme switchers, local JSON export/import, guided demo tour and email-draft behavior. Intro video, cloud auto-backup, failover, DNS/provider management, checkout and other unbuilt backend services MUST be native disabled controls or clearly marked goals; never route them to unrelated buttons or imply production support.

Do not include real owner identity, private source, secrets, credentials, API endpoints or unlicensed personal portrait assets in this public fictional demonstration.

## Repeatable verification cycle

1. Inspect the latest published screenshot against the two user-provided design references; prioritize the largest visual gaps, not a new arbitrary theme.
2. Change a small coherent set of source files, keeping non-Neon themes intact.
3. Run Node unit/build tests and headless Chromium functional checks using the existing GitHub Actions Ubuntu runner.
4. In `browser-tests/customer-demo.mjs`, verify real geometry at 1777px and mobile 390px; save clean hero screenshots after closing the editor and scrolling to the top.
5. Inspect the `neon-visual-audit-<run id>` artifact from GitHub Actions. Do not accept green source tests as proof of visual parity.
6. Fix screenshot clipping, overlaps, overflow, awkward typography, bad assets or broken controls; rerun. Screenshot checking has previously caught issues the geometry-only test missed.
7. Merge successful PRs into `main`, wait for the production GitHub Pages deploy job, and independently check the live URL when possible; report verified commit and status without premature release claims.

## Known remaining visual differences

The current cinematic background is an original SVG approximation of the reference's photographic/illustrated aurora-and-mountains scene, so it is *not* pixel-identical. The reference portrait is a screenshot-derived, low-resolution demo crop; original high-resolution assets are not present. The user has asked for closer fidelity over successive browser-tested cycles. Do not call the design finished until a side-by-side screenshot review justifies the claim.
