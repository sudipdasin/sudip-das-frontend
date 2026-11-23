# Personal preview v3.9.0 — Compact and interactive Let's Connect

Scope: sudipdasin/sudip-das-frontend, branch preview-personalweb; no production, WebStudio theme source or backend changes.

Problem: the former panel displayed four large network groups fully expanded at the same time, followed by a separate freelancer section and two full-sized WebStudio/profile preview cards. The panel overwhelmed the page.

Solution:
- Compact editorial header and responsive three-card first row: Email, WhatsApp, Telegram. All existing approved URLs remain.
- Four semantic native details groups, initially collapsed: Email options, Professional Networks, Social & Creative, Instant Messaging.
- On pointer-capable desktop, hover opens a group after 160ms; leaving closes an unpinned hover preview after 260ms; click pins an open group, subsequent click closes it. On keyboard/touch, summary click/Enter/Space uses native details behavior. One pinned group at a time, and scrollable group contents cap the expansion height.
- Existing Freelancer Connect details preserved as a slim collapsed strip. Existing request-details and WebStudio mini preview pair moved inside a slim Explore before connecting details; Quick Hub still mounts live content in the original div ID.
- Theme-sensitive glass/acrylic gradients, colored icon rings, small interactive glows, subtle slide/reveal motion, responsive two-column desktop/one-column mobile, prefers-reduced-motion respected.
- All social profile links, Teams/Discord/Google copy controls, historical freelancer records, original contact section ID, and owner-reviewed private-detail protections remain.
- No new third-party scripts, tracking, message sending, account access or backend modifications. GitHub Actions and CircleCI skipped due owner credit constraints. Source and JS syntax checks run; browser visual QA not claimed.
