/* Offline source contract: private personal data stays unavailable in the
 * Cloudflare public preview. This is NOT a full Chromium visual test. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html');
const js=read('personal-theme-library.js');
const css=read('personal-theme-library.css');
const parity=read('webstudio-parity.js');
const contract=JSON.parse(read('theme-visual-contract.json'));
const release=JSON.parse(read('site-release.json'));
const ids=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
assert.equal(release.stage,'preview');
assert.equal(release.preview.role,'CURRENT_PERSONAL_PREVIEW');
assert.equal(release.preview.branch,'preview-personalweb');
assert.equal(release.preview.privateRequestsEnabled,false);
assert.equal(release.preview.productionApiConnected,false);
assert.equal(release.preview.productionPromotionApproved,false);
assert.equal(contract.editorialFreeze.immutableCommit,
 'c5383df1ebda7a0e5f05d9f59048a136dc99dac5');
assert.equal(contract.currentPreview,
 'https://preview-personalweb.sudip-das-frontend.pages.dev/');
assert.deepEqual(contract.themes.map(t=>t.id),ids);
assert.match(html,/name="robots"\s+content="noindex,nofollow,noarchive"/);
assert.match(html,/<script>window.PUBLIC_API_BASE="";window.PORTFOLIO_PREVIEW_MODE=true;<\/script>/);
assert.match(html,/type="submit" disabled aria-disabled="true"/);
assert.doesNotMatch(html,/<script[^>]+src="webstudio-visual-port\.js"/);
assert.doesNotMatch(html,/<script[^>]+src="studio-theme-library\.js"/);
assert.match(html,/src="personal-theme-library\.js\?v=1\.2\.2" defer/);
assert.match(html,/href="personal-theme-library\.css\?v=1\.2\.1"/);
assert.ok(html.indexOf('src="personal-theme-library.js?v=1.2.2"') >
 html.indexOf('src="webstudio-parity.js"'), 'Gallery script must execute after visitor parity');
assert.ok(html.includes('id="contact"')&&html.includes('id="theme-select"'));
assert.match(js,/const quick=document\.getElementById\('ws-visitor-quick-panel'\)/);
assert.match(js,/const EXPECTED_SOURCE='c5383df1ebda7a0e5f05d9f59048a136dc99dac5'/);
assert.match(js,/picker\.dispatchEvent\(new Event\('change'/);
assert.match(js,/status\.original=currentTheme\(\)/);
assert.match(js,/status\.items=safeManifest/);
assert.match(js,/const BUNDLED_CONTRACT=Object\.freeze/);
assert.match(js,/status\.items=safeManifest\(BUNDLED_CONTRACT\)/);
assert.doesNotMatch(js,/fetch\s*\(/,'Visitor Theme Library must not require Cloudflare Access cookies or runtime HTTP');
assert.match(js,/const navigation=document\.querySelector\('\.topbar \.nav'\)/);
assert.match(js,/if\(navigation\)navigation\.append\(openButton\)/);
assert.doesNotMatch(js,/quickButton\.parentElement\.insertBefore\(openButton,quickButton\)/);
assert.match(css,/\.topbar \.pv-theme-launch/);
assert.match(css,/\.pv-theme-launch-label/);
assert.match(css,/body\.ws-parity\[data-theme="editorial"\] \.topbar \.pv-theme-launch/);
for(const theme of contract.themes){
 assert.ok(js.includes("id:'"+theme.id+"'"),'Bundled gallery theme missing '+theme.id);
 assert.ok(js.includes("personalLabel:'"+theme.personalLabel+"'"),
  'Theme label differs from canonical contract '+theme.id);
}
assert.match(parity,/const syncAuroraComponent = \(\) =>/);
assert.match(parity,/shouldMount = theme === 'neon-studio'/);
assert.match(parity,/aurora\.remove\(\)/);
for(const denied of [
 'Studio & system','owner-password','profile-json-export','private-info/request',
 'TURNSTILE_SECRET_KEY','Dev Das','Real projects · Six design experiences · No account required'
]){
 assert.ok(!js.includes(denied),'Unsafe demo/owner text in public gallery: '+denied);
}
assert.match(css,/\.pv-theme-overlay\[hidden\]\{display:none!important\}/);
assert.doesNotMatch(css,/(?:^|\})\s*(?:html|body|:root)\s*\{/);
assert.ok(!css.includes('.hero h1')&&!css.includes('.core img'));
let depth=0,quote='',comment=false;
for(let i=0;i<css.length;i++){
 const ch=css[i],next=css[i+1];
 if(comment){if(ch==='*'&&next==='/'){comment=false;i++;}continue;}
 if(quote){if(ch==='\\'){i++;continue;}if(ch===quote)quote='';continue;}
 if(ch==='/'&&next==='*'){comment=true;i++;continue;}
 if(ch==='"'||ch==="'"){quote=ch;continue;}
 if(ch==='{')depth++;if(ch==='}')depth--;
 assert.ok(depth>=0,'Unbalanced theme gallery CSS near '+i);
}
assert.equal(depth,0,'Theme gallery CSS braces unbalanced');
assert.equal(quote,'');
assert.equal(comment,false);
console.log('PASS personal preview source contract: six safe themes, Editorial preserved, Aurora DOM scoped, preview-only access and disabled private form');
