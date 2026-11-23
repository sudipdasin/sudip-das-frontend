# Personal website v3.7.0 — messaging and Freelancer Connect

Repo branch: `sudipdasin/sudip-das-frontend@preview-personalweb`; **no production change**.

## Messaging
- Microsoft Teams: supplied ID `sudipdasin` and address `sudipdasin@gmail.com`. Uses official Teams chat deep-link format with email: `https://teams.microsoft.com/l/chat/0/0?users=sudipdasin%40gmail.com`. Availability depends on Microsoft account/tenant permissions; provides an explicit "Copy Teams email" fallback.
- Google Hangouts: original supplied handle `sudipdasin`. Hangouts was retired in 2022; it is represented as **Google Chat (formerly Hangouts)** linking to `https://chat.google.com/`, and a copy-handle button. No invented direct user deep link.
- Discord: supplied username `super_gamer26`, linked to Discord's signed-in Friends/DM area `https://discord.com/channels/@me` with copy-username and friend-add instructions. No fabricated Discord numeric user ID.
- All copy actions require explicit clicks and do not send a message.

## Freelancer Connect (collapsed)
Four URLs found in user-provided `FREELANCER PROFILE.pdf` and `Freelancer Profile 2018.pdf`:
- Freelancer.com: https://www.freelancer.com/u/sudipdasin.html (Historical link · Current availability unverified)
- PeoplePerHour: https://www.peopleperhour.com/freelancer/sudip/blogger-technical-support-consulta/270560 (Historical link · Current availability unverified)
- oDesk: https://www.odesk.com/users/~01f8356d62632c086c (Legacy oDesk · Now associated with Upwork)
- Elance: https://www.elance.com/s/sudipdasin/ (Legacy Elance · Retired platform)
The original Freelancer.com URL was HTTP and is presented here with HTTPS. The profile URLs are historical and **not verified active**; oDesk and Elance are retired legacy marketplaces. Do **not** substitute the unrelated sample Upwork profile found in the source.

## Presentation
Adds a four-quadrant responsive connect grid, explicit consent-free copy buttons, category icons, a native Details accordion, a Quick Hub Connect tab grouping for Teams, Google Chat and Discord, and a dedicated "Freelancer Connect" shortcut. Keeps existing six social profiles, email, WebStudio mini previews, owner-reviewed request vault, and noindex/no backend preview guards.

No GitHub Actions or CircleCI workflows were run. Source syntax and safety invariants checked; live browser playback/visual tests not claimed.
