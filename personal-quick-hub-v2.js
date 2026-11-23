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
 const ids=['navigate','themes','tools'];
 const names=['Explore','Themes','Tools'];
 const icons=['◇','◈','✧'];
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
  ['▦','Explore projects','Browse the public portfolio gallery',()=>document.querySelector('#projects')?.scrollIntoView({behavior:'smooth',block:'start'})],
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
 const privacy=create('p','pv-hub-privacy','No tracking · No account access · Theme changes are local');
 panel.prepend(top,scope,progress,tabs,content);
 panel.append(privacy);
 let active=0;
 function activate(index,focus=false){
  active=(index+buttons.length)%buttons.length;
  buttons.forEach((t,i)=>{
   const selected=i===active;
   t.setAttribute('aria-selected',String(selected));
   t.tabIndex=selected?0:-1;
   panes[i].hidden=!selected;
  });
  if(focus)buttons[active].focus();
 }
 buttons.forEach((t,i)=>{
  t.addEventListener('click',()=>activate(i));
  t.addEventListener('keydown',e=>{
   if(e.key==='ArrowRight'){e.preventDefault();activate(i+1,true);}
   else if(e.key==='ArrowLeft'){e.preventDefault();activate(i-1,true);}
   else if(e.key==='Home'){e.preventDefault();activate(0,true);}
   else if(e.key==='End'){e.preventDefault();activate(2,true);}
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
  contextText.textContent='Viewing · '+current;
  if(themeButtons)themeButtons.querySelectorAll('button[data-theme]').forEach(b=>{
   b.setAttribute('aria-pressed',String(b.dataset.theme===document.body.dataset.theme));
  });
 };
 const schedule=()=>{if(ticking)return;ticking=true;requestAnimationFrame(update);};
 window.addEventListener('scroll',schedule,{passive:true});
 window.addEventListener('resize',schedule,{passive:true});
 document.addEventListener('profile-language-change',schedule);
 byId('theme-select')?.addEventListener('change',schedule);
 trigger.addEventListener('click',()=>{
  if(!panel.hidden){activate(0);update();}
 });
 panel.querySelectorAll('.ws-visitor-quick-links a,.ws-visitor-quick-themes button').forEach(item=>{
  item.addEventListener('click',schedule);
 });
 update();
})();