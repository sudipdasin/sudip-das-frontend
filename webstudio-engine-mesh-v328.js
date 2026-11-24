/* WebStudio Engine Mesh v3.28
 * Coordinates existing, already-mounted Theme / Hero / Atmosphere / Quick / Portfolio
 * engines without replacing DOM, copying credentials, or collecting visitor data.
 * This is the single six-theme presentation-state contract for preview.
 */
(() => {
 'use strict';
 if(window.PORTFOLIO_PREVIEW_MODE!==true||window.__wsEngineMesh328)return;
 const body=document.body,select=document.getElementById('theme-select');
 if(!body||!select)return;
 const THEMES=Object.freeze({
  orbit:Object.freeze({id:'orbit',layout:'orbital',tone:'ocean',accent:'#75efdb',surface:'#0c2b39',contrast:'#e9fbfb',motion:'orbit',shape:'round'}),
  editorial:Object.freeze({id:'editorial',layout:'folio',tone:'paper',accent:'#805337',surface:'#fff9f1',contrast:'#302b26',motion:'still',shape:'square'}),
  terminal:Object.freeze({id:'terminal',layout:'console',tone:'phosphor',accent:'#73ffa9',surface:'#071e13',contrast:'#e4ffee',motion:'still',shape:'square'}),
  'aurora-peak':Object.freeze({id:'aurora-peak',layout:'alpine',tone:'sunrise',accent:'#dce8ad',surface:'#173b35',contrast:'#f4f7e8',motion:'mist',shape:'arch'}),
  'neon-studio':Object.freeze({id:'neon-studio',layout:'atelier',tone:'neon',accent:'#61f5e4',surface:'#0d283c',contrast:'#edfaff',motion:'glow',shape:'glass'}),
  'design-2':Object.freeze({id:'design-2',layout:'observatory',tone:'cosmos',accent:'#d2c0ff',surface:'#16173c',contrast:'#f5f2ff',motion:'stars',shape:'prism'})
 });
 const KEYS=Object.keys(THEMES);
 const reduced=window.matchMedia?.('(prefers-reduced-motion:reduce)');
 const forced=window.matchMedia?.('(forced-colors:active)');
 const saver=Boolean(navigator.connection?.saveData);
 const weakDevice=(Number(navigator.deviceMemory)>0&&Number(navigator.deviceMemory)<3)||
  (Number(navigator.hardwareConcurrency)>0&&Number(navigator.hardwareConcurrency)<=2);
 let current='',phase='initial',revisions=0,scheduled=false,section='intro';
 function selected(){
  const fromBody=body.dataset.theme;
  if(Object.prototype.hasOwnProperty.call(THEMES,fromBody))return fromBody;
  return Object.prototype.hasOwnProperty.call(THEMES,select.value)?select.value:'neon-studio';
 }
 function motion(){
  const quality=body.dataset.atmosphereTier||'auto';
  return reduced?.matches||forced?.matches||navigator.connection?.saveData||weakDevice||
   quality==='off'||quality==='eco'?'still':'ambient';
 }
 function refresh(reason='sync'){
  scheduled=false;
  const id=selected(),p=THEMES[id],mode=motion();
  const changed=id!==current||body.dataset.wsxMotion!==mode||body.dataset.wsxLayout!==p.layout;
  current=id;phase=reason;
  body.dataset.wsxTheme=id;
  body.dataset.wsxLayout=p.layout;
  body.dataset.wsxTone=p.tone;
  body.dataset.wsxShape=p.shape;
  body.dataset.wsxMotion=mode;
  body.dataset.wsxEngine='v3.28';
  body.style.setProperty('--wsx-accent',p.accent);
  body.style.setProperty('--wsx-surface',p.surface);
  body.style.setProperty('--wsx-ink',p.contrast);
  const quick=document.getElementById('ws-visitor-quick-panel');
  const projects=document.querySelector('#projects');
  if(quick)quick.dataset.wsxTheme=id;
  if(projects)projects.dataset.wsxTheme=id;
  const hero=document.querySelector('main > .hero');
  if(hero)hero.dataset.wsxTheme=id;
  if(changed){
   revisions++;
   window.dispatchEvent(new CustomEvent('ws-engine-theme-change',{
    detail:{theme:id,layout:p.layout,motion:mode,revision:revisions,reason}
   }));
  }
 }
 function schedule(reason){
  phase=reason||'mutation';
  if(scheduled)return;
  scheduled=true;
  if(typeof requestAnimationFrame==='function')
   requestAnimationFrame(()=>refresh(phase));
  else Promise.resolve().then(()=>refresh(phase));
 }
 function choose(id){
  if(!Object.prototype.hasOwnProperty.call(THEMES,id))return false;
  const option=[...select.options].find(x=>x.value===id&&!x.disabled);
  if(!option)return false;
  select.value=id;
  select.dispatchEvent(new Event('change',{bubbles:true}));
  schedule('user-theme-selection');
  return true;
 }
 select.addEventListener('change',()=>schedule('theme-picker'));
 const observer=typeof MutationObserver==='function'?new MutationObserver(()=>schedule('body-theme-or-quality')):null;
 observer?.observe(body,{attributes:true,attributeFilter:['data-theme','data-atmosphere-tier']});
 for(const signal of ['ws-atmosphere-change','ws-atmosphere-section'])window.addEventListener(signal,e=>{
  if(e?.detail?.section)section=e.detail.section;
  schedule(signal);
 });
 document.addEventListener('profile-language-change',()=>schedule('locale'));
 reduced?.addEventListener?.('change',()=>schedule('reduced-motion'));
 forced?.addEventListener?.('change',()=>schedule('forced-colors'));
 navigator.connection?.addEventListener?.('change',()=>schedule('data-saver'));
 // An optional keyboard route for Quick Menu; never steals keystrokes in fields.
 document.addEventListener('keydown',event=>{
  const target=event.target;
  const editable=target?.isContentEditable||target?.closest?.('input,textarea,select,[contenteditable="true"]');
  if(editable||event.repeat)return;
  const panel=document.getElementById('ws-visitor-quick-panel');
  const trigger=document.getElementById('ws-visitor-quick-open');
  if(event.altKey&&event.shiftKey&&event.code==='KeyQ'&&!event.ctrlKey&&!event.metaKey){
   if(!trigger)return;
   event.preventDefault();trigger.click();
   if(panel&&!panel.hidden)panel.querySelector('[role="tab"]')?.focus({preventScroll:true});
  }else if(event.key==='Escape'&&panel&&!panel.hidden&&trigger){
   event.preventDefault();trigger.click();trigger.focus({preventScroll:true});
  }
 });
 const api=Object.freeze({
  getTheme:()=>current,
  getProfile:()=>THEMES[current],
  getStatus:()=>Object.freeze({
   theme:current,motion:body.dataset.wsxMotion,layout:body.dataset.wsxLayout,
   section,revision:revisions,phase,themeCount:KEYS.length,
   hero:window.__wsHeroDisplay327?.getStatus?.()||null,
   atmosphere:window.__wsAtmosphere323?.getStatus?.()||null,
   quickMenu:Boolean(document.querySelector('.pv-hub-panel-v2')),
   portfolio:window.__wsPortfolio328?.getStatus?.()||null,
   locale:window.profileI18n?.locale||'en'
  }),
  chooseTheme:choose,
  profiles:THEMES
 });
 window.__wsEngineMesh328=api;
 refresh('bootstrap');
})();