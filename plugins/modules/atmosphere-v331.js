/* Atmosphere plugin v3.31 — CSS-only portable fallback / native renderer bridge.
 * No GPU allocation in generic sites; never claims ray tracing.
 */
((global)=>{
 'use strict';if(!global)return;
 const modes=['auto','cinematic','balanced','eco','off'];
 const labels={
  en:['Atmosphere','Auto','Cinematic','Balanced','Eco','Off','Efficient CSS lighting'],
  hi:['वातावरण','स्वतः','सिनेमाई','संतुलित','इको','बंद','कुशल CSS प्रकाश'],
  bn:['আবহ','স্বয়ংক্রিয়','সিনেমাটিক','ভারসাম্যপূর্ণ','সাশ্রয়ী','বন্ধ','দক্ষ CSS আলো'],
  es:['Atmósfera','Automático','Cinemático','Equilibrado','Eco','Desactivado','Luz CSS eficiente'],
  fr:['Atmosphère','Auto','Cinématique','Équilibré','Éco','Désactivé','Éclairage CSS optimisé'],
  de:['Atmosphäre','Automatisch','Filmisch','Ausgewogen','Sparsam','Aus','Effiziente CSS-Beleuchtung'],
  pt:['Atmosfera','Automático','Cinemático','Equilibrado','Eco','Desligado','Iluminação CSS eficiente'],
  ar:['الأجواء','تلقائي','سينمائي','متوازن','اقتصادي','إيقاف','إضاءة CSS موفرة'],
  'zh-CN':['氛围','自动','电影级','平衡','节能','关闭','高效 CSS 光效'],
  ja:['雰囲気','自動','シネマ','バランス','省電力','オフ','軽量CSSライティング']
 };
 const plugin={
  id:'atmosphere',version:'3.31.0',priority:0,
  mount(ctx){
   const native=Boolean(ctx.bridge&&global.__wsAtmosphere328?.getStatus);
   const root=ctx.root,doc=ctx.document;
   const old=root.getAttribute('data-wsp-atmo-effect');
   let control=null,select=null,label=null,hint=null,layer=null;
   if(!native){
    layer=doc.createElement('div');layer.className='wsp-atmosphere-layer';
    layer.setAttribute('aria-hidden','true');
    root.prepend(layer);
    control=doc.createElement('div');control.className='wsp-plugin-panel wsp-atmosphere-tools';
    control.setAttribute('data-wsp-ui','atmosphere');
    label=doc.createElement('label');label.htmlFor=ctx.uid+'-quality';
    select=doc.createElement('select');select.id=label.htmlFor;
    select.setAttribute('aria-label','Atmosphere quality');
    for(const id of modes){const o=doc.createElement('option');o.value=id;select.append(o)}
    hint=doc.createElement('p');hint.className='wsp-help';
    control.append(label,select,hint);
    (ctx.slots.atmosphere||ctx.slots.tools||root).append(control);
    ctx.listen(select,'change',()=>ctx.host.setQuality(select.value));
    ctx.onCleanup(()=>{control.remove();layer.remove()});
   }else{
    const current=global.__wsAtmosphere328.getStatus()?.mode;
    if(modes.includes(current)&&current!==ctx.host.getStatus().quality)
     ctx.host.setQuality(current);
    const sync=()=>{
     const source=global.__wsAtmosphere328?.getStatus?.()?.mode;
     if(modes.includes(source)&&source!==ctx.host.getStatus().quality)ctx.host.setQuality(source);
    };
    ctx.listen(global,'ws-atmosphere-change',sync);
   }
   function status(){
    if(native){
     const info=global.__wsAtmosphere328?.getStatus?.()||{};
     return {bridge:true,quality:info.mode||'auto',effective:info.effective||'off',
      renderer:info.renderer||'off',regionCount:info.regionCount||0};
    }
    const mode=ctx.host.getStatus().quality;
    const reduced=global.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const saveData=Boolean(global.navigator?.connection?.saveData);
    const effective=mode==='off'?'off':reduced||saveData?'eco':mode==='auto'?'balanced':
      mode==='cinematic'?'balanced':mode;
    return {bridge:false,quality:mode,effective,
     renderer:effective==='off'?'off':'css',fallback:mode==='cinematic'};
   }
   function render(){
    const info=status();
    if(native){
     const desired=ctx.host.getStatus().quality;
     if(modes.includes(desired)&&global.__wsAtmosphere328?.getStatus?.()?.mode!==desired)
      global.__wsAtmosphere328?.setMode?.(desired);
     return;
    }
    root.setAttribute('data-wsp-atmo-effect',info.effective);
    if(select)select.value=ctx.host.getStatus().quality;
    const t=labels[ctx.host.getStatus().locale]||labels.en;
    if(label)label.textContent=t[0];
    if(hint)hint.textContent=t[6]+(info.fallback?' · CSS fallback':'');
    [...(select?.options||[])].forEach((o,i)=>o.textContent=t[i+1]);
   }
   ctx.listen(global.matchMedia?.('(prefers-reduced-motion: reduce)'),'change',render);
   ctx.listen(global.navigator?.connection,'change',render);
   ctx.onCleanup(()=>{
    if(old===null)root.removeAttribute('data-wsp-atmo-effect');
    else root.setAttribute('data-wsp-atmo-effect',old);
   });
   render();
   return {api:Object.freeze({setMode:m=>ctx.host.setQuality(m),getStatus:status}),update:render};
  }
 };
 (global.WebStudioPlugins331||(global.WebStudioPlugins331=Object.create(null))).atmosphere=Object.freeze(plugin);
})(typeof window!=='undefined'?window:undefined);
