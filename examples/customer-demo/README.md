# Fictional Customer Profile Demo

**This demo is entirely separate from the real personal website.** It illustrates how an eventual buyer can create a unique portfolio using Personal Profile Web Studio.

- Demo identity: **Avery Example** (fictional)
- Demo location: **Example City (fictional)**
- Email: `demo@example.com` (reserved example address; not monitored)
- Portfolio project URLs: `example.com` (reserved illustrative addresses)
- Social URLs: illustrative only

## Preview locally

From repository root:

```sh
python3 -m http.server 8000
```

Open `http://localhost:8000/examples/customer-demo/`.

Select **Customize demo** to edit identity, role, tagline, location, skills and color. Choose **Preview changes** to update the visible page. **Export profile JSON** creates a local JSON download; **Reset demo** restores the original sample. No information is sent to a commercial API, database, email service or real account.

The profile is intentionally a minimal stand-alone example; it is **not yet** a complete authenticated CMS, production setup wizard, or integrated deployment solution.

## Independent profiles and future commercial packaging

The `profile.json` file is the portable unit of customer profile data. A buyer should duplicate the example into their **own** storage/account rather than modify the developer's live portfolio. Keep user-specific data out of application source, isolate all backend/database resources by customer, and replace sample emails/links with verified real destinations.

This static demo should be deployed to a separate preview path/host. Do not use the developer's real portrait, domain, forms, production API or credentials. Review licensing and all third-party dependencies separately before commercial distribution.

## Source validation

Run `node --check examples/customer-demo/app.js` and `node --test tests/customer-demo.test.mjs`. These cover fixture structure, public-only data, link safety, and basic HTML/JS contract checks. They do not replace browser tests or a production security review.
