/* Personal profile presentation layer ported from DevDas WebStudio.
   This never edits/publishes Sudip's profile, calls API routes, or stores visitor uploads. */
(() => {
 'use strict';
 const themes=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
 const select=document.getElementById('theme-select');
 const language=document.getElementById('language-select');
 const hero=document.querySelector('.hero');
 if(!select||!language||!hero)return;
 const KEY='sudip-profile-look-v1';
 const presets=Object.freeze({
  theme:null,electric:'#2ce9ed',ultraviolet:'#b894ff',emerald:'#5ff0ac',sunset:'#ff9b7c',minimal:'#9ebacb'
 });
 const state={preset:'theme',accent:null,glow:60,spacing:50,motion:true};
 const isHex=v=>typeof v==='string'&&/^#[0-9a-f]{6}$/i.test(v);
 const clamp=v=>Math.max(0,Math.min(100,Math.round(Number(v)||0)));
 function importState(x){
   if(!x||typeof x!=='object'||!Object.hasOwn(presets,x.preset)||!Number.isFinite(x.glow)||
     x.glow<0||x.glow>100||!Number.isFinite(x.spacing)||x.spacing<0||x.spacing>100||
     typeof x.motion!=='boolean'||(x.accent!==null&&!isHex(x.accent)))return false;
   state.preset=x.preset;state.accent=x.accent;state.glow=clamp(x.glow);
   state.spacing=clamp(x.spacing);state.motion=x.motion;return true;
 }
 try{const x=JSON.parse(localStorage.getItem(KEY)||'null');if(x)importState(x);}catch{}
 const mainPhoto=document.querySelector('.hero-art .core img');
 const photoOriginal=mainPhoto?.getAttribute('src')||null;
 let photoUrl=null,priorFocus=null,shortcutFocus=null;
 let appearance=null,shortcuts=null;
 const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));}catch{}};
 const apply=()=>{
   if(state.accent)document.body.style.setProperty('--ws-personal-accent',state.accent);
   else document.body.style.removeProperty('--ws-personal-accent');
   document.body.style.setProperty('--ws-glow-factor',String(state.glow/100));
   document.body.style.setProperty('--ws-rhythm',String(state.spacing/100));
   document.body.dataset.wsMotion=state.motion?'on':'off';
   document.body.dataset.wsSpacing=state.spacing===50?'default':'custom';
   appearance?.querySelectorAll('[data-look]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.look===state.preset)));
   const g=appearance?.querySelector('[data-glow]'),r=appearance?.querySelector('[data-rhythm]'),m=appearance?.querySelector('[data-motion]');
   if(g)g.value=String(state.glow);if(r)r.value=String(state.spacing);if(m)m.checked=state.motion;
   const gv=appearance?.querySelector('[data-glow-value]'),rv=appearance?.querySelector('[data-rhythm-value]');
   if(gv)gv.textContent=state.glow+'%';if(rv)rv.textContent=state.spacing+'%';
 };
 const root=document.createElement('div');
 root.innerHTML=`<button type="button" class="profile-appearance-button" id="profile-look-open">✦ Appearance</button><button type="button" class="profile-quick-button" id="profile-shortcuts-open" aria-keyshortcuts="Control+K Meta+K">⌘ Quick actions</button>
 <div class="profile-appearance" id="profile-look-dialog" role="dialog" aria-modal="true" aria-labelledby="profile-look-title" hidden>
  <div class="profile-appearance-backdrop" data-close-look></div>
  <div class="profile-appearance-panel">
   <div class="panel-row"><h2 id="profile-look-title">Personalize the view</h2><button type="button" data-close-look aria-label="Close appearance controls">×</button></div>
   <p>WebStudio-inspired themes and visual effects. These are visitor-side previews only; profile content and private requests are unchanged.</p>
   <h3>Color mood</h3><div class="look-presets" role="group" aria-label="Color mood presets"></div>
   <label>Glow <output data-glow-value>60%</output><input data-glow type="range" min="0" max="100" step="5" value="60"></label>
   <label>Section spacing <output data-rhythm-value>50%</output><input data-rhythm type="range" min="0" max="100" step="5" value="50"></label>
   <label><span>Ambient motion</span><input data-motion type="checkbox" checked></label>
   <label>Preview your own portrait locally <input type="file" data-photo accept="image/png,image/jpeg,image/webp"></label>
   <p class="look-notice" role="status">Photos are never uploaded or saved; leave to restore the original portrait.</p>
   <div class="look-footer"><button type="button" data-export-look>Export look</button><label class="look-import">Import look <input type="file" data-import-look accept="application/json,.json"></label><button type="button" data-reset-look>Reset look</button></div>
  </div>
 </div>
 <div class="profile-shortcuts" id="profile-shortcuts" role="dialog" aria-modal="true" aria-labelledby="profile-shortcuts-title" hidden>
  <div class="shortcut-backdrop" data-close-shortcuts></div>
  <div class="shortcut-panel"><h2 id="profile-shortcuts-title">Quick actions</h2>
   <input type="search" aria-label="Find an action" placeholder="Search sections, themes, languages…">
   <div class="shortcut-list"></div><p class="muted">Ctrl/⌘ + K · Escape to close</p>
  </div>
 </div>`;
 for(const element of [...root.children])document.body.append(element);
 appearance=document.getElementById('profile-look-dialog');shortcuts=document.getElementById('profile-shortcuts');
 const status=appearance.querySelector('.look-notice');
 const announce=message=>{status.textContent=message;};
 const presetSlot=appearance.querySelector('.look-presets');
 const presetNames={theme:'Theme default',electric:'Electric',ultraviolet:'Ultraviolet',emerald:'Emerald',sunset:'Sunset',minimal:'Minimal'};
 for(const [key,color] of Object.entries(presets)){
   const button=document.createElement('button');button.type='button';button.dataset.look=key;
   if(color){const dot=document.createElement('i');dot.style.backgroundColor=color;dot.setAttribute('aria-hidden','true');button.append(dot);}
   button.append(document.createTextNode(presetNames[key]));
   button.addEventListener('click',()=>{state.preset=key;state.accent=color;persist();apply();});
   presetSlot.append(button);
 }
 appearance.querySelector('[data-glow]').addEventListener('input',e=>{state.glow=clamp(e.target.value);persist();apply();});
 appearance.querySelector('[data-rhythm]').addEventListener('input',e=>{state.spacing=clamp(e.target.value);persist();apply();});
 appearance.querySelector('[data-motion]').addEventListener('change',e=>{state.motion=e.target.checked;persist();apply();});
 const photoInput=appearance.querySelector('[data-photo]');
 const restorePhoto=()=>{
   if(mainPhoto&&photoOriginal)mainPhoto.setAttribute('src',photoOriginal);
   if(photoUrl){URL.revokeObjectURL(photoUrl);photoUrl=null;}
   photoInput.value='';
 };
 photoInput.addEventListener('change',()=>{
   const file=photoInput.files?.[0];if(!file)return;
   if(!['image/png','image/jpeg','image/webp'].includes(file.type)||file.size>5*1024*1024||file.size===0){
     photoInput.value='';announce('Choose a PNG, JPEG or WebP under 5 MB.');return;
   }
   restorePhoto();
   photoUrl=URL.createObjectURL(file);
   if(mainPhoto)mainPhoto.src=photoUrl;
   announce('Local photo preview only. No image has been uploaded or saved.');
 });
 appearance.querySelector('[data-reset-look]').addEventListener('click',()=>{
   Object.assign(state,{preset:'theme',accent:null,glow:60,spacing:50,motion:true});
   persist();apply();restorePhoto();announce('Default appearance restored.');
 });
 appearance.querySelector('[data-export-look]').addEventListener('click',()=>{
   const data={schema:'sudip-profile-appearance',version:1,theme:select.value,
     language:language.value,look:{...state}};
   const objectUrl=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)+'\n'],{type:'application/json'}));
   const a=document.createElement('a');a.href=objectUrl;a.download='sudip-profile-appearance.json';
   document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(objectUrl),1000);
   announce('Downloaded appearance settings only; no profile data or image.');
 });
 appearance.querySelector('[data-import-look]').addEventListener('change',async e=>{
   const file=e.target.files?.[0];if(!file)return;
   try{
     if(file.size<10||file.size>8192)throw Error('Invalid file size');
     const data=JSON.parse(await file.text());
     if(data?.schema!=='sudip-profile-appearance'||data.version!==1||!themes.includes(data.theme)||
       ![...language.options].some(o=>o.value===data.language)||!importState(data.look))
       throw Error('Unsupported appearance settings');
     select.value=data.theme;select.dispatchEvent(new Event('change',{bubbles:true}));
     language.value=data.language;language.dispatchEvent(new Event('change',{bubbles:true}));
     persist();apply();announce('Appearance settings imported; no private content changed.');
   }catch{announce('Appearance import rejected: invalid or unsupported JSON.');}
   finally{e.target.value='';}
 });
 function trap(event,modal){
   if(event.key==='Escape'){event.preventDefault();if(modal===appearance)closeAppearance();else closeShortcuts();return;}
   if(event.key!=='Tab')return;
   const list=[...modal.querySelectorAll('button:not(:disabled),input:not(:disabled),select:not(:disabled),a[href]')]
     .filter(n=>n.getClientRects().length&&getComputedStyle(n).visibility!=='hidden');
   if(!list.length)return;
   if(event.shiftKey&&document.activeElement===list[0]){event.preventDefault();list.at(-1).focus();}
   else if(!event.shiftKey&&document.activeElement===list.at(-1)){event.preventDefault();list[0].focus();}
 }
 const showAppearance=()=>{const fromShortcuts=!shortcuts.hidden;closeShortcuts(false);priorFocus=fromShortcuts?document.getElementById('profile-look-open'):document.activeElement;appearance.hidden=false;appearance.querySelector('[data-close-look]:not(.profile-appearance-backdrop)').focus();};
 const closeAppearance=(focus=true)=>{if(appearance.hidden)return;appearance.hidden=true;if(focus)priorFocus?.focus?.();};
 document.getElementById('profile-look-open').addEventListener('click',showAppearance);
 appearance.querySelectorAll('[data-close-look]').forEach(n=>n.addEventListener('click',()=>closeAppearance()));
 appearance.addEventListener('keydown',e=>trap(e,appearance));
 const search=shortcuts.querySelector('input[type="search"]'),items=shortcuts.querySelector('.shortcut-list');
 const commands=[
   {name:'Appearance controls',run:showAppearance},
   {name:'Portfolio theme gallery',run:()=>document.getElementById('profile-showcase')?.scrollIntoView({behavior:'smooth',block:'center'})},
   {name:'Explore project stories',run:()=>document.querySelector('.portfolio-gallery-open')?.click()},
   {name:'Compare public projects',run:()=>document.querySelector('.portfolio-compare')?.scrollIntoView({behavior:'smooth',block:'center'})},
   {name:'Recruiter Focus View',run:()=>document.getElementById('portfolio-focus-toggle')?.click()},
   {name:'Print or save portfolio as PDF',run:()=>document.getElementById('portfolio-print')?.click()},
   {name:'Professional career navigator',run:()=>document.querySelector('.portfolio-career-explorer')?.scrollIntoView({behavior:'smooth',block:'center'})},
   {name:'Start guided portfolio tour',run:()=>document.getElementById('ws-tour-start')?.click()},
   {name:'Project shortlist',run:()=>document.getElementById('ws-visitor-hub')?.scrollIntoView({behavior:'smooth',block:'center'})},
   {name:'Copy shortlisted projects',run:()=>document.getElementById('ws-shortlist-copy')?.click()},
   ...[...document.querySelectorAll('.navlinks a[href^="#"]')].map(a=>({name:'Section: '+a.textContent.trim(),run:()=>a.click()})),
   ...themes.map(t=>({name:'Theme: '+({ 'aurora-peak':'Aurora Peak','neon-studio':'Neon Studio','design-2':'Cosmic'}[t]||t),run:()=>{select.value=t;select.dispatchEvent(new Event('change',{bubbles:true}));}})),
   ...[...language.options].map(o=>({name:'Language: '+o.textContent.trim(),run:()=>{language.value=o.value;language.dispatchEvent(new Event('change',{bubbles:true}));}}))
 ];
 let filtered=[];
 const renderCommands=()=>{
   const q=search.value.toLowerCase().trim();
   filtered=commands.filter(x=>x.name.toLowerCase().includes(q)).slice(0,20);
   items.replaceChildren();
   for(const c of filtered){
     const b=document.createElement('button');b.type='button';b.textContent=c.name;
     b.addEventListener('click',()=>{closeShortcuts(false);c.run();});items.append(b);
   }
   if(!filtered.length){const p=document.createElement('p');p.textContent='No matching actions';items.append(p);}
 };
 const showShortcuts=()=>{closeAppearance(false);shortcutFocus=document.activeElement;shortcuts.hidden=false;search.value='';renderCommands();search.focus();};
 const closeShortcuts=(focus=true)=>{if(shortcuts.hidden)return;shortcuts.hidden=true;if(focus)shortcutFocus?.focus?.();};
 document.getElementById('profile-shortcuts-open').addEventListener('click',showShortcuts);
 shortcuts.querySelectorAll('[data-close-shortcuts]').forEach(n=>n.addEventListener('click',()=>closeShortcuts()));
 shortcuts.addEventListener('keydown',e=>{
   if(e.key==='Enter'&&e.target===search&&filtered.length){e.preventDefault();closeShortcuts(false);filtered[0].run();return;}
   trap(e,shortcuts);
 });
 search.addEventListener('input',renderCommands);
 document.addEventListener('keydown',e=>{
   if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&!e.altKey){
     e.preventDefault();shortcuts.hidden?showShortcuts():closeShortcuts();
   }
 });
 // Keep the three new themes translated in all ten existing website languages,
 // without modifying the profile's authoritative translation catalog.
 const themeLabels={
  en:['Aurora Peak','Neon Studio','Cosmic'],hi:['ऑरोरा पीक','नियॉन स्टूडियो','कॉस्मिक'],
  bn:['অরোরা পিক','নিয়ন স্টুডিও','কসমিক'],es:['Pico Aurora','Estudio Neón','Cósmico'],
  fr:['Sommet Aurore','Studio Néon','Cosmique'],de:['Aurora-Gipfel','Neon-Studio','Kosmisch'],
  pt:['Pico Aurora','Estúdio Neon','Cósmico'],ar:['قمة الشفق','استوديو النيون','الكوني'],
  'zh-CN':['极光之巅','霓虹工作室','宇宙'],ja:['オーロラピーク','ネオンスタジオ','コズミック']
 };
 const syncThemeLabels=()=>{
   const names=themeLabels[language.value]||themeLabels.en;
   ['aurora-peak','neon-studio','design-2'].forEach((id,i)=>{
     const option=[...select.options].find(o=>o.value===id);
     if(option)option.textContent=names[i];
   });
 };
 language.addEventListener('change',()=>queueMicrotask(syncThemeLabels));
 document.addEventListener('profile-language-change',()=>queueMicrotask(syncThemeLabels));
 syncThemeLabels();

 // Public project discovery port: local-only filtering; all original text,
 // links, projects and publication controls remain authoritative and unchanged.
 const projectWrap=document.querySelector('#projects .wrap');
 const grid=projectWrap?.querySelector('.project-grid');
 if(grid){
   const cards=[...grid.querySelectorAll('article.project')];
   cards.forEach(card=>{card.dataset.initialTags=(card.querySelector('.project-type')?.textContent||'').toLowerCase();});
   const tools=document.createElement('div');
   tools.className='profile-project-tools';
   const label=document.createElement('label');
   label.textContent='Search projects';
   const input=document.createElement('input');
   input.type='search';input.placeholder='Find a project or technology';
   input.setAttribute('aria-label','Search public projects');input.autocomplete='off';
   label.append(input);
   const filter=document.createElement('select');
   filter.setAttribute('aria-label','Filter project category');
   for(const [key,name] of [['all','All projects'],['linux','Linux'],['creative','Creative'],['desktop','Desktop'],['system','System tools']]){
     const option=document.createElement('option');option.value=key;option.textContent=name;filter.append(option);
   }
   const result=document.createElement('p');
   result.setAttribute('role','status');result.className='profile-project-count';
   tools.append(label,filter,result);
   grid.insertAdjacentElement('beforebegin',tools);
   const applyFilter=()=>{
     const query=input.value.trim().toLowerCase();
     let shown=0;
     for(const card of cards){
       const category=filter.value==='all'||card.dataset.initialTags.includes(filter.value);
       const matches=!query||card.textContent.toLowerCase().includes(query);
       const visible=category&&matches;
       card.hidden=!visible;
       if(visible)shown++;
     }
     result.textContent=shown+' of '+cards.length+' projects shown';
   };
   input.addEventListener('input',applyFilter);filter.addEventListener('change',applyFilter);
   document.addEventListener('profile-language-change',applyFilter);
   applyFilter();
 }
 window.addEventListener('pagehide',()=>{if(photoUrl)URL.revokeObjectURL(photoUrl);});
 apply();
})();
