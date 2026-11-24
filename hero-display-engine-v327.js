/* Hero Display Layout Engine v3.27 — the entire top-of-page composition.
 * Six individually art-directed themes, one resilient DOM contract.
 * Adds only decorative, aria-hidden elements: preserves portrait, headline,
 * intro video, GitHub explorer, nav actions and original Aurora landscape.
 * No network calls, authentication, telemetry or layout-animation loops.
 */
(() => {
 'use strict';
 if(window.PORTFOLIO_PREVIEW_MODE!==true||window.__wsHeroDisplay327)return;
 const hero=document.querySelector('main > .hero');
 const text=hero?.querySelector('.hero-text');
 const art=hero?.querySelector('.hero-art');
 const picker=document.getElementById('theme-select');
 if(!hero||!text||!art||!picker)return;
 const PROFILES=Object.freeze({
  'neon-studio':Object.freeze({layout:'neon',label:'DIGITAL ATELIER / 01',detail:'DESIGN × SYSTEMS',geometry:'glass split-stage'}),
  orbit:Object.freeze({layout:'orbit',label:'PORTFOLIO / ORBIT 01',detail:'PEOPLE ↔ SYSTEMS',geometry:'mission-control split'}),
  editorial:Object.freeze({layout:'editorial',label:'THE PROFILE / EDITION 01',detail:'IDEAS IN PRACTICE',geometry:'asymmetric print folio'}),
  terminal:Object.freeze({layout:'terminal',label:'~/portfolio $ overview',detail:'OPEN SOURCE / SYSTEMS',geometry:'console workstation'}),
  'aurora-peak':Object.freeze({layout:'alpine',label:'ALPINE / FIELD NOTES',detail:'PEOPLE · SYSTEMS · PURPOSE',geometry:'panoramic landscape'}),
  'design-2':Object.freeze({layout:'cosmic',label:'CONSTELLATION / PROFILE',detail:'EXPLORATION × CREATION',geometry:'cosmic observatory'})
 });
 const create=(tag,cls)=>{const el=document.createElement(tag);el.className=cls;return el};
 const stage=create('div','hd-stage');
 stage.setAttribute('aria-hidden','true');
 const haze=create('span','hd-haze'),grain=create('span','hd-grain');
 const trace=create('span','hd-trace'),frame=create('span','hd-art-frame');
 const edition=create('div','hd-edition');
 const index=create('span','hd-edition-index'),detail=create('span','hd-edition-detail');
 edition.append(index,detail);
 const ticks=create('span','hd-ticks'),marker=create('span','hd-marker');
 stage.append(haze,grain,trace,frame,ticks,marker,edition);
 hero.prepend(stage);
 hero.classList.add('hd-hero');
 let current='',variant='',density='standard',motion='still',visible=true,cleanup=false;
 const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
 const forced=window.matchMedia?.('(forced-colors: active)');
 const contrast=window.matchMedia?.('(prefers-contrast: more)');
 const narrow=window.matchMedia?.('(max-width: 600px)');
 const hardwareWeak=(Number(navigator.deviceMemory)>0&&Number(navigator.deviceMemory)<=2)||
  (Number(navigator.hardwareConcurrency)>0&&Number(navigator.hardwareConcurrency)<=2);
 const flags={
  isReduced:()=>Boolean(reduced?.matches||forced?.matches),
  isLowPower:()=>Boolean(navigator.connection?.saveData||hardwareWeak),
  isAtmosphereOff:()=>document.body.dataset.atmosphereTier==='off'
 };
 function sizeMode(){
  const width=hero.getBoundingClientRect().width;
  return width>0&&width<660?'compact':width>0&&width<930?'stacked':'wide';
 }
 function chooseTheme(){
  const id=document.body.dataset.theme;
  return Object.prototype.hasOwnProperty.call(PROFILES,id)?id:
    Object.prototype.hasOwnProperty.call(PROFILES,picker.value)?picker.value:'neon-studio';
 }
 function apply(){
  if(cleanup)return;
  const theme=chooseTheme(),profile=PROFILES[theme];
  const nextDensity=sizeMode();
  const allowMotion=!flags.isReduced()&&!flags.isLowPower()&&!flags.isAtmosphereOff()&&visible;
  const nextMotion=allowMotion?'ambient':'still';
  if(theme!==current){
   current=theme;variant=profile.layout;
   hero.dataset.hdLayout=variant;
   hero.dataset.hdTheme=theme;
   index.textContent=profile.label;
   detail.textContent=profile.detail;
   art.dataset.hdPortrait='original';
   // Do not alter the portrait's description or replace its source.
  }
  if(nextDensity!==density){density=nextDensity;hero.dataset.hdDensity=density}
  if(nextMotion!==motion){motion=nextMotion;hero.dataset.hdMotion=motion}
  hero.dataset.hdEngine='v3.27';
 }
 // Update after the existing theme controller has applied its body data-theme.
 const nextFrame=fn=>{
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(fn);
  else Promise.resolve().then(fn);
 };
 let pending=false;
 function schedule(){
  if(pending||cleanup)return;
  pending=true;
  nextFrame(()=>{pending=false;apply()});
 }
 const onPicker=()=>schedule();
 picker.addEventListener('change',onPicker);
 const bodyObserver=typeof MutationObserver==='function'?new MutationObserver(schedule):null;
 bodyObserver?.observe(document.body,{attributes:true,attributeFilter:['data-theme','data-atmosphere-tier']});
 const resize=typeof ResizeObserver==='function'?new ResizeObserver(schedule):null;
 resize?.observe(hero);
 const onVisibility=()=>{visible=document.visibilityState!=='hidden';schedule()};
 document.addEventListener('visibilitychange',onVisibility);
 for(const media of [reduced,forced,contrast,narrow])media?.addEventListener?.('change',schedule);
 navigator.connection?.addEventListener?.('change',schedule);
 const onAtmosphere=()=>schedule();
 window.addEventListener('ws-atmosphere-change',onAtmosphere);
 const onResize=()=>schedule();
 if(!resize)window.addEventListener('resize',onResize,{passive:true});
 if(typeof IntersectionObserver==='function'){
  new IntersectionObserver(entries=>{
   visible=Boolean(entries[0]?.isIntersecting)&&document.visibilityState!=='hidden';
   schedule();
  },{rootMargin:'80px 0px',threshold:0}).observe(hero);
 }
 apply();
 window.__wsHeroDisplay327=Object.freeze({
  getStatus:()=>Object.freeze({
   theme:current,composition:variant,density,motion,visible,
   modules:Object.freeze(['headline','introduction','actions','portrait','theme-scene','decorative-frame']),
   version:'3.27.0'
  }),
  refresh:apply,
  profiles:PROFILES
 });
})();
