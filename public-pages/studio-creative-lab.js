/* WebStudio Creative Lab — user-controlled local-only live design presets.
   Keeps independent theme/portrait machinery authoritative, never exports secrets. */
(() => {
  'use strict';
  const editor=document.getElementById('editor'), theme=document.getElementById('studio-theme');
  const language=document.getElementById('studio-language'), form=document.getElementById('profile-form');
  if(!editor || !theme || !language || !form) return;
  const KEY='webstudio:creative-lab:v1';
  const presets=Object.freeze({
    electric:{accent:'#30ddf4',glow:64,spacing:50,motion:true},
    ultraviolet:{accent:'#bc86ff',glow:80,spacing:58,motion:true},
    emerald:{accent:'#64f0b1',glow:50,spacing:50,motion:true},
    sunset:{accent:'#ff9e79',glow:55,spacing:54,motion:true},
    minimal:{accent:'#a2c5da',glow:15,spacing:64,motion:false}
  });
  const panel=document.createElement('section');panel.className='creative-lab';panel.setAttribute('aria-labelledby','creative-lab-title');
  panel.innerHTML='<div class="creative-lab-heading"><div><span class="creative-lab-kicker">LIVE DESIGN CONTROLS</span><h3 id="creative-lab-title">Creative Lab</h3><p>Fine-tune the visual energy without changing your portfolio content. Local preview only.</p></div><div class="creative-lab-heading-actions"><button class="ghost" id="creative-lab-export" type="button">Export look</button><label class="ghost creative-lab-import-label">Import look<input id="creative-lab-import" type="file" accept=".json,application/json"></label><button class="ghost" id="creative-lab-reset" type="button">Reset look</button></div></div><div class="creative-lab-presets" role="group" aria-label="Visual mood presets"></div><div class="creative-lab-controls"><label>Glow intensity <output id="creative-glow-value">55%</output><input id="creative-glow" type="range" min="0" max="100" step="5" value="55"></label><label>Section rhythm <output id="creative-space-value">50%</output><input id="creative-space" type="range" min="0" max="100" step="5" value="50"></label><label class="creative-lab-toggle"><input id="creative-motion" type="checkbox" checked> Ambient motion</label></div><p class="creative-lab-status" id="creative-lab-status" role="status"></p>';
  const avatar=document.querySelector('.avatar-studio');
  const target=avatar||form.querySelector('.actions');
  if(target)target.parentNode.insertBefore(panel,avatar ? avatar.nextSibling : target);
  const buttons=panel.querySelector('.creative-lab-presets');
  for(const [id,preset] of Object.entries(presets)){
    const b=document.createElement('button');
    b.type='button';b.className='creative-lab-preset';b.dataset.mood=id;
    const swatch=document.createElement('span');swatch.className='creative-lab-swatch';swatch.style.background=preset.accent;
    b.append(swatch,document.createTextNode(id.charAt(0).toUpperCase()+id.slice(1)));
    b.addEventListener('click',()=>{
      state={...preset,selected:id};
      persist();render();setAccent(preset.accent);
    });
    buttons.append(b);
  }
  const glow=panel.querySelector('#creative-glow'),spacing=panel.querySelector('#creative-space'),motion=panel.querySelector('#creative-motion');
  const clamp=n=>Math.max(0,Math.min(100,Math.round(Number(n)||0)));
  const safeColor=s=>/^#[0-9a-f]{6}$/i.test(s||'')?s:'#30ddf4';
  let state={...presets.electric,selected:'electric'};
  try{
    const data=JSON.parse(localStorage.getItem(KEY)||'null');
    if(data&&typeof data==='object'){
      state={accent:safeColor(data.accent),glow:clamp(data.glow),spacing:clamp(data.spacing),
        motion:data.motion===true,selected:Object.hasOwn(presets,data.selected)?data.selected:'custom'};
    }
  }catch{}
  function persist(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{panel.querySelector('#creative-lab-status').textContent='Changes work for this session; browser storage is unavailable.';}}
  function setAccent(color){
    const input=form.elements.namedItem('accent');
    if(input&&input.type==='color'){
      input.value=color;
      input.dispatchEvent(new Event('input',{bubbles:true}));
      input.dispatchEvent(new Event('change',{bubbles:true}));
    }
    // Preview only; profile persistence is still governed by Save & preview.
    document.documentElement.style.setProperty('--creative-accent',color);
  }
  function render(){
    document.body.style.setProperty('--creative-glow',String(state.glow/100));
    document.body.style.setProperty('--creative-rhythm',String(state.spacing/100));
    document.body.dataset.creativeMotion=state.motion?'on':'off';
    document.body.dataset.creativeCustomSpacing=state.spacing===50?'off':'on';
    document.documentElement.style.setProperty('--creative-accent',state.accent);
    glow.value=state.glow;spacing.value=state.spacing;motion.checked=state.motion;
    panel.querySelector('#creative-glow-value').textContent=state.glow+'%';
    panel.querySelector('#creative-space-value').textContent=state.spacing+'%';
    panel.querySelectorAll('button[data-mood]').forEach(b=>{
      const selected=b.dataset.mood===state.selected;
      b.setAttribute('aria-pressed',String(selected));
    });
    panel.querySelector('#creative-lab-status').textContent='Live look: '+(state.selected==='custom'?'Custom':state.selected)+'. Edit your profile separately to save content.';
  }
  function update(){
    state.glow=clamp(glow.value);state.spacing=clamp(spacing.value);
    state.motion=motion.checked;state.selected='custom';persist();render();
  }
  glow.addEventListener('input',update);
  spacing.addEventListener('input',update);
  motion.addEventListener('change',update);
  panel.querySelector('#creative-lab-reset').addEventListener('click',()=>{
    state={...presets.electric,selected:'electric'};persist();render();setAccent(state.accent);
  });
  panel.querySelector('#creative-lab-export').addEventListener('click',()=>{
    const payload={
      schema:'webstudio-creative-look',version:1,theme:theme.value,language:language.value,
      selected:state.selected,accent:state.accent,glow:state.glow,spacing:state.spacing,motion:state.motion
    };
    const blob=new Blob([JSON.stringify(payload,null,2)+'\n'],{type:'application/json'});
    const url=URL.createObjectURL(blob);const a=document.createElement('a');
    a.href=url;a.download='webstudio-creative-look.json';document.body.append(a);a.click();a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
    panel.querySelector('#creative-lab-status').textContent='Downloaded portable visual settings (no profile or private data).';
  });
  panel.querySelector('#creative-lab-import').addEventListener('change',async event=>{
    const input=event.target,file=input.files?.[0];
    if(!file)return;
    const status=panel.querySelector('#creative-lab-status');
    try{
      if(file.size>8192||file.size<10)throw Error('Invalid or oversized design recipe.');
      const data=JSON.parse(await file.text());
      if(data?.schema!=='webstudio-creative-look'||data.version!==1
        ||typeof data.glow!=='number'||data.glow<0||data.glow>100
        ||typeof data.spacing!=='number'||data.spacing<0||data.spacing>100
        ||typeof data.motion!=='boolean'||!/^#[0-9a-f]{6}$/i.test(data.accent||'')
        ||!['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'].includes(data.theme)
        ||![...language.options].some(o=>o.value===data.language))throw Error('Unsupported design recipe.');
      const next={selected:Object.hasOwn(presets,data.selected)?data.selected:'custom',
        accent:data.accent,glow:clamp(data.glow),spacing:clamp(data.spacing),motion:data.motion};
      state=next;persist();render();setAccent(data.accent);
      theme.value=data.theme;theme.dispatchEvent(new Event('change',{bubbles:true}));
      language.value=data.language;language.dispatchEvent(new Event('change',{bubbles:true}));
      status.textContent='Imported a validated design recipe. Save & preview to keep profile content changes.';
    }catch(err){status.textContent='Could not import design recipe: '+err.message;}
    finally{input.value='';}
  });
  document.getElementById('reset-profile')?.addEventListener('click',()=>{
    state={...presets.electric,selected:'electric'};persist();render();
    document.documentElement.style.removeProperty('--creative-accent');
  });
  render();
  // Keyboard-first command palette; no external service, no unsafe HTML or arbitrary commands.
  const shell=document.createElement('div');shell.className='creative-command';shell.id='creative-command';shell.hidden=true;
  shell.setAttribute('role','dialog');shell.setAttribute('aria-modal','true');shell.setAttribute('aria-labelledby','creative-command-title');
  shell.innerHTML='<div class="creative-command-shade" data-command-close></div><div class="creative-command-panel"><div class="creative-command-heading"><h2 id="creative-command-title">WebStudio quick actions</h2><button type="button" id="creative-command-close" class="ghost" aria-label="Close quick actions">×</button></div><label for="creative-command-search">Find a command</label><input id="creative-command-search" type="search" placeholder="Search themes, sections, editor..." autocomplete="off"><div class="creative-command-results" id="creative-command-results" role="listbox" aria-label="Available commands"></div><p class="creative-command-hint">Ctrl/⌘ + K to open · Escape to close</p></div>';
  document.body.append(shell);
  const trigger=document.createElement('button');trigger.id='creative-command-trigger';trigger.type='button';trigger.className='ghost creative-command-trigger';
  trigger.textContent='⌘ Quick actions';
  trigger.setAttribute('aria-keyshortcuts','Control+K Meta+K');
  const editorToggle=document.getElementById('edit-toggle');
  document.body.append(trigger);
  let previous=null,found=[];
  const search=shell.querySelector('#creative-command-search'),results=shell.querySelector('#creative-command-results');
  const actions=[
    {title:'Customize portfolio',keywords:'editor edit visual profile',run:()=>editorToggle?.click()},
    {title:'Creative Lab controls',keywords:'glow color ambiance layout',run:()=>{if(!editor.classList.contains('open'))editorToggle?.click();panel.scrollIntoView({behavior:'auto',block:'center'});glow.focus();}},
    {title:'Change avatar',keywords:'portrait photo image',run:()=>{if(!editor.classList.contains('open'))editorToggle?.click();document.querySelector('.avatar-studio')?.scrollIntoView({behavior:'auto',block:'center'});}},
    {title:'Projects',keywords:'portfolio work',run:()=>document.getElementById('projects-section')?.scrollIntoView({behavior:'auto'})},
    {title:'About WebStudio & Help',keywords:'information support',run:()=>document.getElementById('footer-about')?.click()},
    ...[...theme.options].map(o=>({title:'Theme · '+o.textContent,keywords:'layout theme design',run:()=>{theme.value=o.value;theme.dispatchEvent(new Event('change',{bubbles:true}));}})),
    ...[...language.options].map(o=>({title:'Language · '+o.textContent,keywords:'translate locale language',run:()=>{language.value=o.value;language.dispatchEvent(new Event('change',{bubbles:true}));}}))
  ];
  function filterCommands(){
    const query=search.value.toLocaleLowerCase().trim();
    found=actions.filter(a=>(a.title+' '+a.keywords).toLocaleLowerCase().includes(query)).slice(0,16);
    results.replaceChildren();
    for(const [i,item] of found.entries()){
      const b=document.createElement('button');b.type='button';b.setAttribute('role','option');b.className='creative-command-option';
      b.dataset.commandIndex=String(i);b.textContent=item.title;
      b.addEventListener('click',()=>{hide();item.run();});results.append(b);
    }
    if(!found.length){const p=document.createElement('p');p.textContent='No matching actions';results.append(p);}
  }
  function show(){if(!shell.hidden)return;previous=document.activeElement;shell.hidden=false;search.value='';filterCommands();search.focus();}
  function hide(){if(shell.hidden)return;shell.hidden=true;if(previous?.isConnected)previous.focus();}
  trigger.addEventListener('click',show);
  shell.querySelector('#creative-command-close').addEventListener('click',hide);
  shell.querySelector('[data-command-close]').addEventListener('click',hide);
  shell.addEventListener('keydown',e=>{
    if(e.key==='Escape'){e.preventDefault();hide();}
    else if(e.key==='Enter'&&e.target===search&&found.length){e.preventDefault();const a=found[0];hide();a.run();}
    else if(e.key==='Tab'){
      const focusables=[...shell.querySelectorAll('button:not([disabled]),input')].filter(x=>x.getClientRects().length);
      const first=focusables[0],last=focusables[focusables.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
    }
  });
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'&&!e.altKey){
      e.preventDefault();shell.hidden?show():hide();
    }
  });
  search.addEventListener('input',filterCommands);
})();
