/**
 * WebStudio Design 1/Aurora review contract for the real personal website.
 * Source-level, not screenshot/pixel-equality proof.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),js=read('webstudio-parity.js'),css=read('webstudio-aurora-reference-v2.css');
const manifest=JSON.parse(read('site-release.json'));
assert.equal(manifest.stage,'preview');
assert.equal(manifest.preview.branch,'preview-personalweb');
assert.equal(manifest.preview.productionApiConnected,false);
assert.equal(manifest.preview.privateRequestsEnabled,false);
assert.match(html,/window.PUBLIC_API_BASE=""/);
assert.match(html,/type="submit" disabled aria-disabled="true"/);
assert.doesNotMatch(html,/src="webstudio-visual-port.js"/);
assert.match(html,/webstudio-theme-fidelity-v1.css">\s*<link rel="stylesheet" href="webstudio-aurora-reference-v2.css"/);
assert.match(js,/ws-aurora-reference/);
assert.match(js,/ws-orbit-glyph/);
assert.match(js,/ws-aurora-feature-grid/);
assert.match(js,/ws-visitor-quick-open/);
assert.doesNotMatch(js,/ws-studio-open|Studio & system/);
assert.match(js,/slice\(0, 6\)/);
for(const name of ['CRM & SQL','Linux tools','Systems','Creative technology','Technical support']){
 assert.ok(js.includes(name),'Missing known skill label: '+name);
}
for(const id of ['orbit','editorial','terminal','aurora-peak','neon-studio','design-2']){
 assert.ok(html.includes('option value="'+id+'"'));
}
for(const required of [
 'studio-design-one-highlight-fixes.css','studio-orbit-fidelity.css',
 'ws-aurora-infinity','ws-aurora-info-band','ws-aurora-feature-grid',
 'grid-template-columns:repeat(6,minmax(0,1fr))',
 'ws-aurora-cta','ws-aurora-cta-actions','ws-orbit-glyph',
 'ws-orbit-label','ws-orbit-chip[data-pos="e"]',
 'data-theme="neon-studio"','data-theme="design-2"','max-width:980px',
 'max-width:600px','prefers-reduced-motion'
]){
 assert.ok(css.includes(required),'Missing Aurora visual source contract: '+required);
}
const braces=()=>{let depth=0,comment=false,quote='';for(let i=0;i<css.length;i++){
 const ch=css[i],next=css[i+1];
 if(comment){if(ch==='*'&&next==='/'){comment=false;i++;}continue;}
 if(quote){if(ch==='\\'){i++;continue;}if(ch===quote)quote='';continue;}
 if(ch==='/'&&next==='*'){comment=true;i++;continue;}
 if(ch==='"'||ch==="'"){quote=ch;continue;}
 if(ch==='{')depth++;if(ch==='}')depth--;
 assert.ok(depth>=0,'Extra closing CSS brace at '+i);
}assert.equal(depth,0,'Unclosed CSS block');assert.equal(quote,'');assert.equal(comment,false);};
braces();
for(const forbidden of ['Dev Das','WEBSTUDIO · FREE COMMUNITY EDITION','Customize demo','Studio & system']){
 assert.ok(!js.includes(forbidden),'Demo admin text leaked: '+forbidden);
}
console.log('PASS: Design 1 six cards, four detail items, five real-skill orbit badges, isolated preview and other themes');
