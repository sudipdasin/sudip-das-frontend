/* Opt-in accessible guided product tour; no telemetry, no auto-open and no purchases. */
(()=>{
 'use strict';
 const $=id=>document.getElementById(id);
 const modal=$('demo-tour'),title=$('tour-title'),description=$('tour-description'),
   progress=$('tour-progress'),back=$('tour-back'),next=$('tour-next'),tryButton=$('tour-try'),exit=$('tour-exit');
 const steps=[
  {title:'Meet your next website.',description:'This is a fictional developer portfolio. The studio behind it makes each profile independent and editable.',action:'See the portfolio',target:'top'},
  {title:'Three layouts, one profile.',description:'Orbit, Editorial and Terminal each have their own typography and composition. Your portrait and details remain visible when you switch.',action:'Try Editorial layout',target:'theme'},
  {title:'Make every detail yours.',description:'Change name, role, color, skills, SEO, projects and links. Save locally and export the profile without an account.',action:'Open the editor',target:'editor'},
  {title:'Projects tell your story.',description:'Filter the sample projects, read their case studies, and edit descriptions. No programming required.',action:'Explore projects',target:'projects-section'},
  {title:'See the product roadmap.',description:'Explore the free demo today. Customer hosting and paid plans are not live yet; checkout is deliberately disabled.',action:'View plans',target:'studio-plans'}
 ];
 let step=0,previousFocus=null;
 function render(){
  const current=steps[step];title.textContent=current.title;description.textContent=current.description;
  progress.replaceChildren(...steps.map((_,index)=>{const item=document.createElement('span');item.className=index<=step?'active':'';return item;}));
  back.disabled=step===0;next.textContent=step===steps.length-1?'Finish tour':'Next';tryButton.textContent=current.action;
  $('tour-eyebrow').textContent='PRODUCT TOUR · '+(step+1)+' OF '+steps.length;
 }
 function open(){if(!modal.hidden)return;previousFocus=document.activeElement;step=0;render();modal.hidden=false;document.body.classList.add('tour-open');next.focus();}
 function close(){modal.hidden=true;document.body.classList.remove('tour-open');if(previousFocus?.isConnected)previousFocus.focus();}
 function jump(){
  const target=steps[step].target;close();
  if(target==='theme'){$('studio-theme').value='editorial';$('studio-theme').dispatchEvent(new Event('change',{bubbles:true}));$('studio-theme').focus();return;}
  if(target==='editor'){if(!$('editor').classList.contains('open'))$('edit-toggle').click();$('editor').scrollIntoView({behavior:'auto',block:'start'});return;}
  if(document.body.dataset.theme==='terminal'){$('studio-theme').value='orbit';$('studio-theme').dispatchEvent(new Event('change',{bubbles:true}));}
  $(target)?.scrollIntoView({behavior:'smooth',block:'start'});
 }
 $('tour-start').addEventListener('click',open);
 $('try-customize').addEventListener('click',()=>{
  if(document.body.dataset.theme==='terminal'){$('studio-theme').value='orbit';$('studio-theme').dispatchEvent(new Event('change',{bubbles:true}));}
  if(!$('editor').classList.contains('open'))$('edit-toggle').click();
  $('editor').scrollIntoView({behavior:'smooth'});
 });
 $('explore-plans').addEventListener('click',()=>$('studio-plans').scrollIntoView({behavior:'smooth'}));
 $('plans-try').addEventListener('click',()=>{open();});
 exit.addEventListener('click',close);back.addEventListener('click',()=>{if(step>0){step--;render();}});
 next.addEventListener('click',()=>{if(step===steps.length-1){close();return;}step++;render();});
 tryButton.addEventListener('click',jump);
 modal.addEventListener('click',event=>{if(event.target===modal)close();});
 document.addEventListener('keydown',event=>{
  if(modal.hidden)return;
  if(event.key==='Escape'){event.preventDefault();close();return;}
  if(event.key!=='Tab')return;
  const items=[exit,back,next,tryButton].filter(el=>!el.disabled);
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
})();
