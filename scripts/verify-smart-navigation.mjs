/* Source-only v1.9 visitor preview regression: floating guide + safe video.
 * No real YouTube stream, privileged mutation or production API is exercised.
 */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
const [html,css,script,parity,manifest]=await Promise.all([
 read('index.html'),read('personal-smart-navigation-v1.css'),
 read('personal-smart-navigation-v1.js'),read('webstudio-parity.js'),
 read('site-release.json')
]);
const release=JSON.parse(manifest);
assert.equal(release.stage,'preview');
assert.equal(release.preview.productionApiConnected,false);
assert.equal(release.preview.privateRequestsEnabled,false);
assert.equal(release.preview.productionPromotionApproved,false);
assert.match(html,/personal-smart-navigation-v1\.css\?v=1\.1\.0/);
assert.match(html,/personal-smart-navigation-v1\.js\?v=1\.1\.0/);
assert.match(html,/<meta name="portfolio-intro-youtube-url" content="">/);
assert.match(html,/id="pv-intro-modal" role="dialog" aria-modal="true"[^>]*hidden inert/);
assert.match(html,/id="pv-intro-close" aria-label="Close intro video"/);
assert.match(html,/Intro video is not published here yet/);
assert.doesNotMatch(html,/src="https:\/\/www\.youtube.*embed/);
assert.match(script,/banner\.insertBefore\(button,banner\.querySelector\('\.ws-utility-right'\)\)/);
assert.match(script,/button\.id='pv-intro-launch'/);
assert.match(script,/aria-haspopup','dialog/);
assert.match(script,/function parseVideoId\(raw\)/);
assert.match(script,/url\.protocol!=='https:'/);
assert.match(script,/\['youtube\.com','www\.youtube\.com','m\.youtube\.com','www\.youtube-nocookie\.com'\]/);
assert.match(script,/\^\[a-zA-Z0-9_-\]\{11\}\$/);
assert.match(script,/www\.youtube-nocookie\.com\/embed/);
assert.match(script,/autoplay=1&mute=1&playsinline=1&controls=1&rel=0/);
assert.match(script,/byId\('pv-intro-frame'\)\?\.remove\(\)/);
assert.match(script,/event\.key==='Escape'/);
assert.match(script,/event\.key==='Tab'/);
assert.match(script,/previousFocus\?\.isConnected/);
assert.match(script,/document\.body\.append\(quick\)/);
assert.match(script,/quick\.classList\.add\('pv-smart-float'\)/);
assert.match(script,/getCurrent=\(\)=>/);
assert.match(script,/window\.addEventListener\('scroll',schedule,\{passive:true\}\)/);
assert.match(script,/requestAnimationFrame\(\(\)=>/);
assert.match(script,/quickButton\.setAttribute\('aria-label','Quick actions\. Suggested: '/);
assert.doesNotMatch(script,/fetch\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|document\.cookie/i);
assert.doesNotMatch(script,/site[-_]?settings|upload|export|publish|admin|ownerEditEnabled/i);
assert.match(parity,/ws-visitor-quick-open/);
assert.match(css,/body\.ws-parity > \.pv-smart-float\{/);
assert.match(css,/body\.ws-parity \.topbar \.nav > \.pv-theme-launch \{/);
assert.match(css,/body\.ws-parity > \.pv-smart-float \.ws-visitor-quick-toggle \{/);
assert.match(css,/width:58px!important/);
assert.match(css,/height:58px!important/);
assert.match(css,/border-radius:50%!important/);
assert.match(css,/backdrop-filter:blur\(20px\) saturate\(175%\)/);
assert.match(css,/background:conic-gradient/);
assert.match(css,/@keyframes pv-orb-rim/);
assert.match(css,/\.pv-smart-copy \{/);
assert.match(css,/clip-path:inset\(50%\)!important/);
assert.match(css,/\.ws-visitor-quick-panel \{[\s\S]*?backdrop-filter:blur\(26px\)/);
assert.match(css,/width:52px!important/);
assert.match(css,/prefers-reduced-motion:reduce/);
assert.match(css,/position:fixed!important/);
assert.match(css,/bottom:max\(18px,env\(safe-area-inset-bottom\)\)!important/);
assert.match(css,/body\.ws-parity\[data-theme="editorial"\]/);
assert.match(css,/\.pv-intro-modal\[hidden\]\{display:none!important\}/);
assert.match(css,/\.pv-intro-screen\{/);
assert.match(css,/aspect-ratio:16\/9/);
assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
assert.match(css,/#experience \.work-grid/);
assert.match(html,/window\.PUBLIC_API_BASE="";window\.PORTFOLIO_PREVIEW_MODE=true/);
let braces=0;for(const char of css){
 if(char==='{')braces++;if(char==='}')braces--;
 assert.ok(braces>=0,'Extra closing brace in CSS');
}
assert.equal(braces,0,'CSS brace mismatch');
console.log(JSON.stringify({result:'PASS_SOURCE_ONLY',floatingQuick:true,
 contextualSuggestions:true, introDialog:true,autoplayOnApprovedVideo:true,
 videoConfigured:false,previewIsolated:true},null,2));
