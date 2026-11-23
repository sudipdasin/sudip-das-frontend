/* Preview v1.7 source regression: exact owner copy and theme-aware layout.
 * Browser geometry is validated in CircleCI; this suite is source-only.
 */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const [html,css,lang,release]=await Promise.all([
 read('index.html'),read('personal-layout-flow-v1.css'),
 read('languages.js'),read('site-release.json')
]);
const m=JSON.parse(release);
assert.equal(m.stage,'preview');
assert.equal(m.preview.privateRequestsEnabled,false);
assert.equal(m.preview.productionApiConnected,false);
assert.equal(m.preview.productionPromotionApproved,false);
assert.match(html,/window\.PUBLIC_API_BASE="";window\.PORTFOLIO_PREVIEW_MODE=true/);
assert.match(html,/personal-layout-flow-v1\.css\?v=1\.0\.0/);
const phrases=[
 'Good technology is more than a feature list. It should make work clearer, smoother, and more dependable.',
 'Open-source work shaped by a simple belief: powerful tools should feel approachable and give people room to make them better.',
 'Years of practical work across enterprise IT, CRM, service delivery, and independent projects inform how I build today.'
];
for(const [i,id] of ['about','projects','experience'].entries()){
 const part=html.split('<section'+(id==='projects'?' class="projects" id="projects"':` id="${id}"`) +'>')[1]?.split('</section>')[0];
 assert.ok(part,`Section ${id} does not exist`);
 assert.ok(part.includes(phrases[i]),`Exact supplied paragraph missing from ${id}`);
 assert.match(part,/<div class="section-head reveal">/);
 assert.match(part,/<h2>/);
}
assert.match(css,/body\.ws-parity :is\(#about,#projects,#experience\) > \.wrap > \.section-head \{/);
assert.match(css,/grid-template-columns:minmax\(0,1fr\) minmax\(0,clamp\(260px,31vw,400px\)\)/);
assert.match(css,/min-width:0/);
assert.match(css,/overflow-wrap:anywhere/);
assert.match(css,/text-wrap:pretty/);
assert.match(css,/@media\(max-width:980px\)/);
assert.match(css,/@media\(max-width:600px\)/);
assert.match(css,/\[data-theme="editorial"\]/);
assert.match(css,/border-inline-start-color:#176d50/);
const ticker=html.split('<div class="ticker" role="region"')[1]?.split('<section id="about">')[0];
assert.ok(ticker,'Ticker region missing');
assert.match(ticker,/class="ticker-screenreader"/);
assert.match(ticker,/class="ticker-window" aria-hidden="true"/);
assert.match(ticker,/class="ticker-in"/);
const groups=[...ticker.matchAll(/<div class="ticker-group">([\s\S]*?)<\/div>/g)].map(x=>x[1]);
assert.equal(groups.length,2,'Marquee must contain exactly two repeated groups');
assert.equal(groups[0],groups[1],'Marquee copies differ and will jump at repeat boundary');
assert.equal((groups[0].match(/<span>/g)||[]).length,6,'Expected six public experience terms per group');
assert.match(css,/animation:ws-marquee-seamless 42s linear infinite/);
assert.match(css,/@keyframes ws-marquee-seamless/);
assert.match(css,/translate3d\(-50%,0,0\)/);
assert.match(css,/padding:14px var\(--ticker-gap\) 14px 0/);
assert.match(css,/width:min\(var\(--max,1160px\),calc\(100% - 48px\)\)/);
assert.match(css,/prefers-reduced-motion:reduce/);
assert.match(css,/data-ws-motion="off"/);
assert.match(css,/\.ticker-group:last-child/);
assert.match(lang,/const ticker=\$\('\.ticker-group > span'\)/);
assert.match(lang,/tickerDescription\.textContent=data\.ticker\.join\(' · '\)/);
assert.doesNotMatch(lang,/\$\('\.ticker-in > span'\)/);
assert.match(html,/id="ws-inline-demo"[^>]*data-open="false"/);
assert.doesNotMatch(html,/href="https:\/\/sudipdasin\.github\.io\/sudip-das-frontend\/"/);
let depth=0;
for(const ch of css){
 if(ch==='{')depth++;
 if(ch==='}')depth--;
 assert.ok(depth>=0,'Stray closing brace in layout stylesheet');
}
assert.equal(depth,0,'Unbalanced layout stylesheet braces');
const luminance=hex=>{
 const a=[1,3,5].map(i=>parseInt(hex.slice(i,i+2),16)/255)
  .map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
 return .2126*a[0]+.7152*a[1]+.0722*a[2];
};
const contrast=(a,b)=>(Math.max(luminance(a),luminance(b))+.05)/
 (Math.min(luminance(a),luminance(b))+.05);
assert.ok(contrast('#3b4b41','#fffbf5')>=7,
 'Editorial paragraph panel text insufficient contrast');
assert.ok(contrast('#33483e','#eee7dc')>=7,
 'Editorial marquee text insufficient contrast');
console.log(JSON.stringify({
 result:'PASS_SOURCE_ONLY',
 copy:'3/3 exact',
 ticker:'2×6 identical, translated, bounded and reduced-motion safe',
 editorialParagraphContrast:contrast('#3b4b41','#fffbf5').toFixed(2),
 editorialTickerContrast:contrast('#33483e','#eee7dc').toFixed(2),
 previewIsolation:true
},null,2));
