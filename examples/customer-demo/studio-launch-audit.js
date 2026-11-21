/* WebStudio local launch-readiness inspector: no network calls, no site publishing.
   This is advisory and is NOT a WCAG, SEO, security, or performance certification. */
(()=>{
 'use strict';
 const openButton=document.getElementById('studio-audit-open');
 if(!openButton)return;
 let priorFocus=null,lastReport=null;
 const modal=document.createElement('div');
 modal.id='studio-audit-dialog';modal.className='studio-audit-dialog';modal.hidden=true;
 modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
 modal.setAttribute('aria-labelledby','studio-audit-title');
 modal.setAttribute('aria-describedby','studio-audit-description');
 const sheet=document.createElement('div');sheet.className='studio-audit-sheet';
 const heading=document.createElement('div');heading.className='studio-audit-header';
 const intro=document.createElement('div');
 const eyebrow=document.createElement('p');eyebrow.className='studio-audit-eyebrow';eyebrow.textContent='LOCAL PREVIEW · CHECKLIST';
 const title=document.createElement('h2');title.id='studio-audit-title';title.textContent='Launch readiness';
 const description=document.createElement('p');description.id='studio-audit-description';
 description.textContent='A fast, browser-local review of the current fictional demo. Advisory checks only—not a certification or live deployment scan.';
 intro.append(eyebrow,title,description);
 const closeButton=document.createElement('button');closeButton.type='button';closeButton.className='studio-audit-close';
 closeButton.textContent='Close';closeButton.setAttribute('aria-label','Close launch readiness inspector');
 heading.append(intro,closeButton);
 const summary=document.createElement('p');summary.className='studio-audit-summary';summary.setAttribute('role','status');
 const list=document.createElement('ul');list.className='studio-audit-list';
 const actions=document.createElement('div');actions.className='studio-audit-actions';
 const rerun=document.createElement('button');rerun.type='button';rerun.textContent='Run checks again';
 const save=document.createElement('button');save.type='button';save.textContent='Export report (.json)';
 save.className='studio-audit-export';
 const note=document.createElement('p');note.className='studio-audit-note';
 note.textContent='No results are uploaded. Report exports contain check results and theme only, never profile fields or contact details.';
 actions.append(rerun,save);
 sheet.append(heading,summary,list,actions,note);modal.append(sheet);document.body.append(modal);
 function audit(){
  const checks=[];
  const add=(id,label,pass,detail)=>checks.push({id,label,status:pass?'pass':'review',detail});
  const name=document.title.trim();
  add('title','Descriptive page title',name.length>=15&&name.length<=75&&/WebStudio/i.test(name),
      'A clear browser title helps visitors and search engines understand this preview.');
  const meta=document.querySelector('meta[name="description"]')?.content.trim()||'';
  add('description','Search description present',meta.length>=50&&meta.length<=200,
      'Use a concise description of what visitors can actually try.');
  const headings=[...document.querySelectorAll('h1')];
  add('heading','One primary page heading',headings.length===1&&Boolean(headings[0].textContent.trim()),
      'Found '+headings.length+' h1 elements in the live preview.');
  const images=[...document.querySelectorAll('img')];
  const unlabelled=images.filter(img=>!img.hasAttribute('alt'));
  add('images','Images specify alt text (empty for decoration)',unlabelled.length===0,
      unlabelled.length+' image(s) without an alt attribute.');
  const anchors=[...document.querySelectorAll('a[href]')];
  const unlabelledLinks=anchors.filter(a=>!(a.getAttribute('aria-label')||a.textContent||a.querySelector('img[alt]')?.getAttribute('alt')||'').trim());
  add('links','Links have accessible names',unlabelledLinks.length===0,
      unlabelledLinks.length+' link(s) without readable text or an accessible label.');
  const internal=anchors.filter(a=>a.getAttribute('href')?.startsWith('#')&&a.getAttribute('href')!=='#');
  const broken=internal.filter(a=>{
   try{return !document.getElementById(decodeURIComponent(a.getAttribute('href').slice(1)));}
   catch{return true;}
  });
  add('anchors','On-page navigation targets exist',broken.length===0,broken.length+' unresolved internal anchor(s).');
  const idSet=new Set(),duplicateIds=[];
  for(const element of document.querySelectorAll('[id]')){
   if(idSet.has(element.id))duplicateIds.push(element.id);
   idSet.add(element.id);
  }
  add('ids','Document identifiers are unique',duplicateIds.length===0,
      duplicateIds.length+' repeated identifier(s).');
  const overflow=Math.max(0,document.documentElement.scrollWidth-window.innerWidth);
  add('viewport','No horizontal page overflow',overflow<=2,'Overflow '+overflow+'px at '+window.innerWidth+'px viewport width.');
  const selected=document.getElementById('studio-theme')?.value;
  add('theme','Selected theme matches rendered page',Boolean(selected)&&selected===document.body.dataset.theme,
      'Current theme: '+(document.body.dataset.theme||'unknown')+'.');
  const checkout=document.getElementById('checkout-button');
  add('checkout','Unreleased checkout remains disabled',Boolean(checkout&&checkout.disabled),
      'Preview must not imply real payment or publishing capabilities.');
  const report={schemaVersion:1,scope:'fictional-webstudio-preview',generatedAt:new Date().toISOString(),
    theme:document.body.dataset.theme||'unknown',checks,
    disclaimer:'Browser-local advisory checklist; not a compliance audit or production deployment validation.'};
  lastReport=report;
  list.replaceChildren();
  for(const check of checks){
   const row=document.createElement('li');row.className='studio-audit-row';
   row.dataset.status=check.status;
   const symbol=document.createElement('span');symbol.className='studio-audit-indicator';
   symbol.textContent=check.status==='pass'?'✓':'!';
   symbol.setAttribute('aria-hidden','true');
   const words=document.createElement('div');
   const label=document.createElement('strong');label.textContent=check.label;
   const detail=document.createElement('p');detail.textContent=check.detail;
   words.append(label,detail);
   row.append(symbol,words);list.append(row);
  }
  const passed=checks.filter(check=>check.status==='pass').length;
  summary.textContent=passed+' of '+checks.length+' advisory checks pass · '+(checks.length-passed)+' to review';
 }
 function close(){
  if(modal.hidden)return;
  modal.hidden=true;priorFocus?.focus({preventScroll:true});priorFocus=null;
 }
 function show(){
  priorFocus=document.activeElement;
  const systemPanel=document.getElementById('system-menu-panel');
  const systemTrigger=document.getElementById('system-menu-trigger');
  if(systemPanel)systemPanel.hidden=true;
  systemTrigger?.setAttribute('aria-expanded','false');
  audit();modal.hidden=false;closeButton.focus({preventScroll:true});
 }
 openButton.addEventListener('click',show);
 closeButton.addEventListener('click',close);
 rerun.addEventListener('click',audit);
 save.addEventListener('click',()=>{
  if(!lastReport)return;
  const url=URL.createObjectURL(new Blob([JSON.stringify(lastReport,null,2)+'\n'],{type:'application/json'}));
  const link=document.createElement('a');link.href=url;link.download='webstudio-demo-readiness.json';
  document.body.append(link);link.click();link.remove();
  setTimeout(()=>URL.revokeObjectURL(url),1000);
 });
 modal.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key!=='Tab')return;
  const available=[...modal.querySelectorAll('button:not(:disabled)')];
  if(!available.length)return;
  if(event.shiftKey&&document.activeElement===available[0]){event.preventDefault();available.at(-1).focus();}
  else if(!event.shiftKey&&document.activeElement===available.at(-1)){event.preventDefault();available[0].focus();}
 });
})();
