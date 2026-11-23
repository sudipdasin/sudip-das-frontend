/* Browser-level v2.1 verification: actual public HTML/CSS/JS in Chromium.
 * npm install --no-save --no-package-lock playwright-core@1.57.0
 * python -m http.server 8765 --bind 127.0.0.1 &
 * node scripts/verify-portfolio-showcase-browser.mjs
 */
import assert from 'node:assert/strict';
import {chromium} from 'playwright-core';
const binary=process.env.CHROME_PATH || '/usr/bin/google-chrome';
const browser=await chromium.launch({headless:true,executablePath:binary,
 args:['--no-sandbox','--disable-dev-shm-usage']});
const snapshots=[];
try{
 for(const [width,height] of [[1440,900],[390,844]]){
  const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:25000});
  await page.locator('#pv-intro-launch').waitFor({state:'attached',timeout:12000});
  await page.locator('#profile-showcase').waitFor({state:'attached',timeout:12000});
  await page.locator('#portfolio-feature-title').waitFor({state:'attached',timeout:12000});
  const before=await page.evaluate(()=>{
   const hero=document.querySelector('.hero .actions');
   const items=[...hero.children].map(n=>n.textContent.trim());
   const gallery=document.querySelector('#profile-showcase');
   const comparison=gallery.querySelector('.portfolio-compare-disclosure');
   const cards=[...gallery.querySelectorAll('.portfolio-theme-choice')];
   const intro=document.querySelector('#pv-intro-launch');
   const launch=document.querySelector('.portfolio-gallery-hero-launch');
   const bounds=el=>{let b=el.getBoundingClientRect();return {left:b.left,right:b.right,top:b.top,bottom:b.bottom,width:b.width}};
   return {
    heroChildren:items,hero:bounds(hero),intro:bounds(intro),galleryLaunch:bounds(launch),
    heroParent:intro.parentElement===hero,
    introAfterGallery:items.indexOf(intro.textContent.trim())>items.indexOf(launch.textContent.trim()),
    showcase:bounds(gallery),cards:cards.length,
    distinctPreviews:cards.map(el=>getComputedStyle(el.querySelector('.portfolio-theme-swatch')).backgroundImage),
    collapsed:!comparison.open,
    featuredTitle:gallery.querySelector('#portfolio-feature-title').textContent.trim(),
    pageScroll:document.documentElement.scrollWidth,
    pageClient:document.documentElement.clientWidth
   };
  });
  assert.equal(before.heroParent,true,'Intro must be in the hero action row');
  assert.equal(before.introAfterGallery,true,'Intro must appear after Interactive Portfolio');
  assert.equal(before.cards,6,'Exactly six approved themes are available');
  assert.ok(new Set(before.distinctPreviews).size>=4,'Theme previews must be visually differentiated');
  assert.ok(before.featuredTitle.length>0,'A real project must be featured');
  assert.equal(before.collapsed,true,'Comparison workspace starts compact');
  assert.ok(before.intro.width>=120,'Intro CTA must have a legible hit area');
  assert.ok(before.intro.right<=width+2&&before.intro.left>=-2,
    'Intro CTA escapes viewport: '+JSON.stringify(before));
  assert.ok(before.pageScroll<=before.pageClient+3,
    'Horizontal overflow after gallery reflow: '+JSON.stringify(before));
  const first=await page.locator('#portfolio-feature-title').textContent();
  await page.locator('.portfolio-feature-arrow[aria-label="Next public project"]').click();
  const second=await page.locator('#portfolio-feature-title').textContent();
  assert.notEqual(first,second,'Featured project next must advance');
  await page.locator('#profile-showcase summary').filter({hasText:'Compare two public projects'}).click();
  assert.equal(await page.locator('#profile-showcase .portfolio-compare-disclosure').getAttribute('open'),'',
    'Comparison workspace should expand');
  await page.locator('[data-theme-choice="editorial"]').click();
  assert.equal(await page.locator('#theme-select').inputValue(),'editorial');
  assert.equal(await page.locator('[data-theme-choice="editorial"]').getAttribute('aria-pressed'),'true');
  await page.locator('#pv-intro-launch').click();
  await page.locator('#pv-intro-modal').waitFor({state:'visible'});
  assert.equal(await page.locator('#pv-intro-native').count(),1,
    'First-party introduction video element should be present');
  assert.equal(await page.locator('#pv-intro-native').evaluate(v=>v.controls),true);
  await page.waitForFunction(()=>{
    const v=document.querySelector('#pv-intro-native');
    return v&&v.readyState>=1&&v.duration>43&&v.duration<45;
  },null,{timeout:12000});
  const media=await page.locator('#pv-intro-native').evaluate(v=>({
    duration:v.duration,source:v.currentSrc,muted:v.muted,
    captions:v.querySelector('track[kind="captions"]')?.getAttribute('src')
  }));
  assert.ok(media.source.endsWith('sudip-das-professional-introduction-720p.mp4'),
    'Popup must play the first-party MP4');
  assert.equal(media.muted,true,'Autoplay must start muted');
  assert.equal(media.captions,'media/sudip-das-professional-introduction.en.vtt');
  await page.waitForFunction(()=>{
    const v=document.querySelector('#pv-intro-native');
    return v&&(!v.paused||v.currentTime>.05);
  },null,{timeout:10000});
  await page.locator('#pv-intro-close').click();
  assert.equal(await page.locator('#pv-intro-modal').isVisible(),false);
  assert.equal(await page.locator('#pv-intro-native').count(),0,
    'Video must be detached after closing to stop sound');
  assert.equal(await page.evaluate(()=>document.activeElement.id),'pv-intro-launch');
  // The Cloudflare sitekey intentionally does not authorize 127.0.0.1.
  // Ignore only that provider's known localhost-hostname mismatch (110200).
  // Preserve all other application and provider script errors as test failures.
  const unexpectedErrors=errors.filter(message=>
    !/^\[Cloudflare Turnstile\] Error: 110200\.?$/.test(message));
  assert.deepEqual(unexpectedErrors,[],'Unexpected browser runtime errors: '+unexpectedErrors.join('; '));
  snapshots.push({width,height,theme:'Editorial',hero:before.heroChildren,
   cards:before.cards,previews:new Set(before.distinctPreviews).size,
   startFeatured:before.featuredTitle,afterFeatured:second});
  await page.close();
 }
 console.log('PASS_BROWSER',JSON.stringify(snapshots,null,2));
}finally{
 await browser.close();
}
