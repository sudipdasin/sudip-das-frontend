/**
 * Offline visual contract for the real personal portfolio's six WebStudio themes.
 * This checks source integrity and environment isolation. It does not assert
 * screenshot pixel identity or replace real Chromium comparison.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html');
const css=read('webstudio-theme-fidelity-v1.css');
const parity=read('webstudio-parity.js');
const geometries=read('webstudio-reference-geometry.css');
const release=JSON.parse(read('site-release.json'));
const themes=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
assert.match(html,/<link rel="stylesheet" href="webstudio-reference-geometry.css">\s*<link rel="stylesheet" href="webstudio-theme-fidelity-v1.css">/);
assert.equal(release.stage,'preview');
assert.equal(release.preview?.branch,'preview-personalweb');
assert.equal(release.preview?.productionApiConnected,false);
assert.equal(release.preview?.privateRequestsEnabled,false);
assert.match(html,/window.PUBLIC_API_BASE="";window.PORTFOLIO_PREVIEW_MODE=true/);
assert.doesNotMatch(html,/src="webstudio-visual-port.js"/);
assert.doesNotMatch(parity,/ws-studio-open|Studio & system|data-import-look|data-export-look/);
assert.match(parity,/ws-visitor-quick-open/);
assert.match(parity,/updateOrbitBadges/);
for(const theme of themes){
  assert.ok(html.includes('value="'+theme+'"'),'Missing public theme selector: '+theme);
  assert.ok(css.includes('body.ws-parity[data-theme="'+theme+'"]'),'Missing scoped fidelity theme '+theme);
}
for(const term of [
 '1833x858','1672x941','1777x832','studio-design-one.css',
 'studio-design-two.css','studio-new-themes.css','studio-theme-controls.css',
 'hero-art','ws-orbit-chip','ws-value-bar','ws-visitor-quick','project',
 'prefers-reduced-motion','max-width:980px','max-width:600px','dir="rtl"'
]){
 assert.ok(css.includes(term),'Missing fidelity contract term '+term);
}
assert.match(parity,/theme === 'neon-studio' \? skills : isCosmic \? skills.slice\(0, 4\)/);
assert.ok(geometries.includes('neon-studio')&&geometries.includes('design-2'));
for(const denied of ['Dev Das','FICTIONAL DEMO PROFILE','Real projects · Six design experiences · No account required']){
 assert.ok(!parity.includes(denied),'Demo-only copy leaked: '+denied);
}
// Balanced CSS top-level syntax scanner: ignores braces in comments/quoted strings.
let depth=0,quote='',comment=false;
for(let i=0;i<css.length;i++){
 const ch=css[i],next=css[i+1];
 if(comment){if(ch==='*'&&next==='/'){comment=false;i++;}continue;}
 if(quote){if(ch==='\\'){i++;continue;}if(ch===quote)quote='';continue;}
 if(ch==='/'&&next==='*'){comment=true;i++;continue;}
 if(ch==='"'||ch==="'"){quote=ch;continue;}
 if(ch==='{')depth++;
 if(ch==='}')depth--;
 assert.ok(depth>=0,'CSS has extra closing brace near '+i);
}
assert.equal(depth,0,'CSS brace imbalance');
assert.equal(comment,false,'Unclosed CSS comment');
assert.equal(quote,'','Unclosed quoted CSS value');
console.log('PASS: six WebStudio-inspired personal themes, portable CSS, responsive/RTL/motion contract, safe preview and visitor-only UI');
