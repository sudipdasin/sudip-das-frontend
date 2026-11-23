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
  const actionLayout=await page.evaluate(()=>{
    const actions=document.querySelector('.hero .actions');
    const items={
      work:actions.querySelector('a.button.primary'),
      portfolio:actions.querySelector('.portfolio-gallery-hero-launch'),
      github:actions.querySelector('a[href^="https://github.com/sudipdasin"]'),
      story:actions.querySelector('#pv-intro-launch')
    };
    const box=el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right}};
    return {display:getComputedStyle(actions).display,boxes:Object.fromEntries(
      Object.entries(items).map(([name,el])=>[name,box(el)]))};
  });
  assert.equal(actionLayout.display,'grid','Hero actions should use an intentional grid');
  const grid=actionLayout.boxes;
  assert.ok(Math.abs(grid.work.y-grid.portfolio.y)<2,'First row should align Work and Interactive Portfolio');
  assert.ok(Math.abs(grid.github.y-grid.story.y)<2,'Second row should align GitHub and Watch my story');
  assert.ok(Math.abs(grid.work.width-grid.story.width)<3,'Hero tiles must use balanced widths');
  for(const [key,b] of Object.entries(grid)){
    assert.ok(b.width>=100&&b.height>=48,key+' CTA too small: '+JSON.stringify(b));
    assert.ok(b.x>=-2&&b.right<=width+2,key+' CTA crosses viewport: '+JSON.stringify(b));
  }
  assert.equal(await page.locator('#pv-intro-hover-preview').count(),1,'Decorative live teaser must exist');
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
    return v&&v.readyState>=1&&v.duration>59&&v.duration<61;
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
  if(width>1000){
    // Validate a real low-bandwidth six-second hover stream, not merely CSS.
    await page.evaluate(()=>document.activeElement?.blur());
    await page.emulateMedia({reducedMotion:'no-preference'});
    await page.locator('#pv-intro-launch').hover();
    await page.waitForFunction(()=>{
      const teaser=document.querySelector('#pv-intro-hover-preview');
      return teaser?.dataset.active==='true';
    },null,{timeout:5000});
    await page.waitForFunction(()=>{
      const v=document.querySelector('.pv-intro-hover-video');
      return v&&v.readyState>=1&&v.duration>5.5&&v.duration<6.5;
    },null,{timeout:12000});
    const teaser=await page.locator('.pv-intro-hover-video').evaluate(v=>({
      muted:v.muted,loop:v.loop,duration:v.duration,source:v.currentSrc,
      preload:v.preload
    }));
    assert.equal(teaser.muted,true,'Teaser must never play with sound');
    assert.equal(teaser.loop,true,'Teaser must loop while actively hovered');
    assert.equal(teaser.preload,'none','No background loading when idle');
    assert.ok(teaser.source.endsWith('sudip-das-intro-hover-preview.webm'));
    await page.mouse.move(4,4);
    await page.waitForFunction(()=>{
      const el=document.querySelector('#pv-intro-hover-preview');
      const v=el?.querySelector('video');
      return el?.dataset.active==='false'&&v&&!v.hasAttribute('src')&&v.paused;
    },null,{timeout:5000});
    await page.emulateMedia({reducedMotion:'reduce'});
    await page.locator('#pv-intro-launch').hover();
    assert.notEqual(await page.locator('#pv-intro-hover-preview').getAttribute('data-active'),'true',
      'Reduced-motion visitors must not autoplay hover imagery');
  }
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
