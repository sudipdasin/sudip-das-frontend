#!/usr/bin/env node
/**
 * Source-level guardrails for the two independently supplied WebStudio designs.
 * Run: node examples/customer-demo/reference-integrity-check.mjs
 * No browser or third-party packages required. Browser screenshot comparison is
 * a separate release gate and is NOT replaced by this check.
 */
import { readFileSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const errors = [];
const warnings = [];
const read = name => {
  const path = join(root, name);
  if (!existsSync(path)) { errors.push(`Missing asset: ${name}`); return ''; }
  return readFileSync(path, 'utf8');
};
const html = read('index.html');
const aurora = read('studio-design-one.css');
const cosmic = read('studio-design-two.css');
const portrait = read('neon-reference-portrait.svg');
const assert = (ok, message) => { if (!ok) errors.push(message); };
const has = (s, re) => re.test(s);

assert(has(html, /data-theme=["']neon-studio["']/), 'Aurora default theme ID changed');
assert(has(html, /studio-design-one\.css/), 'Aurora scoped stylesheet missing');
assert(has(html, /studio-design-two\.css/), 'Cosmic scoped stylesheet missing');
assert(has(aurora, /body\[data-theme=["']neon-studio["']\]/), 'Aurora CSS theme selector missing');
assert(has(cosmic, /body\[data-theme=["']design-2["']\]/), 'Cosmic CSS theme selector missing');
assert(has(aurora, /neon-role-pills/), 'Aurora five-role layout styling missing');
assert(has(aurora, /neon-feature-grid/), 'Aurora compact feature styling missing');
assert(has(cosmic, /orbit|satellite/i), 'Cosmic orbit styling missing');
assert(has(cosmic, /feature/i), 'Cosmic feature styling missing');

// Keep theme styling isolated: no cross-theme body selectors in dedicated files.
assert(!has(aurora, /body\[data-theme=["']design-2["']\]/), 'Cosmic selector leaked into Aurora CSS');
assert(!has(cosmic, /body\[data-theme=["']neon-studio["']\]/), 'Aurora selector leaked into Cosmic CSS');

// Detect photographic data embedded in an SVG wrapper. An SVG extension alone
// does not imply a high-resolution portrait.
// Read actual JPEG SOF metadata rather than trusting the SVG viewBox.
function jpegSize(bytes) {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let pos = 2;
  while (pos + 9 < bytes.length) {
    if (bytes[pos++] !== 0xff) return null;
    while (pos < bytes.length && bytes[pos] === 0xff) pos++;
    const marker = bytes[pos++];
    if (marker === 0xd9 || marker === 0xda) break;
    if (pos + 2 > bytes.length) return null;
    if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
    const length = bytes.readUInt16BE(pos);
    if (length < 2 || pos + length > bytes.length) return null;
    if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) {
      if (length < 7) return null;
      return {width: bytes.readUInt16BE(pos + 5), height: bytes.readUInt16BE(pos + 3)};
    }
    pos += length;
  }
  return null;
}
const jpeg = portrait.match(/data:image\/jpe?g;base64,([A-Za-z0-9+/=]+)/i);
if (jpeg) {
  const dimensions = jpegSize(Buffer.from(jpeg[1], 'base64'));
  if (dimensions) {
    console.log(`Embedded original JPEG: ${dimensions.width}x${dimensions.height} pixels`);
    if (Math.min(dimensions.width, dimensions.height) < 768) {
      warnings.push(`Portrait original is only ${dimensions.width}x${dimensions.height}; replace with a licensed, genuinely higher-resolution original (recommended >=768px per side).`);
    }
  } else {
    warnings.push('Portrait contains an embedded JPEG whose original dimensions could not be verified.');
  }
} else if (has(portrait, /data:image\/(?:png|webp);base64,/i)) {
  warnings.push('Portrait SVG embeds a raster image: inspect original pixel dimensions and rights.');
}
if (!portrait) warnings.push('Portrait asset unavailable for quality inspection.');
for (const [name, width, height] of [['Aurora',1833,858],['Cosmic',1672,941]]) {
  console.log(`${name}: reference viewport ${width}x${height}; mobile width 390px (browser comparison required)`);
}
for (const warning of warnings) console.warn('WARNING:', warning);
for (const error of errors) console.error('FAIL:', error);
console.log(`Reference source checks: ${errors.length ? 'FAILED' : 'PASSED'} (${errors.length} errors, ${warnings.length} warnings)`);
process.exitCode = errors.length ? 1 : 0;
