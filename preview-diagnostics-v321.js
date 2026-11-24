/* v3.21 Read-only preview diagnostics and reproducible theme links.
 * Runs only on the designated human-testing preview.
 * No analytics, storage, requests, passwords, or automatic pass claims.
 */
(() => {
 'use strict';
 if(window.PORTFOLIO_PREVIEW_MODE!==true||window.__wsExperienceV321)return;
 const picker=document.getElementById('theme-select');
 const host=document.querySelector('#human-ci-panel #human-ci-content');
 if(!picker||!host)return;
 window.__wsExperienceV321=true;
 const THEMES=new Set(['orbit','editorial','terminal','aurora-peak','neon-studio','design-2']);
 const query=new URLSearchParams(location.search);
 const target=query.get('preview_theme');
 if(THEMES.has(target)&&picker.value!==target){
   picker.value=target;
   picker.dispatchEvent(new Event('change',{bubbles:true}));
 }
 const root=document.createElement('details');
 root.className='human-ci-diagnostics';
 const title=document.createElement('summary');
 title.textContent='Browser diagnostics and reproducible review link';
 const intro=document.createElement('p');
 intro.textContent='Run local structural checks on this device. Results are not proof of visual correctness. Nothing is uploaded.';
 const toolbar=document.createElement('div');toolbar.className='human-ci-diagnostic-actions';
 const run=document.createElement('button');run.type='button';run.textContent='Check this viewport';
 const copy=document.createElement('button');copy.type='button';copy.textContent='Copy theme link';
 const download=document.createElement('button');download.type='button';download.textContent='Export diagnostic JSON';
 const text=document.createElement('pre');text.className='human-ci-diagnostic-report';text.textContent='No checks run for this viewport.';
 const status=document.createElement('p');status.setAttribute('role','status');status.setAttribute('aria-live','polite');
 toolbar.append(run,copy,download);root.append(title,intro,toolbar,text,status);
 host.insertBefore(root,host.querySelector('.human-ci-actions'));
 const elements=(q)=>[...document.querySelectorAll(q)];
 const getStyle=el=>el?getComputedStyle(el):null;
 const bounding=el=>el?.getBoundingClientRect();
 const ratio=(a,b)=>{
   const parse=hex=>{
     const h=hex.trim().replace('#','');
     if(!/^[0-9a-f]{6}$/i.test(h))return null;
     const vals=[0,2,4].map(i=>parseInt(h.slice(i,i+2),16)/255);
     const c=vals.map(x=>x<=.04045?x/12.92:Math.pow((x+.055)/1.055,2.4));
     return .2126*c[0]+.7152*c[1]+.0722*c[2];
   };
   const x=parse(a),y=parse(b);
   return x===null||y===null?null:(Math.max(x,y)+.05)/(Math.min(x,y)+.05);
 };
 let last=null;
 function runChecks(){
   const theme=document.body.dataset.theme;
   const checks=[];
   const add=(name,pass,details='')=>checks.push({name,pass:Boolean(pass),details});
   const footer=document.querySelector('.ws-powered-band');
   const header=document.querySelector('.topbar');
   const reviewer=document.querySelector('#human-ci-panel>.human-ci-toggle');
   add('Theme selector reflects active theme',picker.value===theme);
   add('Responsive viewport has no document overflow',document.documentElement.scrollWidth<=document.documentElement.clientWidth+3);
   add('WebStudio footer exists and is visible',Boolean(footer&&bounding(footer).width>100));
   add('Six-theme footer stylesheet loaded',Boolean(document.querySelector('link[href*="webstudio-six-theme-system-v321.css"]')));
   add('Human CI launcher is compact',Boolean(reviewer&&bounding(reviewer).width<=250));
   add('Header navigation exists',Boolean(header&&bounding(header).width>100));
   const atmosphere=window.__wsAtmosphere323?.getStatus?.();
   add('Atmosphere controller initialized',Boolean(atmosphere));
   add('Atmosphere theme synchronized',Boolean(atmosphere&&atmosphere.theme===theme));
   add('Atmosphere renderer valid',Boolean(atmosphere&&['off','css','canvas2d','gpu'].includes(atmosphere.renderer)),
     atmosphere?atmosphere.mode+' → '+atmosphere.effective+' / '+atmosphere.renderer:'Not initialized');
   const expectedZones=['intro','about','projects','experience','strengths','contact','showcase','footer'];
   const zones=elements('[data-atmo-zone]');
   add('Atmosphere is scoped to entire website',Boolean(atmosphere?.scope==='sitewide'));
   add('Every primary site section has atmosphere',expectedZones.every(id=>zones.some(el=>el.dataset.atmoZone===id)),
     zones.map(el=>el.dataset.atmoZone).join(', '));
   add('Scroll-aware current section available',Boolean(atmosphere?.section&&document.body.dataset.atmosphereSection===atmosphere.section),
     atmosphere?.section||'No current section');

   const ambient=document.querySelector('body > .ws-atmo-layer.ws-atmo-sitewide');
   if(atmosphere?.effective==='off')
     add('Atmosphere Off uses no render canvas',Boolean(ambient?.hidden&&!ambient.querySelector('canvas')));
   if(atmosphere?.effective==='eco')
     add('Eco avoids GPU and Canvas 2D',Boolean(atmosphere.renderer==='css'&&!ambient?.querySelector('canvas')));
   // No API call is made by diagnostics; inspect only visible widget state.
   const github=window.__wsGithubHero324?.getStatus?.();
   const ghButton=document.getElementById('gh-hero-trigger');
   const ghPanel=document.getElementById('gh-hero-panel');
   add('GitHub hero explorer initialized',Boolean(github&&ghButton&&ghPanel));
   add('GitHub hero has accessible disclosure',Boolean(ghButton?.getAttribute('aria-controls')==='gh-hero-panel'&&ghPanel?.getAttribute('role')==='region'));
   add('GitHub preview open state synchronized',Boolean(github&&String(github.open)===ghButton?.getAttribute('aria-expanded')),
     github?(github.loaded?'Public summaries loaded':'Public summaries not yet requested'):'No widget');
   const missing=elements('img').filter(img=>img.complete&&img.naturalWidth===0&&img.loading!=='lazy');
   add('Loaded non-lazy image elements are valid',missing.length===0,
       missing.length?missing.length+' images could not be decoded':'');
   const buttons=[...elements('.ws-powered-band button, #human-ci-panel>.human-ci-toggle')].filter(el=>{
     const style=getStyle(el),box=bounding(el);
     return style?.display!=='none'&&style?.visibility!=='hidden'&&box?.width>0;
   });
   const small=buttons.filter(el=>bounding(el).height<36);
   add('Visible WebStudio and review buttons are >=36px tall',small.length===0,
       small.length?small.length+' controls below 36px':'');
   if(theme!=='neon-studio'&&footer){
     const style=getStyle(footer);
     const fg=style?.getPropertyValue('--xf-ink').trim()||'';
     const bg=style?.getPropertyValue('--xf-panel').trim()||'';
     const contrast=ratio(fg,bg);
     add('Selected footer text/surface contrast >=4.5:1',
       contrast!==null&&contrast>=4.5,
       contrast===null?'Could not measure':'Ratio '+contrast.toFixed(2)+':1');
     add('Theme-specific footer accent initialized',Boolean(style?.getPropertyValue('--xf-accent').trim()));
   }
   const orbits=elements('.ws-powered-orbit');
   const hidden=orbits.length>0&&orbits.every(el=>getStyle(el)?.display==='none');
   if(theme==='editorial'||theme==='terminal'||theme==='aurora-peak')
     add('Non-orbital footer art is free of circles',hidden);
   if(theme==='orbit'||theme==='design-2')
     add('Orbital theme retains its distinctive rings',orbits.length>0&&orbits.some(el=>getStyle(el)?.display!=='none'));
   if(theme==='aurora-peak')
     add('Alpine scene is attached',Boolean(document.querySelector('.ap-landscape')));
   const imageErrors=missing.length;
   const passed=checks.filter(x=>x.pass).length;
   last={
     schemaVersion:1,release:'preview-v3.24',time:new Date().toISOString(),
     site:location.origin+location.pathname,
     theme,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio||1},
     userAgent:navigator.userAgent,
     checks,passed,total:checks.length,failed:checks.length-passed,imageErrors,
     atmosphere:atmosphere||null, githubHero:github||null,
     note:'Browser structural diagnostics, not a pixel or end-to-end verification.'
   };
   text.textContent=checks.map(x=>(x.pass?'PASS ':'FAIL ')+x.name+(x.details?' — '+x.details:'')).join('\n');
   status.textContent=passed+'/'+checks.length+' structural checks passed. Review visual layout and interactions manually.';
 }
 function exportJson(){
   if(!last){status.textContent='Run the checks first.';return;}
   const blob=new Blob([JSON.stringify(last,null,2)+'\n'],{type:'application/json'});
   const url=URL.createObjectURL(blob);
   const anchor=document.createElement('a');
   anchor.href=url;anchor.download='webstudio-preview-diagnostics-v3.24.json';
   document.body.append(anchor);anchor.click();anchor.remove();
   setTimeout(()=>URL.revokeObjectURL(url),1500);
   status.textContent='Local diagnostic report saved. Attach it with screenshots.';
 }
 function themeLink(){
   const url=new URL(location.origin+location.pathname);
   url.searchParams.set('preview_theme',THEMES.has(picker.value)?picker.value:'neon-studio');
   const hash=location.hash.slice(1);
   if(hash&&/^[a-z][a-z0-9-]{0,40}$/i.test(hash)&&document.getElementById(hash)){
     url.hash=hash;
   }
   return url.href;
 }
 run.addEventListener('click',runChecks);
 download.addEventListener('click',exportJson);
 copy.addEventListener('click',async()=>{
   try{await navigator.clipboard.writeText(themeLink());
     status.textContent='Shareable theme and section link copied.';}
   catch{status.textContent='Clipboard unavailable; use the URL displayed in your address bar.';}
 });
})();
