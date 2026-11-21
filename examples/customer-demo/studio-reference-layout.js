/* Screenshot-reference visual shell; keeps the independently tested demo engine intact. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const button=(label,icon,action)=>{
   const el=document.createElement('button');el.type='button';
   const sym=document.createElement('span');sym.className='menu-symbol';sym.setAttribute('aria-hidden','true');sym.textContent=icon;
   el.append(sym,document.createTextNode(label));
   if(action)el.addEventListener('click',action);
   else{
     el.disabled=true;el.title=label+' — coming soon';
     const tag=document.createElement('small');tag.className='disabled-tag';tag.textContent='Soon';el.append(tag);
   }
   return el;
 };
 const bar=document.querySelector('.nav-bar');
 const system=$('system-menu'),editor=$('editor'),nav=$('studio-nav');
 const openEditor=()=>{
   if(!editor.classList.contains('open'))$('edit-toggle').click();
   editor.scrollIntoView({block:'start',behavior:'smooth'});
 };
 const go=id=>{const target=$(id);if(target)target.scrollIntoView({block:'start',behavior:'smooth'});};
 const dd=document.createElement('div');dd.className='studio-nav-dropdown';
 const trigger=document.createElement('button');trigger.className='studio-nav-trigger';
 trigger.type='button';trigger.setAttribute('aria-expanded','false');trigger.setAttribute('aria-controls','studio-nav-panel');trigger.textContent='▱ Studio ⌄';
 const panel=document.createElement('div');panel.className='studio-nav-panel';panel.id='studio-nav-panel';panel.hidden=true;panel.setAttribute('aria-label','Studio menu');
 panel.append(
  button('Profile & Content','♙',openEditor),
  button('Edit Projects','▱',()=>{openEditor();go('project-editor')}),
  button('Design & Theme','◉',()=>{$('studio-theme').focus();$('studio-theme').scrollIntoView({block:'nearest'})}),
  button('Layout & Sections','▦'),
  button('Media & Assets','▧'),
  button('SEO & Meta','⌕')
 );
 dd.append(trigger,panel);
 bar.insertBefore(dd,system);
 const setOpen=open=>{panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open));};
 trigger.addEventListener('click',()=>setOpen(panel.hidden));
 document.addEventListener('pointerdown',event=>{if(!dd.contains(event.target))setOpen(false)});
 document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!panel.hidden){setOpen(false);trigger.focus()}});
 panel.querySelectorAll('button:not(:disabled)').forEach(b=>b.addEventListener('click',()=>setOpen(false)));
 const addHome=document.createElement('a');addHome.className='neon-home-link';addHome.href='#top';addHome.textContent='⌂ Home';nav.prepend(addHome);
 const projects=nav.querySelector('a[href="#projects-section"]');if(projects)projects.textContent='▱ Projects';
 const control=document.createElement('button');control.type='button';control.className='demo-theme-icon';control.textContent='☾';control.title='Switch to another visual theme';
 control.addEventListener('click',()=>{
   const select=$('studio-theme');
   const next=select.value==='neon-studio'?'aurora-peak':'neon-studio';
   select.value=next;select.dispatchEvent(new Event('change',{bubbles:true}));
   control.textContent=next==='neon-studio'?'☾':'☀';
 });
 const toggle=$('edit-toggle');bar.insertBefore(control,toggle);
 if(system){
   const text=system.querySelector('#system-menu-trigger [data-i18n]');
   if(text){text.textContent='System';text.removeAttribute('data-i18n')}
 }
 const brand=document.getElementById('demo-brand-wrapper');
 if(brand){
   const brandName=document.getElementById('demo-brand');
   const subBrand=brand.querySelector('.muted');
   if(brandName&&subBrand){
     subBrand.textContent='WEB STUDIO';
     const lockup=document.createElement('span');lockup.className='studio-brand-lockup';
     lockup.append(brandName,subBrand);brand.append(lockup);
   }
 }
 const banner=document.querySelector('.banner');
 if(banner){
  const tagline=document.createElement('span');tagline.className='demo-glow-banner';
  tagline.innerHTML='<b aria-hidden="true">∞</b> Web Studio — Create an Everlasting Web Presence  |  Modular • Customizable • Local to Global • Provider Freedom';
  banner.replaceChildren(tagline);
   // Add a small honest demo label outside the hero design area.
   const notice=document.createElement('span');notice.className='demo-identity-note';notice.textContent='Fictional profile demo';banner.append(notice);
  const old=document.createElement('span');old.className='sr-only';old.textContent='Fictional demo, no working contact service';banner.append(old);
 }
 const hero=document.querySelector('main>.hero');
 if(!hero)return;
 const name=$('name');
 let updating=false;
 const repaintName=()=>{
   if(updating||name.querySelector('.neon-name-gradient'))return;
   const value=name.textContent.trim();if(!value)return;
   const first=value.indexOf(' ');if(first<0)return;
   updating=true;
   const a=document.createTextNode(value.slice(0,first+1));
   const span=document.createElement('span');span.className='neon-name-gradient';span.textContent=value.slice(first+1);
   name.replaceChildren(a,span);
   updating=false;
 };
 const observer=new MutationObserver(repaintName);observer.observe(name,{childList:true,subtree:false});repaintName();
 // The reference eyebrow is authored in HTML, not generated with CSS or JS.
 // The fictional location is retained for other themes but not duplicated in Neon.
 const location=$('location');if(location)location.classList.add('neon-position');
 const svgPaths={
  'code':'<path d="m8 8-4 4 4 4m8-8 4 4-4 4M14 4l-4 16"/>',
  'layers':'<path d="m12 2 9 5-9 5-9-5 9-5Z M3 12l9 5 9-5 M3 17l9 5 9-5"/>',
  'rocket':'<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.03 2.03 0 0 0-2.91-.09ZM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 4-2 8-6.05 11A22 22 0 0 1 12 15Z M9 12H4s.55-3 2-4c1.62-1.08 5-1 5-1m1 8v5s3-.55 4-2c1.08-1.62 1-5 1-5"/>',
  'settings':'<path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z M19.4 15a1.7 1.7 0 0 0 .34 1.9l.06.06-2.12 2.12-.06-.06a1.7 1.7 0 0 0-1.9-.34 1.7 1.7 0 0 0-1.05 1.55V21h-3v-.77a1.7 1.7 0 0 0-1.05-1.55 1.7 1.7 0 0 0-1.9.34l-.06.06-2.12-2.12.06-.06A1.7 1.7 0 0 0 6.94 15a1.7 1.7 0 0 0-1.55-1.05H4v-3h1.39A1.7 1.7 0 0 0 6.94 9.9a1.7 1.7 0 0 0-.34-1.9L6.54 7.94l2.12-2.12.06.06a1.7 1.7 0 0 0 1.9.34 1.7 1.7 0 0 0 1.05-1.55V4h3v.67a1.7 1.7 0 0 0 1.05 1.55 1.7 1.7 0 0 0 1.9-.34l.06-.06 2.12 2.12-.06.06a1.7 1.7 0 0 0-.34 1.9 1.7 1.7 0 0 0 1.55 1.05H21v3h-.05A1.7 1.7 0 0 0 19.4 15Z"/>',
  'infinity':'<path d="M6 16c-3 0-4-2-4-4s1-4 4-4c5 0 7 8 12 8 3 0 4-2 4-4s-1-4-4-4c-5 0-7 8-12 8Z"/>',
  'cloud':'<path d="M20 17a4 4 0 0 0-1.3-7.8A7 7 0 0 0 5 11a4 4 0 0 0 0 8h14m-7-8v9m-4-4 4 4 4-4"/>',
  'history':'<path d="M3 12a9 9 0 1 0 3-6.7L3 8m0-5v5h5m4-1v5l3 2"/>',
  'server':'<rect x="3" y="3" width="18" height="7" rx="2"/><rect x="3" y="14" width="18" height="7" rx="2"/><path d="M7 6.5h.01M7 17.5h.01"/>',
  'shield':'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Zm-4-10 3 3 5-5"/>',
  'cube':'<path d="m12 2 9 5v10l-9 5-9-5V7l9-5Zm0 10 9-5m-9 5L3 7m9 5v10"/>',
  'diamond':'<path d="M6 3h12l5 7-11 12L1 10l5-7Zm-5 7h22M9 3l-3 7 6 12 6-12-3-7"/>',
  'sliders':'<path d="M4 7h9m4 0h3M4 17h3m4 0h9M13 5v4m-2 6v4"/><circle cx="15" cy="7" r="2"/><circle cx="9" cy="17" r="2"/>',
  'globe':'<circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15 15 0 0 1 0 20M12 2a15 15 0 0 0 0 20"/>',
  'switch':'<path d="M3 7h18m-5-5 5 5-5 5M21 17H3m5-5-5 5 5 5"/>',
  'grid':'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>'
 };
 function makeIcon(key){
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
   svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');
   svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');
   svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
   svg.setAttribute('aria-hidden','true');svg.innerHTML=svgPaths[key]||svgPaths.code;
   return svg;
 }
 const rolePills=document.createElement('div');rolePills.className='neon-role-pills';rolePills.setAttribute('aria-label','Demo creative roles');
 for(const [icon,label] of [['code','Developer'],['layers','UI/UX Engineer'],['rocket','Product Builder'],['settings','Open Source'],['infinity','Tech Innovator']]){
  const badge=document.createElement('span');badge.className='neon-orbit-badge';
  const bubble=document.createElement('b');bubble.className='neon-orbit-bubble';bubble.append(makeIcon(icon));
  const text=document.createElement('span');text.className='neon-orbit-label';text.textContent=label;
  badge.append(bubble,text);rolePills.append(badge);
 }
 hero.querySelector('.hero-art')?.append(rolePills);
 const actions=hero.querySelector('.hero-actions');
 if(actions){
   const tour=document.createElement('button');tour.type='button';tour.className='neon-intro-button';
   tour.textContent='▷ Watch Intro · Soon';tour.title='Intro video is not yet available';tour.disabled=true;
   actions.append(tour);
 }
 const value=document.createElement('section');value.className='neon-value-section';value.setAttribute('aria-label','Web Studio values');
 value.innerHTML='<div class="neon-value-message"><span class="neon-infinity" aria-hidden="true">∞</span><div><h2>You are in control of your web presence and your data.</h2><p>Customize and export your demo profile today. Provider switching, automated cloud backup and failover are planned, not active.</p></div></div><div class="neon-value-benefits"><span><b aria-hidden="true">☁</b>Auto Backup<i>Planned</i></span><span><b aria-hidden="true">↺</b>Auto Restore<i>Planned</i></span><span><b aria-hidden="true">▤</b>Multi-Provider<i>Planned</i></span><span><b aria-hidden="true">♢</b>Always Available<i>Design goal</i></span></div>';
 const benefitIcons=['cloud','history','server','shield'];
 value.querySelectorAll('.neon-value-benefits b').forEach((b,i)=>b.replaceChildren(makeIcon(benefitIcons[i])));
  const cards=document.createElement('div');cards.className='neon-feature-grid';cards.setAttribute('aria-label','Studio product highlights');
 const tiles=[['cube','Fully Modular','Enable only what you need'],['diamond','Premium & Stylish','Modern, professional design'],['sliders','Fully Customizable','Edit and export demo data'],['globe','Local to Global','Work offline, publish later'],['switch','Switch Any Provider','Hosting, DNS, domain','Planned'],['grid','Complete Management','Your entire site, all in one','Planned']];
 for(const [icon,title,sub,status] of tiles){
  const article=document.createElement('article');article.className='neon-feature-card';
  const ic=document.createElement('span');ic.className='neon-feature-icon';ic.append(makeIcon(icon));ic.setAttribute('aria-hidden','true');
  const info=document.createElement('div');const strong=document.createElement('strong');strong.textContent=title;
  const small=document.createElement('small');small.textContent=sub;info.append(strong,small);
  if(status){const badge=document.createElement('small');badge.className='planned';badge.textContent=status;info.append(badge)}
  article.append(ic,info);cards.append(article);
 }
 hero.insertAdjacentElement('afterend',value);value.insertAdjacentElement('afterend',cards);
 // Keep the existing tour/editor/plan actions mounted and visible below the reference hero.
 const product=document.querySelector('.studio-product-strip');
 if(product)cards.insertAdjacentElement('afterend',product);
})();
