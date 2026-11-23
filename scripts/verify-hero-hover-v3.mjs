import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const load=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const [html,js,css,render,captions,manifest]=await Promise.all([
 load('index.html'),load('personal-smart-navigation-v1.js'),
 load('portfolio-intro-hover-v3.css'),load('scripts/render-portfolio-film-v3.py'),
 load('media/sudip-das-professional-introduction.en.vtt'),load('site-release.json')
]);
const release=JSON.parse(manifest);
assert.equal(release.stage,'preview');
assert.equal(release.preview.productionApiConnected,false);
assert.equal(release.preview.privateRequestsEnabled,false);
assert.equal(release.preview.productionPromotionApproved,false);
assert.match(html,/portfolio-intro-hover-v3\.css\?v=3\.0\.1/);
assert.match(html,/personal-smart-navigation-v1\.js\?v=1\.4\.0/);
assert.match(js,/60 sec · Cinematic introduction/);
assert.match(js,/preview\.className='pv-intro-hover-preview'/);
assert.match(js,/previewClip\.preload='none'/);
assert.match(js,/previewClip\.muted=true/);
assert.match(js,/previewClip\.loop=true/);
assert.match(js,/const hoverSource='media\/sudip-das-intro-hover-preview\.webm'/);
assert.match(js,/button\.addEventListener\('pointerenter'/);
assert.match(js,/button\.addEventListener\('pointerleave',closePreview\)/);
assert.match(js,/button\.addEventListener\('focus',openPreview\)/);
assert.match(js,/button\.addEventListener\('blur',closePreview\)/);
assert.match(js,/if\(previewActive\|\|suppressPreviewFocus\|\|motionReduced\.matches\|\|!modal\.hidden\)return/);
assert.match(js,/previewClip\.removeAttribute\('src'\)/);
assert.match(js,/heroActions\.append\(preview\)/);
assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)!important/);
assert.match(css,/> a:first-child \{order:1/);
assert.match(css,/\.portfolio-gallery-hero-launch \{order:2/);
assert.match(css,/> a\[href\^="https:\/\/github\.com\/sudipdasin"\] \{order:3/);
assert.match(css,/> #pv-intro-launch \{order:4/);
assert.match(css,/\.pv-intro-hover-preview\[data-active="true"\]/);
assert.match(css,/@media\(max-width:520px\)/);
assert.match(css,/@media\(hover:none\), \(pointer:coarse\)/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.match(css,/pointer-events:none/);
assert.match(render,/SPLITS=\[\(0,10\),\(10,20\),\(20,30\.4\),\(30\.4,39\.8\),\(39\.8,44\)\]/);
assert.match(render,/GENERATING 6-second hover teaser/);
assert.match(render,/Original visual|ORIGINAL VISUALS|ORIGINAL SOUND/);
assert.match(render,/def soundtrack\(base,out\)/);
assert.match(render,/480:270/);
assert.match(captions,/00:00:55\.800 --> 00:01:00\.000/);
assert.equal((captions.match(/\d\d:\d\d:\d\d\.\d\d\d --> /g)||[]).length,13);
assert.match(html,/window\.PUBLIC_API_BASE="";window\.PORTFOLIO_PREVIEW_MODE=true/);
let n=0;for(const a of css){if(a==='{')n++;if(a==='}')n--;assert.ok(n>=0)}
assert.equal(n,0,'CSS braces must balance');
console.log(JSON.stringify({result:'PASS_SOURCE_ONLY',hero:'balanced 2x2',
 teaser:'hover/focus only, lazy, muted and reduced-motion safe',film:'60 seconds, 13 caption chapters',stage:'preview'},null,2));
