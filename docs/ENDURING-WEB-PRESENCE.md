# Enduring Web Presence — Resilience Architecture (Product USP)

## Promise and engineering boundary

**Vision:** Your personal web presence should remain recoverable when hosting, DNS, domains, APIs, storage, or other vendors fail. **Engineering claim:** resilience through independent copies, portable configuration, observability and verified restoration.

**Not an absolute uptime guarantee:** A domain that expires or is suspended cannot necessarily be reassigned or instantly recovered; DDoS can overwhelm multiple origins; DNS caches, certificate authorities, registries, regulatory restrictions and shared upstream outages cannot be controlled by software. No system can guarantee perpetual reachability of a particular domain.

## Fault model

| Failure | Detection | Planned mitigation | Remaining risk |
| --- | --- | --- | --- |
| Hosting provider outage | Multiple external probes and asset hashes | Replicate static site; verify independent backup host; fail over origin | DNS propagation, shared CDN fault |
| DNS/CNAME error | Authoritative/public resolver diff | Stage record corrections with human confirmation and rollback | TTL, permissions, registrar loss |
| Domain expiration/suspension | Registrar calendar and independent ownership check | Renewal reminders, optional secondary domains, alternate discovery links | Cannot guarantee reclaim of original name |
| API or database outage | Authenticated health and transaction probes | Database snapshots, API adapter switching, staged rehydration | Writes between recovery points |
| Cyberattack / defacement | Content integrity manifests and alerts | Immutable backups, credential rotation, clean redeploy | Compromised identity or backups |
| DDoS, spam, phishing | CDN/WAF metrics, behavioral signals, reputation checks | Rate limits, bot challenges, email/DNS security, standby provider | Attack and detection limits |
| Lost customer device | Independent encrypted backup | Recovery key and verified restore on new system | Key loss, lost backups |

## Core architecture (planned, not implemented by the static demo)

1. **Portable identity package:** versioned profile schema, assets, content manifest, and provider-neutral site config; no secrets embedded in exported frontends.
2. **Independent backup adapters:** local encrypted filesystem, customer-owned object storage, and alternate remote destinations; user chooses regions and retention.
3. **Automated multi-copy backup policy:** 3-2-1 model with geographically/provider-separated copies; encryption, integrity hashes, immutability, history, and retention limits.
4. **Recovery validation:** periodic clean-room restore to isolated staging, compare assets and functional probes, record tested restore time and recovery point.
5. **Observability:** HTTPS and external DNS probes from independent networks, domain renewal checks where provider API permits, certificate expiry, uptime, forms, mail, and backups.
6. **Safe orchestrated failover:** use a verified standby origin, prepare DNS changes, confirm TLS/CORS/CAPTCHA/SMTP, then switch via supported provider adapters; stop on inconsistent state.
7. **Provider plug-in contracts:** DNS registrar, authoritative DNS, hosting, storage, database, mail, CDN/WAF, domain renewal, notifications; adapters have capability flags and migrations.
8. **Security:** secrets server-side, least privilege, signed operations, audit trail, credential rotation, phishing/spam protections, backup encryption, and explicit customer consent.
9. **Owner control:** wizard-driven review, dry run, backups before migration, automatic rollback where feasible, and manual emergency actions when full automation would be unsafe.
10. **Alternate discovery:** optional pre-registered fallback domain and customer-owned channels when the primary domain is irrecoverable.

## Release acceptance criteria

- Failure-injection tests: isolated provider outage, DNS NXDOMAIN / CNAME loop, expired certificate, corrupted backup, revoked credentials, attack simulation.
- Measured and reproducible recovery point objective (RPO), recovery time objective (RTO), monitoring detection lag, and restore success rate.
- Real independent providers and clean-room credentials; no fake success tests or claims based only on static mocks.
- No destructive DNS changes without staged readiness checks and owner authorization; recovery log, security audit and rollback verification.
- Accessibility, localization, portability and data-loss tests for exported customer data.

## Current public demo status

**Working now:** visual themes, independent fictional profile, local browser save and manual JSON export/import. `studio-product` describes the **planned** resilient site-management product.

**Not implemented yet:** provider connectors, replicated backups, uptime probes, registrar renewal automation, automated DNS failover, site recovery orchestrator, DDoS protection service, authenticated customer storage, production payment service. No automated failover or availability SLA should be advertised until tested.

This document establishes technical requirements and honest marketing language; it does not itself create a self-healing platform.
