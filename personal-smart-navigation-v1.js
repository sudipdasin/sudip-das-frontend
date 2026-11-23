/* Portfolio preview v1.9 — read-only floating guide + owner-video viewer.
 * Smart means rule-based section navigation, not surveillance or AI profiling.
 * No requests, analytics, storage, privileged UI, or global site mutations.
 */
(()=>{
 'use strict';
 const byId=id=>document.getElementById(id);
 const quick=byId('ws-visitor-quick-open')?.closest('.ws-visitor-quick');
 const quickButton=byId('ws-visitor-quick-open');
 const quickPanel=byId('ws-visitor-quick-panel');
 if(quick&&quickButton&&quickPanel){
  // The earlier presentation injected this in the header, where it caused
  // wrapping and crowding. Move only this visitor-only launcher to body.
  document.body.append(quick);
  quick.classList.add('pv-smart-float');
  const icon=document.createElement('span');
  icon.className='pv-smart-icon';
  icon.setAttribute('aria-hidden','true');
  icon.textContent='✦';
  const copy=document.createElement('span');
  copy.className='pv-smart-label';
  copy.textContent='Quick actions';
  const subtitle=document.createElement('span');
  subtitle.className='pv-smart-hint';
  subtitle.textContent='Explore what matters';
  const labels=document.createElement('span');
  labels.className='pv-smart-copy';
  labels.append(copy,subtitle);
  quickButton.replaceChildren(icon,labels);
  quickButton.setAttribute('aria-label','Quick actions — suggested next steps');
  const recommendation=document.createElement('div');
  recommendation.className='pv-smart-recommendation';
  recommendation.setAttribute('aria-label','Suggested next step based on the section in view');
  const caption=document.createElement('span');
  caption.className='pv-smart-overline';
  caption.textContent='SUGGESTED NEXT';
  const link=document.createElement('a');
  link.className='pv-smart-recommend-link';
  const description=document.createElement('p');
  description.className='pv-smart-rationale';
  recommendation.append(caption,link,description);
  quickPanel.insertBefore(recommendation,quickPanel.querySelector('.ws-visitor-quick-links'));
  const flow={
   top:['projects','Explore selected work','Discover practical software projects'],
   about:['projects','Browse the projects','See the ideas being built'],
   projects:['capabilities','Explore strengths','See what makes these projects possible'],
   experience:['capabilities','See how I contribute','Connect experience with capability'],
   capabilities:['contact','Get in touch','Continue the conversation'],
   contact:['top','Back to introduction','Return to the top of the portfolio']
  };
  const ids=Object.keys(flow);
  const getCurrent=()=>{
   const terminal=document.body.dataset.theme==='terminal';
   if(terminal)return document.body.dataset.terminalSection||'about';
   let active='top';
   const point=window.innerHeight*.4;
   for(const id of ids){
    const el=byId(id);
    if(!el)continue;
    const box=el.getBoundingClientRect();
    if(box.top<=point&&box.bottom>0)active=id;
   }
   return active;
  };
  let last='';
  const update=()=>{
   const current=getCurrent(),target=flow[current]||flow.top;
   if(last===current)return;
   last=current;
   const [id,label,why]=target;
   link.href='#'+id;
   link.textContent=label+' →';
   description.textContent=why;
   subtitle.textContent=label;
   quickButton.setAttribute('aria-label','Quick actions. Suggested: '+label);
  };
  let pending=false;
  const schedule=()=>{
   if(pending)return;
   pending=true;
   requestAnimationFrame(()=>{pending=false;update();});
  };
  window.addEventListener('scroll',schedule,{passive:true});
  window.addEventListener('resize',schedule,{passive:true});
  document.addEventListener('click',event=>{
   if(event.target.closest('.pv-smart-recommend-link')){
    quickPanel.hidden=true;
    quickButton.setAttribute('aria-expanded','false');
   }
   if(event.target.closest('[data-flow]'))schedule();
  });
  byId('theme-select')?.addEventListener('change',schedule);
  document.addEventListener('profile-language-change',schedule);
  window.addEventListener('hashchange',schedule);
  // Rebuild locale-specific theme button labels when translation changes.
  document.addEventListener('profile-language-change',()=>{
   const options=[...byId('theme-select').options];
   quickPanel.querySelectorAll('.ws-visitor-quick-themes button').forEach((button,i)=>{
    if(options[i])button.textContent=options[i].textContent.trim();
   });
  });
  update();
 }

 // Video is configured by a reviewed owner-controlled meta tag. A channel
 // URL, unknown host, arbitrary script URL or invalid video ID never embeds.
 const modal=byId('pv-intro-modal');
 const screen=byId('pv-intro-screen');
 const empty=byId('pv-intro-empty');
 const close=byId('pv-intro-close');
 const banner=document.querySelector('.ws-utility');
 function parseVideoId(raw){
  if(!raw)return null;
  let url;
  try{url=new URL(raw);}catch{return null;}
  if(url.protocol!=='https:')return null;
  const host=url.hostname.toLowerCase();
  let id='';
  if(host==='youtu.be')id=url.pathname.split('/')[1]||'';
  else if(['youtube.com','www.youtube.com','m.youtube.com','www.youtube-nocookie.com'].includes(host)){
   const segments=url.pathname.split('/').filter(Boolean);
   if(segments[0]==='watch')id=url.searchParams.get('v')||'';
   else if(['embed','shorts','live'].includes(segments[0]))id=segments[1]||'';
  }else return null;
  return /^[a-zA-Z0-9_-]{11}$/.test(id)?id:null;
 }
 if(modal&&screen&&empty&&close&&banner){
  const button=document.createElement('button');
  button.type='button';
  button.id='pv-intro-launch';
  button.className='pv-intro-launch';
  button.innerHTML='<span aria-hidden="true">▶</span> Intro video';
  button.setAttribute('aria-haspopup','dialog');
  button.setAttribute('aria-controls','pv-intro-modal');
  button.setAttribute('aria-expanded','false');
  banner.insertBefore(button,banner.querySelector('.ws-utility-right'));
  const videoId=parseVideoId(document.querySelector('meta[name="portfolio-intro-youtube-url"]')?.content?.trim()||'');
  const footnote=byId('pv-intro-footnote');
  const initialFocus=()=>close.focus({preventScroll:true});
  let previousFocus=null;
  const open=()=>{
   if(!modal.hidden)return;
   previousFocus=document.activeElement;
   modal.hidden=false;
   modal.inert=false;
   document.body.classList.add('pv-intro-open');
   button.setAttribute('aria-expanded','true');
   if(videoId){
    empty.hidden=true;
    const iframe=document.createElement('iframe');
    iframe.className='pv-intro-frame';
    iframe.id='pv-intro-frame';
    iframe.title='Sudip Das — video introduction';
    iframe.loading='eager';
    iframe.referrerPolicy='strict-origin-when-cross-origin';
    iframe.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
    iframe.allowFullscreen=true;
    iframe.src='https://www.youtube-nocookie.com/embed/'+videoId+
      '?autoplay=1&mute=1&playsinline=1&controls=1&rel=0';
    screen.append(iframe);
    footnote.textContent='Autoplay starts muted where supported; unmute using the YouTube controls.';
   }else{
    empty.hidden=false;
    footnote.textContent='An approved individual YouTube video is required before playback can start.';
   }
   initialFocus();
  };
  const dismiss=()=>{
   if(modal.hidden)return;
   // Detach iframe entirely to stop sound and network playback immediately.
   byId('pv-intro-frame')?.remove();
   modal.hidden=true;
   modal.inert=true;
   document.body.classList.remove('pv-intro-open');
   button.setAttribute('aria-expanded','false');
   if(previousFocus?.isConnected)previousFocus.focus({preventScroll:true});
   else button.focus({preventScroll:true});
  };
  button.addEventListener('click',open);
  close.addEventListener('click',dismiss);
  modal.querySelector('[data-intro-close]')?.addEventListener('click',dismiss);
  document.addEventListener('keydown',event=>{
   if(modal.hidden)return;
   if(event.key==='Escape'){event.preventDefault();dismiss();return;}
   if(event.key==='Tab'){
    const focusables=[...modal.querySelectorAll('button,[href],iframe,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden);
    const first=focusables[0],last=focusables.at(-1);
    if(!first)return;
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
   }
  });
 }
})();
