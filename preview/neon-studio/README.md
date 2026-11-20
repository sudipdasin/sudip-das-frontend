# Neon Web Studio — isolated visual preview

This folder contains a first-pass HTML/CSS implementation based on two supplied Web Studio screenshots. It is **not** automatically the live homepage.

## Preview locally

From the repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/preview/neon-studio/`. The portrait image loads from the existing root asset. Run from repository root, not from the preview folder.

## Implemented

- Dark navy and cyan/purple neon visual design
- Brand/navigation, responsive mobile menu, Studio/System menus
- Hero gradient headline, cyan-border portrait rings, animated orbit dots
- Glasslike middle feature band and six responsive feature cards
- Keyboard dismiss and Escape menu handling
- Light/dark appearance toggle and local-only accent picker
- Existing public portfolio links for Projects, Journey, Contact and Enquiry

## Not implemented or verified

- Exact pixel matching: the reference screenshots' original background artwork, fonts, dimensions and source components were not provided. CSS approximates them; a true pixel-perfect match requires original assets or extracting the page design source.
- Visual editor, backend administration, domain switch, backups, provider failover and recovery: present as *visual design labels*, not as functional services.
- Form submission and CAPTCHA: no submission is made from this preview; existing portfolio links handle enquiry.
- No browser screenshot diff, accessibility audit, or cross-browser test has been executed in this environment.

## Review gates before any production replacement

1. Obtain and license original background/wave/mountain artwork if exact-match is required.
2. Compare screenshot at its native desktop viewport and at 1440px, 1024px, 768px and 390px.
3. Verify accessible keyboard navigation, contrast and reduced-motion behavior.
4. Reconnect every menu action to a real, authenticated destination; remove any unimplemented service claims.
5. Test existing language switching, backend CORS, Turnstile, contact form and email delivery on preview deployment.
6. Merge only once domain verification and functional regressions pass.

The existing live homepage remains the production source until explicitly replaced and verified.
