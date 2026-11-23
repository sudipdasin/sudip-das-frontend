/* WebStudio interest UI: single visible email field, no profile editing,
 * storage, tracking, or automatic delivery claim without a verified backend.
 * During preview, visitors may compose an email in their own mail application.
 * Future opt-in Cloudflare Pages Function is guarded by explicit meta config
 * and Turnstile; it will not quietly submit to an unverified service.
 */
(()=>{
 'use strict';
 const open=document.getElementById('ws-interest-toggle');
 const expander=document.getElementById('ws-interest-expander');
 const form=document.getElementById('ws-interest-form');
 const input=document.getElementById('ws-interest-email');
 const submit=document.getElementById('ws-interest-submit');
 const status=document.getElementById('ws-interest-status');
 if(!open||!expander||!form||!input||!submit||!status)return;
 const originalSubmitLabel=submit.innerHTML;
 const configuration=document.querySelector('meta[name="webstudio-interest-backend"]');
 // The static personal preview deliberately uses the mail-client fallback.
 // Server opt-in requires a reviewed commit AND configured Cloudflare secrets.
 const serverEnabled=configuration?.content==='enabled';
 const sitekey=document.querySelector('meta[name="webstudio-interest-turnstile-sitekey"]')?.content?.trim()||'';
 const help=document.getElementById('ws-interest-explain');
 if(serverEnabled&&sitekey){
  submit.innerHTML='Send interest <span aria-hidden="true">↗</span>';
  if(help)help.textContent='Only your email will be sent securely to request a WebStudio follow-up. No account or additional personal details required.';
 }
 function setOpen(next){
  expander.dataset.open=String(next);
  expander.setAttribute('aria-hidden',String(!next));
  open.setAttribute('aria-expanded',String(next));
  const sign=open.querySelector('span');
  if(sign)sign.textContent=next?'−':'+';
  if(next)input.focus();
  else open.focus();
 }
 open.addEventListener('click',()=>setOpen(expander.dataset.open!=='true'));
 expander.addEventListener('keydown',event=>{
  if(event.key==='Escape'){event.preventDefault();setOpen(false);}
 });
 // Read-only inline presentation. No site mutation, storage or network calls.
 const jump=document.getElementById('ws-demo-jump');
 const showcase=document.getElementById('ws-inline-demo');
 const closeDemo=document.getElementById('ws-demo-close');
 const jumpLabel=jump?.querySelector('.ws-demo-jump-label');
 const jumpIcon=jump?.querySelector('.ws-demo-jump-icon');
 const tabs=[...document.querySelectorAll('[data-demo-tab]')];
 const panels=[...document.querySelectorAll('[data-demo-panel]')];
 const counter=document.getElementById('ws-demo-count');
 const description=document.getElementById('ws-demo-description');
 const previous=document.getElementById('ws-demo-previous');
 const next=document.getElementById('ws-demo-next');
 const descriptions=[
  'Bring structure, typography, imagery, and a consistent visual identity together in one considered presentation.',
  'Explore contrasting visual directions — from warm editorial to atmospheric and bold — without changing your story.',
  'Consider a guided journey: choose a design direction, organise approved public content, then review desktop and mobile previews.'
 ];
 if(jump&&jumpLabel&&jumpIcon&&showcase&&closeDemo&&tabs.length===3&&panels.length===3&&counter&&description&&previous&&next){
  let active=0;
  const motion=window.matchMedia('(prefers-reduced-motion: reduce)');
  const setDemoOpen=(value)=>{
   const expanded=Boolean(value);
   if(showcase.dataset.open===String(expanded))return;
   // Return focus *before* making an open control inert or aria-hidden.
   if(!expanded)jump.focus({preventScroll:true});
   showcase.dataset.open=String(expanded);
   showcase.setAttribute('aria-hidden',String(!expanded));
   showcase.inert=!expanded;
   jump.setAttribute('aria-expanded',String(expanded));
   jumpLabel.textContent=expanded?'Collapse the demo':'Explore the inline demo';
   jumpIcon.textContent=expanded?'×':'↗';
   if(expanded)window.requestAnimationFrame(()=>{
    if(showcase.dataset.open==='true')closeDemo.focus({preventScroll:true});
   });
   (expanded?showcase:jump).scrollIntoView({
    behavior:motion.matches?'auto':'smooth',
    block:'nearest'
   });
  };
  const show=(index,focusTab=false)=>{
   active=(index+tabs.length)%tabs.length;
   tabs.forEach((tab,i)=>{
    const selected=i===active;
    tab.setAttribute('aria-selected',String(selected));
    tab.tabIndex=selected?0:-1;
   });
   panels.forEach((panel,i)=>{
    panel.hidden=i!==active;
   });
   counter.textContent=String(active+1).padStart(2,'0')+' / '+String(tabs.length).padStart(2,'0');
   description.textContent=descriptions[active];
   if(focusTab)tabs[active].focus();
  };
  tabs.forEach((tab,i)=>{
   tab.addEventListener('click',()=>show(i));
   tab.addEventListener('keydown',event=>{
    const keys={ArrowRight:i+1,ArrowLeft:i-1,Home:0,End:tabs.length-1};
    if(Object.hasOwn(keys,event.key)){
     event.preventDefault();
     show(keys[event.key],true);
    }
   });
  });
  previous.addEventListener('click',()=>show(active-1));
  next.addEventListener('click',()=>show(active+1));
  jump.addEventListener('click',()=>setDemoOpen(showcase.dataset.open!=='true'));
  closeDemo.addEventListener('click',()=>setDemoOpen(false));
  showcase.addEventListener('keydown',event=>{
   if(event.key==='Escape'&&showcase.dataset.open==='true'){
    event.preventDefault();
    event.stopPropagation();
    setDemoOpen(false);
   }
  });
  // Explicit, focus-safe collapsed state on first load.
  showcase.inert=true;
  showcase.setAttribute('aria-hidden','true');
  jump.setAttribute('aria-expanded','false');
  show(0);
 }
 const emailText=email=>[
  'Hello,',
  '',
  'I am interested in WebStudio and would like to learn more.',
  'Please contact me at: '+email,
  '',
  'I found WebStudio through your professional portfolio.',
  '',
  'Regards'
 ].join('\n');
 const mailtoLink=email=>'mailto:sudipdasin@gmail.com?subject='+
  encodeURIComponent('Interested in WebStudio')+
  '&body='+encodeURIComponent(emailText(email));
 const setStatus=(msg,kind='info')=>{
  status.textContent=msg;status.dataset.state=kind;
 };
 async function getChallengeToken(){
  if(!sitekey||!window.turnstile?.render||!window.turnstile?.execute)
   throw Error('Verification is unavailable on this preview.');
  const container=document.createElement('div');
  container.className='ws-interest-challenge';
  container.setAttribute('aria-hidden','true');
  form.append(container);
  try{
   return await new Promise((resolve,reject)=>{
    const timer=setTimeout(()=>reject(Error('Verification expired. Try again.')),30000);
    let widget;
    try{
     widget=window.turnstile.render(container,{
      sitekey,action:'webstudio-interest',size:'invisible',execution:'execute',
      callback:token=>{clearTimeout(timer);resolve(token);},
      'error-callback':()=>{clearTimeout(timer);reject(Error('Verification failed.'));},
      'expired-callback':()=>{clearTimeout(timer);reject(Error('Verification expired.'))}
     });
     window.turnstile.execute(widget);
    }catch(e){clearTimeout(timer);reject(e);}
   });
  }finally{container.remove();}
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  const email=input.value.trim().toLowerCase();
  input.value=email;
  if(!input.checkValidity()||!email||email.length>254){
   setStatus('Enter a valid email address to continue.','error');
   input.focus();input.reportValidity();return;
  }
  if(form.elements.namedItem('website')?.value){
   setStatus('Your request could not be processed.','error');return;
  }
  if(!serverEnabled){
   setStatus('Opening your email application. The message is not sent until you choose Send there.','info');
   window.location.href=mailtoLink(email);
   return;
  }
  submit.disabled=true;
  submit.textContent='Verifying…';
  setStatus('Verifying your request…');
  try{
   const token=await getChallengeToken();
   const response=await fetch('/api/webstudio-interest',{
    method:'POST',
    headers:{'content-type':'application/json'},
    credentials:'same-origin',
    cache:'no-store',
    body:JSON.stringify({email,website:'',turnstileToken:token})
   });
   const data=await response.json().catch(()=>({}));
   if(response.ok&&data.ok===true){
    setStatus('Your interest has been emailed to the WebStudio owner. Thank you!','success');
    form.reset();
   }else{
    throw Error(data.error==='rate_limited'?
     'Too many requests. Please try later.':
     'Automatic email delivery is not available. You can still use your email application.');
   }
  }catch(error){
   setStatus(error.message||'Could not send your interest automatically.','error');
   const existing=document.getElementById('ws-interest-mail-fallback');
   if(!existing){
    const link=document.createElement('a');
    link.id='ws-interest-mail-fallback';link.href=mailtoLink(email);
    link.textContent='Open your email app instead ↗';
    link.rel='nofollow';link.className='ws-interest-fallback';
    status.after(link);
   }else existing.href=mailtoLink(email);
  }finally{
   submit.disabled=false;
   submit.innerHTML=serverEnabled&&sitekey?
    'Send interest <span aria-hidden="true">↗</span>':originalSubmitLabel;
  }
 });
})();
