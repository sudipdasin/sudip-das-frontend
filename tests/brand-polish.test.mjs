import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const favicon = await readFile(new URL('../favicon.svg', import.meta.url), 'utf8');

test('portfolio declares its branded SVG favicon and canonical domain', () => {
  assert.ok(html.includes('rel="icon" type="image/svg+xml" href="/favicon.svg"'));
  assert.ok(html.includes('rel="canonical" href="https://sudipdas.is-a.dev/"'));
  assert.ok(favicon.includes('viewBox="0 0 64 64"'));
  assert.ok(favicon.includes('<title id="title">Sudip Das</title>'));
});

test('header brand stays on one line and has a small-screen menu before links become cramped', () => {
  assert.match(html, /\.brand\{[^}]*white-space:nowrap/);
  assert.match(html, /\.brand-name\{white-space:nowrap\}/);
  const tablet = html.indexOf('@media(max-width:860px)');
  const mobile = html.indexOf('@media(max-width:600px)', tablet);
  assert.ok(tablet >= 0 && mobile > tablet && html.indexOf('.menu{display:block', tablet) < mobile);
  assert.ok(html.includes('.navlinks.open{display:flex}'));
});
