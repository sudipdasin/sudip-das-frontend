# Exposure Watch — Security monitoring product specification

Status: **local demo incident triage implemented; live breach monitoring NOT implemented.**

## Product promise

Help a user discover, understand and respond to credible exposure of accounts, email addresses, personal data, and financial identifiers. Never guarantee that every leak, compromise or dark-web reference will be found. Do not imply that a lookup means the user has been hacked; distinguish breach membership from active account takeover.

## Delivered demo

- Local-only incident records with categories, timestamps and status.
- Visible count of unresolved **self-reported** incidents.
- Steps to mitigate account, identity, financial and phishing concerns.
- Links to Mozilla Monitor and Have I Been Pwned.
- Deliberately no password or full government/financial identifier fields.
- No remote transmission, surveillance, identity scraping, or automated claims.

## Future production backend (requires separate secure authenticated deployment)

1. Consent and verified account ownership: users explicitly opt in to monitor specific email addresses; verify control via single-use link. Never allow broad arbitrary address sweeps.
2. Provider adapter: integrate documented HIBP account endpoints using a licensed API key stored as a Worker secret, never in public JavaScript. Observe rate limits, usage rights, exclusions of sensitive incidents and attribution requirements.
3. Scheduled checks: cron triggers on each opted-in account with a per-provider quota, exponential backoff, provider status telemetry and idempotent incident creation.
4. Secure storage: encrypt monitored identifiers and provider evidence at rest, minimize retention, separate tenant scopes, audit access, and make deletion/export straightforward. Avoid logging plaintext email addresses or tokens.
5. Verification semantics: store provider name, breach identifier, discovery date, affected data classes and a confidence/status field; show "provider reported", "unverified user report", and "no result returned" distinctly.
6. Alerts: preference-controlled in-app/email notifications (email only after verification), grouped by severity and deduplicated. Avoid revealing sensitive breach contents inside notification messages.
7. Recovery: guide users to rotate passwords through official sites, revoke sessions, enable MFA/passkeys, audit recovery details and contact banks where applicable. Never ask users to submit actual passwords, OTPs or recovery codes.
8. Optional wider threat-intelligence feeds: only use contracted lawful sources and document which datasets they cover. Never claim "dark web scanned" unless a real authorized feed was queried.
9. Safeguards: request throttling, authorization, anti-enumeration protections, CSP, CSRF, session security, consent receipts, tenant isolation, deletion tests, privacy and incident-response procedures.
10. Testing: mocked provider contracts are not sufficient to claim production function; verify against provider-approved test accounts or fixtures plus integration and notification delivery tests before enabling real alerts.

## Access boundaries

The public GitHub Pages demonstration cannot safely hold monitoring API keys or send authenticated alerts. Keep live monitoring in private backend services; never put secrets, discovered sensitive breach information, identity records, or customer notification lists in public GitHub artifacts.

## Accurate UI statuses

- **Local report**: user-entered information; not independently verified.
- **Provider-reported exposure** (future): an authorized external feed returned a matching account or verified domain indicator.
- **Unknown**: service unavailable or no matching report; NOT a clean bill of health.
- **Resolved by user**: mitigations completed; does not erase original breach.
- **Monitoring enabled** (future): only after consent, account verification, credentials and scheduled provider checks have been proved operational.

## Product scope

Release 1: security triage and trusted provider redirects.
Release 2: authenticated monitored-email lookups and in-app alerts.
Release 3: opt-in scheduled provider checks and verified email notification delivery.
Release 4: advanced provider-specific intelligence and privacy reporting, subject to source contracts and legal review.
