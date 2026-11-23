/* Neon Studio ONLY — source/reference UI regression.
   Input: owner's 1892x957 annotated preview and canonical WebStudio Design 1.
   Captures actual screenshots for manual pixel-level review.
 */
import assert from 'node:assert/strict';
import {mkdir} from 'node:fs/promises';
import {chromium} from 'playwright-core';
const browser=await chromium.launch({
  headless:true,executablePath:process.env.CHROME_PATH||'/usr/bin/google-chrome',
  args:['--no-sandbox','--disable-dev-shm-usage']
});
await mkdir('test-artifacts',{recursive:true});
const results=[];
try{
  for(const [width,height] of [[1892,957],[1440,900],[820,900],[390,844]]){
    const page=await browser.newPage({viewport:{width,height},reducedMotion:'reduce'});
    const errors=[];page.on('pageerror',error=>errors.push(error.message));
    await page.goto('http://127.0.0.1:8765/',{waitUntil:'domcontentloaded',timeout:25000});
    await page.locator('#theme-select').waitFor({state:'attached'});
    await page.evaluate(()=>{
      const select=document.querySelector('#theme-select');
      select.value='neon-studio';select.dispatchEvent(new Event('change',{bubbles:true}));
    });
    await page.waitForFunction(()=>document.body.dataset.theme==='neon-studio'&&
      document.querySelectorAll('.hero-art .ws-orbit-chip').length===5&&
      document.querySelectorAll('#ws-aurora-reference .ws-aurora-feature').length===6,
      null,{timeout:10000});
    const cssDiag=await page.evaluate(()=>{
      const art=document.querySelector('main>.hero .hero-art');
      const outer=art.querySelector('.orbit');
      const core=art.querySelector('.core');
      const css=document.querySelector('link[href^="neon-studio-reference-lock-v1.css"]');
      const sheet=css?.sheet;
      return {
        theme:document.body.dataset.theme,
        bodyClass:document.body.className,
        link:css?.href,cssLoaded:Boolean(sheet),
        rules:sheet?.cssRules?.length,
        selectorMatch:art.matches('body.ws-parity[data-theme="neon-studio"] main>.hero .hero-art'),
        artMinHeight:getComputedStyle(art).minHeight,
        artMaxWidth:getComputedStyle(art).maxWidth,
        artCustom:getComputedStyle(art).getPropertyValue('--wf-orbit-size'),
        bodyRing:getComputedStyle(document.body).getPropertyValue('--neon-ring-size'),
        outerSize:getComputedStyle(outer).width,
        outerTranslate:getComputedStyle(outer).translate,
        outerMargin:getComputedStyle(outer).margin,
        outerTransform:getComputedStyle(outer).transform,
        coreSize:getComputedStyle(core).width,
        coreComputed:{transform:getComputedStyle(core).transform,scale:getComputedStyle(core).scale,
          width:getComputedStyle(core).width,minWidth:getComputedStyle(core).minWidth,
          maxWidth:getComputedStyle(core).maxWidth,offsetWidth:core.offsetWidth,
          inlineWidth:core.style.getPropertyValue('width'),
          inlineTransform:core.style.getPropertyValue('transform'),
          inlineScale:core.style.getPropertyValue('scale'),
          zoom:getComputedStyle(core).zoom},
        supportsTranslate:CSS.supports('translate','-50% -50%'),
        matchingRules:[...document.styleSheets].flatMap(sheet=>{
          let rules=[];try{rules=[...sheet.cssRules]}catch{}
          return rules.filter(x=>x.selectorText&&
              (x.selectorText.includes('hero-art')||x.selectorText.includes('.orbit'))&&
              (x.style?.getPropertyValue('min-height')||
               x.style?.getPropertyValue('translate')||
               x.style?.getPropertyValue('width')))
           .filter(x=>{try{return art.matches(x.selectorText)||outer.matches(x.selectorText)}catch{return false}})
           .map(x=>({
             file:sheet.href?.split('/').at(-1)||'inline',selector:x.selectorText.slice(0,90),
             width:x.style.getPropertyValue('width'),
             minHeight:x.style.getPropertyValue('min-height'),
             translate:x.style.getPropertyValue('translate'),
             priority:x.style.getPropertyPriority('min-height')||
               x.style.getPropertyPriority('translate')||x.style.getPropertyPriority('width')
           }))
        }).slice(-24)
      };
    });
    console.log('NEON_CSS_DIAGNOSTIC',JSON.stringify(cssDiag));
    const report=await page.evaluate(()=>{
      const selector=query=>document.querySelector(query);
      const rect=el=>{const r=el.getBoundingClientRect();return {
        x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom,
        cx:r.x+r.width/2,cy:r.y+r.height/2
      }};
      const art=selector('.hero-art'),core=selector('.hero-art .ws-neon-precision-portrait'),
        outer=selector('.hero-art .ws-neon-precise-outer'),inner=selector('.hero-art .ws-neon-precise-inner'),
        caption=selector('.hero-art .portrait-caption');
      const labels=[...document.querySelectorAll('.hero-art .ws-orbit-chip')];
      const features=[...document.querySelectorAll('#ws-aurora-reference .ws-aurora-feature')];
      const strip=selector('.ws-utility');
      const bar=selector('#ws-aurora-reference .ws-aurora-info-band');
      const section=selector('#ws-aurora-reference');
      const hero=selector('main>.hero');
      return {
        theme:document.body.dataset.theme,
        statusStripHidden:getComputedStyle(strip).display==='none',
        actualNavVisible:getComputedStyle(selector('.topbar')).display!=='none',
        hero:rect(hero),art:rect(art),core:rect(core),
        outer:rect(outer),inner:rect(inner),caption:rect(caption),
        badges:labels.map(x=>({name:x.querySelector('.ws-orbit-label')?.textContent,rect:rect(x),
          svg:x.querySelectorAll('svg').length,
          labelVisible:getComputedStyle(x.querySelector('.ws-orbit-label')).display!=='none',
          background:getComputedStyle(x).backgroundColor})),
        section:rect(section),band:rect(bar),
        featureCount:features.length,
        features:features.map(x=>({text:x.textContent.trim(),href:x.getAttribute('href'),
          svg:x.querySelectorAll('svg').length,rect:rect(x)})),
        miniIcons:selector('#ws-aurora-reference .ws-aurora-band-details').querySelectorAll('svg').length,
        headerColor:getComputedStyle(selector('.topbar')).backgroundColor,
        ink:getComputedStyle(selector('.hero h1')).color,
        outerBorder:getComputedStyle(outer).borderTopColor,
        innerBorder:getComputedStyle(inner).borderTopColor,
        pageWidth:document.documentElement.scrollWidth,
        clientWidth:document.documentElement.clientWidth,
        overflowCandidates:[...document.querySelectorAll('body *')].map(el=>{
          const r=el.getBoundingClientRect();
          return {selector:el.tagName.toLowerCase()+(el.id?'#'+el.id:'')+
            (el.className&&typeof el.className==='string'?'.'+el.className.trim().replaceAll(' ','.'):''),
            left:r.left,right:r.right,width:r.width}
        }).filter(x=>x.right>window.innerWidth+4||x.left< -4)
          .sort((a,b)=>b.right-a.right).slice(0,15),
        otherThemeSections:document.querySelectorAll('.ws-aurora-reference').length
      };
    });
    // Capture and report raw layout even if a later pixel-geometry assertion
    // fails. This makes visual failures reproducible rather than opaque.
    await page.screenshot({path:'test-artifacts/neon-studio-'+width+'.png',fullPage:false,animations:'disabled'});
    console.log('NEON_GEOMETRY',JSON.stringify({
      width,art:report.art,core:report.core,outer:report.outer,
      inner:report.inner,caption:report.caption,
      badges:report.badges.map(x=>({name:x.name,rect:x.rect})),
      band:report.band,hero:report.hero,section:report.section,
      featureCount:report.featureCount,pageWidth:report.pageWidth,
      overflowCandidates:report.overflowCandidates,clientWidth:report.clientWidth
    }));
    assert.equal(report.statusStripHidden,true,'Redundant preview strip should be hidden in Neon Studio');
    assert.equal(report.actualNavVisible,true,'Real navigation must remain visible');
    assert.equal(report.featureCount,6,'All six WebStudio lower feature tabs must render');
    assert.ok(report.core.width>150,'Independent portrait frame did not render');
    assert.equal(report.miniIcons,4,'Infinity strip contains four real SVG details');
    assert.equal(report.badges.length,5,'Five orbital badges are required');
    assert.ok(report.badges.every(x=>x.svg===1),'Each orbit icon must be true vector');
    assert.ok(report.features.every(x=>x.svg===1&&x.href.startsWith('#')&&x.text.length>5),
      'Each feature tab must be populated, interactive and use a true vector icon');
    assert.ok(report.pageWidth<=report.clientWidth+3,'Neon Studio has horizontal overflow');
    assert.ok(Math.abs(report.outer.cx-report.core.cx)<3&&Math.abs(report.outer.cy-report.core.cy)<3,
      'Portrait and outer ring are not concentric');
    assert.ok(Math.abs(report.inner.cx-report.core.cx)<3&&Math.abs(report.inner.cy-report.core.cy)<3,
      'Inner ring and portrait are not concentric');
    assert.ok(report.outer.width>250 && report.outer.width<470,'Independent ring diameter unexpected');
    assert.ok(report.outer.width>report.inner.width&&report.inner.width>report.core.width,
      'Ring scale order must be outer > inner > portrait');
    // The portrait must be comfortably inside the inner ring at every
    // breakpoint. Exact relative scale is checked after CSS diagnostics.
    assert.ok(report.core.width<report.inner.width-3,
      'Portrait must fit inside middle ring without hiding it');
    // The owner's 644×557 reference shows the identity nameplate BELOW the
    // outermost cyan ring by 12–14px. It must also clear the next section.
    const plateGap=report.caption.y-report.outer.bottom;
    assert.ok(plateGap>=9&&plateGap<=20,
      'Identity plate must sit just below the outer cyan ring: '+JSON.stringify({width,plateGap,caption:report.caption,outer:report.outer}));
    assert.ok(report.caption.bottom<report.section.y-8,
      'Identity plate must clear the following skills band with 8px space: '+JSON.stringify({width,caption:report.caption,section:report.section}));
    if(width===1892){
      // Reference crop: x/y satellite offsets measured relative to center
      // and outer-ring diameter. Preserve the exact clockwise composition.
      const target=[[.108,-.426],[.434,-.371],[.473,-.081],[.424,.224],[.383,.334]];
      report.badges.forEach(({rect},index)=>{
        const dx=(rect.x-report.outer.cx)/report.outer.width;
        const dy=(rect.y-report.outer.cy)/report.outer.width;
        assert.ok(Math.abs(dx-target[index][0])<.025&&Math.abs(dy-target[index][1])<.025,
          'WebStudio reference satellite displaced: '+JSON.stringify({index,dx,dy,target:target[index]}));
      });
    }
    assert.ok(report.badges.every(x=>(
      report.caption.x>=x.rect.right+3 || report.caption.right<=x.rect.x-3 ||
      report.caption.y>=x.rect.bottom+3 || report.caption.bottom<=x.rect.y-3)),
      'One of five badges overlaps the identity plate');
    if(width>980){
      assert.ok(report.badges.every(x=>x.labelVisible),
        'Wide-screen orbit labels must remain visible');
      assert.ok(report.features.length===6);
    }
    const unexpected=errors.filter(x=>!/^\[Cloudflare Turnstile\] Error: 110200\.?$/.test(x));
    assert.deepEqual(unexpected,[],'Unexpected JS errors');
    await page.screenshot({path:'test-artifacts/neon-studio-'+width+'.png',fullPage:false,animations:'disabled'});
    results.push({width,height,headerRemoved:report.statusStripHidden,
      orbit:[report.outer.width,report.inner.width,report.core.width],
      captionGap:Math.round(report.caption.y-report.outer.bottom),
      bandGap:Math.round(report.section.y-report.hero.bottom),
      badges:report.badges.map(x=>x.name),
      featureTabs:report.features.map(x=>x.text),
      overflow:report.pageWidth-report.clientWidth});
    if(width<=600){
      // Native controls were previously hanging off the right edge of the
      // mobile header. They should appear in the expandable menu, not vanish.
      await page.locator('.topbar .menu').click();
      await page.waitForFunction(()=>document.querySelector('#navlinks')?.classList.contains('open'));
      const expanded=await page.evaluate(()=>({
        width:document.documentElement.scrollWidth,
        client:document.documentElement.clientWidth,
        controls:[...document.querySelectorAll('.topbar .language-control select,.topbar .theme-control select')]
          .map(el=>{
            const r=el.getBoundingClientRect();
            return {visible:getComputedStyle(el).display!=='none'&&r.width>30,
              left:r.left,right:r.right,width:r.width}
          })
      }));
      assert.equal(expanded.controls.length,2,'Language and theme selectors must remain available');
      assert.ok(expanded.controls.every(x=>x.visible&&x.left>=-2&&x.right<=width+2),
        'Expanded mobile header clipped a setting control: '+JSON.stringify(expanded));
      assert.ok(expanded.width<=expanded.client+3,
        'Expanded mobile menu must not create horizontal scrolling');
      await page.locator('.topbar .menu').click();
    }
    // Theme isolation: switching away must restore the original banner and
    // remove Aurora-only feature components, without altering other theme CSS.
    await page.evaluate(()=>{
      const select=document.querySelector('#theme-select');
      select.value='editorial';select.dispatchEvent(new Event('change',{bubbles:true}));
    });
    await page.waitForFunction(()=>document.body.dataset.theme==='editorial'&&
      !document.querySelector('#ws-aurora-reference'),null,{timeout:5000});
    assert.notEqual(await page.locator('.ws-utility').evaluate(el=>getComputedStyle(el).display),
      'none','Editorial should retain its original utility bar');
    await page.close();
  }
  console.log('PASS_NEON_VISUAL',JSON.stringify(results,null,2));
}finally{await browser.close()}
