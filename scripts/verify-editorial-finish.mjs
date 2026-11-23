/* v1.8.0 — screenshot regression for Editorial cards / secured request UI.
 * This file is a source-and-contrast contract; browser geometry is separate.
 * No request or Turnstile token should be sent during tests.
 */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const [html,css,manifest]=await Promise.all([
 read('index.html'),read('personal-editorial-finish-v1.css'),
 read('site-release.json')
]);
const release=JSON.parse(manifest);
assert.equal(release.stage,'preview');
assert.equal(release.preview.privateRequestsEnabled,false);
assert.equal(release.preview.productionApiConnected,false);
assert.equal(release.preview.productionPromotionApproved,false);
assert.match(html,/personal-editorial-finish-v1\.css\?v=1\.0\.0/);
const tagline='Good technology is more than a feature list. It should make work clearer, smoother, and more dependable.';
assert.ok(html.includes(tagline),'Owner-approved text must remain intact');
assert.match(css,/:is\(#about,#projects,#experience\) > \.wrap > \.section-head > p/);
assert.match(css,/border-inline-start-width:3px/);
assert.match(css,/font:400 clamp\(\.97rem,1\.05vw,1\.08rem\)\/1\.76 Arial,sans-serif!important/);
assert.match(css,/#fffcf6/);
assert.match(css,/body\.ws-parity \.capabilities \.cap\{/);
assert.match(css,/grid-template-columns:repeat\(4,minmax\(0,1fr\)\)/);
assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css,/grid-template-columns:minmax\(0,1fr\)/);
assert.match(css,/body\.ws-parity \.capabilities \.cap::before\{/);
assert.match(css,/body\.ws-parity\[data-theme="editorial"\] \.capabilities \.cap/);
assert.match(css,/background:#fffaf3!important/);
assert.match(css,/background-image:linear-gradient\(145deg,#ffffff66,#f2e8da66\)!important/);
assert.match(css,/#26372d/);
assert.match(css,/\.capabilities \.cap h3\{/);
const capSection=html.split('<section class="capabilities" id="capabilities">')[1]?.split('</section>')[0];
assert.ok(capSection&&((capSection.match(/<article class="cap reveal">/g)||[]).length===4),
 'Four public Strengths cards must remain intact');
assert.match(capSection,/Keep learning by making/);
assert.match(capSection,/Independent software projects, open-source collaboration, Linux workflows, and creative tools/);
assert.match(html,/class="request-preview" aria-live="polite"/);
assert.match(html,/class="request-orb" aria-hidden="true"/);
assert.match(css,/\.private-access \.request-orb::before\{\s*content:"✦"/);
assert.match(css,/\.private-access \.request-orb\{[\s\S]*?animation:none!important/);
assert.match(css,/grid-template-columns:52px minmax\(0,1fr\)/);
assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css,/@media\(max-width:900px\)/);
assert.match(css,/body\.ws-parity \.private-access \.request-grid input:focus-visible/);
assert.match(html,/<div class="captcha-widget-frame"><div class="cf-turnstile"[^>]*data-theme="light" data-size="flexible"/);
assert.match(html,/A successful security check does not enable private requests while this preview is offline/);
assert.match(html,/class="button primary request-submit" type="submit" disabled aria-disabled="true" aria-describedby="request-status"/);
assert.match(css,/\.request-submit:disabled/);
assert.match(css,/cursor:not-allowed!important/);
assert.match(css,/opacity:1!important/);
assert.match(css,/body\.ws-parity\[data-theme="editorial"\] \.private-access \.captcha-slot\{\s*padding:clamp/);
assert.match(html,/id="request-status" role="status" aria-live="polite">Private detail requests are temporarily offline/);
assert.match(html,/window\.PUBLIC_API_BASE="";window\.PORTFOLIO_PREVIEW_MODE=true/);
assert.match(html,/id="ws-inline-demo"[^>]+data-open="false"/);
let balance=0;
for(const ch of css){if(ch==='{')balance++;if(ch==='}')balance--;assert.ok(balance>=0,'Extra CSS closing brace')}
assert.equal(balance,0,'Unbalanced CSS');
const luminance=hex=>{
 const channels=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255)
   .map(x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4));
 return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
};
const ratio=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/
 (Math.min(luminance(a),luminance(b))+.05);
assert.ok(ratio('#37483e','#fffcf6')>=7,'Editorial quote text must meet enhanced contrast');
assert.ok(ratio('#26372d','#fffdf8')>=7,'Editorial card headings must meet enhanced contrast');
assert.ok(ratio('#4a5a50','#f8f1e6')>=4.5,'Editorial card copy must pass body-text contrast');
assert.ok(ratio('#61584d','#e9e1d5')>=4.5,'Disabled action text must still be readable');
console.log(JSON.stringify({
 result:'PASS_SOURCE_ONLY',
 sections:['About quote','four Strengths cards','request preview','field grid','Turnstile frame','disabled action'],
 editorialQuote:ratio('#37483e','#fffcf6').toFixed(2),
 editorialHeading:ratio('#26372d','#fffdf8').toFixed(2),
 disabledAction:ratio('#61584d','#e9e1d5').toFixed(2),
 automaticRequestDelivery:false
},null,2));
