/* Hero Display plugin v3.31 — responsive, reversible, no native portrait overrides. */
((global)=>{
 'use strict';
 if(!global)return;
 const localeText={
  en:['Presentation','Responsive hero'],
  hi:['प्रस्तुति','अनुकूलनशील मुख्य भाग'],
  bn:['উপস্থাপনা','প্রতিক্রিয়াশীল পরিচিতি'],
  es:['Presentación','Portada adaptable'],
  fr:['Présentation','En-tête adaptatif'],
  de:['Darstellung','Responsiver Kopfbereich'],
  pt:['Apresentação','Destaque responsivo'],
  ar:['العرض','واجهة رئيسية متجاوبة'],
  'zh-CN':['展示','响应式主视觉'],
  ja:['表示','レスポンシブなメイン表示']
 };
 const layout={
  orbit:'orbital',editorial:'folio',terminal:'console','aurora-peak':'alpine',
  'neon-studio':'atelier','design-2':'observatory'
 };
 const plugin={
  id:'hero',version:'3.31.0',priority:-10,
  supports({root,bridge}){
   return bridge||Boolean(root.querySelector('[data-wsp-hero],.hero,header'));
  },
  mount(ctx){
   const target=ctx.slots.hero||ctx.select('[data-wsp-hero],.hero,header');
   if(!target)return {api:{measure:()=>null}};
   const native=Boolean(ctx.bridge&&global.__wsHeroDisplay327?.getStatus);
   const original={layout:target.getAttribute('data-wsp-hero-layout'),density:target.getAttribute('data-wsp-hero-density')};
   let badge=null,label=null,detail=null,lastDensity='';
   if(!native){
    target.classList.add('wsp-hero-stage');
    badge=ctx.document.createElement('div');badge.className='wsp-hero-badge';
    badge.setAttribute('role','note');
    label=ctx.document.createElement('strong');
    detail=ctx.document.createElement('small');
    badge.append(label,detail);
    const heading=target.querySelector('h1,h2');
    if(heading)heading.before(badge);else target.prepend(badge);
    ctx.onCleanup(()=>{
     badge.remove();target.classList.remove('wsp-hero-stage');
     for(const [attr,old] of [['data-wsp-hero-layout',original.layout],['data-wsp-hero-density',original.density]]){
      if(old===null)target.removeAttribute(attr);else target.setAttribute(attr,old);
     }
    });
   }
   const bounds=node=>{
    const rect=node?.getBoundingClientRect?.();
    return {width:Math.round(rect?.width||0),height:Math.round(rect?.height||0),
     visible:Boolean(rect&&rect.width>5&&rect.height>5)};
   };
   const measure=()=>{
    if(native&&global.__wsHeroDisplay327?.measure)return global.__wsHeroDisplay327.measure();
    return {
     title:bounds(target.querySelector('h1,h2')),
     portrait:bounds(target.querySelector('img,[data-wsp-portrait]')),
     width:Math.round(target.getBoundingClientRect?.().width||0),
     layout:layout[ctx.host.getStatus().theme],density:lastDensity,
     horizontalOverflow:ctx.document.documentElement.scrollWidth>ctx.document.documentElement.clientWidth+3
    };
   };
   let queued=false;
   function render(){
    queued=false;
    if(native)return;
    const width=target.getBoundingClientRect?.().width||0;
    lastDensity=width&&width<580?'compact':width&&width<920?'stacked':'wide';
    target.setAttribute('data-wsp-hero-layout',layout[ctx.host.getStatus().theme]||'orbital');
    target.setAttribute('data-wsp-hero-density',lastDensity);
    const strings=localeText[ctx.host.getStatus().locale]||localeText.en;
    if(label)label.textContent=strings[0];
    if(detail)detail.textContent=strings[1];
   }
   const schedule=()=>{
    if(queued)return;queued=true;
    (global.requestAnimationFrame||((f)=>Promise.resolve().then(f)))(render);
   };
   if(!native){
    if(typeof ResizeObserver==='function'){
     const ro=new ResizeObserver(schedule);ro.observe(target);ctx.onCleanup(()=>ro.disconnect());
    }else ctx.listen(global,'resize',schedule,{passive:true});
   }
   render();
   return {api:Object.freeze({measure,getStatus:()=>({
    bridge:native,layout:layout[ctx.host.getStatus().theme],density:lastDensity
   })}),update:schedule};
  }
 };
 (global.WebStudioPlugins331||(global.WebStudioPlugins331=Object.create(null))).hero=Object.freeze(plugin);
})(typeof window!=='undefined'?window:undefined);
