# Preview Neon header alignment v3.9.7 — 2026-11-24

## Grounding
Owner provided two cropped screenshots. WebStudio reference: a ~54×54 cyan square with large italic initials 'DD', next to 20px bold name 'Dev Das', with an all-caps bright cyan 'WEB STUDIO' second line (approx 8px with wide letterspacing). Current portfolio: small 'SD' within 50px square, name 'Sudip Das' single line center-aligned; the technology/system/open-source category badge appears BELOW the header.

## Implemented
- Retain real public identity 'SD' / 'Sudip Das', not the sample's 'DD' / 'Dev Das'.
- Add small cyan 'WEB STUDIO' line below 'Sudip Das' in Neon Studio only.
- Align icon and the TWO-LINE wordmark vertically in the same flex group. Text lines both left-aligned, larger italic initials and reference-like cyan outline.
- Adapt monogram to 50px tablets, 49px phones. Mobile nav at least 72px high to fit mark and controls.
- The separate 'Technology · Systems · Open source' hero badge remains below the header; no duplicated content or changed links.
- On all five other themes, the new subtitle is hidden and existing single-line name retained.

## Scope, verification and rollback
Only index.html, new personal-neon-header-reference-v1.css, manifests, SHA guard and documentation changed. Preview only, production main untouched. Original owner-approved golden backup and wider-ring/nameplate backups preserved. Complete prechange preview backed up at backup/neon-v3.9.6-before-header-alignment-2026-11-24, SHA 9bc882935586c21e5f83bed825c334411cacdaf1. Source checks passed; browser screenshot QA pending; no GitHub Actions or CircleCI credits used.
