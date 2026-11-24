/* GitHub hero explorer v3.24: public, lazy, accessible, no account credentials.
 * Enhance the existing direct GitHub anchor; without JS it remains a working link.
 * No tracking, profile mutations, private endpoints, or fake repository metrics.
 */
(() => {
  'use strict';
  if (window.__wsGithubHero324) return;
  const original = document.querySelector('.hero .actions a[href="https://github.com/sudipdasin"]');
  if (!original) return;
  const OWNER='sudipdasin';
  const PROFILE='https://github.com/'+OWNER;
  const API='https://api.github.com/users/'+OWNER;
  const CACHE_KEY='webstudio-github-public-preview-v324';
  const TTL=10*60*1000;
  const CREATE=(tag,cls,content)=>{
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(content!==undefined)node.textContent=content;
    return node;
  };
  const safeNumber=value=>Number.isSafeInteger(value)&&value>=0?value:0;
  const formatNumber=value=>safeNumber(value).toLocaleString('en-US');
  const safeName=value=>typeof value==='string'&&/^[a-z0-9._-]{1,100}$/i.test(value)?value:null;
  const repoUrl=name=>PROFILE+'/'+encodeURIComponent(name);
  const trustedRepo=(entry)=>{
    if(!entry||entry.private===true||entry.fork===true||entry.archived===true)return null;
    const name=safeName(entry.name);
    if(!name||typeof entry.owner?.login!=='string'||entry.owner.login.toLowerCase()!==OWNER)return null;
    const language=typeof entry.language==='string'?entry.language.slice(0,35):'';
    const description=typeof entry.description==='string'?entry.description.trim().slice(0,190):'';
    const pushed=typeof entry.pushed_at==='string'&&Number.isFinite(Date.parse(entry.pushed_at))
      ?entry.pushed_at:'';
    return {name,description,language,stars:safeNumber(entry.stargazers_count),pushed};
  };
  const fromPortfolio=()=>{
    const items=[...document.querySelectorAll('#projects .project')];
    return items.map(card=>{
      const url=card.querySelector('a.project-link[href^="https://github.com/"]')?.href;
      if(!url)return null;
      let parsed;
      try{parsed=new URL(url)}catch{return null}
      if(parsed.hostname!=='github.com')return null;
      const names=parsed.pathname.split('/').filter(Boolean);
      if(names.length!==2||names[0].toLowerCase()!==OWNER||!safeName(names[1]))return null;
      return {name:names[1],description:card.querySelector('p')?.textContent?.trim().slice(0,190)||'',
        language:'',stars:null,pushed:'',local:true};
    }).filter(Boolean).slice(0,4);
  };
  const shell=CREATE('div','gh-hero-shell');
  shell.id='gh-hero-explorer';
  const trigger=CREATE('button','button gh-hero-trigger');
  trigger.type='button';
  trigger.id='gh-hero-trigger';
  trigger.setAttribute('aria-controls','gh-hero-panel');
  trigger.setAttribute('aria-expanded','false');
  trigger.setAttribute('aria-label','Preview public GitHub repositories');
  const icon=CREATE('span','gh-hero-icon');
  icon.setAttribute('aria-hidden','true');
  icon.textContent='⌘';
  const words=CREATE('span','gh-hero-words');
  words.append(CREATE('strong','','GitHub'),CREATE('small','gh-hero-brief','Explore public work'));
  const chevron=CREATE('span','gh-hero-chevron','↗');
  chevron.setAttribute('aria-hidden','true');
  trigger.append(icon,words,chevron);
  const panel=CREATE('section','gh-hero-panel');
  panel.id='gh-hero-panel';
  panel.hidden=true;
  panel.setAttribute('role','region');
  panel.setAttribute('aria-labelledby',trigger.id);
  const header=CREATE('div','gh-hero-panel-head');
  const heading=CREATE('div','gh-hero-panel-heading');
  heading.append(CREATE('span','gh-kicker','PUBLIC DEVELOPMENT'),CREATE('h3','','Code, progress & projects'));
  const profileLink=CREATE('a','gh-profile-link','GitHub ↗');
  profileLink.href=PROFILE;
  profileLink.target='_blank';
  profileLink.rel='noopener noreferrer';
  profileLink.setAttribute('aria-label','Open public GitHub profile in a new tab');
  header.append(heading,profileLink);
  const description=CREATE('p','gh-hero-description','Explore repository descriptions, languages and development activity.');
  const stats=CREATE('dl','gh-hero-stats');
  const statNodes={};
  for(const [key,label] of [['repos','Public repos'],['stars','Stars (listed)'],['language','Top language']]){
    const stat=CREATE('div','gh-hero-stat');
    const value=CREATE('dd','gh-hero-stat-value','—');
    statNodes[key]=value;
    stat.append(CREATE('dt','',label),value);
    stats.append(stat);
  }
  const headingRow=CREATE('div','gh-repos-heading');
  const repoHeading=CREATE('h4','','Featured & recently active');
  const refresh=CREATE('button','gh-refresh','Refresh ↻');
  refresh.type='button';
  refresh.setAttribute('aria-label','Refresh public repository data');
  headingRow.append(repoHeading,refresh);
  const list=CREATE('ul','gh-hero-repos');
  const status=CREATE('p','gh-hero-status','Open this preview to check public GitHub activity.');
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  const footer=CREATE('div','gh-hero-panel-footer');
  footer.append(CREATE('span','','Public repositories only · no sign-in required'));
  const browse=CREATE('a','gh-browse','Browse all ↗');
  browse.href=PROFILE+'?tab=repositories';
  browse.target='_blank';
  browse.rel='noopener noreferrer';
  footer.append(browse);
  panel.append(header,description,stats,headingRow,list,status,footer);
  shell.append(trigger,panel);
  original.replaceWith(shell);
  const hover=window.matchMedia?.('(hover: hover) and (pointer: fine)');
  let open=false,pinned=false,closeId=0,loading=null,loaded=null,updatedAt=0;
  const brief=words.querySelector('small');
  const dateLabel=date=>{
    if(!date)return '';
    const d=new Date(date);
    return Number.isFinite(d.getTime())?'Updated '+d.toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}):'';
  };
  function renderRepos(repos){
    list.replaceChildren();
    for(const repo of repos.slice(0,4)){
      const li=CREATE('li','gh-repo-row');
      const link=CREATE('a','gh-repo-link');
      link.href=repoUrl(repo.name);
      link.target='_blank';
      link.rel='noopener noreferrer';
      const top=CREATE('div','gh-repo-top');
      top.append(CREATE('strong','',repo.name),CREATE('span','gh-repo-arrow','↗'));
      link.append(top);
      if(repo.description)link.append(CREATE('p','gh-repo-description',repo.description));
      const meta=CREATE('span','gh-repo-meta');
      const details=[repo.language,repo.stars===null?'':'★ '+formatNumber(repo.stars),dateLabel(repo.pushed)]
        .filter(Boolean);
      meta.textContent=details.length?details.join(' · '):'Public project · Explore repository';
      link.append(meta);li.append(link);list.append(li);
    }
  }
  function renderFallback(message){
    const repos=fromPortfolio();
    statNodes.repos.textContent='—';
    statNodes.stars.textContent='—';
    statNodes.language.textContent='—';
    repoHeading.textContent='Projects on this portfolio';
    renderRepos(repos);
    status.textContent=message;
    if(!repos.length)status.textContent+=' Visit GitHub for the complete list.';
  }
  function renderPublic(payload,stale=false){
    const repos=payload.repos.filter(x=>safeName(x.name));
    const profile=payload.profile||{};
    const knownCount=safeNumber(profile.publicRepos);
    const displayedCount=knownCount||repos.length;
    statNodes.repos.textContent=displayedCount?formatNumber(displayedCount)+(repos.length===100&&!knownCount?'+':''):'—';
    const sum=repos.reduce((acc,r)=>acc+safeNumber(r.stars),0);
    statNodes.stars.textContent=repos.length?formatNumber(sum):'—';
    const counts=new Map();
    for(const r of repos)if(r.language)counts.set(r.language,(counts.get(r.language)||0)+1);
    const main=[...counts.entries()].sort((a,b)=>b[1]-a[1])[0]?.[0]||'—';
    statNodes.language.textContent=main;
    if(Number.isInteger(profile.publicRepos)&&profile.publicRepos>0)
      brief.textContent=formatNumber(profile.publicRepos)+' public repositories';
    else if(repos.length)brief.textContent=formatNumber(repos.length)+' recently listed';
    if(typeof profile.bio==='string'&&profile.bio.trim())
      description.textContent=profile.bio.slice(0,170);
    const favNames=['linwin','ivivid','tux-steward','animation-studio'];
    const popular=repos.slice().sort((a,b)=>(Date.parse(b.pushed)||0)-(Date.parse(a.pushed)||0)||b.stars-a.stars);
    const featured=favNames.map(n=>repos.find(repo=>repo.name.toLowerCase()===n)).filter(Boolean).slice(0,2);
    const selected=[...featured,...popular.filter(r=>!featured.some(f=>f.name===r.name))].slice(0,4);
    repoHeading.textContent='Featured & recently active';
    renderRepos(selected);
    status.textContent=stale?'Recently cached public GitHub data · Refresh to check again.':
      'Live public GitHub data · '+formatNumber(repos.length)+' repositories inspected.';
    if(!repos.length)renderFallback('GitHub returned no active repositories; showing portfolio projects.');
  }
  function loadCache(){
    try{
      const entry=JSON.parse(sessionStorage.getItem(CACHE_KEY)||'null');
      if(!entry||typeof entry.at!=='number'||!Array.isArray(entry.repos)||!entry.profile)return null;
      const repos=entry.repos.map(r=>trustedRepo({
        ...r,owner:{login:OWNER},stargazers_count:r.stars,pushed_at:r.pushed_at||r.pushed,
        private:false,fork:false,archived:false
      })).filter(Boolean);
      const profile={
        publicRepos:safeNumber(entry.profile.publicRepos),
        bio:typeof entry.profile.bio==='string'?entry.profile.bio.slice(0,170):''
      };
      return {at:entry.at,repos,profile};
    }catch{return null}
  }
  async function apiGet(url,signal){
    const response=await fetch(url,{
      signal,credentials:'omit',cache:'no-store',referrerPolicy:'no-referrer',
      headers:{Accept:'application/vnd.github+json'}
    });
    if(!response.ok)throw new Error('HTTP '+response.status);
    return response.json();
  }
  async function load(force=false){
    if(loading)return loading;
    const now=Date.now();
    if(!force&&loaded&&now-updatedAt<TTL){renderPublic(loaded);return;}
    if(!force){
      const cached=loadCache();
      if(cached&&cached.at<=now&&now-cached.at<TTL){
        loaded=cached;updatedAt=cached.at;renderPublic(cached,true);return;
      }
    }
    if(typeof fetch!=='function'){
      renderFallback('Live GitHub data is unavailable in this browser.');
      return;
    }
    refresh.disabled=true;
    status.textContent='Checking live public repositories…';
    const controller=typeof AbortController==='function'?new AbortController():null;
    const timeout=setTimeout(()=>controller?.abort(),6500);
    loading=(async()=>{
      try{
        const results=await Promise.allSettled([
          apiGet(API+'/repos?type=owner&sort=pushed&per_page=100',controller?.signal),
          apiGet(API,controller?.signal)
        ]);
        const repoData=results[0].status==='fulfilled'?results[0].value:null;
        const profileData=results[1].status==='fulfilled'?results[1].value:null;
        if(!Array.isArray(repoData))throw new Error('Repository feed unavailable');
        const repos=repoData.map(trustedRepo).filter(Boolean);
        const profile={
          publicRepos:safeNumber(profileData?.public_repos),
          bio:typeof profileData?.bio==='string'?profileData.bio.trim().slice(0,170):''
        };
        const payload={repos,profile};updatedAt=Date.now();loaded=payload;
        renderPublic(payload);
        try{sessionStorage.setItem(CACHE_KEY,JSON.stringify({at:updatedAt,...payload}))}catch{}
      }catch{
        if(loaded)renderPublic(loaded,true);
        else renderFallback('GitHub is temporarily unavailable or rate-limited. Showing portfolio projects.');
      }finally{
        clearTimeout(timeout);refresh.disabled=false;loading=null;
        if(open)positionPanel();
      }
    })();
    return loading;
  }
  function positionPanel(){
    if(!open)return;
    const r=trigger.getBoundingClientRect();
    const maxWidth=Math.max(200,window.innerWidth-24);
    const width=Math.min(panel.getBoundingClientRect().width||440,maxWidth);
    const targetLeft=Math.min(Math.max(r.left,12),Math.max(12,window.innerWidth-width-12));
    shell.style.setProperty('--gh-panel-shift-x',(targetLeft-r.left)+'px');
    const availableBottom=window.innerHeight-r.bottom-16;
    const availableTop=r.top-16;
    shell.classList.toggle('gh-open-up',availableBottom<Math.min(350,panel.scrollHeight)&&availableTop>availableBottom);
    const available=shell.classList.contains('gh-open-up')?availableTop:availableBottom;
    panel.style.maxHeight=Math.max(150,Math.floor(available-14))+'px';
  }
  function clearClose(){if(closeId){clearTimeout(closeId);closeId=0}}
  function reveal(pin=false){
    clearClose();
    if(pin)pinned=true;
    if(!open){
      open=true;panel.hidden=false;
      shell.dataset.open='true';
      trigger.setAttribute('aria-expanded','true');
      positionPanel();
      renderFallback('Checking public GitHub activity… showing projects from this portfolio.');
      void load();
    }
  }
  function conceal(force=false){
    if(pinned&&!force)return;
    clearClose();pinned=false;
    if(!open)return;
    open=false;panel.hidden=true;
    delete shell.dataset.open;
    shell.classList.remove('gh-open-up');
    trigger.setAttribute('aria-expanded','false');
  }
  function planClose(){
    clearClose();
    closeId=setTimeout(()=>{
      if(!shell.matches(':hover')&&!shell.contains(document.activeElement))conceal();
    },180);
  }
  if(hover?.matches){
    shell.addEventListener('pointerenter',()=>reveal());
    shell.addEventListener('pointerleave',planClose);
  }
  trigger.addEventListener('focus',()=>reveal());
  trigger.addEventListener('click',()=>{
    if(open&&pinned)conceal(true);
    else reveal(true);
  });
  trigger.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'){
      event.preventDefault();reveal(true);
      panel.querySelector('a')?.focus();
    }
  });
  shell.addEventListener('focusout',event=>{
    if(event.relatedTarget&&!shell.contains(event.relatedTarget))conceal(true);
  });
  shell.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&open){
      event.preventDefault();conceal(true);trigger.focus();
    }
  });
  document.addEventListener('pointerdown',event=>{
    if(open&&!shell.contains(event.target))conceal(true);
  });
  window.addEventListener('scroll',()=>conceal(true),{passive:true});
  window.addEventListener('resize',positionPanel,{passive:true});
  refresh.addEventListener('click',()=>{loaded=null;updatedAt=0;void load(true)});
  window.__wsGithubHero324=Object.freeze({
    getStatus:()=>Object.freeze({open,pinned,loaded:!!loaded,repoCount:loaded?.repos?.length||0}),
    refresh:()=>load(true)
  });
})();
