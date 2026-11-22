/* WebStudio Portfolio Gallery for the REAL personal profile.
   Read-only view over approved public DOM. No new APIs, uploads, claims or profile writes. */
(() => {
  'use strict';
  const projectSection=document.getElementById('projects');
  const themeSelect=document.getElementById('theme-select');
  const publicProjects=projectSection?.querySelector('.project-grid');
  if(!publicProjects||!themeSelect)return;

  const projects=[...publicProjects.querySelectorAll('article.project')];
  if(!projects.length)return;

  const $=(selector,scope=document)=>scope.querySelector(selector);
  const nodes=(name,attr,value)=>{
    const el=document.createElement(name);
    if(attr)el.setAttribute(attr,value);
    return el;
  };

  // A compact theme sampler uses the same six authoritative options.
  const stage=document.createElement('section');
  stage.id='profile-showcase';
  stage.className='portfolio-gallery';
  stage.setAttribute('aria-labelledby','portfolio-gallery-title');
  const heading=nodes('div');
  heading.className='portfolio-gallery-heading';
  const h=nodes('h3');h.id='portfolio-gallery-title';h.textContent='Explore the portfolio';
  const sub=nodes('p');sub.textContent='Preview a design or open a project story. All information comes from this public profile.';
  const themeField=nodes('div');themeField.className='portfolio-gallery-themes';
  themeField.setAttribute('role','group');themeField.setAttribute('aria-label','Live site themes');
  const sampler=nodes('div');sampler.className='portfolio-gallery-choices';
  const themeMeta=nodes('p');themeMeta.className='portfolio-gallery-theme-status';
  themeMeta.setAttribute('role','status');
  const themeTitle=nodes('h4');themeTitle.textContent='Theme gallery';
  themeField.append(themeTitle,sampler,themeMeta);
  const spotlightAction=nodes('div');spotlightAction.className='portfolio-gallery-action';
  const openButton=nodes('button');openButton.type='button';openButton.className='portfolio-gallery-open';
  openButton.textContent='▶ Explore project stories';
  const helper=nodes('p');helper.textContent='A focused, keyboard-friendly view of the existing public projects.';
  spotlightAction.append(openButton,helper);
  heading.append(h,sub);
  stage.append(heading,themeField,spotlightAction);
  const anchor=$('.profile-project-tools',projectSection) || publicProjects;
  anchor.insertAdjacentElement('beforebegin',stage);
  // Visible from the landing hero, not hidden several sections down the page.
  const heroActions=document.querySelector('.hero .actions');
  if(heroActions){
    const launch=nodes('button');launch.type='button';
    launch.className='button portfolio-gallery-hero-launch';
    launch.textContent='✦ Interactive portfolio';
    launch.setAttribute('aria-label','Explore interactive portfolio gallery');
    launch.addEventListener('click',()=>{
      if(document.body.dataset.theme==='terminal')
        document.querySelector('a[href="#projects"]')?.click();
      stage.scrollIntoView({behavior:'smooth',block:'start'});
      openButton.focus({preventScroll:true});
    });
    heroActions.append(launch);
  }


  const themePalette={
    orbit:['#071622','#42f0d3','#55bdff'],
    editorial:['#efece4','#6d5a46','#b77359'],
    terminal:['#071711','#4dff9c','#a0efbd'],
    'aurora-peak':['#091a31','#62f0c7','#71baff'],
    'neon-studio':['#050c23','#08eefa','#cf73ff'],
    'design-2':['#080b2b','#b996ff','#58ccff']
  };
  const themeNames={
    orbit:'Orbit',editorial:'Editorial',terminal:'Terminal',
    'aurora-peak':'Aurora Peak','neon-studio':'Neon Studio','design-2':'Cosmic'
  };
  for(const option of themeSelect.options){
    const palette=themePalette[option.value];
    if(!palette)continue;
    const choice=nodes('button');choice.type='button';
    choice.className='portfolio-theme-choice';choice.dataset.themeChoice=option.value;
    choice.setAttribute('aria-label','Activate '+themeNames[option.value]+' theme');
    const sample=nodes('span');sample.className='portfolio-theme-swatch';
    sample.style.setProperty('--sample-base',palette[0]);
    sample.style.setProperty('--sample-accent',palette[1]);
    sample.style.setProperty('--sample-second',palette[2]);
    sample.setAttribute('aria-hidden','true');
    const label=nodes('span');label.className='portfolio-theme-name';label.textContent=themeNames[option.value];
    choice.append(sample,label);
    choice.addEventListener('click',()=>{
      themeSelect.value=option.value;
      themeSelect.dispatchEvent(new Event('change',{bubbles:true}));
      updateChoices();
    });
    sampler.append(choice);
  }
  function updateChoices(){
    for(const button of sampler.querySelectorAll('button[data-theme-choice]'))
      button.setAttribute('aria-pressed',String(button.dataset.themeChoice===themeSelect.value));
    themeMeta.textContent='Active design: '+themeNames[themeSelect.value]+'.';
  }
  themeSelect.addEventListener('change',updateChoices);
  updateChoices();

  // Modal content is built via textContent, never untrusted HTML, and links
  // reuse the EXACT approved public project URLs.
  const overlay=nodes('div');overlay.id='portfolio-project-story';
  overlay.className='portfolio-story';overlay.hidden=true;
  overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-labelledby','portfolio-story-title');
  const shade=nodes('div');shade.className='portfolio-story-shade';
  shade.setAttribute('data-close-story','');
  const frame=nodes('div');frame.className='portfolio-story-frame';
  const top=nodes('div');top.className='portfolio-story-top';
  const count=nodes('span');count.className='portfolio-story-index';
  const close=nodes('button');close.type='button';close.className='portfolio-story-close';
  close.setAttribute('aria-label','Close project story');close.textContent='×';
  top.append(count,close);
  const category=nodes('p');category.className='portfolio-story-category';
  const title=nodes('h2');title.id='portfolio-story-title';
  const summary=nodes('p');summary.className='portfolio-story-summary';
  const status=nodes('p');status.className='portfolio-story-state';
  const link=nodes('a');link.className='portfolio-story-link';
  link.rel='noopener noreferrer';link.target='_blank';link.textContent='Explore public repository ↗';
  const controls=nodes('nav');controls.className='portfolio-story-controls';
  controls.setAttribute('aria-label','Project story controls');
  const prev=nodes('button');prev.type='button';prev.textContent='← Previous';
  const next=nodes('button');next.type='button';next.textContent='Next →';
  const jump=nodes('button');jump.type='button';jump.textContent='View on page';
  controls.append(prev,next,jump);
  const note=nodes('p');note.className='portfolio-story-hint';
  note.textContent='← / → to switch projects · Escape to close';
  frame.append(top,category,title,summary,status,link,controls,note);
  overlay.append(shade,frame);document.body.append(overlay);

  const projectData=projects.map((node,index)=>{
    const anchor=node.querySelector('.project-link[href]');
    return {
      element:node,
      index,
      name:node.querySelector('h3')?.textContent?.trim()||'Public project',
      category:node.querySelector('.project-type')?.textContent?.trim()||'Portfolio project',
      state:node.querySelector('.project-state')?.textContent?.trim()||'',
      description:node.querySelector('p:not(.project-note)')?.textContent?.trim()||'',
      href:anchor?.getAttribute('href')||'',
      action:anchor?.textContent?.trim()||'Explore public project'
    };
  });
  let current=0,opener=null;
  const isOpen=()=>!overlay.hidden;
  function display(index){
    current=(index+projectData.length)%projectData.length;
    const item=projectData[current];
    count.textContent=String(current+1).padStart(2,'0')+' / '+String(projectData.length).padStart(2,'0');
    category.textContent=item.category;
    title.textContent=item.name;
    summary.textContent=item.description;
    status.textContent=item.state;
    if(item.href&&/^(https?:\/\/|#)/i.test(item.href)){
      link.hidden=false;
      link.href=item.href;
      link.textContent=item.action+' ↗';
    }else{
      link.hidden=true;
      link.removeAttribute('href');
    }
    prev.disabled=projectData.length<2;
    next.disabled=projectData.length<2;
  }
  function show(index=0,origin=document.activeElement){
    opener=origin;display(index);overlay.hidden=false;
    document.body.classList.add('portfolio-story-open');
    close.focus();
  }
  function hide(){
    if(!isOpen())return;
    overlay.hidden=true;
    document.body.classList.remove('portfolio-story-open');
    if(opener?.isConnected)opener.focus();
  }
  openButton.addEventListener('click',()=>show(0,openButton));
  projects.forEach((project,i)=>{
    const button=nodes('button');button.type='button';
    button.className='portfolio-story-card-open';
    button.textContent='Story view ↗';
    button.setAttribute('aria-label','View '+projectData[i].name+' project story');
    project.append(button);
    button.addEventListener('click',()=>show(i,button));
  });
  close.addEventListener('click',hide);
  shade.addEventListener('click',hide);
  prev.addEventListener('click',()=>display(current-1));
  next.addEventListener('click',()=>display(current+1));
  jump.addEventListener('click',()=>{
    const target=projectData[current].element;
    hide();
    // In terminal view the section pager is authoritative; reveal it first.
    if(document.body.dataset.theme==='terminal'){
      document.querySelector('a[href="#projects"]')?.click();
    }
    target.scrollIntoView({behavior:'auto',block:'center'});
  });
  overlay.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();hide();return;}
    if(event.key==='ArrowRight'){event.preventDefault();display(current+1);return;}
    if(event.key==='ArrowLeft'){event.preventDefault();display(current-1);return;}
    if(event.key!=='Tab')return;
    const focusable=[...frame.querySelectorAll('button:not(:disabled),a[href]')]
      .filter(el=>!el.hidden&&el.getClientRects().length>0);
    if(!focusable.length)return;
    if(event.shiftKey&&document.activeElement===focusable[0]){
      event.preventDefault();focusable.at(-1).focus();
    }else if(!event.shiftKey&&document.activeElement===focusable.at(-1)){
      event.preventDefault();focusable[0].focus();
    }
  });

  // Side-by-side read-only comparison of two ACTUAL published projects.
  const compare=nodes('div');compare.className='portfolio-compare';
  const compareHeading=nodes('h4');compareHeading.textContent='Project comparison';
  const compareHint=nodes('p');compareHint.textContent='Choose any two public projects to compare their published scope and status.';
  const compareSlots=nodes('div');compareSlots.className='portfolio-compare-slots';
  const compareActions=nodes('div');compareActions.className='portfolio-compare-actions';
  const compareButton=nodes('button');compareButton.type='button';compareButton.textContent='Compare selected';
  const clearCompare=nodes('button');clearCompare.type='button';clearCompare.textContent='Clear selection';
  const compareStatus=nodes('p');compareStatus.setAttribute('role','status');
  compareStatus.className='portfolio-compare-status';
  compareActions.append(compareButton,clearCompare);
  compare.append(compareHeading,compareHint,compareSlots,compareActions,compareStatus);
  stage.append(compare);
  const selected=new Set();
  function renderSelection(){
    compareSlots.replaceChildren();
    for(const item of projectData){
      const button=nodes('button');button.type='button';
      button.className='portfolio-compare-choice';button.textContent=item.name;
      button.setAttribute('aria-pressed',String(selected.has(item.index)));
      button.addEventListener('click',()=>{
        if(selected.has(item.index))selected.delete(item.index);
        else if(selected.size<2)selected.add(item.index);
        else{
          // Avoid silently changing the first chosen project.
          compareStatus.textContent='Choose only two projects; clear one before adding another.';
          return;
        }
        renderSelection();
      });
      compareSlots.append(button);
    }
    compareButton.disabled=selected.size!==2;
    clearCompare.disabled=selected.size===0;
    compareStatus.textContent=selected.size+' of 2 projects selected.';
  }
  const comparison=nodes('div');comparison.id='portfolio-compare-dialog';
  comparison.className='portfolio-comparison';comparison.hidden=true;
  comparison.setAttribute('role','dialog');comparison.setAttribute('aria-modal','true');
  comparison.setAttribute('aria-labelledby','portfolio-comparison-title');
  const comparisonShade=nodes('div');comparisonShade.className='portfolio-comparison-shade';
  const comparisonFrame=nodes('div');comparisonFrame.className='portfolio-comparison-frame';
  const comparisonTop=nodes('div');comparisonTop.className='portfolio-comparison-top';
  const comparisonTitle=nodes('h2');comparisonTitle.id='portfolio-comparison-title';
  comparisonTitle.textContent='Project comparison';
  const comparisonClose=nodes('button');comparisonClose.type='button';
  comparisonClose.setAttribute('aria-label','Close comparison');comparisonClose.textContent='×';
  const comparisonGrid=nodes('div');comparisonGrid.className='portfolio-comparison-grid';
  const comparisonNote=nodes('p');comparisonNote.className='portfolio-comparison-note';
  comparisonNote.textContent='Public portfolio descriptions only. Check the linked repositories for current development and availability.';
  comparisonTop.append(comparisonTitle,comparisonClose);
  comparisonFrame.append(comparisonTop,comparisonGrid,comparisonNote);
  comparison.append(comparisonShade,comparisonFrame);document.body.append(comparison);
  let comparisonOpener=null;
  function hideComparison(){
    if(comparison.hidden)return;
    comparison.hidden=true;
    document.body.classList.remove('portfolio-story-open');
    if(comparisonOpener?.isConnected)comparisonOpener.focus();
  }
  function showComparison(){
    if(selected.size!==2)return;
    comparisonOpener=document.activeElement;
    comparisonGrid.replaceChildren();
    for(const index of selected){
      const item=projectData[index];
      const card=nodes('article');card.className='portfolio-comparison-card';
      const number=nodes('span');number.textContent='0'+(index+1);
      const heading=nodes('h3');heading.textContent=item.name;
      const kind=nodes('p');kind.textContent=item.category;
      const description=nodes('p');description.textContent=item.description;
      const state=nodes('p');state.className='portfolio-comparison-state';state.textContent=item.state;
      card.append(number,heading,kind,description,state);
      if(item.href&&/^(https?:\/\/|#)/i.test(item.href)){
        const a=nodes('a');a.href=item.href;a.target='_blank';a.rel='noopener noreferrer';
        a.textContent='Open public project ↗';card.append(a);
      }
      comparisonGrid.append(card);
    }
    comparison.hidden=false;
    document.body.classList.add('portfolio-story-open');
    comparisonClose.focus();
  }
  compareButton.addEventListener('click',showComparison);
  clearCompare.addEventListener('click',()=>{selected.clear();renderSelection();});
  comparisonClose.addEventListener('click',hideComparison);
  comparisonShade.addEventListener('click',hideComparison);
  comparison.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();hideComparison();return;}
    if(event.key!=='Tab')return;
    const all=[...comparisonFrame.querySelectorAll('button:not(:disabled),a[href]')]
      .filter(el=>el.getClientRects().length>0);
    if(!all.length)return;
    if(event.shiftKey&&document.activeElement===all[0]){event.preventDefault();all.at(-1).focus();}
    else if(!event.shiftKey&&document.activeElement===all.at(-1)){event.preventDefault();all[0].focus();}
  });
  renderSelection();

  // A low-noise experience explorer adapts existing public timeline entries.
  const work=document.getElementById('experience');
  const timeline=work?.querySelector('.timeline');
  const roles=[...timeline?.querySelectorAll('.role')||[]];
  if(roles.length){
    const explorer=nodes('div');explorer.className='portfolio-career-explorer';
    explorer.setAttribute('aria-label','Explore public professional experience');
    const heading=nodes('h3');heading.textContent='Career navigator';
    const hint=nodes('p');hint.textContent='Jump through the experience already published on this page.';
    const actions=nodes('div');actions.className='portfolio-career-chips';
    roles.forEach((role,i)=>{
      const label=role.querySelector('h3')?.textContent?.trim()||'Experience '+(i+1);
      const button=nodes('button');button.type='button';
      button.textContent=label;
      button.addEventListener('click',()=>{
        role.scrollIntoView({behavior:'smooth',block:'center'});
        role.classList.add('portfolio-career-selected');
        role.addEventListener('animationend',()=>role.classList.remove('portfolio-career-selected'),{once:true});
      });
      actions.append(button);
    });
    explorer.append(heading,hint,actions);
    timeline.parentNode.insertBefore(explorer,timeline);
  }

  // Recruiter-friendly focus mode and native browser print: ONLY public data.
  // Focus mode stays in this browser; print hides the restricted request form.
  const focusRow=nodes('div');focusRow.className='portfolio-focus-actions';
  const focusButton=nodes('button');focusButton.type='button';
  focusButton.id='portfolio-focus-toggle';
  const printButton=nodes('button');printButton.type='button';printButton.id='portfolio-print';
  printButton.textContent='Print / Save as PDF';
  const focusHelp=nodes('p');
  focusHelp.textContent='A distraction-free view of the public portfolio. Print uses your browser’s own print dialog.';
  focusRow.append(focusButton,printButton,focusHelp);
  stage.append(focusRow);
  const focusKey='sudip-profile-focus-view';
  let isFocused=false;
  try{isFocused=localStorage.getItem(focusKey)==='on';}catch{}
  function applyFocus(){
    document.body.dataset.profileFocus=isFocused?'on':'off';
    focusButton.setAttribute('aria-pressed',String(isFocused));
    focusButton.textContent=isFocused?'Exit Focus View':'Focus View';
    // Sections remain in the DOM; only presentation changes.
  }
  focusButton.addEventListener('click',()=>{
    isFocused=!isFocused;
    try{localStorage.setItem(focusKey,isFocused?'on':'off');}catch{}
    applyFocus();
  });
  printButton.addEventListener('click',()=>window.print());
  applyFocus();

  // Opt-in accessibility enhancement: skip animation WITHOUT changing owner data.
  const reducedMotion=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  if(reducedMotion)document.documentElement.classList.add('portfolio-prefer-reduced-motion');
})();
