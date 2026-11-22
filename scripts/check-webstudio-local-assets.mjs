#!/usr/bin/env node
// Run: node scripts/check-webstudio-local-assets.mjs
import { readFileSync, existsSync } from 'node:fs';
import { dirname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const demo = resolve(root, 'examples/customer-demo');
const htmlFile = resolve(demo, 'index.html');
const html = readFileSync(htmlFile, 'utf8');
const errors = [];
const styles = new Set();
function check(raw, origin, kind) {
  if (!raw || /^(?:#|data:|blob:|mailto:|tel:|https?:|\/\/)/i.test(raw)) return;
  const path = raw.split(/[?#]/, 1)[0];
  if (!path || path.startsWith('/')) return;
  let decoded;
  try { decoded = decodeURIComponent(path); }
  catch { errors.push('Invalid URL escape: ' + raw); return; }
  const target = resolve(dirname(origin), decoded);
  if (target !== demo && !target.startsWith(demo + sep)) {
    errors.push(kind + ' escapes demo: ' + raw);
    return;
  }
  if (!existsSync(target)) errors.push('Missing ' + kind + ': ' + raw);
  if (kind === 'stylesheet') {
    if (styles.has(target)) errors.push('Duplicate stylesheet: ' + raw);
    styles.add(target);
  }
}
const cssFiles = [];
for (const match of html.matchAll(/<link\b[^>]*>/gi)) {
  const tag = match[0];
  if (!/\brel\s*=\s*["']stylesheet["']/i.test(tag)) continue;
  const href = tag.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
  if (!href) { errors.push('Stylesheet link missing href'); continue; }
  check(href, htmlFile, 'stylesheet');
  const file = resolve(demo, href.split(/[?#]/, 1)[0]);
  if (existsSync(file) && file.startsWith(demo + sep)) cssFiles.push(file);
}
for (const match of html.matchAll(/<script\b[^>]*>/gi)) {
  const src = match[0].match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
  if (src) check(src, htmlFile, 'script');
}
for (const match of html.matchAll(/<(?:img|source)\b[^>]*>/gi)) {
  const src = match[0].match(/\bsrc\s*=\s*["']([^"']+)["']/i)?.[1];
  if (src) check(src, htmlFile, 'image');
}
for (const file of cssFiles) {
  const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const match of css.matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/gi)) check(match[2], file, 'CSS asset');
}
if (errors.length) {
  console.error('WebStudio asset check FAILED:\n' + errors.join('\n'));
  process.exitCode = 1;
} else {
  console.log('WebStudio asset check passed: ' + styles.size + ' unique stylesheets.');
}
