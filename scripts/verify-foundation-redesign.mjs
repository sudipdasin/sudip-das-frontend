/* Preview-only source contract for the Foundation / Experience redesign.
 * Browser geometry and computed colors are checked separately in CircleCI.
 */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=(file)=>readFile(new URL('../'+file,import.meta.url),'utf8');
const [html,css,release]=await Promise.all([
  read('index.html'),read('personal-foundation-v1.css'),read('site-release.json')
]);
const manifest=JSON.parse(release);
assert.equal(manifest.stage,'preview');
assert.equal(manifest.preview.productionApiConnected,false);
assert.equal(manifest.preview.productionPromotionApproved,false);
assert.match(html,/href="personal-foundation-v1\.css\?v=1\.0\.0"/);
assert.match(html,/<section id="experience">/);
const experience=html.split('<section id="experience">')[1]?.split('<details class="private-access')[0];
assert.ok(experience,'Foundation section fragment is missing');
assert.match(experience,/<div class="work-grid">/);
assert.match(experience,/class="work-aside reveal"/);
assert.match(experience,/class="foundation-summary reveal"/);
assert.match(experience,/id="foundation-summary-title"/);
assert.match(experience,/A practical foundation/);
assert.match(experience,/public professional experience highlights/i);
assert.match(experience,/Systems and technology/);
assert.match(experience,/Service and collaboration/);
assert.match(experience,/Independent building/);
assert.match(experience,/Based in India/);
assert.match(experience,/Specific address and career records remain private/);
assert.doesNotMatch(experience,/<h[2-5]>Address<\/h[2-5]>/);
assert.doesNotMatch(experience,/Country — India/);
assert.match(html,/window\.PUBLIC_API_BASE="";window\.PORTFOLIO_PREVIEW_MODE=true;/);
assert.match(html,/id="ws-inline-demo"/);
assert.match(css,/body\.ws-parity #experience \.work-grid \{/);
assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/);
assert.match(css,/position:relative!important;/);
assert.match(css,/top:auto!important;/);
assert.match(css,/body\.ws-parity\[data-theme="editorial"\] #experience \.work-grid > \*/);
assert.match(css,/#fffaf3!important/);
assert.match(css,/#26352e!important/);
assert.match(css,/@media\(max-width:900px\)/);
assert.match(css,/grid-template-columns:minmax\(0,1fr\)/);
assert.doesNotMatch(css,/\.hero\b|\.hero-art\b|\.core\b/);
let depth=0;
for(const ch of css) {
 if(ch==='{')depth++;
 if(ch==='}')depth--;
 assert.ok(depth>=0,'Unexpected CSS closing brace');
}
assert.equal(depth,0,'CSS braces unbalanced');
const lum=hex=>{
 const rgb=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255)
  .map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
 return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;
};
const ratio=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
assert.ok(ratio('#26352e','#fffaf3')>=7,'Editorial foundation headings too low contrast');
assert.ok(ratio('#4f5c54','#fffaf3')>=4.5,'Editorial foundation body too low contrast');
assert.ok(ratio('#704c36','#f3ede2')>=4.5,'Editorial public location kicker too low contrast');
console.log(JSON.stringify({result:'PASS_SOURCE_ONLY',section:'experience',
 theme:'editorial',contrast:{
 heading:ratio('#26352e','#fffaf3').toFixed(2),
 body:ratio('#4f5c54','#fffaf3').toFixed(2),
 location:ratio('#704c36','#f3ede2').toFixed(2)
},privateLocationExposed:false,productionApiConnected:false},null,2));
