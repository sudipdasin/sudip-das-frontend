/* Portfolio v2.1 structural and privacy regression.
 * These assertions validate actual committed source, not a deployment.
 */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const [html,gallery,css,smart,manifest]=await Promise.all([
 read('index.html'),read('webstudio-portfolio-gallery.js'),
 read('portfolio-showcase-v2.css'),read('personal-smart-navigation-v1.js'),
 read('site-release.json')
]);
const release=JSON.parse(manifest);
assert.equal(release.stage,'preview');
assert.equal(release.preview.productionApiConnected,false);
assert.equal(release.preview.privateRequestsEnabled,false);
assert.match(html,/portfolio-showcase-v2\.css\?v=2\.1\.0/);
assert.match(html,/webstudio-portfolio-gallery\.js\?v=2\.1\.0/);
assert.match(html,/personal-smart-navigation-v1\.js\?v=1\.4\.0/);
assert.match(gallery,/heroActions\.append\(launch\)/);
assert.match(smart,/heroActions\.append\(button\)/);
assert.doesNotMatch(smart,/banner\.insertBefore\(button/);
assert.match(smart,/pv-intro-hero-cta/);
assert.match(css,/\.hero \.actions \.pv-intro-hero-cta/);
assert.match(css,/@media\(max-width:420px\)/);
assert.match(gallery,/feature\.className='portfolio-feature'/);
assert.match(gallery,/featureTitle\.textContent=item\.name/);
assert.match(gallery,/featureSummary\.textContent=item\.description/);
assert.match(gallery,/featureMeta\.textContent=item\.category/);
assert.match(gallery,/featureVisual\.dataset\.project=String\(featured\)/);
assert.match(gallery,/featurePrev\.addEventListener\('click'/);
assert.match(gallery,/featureNext\.addEventListener\('click'/);
assert.match(gallery,/featureOpen\.addEventListener\('click'/);
assert.match(gallery,/show\(featured,featureOpen\)/);
assert.match(gallery,/portfolio-theme-mock/);
assert.match(gallery,/portfolio-theme-active-tag/);
assert.match(gallery,/themeSelect\.dispatchEvent\(new Event\('change'/);
assert.match(gallery,/portfolio-compare-disclosure/);
assert.match(gallery,/compareDisclosure\.append\(compareSummary,compare\)/);
assert.match(css,/\.portfolio-feature-visual\[data-project="3"\]/);
for(const key of ['editorial','terminal','aurora-peak','neon-studio','design-2'])
 assert.ok(css.includes('data-theme-choice="'+key+'"'),'Distinct theme mock missing: '+key);
assert.match(css,/@media\(max-width:1060px\)/);
assert.match(css,/@media\(max-width:740px\)/);
assert.match(css,/@media\(max-width:550px\)/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.doesNotMatch(gallery,/fetch\(|sendBeacon|XMLHttpRequest/);
assert.match(html,/window\.PUBLIC_API_BASE="";window\.PORTFOLIO_PREVIEW_MODE=true/);
assert.match(smart,/video\.controls=true/);
assert.match(smart,/video\.muted=true/);
assert.match(smart,/native\.pause\(\)/);
assert.match(css,/portfolio-feature-controls button:focus-visible/);
let depth=0;for(const x of css){if(x==='{')depth++;if(x==='}')depth--;assert.ok(depth>=0)}
assert.equal(depth,0);
console.log(JSON.stringify({result:'PASS_SOURCE_ONLY',gallery:'public project spotlight and six themed mini previews',
 video:'intro beside Interactive Portfolio',mobile:true,previewIsolation:true},null,2));
