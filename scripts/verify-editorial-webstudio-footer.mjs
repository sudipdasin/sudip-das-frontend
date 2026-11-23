/* Credit-free source QA: Editorial contrast and WebStudio preview footer.
 * Does not imply Cloudflare mail bindings, real inbox delivery or Chromium pass.
 */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const [html,contrast,footerCSS,footerJS,api,release]=await Promise.all([
 read('index.html'),read('personal-editorial-contrast.css'),
 read('webstudio-footer.css'),read('webstudio-footer.js'),
 read('functions/api/webstudio-interest.js'),read('site-release.json')
]);
const config=JSON.parse(release);
assert.equal(config.stage,'preview');
assert.equal(config.preview.privateRequestsEnabled,false);
assert.equal(config.preview.productionApiConnected,false);
assert.equal(config.preview.productionPromotionApproved,false);
assert.match(html,/id="capabilities"/);
assert.match(html,/id="ws-powered-heading"/);
assert.match(html,/MADE WITH WEBSTUDIO/);
assert.match(html,/href="https:\/\/sudipdasin\.github\.io\/sudip-das-frontend\/"/);
assert.match(html,/id="ws-interest-toggle"[^>]+aria-expanded="false"/);
assert.match(html,/id="ws-interest-expander"[^>]+data-open="false"/);
assert.match(html,/id="ws-interest-email" type="email" name="email" required/);
assert.match(html,/id="ws-interest-status"[^>]+role="status"/);
assert.match(html,/type="submit" disabled aria-disabled="true"/);
assert.match(html,/window\.PUBLIC_API_BASE="";window\.PORTFOLIO_PREVIEW_MODE=true/);
assert.match(html,/webstudio-footer\.js\?v=1\.0\.0/);
assert.match(html,/webstudio-footer\.css\?v=1\.0\.0/);
assert.match(html,/personal-editorial-contrast\.css\?v=1\.0\.0/);
assert.match(contrast,/body\.ws-parity\[data-theme="editorial"\] section\.capabilities/);
assert.match(contrast,/background:linear-gradient\(155deg,#f7f2e9/);
assert.match(contrast,/\.capabilities \.cap\.reveal/);
assert.doesNotMatch(contrast,/body\.ws-parity\[data-theme="(orbit|terminal|neon-studio|design-2|aurora-peak)"\]/);
assert.doesNotMatch(contrast,/\.hero-art|\.core\s*\{/);
function rgb(hex){return [1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255)}
function lum(hex){const a=rgb(hex).map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);return .2126*a[0]+.7152*a[1]+.0722*a[2]}
function ratio(a,b){const v=[lum(a),lum(b)].sort((x,y)=>y-x);return (v[0]+.05)/(v[1]+.05)}
// WCAG text-background checks for actual CSS constants, including opaque cards.
assert.ok(ratio('#23352c','#f7f2e9')>=7,'Editorial heading contrast on warm paper too low');
assert.ok(ratio('#48584f','#ebe2d5')>=4.5,'Editorial body text contrast too low');
assert.ok(ratio('#25342d','#fffaf3')>=7,'Editorial card title contrast too low');
assert.match(footerCSS,/body\.ws-parity\[data-theme="editorial"\] \.ws-powered-band/);
assert.match(footerCSS,/prefers-reduced-motion:reduce/);
assert.match(footerCSS,/grid-template-rows:0fr/);
assert.match(footerCSS,/grid-template-rows:1fr/);
assert.match(footerJS,/setStatus\('Opening your email application\. The message is not sent until you choose Send there\.'/);
assert.match(footerJS,/window\.location\.href=mailtoLink\(email\)/);
assert.match(footerJS,/const serverEnabled=configuration\?\.content==='enabled'/);
assert.doesNotMatch(html,/name="webstudio-interest-backend" content="enabled"/);
assert.match(api,/WEBSTUDIO_INTEREST_ENABLED==='true'/);
assert.match(api,/WEBSTUDIO_INTEREST_APPROVED_HOST===PREVIEW_HOST/);
assert.match(api,/env\.INTEREST_DB\?\.prepare/);
assert.match(api,/verifyTurnstile/);
assert.match(api,/result\.hostname===PREVIEW_HOST/);
assert.match(api,/result\.action==='webstudio-interest'/);
assert.match(api,/ON CONFLICT\(subject_hash,bucket\) DO UPDATE SET count=count\+1 WHERE count < \?/);
assert.match(api,/await sendMail\(env,email\)/);
assert.match(api,/return respond\(\{ok:true,status:'delivered'\},202\)/);
assert.doesNotMatch(api,/MAIL_BRIDGE_SECRET\s*=/);
assert.doesNotMatch(api,/OWNER_EMAIL\s*=\s*['"]/);
for(const [name,stylesheet] of [['contrast',contrast],['footer',footerCSS]]){
 let braces=0;for(const ch of stylesheet){if(ch==='{')braces++;if(ch==='}')braces--;assert.ok(braces>=0,name+' extra closing brace')}
 assert.equal(braces,0,name+' unbalanced CSS');
}
console.log(JSON.stringify({result:'PASS_SOURCE_ONLY',contrast:{
 headings:ratio('#23352c','#f7f2e9').toFixed(2),
 body:ratio('#48584f','#ebe2d5').toFixed(2),
 cards:ratio('#25342d','#fffaf3').toFixed(2)
},webstudioFooter:'present',previewBackend:'disabled',automaticEmail:'pending Cloudflare bindings'},null,2));
