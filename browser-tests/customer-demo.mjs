import { createServer } from 'node:http';
import {readFile,mkdir} from 'node:fs/promises';
import {resolve,join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const output=join(root,'dist','customer-demo-preview');
const result=spawnSync(process.execPath,['scripts/build-customer-demo.mjs'],{cwd:root,encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
const mime={'.html':'text/html;charset=utf-8','.js':'application/javascript;charset=utf-8','.css':'text/css;charset=utf-8','.svg':'image/svg+xml','.json':'application/json;charset=utf-8','.txt':'text/plain'};
const server=createServer(async (request,response)=>{
 try {
  const path=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  if(!['/','/index.html','/app.js','/premium.css','/premium.js','/studio-features.css','/studio-features.js','/illustrated-developer.svg','/dev-das-portrait.svg','/studio-avatar.css','/studio-avatar.js','/studio-creative-avatar.svg','/avatar-orbit.svg','/avatar-editorial.svg','/avatar-terminal.svg','/avatar-aurora-peak.svg','/avatar-neon-studio.svg','/avatar-design-2.svg','/studio-about.css','/studio-about.js','/studio-creative-lab.css','/studio-creative-lab.js','/studio-theme-controls.css','/studio-email.js','/studio-personalization.css','/studio-new-themes.css','/studio-reference-layout.css','/studio-orbit-fidelity.css','/studio-design-one.css','/studio-design-one-highlight-fixes.css','/studio-dual-fidelity.css','/studio-desktop-reference.css','/studio-native-reference-geometry.css','/studio-reference-portrait-placement.css','/studio-utility-unified.css','/studio-cosmic-orbit-fidelity.css','/studio-social.css','/studio-social.js','/studio-desktop-reference.js','/cosmic-reference-wave.svg','/aurora-reference-horizon.svg','/studio-design-two.css','/studio-design-two.js','/studio-reference-layout.js','/neon-horizon.svg','/neon-reference-portrait.svg','/design-two-reference-portrait.svg','/studio-polish.css','/studio-tour.js','/commerce.js','/commerce.json','/studio-product.css','/studio-layout-fixes.css','/studio-visual-final.css','/studio-i18n.js','/studio-ownership.js','/studio-system-menu.css','/studio-system-menu.js','/i18n-product.json','/i18n-ui.json','/i18n-copy.json','/i18n-profile.json','/i18n-dynamic.json','/i18n-theme.json','/profile.json','/robots.txt'].includes(path)){response.writeHead(404);response.end('Not found');return;}
  const file=join(output,path==='/'?'index.html':path.slice(1));
  const bytes=await readFile(file);
  response.writeHead(200,{'content-type':mime[extname(file)]||'text/plain'});response.end(bytes);
 }catch{response.writeHead(500);response.end('Failed');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
let passed=0;
const check=(name,fn)=>async()=>{await fn();passed++;console.log('PASS '+name);};
try {
 const page=await browser.newPage({acceptDownloads:true});
 await check('fictional customer profile loads',async()=>{
  await page.goto(url);
  await page.locator('#name').waitFor({state:'visible'});
  assert.equal(await page.locator('#name').innerText(),'Dev Das');
  assert.equal(await page.locator('#projects article').count(),3);
  assert.equal(await page.locator('.nav-links a').count(),6);
  assert.equal(await page.locator('.orbit').count(),2);
 })();
 await check('Neon design assets load without a 404',async()=>{
   const resources=await page.evaluate(()=>Promise.all(['studio-reference-layout.css','studio-orbit-fidelity.css','studio-reference-layout.js','neon-reference-portrait.svg','neon-horizon.svg'].map(async path=>({path,status:(await fetch(path)).status}))));
   assert.deepEqual(resources.map(x=>x.status),[200,200,200,200,200],JSON.stringify(resources));
   assert.equal(await page.locator('.neon-eyebrow-pill').isVisible(),true);
 })();
 await check('language and layout controls adopt six distinct theme skins and remain accessible',async()=>{
   const variants=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
   const appearances=new Set();
   const context=await browser.newPage({viewport:{width:1440,height:900}});
   try{
     await context.goto(url);
     for (const theme of variants){
       await context.locator('#studio-theme').selectOption(theme);
       // Compare the default palette with neither selector focused; focus accents are intentionally different.
       await context.evaluate(()=>{document.getElementById('studio-language').blur();document.getElementById('studio-theme').blur();});
       await context.waitForTimeout(250); // allow the 150ms border-color theme transition to settle
       const state=await context.evaluate(()=>{
         const language=document.getElementById('studio-language');
         const layout=document.getElementById('studio-theme');
         const styles=[language,layout].map(el=>{
           const css=getComputedStyle(el),bounds=el.getBoundingClientRect();
           return {color:css.color,bg:css.backgroundColor,border:css.borderTopColor,radius:css.borderTopLeftRadius,
             appearance:css.appearance,width:bounds.width,height:bounds.height,focusable:el.tabIndex>=0};
         });
         return {styles,overflow:document.documentElement.scrollWidth-innerWidth,
           theme:document.body.dataset.theme};
       });
       assert.equal(state.theme,theme);
       assert.equal(state.styles[0].bg,state.styles[1].bg,theme+' language/layout must match');
       assert.equal(state.styles[0].border,state.styles[1].border,theme+' border mismatch');
       assert.ok(state.styles.every(x=>x.height>=39&&x.focusable&&x.color!=='rgb(0, 0, 0)'),theme+' select not usable '+JSON.stringify(state));
       assert.ok(state.overflow<=2,theme+' layout overflow');
       appearances.add(state.styles[0].bg+'/'+state.styles[0].border);
       await context.locator('#studio-language').focus();
       assert.equal(await context.locator('#studio-language').evaluate(el=>el===document.activeElement),true);
     }
     assert.equal(appearances.size,6,'Every theme needs its own distinct input colors');
     await context.setViewportSize({width:390,height:844});
     for(const theme of variants){
       await context.locator('#studio-theme').selectOption(theme);
       const measured=await context.evaluate(()=>{
         const a=document.getElementById('studio-language').getBoundingClientRect();
         const b=document.getElementById('studio-theme').getBoundingClientRect();
         return {first:a.toJSON(),second:b.toJSON(),overflow:document.documentElement.scrollWidth-innerWidth};
       });
       assert.ok(measured.first.width>100&&measured.second.width>100,theme+' selectors too small');
       assert.ok(measured.first.left>=0&&measured.second.right<=392&&measured.overflow<=2,theme+' mobile selector overflow '+JSON.stringify(measured));
     }
     await context.locator('#studio-language').selectOption('hi');
     assert.equal(await context.locator('#studio-language').inputValue(),'hi');
   }finally{await context.close();}
 })();
 await check('WebStudio About and Help keeps LifeSphere suite behind user action',async()=>{
   assert.equal(await page.locator('#lifesphere').count(),0);
   assert.equal(await page.locator('#exposure-watch').count(),0);
   assert.equal(await page.locator('.ls-renewal-form').count(),0);
   assert.equal(await page.locator('#ws-about-modal').isVisible(),false);
   await page.locator('#footer-about').click();
   assert.equal(await page.locator('#ws-about-modal').isVisible(),true);
   assert.match(await page.locator('#ws-about-intro').innerText(),/WebStudio.*DevDas Development/s);
   assert.equal(await page.locator('#ws-suite-panel').isVisible(),false);
   await page.locator('#ws-suite-details').click();
   assert.equal(await page.locator('#ws-suite-panel').isVisible(),true);
   assert.match(await page.locator('#ws-suite-panel').innerText(),/Private Vault/);
   assert.match(await page.locator('#ws-suite-panel').innerText(),/development prototype/);
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#ws-about-modal').isVisible(),false);
   assert.equal(await page.locator('#footer-about').evaluate(e=>e===document.activeElement),true);
   await page.locator('#system-menu-trigger').click();
   await page.locator('#system-about').click();
   assert.equal(await page.locator('#ws-about-modal').isVisible(),true);
   assert.equal(await page.locator('#ws-suite-panel').isVisible(),false);
   await page.locator('#ws-about-close').click();
 })();
 await check('Creative Lab presets and live controls are reversible and local',async()=>{
  const lab=page.locator('.creative-lab');
  assert.equal(await lab.count(),1);
  if(!(await page.locator('#editor').isVisible()))await page.locator('#edit-toggle').click();
  await lab.locator('button[data-mood=ultraviolet]').click();
  assert.equal(await lab.locator('button[data-mood=ultraviolet]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('input[name=accent]').inputValue(),'#bc86ff');
  await lab.locator('#creative-glow').fill('25');
  assert.equal(await lab.locator('#creative-glow-value').innerText(),'25%');
  await lab.locator('#creative-motion').uncheck();
  assert.equal(await page.locator('body').getAttribute('data-creative-motion'),'off');
  await lab.locator('#creative-lab-reset').click();
  assert.equal(await lab.locator('button[data-mood=electric]').getAttribute('aria-pressed'),'true');
  assert.equal(await page.locator('body').getAttribute('data-creative-motion'),'on');
  // Restore original state for the legacy editor regression sequence.
  if(await page.locator('#editor').isVisible())await page.locator('#edit-toggle').click();
 })();
 await check('keyboard quick actions switch themes and expose Help without leaking LifeSphere tools',async()=>{
  await page.keyboard.press('Control+k');
  assert.equal(await page.locator('#creative-command').isVisible(),true);
  await page.locator('#creative-command-search').fill('Theme · Terminal');
  assert.ok(await page.locator('.creative-command-option').count()>=1);
  await page.locator('#creative-command-search').press('Enter');
  assert.equal(await page.locator('body').getAttribute('data-theme'),'terminal');
  await page.keyboard.press('Control+k');
  await page.locator('#creative-command-search').fill('About WebStudio');
  await page.locator('#creative-command-search').press('Enter');
  assert.equal(await page.locator('#ws-about-modal').isVisible(),true);
  await page.locator('#ws-about-close').click();
  await page.locator('#studio-theme').selectOption('neon-studio');
  await page.locator('#creative-command-trigger').click();
  assert.equal(await page.locator('#creative-command').isVisible(),true);
  await page.keyboard.press('Escape');
  assert.equal(await page.locator('#creative-command').isVisible(),false);
 })();
 await check('editing and saving fields works',async()=>{
  await page.getByRole('button',{name:'Customize demo'}).click();
  await page.locator('input[name="displayName"]').fill('Taylor Demo');
  await page.locator('input[name="role"]').fill('Design Engineer');
  await page.getByRole('button',{name:'Save & preview'}).click();
  assert.equal(await page.locator('#name').innerText(),'Taylor Demo');
  assert.equal(await page.locator('#role').innerText(),'Design Engineer');
  assert.equal(await page.locator('#portrait-caption').innerText(),'Taylor Demo','Nameplate must track edits');
 })();
 await check('project creation editing and removal work',async()=>{
  await page.getByRole('button',{name:'Add project'}).click();
  assert.equal(await page.locator('#projects article').count(),4);
  await page.locator('[data-project-index="3"] input[data-property="name"]').fill('New Example App');
  await page.getByRole('button',{name:'Save & preview'}).click();
  assert.equal(await page.locator('#projects h3').last().innerText(),'New Example App');
  await page.locator('[data-remove-project="3"]').click();
  assert.equal(await page.locator('#projects article').count(),3);
 })();
 await check('new social links work',async()=>{
  await page.getByRole('button',{name:'Add social link'}).click();
  await page.locator('[data-social-index="2"] input[data-property="label"]').fill('Docs');
  await page.getByRole('button',{name:'Save & preview'}).click();
  assert.equal(await page.locator('#social a').count(),3);
 })();
 await check('invalid URL is rejected',async()=>{
  await page.locator('[data-social-index="2"] input[data-property="url"]').fill('javascript:alert(1)');
  await page.getByRole('button',{name:'Save & preview'}).click();
  assert.match(await page.locator('#editor-status').innerText(),/correct|HTTPS/);
  await page.locator('[data-social-index="2"] input[data-property="url"]').fill('https://example.com');
  await page.getByRole('button',{name:'Save & preview'}).click();
 })();
 await check('export creates a JSON download',async()=>{
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export profile JSON'}).click();
  const download=await downloadPromise;
  assert.equal(download.suggestedFilename(),'customer-demo-profile.json');
  const fs=await import('node:fs/promises');
  const path=await download.path();
  const object=JSON.parse(await fs.readFile(path,'utf8'));
  assert.equal(object.identity.displayName,'Taylor Demo');
 })();
 await check('saved changes survive browser reload',async()=>{
  await page.reload();
  assert.equal(await page.locator('#name').innerText(),'Taylor Demo');
 })();
 await check('import and reset work',async()=>{
  await page.getByRole('button',{name:'Customize demo'}).click();
  const input=page.locator('#import-profile');
  const saved=JSON.parse(await readFile(join(output,'profile.json'),'utf8'));
  saved.identity.displayName='Imported Example';
  await input.setInputFiles({name:'profile.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
  await page.waitForFunction(() => document.querySelector('#name')?.textContent === 'Imported Example');
  assert.equal(await page.locator('#name').innerText(),'Imported Example');
  await page.getByRole('button',{name:'Reset demo'}).click();
  assert.equal(await page.locator('#name').innerText(),'Dev Das');
 })();

 await check('original-inspired fictional portrait loads',async()=>{
   const img=page.locator('#avatar img.demo-portrait');
   await img.waitFor();
   assert.ok(await img.evaluate(el=>el.complete && el.naturalWidth > 0));
 })();
 await check('six layouts render six distinct fully loaded SVG portraits',async()=>{
   const variants=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
   const urls=new Set();
   if (!await page.locator('#editor').evaluate(el=>el.classList.contains('open')))
     await page.getByRole('button',{name:'Customize demo'}).click();
   await page.locator('input[name="avatar-preset"][value="auto"]').check();
   for(const theme of variants){
     await page.locator('#studio-theme').selectOption(theme);
     const image=page.locator('#avatar img[data-avatar-choice]');
     await page.waitForFunction(expected=>{
       const img=document.querySelector('#avatar img[data-avatar-choice]');
       return img?.getAttribute('src')==='./avatar-'+expected+'.svg' && img.complete && img.naturalWidth>0;
     },theme);
     const src=await image.getAttribute('src');
     assert.equal(src,'./avatar-'+theme+'.svg');
     urls.add(src);
     assert.equal(await page.locator('.neon-reference-photo').isVisible(),['neon-studio','design-2'].includes(theme),'reference-size illustration should appear only in its dedicated themes');
   }
   assert.equal(urls.size,6);
 })();
 await check('user photo remains local-only and theme switch preserves it',async()=>{
   const fixture=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aW0sAAAAASUVORK5CYII=','base64');
   await page.locator('.avatar-studio-upload input[type=file]').setInputFiles({name:'preview.png',mimeType:'image/png',buffer:fixture});
   const status=page.locator('.avatar-studio [role="status"]');
   await page.waitForFunction(()=>document.body.dataset.avatarPreset==='photo');
   assert.match(await status.innerText(),/local photo preview only/i);
   const photo=await page.locator('#avatar img[data-avatar-choice]').getAttribute('src');
   assert.ok(photo.startsWith('blob:'),'photo remains an object URL');
   await page.locator('#studio-theme').selectOption('terminal');
   assert.equal(await page.locator('#avatar img[data-avatar-choice]').getAttribute('src'),photo);
   await page.locator('.avatar-studio button').click();
   await page.waitForFunction(()=>document.body.dataset.avatarPreset==='terminal');
   assert.equal(await page.locator('#avatar img[data-avatar-choice]').getAttribute('src'),'./avatar-terminal.svg');
   // Restore the canonical initial layout; Terminal's section pager hides later case-study controls.
   await page.locator('#studio-theme').selectOption('neon-studio');
 })();
 await check('editable project case study opens',async()=>{
   await page.locator('#projects .project-study summary').first().click();
   assert.ok(await page.locator('#projects .project-study').first().evaluate(el=>el.open));
 })();
 await check('layouts switch and persist across reload',async()=>{
   await page.locator('#studio-theme').selectOption('editorial');
   assert.equal(await page.locator('body').getAttribute('data-theme'),'editorial');
   await page.reload();
   assert.equal(await page.locator('body').getAttribute('data-theme'),'editorial');
   await page.locator('#studio-theme').selectOption('orbit');
 })();
 await check('six-language UI changes navigation',async()=>{
   await page.locator('#studio-language').selectOption('es');
   assert.equal(await page.locator('#studio-nav a[data-copy="about"]').innerText(),'Acerca de');
   await page.locator('#studio-language').selectOption('hi');
   assert.equal(await page.locator('html').getAttribute('lang'),'hi');
   await page.locator('#studio-language').selectOption('en');
 })();
 await check('project search and category filters work',async()=>{
   await page.locator('#project-search').fill('Project Atlas');
   assert.equal(await page.locator('#projects .card:visible').count(),1);
   await page.locator('#project-search').fill('not-a-project');
   assert.equal(await page.locator('#projects .card:visible').count(),0);
   assert.equal(await page.locator('#project-empty').isVisible(),true);
   await page.locator('#project-search').fill('');
   await page.locator('#project-filter').selectOption({label:'Community project'});
   assert.equal(await page.locator('#projects .card:visible').count(),1);
   await page.locator('#project-filter').selectOption('all');
 })();
 await check('terminal theme section pager is navigable',async()=>{
   await page.locator('#studio-theme').selectOption('terminal');
   assert.equal(await page.locator('#about-section').isVisible(),true);
   await page.locator('.terminal-nav [data-terminal-move="1"]').click();
   assert.equal(await page.locator('#skills-section').isVisible(),true);
   await page.locator('#studio-theme').selectOption('orbit');
 })();
 await check('client enquiry opens an email draft, never downloads a brief or fakes delivery',async()=>{
   await page.locator('#proposal-section summary').click();
   await page.locator('#proposal-form [name="name"]').fill('Test Visitor');
   await page.locator('#proposal-form [name="email"]').fill('visitor@gmail.com');
   await page.locator('#proposal-form [name="service"]').selectOption('Website redesign');
   await page.locator('#proposal-form [name="timeline"]').selectOption('Exploring options');
   await page.locator('#proposal-form [name="brief"]').fill('Create a fictional accessible demo website.');
   await page.locator('#proposal-form [type="submit"]').click();
   assert.match(await page.locator('#proposal-status').innerText(),/Configure a real receiving email address/i);
   if(!(await page.locator('#editor').isVisible()))await page.locator('#edit-toggle').click();
   await page.locator('#profile-form [name="contactEmail"]').fill('owner@gmail.com');
   await page.locator('#profile-form button[type="submit"]').click();
   await page.evaluate(()=>{
     window.__mailtoURL='';
     const original=HTMLAnchorElement.prototype.click;
     HTMLAnchorElement.prototype.click=function(){
       if(this.href.startsWith('mailto:')){window.__mailtoURL=this.href;return;}
       return original.call(this);
     };
   });
   await page.locator('#proposal-form [type="submit"]').click();
   await page.waitForFunction(()=>!!window.__mailtoURL);
   const href=await page.evaluate(()=>window.__mailtoURL);
   assert.match(href,/^mailto:owner%40gmail.com\?/);
   assert.match(decodeURIComponent(href),/Project brief:[\s\S]*accessible demo website/);
   assert.match(await page.locator('#proposal-status').innerText(),/review it and press Send/i);
   await page.locator('#reset-profile').click();
 })();
 await check('mobile menu provides responsive navigation',async()=>{
   const mobile=await browser.newPage({viewport:{width:390,height:844}});
   try {
     await mobile.goto(url);
     await mobile.locator('#mobile-menu').click();
     assert.equal(await mobile.locator('#mobile-menu').getAttribute('aria-expanded'),'true');
     assert.equal(await mobile.locator('#studio-nav').isVisible(),true);
     await mobile.locator('#studio-nav a[href="#projects-section"]').click();
     assert.equal(await mobile.locator('#mobile-menu').getAttribute('aria-expanded'),'false');
   } finally {await mobile.close();}
 })();
 await check('portrait visible in all three distinct themes',async()=>{
   for(const theme of ['orbit','editorial','terminal']){
     await page.locator('#studio-theme').selectOption(theme);
     const img=page.locator('#avatar img.demo-portrait');
     assert.equal(await img.isVisible(),true,theme+' avatar hidden');
     const dims=await img.boundingBox();
     assert.ok(dims?.width>100&&dims?.height>100,theme+' avatar too small');
     assert.ok(await img.evaluate(el=>el.complete&&el.naturalWidth>0));
   }
   await page.locator('#studio-theme').selectOption('orbit');
 })();
 await check('different themes actually change typography and backgrounds',async()=>{
   await page.locator('#reset-profile').click();
   await page.locator('#studio-theme').selectOption('editorial');
   const light=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
   const editorialFont=await page.locator('#name').evaluate(el=>getComputedStyle(el).fontFamily);
   await page.locator('#studio-theme').selectOption('terminal');
   const dark=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
   const terminalFont=await page.locator('#name').evaluate(el=>getComputedStyle(el).fontFamily);
   const state=await page.evaluate(()=>({theme:document.body.dataset.theme,custom:document.body.dataset.customBackground,background:document.body.dataset.background,base:getComputedStyle(document.body).getPropertyValue('--base'),actual:getComputedStyle(document.body).backgroundColor}));
   assert.notEqual(light,dark,'Default theme backgrounds must differ: '+JSON.stringify({light,dark,state}));assert.notEqual(editorialFont,terminalFont);
   await page.locator('#studio-theme').selectOption('orbit');
 })();
 await check('interactive tour opens and can drive editor',async()=>{
   await page.locator('#tour-start').click();
   assert.equal(await page.locator('#demo-tour').isVisible(),true);
   await page.locator('#tour-next').click();
   await page.locator('#tour-next').click();
   await page.locator('#tour-try').click();
   assert.equal(await page.locator('#demo-tour').isVisible(),false);
   assert.equal(await page.locator('#editor').isVisible(),true);
 })();
 await check('tour Escape closes and restores focus',async()=>{
   await page.locator('#tour-start').click();
   await page.keyboard.press('Escape');
   assert.equal(await page.locator('#demo-tour').isVisible(),false);
   assert.equal(await page.locator('#tour-start').evaluate(el=>el===document.activeElement),true);
 })();
 await check('purchase is disabled and plans never impersonate checkout',async()=>{
   const btn=page.locator('#checkout-button');
   assert.equal(await btn.isDisabled(),true);
   assert.match(await page.locator('#checkout-status').innerText(),/No payments|Checkout is not activated|unavailable/i);
   await page.locator('#explore-plans').click();
   assert.equal(await page.locator('#studio-plans').isVisible(),true);
 })();
 await check('new fictional identity appears consistently',async()=>{
   assert.equal(await page.locator('#name').innerText(),'Dev Das');
   assert.equal(await page.locator('#demo-brand').textContent(),'Dev Das');
   assert.match(await page.locator('#portrait-caption').textContent(),/Dev Das/);
   if(!(await page.locator('#editor').isVisible()))await page.locator('#edit-toggle').click();
   await page.locator('input[name="displayName"]').fill('Sage Demo');
   await page.getByRole('button',{name:'Save & preview'}).click();
   assert.equal(await page.locator('#demo-brand').textContent(),'Sage Demo');
   await page.locator('#reset-profile').click();
   assert.equal(await page.locator('#demo-brand').textContent(),'Dev Das');
 })();
 await check('layout has no horizontal overflow at common viewport sizes',async()=>{
   for(const width of [390,768,1280]){
     await page.setViewportSize({width,height:900});
     const dimensions=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,viewport:window.innerWidth}));
     assert.ok(dimensions.scroll<=dimensions.viewport+2,`${width}: ${JSON.stringify(dimensions)}`);
   }
   await page.setViewportSize({width:1280,height:900});
 })();
 await check('all ten languages available with local translation catalogs',async()=>{
   await page.waitForFunction(()=>window.StudioI18n?.coverage?.hi>30);
   assert.equal(await page.locator('#studio-language option').count(),10);
   assert.equal(await page.locator('#usp-heading').innerText(),'Your web presence should outlive any provider.');
 })();
 await check('Spanish translates full resilience description and editable portfolio',async()=>{
   await page.locator('#studio-language').selectOption('es');
   await page.waitForFunction(()=>document.querySelector('#usp-heading')?.textContent==='Tu presencia web debería sobrevivir a cualquier proveedor.');
   assert.match(await page.locator('#resilience-title').innerText(),/recuperarse/);
   assert.match(await page.locator('#role').innerText(),/Desarrollador/);
   assert.match(await page.locator('#about').innerText(),/ficticio/);
   assert.match(await page.locator('#projects .card .muted').first().innerText(),/panel ficticio/);
 })();
 await check('Hindi Bengali Portuguese Chinese and Japanese switch reversibly',async()=>{
   const cases=[['hi','आपकी वेब'],['bn','আপনার ওয়েব'],['pt','Sua presença'],['zh-CN','您的网络'],['ja','ウェブ上の存在']];
   for(const [locale,phrase] of cases){
     await page.locator('#studio-language').selectOption(locale);
     await page.waitForFunction(({phrase})=>document.querySelector('#usp-heading')?.textContent.includes(phrase),{phrase});
     assert.equal(await page.locator('html').getAttribute('lang'),locale);
   }
 })();
 await check('Arabic right-to-left layout preserves readable hero and backup statement',async()=>{
   await page.locator('#studio-language').selectOption('ar');
   await page.waitForFunction(()=>document.documentElement.dir==='rtl');
   assert.match(await page.locator('#resilience-title').innerText(),/للاسترداد/);
   assert.equal(await page.locator('#avatar img').isVisible(),true);
   await page.setViewportSize({width:390,height:844});
   const geometry=await page.evaluate(()=>({width:document.documentElement.scrollWidth,viewport:innerWidth}));
   assert.ok(geometry.width<=geometry.viewport+2,JSON.stringify(geometry));
   await page.setViewportSize({width:1280,height:900});
 })();
 await check('tour content translates after opening and while stepping through it',async()=>{
   await page.locator('#tour-start').click();
   await page.waitForFunction(()=>document.querySelector('#tour-title')?.textContent==='تعرّف على حضورك الرقمي المستدام.');
   await page.locator('#tour-next').click();
   await page.waitForFunction(()=>document.querySelector('#tour-title')?.textContent==='ست سمات لملف شخصي واحد.');
   await page.keyboard.press('Escape');
 })();
 await check('English restore preserves editable profile data and core safety claims',async()=>{
   await page.locator('#studio-language').selectOption('en');
   await page.waitForFunction(()=>document.querySelector('#usp-heading')?.textContent==='Your web presence should outlive any provider.');
   assert.equal(await page.locator('#role').innerText(),'Creative Developer & Interface Engineer');
   assert.match(await page.locator('#resilience').innerText(),/not an uptime guarantee/);
   await page.reload();
   await page.waitForFunction(()=>window.StudioI18n?.language==='en');
   assert.equal(await page.locator('#name').innerText(),'Dev Das');
 })();
 await check('portrait and both orbit rings share the same center in all layouts',async()=>{
   for(const width of [390,768,1280]){
     await page.setViewportSize({width,height:900});
     for(const theme of ['orbit','editorial','terminal']){
       await page.locator('#studio-theme').selectOption(theme);
       const geometry=await page.evaluate(()=>{
         const bounds=selector=>document.querySelector(selector).getBoundingClientRect();
         const avatar=bounds('#avatar'),outer=bounds('.hero-art .orbit'),inner=bounds('.hero-art .orbit.second'),img=bounds('#avatar img');
         const center=r=>({x:r.left+r.width/2,y:r.top+r.height/2});
         return {avatar:{...center(avatar),size:avatar.width},outer:{...center(outer),size:outer.width},inner:{...center(inner),size:inner.width},img:{...center(img),size:img.width},radius:getComputedStyle(document.querySelector('#avatar')).borderRadius};
       });
       for(const key of ['outer','inner','img']){
         assert.ok(Math.abs(geometry.avatar.x-geometry[key].x)<=5,theme+'/'+width+'/'+key+' x alignment: '+JSON.stringify(geometry));
         assert.ok(Math.abs(geometry.avatar.y-geometry[key].y)<=5,theme+'/'+width+'/'+key+' y alignment: '+JSON.stringify(geometry));
       }
       assert.ok(geometry.outer.size>geometry.inner.size&&geometry.inner.size>geometry.avatar.size);
       assert.ok(geometry.radius.includes('50%'),theme+' portrait crop should fit round artwork');
     }
   }
   await page.locator('#studio-theme').selectOption('orbit');
   await page.setViewportSize({width:1280,height:900});
 })();
 await check('direct download is an actual manual ownership backup',async()=>{
   const started=page.waitForEvent('download');
   await page.locator('#system-menu-trigger').click();
   await page.locator('#backup-download').click();
   const download=await started;
   assert.equal(download.suggestedFilename(),'customer-demo-profile.json');
 })();
 await check('direct restore opens the editor and selects local JSON',async()=>{
   await page.locator('#system-menu-trigger').click();
   await page.locator('#backup-import').click();
   assert.equal(await page.locator('#editor').isVisible(),true);
   const file=JSON.parse(await readFile(join(output,'profile.json'),'utf8'));
   file.identity.displayName='Ownership Test';
   await page.locator('#import-profile').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(file))});
   await page.waitForFunction(()=>document.querySelector('#name')?.textContent==='Ownership Test');
   await page.locator('#reset-profile').click();
   assert.equal(await page.locator('#name').innerText(),'Dev Das');
 })();
 await check('header, CTAs and editing buttons never overlap at responsive widths',async()=>{
   for(const theme of ['orbit','editorial','terminal']){
     await page.locator('#studio-theme').selectOption(theme);
     for(const width of [320,390,600,768,1024,1440]){
       await page.setViewportSize({width,height:900});
       const result=await page.evaluate(()=>{
         const selectors=['.nav-bar .brand','.nav-bar #mobile-menu','.nav-bar #edit-toggle','.nav-bar .studio-controls','.nav-bar .nav-links','.nav-bar .system-menu-trigger','.studio-product-actions button','.ownership-actions button','.hero-actions a'];
         const overlaps=[];const visible=[];
         for(const sel of selectors)for(const el of document.querySelectorAll(sel)){
           const s=getComputedStyle(el),r=el.getBoundingClientRect();
           if(s.display==='none'||s.visibility==='hidden'||r.width===0||r.height===0)continue;
           visible.push({name:el.id||el.textContent.trim().slice(0,25),sel,r:{x:r.x,y:r.y,right:r.right,bottom:r.bottom,width:r.width,height:r.height}});
         }
         const intersection=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.x,b.x))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.y,b.y));
         for(let i=0;i<visible.length;i++)for(let j=i+1;j<visible.length;j++){
           if(intersection(visible[i].r,visible[j].r)>24)overlaps.push([visible[i].name,visible[j].name]);
         }
         return {overlaps,overflow:document.documentElement.scrollWidth-innerWidth,outside:visible.filter(x=>x.r.x < -2||x.r.right>innerWidth+2).map(x=>x.name)};
       });
       assert.deepEqual(result.overlaps,[],theme+'/'+width+': '+JSON.stringify(result));
       assert.deepEqual(result.outside,[],theme+'/'+width+': '+JSON.stringify(result));
       assert.ok(result.overflow<=2,theme+'/'+width+': horizontal overflow '+result.overflow);
     }
   }
   await page.locator('#studio-theme').selectOption('orbit');
   await page.setViewportSize({width:1280,height:900});
 })();
 await check('translated system backup tiles are readable and do not collide',async()=>{
   for(const language of ['en','de','hi','ar']){
     await page.locator('#studio-language').selectOption(language);
     await page.waitForFunction(lang=>window.StudioI18n?.language===lang,language);
     await page.setViewportSize({width:390,height:850});
     await page.locator('#system-menu-trigger').click();
     const layout=await page.locator('#system-menu-panel').evaluate(el=>{
       const boxes=[...el.querySelectorAll('.system-menu-data>button')].map(b=>b.getBoundingClientRect());
       const a=boxes[0],b=boxes[1];
       const overlap=Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
       const rect=el.getBoundingClientRect();
       return {overlap,overflow:boxes.some(r=>r.left < -1||r.right>innerWidth+1),panelOverflow:rect.left < -1||rect.right>innerWidth+1};
     });
     assert.equal(layout.overlap,0,language+': translated backup tiles overlap');
     assert.equal(layout.overflow,false,language+': translated tile outside viewport');
     assert.equal(layout.panelOverflow,false,language+': panel outside viewport');
     await page.keyboard.press('Escape');
   }
   await page.locator('#studio-language').selectOption('en');
   await page.setViewportSize({width:1280,height:900});
 })();
 await check('artwork labels do not collide and the hero has balanced vertical spacing',async()=>{
   for(const width of [320,390,768,1110,1440]){
     await page.setViewportSize({width,height:900});
     for(const theme of ['orbit','editorial','terminal']){
       await page.locator('#studio-theme').selectOption(theme);
       const m=await page.evaluate(()=>{
         const rect=s=>document.querySelector(s).getBoundingClientRect();
         const avatar=rect('#avatar'),caption=rect('#portrait-caption'),tag=rect('.float-tag'),art=rect('.hero-art'),hero=rect('.hero'),strip=rect('.studio-product-strip');
         const overlap=(a,b)=>Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));
         return {labels:overlap(caption,tag),captionPhoto:overlap(caption,avatar),tagPhoto:overlap(tag,avatar),gap:hero.top-strip.bottom,avatarWidth:avatar.width,crop:getComputedStyle(document.querySelector('#avatar img')).objectFit};
       });
       assert.ok(m.labels<2,theme+'/'+width+' labels overlap: '+JSON.stringify(m));
       assert.ok(m.captionPhoto<2,theme+'/'+width+' caption overlaps portrait: '+JSON.stringify(m));
       assert.ok(m.tagPhoto<2,theme+'/'+width+' tag overlaps portrait: '+JSON.stringify(m));
       assert.ok(m.gap<70,theme+'/'+width+' excessive hero gap: '+JSON.stringify(m));
       assert.equal(m.crop,'cover');
     }
   }
   await page.locator('#studio-theme').selectOption('orbit');
   await page.setViewportSize({width:1280,height:900});
 })();
 await check('desktop tour buttons fit one row and branding initials follow edits',async()=>{
   await page.setViewportSize({width:1440,height:900});
   const m=await page.locator('.studio-product-actions button').evaluateAll(buttons=>{
     const r=buttons.map(b=>b.getBoundingClientRect());
      const overlaps=r.some((a,i)=>r.some((b,j)=>i<j && Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top))>2));
      return {spread:Math.max(...r.map(x=>x.top))-Math.min(...r.map(x=>x.top)),overlap:overlaps};
   });
   assert.ok(m.spread<=2,'desktop CTA buttons not aligned: '+JSON.stringify(m));
   assert.equal(m.overlap,false);
   assert.equal(await page.locator('#demo-brand-wrapper').getAttribute('data-initials'),'DD');
   if(!(await page.locator('#editor').isVisible()))await page.locator('#edit-toggle').click();
   await page.locator('input[name="displayName"]').fill('Nova Studio');
   await page.getByRole('button',{name:'Save & preview'}).click();
   assert.equal(await page.locator('#demo-brand-wrapper').getAttribute('data-initials'),'NS');
   await page.locator('#reset-profile').click();
 })();
 await check('system controls are grouped in a dedicated accessible top menu',async()=>{
   await page.setViewportSize({width:1280,height:900});
   const trigger=page.locator('#system-menu-trigger'),panel=page.locator('#system-menu-panel');
   assert.equal(await trigger.getAttribute('aria-expanded'),'false');
   assert.equal(await panel.isVisible(),false);
   await trigger.click();
   assert.equal(await trigger.getAttribute('aria-expanded'),'true');
   assert.equal(await panel.isVisible(),true);
   assert.equal(await panel.locator('button:not(:disabled)').count(),5);
   assert.equal(await panel.locator('.studio-planned-grid button:disabled').count(),6);
   assert.equal(await panel.locator('button').count(),11);
   assert.equal(await panel.locator('.system-menu-data>button').count(),2);
   assert.equal(await panel.locator('.system-menu-intro h2').innerText(),'Your studio, your control.');
   assert.equal(await panel.locator('.system-menu-footer').isVisible(),true);
   assert.equal(await page.locator('#backup-download').count(),1);
   assert.equal(await page.locator('#backup-import').count(),1);
   assert.match(await page.locator('.system-menu-coming').innerText(),/not connected/i);
   await page.keyboard.press('Escape');
   assert.equal(await panel.isVisible(),false);
   assert.equal(await trigger.evaluate(el=>el===document.activeElement),true);
 })();
 await check('system menu editor and reset actions reuse working controls',async()=>{
   await page.locator('#system-menu-trigger').click();
   await page.locator('#system-customize').click();
   assert.equal(await page.locator('#editor').isVisible(),true);
   await page.locator('input[name="displayName"]').fill('System Menu Test');
   await page.getByRole('button',{name:'Save & preview'}).click();
   assert.equal(await page.locator('#name').innerText(),'System Menu Test');
   await page.locator('#system-menu-trigger').click();
   await page.locator('#system-reset').click();
   assert.equal(await page.locator('#name').innerText(),'Dev Das');
 })();
 await check('system menu fits on phone and is keyboard operable',async()=>{
   await page.setViewportSize({width:390,height:844});
   for(const theme of ['orbit','editorial','terminal']){
     await page.locator('#studio-theme').selectOption(theme);
     await page.locator('#system-menu-trigger').click();
     const r=await page.locator('#system-menu-panel').boundingBox();
     assert.ok(r&&r.x>=-1&&r.x+r.width<=391,theme+' menu exceeds phone width');
     await page.locator('#system-menu-trigger').focus();
     await page.keyboard.press('ArrowDown');
     assert.equal(await page.locator('#backup-download').evaluate(el=>el===document.activeElement),true);
     await page.keyboard.press('ArrowDown');
     assert.equal(await page.locator('#backup-import').evaluate(el=>el===document.activeElement),true);
     await page.keyboard.press('Escape');
     assert.equal(await page.locator('#system-menu-panel').isVisible(),false);
   }
   await page.locator('#studio-theme').selectOption('orbit');
   await page.setViewportSize({width:1280,height:900});
 })();
 await check('Dev Das portrait is distinct and consistent across three themes and mobile widths',async()=>{
   assert.equal(await page.locator('#name').innerText(),'Dev Das');
   for(const theme of ['orbit','editorial','terminal']){
     await page.locator('#studio-theme').selectOption(theme);
     for(const width of [390,768,1280]){
       await page.setViewportSize({width,height:900});
       const img=page.locator('#avatar img.demo-portrait');
       await img.waitFor({state:'visible'});
       assert.equal(await img.getAttribute('src'),'./avatar-'+theme+'.svg');
       const data=await img.evaluate(el=>({loaded:el.complete&&el.naturalWidth>0,width:el.getBoundingClientRect().width,height:el.getBoundingClientRect().height}));
       assert.equal(data.loaded,true,theme+'/'+width+' portrait');
       assert.ok(Math.abs(data.width-data.height)<3,theme+'/'+width+' portrait shape');
       const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);
       assert.ok(overflow<=2,theme+'/'+width+' overflow '+overflow);
     }
   }
   await page.locator('#studio-theme').selectOption('orbit');
   await page.setViewportSize({width:1280,height:900});
 })();
 await check('five themes retain a square vector illustration at mobile tablet and desktop',async()=>{
   const themes=['orbit','editorial','terminal','aurora-peak','neon-studio'];
   assert.equal(await page.locator('#studio-theme option').count(),6);
   for(const theme of themes){
     await page.locator('#studio-theme').selectOption(theme);
     for(const width of [390,768,1280]){
       await page.setViewportSize({width,height:900});
       const visual=await page.evaluate(()=>{
         const img=document.querySelector('#avatar img'),avatar=document.querySelector('#avatar').getBoundingClientRect();
         return {src:img.getAttribute('src'),loaded:img.complete&&img.naturalWidth>0,
           square:Math.abs(avatar.width-avatar.height),overflow:document.documentElement.scrollWidth-innerWidth,
           theme:document.body.dataset.theme};
       });
       assert.equal(visual.theme,theme);
       assert.equal(visual.src,'./avatar-'+theme+'.svg');
       assert.equal(visual.loaded,true,theme+'/'+width+' illustration');
       assert.ok(visual.square<=3,theme+'/'+width+' not square');
       assert.ok(visual.overflow<=2,theme+'/'+width+' horizontal overflow');
     }
   }
   await page.locator('#studio-theme').selectOption('orbit');
   await page.setViewportSize({width:1280,height:900});
 })();
 await check('new themes have distinct visual backgrounds',async()=>{
   const backgrounds=[];
   for(const theme of ['aurora-peak','neon-studio']){
     await page.locator('#studio-theme').selectOption(theme);
     backgrounds.push(await page.evaluate(()=>getComputedStyle(document.body,'::before').backgroundImage));
   }
   assert.ok(backgrounds.every(x=>x!=='none'));
   assert.notEqual(backgrounds[0],backgrounds[1]);
   await page.locator('#studio-theme').selectOption('orbit');
 })();
 await check('demo rejects legacy raster photos and keeps customizable backgrounds',async()=>{
   if(!(await page.locator('#editor').isVisible()))await page.locator('#edit-toggle').click();
   assert.equal(await page.locator('#portrait-upload').count(),0);
   await page.locator('#profile-form select[name="backgroundStyle"]').selectOption('solid');
   await page.locator('#profile-form button[type="submit"]').click();
   assert.equal(await page.locator('body').getAttribute('data-background'),'solid');
   await page.locator('#profile-form select[name="backgroundStyle"]').selectOption('original');
   await page.locator('#profile-form button[type="submit"]').click();
   assert.equal(await page.locator('body').getAttribute('data-background'),'original');
   const sample=JSON.parse(await readFile(join(output,'profile.json'),'utf8'));
   sample.appearance.portrait='data:image/jpeg;base64,'+'a'.repeat(1000);
   await page.locator('#import-profile').setInputFiles({name:'legacy.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(sample))});
   await page.waitForFunction(()=>document.querySelector('#avatar img')?.getAttribute('src')==='./avatar-orbit.svg');
   const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('personal-profile-web-studio:fictional-demo:v1')||'{}'));
   if(stored.appearance)assert.equal(stored.appearance.portrait,'');
   await page.locator('#reset-profile').click();
 })();
 await check('Neon Studio uses the reference portrait and a readable native hero label',async()=>{
   await page.locator('#studio-theme').selectOption('neon-studio');
   const pill=page.locator('main>.hero .neon-eyebrow-pill');
   assert.equal(await pill.isVisible(),true);
   assert.match(await pill.textContent(),/Creative Developer.*Interface Engineer.*Product Builder/);
   const p=await pill.evaluate(el=>({width:el.getBoundingClientRect().width,text:el.textContent.trim(),color:getComputedStyle(el).color}));
   assert.ok(p.width>150 && p.width<700,JSON.stringify(p));
   const photo=page.locator('.hero-art .neon-reference-photo');
   assert.equal(await photo.isVisible(),true);
   const pic=await photo.evaluate(el=>({complete:el.complete,width:el.naturalWidth,rect:el.getBoundingClientRect().toJSON()}));
   assert.ok(pic.complete&&pic.width>0,'Neon reference portrait must decode in Chromium');
   assert.ok(pic.rect.width>=180,'Portrait must have a meaningful visual diameter');
   await page.locator('#studio-theme').selectOption('orbit');
   assert.equal(await photo.isVisible(),false);
   assert.equal(await page.locator('#avatar img').getAttribute('src'),'./avatar-orbit.svg');
 })();
 await check('Design 1 orbit labels follow the right orbital arc and brand is left-aligned',async()=>{
  await page.locator('#studio-theme').selectOption('neon-studio');
  await page.setViewportSize({width:1777,height:832});
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(120);
  const orbit=page.locator('.neon-role-pills .neon-orbit-badge');
  assert.equal(await orbit.count(),5);
  assert.equal(await page.locator('.neon-intro-button').isDisabled(),true,
    'Unimplemented Watch Intro must be genuinely disabled');
  const g=await page.evaluate(()=>{
    const art=document.querySelector('.hero-art').getBoundingClientRect();
    const mid={x:art.left+art.width/2,y:art.top+art.height/2};
    const badges=[...document.querySelectorAll('.neon-role-pills .neon-orbit-badge')].map(el=>{
      const r=el.getBoundingClientRect();return {text:el.textContent.trim(),x:r.x+r.width/2,y:r.y+r.height/2,
        width:r.width,height:r.height,icon:!!el.querySelector('svg'),
        visible:getComputedStyle(el).display!=='none'};
    });
    const first=document.getElementById('demo-brand').getBoundingClientRect();
    const sub=document.querySelector('#demo-brand-wrapper .muted').getBoundingClientRect();
    const overlap=(a,b)=>Math.max(0,Math.min(a.x+a.width/2,b.x+b.width/2)-Math.max(a.x-a.width/2,b.x-b.width/2))*
      Math.max(0,Math.min(a.y+a.height/2,b.y+b.height/2)-Math.max(a.y-a.height/2,b.y-b.height/2));
    return {badges,distances:badges.map(b=>Math.hypot(b.x-mid.x,b.y-mid.y)),
      spanX:Math.max(...badges.map(b=>b.x))-Math.min(...badges.map(b=>b.x)),
      spanY:Math.max(...badges.map(b=>b.y))-Math.min(...badges.map(b=>b.y)),
      brand:{headingTop:first.top,subtitleTop:sub.top,headingLeft:first.left,subtitleLeft:sub.left},
      overlap:badges.some((a,i)=>badges.some((b,j)=>j>i&&overlap(a,b)>12)),
      headerBottom:document.querySelector('.nav-bar').getBoundingClientRect().bottom,
      caption:(()=>{const r=document.querySelector('.hero-art .portrait-caption').getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,width:r.width,height:r.height}})(),
      valueTop:document.querySelector('.neon-value-section').getBoundingClientRect().top,
      overflow:document.documentElement.scrollWidth-innerWidth};
  });
  assert.ok(g.badges.every(b=>b.visible&&b.icon),JSON.stringify(g));
  assert.ok(g.distances.every(d=>d>180&&d<440),'Badges are not around orbit: '+JSON.stringify(g));
  assert.ok(g.spanX<125&&g.spanY>220,'Design 1 role badges must align vertically along the outer right orbit: '+JSON.stringify(g));
  assert.equal(g.overlap,false,'Badges overlap: '+JSON.stringify(g));
  assert.ok(g.badges[0].y-g.badges[0].height/2>g.headerBottom+2,
    'Developer badge is hidden beneath header: '+JSON.stringify(g));
  assert.ok(g.badges.every(b=>b.y+b.height/2<g.valueTop-5),
    'Badge collides with value band: '+JSON.stringify(g));
  const captionOverlap=(a,b)=>Math.max(0,Math.min(a.x+a.width/2,b.x+b.width/2)-Math.max(a.x-a.width/2,b.x-b.width/2))*
    Math.max(0,Math.min(a.y+a.height/2,b.y+b.height/2)-Math.max(a.y-a.height/2,b.y-b.height/2));
  assert.ok(g.badges.every(b=>captionOverlap(b,g.caption)<6),
    'Badge overlaps name caption: '+JSON.stringify(g));
  assert.ok(g.brand.subtitleTop>g.brand.headingTop+10,'Subtitle not stacked under brand title');
  assert.ok(Math.abs(g.brand.subtitleLeft-g.brand.headingLeft)<4,'Brand text not left aligned');
  assert.ok(g.overflow<=2,'Desktop overflow: '+g.overflow);
  const shots=join(root,'dist','visual-audit');
  await mkdir(shots,{recursive:true});
  // Reset real UI state left by earlier functional tests; audit the actual homepage.
  if(await page.locator('#editor').isVisible()) await page.locator('#edit-toggle').click();
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(250);
  await page.screenshot({path:join(shots,'neon-desktop-1777.png'),fullPage:false});
  await page.setViewportSize({width:390,height:844});
  assert.ok(await orbit.first().isVisible());
  const mobileLayout=await page.evaluate(()=>({
    overflow:document.documentElement.scrollWidth-innerWidth,
    bannerHeight:document.querySelector('.banner').getBoundingClientRect().height,
    navHeight:document.querySelector('.nav-bar').getBoundingClientRect().height,
    heroTop:document.querySelector('main>.hero').getBoundingClientRect().top
  }));
  assert.ok(mobileLayout.overflow<=2,'Mobile overflow: '+JSON.stringify(mobileLayout));
  assert.ok(mobileLayout.bannerHeight<=42&&mobileLayout.navHeight<=235&&mobileLayout.heroTop<=290,
    'Mobile utility/header consumes too much of the first viewport: '+JSON.stringify(mobileLayout));
  await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
  await page.waitForTimeout(150);
  await page.screenshot({path:join(shots,'neon-mobile-390.png'),fullPage:false});
  await page.setViewportSize({width:1280,height:900});
 })();
 await check('Design 1 and Design 2 preserve separate screenshot-specific structure',async()=>{
  const choices=await page.locator('#studio-theme option').evaluateAll(list=>list.map(option=>({value:option.value,text:option.textContent})));
  assert.ok(choices.some(x=>x.value==='neon-studio'&&x.text.trim()==='Aurora'),JSON.stringify(choices));
  assert.ok(choices.some(x=>x.value==='design-2'&&x.text.trim()==='Cosmic'),JSON.stringify(choices));
  const shots=join(root,'dist','visual-audit');await mkdir(shots,{recursive:true});
  for(const [theme,width,height] of [['neon-studio',1833,858],['design-2',1672,941]]){
    await page.setViewportSize({width,height});
    await page.locator('#studio-theme').selectOption(theme);
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(150);
    const measurements=await page.evaluate(()=>{
      const visible=selector=>{const e=document.querySelector(selector);return !!e&&getComputedStyle(e).display!=='none'&&e.getBoundingClientRect().width>0;};
      const roleBadges=[...document.querySelectorAll('.neon-role-pills .neon-orbit-badge')];
      const style=roleBadges.map(e=>({display:getComputedStyle(e).display,labelVisible:getComputedStyle(e.querySelector('.neon-orbit-label')).display!=='none'}));
      return {theme:document.body.dataset.theme,utility:visible('.d2-utility'),stats:visible('.d2-stats'),
        four:visible('.d2-feature-row'),six:visible('.neon-feature-grid'),value:visible('.neon-value-section'),
        cards:document.querySelectorAll('.d2-feature-row .d2-feature').length,
        tiles:document.querySelectorAll('.neon-feature-grid .neon-feature-card').length,
        systemText:document.querySelector('#system-menu-trigger').textContent.trim(),
        badges:style,overflow:document.documentElement.scrollWidth-innerWidth};
    });
    const caption=await page.locator('#portrait-caption').evaluate(el=>({
      text:el.textContent.trim(),after:getComputedStyle(el,'::after').content,
      fontSize:parseFloat(getComputedStyle(el).fontSize),
      height:el.getBoundingClientRect().height
    }));
    assert.equal(caption.text,'Dev Das','Reference screenshot must use fictional demo name');
    assert.ok(caption.fontSize>=20,'Nameplate is undersized: '+JSON.stringify(caption));
    assert.ok(caption.height>=38,'Nameplate is too small: '+JSON.stringify(caption));
    assert.equal(caption.after,theme==='design-2'?'"Developer & Creator"':'none',
      'Only Design 2 has the portrait subtitle');
    assert.equal(measurements.theme,theme);
    assert.ok(measurements.overflow<=2,'Horizontal overflow: '+JSON.stringify(measurements));
    assert.equal(measurements.four,theme==='design-2',JSON.stringify(measurements));
    assert.equal(measurements.six,theme==='neon-studio',JSON.stringify(measurements));
    assert.equal(measurements.utility,theme==='design-2',JSON.stringify(measurements));
    assert.equal(measurements.stats,theme==='design-2',JSON.stringify(measurements));
    assert.equal(measurements.value,theme==='neon-studio',JSON.stringify(measurements));
    assert.equal(measurements.cards,4);
    assert.equal(measurements.tiles,6);
    assert.ok(measurements.badges.every(b=>b.labelVisible===(theme==='neon-studio')),JSON.stringify(measurements));
    assert.match(measurements.systemText,theme==='design-2'?/Services/:/System/);
    const source=await page.locator('.hero-art .neon-reference-photo').getAttribute('src');
    assert.equal(source,theme==='design-2'?'./avatar-design-2.svg':'./avatar-neon-studio.svg',
      'Themes must not share the same reference portrait asset');
    await page.waitForFunction(()=>{const im=document.querySelector('.hero-art .neon-reference-photo');
      return im?.complete&&im.naturalWidth>0;});
    await page.screenshot({path:join(shots,theme+'-reference-desktop.png'),fullPage:false});
  }
  for(const theme of ['neon-studio','design-2']){
    await page.setViewportSize({width:390,height:844});
    await page.locator('#studio-theme').selectOption(theme);
    await page.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
    await page.waitForTimeout(120);
    const overflow=await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
    assert.ok(overflow<=2,theme+' mobile overflow '+overflow);
    await page.screenshot({path:join(shots,theme+'-mobile-390.png'),fullPage:false});
  }
  await page.setViewportSize({width:1280,height:900});
  await page.locator('#studio-theme').selectOption('neon-studio');
 })();
 await check('theme round-trip preserves edited content, language, and separate reference assets',async()=>{
   await page.setViewportSize({width:1280,height:900});
   await page.locator('#studio-theme').selectOption('neon-studio');
   await page.locator('#studio-language').selectOption('es');
   if(!(await page.locator('#editor').isVisible()))await page.locator('#edit-toggle').click();
   await page.locator('input[name="displayName"]').fill('Reference Demo');
   await page.locator('input[name="role"]').fill('Custom Fictional Creator');
   await page.locator('#editor button[type="submit"]').click();
   for(const [theme,portrait,first,second] of [
      ['neon-studio','./avatar-neon-studio.svg',true,false],
      ['design-2','./avatar-design-2.svg',false,true],
      ['neon-studio','./avatar-neon-studio.svg',true,false]
   ]){
     await page.locator('#studio-theme').selectOption(theme);
     assert.equal(await page.locator('#name').innerText(),'Reference Demo');
     assert.equal(await page.locator('#role').innerText(),'Custom Fictional Creator');
     assert.match(await page.locator('#portrait-caption').innerText(),/Reference Demo/);
     assert.equal(await page.locator('.hero-art .neon-reference-photo').getAttribute('src'),portrait);
     assert.equal(await page.locator('.d2-feature-row').isVisible(),second);
     assert.equal(await page.locator('.neon-feature-grid').isVisible(),first);
     assert.equal(await page.locator('html').getAttribute('lang'),'es');
     assert.equal(await page.locator('#studio-nav a[data-copy="about"]').innerText(),'Acerca de');
     assert.equal(await page.locator('.neon-intro-button').isDisabled(),true);
   }
   await page.locator('#studio-language').selectOption('en');
   if(!(await page.locator('#editor').isVisible()))await page.locator('#edit-toggle').click();
   await page.locator('#reset-profile').click();
 })();
 await check('highlighted Design 1 header and orbit items match reference semantics',async()=>{
   await page.setViewportSize({width:1833,height:858});
   await page.locator('#studio-theme').selectOption('neon-studio');
   await page.evaluate(()=>scrollTo(0,0));
   await page.waitForTimeout(180);
   const visual=await page.evaluate(()=>{
     const rect=e=>{const r=e.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom};};
     const brand=document.querySelector('.nav-bar .brand');
     const nav=document.querySelector('.nav-links');
     const home=document.querySelector('.nav-links .neon-home-link');
     const menu=document.getElementById('studio-nav-panel');
     const bubbles=[...document.querySelectorAll('.neon-role-pills .neon-orbit-badge')].map(e=>{
       const b=e.querySelector('.neon-orbit-bubble');
       const cs=getComputedStyle(e);
       return {rect:rect(e),icon:rect(b),border:cs.borderTopWidth,background:cs.backgroundColor,labelVisible:getComputedStyle(e.querySelector('.neon-orbit-label')).display!=='none'};
     });
     const photo=document.querySelector('.hero-art .neon-reference-photo');
     const caption=document.querySelector('.hero-art .portrait-caption');
     return {brand:rect(brand),nav:rect(nav),home:rect(home),menu:rect(menu),
       bubbles,photo:rect(photo),caption:rect(caption),
       pageOverflow:document.documentElement.scrollWidth-innerWidth};
   });
   assert.ok(visual.home.x-visual.brand.x<360,'Home is too far from logo: '+JSON.stringify(visual));
   assert.equal(visual.bubbles.length,5);
   assert.ok(visual.bubbles.every(b=>b.border==='0px' && b.labelVisible),'Role labels must not be boxed: '+JSON.stringify(visual));
   assert.ok(visual.bubbles.every(b=>Math.abs(b.icon.width-b.icon.height)<3&&b.icon.width>=35),'Icons must be circular: '+JSON.stringify(visual));
   assert.ok(visual.caption.y>visual.photo.y+visual.photo.height,'Nameplate needs to sit below image: '+JSON.stringify(visual));
   assert.ok(visual.pageOverflow<=2,'No horizontal desktop overflow: '+JSON.stringify(visual));
   await page.locator('#studio-theme').selectOption('design-2');
   assert.equal(await page.locator('.d2-feature-row').isVisible(),true);
   assert.equal(await page.locator('.neon-feature-grid').isVisible(),false);
   await page.locator('#studio-theme').selectOption('neon-studio');
   await page.setViewportSize({width:390,height:844});
   assert.ok((await page.evaluate(()=>document.documentElement.scrollWidth-innerWidth))<=2,'Mobile overflow');
   await page.setViewportSize({width:1280,height:900});
 })();
 await check('Aurora and Cosmic load distinct reference imagery without theme leakage',async()=>{
  const images=[
    ['neon-studio','aurora-reference-horizon.svg'],
    ['design-2','cosmic-reference-wave.svg']
  ];
  for(const [theme,filename] of images){
    await page.locator('#studio-theme').selectOption(theme);
    await page.setViewportSize({width:theme==='neon-studio'?1777:1833,height:theme==='neon-studio'?941:858});
    const actual=await page.evaluate(()=>{
      const hero=document.querySelector('main>.hero');
      return {background:getComputedStyle(hero,'::before').backgroundImage,overflow:document.documentElement.scrollWidth-innerWidth};
    });
    assert.ok(actual.background.includes(filename),theme+' wrong background: '+JSON.stringify(actual));
    assert.ok(actual.overflow<=2,theme+' horizontal overflow: '+JSON.stringify(actual));
    const response=await page.evaluate(async name=>{
      const r=await fetch(name);
      return {status:r.status,body:await r.text()};
    },filename);
    assert.equal(response.status,200,filename+' not published');
    assert.match(response.body,/<svg/);
  }
  await page.setViewportSize({width:1280,height:900});
  await page.locator('#studio-theme').selectOption('neon-studio');
 })();
 await check('Desktop reference screenshot checks start from fresh clean homepages',async()=>{
   for(const [variant,w,h,file] of [
     ['neon-studio',1833,858,'aurora-reference-menu-desktop.png'],
     ['design-2',1672,941,'cosmic-reference-menu-desktop.png']
   ]){
     const visual=await browser.newPage({viewport:{width:w,height:h},deviceScaleFactor:1});
     try{
       await visual.goto(url,{waitUntil:'load'});
       await visual.locator('#studio-theme').selectOption(variant);
       await visual.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
       await visual.waitForTimeout(1100);
       assert.equal(await visual.locator('#editor').isVisible(),false,'Screenshots must not show an open editor');
       assert.equal(await visual.locator('#studio-nav-panel').isVisible(),true,'Studio menu must be open for '+variant);
       assert.equal(await visual.locator('#system-menu-panel').isVisible(),variant==='neon-studio','System menu should appear only in Aurora');
       assert.equal(await visual.locator('.cosmic-menu-reference').isVisible(),variant==='design-2','Cosmic groups should appear only in Cosmic');
       if(variant==='neon-studio'){
         const layout=await visual.evaluate(()=>{
           const box=id=>{const r=document.querySelector(id).getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,right:r.right,bottom:r.bottom}};
           return {studio:box('#studio-nav-panel'),system:box('#system-menu-panel'),hero:box('main>.hero'),value:box('.neon-value-section')};
         });
         assert.ok(layout.studio.x>700&&layout.studio.x<920,'Aurora Studio menu offset '+JSON.stringify(layout));
         assert.ok(layout.system.x>950&&layout.system.x<1250,'Aurora System menu offset '+JSON.stringify(layout));
         assert.ok(layout.system.height<390,'Aurora System panel too tall '+JSON.stringify(layout));
         assert.ok(layout.value.y>=layout.hero.bottom-10&&layout.value.y<630,'Aurora value band is too low '+JSON.stringify(layout));
       }else{
         const x=await visual.locator('#studio-nav-panel').evaluate(el=>el.getBoundingClientRect().x);
         assert.ok(x>800&&x<1000,'Cosmic long Studio menu is too far right: '+x);
       }
       const geometry=await visual.evaluate(()=>{
         const box=e=>{const r=e.getBoundingClientRect();return {top:r.top,left:r.left,bottom:r.bottom,width:r.width,height:r.height}};
         const hero=document.querySelector('main>.hero'),heading=document.querySelector('main>.hero h1');
         return {scrollY,hero:box(hero),heading:box(heading),
           horizontalOverflow:document.documentElement.scrollWidth-innerWidth};
       });
       assert.equal(geometry.scrollY,0,'Screenshot scrolled away from top '+JSON.stringify(geometry));
       assert.ok(geometry.hero.top>=0&&geometry.hero.top<h*.3,'Screenshot is not showing the hero '+JSON.stringify(geometry));
       assert.ok(geometry.heading.top>geometry.hero.top&&geometry.heading.top<h*.55,'Hero title outside screenshot '+JSON.stringify(geometry));
       assert.ok(geometry.horizontalOverflow<=2,'Desktop overflow '+JSON.stringify(geometry));
       const collision=await visual.evaluate(()=>{
         const photo=document.querySelector('.hero-art .neon-reference-photo').getBoundingClientRect();
         const panel=document.querySelector(document.body.dataset.theme==='neon-studio'?'#system-menu-panel':'#studio-nav-panel').getBoundingClientRect();
         const badges=[...document.querySelectorAll('.neon-role-pills .neon-orbit-badge')]
           .filter(e=>getComputedStyle(e).display!=='none').map(e=>e.getBoundingClientRect().right);
         return {photoLeft:photo.left,menuRight:panel.right,overlap:Math.max(0,panel.right-photo.left),
           maxBadgeRight:Math.max(...badges,0),vw:window.innerWidth};
       });
       if(variant==='neon-studio'){
         assert.ok(collision.overlap<75,'Aurora System panel covers too much portrait: '+JSON.stringify(collision));
         assert.ok(collision.maxBadgeRight<collision.vw-7,'Aurora orbit roles clip at screen edge: '+JSON.stringify(collision));
       }else{
         assert.ok(collision.overlap<15,'Cosmic Studio menu hides face: '+JSON.stringify(collision));
       }
       if(variant==='design-2'){
         assert.ok(await visual.locator('.cosmic-menu-reference button:disabled').count()>=4);
         assert.ok(await visual.locator('.cosmic-menu-reference button:not(:disabled)').count()>=4);
       }
       await visual.screenshot({path:join(root,'dist','visual-audit',file),fullPage:false});
       await visual.mouse.click(40,550);
       assert.equal(await visual.locator('#studio-nav-panel').isVisible(),false,'Outside pointerdown must close Studio menu');
     }finally{await visual.close();}
   }
   const mobile=await browser.newPage({viewport:{width:390,height:844}});
   try{
     await mobile.goto(url);
     await mobile.locator('#studio-theme').selectOption('neon-studio');
     await mobile.waitForTimeout(120);
     assert.equal(await mobile.locator('#studio-nav-panel').isVisible(),false);
     assert.equal(await mobile.locator('#system-menu-panel').isVisible(),false);
     assert.ok(await mobile.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=2);
   }finally{await mobile.close();}
 })();
 await check('shared Web Studio utility banner keeps one structure with six theme-specific skins',async()=>{
  const fresh=await browser.newPage({viewport:{width:1440,height:900},deviceScaleFactor:1});
  try{
    await fresh.goto(url,{waitUntil:'load'});
    const themes=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
    const colors=new Set();
    const shots=join(root,'dist','visual-audit');
    await mkdir(shots,{recursive:true});
    for(const theme of themes){
      await fresh.locator('#studio-theme').selectOption(theme);
      await fresh.waitForTimeout(80);
      const state=await fresh.evaluate(()=>{
        const banner=document.querySelector('.studio-utility-bar');
        const brand=banner.querySelector('.studio-utility-brand');
        const shield=banner.querySelector('.studio-utility-shield');
        const trust=banner.querySelector('.studio-utility-trust');
        const bar=banner.getBoundingClientRect(),left=brand.getBoundingClientRect(),right=trust.getBoundingClientRect();
        const visible=e=>{const s=getComputedStyle(e);const r=e.getBoundingClientRect();return s.display!=='none'&&s.visibility!=='hidden'&&r.width>0&&r.height>0};
        return {theme:document.body.dataset.theme,bg:getComputedStyle(banner).backgroundImage||getComputedStyle(banner).backgroundColor,
          color:getComputedStyle(banner).color,barHeight:bar.height,brandCount:banner.querySelectorAll('.studio-utility-brand').length,
          trustCount:banner.querySelectorAll('.studio-utility-trust').length,
          shieldVisible:visible(shield),brandVisible:visible(brand),trustVisible:visible(trust),
          leftRight:left.right,rightLeft:right.left,overflow:document.documentElement.scrollWidth-innerWidth,
          brandText:brand.textContent,trustText:trust.textContent,disclosure:banner.querySelector('.sr-only')?.textContent};
      });
      assert.equal(state.theme,theme);
      assert.equal(state.brandCount,1,JSON.stringify(state));
      assert.equal(state.trustCount,1,JSON.stringify(state));
      assert.ok(state.shieldVisible&&state.brandVisible&&state.trustVisible,JSON.stringify(state));
      assert.ok(state.brandText.includes('WebStudio')&&state.brandText.includes('DevDas Development')&&!state.brandText.includes('LifeSphere'),JSON.stringify(state));
      assert.ok(state.trustText.includes('You are in control'),JSON.stringify(state));
      assert.match(state.disclosure||'',/FICTIONAL DEMO PROFILE/i);
      assert.ok(state.barHeight>=35&&state.barHeight<=50,JSON.stringify(state));
      assert.ok(state.leftRight<=state.rightLeft+2,'Banner items overlap '+JSON.stringify(state));
      assert.ok(state.overflow<=2,'Desktop banner overflow '+JSON.stringify(state));
      colors.add(state.bg);
      await fresh.screenshot({path:join(shots,'utility-'+theme+'-desktop.png'),clip:{x:0,y:0,width:1440,height:Math.ceil(state.barHeight+2)}});
      await fresh.setViewportSize({width:390,height:844});
      const mobile=await fresh.evaluate(()=>{
        const b=document.querySelector('.studio-utility-bar');
        const left=b.querySelector('.studio-utility-brand').getBoundingClientRect();
        const right=b.querySelector('.studio-utility-trust').getBoundingClientRect();
        return {h:b.getBoundingClientRect().height,overflow:document.documentElement.scrollWidth-innerWidth,leftRight:left.right,rightLeft:right.left,trustVisible:getComputedStyle(b.querySelector('.studio-utility-trust')).display!=='none'};
      });
      assert.ok(mobile.h<=42&&mobile.overflow<=2&&mobile.leftRight<=mobile.rightLeft+2&&mobile.trustVisible,theme+': '+JSON.stringify(mobile));
      await fresh.setViewportSize({width:1440,height:900});
    }
    assert.ok(colors.size>=5,'Theme colors did not vary across layouts: '+JSON.stringify([...colors]));
  }finally{await fresh.close();}
 })();
 await check('all nine translations cover shared UI, both reference themes and default hero without changing customer edits',async()=>{
  const langPack=JSON.parse(await readFile(join(root,'examples','customer-demo','i18n-theme.json'),'utf8')).translations;
  const visual=await browser.newPage({viewport:{width:1440,height:900}});
  try{
    await visual.goto(url,{waitUntil:'load'});
    assert.equal(await visual.evaluate(()=>window.StudioI18nReady),true,'Local translation dictionaries did not initialize');
    for(const lang of ['hi','bn','es','fr','de','pt','ar','zh-CN','ja']){
      await visual.locator('#studio-language').selectOption(lang);
      const expected=langPack[lang];
      assert.equal((await visual.locator('.studio-utility-brand strong').textContent()).trim(),'WebStudio',lang+' app brand remains unchanged');
      assert.equal(await visual.locator('.studio-utility-trust span').textContent(),expected['You are in control of your web presence and your data'],lang+' trust line');
      assert.equal(await visual.locator('.cosmic-menu-section h3').first().textContent(),expected['Profile & Content'],lang+' dropdown category');
      assert.equal(await visual.locator('.cosmic-menu-label').first().textContent(),expected['Edit Profile'],lang+' dropdown action');
      await visual.locator('#studio-theme').selectOption('neon-studio');
      assert.equal(await visual.locator('#role').textContent(),expected['Creative Developer & Interface Engineer'],lang+' Aurora role');
      await visual.locator('#studio-theme').selectOption('design-2');
      assert.equal(await visual.locator('#role').textContent(),expected['Developer · Designer · Creator'],lang+' Cosmic role');
      assert.equal(await visual.locator('.d2-feature h3').first().textContent(),expected['Everlasting Presence'],lang+' product card');
      const state=await visual.evaluate(()=>({lang:document.documentElement.lang,dir:document.documentElement.dir,
        overflow:document.documentElement.scrollWidth-innerWidth}));
      assert.equal(state.lang,lang);
      assert.equal(state.dir,lang==='ar'?'rtl':'ltr');
      assert.ok(state.overflow<=2,lang+' 1440px overflow '+JSON.stringify(state));
    }
    await visual.locator('#studio-language').selectOption('en');
    assert.equal(await visual.locator('#role').textContent(),'Developer · Designer · Creator','English restore');
    assert.equal(await visual.locator('.studio-utility-brand strong').textContent(),'WebStudio','Brand restore');
    await visual.locator('#studio-theme').selectOption('neon-studio');
    assert.equal(await visual.locator('#role').textContent(),'Creative Developer & Interface Engineer','Theme identity restores');
    await visual.setViewportSize({width:390,height:844});
    await visual.locator('#studio-language').selectOption('ar');
    const mobile=await visual.evaluate(()=>({dir:document.documentElement.dir,overflow:document.documentElement.scrollWidth-innerWidth,
      height:document.querySelector('.studio-utility-bar').getBoundingClientRect().height}));
    assert.equal(mobile.dir,'rtl');
    assert.ok(mobile.height<=42&&mobile.overflow<=2,'Arabic mobile UI overflow '+JSON.stringify(mobile));
    await visual.locator('#studio-language').selectOption('en');
  }finally{await visual.close();}
 })();
 await check('dynamically inserted localized menu text, accessible labels and user content stay correct through language switches',async()=>{
   const fresh=await browser.newPage({viewport:{width:1280,height:900}});
   try{
     await fresh.goto(url,{waitUntil:'load'});
     assert.equal(await fresh.evaluate(()=>window.StudioI18nReady),true);
     await fresh.locator('#studio-language').selectOption('es');
     const sources=await fresh.evaluate(()=>{
       const i18n=window.StudioI18n;
       const original='Background & Theme',span=document.createElement('span');
       span.id='test-dynamic-l10n';span.textContent=i18n.translate(original,'es');
       span.setAttribute('aria-label',i18n.translate('Edit Profile','es'));
       document.querySelector('main').append(span);
       const custom=document.createElement('textarea');custom.id='test-customer-preserve';custom.value='My original creative project';document.querySelector('main').append(custom);
       return {source:span.textContent,aria:span.getAttribute('aria-label')};
     });
     assert.notEqual(sources.source,'Background & Theme');
     await fresh.locator('#studio-language').selectOption('hi');
     await fresh.waitForTimeout(80);
     const hindi=await fresh.evaluate(()=>({
       text:document.querySelector('#test-dynamic-l10n').textContent,
       aria:document.querySelector('#test-dynamic-l10n').getAttribute('aria-label'),
       personal:document.querySelector('#test-customer-preserve').value
     }));
     assert.equal(hindi.text,'पृष्ठभूमि और थीम');
     assert.equal(hindi.aria,'प्रोफ़ाइल संपादित करें');
     assert.equal(hindi.personal,'My original creative project');
     await fresh.evaluate(()=>{
       const node=document.querySelector('#test-dynamic-l10n');
       node.setAttribute('title','Advanced Tools');
       node.firstChild.nodeValue='Background & Theme';
     });
     await fresh.waitForTimeout(80);
     assert.equal(await fresh.locator('#test-dynamic-l10n').getAttribute('title'),'उन्नत उपकरण');
     assert.equal(await fresh.locator('#test-dynamic-l10n').textContent(),'पृष्ठभूमि और थीम');
     await fresh.locator('#studio-language').selectOption('en');
     assert.equal(await fresh.locator('#test-dynamic-l10n').textContent(),'Background & Theme');
     assert.equal(await fresh.locator('#test-dynamic-l10n').getAttribute('aria-label'),'Edit Profile');
     assert.equal(await fresh.locator('#test-dynamic-l10n').getAttribute('title'),'Advanced Tools');
     await fresh.locator('#studio-language').selectOption('ar');
     assert.equal(await fresh.locator('#test-dynamic-l10n').textContent(),'الخلفية والسمة');
     assert.equal(await fresh.evaluate(()=>document.documentElement.dir),'rtl');
   }finally{await fresh.close();}
 })();
 await check('Aurora and Cosmic branded themes persist, switch cleanly, and guided tour reaches Cosmic',async()=>{
   const p=await browser.newPage({viewport:{width:1280,height:900}});
   try{
     await p.goto(url,{waitUntil:'load'});
     const options=await p.locator('#studio-theme option').evaluateAll(nodes=>nodes.map(n=>({id:n.value,label:n.textContent.trim()})));
     assert.deepEqual(options.filter(x=>['neon-studio','design-2'].includes(x.id)),
       [{id:'neon-studio',label:'Aurora'},{id:'design-2',label:'Cosmic'}]);
     assert.ok(options.every(o=>!/^Design [12]/.test(o.label)),'Obsolete names remain in dropdown');
     await p.locator('#studio-theme').selectOption('design-2');
     assert.equal(await p.locator('body').getAttribute('data-theme'),'design-2');
     assert.equal(await p.locator('.d2-feature-row').isVisible(),true);
     assert.equal(await p.locator('.neon-feature-grid').isVisible(),false);
     await p.reload();
     assert.equal(await p.locator('#studio-theme').inputValue(),'design-2','Cosmic saved theme lost');
     await p.locator('#studio-theme').selectOption('neon-studio');
     assert.equal(await p.locator('.neon-feature-grid').isVisible(),true);
     assert.equal(await p.locator('.d2-feature-row').isVisible(),false);
     await p.reload();
     assert.equal(await p.locator('#studio-theme').inputValue(),'neon-studio','Aurora saved theme lost');
     await p.locator('#tour-start').click();
     assert.equal(await p.locator('#demo-tour').isVisible(),true);
     await p.locator('#tour-next').click();
     assert.match(await p.locator('#tour-title').textContent(),/^Six themes/);
     await p.locator('#tour-try').click();
     assert.equal(await p.locator('#demo-tour').isVisible(),false);
     assert.equal(await p.locator('#studio-theme').inputValue(),'design-2');
     assert.equal(await p.locator('#studio-theme option:checked').textContent(),'Cosmic');
     await p.locator('#studio-language').selectOption('hi');
     assert.equal(await p.locator('#studio-theme option:checked').textContent(),'Cosmic','Theme name must remain its brand name');
     assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth)<=2,true);
   }finally{await p.close();}
 })();
 await check('product catalog reflects six actual themes in every language without exposing unfinished checkout',async()=>{
   const p=await browser.newPage({viewport:{width:1366,height:768}});
   try{
     await p.goto(url,{waitUntil:'load'});
     const themes=await p.locator('#studio-theme option').count();
     assert.equal(themes,6);
     assert.equal(await p.locator('#checkout-button').isDisabled(),true);
     const phrases={
       en:/six themes/i,hi:/छह थीम/,bn:/ছয়টি থিম/,es:/seis temas/i,
       fr:/six thèmes/i,de:/sechs designs/i,pt:/seis temas/i,ar:/ست سمات/,
       'zh-CN':/六种主题/,ja:/6 種のテーマ/
     };
     for(const [lang,expected] of Object.entries(phrases)){
       await p.locator('#studio-language').selectOption(lang);
       assert.match(await p.locator('[data-i18n="availableNow"]').textContent(),expected,lang+' six-theme product statement');
       assert.equal(await p.locator('#checkout-button').isDisabled(),true,lang+' disabled checkout');
     }
     await p.locator('#studio-language').selectOption('en');
     assert.match(await p.locator('.price-card').first().textContent(),/Six visual themes, including Aurora and Cosmic/);
     assert.equal(await p.locator('#checkout-button').isDisabled(),true);
   }finally{await p.close();}
 })();
 await check('Cosmic orbit portrait, satellites and nameplate have stable non-overlapping geometry',async()=>{
   const visual=await browser.newPage({viewport:{width:1672,height:941},deviceScaleFactor:1});
   try{
     await visual.goto(url,{waitUntil:'load'});
     await visual.locator('#studio-theme').selectOption('design-2');
     await visual.evaluate(()=>window.scrollTo({top:0,behavior:'instant'}));
     await visual.waitForTimeout(350);
     const measure=()=>visual.evaluate(()=>{
       const art=document.querySelector('.hero-art');
       const photo=art.querySelector('.neon-reference-photo').getBoundingClientRect();
       const caption=art.querySelector('.portrait-caption').getBoundingClientRect();
       const badges=[...art.querySelectorAll('.neon-orbit-badge')].filter(el=>getComputedStyle(el).display!=='none')
         .map(el=>{const r=el.getBoundingClientRect();return {x:r.x,y:r.y,width:r.width,height:r.height,cx:r.x+r.width/2,cy:r.y+r.height/2};});
       const area=art.getBoundingClientRect();
       const center={x:photo.x+photo.width/2,y:photo.y+photo.height/2};
       return {width:window.innerWidth,photo:{x:photo.x,y:photo.y,width:photo.width,height:photo.height,
           right:photo.right,bottom:photo.bottom},
         caption:{x:caption.x,y:caption.y,width:caption.width,height:caption.height,right:caption.right,bottom:caption.bottom},
         badges,center,area:{x:area.x,width:area.width},scrollWidth:document.documentElement.scrollWidth,
         source:art.querySelector('.neon-reference-photo').getAttribute('src'),
         ratio:devicePixelRatio};
     });
     let g=await measure();
     assert.match(g.source,/avatar-design-2\.svg/);
     assert.ok(g.photo.width>=265&&g.photo.width<=300,'Portrait scaling not controlled: '+JSON.stringify(g));
     assert.ok(g.caption.y>=g.photo.bottom+12,'Nameplate overlaps photo: '+JSON.stringify(g));
     assert.equal(g.badges.length,4,'Cosmic must have four independent orbit icons');
     assert.ok(g.badges.every(b=>Math.hypot(b.cx-g.center.x,b.cy-g.center.y)>g.photo.width*.58),
       'Orbit satellites overlap the portrait: '+JSON.stringify(g));
     assert.ok(g.badges.every(b=>b.x>=0&&b.x+b.width<=g.width+1),
       'Satellite clipped at desktop edge: '+JSON.stringify(g));
     assert.ok(g.scrollWidth<=g.width+2,'Desktop horizontal overflow: '+JSON.stringify(g));
     assert.ok(g.caption.bottom<=941,'Nameplate falls outside screenshot: '+JSON.stringify(g));
     await visual.screenshot({path:join(root,'dist','visual-audit','cosmic-orbit-fidelity-1672.png'),fullPage:false});
     await visual.setViewportSize({width:390,height:844});
     await visual.waitForTimeout(100);
     g=await measure();
     assert.ok(g.photo.width>=185&&g.photo.width<=242,'Mobile photo size: '+JSON.stringify(g));
     assert.ok(g.caption.y>=g.photo.bottom+5,'Mobile caption overlaps photo: '+JSON.stringify(g));
     assert.ok(g.badges.every(b=>b.x>=-1&&b.x+b.width<=390+1),'Mobile clipped icon: '+JSON.stringify(g));
     assert.ok(g.scrollWidth<=392,'Cosmic mobile overflow: '+JSON.stringify(g));
     await visual.screenshot({path:join(root,'dist','visual-audit','cosmic-orbit-fidelity-390.png'),fullPage:false});
     await visual.locator('#studio-theme').selectOption('neon-studio');
     assert.equal(await visual.locator('.neon-role-pills .neon-orbit-badge:visible').count(),5,
       'Aurora five-role arrangement was unintentionally changed');
   }finally{await visual.close();}
 })();
 await check('Cosmic four satellite centers use exactly one circular radius at desktop and mobile viewports',async()=>{
   const fresh=await browser.newPage({viewport:{width:1672,height:941},deviceScaleFactor:1});
   try{
     await fresh.goto(url,{waitUntil:'load'});
     await fresh.locator('#studio-theme').selectOption('design-2');
     for(const [width,height] of [[1672,941],[1440,900],[768,900],[390,844]]){
       await fresh.setViewportSize({width,height});
       await fresh.evaluate(()=>scrollTo({top:0,behavior:'instant'}));
       await fresh.waitForTimeout(160);
       const result=await fresh.evaluate(()=>{
         const art=document.querySelector('main>.hero .hero-art');
         const p=art.querySelector('.neon-reference-photo').getBoundingClientRect();
         const cx=p.left+p.width/2,cy=p.top+p.height/2;
         const css=getComputedStyle(art);
         const badges=[...art.querySelectorAll('.neon-role-pills .neon-orbit-badge')]
           .filter(e=>getComputedStyle(e).display!=='none').map(e=>{
             const r=e.getBoundingClientRect(), x=r.left+r.width/2,y=r.top+r.height/2;
             return {x,y,dist:Math.hypot(x-cx,y-cy),angle:getComputedStyle(e).getPropertyValue('--cosmic-angle').trim(),
               left:r.left,right:r.right,top:r.top,bottom:r.bottom};
           });
         return {cx,cy,badges,diameter:p.width,viewport:innerWidth,
           scrollWidth:document.documentElement.scrollWidth,
           declaredRadius:css.getPropertyValue('--cosmic-orbit-radius').trim()};
       });
       assert.equal(result.badges.length,4,'Cosmic four icons lost at '+width+': '+JSON.stringify(result));
       const radii=result.badges.map(b=>b.dist);
       const spread=Math.max(...radii)-Math.min(...radii);
       assert.ok(spread<=2,'Icons not on a single circumference at '+width+' spread='+spread+': '+JSON.stringify(result));
       assert.ok(radii.every(x=>x>result.diameter*.60),'Icons intrude on portrait at '+width+': '+JSON.stringify(result));
       assert.ok(result.badges.every(b=>b.left>=-1&&b.right<=width+1),
         'Cosmic badge clipped at '+width+': '+JSON.stringify(result));
       assert.ok(result.scrollWidth<=width+2,'Cosmic horizontal overflow at '+width+': '+JSON.stringify(result));
       await fresh.screenshot({path:join(root,'dist','visual-audit','cosmic-shared-orbit-'+width+'.png'),fullPage:false});
     }
     await fresh.locator('#studio-theme').selectOption('neon-studio');
     assert.equal(await fresh.locator('.neon-role-pills .neon-orbit-badge:visible').count(),5,
       'Aurora role badges must remain untouched');
   }finally{await fresh.close();}
 })();
 await check('fresh isolated native and mobile theme screenshots retain distinct reference structures',async()=>{
   const cases=[
     {theme:'neon-studio',width:1833,height:858,count:5,features:6,name:'aurora'},
     {theme:'design-2',width:1672,height:941,count:4,features:4,name:'cosmic'},
     {theme:'neon-studio',width:390,height:844,count:5,features:6,name:'aurora-mobile'},
     {theme:'design-2',width:390,height:844,count:4,features:4,name:'cosmic-mobile'}
   ];
   for(const c of cases){
     // Fresh context prevents edited profile, locale, open menus and storage from contaminating references.
     const context=await browser.newContext({viewport:{width:c.width,height:c.height},deviceScaleFactor:1,reducedMotion:'reduce'});
     const p=await context.newPage();
     try{
       await p.goto(url,{waitUntil:'load'});
       await p.locator('#studio-theme').selectOption(c.theme);
       await p.evaluate(()=>{window.scrollTo(0,0);document.querySelector('#editor')?.classList.remove('open');});
       await p.evaluate(()=>document.fonts.ready);
       await p.waitForTimeout(150);
       const g=await p.evaluate(()=>{
         const shown=el=>el&&getComputedStyle(el).display!=='none';
         return {scrollY,scrollWidth:document.documentElement.scrollWidth,width:innerWidth,
           editorOpen:document.querySelector('#editor')?.classList.contains('open'),
           badges:[...document.querySelectorAll('.neon-role-pills .neon-orbit-badge')].filter(shown).length,
           cards:[...document.querySelectorAll(document.body.dataset.theme==='design-2'?'.d2-feature-row .d2-feature':'.neon-feature-grid .neon-feature-card')].filter(el=>el.getClientRects().length>0).length,
           selected:document.querySelector('#studio-theme').value,
           caption:document.querySelector('#portrait-caption')?.textContent?.trim()};
       });
       assert.equal(g.selected,c.theme,JSON.stringify(g));
       assert.equal(g.scrollY,0,'Fresh reference page not at top');
       assert.equal(g.editorOpen,false,'Editor leaked into reference capture');
       assert.equal(g.badges,c.count,c.name+' orbit badges: '+JSON.stringify(g));
       assert.equal(g.cards,c.features,c.name+' feature cards: '+JSON.stringify(g));
       assert.ok(g.scrollWidth<=g.width+2,c.name+' horizontal overflow: '+JSON.stringify(g));
       await p.screenshot({path:join(root,'dist','visual-audit','isolated-'+c.name+'-'+c.width+'.png'),fullPage:false,animations:'disabled'});
     }finally{await context.close();}
   }
 })();
 await check('all ten locales preserve theme selector focus visibility and mobile overflow',async()=>{
   const locales=['en','hi','bn','es','fr','de','pt','ar','zh-CN','ja'];
   const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
   try{
     const p=await context.newPage();
     await p.goto(url,{waitUntil:'load'});
     for(const theme of ['neon-studio','design-2']){
       await p.locator('#studio-theme').selectOption(theme);
       for(const locale of locales){
         await p.locator('#studio-language').selectOption(locale);
         await p.locator('#studio-language').focus();
         const v=await p.evaluate(()=>{
           const e=document.querySelector('#studio-language');
           const r=e.getBoundingClientRect(),style=getComputedStyle(e);
           return {lang:document.documentElement.lang,dir:document.documentElement.dir,
             outline:style.outlineStyle,outlineWidth:parseFloat(style.outlineWidth),
             scrollWidth:document.documentElement.scrollWidth,width:innerWidth,
             rect:{left:r.left,right:r.right},selected:document.querySelector('#studio-theme option:checked').textContent.trim()};
         });
         assert.equal(v.lang,locale,'Wrong document language '+locale);
         assert.equal(v.dir,locale==='ar'?'rtl':'ltr','Direction mismatch '+locale);
         assert.ok(v.rect.left>=-1&&v.rect.right<=391,'Language selector clipped: '+JSON.stringify(v));
         assert.ok(v.scrollWidth<=392,'Locale/theme horizontal overflow: '+JSON.stringify({theme,locale,...v}));
         assert.ok(v.outline!=='none'&&v.outlineWidth>=2,'Keyboard focus invisible: '+JSON.stringify({theme,locale,...v}));
         assert.equal(v.selected,theme==='neon-studio'?'Aurora':'Cosmic');
       }
     }
     await p.locator('#studio-language').selectOption('en');
     assert.equal(await p.locator('#studio-language').inputValue(),'en');
   }finally{await context.close();}
 })();
 await check('Social Studio local A/B onboarding and public HTTPS links persist without network publishing',async()=>{
   const p=await browser.newPage({viewport:{width:1280,height:900},acceptDownloads:true});
   try{
     await p.goto(url,{waitUntil:'load'});
     assert.equal(await p.locator('#social-studio').isVisible(),true);
     assert.equal(await p.locator('#social-variant option').count(),2);
     assert.equal(await p.getByRole('button',{name:/Connect OAuth accounts/}).isDisabled(),true);
     assert.equal(await p.getByRole('button',{name:/Publish to social networks/}).isDisabled(),true);
     const original=await p.locator('#social-variant').inputValue();
     assert.ok(['A','B'].includes(original));
     await p.locator('#social-variant').selectOption(original==='A'?'B':'A');
     assert.match(await p.locator('#social-status').textContent(),/local preview/);
     await p.locator('#social-reset-variant').click();
     assert.equal(await p.locator('#social-variant').inputValue(),original,'Experiment assignment must remain stable');
     await p.locator('#social-link-form select[name="platform"]').selectOption('GitHub');
     await p.locator('#social-link-form input[name="url"]').fill('https://github.com/example-demo');
     await p.locator('#social-link-form button[type="submit"]').click();
     assert.equal(await p.locator('#social-links-list a').count(),1);
     assert.equal(await p.locator('#social-links-list a').getAttribute('rel'),'noopener noreferrer nofollow');
     await p.locator('#social-draft-form input[name="title"]').fill('Social MVP demo');
     await p.locator('#social-draft-form textarea[name="caption"]').fill('<img src=x onerror=alert(1)>');
     await p.locator('#social-draft-form button[type="submit"]').click();
     assert.equal(await p.locator('.social-draft-card').count(),1);
     assert.equal(await p.locator('.social-draft-card img').count(),0,'Draft content must never parse as HTML');
     assert.match(await p.locator('.social-draft-card p').textContent(),/<img src=x onerror=alert\(1\)>/);
     await p.reload();
     assert.equal(await p.locator('#social-links-list a').count(),1);
     assert.equal(await p.locator('.social-draft-card').count(),1);
     assert.equal(await p.locator('#social-variant').inputValue(),original);
     const downloadPromise=p.waitForEvent('download');
     await p.locator('#social-export').click();
     const download=await downloadPromise;
     assert.equal(download.suggestedFilename(),'web-studio-social-drafts.json');
     assert.match(await p.locator('#social-status').textContent(),/exported as JSON/);
   }finally{await p.close();}
 })();
 await check('Social Studio import validation and six-theme mobile layouts remain safe',async()=>{
   const p=await browser.newPage({viewport:{width:390,height:844}});
   try{
     await p.goto(url,{waitUntil:'load'});
     const invalid=Buffer.from(JSON.stringify({version:1,links:[{platform:'X',url:'javascript:alert(1)'}],drafts:[]}));
     await p.locator('#social-import').setInputFiles({name:'bad.json',mimeType:'application/json',buffer:invalid});
     assert.match(await p.locator('#social-status').textContent(),/Import rejected/);
     const imported=Buffer.from(JSON.stringify({version:1,links:[{platform:'LinkedIn',url:'https://www.linkedin.com/company/example-demo'}],drafts:[{platform:'Bluesky',title:'A local post',caption:'Only in the browser',created:'2026-11-21',id:'demo'}]}));
     await p.locator('#social-import').setInputFiles({name:'good.json',mimeType:'application/json',buffer:imported});
     assert.match(await p.locator('#social-status').textContent(),/imported locally/);
     assert.equal(await p.locator('.social-draft-card').count(),1);
     assert.equal(await p.locator('#social-links-list a').count(),1);
     for(const theme of ['orbit','editorial','terminal','aurora-peak','neon-studio','design-2']){
       await p.locator('#studio-theme').selectOption(theme);
       const m=await p.evaluate(()=>{
         const r=document.querySelector('#social-studio').getBoundingClientRect();
         return {scrollWidth:document.documentElement.scrollWidth,width:innerWidth,sectionWidth:r.width,sectionLeft:r.left};
       });
       assert.ok(m.scrollWidth<=m.width+2,'Social mobile horizontal overflow '+theme+': '+JSON.stringify(m));
       assert.ok(m.sectionLeft>=0&&m.sectionWidth>200,theme+' social section clipped '+JSON.stringify(m));
     }
     const link=await p.locator('#social-links-list a').first().getAttribute('href');
     assert.equal(link,'https://www.linkedin.com/company/example-demo');
     assert.equal(await p.getByRole('button',{name:/Publish to social networks/}).isDisabled(),true);
   }finally{await p.close();}
 })();
 await page.close();
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
assert.equal(passed,68);
console.log('Browser checks passed: '+passed);
