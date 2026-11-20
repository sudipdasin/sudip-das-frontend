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
 const headerBrand=document.querySelector('#demo-brand-wrapper .muted');
 if(headerBrand)headerBrand.textContent='WEB STUDIO';
 const banner=document.querySelector('.banner');
 if(banner){
  const tagline=document.createElement('span');tagline.className='demo-glow-banner';
  tagline.innerHTML='<b aria-hidden="true">∞</b> Web Studio — Create an Everlasting Web Presence  |  Modular • Customizable • Local to Global • Provider Freedom';
  banner.replaceChildren(tagline);
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
 const intro=$('location');if(intro)intro.classList.add('neon-position');
 const rolePills=document.createElement('div');rolePills.className='neon-role-pills';rolePills.setAttribute('aria-label','Demo creative roles');
 for(const [icon,label] of [['⌘','Developer'],['▱','UI/UX Engineer'],['↗','Product Builder'],['⚙','Open Source'],['∞','Tech Innovator']]){
  const s=document.createElement('span');const b=document.createElement('b');b.textContent=icon;s.append(b,document.createTextNode(label));rolePills.append(s);
 }
 hero.querySelector('.hero-art')?.append(rolePills);
 const actions=hero.querySelector('.hero-actions');
 if(actions){
   const tour=document.createElement('button');tour.type='button';tour.className='neon-intro-button';
   tour.textContent='▷ Watch Intro';tour.title='Open the working guided tour';
   tour.addEventListener('click',()=>$('tour-start')?.click());
   actions.append(tour);
 }
 const value=document.createElement('section');value.className='neon-value-section';value.setAttribute('aria-label','Web Studio values');
 value.innerHTML='<div class="neon-value-message"><span class="neon-infinity" aria-hidden="true">∞</span><div><h2>You are in control of your web presence and your data.</h2><p>Customize and export your demo profile today. Provider switching, automated cloud backup and failover are planned, not active.</p></div></div><div class="neon-value-benefits"><span><b aria-hidden="true">☁</b>Auto Backup<i>Planned</i></span><span><b aria-hidden="true">↺</b>Auto Restore<i>Planned</i></span><span><b aria-hidden="true">▤</b>Multi-Provider<i>Planned</i></span><span><b aria-hidden="true">♢</b>Always Available<i>Design goal</i></span></div>';
 const cards=document.createElement('div');cards.className='neon-feature-grid';cards.setAttribute('aria-label','Studio product highlights');
 const tiles=[['⬡','Fully Modular','Enable only what you need'],['◇','Premium & Stylish','Modern, professional design'],['☷','Fully Customizable','Edit and export demo data'],['◎','Local to Global','Work offline, publish later'],['⇄','Switch Any Provider','Hosting, DNS, domain','Planned'],['▦','Complete Management','Your entire site, all in one','Planned']];
 for(const [icon,title,sub,status] of tiles){
  const article=document.createElement('article');article.className='neon-feature-card';
  const ic=document.createElement('span');ic.className='neon-feature-icon';ic.textContent=icon;ic.setAttribute('aria-hidden','true');
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
