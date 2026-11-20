/* Local-only Studio / System menu. No administrative backend is connected. */
(() => {
  'use strict';
  const trigger=document.getElementById('system-menu-trigger');
  const panel=document.getElementById('system-menu-panel');
  const root=document.getElementById('system-menu');
  if(!trigger||!panel||!root)return;
  const items=()=>[...panel.querySelectorAll('button:not(:disabled)')];
  const expanded=()=>trigger.getAttribute('aria-expanded')==='true';
  const setOpen=(open,{focus=false,returnFocus=false}={})=>{
    panel.hidden=!open;trigger.setAttribute('aria-expanded',String(open));
    if(open&&focus)items()[0]?.focus();
    if(!open&&returnFocus)trigger.focus();
  };
  trigger.addEventListener('click',()=>setOpen(!expanded()));
  panel.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();setOpen(false,{returnFocus:true});}
    if(!['ArrowDown','ArrowUp','Home','End'].includes(event.key))return;
    event.preventDefault();
    const entries=items();let index=entries.indexOf(document.activeElement);
    if(event.key==='Home')index=0;
    else if(event.key==='End')index=entries.length-1;
    else index=(index+(event.key==='ArrowDown'?1:-1)+entries.length)%entries.length;
    entries[index]?.focus();
  });
  trigger.addEventListener('keydown',event=>{
    if(event.key==='ArrowDown'||event.key==='Enter'&& !expanded()){
      if(event.key==='ArrowDown')event.preventDefault();
      setOpen(true,{focus:true});
    }
    if(event.key==='Escape'&&expanded()){event.preventDefault();setOpen(false);}
  });
  document.addEventListener('pointerdown',event=>{if(expanded()&&!root.contains(event.target))setOpen(false);});
  document.addEventListener('focusin',event=>{if(expanded()&&!root.contains(event.target))setOpen(false);});
  document.addEventListener('keydown',event=>{if(event.key==='Escape'&&expanded()){event.preventDefault();setOpen(false,{returnFocus:true});}});
  const editor=document.getElementById('editor');
  document.getElementById('system-customize').addEventListener('click',()=>{
    setOpen(false);
    if(!editor.classList.contains('open'))document.getElementById('edit-toggle').click();
    editor.scrollIntoView({block:'start',behavior:'smooth'});
    document.getElementById('editor-heading').setAttribute('tabindex','-1');
    document.getElementById('editor-heading').focus({preventScroll:true});
  });
  document.getElementById('system-reset').addEventListener('click',()=>{
    setOpen(false);
    // Reuse the existing reset action, which preserves its validation and status feedback.
    document.getElementById('reset-profile').click();
  });
  for(const id of ['backup-download','backup-import']){
    document.getElementById(id).addEventListener('click',()=>setOpen(false));
  }
})();
