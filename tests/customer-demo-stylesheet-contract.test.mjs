// Guard against accidentally adding another layer of theme CSS overrides.
// Run: node --test tests/customer-demo-stylesheet-contract.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
const html = readFileSync(new URL('../examples/customer-demo/index.html', import.meta.url), 'utf8');
const sheets = [...html.matchAll(/<link\b[^>]*rel=["']stylesheet["'][^>]*href=["']([^"']+)["'][^>]*>/gi)]
  .map(match => match[1].split('?')[0]);
test('demo loads no duplicate stylesheet URLs', () => {
  assert.equal(new Set(sheets).size, sheets.length, 'Duplicate stylesheet; consolidate instead of overriding');
});
test('theme-specific references remain independent', () => {
  assert.ok(sheets.includes('studio-design-one.css'), 'Aurora stylesheet missing');
  assert.ok(sheets.includes('studio-design-two.css'), 'Cosmic stylesheet missing');
  assert.notEqual(sheets.indexOf('studio-design-one.css'), sheets.indexOf('studio-design-two.css'));
});
test('stylesheet count cannot grow without consolidation', () => {
  // Baseline from 2026-11-22. Reduce as styles are consolidated; never silently increase.
  assert.ok(sheets.length <= 30, `Stylesheet budget exceeded: ${sheets.length}; consolidate existing overrides`);
});
