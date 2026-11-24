# v3.10.0 Translation UI expansion — source audit
Existing languages.js has 10 supported locales and 80 top-level keys populated in every locale. But only 3 of 6 theme selector options were translated, and several later-created components have no translation binding.

This change adds personal-translation-expansion-v1.js, loaded after the primary language module and all deferred UI builders:
- Reuses 151 stable translated text leaves from the 10-locale source-of-truth dictionary.
- Adds 50 new native-translated high-frequency UI labels for panels/accordions/video/projects/theme gallery/Quick Hub.
- Translates exact-match text nodes and accessibility metadata (ARIA labels, titles, placeholders, image alt), including dynamically mounted components through a MutationObserver.
- Allows switching languages back to English; never modifies user input fields, names, URLs, application IDs, JSON data or the private vault submission payload.
- Adds explicit labels for all six theme selector choices in all ten locales.
- Preserves Neon short portrait name and original approved visual assets.
- No third-party translation API, tracking, external network or user data transfer.

Not verified: real mobile browser screenshots, translation quality in all ten languages, long-form newly introduced descriptions and captions. The 50 supplemental entries are NOT complete coverage of every late-added sentence; further editorial locale additions remain necessary. Arabic RTL layout should be checked on mobile browser.
Backup: backup/i18n-before-v4-preview-2026-11-24 at 5d76868972c7ba541d492d4e7983ed729d59ab60. Production unchanged.
