import { createServer } from 'node:http';
import {readFile} from 'node:fs/promises';
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
  if(!['/','/index.html','/app.js','/premium.css','/premium.js','/studio-features.css','/studio-features.js','/illustrated-developer.svg','/studio-polish.css','/studio-tour.js','/commerce.js','/commerce.json','/studio-product.css','/studio-layout-fixes.css','/studio-visual-final.css','/studio-i18n.js','/studio-ownership.js','/studio-system-menu.css','/studio-system-menu.js','/i18n-product.json','/i18n-ui.json','/i18n-copy.json','/i18n-profile.json','/i18n-dynamic.json','/profile.json','/robots.txt'].includes(path)){response.writeHead(404);response.end('Not found');return;}
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
  assert.equal(await page.locator('#name').innerText(),'Nico Vale');
  assert.equal(await page.locator('#projects article').count(),3);
  assert.equal(await page.locator('.nav-links a').count(),5);
  assert.equal(await page.locator('.orbit').count(),2);
 })();
 await check('editing and saving fields works',async()=>{
  await page.getByRole('button',{name:'Customize demo'}).click();
  await page.locator('input[name="displayName"]').fill('Taylor Demo');
  await page.locator('input[name="role"]').fill('Design Engineer');
  await page.getByRole('button',{name:'Save & preview'}).click();
  assert.equal(await page.locator('#name').innerText(),'Taylor Demo');
  assert.equal(await page.locator('#role').innerText(),'Design Engineer');
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
  assert.equal(await page.locator('#name').innerText(),'Nico Vale');
 })();

 await check('original-inspired fictional portrait loads',async()=>{
   const img=page.locator('#avatar img.demo-portrait');
   await img.waitFor();
   assert.ok(await img.evaluate(el=>el.complete && el.naturalWidth > 0));
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
   assert.equal(await page.locator('#studio-nav a').first().innerText(),'Acerca de');
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
 await check('offline proposal wizard downloads but never sends',async()=>{
   await page.locator('#proposal-section summary').click();
   await page.locator('#proposal-form [name="name"]').fill('Test Visitor');
   await page.locator('#proposal-form [name="email"]').fill('visitor@example.com');
   await page.locator('#proposal-form [name="service"]').selectOption('Website redesign');
   await page.locator('#proposal-form [name="timeline"]').selectOption('Exploring options');
   await page.locator('#proposal-form [name="brief"]').fill('Create a fictional accessible demo website.');
   const download=page.waitForEvent('download');
   await page.locator('#proposal-form [type="submit"]').click();
   const file=await download;
   assert.equal(file.suggestedFilename(),'sample-project-brief.txt');
   assert.match(await page.locator('#proposal-status').innerText(),/No email or API request was sent/);
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
   await page.locator('#studio-theme').selectOption('editorial');
   const light=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
   const editorialFont=await page.locator('#name').evaluate(el=>getComputedStyle(el).fontFamily);
   await page.locator('#studio-theme').selectOption('terminal');
   const dark=await page.locator('body').evaluate(el=>getComputedStyle(el).backgroundColor);
   const terminalFont=await page.locator('#name').evaluate(el=>getComputedStyle(el).fontFamily);
   assert.notEqual(light,dark);assert.notEqual(editorialFont,terminalFont);
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
   assert.equal(await page.locator('#name').innerText(),'Nico Vale');
   assert.equal(await page.locator('#demo-brand').textContent(),'Nico Vale');
   assert.match(await page.locator('#portrait-caption').textContent(),/Nico Vale/);
   if(!(await page.locator('#editor').isVisible()))await page.locator('#edit-toggle').click();
   await page.locator('input[name="displayName"]').fill('Sage Demo');
   await page.getByRole('button',{name:'Save & preview'}).click();
   assert.equal(await page.locator('#demo-brand').textContent(),'Sage Demo');
   await page.locator('#reset-profile').click();
   assert.equal(await page.locator('#demo-brand').textContent(),'Nico Vale');
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
   await page.waitForFunction(()=>document.querySelector('#tour-title')?.textContent==='ثلاثة تخطيطات لملف واحد.');
   await page.keyboard.press('Escape');
 })();
 await check('English restore preserves editable profile data and core safety claims',async()=>{
   await page.locator('#studio-language').selectOption('en');
   await page.waitForFunction(()=>document.querySelector('#usp-heading')?.textContent==='Your web presence should outlive any provider.');
   assert.equal(await page.locator('#role').innerText(),'Creative Developer & Interface Engineer');
   assert.match(await page.locator('#resilience').innerText(),/not an uptime guarantee/);
   await page.reload();
   await page.waitForFunction(()=>window.StudioI18n?.language==='en');
   assert.equal(await page.locator('#name').innerText(),'Nico Vale');
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
   await page.locator('#backup-download').click();
   const download=await started;
   assert.equal(download.suggestedFilename(),'customer-demo-profile.json');
 })();
 await check('direct restore opens the editor and selects local JSON',async()=>{
   await page.locator('#backup-import').click();
   assert.equal(await page.locator('#editor').isVisible(),true);
   const file=JSON.parse(await readFile(join(output,'profile.json'),'utf8'));
   file.identity.displayName='Ownership Test';
   await page.locator('#import-profile').setInputFiles({name:'backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(file))});
   await page.waitForFunction(()=>document.querySelector('#name')?.textContent==='Ownership Test');
   await page.locator('#reset-profile').click();
   assert.equal(await page.locator('#name').innerText(),'Nico Vale');
 })();
 await check('header, CTAs and editing buttons never overlap at responsive widths',async()=>{
   for(const theme of ['orbit','editorial','terminal']){
     await page.locator('#studio-theme').selectOption(theme);
     for(const width of [320,390,600,768,1024,1440]){
       await page.setViewportSize({width,height:900});
       const result=await page.evaluate(()=>{
         const selectors=['.nav-bar .brand','.nav-bar #mobile-menu','.nav-bar #edit-toggle','.nav-bar .studio-controls','.nav-bar .nav-links','.studio-product-actions button','.ownership-actions button','.hero-actions a'];
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
 await check('translated long button labels wrap without collision',async()=>{
   for(const language of ['en','de','hi','ar']){
     await page.locator('#studio-language').selectOption(language);
     await page.waitForFunction(lang=>window.StudioI18n?.language===lang,language);
     await page.setViewportSize({width:390,height:850});
     const check=await page.locator('.ownership-actions').evaluate(el=>{
       const boxes=[...el.querySelectorAll('button')].map(b=>b.getBoundingClientRect());
       const a=boxes[0],b=boxes[1];
       return {overlap:Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top)),outside:boxes.some(r=>r.left < -1||r.right>innerWidth+1)};
     });
     assert.equal(check.overlap,0,language+': backup buttons overlap');
     assert.equal(check.outside,false,language+': button outside viewport');
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
   assert.equal(await page.locator('#demo-brand-wrapper').getAttribute('data-initials'),'NV');
   if(!(await page.locator('#editor').isVisible()))await page.locator('#edit-toggle').click();
   await page.locator('input[name="displayName"]').fill('Nova Studio');
   await page.getByRole('button',{name:'Save & preview'}).click();
   assert.equal(await page.locator('#demo-brand-wrapper').getAttribute('data-initials'),'NS');
   await page.locator('#reset-profile').click();
 })();
 await page.close();
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
assert.equal(passed,36);
console.log('Browser checks passed: '+passed);
