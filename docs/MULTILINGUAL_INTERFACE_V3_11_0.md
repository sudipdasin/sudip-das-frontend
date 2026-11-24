# Visitor interface translations v3.11.0
Ten locales: en, hi, bn, es, fr, de, pt, ar, zh-CN, ja. Original source languages.js has 80 populated fields for every locale. 151 plain-text core phrases are reused by the extension. 350 supplemental labels and full sentences have complete ten-column locale rows.

Audited sources: index.html and seven dynamic visitor JavaScript modules including Quick Hub, navigation, gallery, themes, video, WebStudio walkthrough, and the contact/freelance/private request UI. Exact-match text nodes, ARIA labels, title, placeholder and alt text are localized. Newly inserted text is picked up via MutationObserver. Theme selector six options are localized. Selected text reverts to English on language change, including non-Latin scripts; user's input is untouched.

Identity proper names, URLs, platform names, and original visual baseline are preserved. Production-specific private request privacy copy is included in the dictionary. Hindi/Chinese mixed-script errors corrected. No third-party network translation API or tracking.

Validation: all 10 locales, 80 original fields per locale, 350 supplemental rows with 10 nonempty translations, no duplicate English keys, no mixed Hindi/Chinese scripts, JS source syntax, and backup/prod isolation. Browser-level translation overflow and linguistic QA remain unverified; the source audit is not certification of real mobile rendering. No CircleCI/GitHub Actions credits consumed.
