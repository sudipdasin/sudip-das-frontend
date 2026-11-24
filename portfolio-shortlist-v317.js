/* v3.17 recruiter-facing public project shortlist. No uploads or tracking. */
(() => {
  'use strict';
  const section=document.getElementById('projects');
  const grid=section?.querySelector('.project-grid');
  if(!grid||section.querySelector('[data-shortlist]'))return;
  const projects=[...grid.querySelectorAll('article.project')].map(card=>{
    const title=card.querySelector('h3')?.textContent?.trim();
    const desc=card.querySelector('p')?.textContent?.trim();
    const category=card.querySelector('.project-type')?.textContent?.trim();
    const link=card.querySelector('a.project-link[href^="https://github.com/"]');
    if(!title||!desc||!link)return null;
    return {card,title,desc,category,url:link.href};
  }).filter(Boolean);
  if(projects.length<2)return;
  const MAX=3;
  const selected=new Set();
  const panel=document.createElement('section');
  panel.className='project-shortlist';
  panel.dataset.shortlist='';
  panel.setAttribute('aria-label','Project selection for hiring teams and collaborators');
  const heading=document.createElement('h3');
  heading.textContent='Build a focused project shortlist';
  const intro=document.createElement('p');
  intro.textContent='Select up to three public projects to compare and copy a concise briefing. No account or tracking.';
  const status=document.createElement('p');
  status.className='project-shortlist-status';
  status.setAttribute('role','status');
  status.setAttribute('aria-live','polite');
  const summary=document.createElement('div');
  summary.className='project-shortlist-summary';
  const actions=document.createElement('div');
  actions.className='project-shortlist-actions';
  const copy=document.createElement('button');
  copy.type='button';copy.textContent='Copy selected briefing';
  const clear=document.createElement('button');
  clear.type='button';clear.textContent='Clear selection';
  actions.append(copy,clear);
  panel.append(heading,intro,status,summary,actions);
  grid.after(panel);
  const selectorByProject=new Map();
  function render(){
    const items=projects.filter(p=>selected.has(p.url));
    status.textContent=items.length+'/'+MAX+' selected — '+(items.length?'Ready to compare or share.':'Choose projects using the checkboxes on their cards.');
    copy.disabled=items.length===0;
    clear.disabled=items.length===0;
    summary.replaceChildren();
    items.forEach(p=>{
      const row=document.createElement('article');
      const title=document.createElement('strong');title.textContent=p.title;
      const desc=document.createElement('p');desc.textContent=p.desc;
      const a=document.createElement('a');a.href=p.url;a.target='_blank';a.rel='noopener noreferrer';a.textContent='View source';
      row.append(title,desc,a);summary.append(row);
    });
    selectorByProject.forEach((url,checkbox)=>{
      checkbox.checked=selected.has(url);
      checkbox.disabled=!selected.has(url)&&selected.size>=MAX;
    });
  }
  projects.forEach(p=>{
    const label=document.createElement('label');
    label.className='project-shortlist-choice';
    const checkbox=document.createElement('input');
    checkbox.type='checkbox';
    checkbox.setAttribute('aria-label','Include '+p.title+' in project shortlist');
    const name=document.createElement('span');name.textContent='Shortlist';
    label.append(checkbox,name);
    p.card.append(label);
    selectorByProject.set(checkbox,p.url);
    checkbox.addEventListener('change',()=>{
      if(checkbox.checked){
        if(selected.size>=MAX&&!selected.has(p.url)){checkbox.checked=false;return;}
        selected.add(p.url);
      }else selected.delete(p.url);
      render();
    });
  });
  copy.addEventListener('click',async()=>{
    const items=projects.filter(p=>selected.has(p.url));
    const brief=['Selected public projects — Sudip Das','Source: '+location.origin+location.pathname,'',
      ...items.flatMap(p=>[p.title+' · '+p.category,p.desc,p.url,'']),
      'These summaries describe project direction. Verify current features on GitHub.'].join('\n');
    try{await navigator.clipboard.writeText(brief);status.textContent='Briefing copied for sharing with a recruiter or collaborator.';}
    catch{status.textContent='Clipboard unavailable. You can select the descriptions above manually.';}
  });
  clear.addEventListener('click',()=>{selected.clear();render();});
  render();
})();