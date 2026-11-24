/* Personal Quick Hub v2 — deterministic visitor-only navigation.
 * Builds on original Quick Actions, never exposes editing or privileged APIs.
 * No analytics, storage, artificial intelligence or remote requests.
 */
(()=>{
 'use strict';
 const byId=id=>document.getElementById(id);
 const quick=byId('ws-visitor-quick-open')?.closest('.pv-smart-float');
 const panel=byId('ws-visitor-quick-panel');
 const trigger=byId('ws-visitor-quick-open');
 if(!quick||!panel||!trigger||panel.dataset.hubEnhanced)return;
 panel.dataset.hubEnhanced='true';
 quick.classList.add('pv-hub-v2');
 panel.classList.add('pv-hub-panel-v2');
 panel.setAttribute('aria-label','Portfolio navigation, themes and visitor tools');
 const create=(tag,className,text)=>{
  const x=document.createElement(tag);
  if(className)x.className=className;
  if(text!==undefined)x.textContent=text;
  return x;
 };
 const oldTitle=panel.querySelector(':scope > strong');
 if(oldTitle)oldTitle.remove();
 const top=create('div','pv-hub-heading');
 const brand=create('div','pv-hub-brand');
 brand.append(create('span','pv-hub-mark','✦'));
 const titles=create('div','pv-hub-titles');
 titles.append(create('strong','','Explore smarter'),create('small','','Visitor tools · Local only'));
 brand.append(titles);
 const close=create('button','pv-hub-close','×');
 close.type='button';
 close.setAttribute('aria-label','Close quick actions');
 close.addEventListener('click',()=>trigger.click());
 top.append(brand,close);
 const scope=create('div','pv-hub-context');
 const contextText=create('span','pv-hub-current','Viewing · Introduction');
 contextText.setAttribute('aria-live','polite');
 const progressText=create('span','pv-hub-progress-label','0% viewed');
 scope.append(contextText,progressText);
 const progress=create('div','pv-hub-progress');
 progress.setAttribute('role','progressbar');
 progress.setAttribute('aria-label','Portfolio reading progress');
 progress.setAttribute('aria-valuemin','0');
 progress.setAttribute('aria-valuemax','100');
 const bar=create('span','pv-hub-progress-bar');
 progress.append(bar);
 const tabs=create('div','pv-hub-tabs');
 tabs.setAttribute('role','tablist');
 tabs.setAttribute('aria-label','Quick action groups');
 const content=create('div','pv-hub-body');
 const ids=['navigate','themes','tools','connect'];
 const names=['Explore','Themes','Tools','Connect'];
 const icons=['◇','◈','✧','♡'];
 const panes=[];
 const buttons=[];
 ids.forEach((id,i)=>{
  const tab=create('button','pv-hub-tab');
  tab.type='button';tab.id='pv-hub-tab-'+id;
  tab.setAttribute('role','tab');
  tab.setAttribute('aria-controls','pv-hub-panel-'+id);
  tab.innerHTML='<span aria-hidden="true">'+icons[i]+'</span> '+names[i];
  const pane=create('section','pv-hub-pane');
  pane.id='pv-hub-panel-'+id;
  pane.setAttribute('role','tabpanel');
  pane.setAttribute('aria-labelledby',tab.id);
  pane.tabIndex=0;
  panes.push(pane);buttons.push(tab);
  tabs.append(tab);content.append(pane);
 });
 const recommendation=panel.querySelector('.pv-smart-recommendation');
 const links=panel.querySelector('.ws-visitor-quick-links');
 const oldThemeLabel=panel.querySelector('.ws-visitor-quick-title');
 const themeButtons=panel.querySelector('.ws-visitor-quick-themes');
 if(recommendation)panes[0].append(recommendation);
 panes[0].append(create('p','pv-hub-group-title','JUMP TO SECTION'));
 if(links)panes[0].append(links);
 panes[1].append(create('p','pv-hub-group-title','CHOOSE A VISUAL THEME'));
 const themeInfo=create('p','pv-hub-description','Themes change only your browser view. No site settings are modified.');
 panes[1].append(themeInfo);
 if(oldThemeLabel)oldThemeLabel.remove();
 if(themeButtons)panes[1].append(themeButtons);
 panes[2].append(create('p','pv-hub-group-title','DISCOVER & COLLECT'));
 const tools=create('div','pv-hub-tools');
 const actions=[
  ['✦','Start guided tour','Visit each public section in order',()=>byId('ws-tour-start')?.click()],
  ['▦','Explore projects','Search and filter the public portfolio',()=>{
    if(window.__wsPortfolio328?.focusSearch)window.__wsPortfolio328.focusSearch();
    else document.querySelector('#projects')?.scrollIntoView({behavior:'smooth',block:'start'});
  }],
  ['☑','Build a shortlist','Select projects to compare or copy',()=>byId('ws-visitor-hub')?.scrollIntoView({behavior:'smooth',block:'start'})],
  ['▶','Professional video','Go to the introduction preview',()=>byId('pv-intro-expand')?.scrollIntoView({behavior:'smooth',block:'center'})],
  ['↑','Back to top','Return to the introduction',()=>byId('top')?.scrollIntoView({behavior:'smooth',block:'start'})]
 ];
 actions.forEach(([symbol,label,desc,fn])=>{
  const action=create('button','pv-hub-tool');
  action.type='button';
  const mark=create('span','pv-hub-tool-icon',symbol);
  mark.setAttribute('aria-hidden','true');
  const copy=create('span','pv-hub-tool-copy');
  copy.append(create('strong','',label),create('small','',desc));
  action.append(mark,copy,create('span','pv-hub-tool-arrow','↗'));
  action.addEventListener('click',()=>{
   trigger.click();
   fn();
  });
  tools.append(action);
 });
 panes[2].append(tools);
 // Two compact, read-only windows are available both in Tools and beneath
 // Let's Connect. Existing vault privacy and WebStudio walkthrough are reused.
 const miniSpecs=[
  {title:'The canvas',caption:'Layout and visual hierarchy',src:'webstudio-inline-layout.svg'},
  {title:'Visual styles',caption:'Editorial, Neon and Aurora concepts',src:'webstudio-inline-themes.svg'},
  {title:'The journey',caption:'Design direction to responsive review',src:'webstudio-inline-workflow.svg'}
 ];
 const reducedMotion=()=>window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 const scrollTo=(element)=>element?.scrollIntoView({behavior:reducedMotion()?'auto':'smooth',block:'start'});
 function openExistingRequest(){
  if(!panel.hidden)trigger.click();
  const shell=byId('private-details');
  if(!shell)return;
  shell.dataset.pinned='true';
  shell.open=true;
  const summary=shell.querySelector('.request-shell-summary');
  summary?.setAttribute('aria-expanded','true');
  scrollTo(shell);
  if(summary)summary.focus({preventScroll:true});
 }
 function openExistingWebStudio(){
  if(!panel.hidden)trigger.click();
  const launch=byId('ws-demo-jump');
  if(!launch)return;
  if(launch.getAttribute('aria-expanded')!=='true')launch.click();
  scrollTo(byId('ws-inline-demo'));
 }
 function makeMiniRequest(){
  const details=create('details','pv-connect-mini pv-connect-mini-request');
  const summary=create('summary','pv-connect-mini-summary');
  const glyph=create('span','pv-connect-mini-glyph','▤');glyph.setAttribute('aria-hidden','true');
  const label=create('span','pv-connect-mini-summary-copy');
  label.append(create('strong','','Request selected profile details'),create('small','','Owner-reviewed · 6 information categories'));
  summary.append(glyph,label,create('span','pv-connect-mini-chevron','⌄'));
  const body=create('div','pv-connect-mini-content');
  body.append(create('p','pv-connect-mini-note','Select only the details you need:'));
  const list=create('div','pv-connect-mini-chips');
  ['Address','Career','Academic','Projects','Certifications','Documents'].forEach(t=>list.append(create('span','',t)));
  body.append(list);
  const safety=create('p','pv-connect-mini-privacy','Requests are disabled on this public preview. No private information is shown or sent.');
  body.append(safety);
  const action=create('button','pv-connect-mini-cta','Open owner-reviewed detail form ↗');
  action.type='button';
  action.addEventListener('click',openExistingRequest);
  body.append(action);details.append(summary,body);
  return details;
 }
 function makeMiniStudio(){
  const details=create('details','pv-connect-mini pv-connect-mini-studio');
  const summary=create('summary','pv-connect-mini-summary');
  const glyph=create('span','pv-connect-mini-glyph','✧');glyph.setAttribute('aria-hidden','true');
  const label=create('span','pv-connect-mini-summary-copy');
  label.append(create('strong','','WebStudio · miniature preview'),create('small','','3 illustrated interactive chapters'));
  summary.append(glyph,label,create('span','pv-connect-mini-chevron','⌄'));
  const body=create('div','pv-connect-mini-content');
  const visual=create('div','pv-connect-mini-visual');
  const image=create('img','pv-connect-mini-image');
  image.width=1200;image.height=720;
  image.loading='lazy';image.decoding='async';
  const buttons=create('div','pv-connect-mini-nav');
  buttons.setAttribute('role','group');
  buttons.setAttribute('aria-label','Choose WebStudio preview chapter');
  const status=create('p','pv-connect-mini-caption');
  let active=0,loaded=false;
  const selectors=[];
  function show(index){
   active=index;
   const chapter=miniSpecs[index];
   image.src=chapter.src;
   image.alt='Illustrated WebStudio preview: '+chapter.title;
   status.textContent=(index+1)+' / '+miniSpecs.length+' · '+chapter.caption;
   selectors.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===active)));
  }
  miniSpecs.forEach((item,i)=>{
   const button=create('button','pv-connect-mini-chapter',String(i+1));
   button.type='button';button.title=item.title;
   button.setAttribute('aria-label','Preview '+item.title);
   button.addEventListener('click',()=>show(i));
   selectors.push(button);buttons.append(button);
  });
  details.addEventListener('toggle',()=>{
   if(details.open&&!loaded){loaded=true;show(0);}
  });
  visual.append(image);
  body.append(visual,buttons,status,create('p','pv-connect-mini-note','Illustrated WebStudio design walkthrough; not a live editing canvas.'));
  const launch=create('button','pv-connect-mini-cta','Open full inline walkthrough ↗');
  launch.type='button';launch.addEventListener('click',openExistingWebStudio);
  body.append(launch);
  details.append(summary,body);
  return details;
 }
 function addMiniPair(mount){
  if(!mount)return;
  mount.append(makeMiniRequest(),makeMiniStudio());
 }
 const toolPreviews=create('div','pv-hub-mini-previews');
 toolPreviews.append(create('p','pv-hub-group-title','IN-PANEL PREVIEWS'));
 panes[2].append(toolPreviews);
 addMiniPair(toolPreviews);
 addMiniPair(byId('pv-connect-mini-mount'));

 // Only published first-party contact destinations are cloned into Quick Hub.
 // No invented profiles, automated DMs, account access or form submissions.
 panes[3].append(create('p','pv-hub-group-title','CONNECT DIRECTLY'));
 const connectIntro=create('p','pv-hub-description','Choose how to connect with Sudip Das using his published profiles.');
 panes[3].append(connectIntro);
 const groups=[
  {title:'Direct · Email',nodes:['.pv-connect-email']},
  {title:'Professional · LinkedIn, GitHub, Teams',nodes:['.pv-connect-social[data-social="linkedin"]','.pv-connect-social[data-social="github"]','.pv-connect-social[data-social="teams"]']},
  {title:'Social & creative · YouTube, Facebook, Instagram, X',nodes:['.pv-connect-social[data-social="youtube"]','.pv-connect-social[data-social="facebook"]','.pv-connect-social[data-social="instagram"]','.pv-connect-social[data-social="x"]']},
  {title:'Messaging · WhatsApp, Telegram, Google Chat & Discord',nodes:['.pv-connect-social[data-social="whatsapp"]','.pv-connect-social[data-social="telegram"]','.pv-connect-social[data-social="googlechat"]','.pv-connect-social[data-social="discord"]']}
 ];
 const connectCards=create('div','pv-hub-connect-cards');
 const valid=(url,kind)=>{
  if(kind==='email')return /^mailto:sudipdasin@gmail\.com(?:\?.*)?$/i.test(url);
  try{
   const target=new URL(url,location.href);
   const approved=new Set([
    'https://github.com/sudipdasin',
    'https://www.linkedin.com/in/sudipdasin/',
    'https://www.youtube.com/c/SudipDas',
    'https://www.facebook.com/sudipdasin',
    'https://www.instagram.com/sudipdasin/',
    'https://x.com/sudipdasin',
    'https://teams.microsoft.com/l/chat/0/0?users=sudipdasin%40gmail.com',
    'https://chat.google.com/',
    'https://discord.com/channels/@me',
    'https://wa.me/919007625506',
    'https://t.me/sudipdasin'
   ]);
   return target.protocol==='https:' &&
    target.username===''&&target.password==='' &&
    approved.has(target.href);
  }catch{return false;}
 };
 for(const group of groups){
  const box=create('div','pv-hub-connect-group');
  box.append(create('p','pv-hub-connect-category',group.title));
  for(const selector of group.nodes){
   const source=document.querySelector(selector);
   const href=source?.getAttribute('href')||'';
   if(!source||!valid(href,selector==='.pv-connect-email'?'email':'social'))continue;
   const item=create('a','pv-hub-connect-link');
   item.href=href;
   item.append(source.querySelector('svg')?.cloneNode(true)||create('span','','↗'));
   const dest=source.matches('.pv-connect-email')?'Email Sudip':
    source.querySelector('.pv-connect-social-copy strong')?.textContent||'Open public profile';
   item.append(create('span','',dest),create('span','pv-hub-connect-arrow','↗'));
   if(!href.startsWith('mailto:')){item.target='_blank';item.rel='noopener noreferrer';}
   box.append(item);
  }
  connectCards.append(box);
 }
 panes[3].append(connectCards);
 // The freelancer panel stays collapsed on initial render. Explicit user
 // action from the Connect tab expands it, not a background side effect.
 const openFreelancer=create('button','pv-hub-contact-cta','Freelancer Connect · Historical profiles ⌄');
 openFreelancer.type='button';
 openFreelancer.addEventListener('click',()=>{
  if(!panel.hidden)trigger.click();
  const accordion=byId('pv-freelancer-connect');
  if(!accordion)return;
  accordion.open=true;
  accordion.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
  accordion.querySelector('summary')?.focus({preventScroll:true});
 });
 panes[3].append(openFreelancer);
 // Copy actions require a click. No implied WhatsApp/Discord/Microsoft login,
 // private chats, or automatic messages are created.
 document.querySelectorAll('.pv-connect-identity-copy[data-copy-contact]').forEach(button=>{
  button.addEventListener('click',async()=>{
   const approved=new Set(['sudipdasin@gmail.com','sudipdasin','super_gamer26','+919007625506','@sudipdasin']);
   const value=button.dataset.copyContact;
   if(!approved.has(value))return;
   const status=byId('pv-connect-status');
   try{
    if(!navigator.clipboard?.writeText)throw Error('Clipboard unavailable');
    await navigator.clipboard.writeText(value);
    if(status){status.hidden=false;status.textContent='Copied '+value+' — paste it into the corresponding chat app.';}
   }catch{
    if(!status)return;
    status.hidden=false;
    status.textContent='Copy the contact ID from the field below:';
    let input=byId('pv-connect-id-fallback');
    if(!input){input=create('input','pv-connect-email-fallback');input.id='pv-connect-id-fallback';input.readOnly=true;status.insertAdjacentElement('afterend',input);}
    input.hidden=false;input.value=value;input.focus();input.select();
   }
  });
 });
 const goToContact=create('button','pv-hub-contact-cta','Explore all connection options ↗');
 goToContact.type='button';
 goToContact.addEventListener('click',()=>{if(!panel.hidden)trigger.click();scrollTo(byId('contact'));});
 panes[3].append(goToContact);
 const copyEmail=byId('pv-connect-copy-email');
 const copyStatus=byId('pv-connect-status');
 copyEmail?.addEventListener('click',async()=>{
  const address='sudipdasin@gmail.com';
  try{
   if(!navigator.clipboard?.writeText)throw Error('Clipboard access unavailable');
   await navigator.clipboard.writeText(address);
   if(copyStatus){copyStatus.hidden=false;copyStatus.textContent='Email address copied. Choose a topic or compose your message.';}
  }catch{
   const field=byId('pv-connect-email-fallback');
   if(field){field.hidden=false;field.focus();field.select();}
   if(copyStatus){copyStatus.hidden=false;copyStatus.textContent='Select and copy the email address shown above.';}
  }
 });
 const privacy=create('p','pv-hub-privacy','No tracking · No account access · Theme changes are local');
 panel.prepend(top,scope,progress,tabs,content);
 panel.append(privacy);
 let active=0;
 function activate(index,focus=false){
  active=(index+buttons.length)%buttons.length;
  panel.dataset.wsQuickActive=ids[active];
  buttons.forEach((t,i)=>{
   const selected=i===active;
   t.setAttribute('aria-selected',String(selected));
   t.tabIndex=selected?0:-1;
   panes[i].hidden=!selected;
  });
  if(focus)buttons[active].focus();
  window.dispatchEvent(new CustomEvent('ws-quick-menu-tab-change',{detail:{tab:ids[active]}}));
 }
 buttons.forEach((t,i)=>{
  t.addEventListener('click',()=>activate(i));
  t.addEventListener('keydown',e=>{
   if(e.key==='ArrowRight'){e.preventDefault();activate(i+1,true);}
   else if(e.key==='ArrowLeft'){e.preventDefault();activate(i-1,true);}
   else if(e.key==='Home'){e.preventDefault();activate(0,true);}
   else if(e.key==='End'){e.preventDefault();activate(buttons.length-1,true);}
  });
 });
 activate(0);
 const sections=[
  ['top','Introduction'],
  ['about','About'],
  ['projects','Projects'],
  ['experience','Experience'],
  ['capabilities','Strengths'],
  ['contact','Contact']
 ];
 let ticking=false;
 const update=()=>{
  ticking=false;
  const amount=Math.max(0,document.documentElement.scrollHeight-window.innerHeight);
  const pct=amount?Math.max(0,Math.min(100,Math.round(window.scrollY/amount*100))):100;
  bar.style.width=pct+'%';
  progress.setAttribute('aria-valuenow',String(pct));
  progressText.textContent=pct+'% viewed';
  let current='Introduction';
  const pos=window.innerHeight*.43;
  for(const [id,name] of sections){
   const el=byId(id);if(!el)continue;
   const box=el.getBoundingClientRect();
   if(box.top<=pos&&box.bottom>0)current=name;
  }
  const locale=window.profileI18n;
  const index=sections.findIndex(([,name])=>name===current);
  const path=['','nav.0','nav.1','nav.2','nav.3',''][index];
  const translated=path?locale?.get?.(path):null;
  contextText.textContent='Viewing · '+(typeof translated==='string'&&translated?translated:current);
  if(themeButtons)themeButtons.querySelectorAll('button[data-theme]').forEach(b=>{
   b.setAttribute('aria-pressed',String(b.dataset.theme===document.body.dataset.theme));
  });
 };
 const schedule=()=>{if(ticking)return;ticking=true;requestAnimationFrame(update);};
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 document.addEventListener('profile-language-change',schedule);
 window.addEventListener('ws-engine-theme-change',schedule);
 byId('theme-select')?.addEventListener('change',schedule);
 trigger.addEventListener('click',()=>{
  if(!panel.hidden){activate(0);update();}
 });
 panel.querySelectorAll('.ws-visitor-quick-links a,.ws-visitor-quick-themes button').forEach(item=>{
  item.addEventListener('click',schedule);
 });
 update();
})();