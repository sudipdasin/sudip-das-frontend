/* WebStudio Hero Explorer v3.26: progressive enhancement of "Explore my work".
 * A local, accessible command center built only from published portfolio content.
 * No invented metrics, API requests, AI claims, telemetry or account access.
 */
(() => {
 'use strict';
 if(window.__wsHeroExplorer326)return;
 const original=document.querySelector('.hero .actions a.button.primary[href="#projects"]');
 const projectsSection=document.querySelector('#projects');
 if(!original||!projectsSection)return;
 const validTabs=['projects','strengths','experience','connect'];
 const query=new URLSearchParams(location.search);
 const pickTab=value=>validTabs.includes(value)?value:'projects';
 const create=(tag,cls,content)=>{
   const e=document.createElement(tag);
   if(cls)e.className=cls;
   if(content!==undefined)e.textContent=content;
   return e;
 };
 const safeLink=(a)=>{
   if(!a)return null;
   const raw=a.getAttribute('href')||'';
   if(/^#[a-z][a-z0-9-]*$/i.test(raw)&&document.getElementById(raw.slice(1)))return raw;
   if(/^mailto:[^<>"\s]+$/i.test(raw))return raw;
   try{
     const u=new URL(raw,location.href);
     if(u.protocol==='https:'&&['github.com','www.linkedin.com','linkedin.com','wa.me','t.me'].includes(u.hostname))return u.href;
   }catch{}
   return null;
 };
 const projectCards=[...projectsSection.querySelectorAll('article.project')];
 const projects=projectCards.map(card=>{
   const title=card.querySelector('h3')?.textContent?.trim().slice(0,100)||'';
   const type=card.querySelector('.project-type')?.textContent?.trim().slice(0,60)||'';
   const state=card.querySelector('.project-state')?.textContent?.trim().slice(0,40)||'';
   const description=card.querySelector('p')?.textContent?.trim().slice(0,250)||'';
   const href=safeLink(card.querySelector('.project-link'));
   return title&&href?{title,type,state,description,href,kind:/Linux/i.test(type)?'linux':'creative'}:null;
 }).filter(Boolean);
 const strengths=[...document.querySelectorAll('#capabilities article.cap')].map(card=>({
   title:card.querySelector('h3')?.textContent?.trim().slice(0,90)||'',
   type:card.querySelector('.cap-num')?.textContent?.trim().slice(0,45)||'',
   description:card.querySelector('p')?.textContent?.trim().slice(0,200)||''
 })).filter(x=>x.title);
 const pillars=[...document.querySelectorAll('#experience .foundation-pillar-list li')].map(node=>({
   title:node.querySelector('strong')?.textContent?.trim().slice(0,95)||'',
   description:node.querySelector('div span')?.textContent?.trim().slice(0,200)||''
 })).filter(x=>x.title);
 const proofs=[...document.querySelectorAll('#about .proof')].map(n=>({
   number:n.querySelector('strong')?.textContent?.trim()||'',
   label:n.querySelector('span')?.textContent?.trim()||''
 })).filter(x=>x.number&&x.label).slice(0,3);
 const contactLinks=[...document.querySelectorAll('#contact .pv-connect-primary a.pv-connect-primary-link')]
   .map(link=>({
     label:link.querySelector('strong')?.textContent?.trim()||'Connect',
     description:link.querySelector('small')?.textContent?.trim()||'',
     href:safeLink(link)
   })).filter(x=>x.href).slice(0,3);
 const button=create('button','button primary hx-trigger');
 button.type='button';
 button.id='hero-explorer-launch';
 button.setAttribute('aria-haspopup','dialog');
 button.setAttribute('aria-controls','hero-explorer-dialog');
 button.setAttribute('aria-expanded','false');
 button.setAttribute('aria-label','Open interactive portfolio explorer');
 const buttonMark=create('span','hx-trigger-icon','✦');
 buttonMark.setAttribute('aria-hidden','true');
 const buttonCopy=create('span','hx-trigger-copy');
 buttonCopy.append(create('strong','','Explore my work'),create('small','','Interactive portfolio guide'));
 button.append(buttonMark,buttonCopy,create('span','hx-trigger-arrow','↗'));
 const dialog=create('dialog','hx-dialog');
 dialog.id='hero-explorer-dialog';
 dialog.setAttribute('aria-labelledby','hx-dialog-heading');
 dialog.setAttribute('aria-describedby','hx-dialog-description');
 const header=create('header','hx-header');
 const headingGroup=create('div','hx-heading-group');
 const eyebrow=create('span','hx-eyebrow','HERO EXPLORER / INTERACTIVE');
 const heading=create('h2','hx-heading','Explore the work');
 heading.id='hx-dialog-heading';
 const subtitle=create('p','hx-description','Choose a route through real projects, strengths and experience.');
 subtitle.id='hx-dialog-description';
 headingGroup.append(eyebrow,heading,subtitle);
 const close=create('button','hx-close','×');close.type='button';
 close.setAttribute('aria-label','Close Hero Explorer');
 header.append(headingGroup,close);
 const primary=create('div','hx-primary');
 const routes=create('div','hx-routes');
 routes.append(create('p','hx-caption','START WITH YOUR GOAL'));
 const routeList=create('div','hx-route-list');
 const intentRoutes=[
  {label:'Explore software',hint:'Public projects',tab:'projects',glyph:'⌘'},
  {label:'Evaluate strengths',hint:'How I contribute',tab:'strengths',glyph:'◈'},
  {label:'Understand experience',hint:'Professional foundation',tab:'experience',glyph:'▤'},
  {label:'Get in touch',hint:'Public channels',tab:'connect',glyph:'↗'}
 ];
 for(const route of intentRoutes){
   const el=create('button','hx-route');
   el.type='button';el.dataset.tab=route.tab;
   const glyph=create('span','hx-route-glyph',route.glyph);
   glyph.setAttribute('aria-hidden','true');
   const words=create('span','hx-route-words');
   words.append(create('strong','',route.label),create('small','',route.hint));
   el.append(glyph,words);
   el.addEventListener('click',()=>setTab(route.tab));
   routeList.append(el);
 }
 routes.append(routeList);
 const content=create('div','hx-content');
 const tabs=create('div','hx-tabs');
 tabs.setAttribute('role','tablist');
 tabs.setAttribute('aria-label','Explore portfolio information');
 const labels={projects:'Projects',strengths:'Strengths',experience:'Experience',connect:'Connect'};
 const tabButtons={};
 for(const name of validTabs){
   const tab=create('button','hx-tab',labels[name]);
   tab.type='button';tab.id='hx-tab-'+name;
   tab.setAttribute('role','tab');
   tab.setAttribute('aria-controls','hx-tab-panel');
   tab.dataset.tab=name;
   tab.addEventListener('click',()=>setTab(name));
   tab.addEventListener('keydown',event=>{
     if(!['ArrowRight','ArrowLeft','Home','End'].includes(event.key))return;
     event.preventDefault();
     let next=validTabs.indexOf(tab.dataset.tab);
     if(event.key==='Home')next=0;
     else if(event.key==='End')next=validTabs.length-1;
     else next=(next+(event.key==='ArrowRight'?1:-1)+validTabs.length)%validTabs.length;
     setTab(validTabs[next]);tabButtons[validTabs[next]].focus();
   });
   tabs.append(tab);tabButtons[name]=tab;
 }
 const panel=create('section','hx-tab-panel');
 panel.id='hx-tab-panel';panel.setAttribute('role','tabpanel');
 panel.setAttribute('aria-labelledby','hx-tab-projects');
 panel.tabIndex=0;
 const footer=create('footer','hx-footer');
 const feedback=create('span','hx-feedback','Local explorer · No sign-in or tracking');
 feedback.setAttribute('role','status');
 feedback.setAttribute('aria-live','polite');
 const controls=create('div','hx-footer-actions');
 const link=create('a','hx-full-link','View full section ↗');
 link.href='#projects';
 const copy=create('button','hx-copy-link','Copy view link');copy.type='button';
 controls.append(copy,link);footer.append(feedback,controls);
 content.append(tabs,panel,footer);
 primary.append(routes,content);
 dialog.append(header,primary);
 document.body.append(dialog);
 original.replaceWith(button);
 let selected='projects',filter='all',term='',opened=false;
 let savedFocus=null;
 const makeLink=(title,href,cls='hx-item-link')=>{
   const a=create('a',cls,title);a.href=href;
   if(href.startsWith('https:')){a.target='_blank';a.rel='noopener noreferrer'}
   return a;
 };
 function listItems(items,{empty='No matching items.'}={}){
   const list=create('div','hx-items');
   if(!items.length){list.append(create('p','hx-empty',empty));return list}
   for(const item of items){
     const card=create('article','hx-item');
     const top=create('div','hx-item-head');
     top.append(create('h3','',item.title));
     if(item.state)top.append(create('span','hx-item-state',item.state));
     card.append(top);
     if(item.type)card.append(create('p','hx-item-type',item.type));
     if(item.description)card.append(create('p','hx-item-description',item.description));
     if(item.href)card.append(makeLink('View public repository ↗',item.href));
     list.append(card);
   }
   return list;
 }
 const textMatches=(item,words)=>{
   const haystack=[item.title,item.type,item.description,item.state].filter(Boolean).join(' ').toLowerCase();
   return words.every(w=>haystack.includes(w));
 };
 function renderProjects(){
   const heading=create('div','hx-view-head');
   heading.append(create('h3','','Public software projects'),create('span','hx-view-count',String(projects.length)+' listed'));
   const searchWrap=create('div','hx-project-tools');
   const label=create('label','hx-search-label','Find a project');
   const input=create('input','hx-search');
   input.type='search';input.id='hx-search-projects';input.placeholder='Search software, Linux, creative tools…';
   input.autocomplete='off';input.value=term;
   label.htmlFor=input.id;
   input.setAttribute('aria-controls','hx-project-results');
   const pills=create('div','hx-filters');
   const filterNames={all:'All',linux:'Linux / desktop',creative:'Creative tools'};
   const result=create('div','hx-results');result.id='hx-project-results';
   result.setAttribute('aria-live','polite');result.setAttribute('aria-atomic','false');
   const render=()=>{
     const words=term.trim().toLowerCase().slice(0,80).split(/\s+/).filter(Boolean);
     const matches=projects.filter(p=>(filter==='all'||p.kind===filter)&&textMatches(p,words));
     heading.lastChild.textContent=matches.length+' of '+projects.length;
     result.replaceChildren(listItems(matches,{empty:'No matching public projects. Try a broader search.'}));
     for(const [key,pill] of Object.entries(filterButtons))pill.setAttribute('aria-pressed',String(filter===key));
   };
   const filterButtons={};
   for(const [key,labelText] of Object.entries(filterNames)){
     const pill=create('button','hx-filter',labelText);
     pill.type='button';pill.dataset.filter=key;
     pill.setAttribute('aria-pressed',String(filter===key));
     pill.addEventListener('click',()=>{filter=key;render()});
     pills.append(pill);filterButtons[key]=pill;
   }
   input.addEventListener('input',()=>{term=input.value;render()});
   searchWrap.append(label,input,pills);
   panel.append(heading,searchWrap,result);
   render();
 }
 function renderStrengths(){
   panel.append(create('p','hx-view-intro','Published strengths from the portfolio, not inferred skill scores.'));
   panel.append(listItems(strengths));
   panel.append(makeLink('See full strengths section ↗','#capabilities','hx-bottom-link'));
 }
 function renderExperience(){
   panel.append(create('p','hx-view-intro','A practical foundation across people, systems and building useful tools.'));
   if(proofs.length){
     const bar=create('div','hx-proofs');
     for(const proof of proofs){const item=create('div','hx-proof');
       item.append(create('strong','',proof.number),create('small','',proof.label));bar.append(item)}
     panel.append(bar);
   }
   panel.append(listItems(pillars));
   panel.append(makeLink('View experience ↗','#experience','hx-bottom-link'));
 }
 function renderConnect(){
   panel.append(create('p','hx-view-intro','Reach out through publicly listed contact channels. No form submission or account permissions are required.'));
   const collection=create('div','hx-contact-list');
   if(!contactLinks.length)collection.append(makeLink('Go to Contact ↗','#contact'));
   for(const item of contactLinks){
     const row=makeLink('',item.href,'hx-contact-item');
     row.append(create('strong','',item.label),create('small','',item.description||'Open public contact channel'));
     collection.append(row);
   }
   panel.append(collection);
   panel.append(makeLink('Explore all contact options ↗','#contact','hx-bottom-link'));
 }
 const targets={projects:'#projects',strengths:'#capabilities',experience:'#experience',connect:'#contact'};
 function setTab(next){
   if(!validTabs.includes(next))return;
   selected=next;
   dialog.dataset.view=next;
   for(const [name,tab] of Object.entries(tabButtons)){
     const active=name===selected;
     tab.setAttribute('aria-selected',String(active));
     tab.tabIndex=active?0:-1;
   }
   for(const button of routeList.children){
     button.setAttribute('aria-pressed',String(button.dataset.tab===next));
   }
   panel.setAttribute('aria-labelledby',tabButtons[next].id);
   panel.replaceChildren();
   if(next==='projects')renderProjects();
   else if(next==='strengths')renderStrengths();
   else if(next==='experience')renderExperience();
   else renderConnect();
   link.href=targets[next];
   feedback.textContent=labels[next]+' · Published portfolio information';
 }
 const panelFocus=()=>{
   const focusables=[...dialog.querySelectorAll('button:not([disabled]), a[href], input:not([disabled]), [tabindex="0"]')]
     .filter(node=>node.getClientRects?.().length!==0);
   return focusables;
 };
 function closeDialog(){
   if(!opened)return;
   opened=false;button.setAttribute('aria-expanded','false');
   dialog.classList.remove('hx-fallback-open');
   if(dialog.open&&typeof dialog.close==='function')dialog.close();
   else {dialog.removeAttribute('open');dialog.hidden=true}
   document.body.classList.remove('hx-explorer-active');
   const anchor=savedFocus?.isConnected?savedFocus:button;
   anchor.focus?.({preventScroll:true});
 }
 function openDialog(next='projects'){
   if(opened){setTab(next);return}
   savedFocus=document.activeElement;
   opened=true;dialog.hidden=false;button.setAttribute('aria-expanded','true');
   setTab(next);
   document.body.classList.add('hx-explorer-active');
   if(typeof dialog.showModal==='function'){
     try{dialog.showModal()}catch{dialog.classList.add('hx-fallback-open');dialog.setAttribute('open','')}
   }else{dialog.classList.add('hx-fallback-open');dialog.setAttribute('open','')}
   close.focus?.({preventScroll:true});
 }
 button.addEventListener('click',()=>openDialog('projects'));
 close.addEventListener('click',closeDialog);
 dialog.addEventListener('cancel',event=>{event.preventDefault();closeDialog()});
 dialog.addEventListener('click',event=>{if(event.target===dialog)closeDialog()});
 dialog.addEventListener('keydown',event=>{
   if(event.key==='Escape'){event.preventDefault();closeDialog()}
   if(event.key!=='Tab'||typeof dialog.showModal==='function')return;
   const focusables=panelFocus(),first=focusables[0],last=focusables[focusables.length-1];
   if(!first)return;
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
 });
 copy.addEventListener('click',async()=>{
   const url=new URL(location.href);url.searchParams.set('explore',selected);
   url.hash='';
   const share=url.href;
   try{
     if(!navigator.clipboard?.writeText)throw new Error('Clipboard unavailable');
     await navigator.clipboard.writeText(share);
     feedback.textContent='Link to '+labels[selected]+' view copied';
   }catch{feedback.textContent='Unable to copy here; use the address bar to share this page.'}
 });
 const requested=query.get('explore');
 // A direct link intentionally requests this view. Do not auto-open on ordinary visits.
 if(validTabs.includes(requested))openDialog(requested);
 window.__wsHeroExplorer326=Object.freeze({
   open:view=>openDialog(validTabs.includes(view)?view:'projects'),
   close:closeDialog,
   getStatus:()=>Object.freeze({open:opened,tab:selected,projects:projects.length,
     strengths:strengths.length,experiencePillars:pillars.length,contactMethods:contactLinks.length})
 });
})();
