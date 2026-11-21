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
if (has(portrait, /data:image\/(?:jpeg|jpg|png|webp);base64,/i)) {
  warnings.push('Portrait SVG contains raster image data: verify ORIGINAL raster dimensions and usage rights before claiming high resolution.');
}
if (!portrait) warnings.push('Portrait asset unavailable for quality inspection.');
for (const [name, width, height] of [['Aurora',1833,858],['Cosmic',1672,941]]) {
  console.log(`${name}: reference viewport ${width}x${height}; mobile width 390px (browser comparison required)`);
}
for (const warning of warnings) console.warn('WARNING:', warning);
for (const error of errors) console.error('FAIL:', error);
console.log(`Reference source checks: ${errors.length ? 'FAILED' : 'PASSED'} (${errors.length} errors, ${warnings.length} warnings)`);
process.exitCode = errors.length ? 1 : 0;
