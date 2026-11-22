# WebStudio Owner Encryption — Storage Protection, Not Copy Protection

## What the new exporter does

After completing the existing real-feedback receipt and approved-preview
workflow, a user can choose **Encrypt the entire generated site ZIP**.
This checkbox defaults to on and requires an owner-only passphrase of
12–256 characters. The browser:

1. Generates the same full interactive Free website (HTML, JS, CSS, images,
   JSON and runtime assets).
2. Creates the usual complete deployable website ZIP **in memory**.
3. Uses WebCrypto AES-256-GCM with a fresh random 16-byte salt and 12-byte
   nonce for each export. The encryption key is derived from the owner's
   passphrase via PBKDF2-HMAC-SHA-256 with **310,000 iterations**.
4. Authenticates the entire archive plus its encrypted-header metadata.
5. Saves an outer ZIP containing `site/encrypted-site.wsenc`, a separate
   `site/webstudio-package-crypto.cjs` decryption library,
   `site/decrypt.mjs` (offline Node.js utility), and
   `site/HOW-TO-DECRYPT.txt`. The plaintext site is **not** added to the
   outer ZIP, and the passphrase is neither transmitted, logged nor stored.
6. Clears the passphrase field after a successful encrypted download.

### Extract and deploy

```bash
unzip WebStudio-Free-terminal-protected-owner-export.zip -d owner-package
node owner-package/site/decrypt.mjs owner-package/site/encrypted-site.wsenc website.zip
# Enter your passphrase at the hidden interactive prompt.
unzip website.zip -d published-site
cd published-site/site
python3 -m http.server 8000
```

Deploy the contents of `published-site/site/` to a hosting provider yourself
after reviewing the source and any embedded public contact data.

If the user unchecks encryption, WebStudio downloads the regular, directly
deployable website ZIP. That choice is deliberately explicit: **a web server
cannot serve the encrypted contents as working HTML/CSS/JS without
decrypting them first**.

## Security guarantees and limits

- Encrypts only the **downloadable archive at rest or in transit**. A lost
  passphrase cannot be recovered from the archive.
- AES-GCM authentication rejects incorrect passwords and tampered contents.
- It does **not** stop a recipient who has the passphrase from extracting,
  reading, editing, copying, or redistributing the plaintext files.
- It does **not** prevent visitors from examining site resources delivered
  to their browsers. Obfuscation, disabling right-click, and browser-side
  encryption are **not DRM or enforceable copy prevention**.
- It does **not** encrypt the published WebStudio demo or hide code in the
  public GitHub repository.
- Truly proprietary algorithms, entitlement checks, premium modules,
  credentials and customer secrets must remain on a server or private
  repository, never in an export or publicly downloadable client code.
- Publicly visible design assets may need legal licensing and attribution
  protection. Do not override existing open-source/contributor rights.

## Release tests

```bash
node --test tests/webstudio-archive-encryption.test.mjs
node --test tests/webstudio-dynamic-export.test.mjs
node scripts/build-customer-demo.mjs
node browser-tests/customer-demo.mjs
```

Tests cover AES-256-GCM round-trip encryption, random salt and nonce,
incorrect passphrases, header/ciphertext modification, nested binary ZIP
integrity and actual Chromium download behavior. The encrypted download
does not bypass the existing requirement for an approved preview and an
acknowledged feedback submission.

## Future architecture for truly private Pro implementation

Keep Pro-only source and server handlers in a private, access-controlled
repository or Worker deployment. Offer protected backend APIs with
authenticated license entitlements, rate limits and scoped credentials.
Export only freely distributable viewer components and public assets.
Code that runs in a visitor's browser should always be assumed recoverable.
