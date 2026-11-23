-- Dedicated WebStudio interest-rate counters for Cloudflare Pages preview.
-- Store only salted SHA-256 hashes; do NOT reuse the private profile-vault D1.
-- Example after a new D1 database is created and bound as INTEREST_DB:
-- wrangler d1 execute <WEBSTUDIO_INTEREST_DB_NAME> --file=docs/webstudio-interest-rate-limits.sql
CREATE TABLE IF NOT EXISTS webstudio_interest_limits (
  subject_hash TEXT NOT NULL,
  bucket INTEGER NOT NULL,
  count INTEGER NOT NULL DEFAULT 1 CHECK(count BETWEEN 1 AND 3),
  PRIMARY KEY(subject_hash,bucket)
);
CREATE INDEX IF NOT EXISTS webstudio_interest_limits_bucket
  ON webstudio_interest_limits(bucket);
