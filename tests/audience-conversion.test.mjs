import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const [html, languageSource, manifestSource] = await Promise.all([
  readFile(new URL('../index.html', import.meta.url), 'utf8'),
  readFile(new URL('../languages.js', import.meta.url), 'utf8'),
  readFile(new URL('../data/site.json', import.meta.url), 'utf8')
]);
const manifest = JSON.parse(manifestSource);

test('audience filters correspond to categories present in project data', () => {
  const selected = [...html.matchAll(/data-audience="([^"]+)"/g)].map(match => match[1]).filter(value => value !== 'all');
  const available = new Set(manifest.projects.flatMap(project => project.audiences || []));
  assert.equal(new Set(selected).size, selected.length);
  for (const audience of selected) assert.ok(available.has(audience), `No project uses audience: ${audience}`);
  assert.equal(manifest.uiLabels.en.professional, 'Hiring & client work');
});

test('hero offers hiring and client paths, and client links open the proposal form', () => {
  assert.ok(html.includes('class="button profile-prototype-link hiring-overview-link" href="#experience"'));
  assert.ok(html.includes('class="button client-brief-cta" href="#freelance" data-freelance="startCta"'));
  assert.ok(html.includes('document.querySelectorAll(\'a[href="#freelance"]\')'));
  assert.ok(html.includes('freelance.open=true'));
  assert.equal((languageSource.match(/startCta:/g) || []).length, 10);
});
