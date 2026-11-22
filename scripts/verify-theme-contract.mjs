/**
 * Dependency-free fast gate. Run on every preview build before browser tests.
 * Explicitly separates six PERSONAL visitor themes from WebStudio Free exports.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const get=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const catalog=JSON.parse(get('theme-visual-contract.json'));
const release=JSON.parse(get('site-release.json'));
const html=get('index.html'),js=get('webstudio-parity.js'),
      css=get('webstudio-theme-fidelity-v1.css'),
      aurora=get('webstudio-aurora-reference-v2.css');
const ids=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
assert.equal(catalog.schemaVersion,1);
assert.equal(catalog.previewOnly,true);
assert.deepEqual(catalog.themes.map(x=>x.id),ids);
assert.equal(catalog.themes.filter(x=>x.ownerFavorite).length,1);
assert.equal(catalog.themes.find(x=>x.ownerFavorite).id,'editorial');
assert.equal(catalog.editorialFreeze.immutableCommit,
  'c5383df1ebda7a0e5f05d9f59048a136dc99dac5');
assert.equal(catalog.editorialFreeze.allowedDifferenceRatio,0.001);
assert.equal(catalog.currentPreview,
  'https://preview-personalweb.sudip-das-frontend.pages.dev/');
assert.equal(release.stage,'preview');
assert.equal(release.preview?.branch,'preview-personalweb');
assert.equal(release.preview?.privateRequestsEnabled,false);
assert.equal(release.preview?.productionApiConnected,false);
assert.ok(html.includes('window.PUBLIC_API_BASE=""'));
assert.ok(html.includes('type="submit" disabled aria-disabled="true"'));
assert.ok(!html.includes('src="webstudio-visual-port.js"'));
assert.ok(!js.includes('Studio & system'));
assert.ok(js.includes('ws-visitor-quick-open'));
const selector=html.match(/<select[^>]+id="theme-select"[^>]*>([\s\S]*?)<\/select>/);
assert.ok(selector,'theme picker missing');
const optionIds=[...selector[1].matchAll(/<option value="([^"]+)"/g)].map(x=>x[1]);
assert.deepEqual(optionIds,ids,'theme dropdown differs from canonical 6-theme registry');
for(const t of catalog.themes){
  assert.equal(t.personalPreviewAvailable,true,'personal theme disabled '+t.id);
  assert.ok(css.includes('body.ws-parity[data-theme="'+t.id+'"]'),
    'theme CSS not scoped for '+t.id);
  assert.ok(html.includes('value="'+t.id+'"'),'theme cannot be selected '+t.id);
  assert.equal(t.demoExport,ids.indexOf(t.id)<3?'free':'premium-preview',
    'WebStudio Free export status misrepresented');
}
assert.deepEqual(catalog.themes.map(x=>x.orbitBadges),[3,3,3,3,5,4]);
assert.ok(aurora.includes('body.ws-parity[data-theme="neon-studio"] .ws-aurora-reference'));
assert.ok(aurora.includes('body.ws-parity .ws-aurora-reference{display:none}'));
assert.ok(aurora.includes('grid-template-columns:repeat(6,minmax(0,1fr))'));
assert.ok(!aurora.includes('body.ws-parity[data-theme="design-2"] .ws-aurora-feature-grid'));
assert.ok(js.includes("theme === 'neon-studio' ? skills : isCosmic ? skills.slice(0, 4)"));
assert.ok(!js.includes('Dev Das'));
assert.ok(!js.includes('Real projects · Six design experiences · No account required'));
console.log('PASS six-theme preview catalog, differentiated design contracts and protected Editorial archive SHA');
