/* WebStudio-specific About and Help dialog. LifeSphere details are explicitly disclosed. */
(() => {
 'use strict';
 const modal=document.getElementById('ws-about-modal');
 const close=document.getElementById('ws-about-close');
 const system=document.getElementById('system-about');
 const footer=document.getElementById('footer-about');
 const details=document.getElementById('ws-suite-details');
 const panel=document.getElementById('ws-suite-panel');
 if(!modal || !close || !system || !footer || !details || !panel) return;
 let previous=null;
 let scrollBefore='';
 let redirectingFocus=false;
 const focusableSelector='a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])';
 const focusables=()=>[...modal.querySelectorAll(focusableSelector)].filter(el=>!el.closest('[hidden],[inert]') && el.getClientRects().length>0 && getComputedStyle(el).visibility!=='hidden');
 function containFocus(event){
   if(!isOpen() || modal.contains(event.target) || redirectingFocus)return;
   redirectingFocus=true;
   (focusables()[0] || close).focus();
   redirectingFocus=false;
 }
 document.addEventListener('focusin',containFocus);

 const isOpen=()=>!modal.hidden;
 function show(){
   if(isOpen())return;
   previous=document.activeElement===system ? document.getElementById('system-menu-trigger') : document.activeElement;
   const systemPanel=document.getElementById('system-menu-panel');
   const systemTrigger=document.getElementById('system-menu-trigger');
   if(systemPanel && !systemPanel.hidden){
     systemPanel.hidden=true;
     if(systemTrigger)systemTrigger.setAttribute('aria-expanded','false');
   }
   modal.hidden=false;
   panel.hidden=true; details.setAttribute('aria-expanded','false');
   scrollBefore=document.body.style.overflow;
   document.body.style.overflow='hidden';
   close.focus();
 }
 function hide(){
   if(!isOpen())return;
   modal.hidden=true;
   document.body.style.overflow=scrollBefore;
   if(previous && previous.isConnected && typeof previous.focus==='function' && !previous.closest('[hidden],[inert]')) previous.focus();
   else document.getElementById('system-menu-trigger')?.focus();
 }
 for(const opener of [system,footer]) opener.addEventListener('click',show);
 close.addEventListener('click',hide);
 modal.querySelector('[data-ws-close]')?.addEventListener('click',hide);
 details.addEventListener('click',()=>{
   const open=panel.hidden;
   panel.hidden=!open;
   details.setAttribute('aria-expanded',String(open));
 });
 modal.addEventListener('keydown', event=>{
   if(event.key==='Escape'){event.preventDefault();hide();return;}
   if(event.key!=='Tab')return;
   const items=focusables();
   if(!items.length){event.preventDefault();close.focus();return;}
   const first=items[0],last=items[items.length-1];
   const current=items.indexOf(document.activeElement);
   if(event.shiftKey && current<=0){event.preventDefault();last.focus();}
   else if(!event.shiftKey && (current===items.length-1 || current===-1)){event.preventDefault();first.focus();}
 });
})();
