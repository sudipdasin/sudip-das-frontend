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
  quickButton.title='Quick actions';
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


 // Professional Introduction v4.2 — hover-only compact preview with no
 // obstructing text while playing; expand icon opens the inline full player.
 const heroActions=document.querySelector('.hero .actions');
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
 if(heroActions){
  const tile=document.createElement('div');
  tile.className='pv-intro-tile';
  tile.dataset.state='collapsed';
  // The preview is a visual tile: only the explicit expand icon opens film.
  // A real button is never nested inside another button.
  const button=document.createElement('div');
  button.id='pv-intro-launch';
  button.className='button pv-intro-launch pv-intro-hero-cta';
  button.setAttribute('role','group');
  button.setAttribute('aria-label','Muted Professional Introduction video preview');
  button.innerHTML='<span class="pv-intro-launch-copy"><strong>Professional Introduction</strong><small>Muted preview · 60-second film</small></span>';
  const expand=document.createElement('button');
  expand.type='button';
  expand.id='pv-intro-expand';
  expand.className='pv-intro-expand';
  expand.setAttribute('aria-label','Expand Professional Introduction full video here');
  expand.setAttribute('aria-controls','pv-intro-inline-player');
  expand.setAttribute('aria-expanded','false');
  expand.title='Expand 60-second professional introduction';
  expand.textContent='⛶';
  button.append(expand);
  const teaser=document.createElement('video');
  teaser.className='pv-intro-cta-motion';
  teaser.muted=true;teaser.loop=true;teaser.playsInline=true;
  teaser.preload='none';teaser.poster='media/sudip-das-intro-poster.svg';
  teaser.setAttribute('aria-hidden','true');
  teaser.tabIndex=-1;
  button.prepend(teaser);
  const panel=document.createElement('section');
  panel.id='pv-intro-inline-player';
  panel.className='pv-intro-inline-player';
  panel.setAttribute('aria-label','Professional Introduction video player');
  panel.hidden=true;
  const header=document.createElement('div');
  header.className='pv-intro-inline-header';
  const heading=document.createElement('div');
  heading.className='pv-intro-inline-heading';
  heading.innerHTML='<span>PROFESSIONAL INTRODUCTION</span><strong>Meet Sudip Das</strong>';
  const closeButton=document.createElement('button');
  closeButton.type='button';
  closeButton.className='pv-intro-inline-close';
  closeButton.textContent='✕ Close video';
  closeButton.setAttribute('aria-label','Close Professional Introduction video');
  header.append(heading,closeButton);
  const mediaBox=document.createElement('div');
  mediaBox.className='pv-intro-inline-media';
  const status=document.createElement('p');
  status.className='pv-intro-inline-status';
  status.setAttribute('role','status');
  status.textContent='Opening your professional introduction…';
  mediaBox.append(status);
  const foot=document.createElement('p');
  foot.className='pv-intro-inline-foot';
  foot.textContent='60 sec · 720p · English captions enabled by default · transcript below.';
  const transcript=document.createElement('details');
  transcript.className='pv-intro-transcript';
  const transcriptSummary=document.createElement('summary');
  transcriptSummary.textContent='Read the introduction transcript';
  const transcriptText=document.createElement('pre');
  transcriptText.textContent='Open this section to load the caption transcript.';
  const transcriptLink=document.createElement('a');
  transcriptLink.href='media/sudip-das-professional-introduction.en.vtt';
  transcriptLink.textContent='Open the original caption file';
  transcript.append(transcriptSummary,transcriptText,transcriptLink);
  let transcriptLoaded=false;
  transcript.addEventListener('toggle',async()=>{
    if(!transcript.open||transcriptLoaded)return;
    transcriptLoaded=true;
    try{
      const r=await fetch('media/sudip-das-professional-introduction.en.vtt',{cache:'force-cache'});
      if(!r.ok)throw new Error('No captions');
      const raw=(await r.text()).replace(/\r/g,'');
      const cues=raw.trim().split(/\n\n+/).slice(1).map(block=>
        block.split('\n').filter(line=>line.trim()&&!line.includes('-->')&&!/^\d+$/.test(line.trim())).join(' ')
      ).filter(Boolean);
      if(!raw.startsWith('WEBVTT')||cues.length<2)throw new Error('Invalid captions');
      transcriptText.textContent=cues.join('\n\n');
    }catch{transcriptText.textContent='Transcript unavailable; use the original caption file below.';}
  });
  panel.append(header,mediaBox,foot,transcript);
  tile.append(button,panel);
  heroActions.append(tile);

  // v4.2: the silent clip is deliberately HOVER-ONLY, never on scroll,
  // idle, page entry, or keyboard focus. The full film needs the expand icon.
  const hoverSource='media/sudip-das-intro-hover-preview.webm';
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverAllowed=window.matchMedia('(hover:hover) and (pointer:fine)');
  const saveData=Boolean(navigator.connection?.saveData);
  const videoId=parseVideoId(document.querySelector('meta[name="portfolio-intro-youtube-url"]')?.content?.trim()||'');
  const localIntro=document.querySelector('meta[name="portfolio-intro-mp4"]')?.content?.trim()||'';
  const localPoster=document.querySelector('meta[name="portfolio-intro-poster"]')?.content?.trim()||'';
  const safeIntro=/^media\/[a-z0-9-]+\.mp4$/.test(localIntro)?localIntro:null;
  const safePoster=/^media\/[a-z0-9-]+\.svg$/.test(localPoster)?localPoster:null;
  let open=false,previewVisible=false,hoverPlaying=false,isHovered=false;
  tile.dataset.previewing='false';
  const stopTeaser=()=>{
   tile.dataset.previewing='false';
   teaser.dataset.ready='false';
   if(!hoverPlaying&&!teaser.hasAttribute('src'))return;
   hoverPlaying=false;
   teaser.pause();
   teaser.removeAttribute('src');
   teaser.load();
  };
  const startTeaser=()=>{
   if(open||hoverPlaying||!isHovered||!hoverAllowed.matches||!previewVisible||document.hidden||reduced.matches||saveData)return;
   hoverPlaying=true;
   teaser.dataset.ready='false';
   teaser.src=hoverSource;
   teaser.play().catch(()=>{if(hoverPlaying)stopTeaser();});
  };
  teaser.addEventListener('playing',()=>{
   if(!open&&isHovered&&previewVisible&&hoverAllowed.matches){
    teaser.dataset.ready='true';
    tile.dataset.previewing='true';
   }else stopTeaser();
  });
  teaser.addEventListener('error',stopTeaser);
  tile.addEventListener('pointerenter',e=>{
   if(e.pointerType==='mouse'||e.pointerType==='pen'){
    isHovered=true;
    startTeaser();
   }
  });
  tile.addEventListener('pointerleave',()=>{
   isHovered=false;
   stopTeaser();
  });
  if('IntersectionObserver' in window){
   const observer=new IntersectionObserver(entries=>{
    previewVisible=entries.some(entry=>entry.isIntersecting&&entry.intersectionRatio>=.3);
    if(!previewVisible)stopTeaser();
    else if(isHovered)startTeaser();
   },{threshold:[0,.3,.6]});
   observer.observe(tile);
  }else{previewVisible=true;}
  reduced.addEventListener?.('change',()=>{if(reduced.matches)stopTeaser();else if(isHovered)startTeaser();});
  hoverAllowed.addEventListener?.('change',()=>{if(!hoverAllowed.matches)stopTeaser();else if(isHovered)startTeaser();});
  const clearMedia=()=>{
   for(const video of mediaBox.querySelectorAll('video')){
    video.pause();
    video.removeAttribute('src');
    video.load();
    video.remove();
   }
   for(const frame of mediaBox.querySelectorAll('iframe'))frame.remove();
  };
  const dismiss=()=>{
   if(!open)return;
   open=false;
   clearMedia();
   panel.hidden=true;
   tile.dataset.state='collapsed';
   button.hidden=false;
   expand.setAttribute('aria-expanded','false');
   status.hidden=false;
   expand.focus({preventScroll:true});
   startTeaser();
  };
  const launch=()=>{
   if(open)return;
   stopTeaser();
   open=true;
   tile.dataset.state='open';
   expand.setAttribute('aria-expanded','true');
   button.hidden=true;
   panel.hidden=false;
   status.hidden=false;
   status.textContent='Opening your professional introduction…';
   closeButton.focus({preventScroll:true});
   if(safeIntro){
    const video=document.createElement('video');
    video.className='pv-intro-inline-video';
    video.id='pv-intro-native';
    video.setAttribute('aria-label','Sudip Das — Professional Introduction');
    video.controls=true;
    video.playsInline=true;
    video.muted=true;
    video.autoplay=true;
    video.preload='metadata';
    if(safePoster)video.poster=safePoster;
    const captions=document.createElement('track');
    captions.kind='captions';
    captions.label='English captions';
    captions.srclang='en';
    captions.src='media/sudip-das-professional-introduction.en.vtt';
    captions.default=true;
    video.append(captions);
    video.addEventListener('loadedmetadata',()=>{
     if(!open)return;
     try{if(video.textTracks.length)video.textTracks[0].mode='showing';}catch{}
     status.hidden=true;
     video.play().catch(()=>{});
    },{once:true});
    video.addEventListener('error',()=>{
     if(!open)return;
     clearMedia();
     status.hidden=false;
     status.textContent='The video could not load on this preview. Please try again later.';
    },{once:true});
    mediaBox.prepend(video);
    video.src=safeIntro;
    video.load();
   }else if(videoId){
    const frame=document.createElement('iframe');
    frame.className='pv-intro-inline-video';
    frame.id='pv-intro-frame';
    frame.title='Sudip Das — Professional Introduction';
    frame.loading='eager';
    frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.allow='autoplay; encrypted-media; picture-in-picture';
    frame.allowFullscreen=true;
    frame.src='https://www.youtube-nocookie.com/embed/'+videoId+'?autoplay=1&mute=1&playsinline=1&controls=1&rel=0';
    mediaBox.prepend(frame);
    status.hidden=true;
   }else{
    status.textContent='Professional Introduction video is not configured.';
   }
  };
  expand.addEventListener('click',launch);
  closeButton.addEventListener('click',dismiss);
  document.addEventListener('keydown',e=>{
   if(!open||e.key!=='Escape'||document.fullscreenElement)return;
   e.preventDefault();
   dismiss();
  });
  document.addEventListener('visibilitychange',()=>{
   if(document.hidden){
    stopTeaser();
    if(open)mediaBox.querySelector('video')?.pause();
   }else if(!open){startTeaser();}
  });
  window.addEventListener('pagehide',()=>{stopTeaser();clearMedia();});
 }

})();
