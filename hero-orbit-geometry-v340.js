/* Hero Orbit Geometry v3.42 — managed Hero Display plugin.
 * Public DOM only. Owns docking attributes/variables, never the portrait source.
 * Native circular crop corrections remain baseline theme styles. */
((global)=>{'use strict';if(!global)return;
 const shapeLibrary=()=>global.WebStudioHeroShapes352;
 const circular=new Set(['orbit','terminal','neon-studio','design-2']);
 const angleSets={orbit:{a:-48,b:180,c:48},terminal:{a:-48,b:180,c:48},'neon-studio':{a:-50,b:-148,c:0,d:148,e:50},'design-2':{a:-68,b:9,c:145,d:57}};
 const names={en:'Hero Orbit Geometry',hi:'मुख्य कक्षा ज्यामिति',bn:'প্রধান কক্ষপথ জ্যামিতি',es:'Geometría orbital principal',fr:'Géométrie orbitale principale',de:'Orbitgeometrie der Hauptansicht',pt:'Geometria orbital principal',ar:'هندسة المدار الرئيسي','zh-CN':'主视觉轨道几何',ja:'メイン軌道ジオメトリ'};
 const keys=['--orbit-dock-x','--orbit-dock-y','--orbit-dock-space','--orbit-glyph-size'];
 function point(cx,cy,r,angle){const lib=shapeLibrary();if(lib)return lib.circlePoint(cx,cy,r,angle);const t=angle*Math.PI/180;return {x:cx+r*Math.cos(t),y:cy+r*Math.sin(t)}}
 const plugin={id:'hero-orbit-geometry',version:'3.53.0',priority:10,dependsOn:['hero'],
 supports:({root})=>Boolean(root.querySelector('main>.hero .hero-art')),
 mount(ctx){
  const doc=ctx.document,art=ctx.select('main>.hero .hero-art'),root=ctx.root;
  const oldMarker=art.getAttribute('data-orbit-geometry'),owned=new Map();
  let active=true,frame=null,last={theme:ctx.theme,mode:'pending',radius:0,anchors:0},observed=new Set();
  const restoreAttr=(el,k,v)=>{if(v===null)el.removeAttribute(k);else el.setAttribute(k,v)};
  function release(chip,prior){
   restoreAttr(chip,'data-orbit-dock',prior.dock);
   for(const [key,value,priority] of prior.css){if(value)chip.style.setProperty(key,value,priority);else chip.style.removeProperty(key)}
   owned.delete(chip);
  }
  function clear(){for(const [chip,prior] of owned)release(chip,prior);restoreAttr(art,'data-orbit-geometry',oldMarker)}
  function own(chip){if(!owned.has(chip))owned.set(chip,{dock:chip.getAttribute('data-orbit-dock'),css:keys.map(k=>[k,chip.style.getPropertyValue(k),chip.style.getPropertyPriority(k)])})}
  const profileRenderer=global.WebStudioHeroProfiles353?.mount(ctx,art,schedule);
  function layout(){
   if(!active)return;
   const theme=ctx.bridge?root.dataset.theme||ctx.theme:ctx.theme;
   const chips=[...art.querySelectorAll('.ws-orbit-chip')];
   for(const [chip,prior] of owned)if(!chips.includes(chip))release(chip,prior);
   const shape=profileRenderer?.render();
   if(shape){
    art.setAttribute('data-orbit-geometry','profile');let anchors=0;
    const angles=angleSets[theme]||{a:-145,b:-35,c:145,d:35,e:90};
    for(const chip of chips){
     const angle=angles[chip.dataset.pos]??(anchors*360/Math.max(1,chips.length)-90),r=angle*Math.PI/180;
     let best=null,error=Infinity;
     for(let i=0;i<256;i++){const p=shape.anchor(i/256),a=Math.atan2(p.y-shape.cy,p.x-shape.cx);const d=1-Math.cos(a-r);if(d<error){error=d;best=p}}
     if(!best)continue;own(chip);
     const available=best.x<shape.cx?best.x:art.clientWidth-best.x;
     const side=available<66?'center':best.x<shape.cx?'left':'right';
     chip.setAttribute('data-orbit-dock',side);
     chip.style.setProperty('--orbit-dock-x',best.x+'px');chip.style.setProperty('--orbit-dock-y',best.y+'px');chip.style.setProperty('--orbit-dock-space',Math.max(40,available-4)+'px');anchors++;
    }
    last={theme,mode:'profile',shape:shape.profile,radius:shape.profile==='round'?Math.min(shape.outer.width,shape.outer.height)/2:0,anchors,outlineCount:4};return;
   }
   if(!circular.has(theme)){clear();last={theme,mode:'native',radius:0,anchors:0};return}
   const ring=art.querySelector(theme==='neon-studio'?'.ws-neon-precise-outer':'.orbit:not(.two)');
   if(!ring||!ring.getClientRects().length){clear();last={theme,mode:'waiting-for-ring',radius:0,anchors:0};return}
   const ar=art.getBoundingClientRect(),rr=ring.getBoundingClientRect(),sx=ar.width/art.offsetWidth,sy=ar.height/art.offsetHeight;
   const r=ring.offsetWidth/2;
   if(![sx,sy,r].every(v=>Number.isFinite(v)&&v>0)){clear();last={theme,mode:'waiting-for-geometry',radius:0,anchors:0};return}
   const cx=(rr.left+rr.width/2-ar.left)/sx-art.clientLeft,cy=(rr.top+rr.height/2-ar.top)/sy-art.clientTop,bounds=art.clientWidth;
   art.setAttribute('data-orbit-geometry','circular');let anchors=0,maxError=0;
   for(const chip of chips){
    let angle=angleSets[theme][chip.dataset.pos];if(angle===undefined){if(owned.has(chip))release(chip,owned.get(chip));continue}
    let p=point(cx,cy,r,angle);
    if((theme==='terminal'||theme==='orbit')&&Math.min(p.x,bounds-p.x)<42){angle=angle===180?150:angle<0?-65:65;p=point(cx,cy,r,angle)}
    own(chip);
    const glyph=chip.querySelector('.ws-orbit-glyph');
    if(glyph&&glyph.offsetWidth>0)chip.style.setProperty('--orbit-glyph-size',glyph.offsetWidth+'px');
    let side=theme==='design-2'?'center':p.x<cx?'left':'right';
    if(theme==='neon-studio'&&glyph&&bounds<490)side='center';
    const available=side==='left'?p.x:bounds-p.x;
    if(side!=='center'&&available<65)side='center';
    chip.setAttribute('data-orbit-dock',side);
    chip.style.setProperty('--orbit-dock-x',p.x+'px');chip.style.setProperty('--orbit-dock-y',p.y+'px');
    chip.style.setProperty('--orbit-dock-space',Math.max(40,available+2)+'px');
    anchors++;maxError=Math.max(maxError,Math.abs(Math.hypot(p.x-cx,p.y-cy)-r));
   }
   last={theme,mode:'circular',radius:r,anchors,expectedAnchors:Object.keys(angleSets[theme]).length,coordinateErrorPx:maxError};
  }
  function schedule(){if(!active||frame!==null)return;frame=global.requestAnimationFrame(()=>{frame=null;layout()})}
  const ro=global.ResizeObserver?new global.ResizeObserver(schedule):null;
  function observeRings(){if(!ro)return;const next=new Set([art,...art.querySelectorAll('.orbit,.ws-neon-precise-outer')]);for(const el of observed)if(!next.has(el))ro.unobserve(el);for(const el of next)if(!observed.has(el))ro.observe(el);observed=next}
  ctx.onCleanup(()=>{active=false;if(frame!==null)global.cancelAnimationFrame(frame);frame=null;ro?.disconnect();observed.clear();clear()});
  if(global.MutationObserver){
   const mo=new global.MutationObserver(()=>{observeRings();schedule()});mo.observe(art,{childList:true,subtree:true,characterData:true});mo.observe(root,{attributes:true,attributeFilter:['data-theme','data-wsp-landing-fit']});ctx.onCleanup(()=>mo.disconnect());
  }
  observeRings();
  ctx.listen(global,'resize',schedule,{passive:true});ctx.listen(global,'ws-engine-theme-change',schedule);
  ctx.listen(doc.getElementById('theme-select'),'change',schedule);ctx.listen(doc,'profile-language-change',schedule);
  if(doc.fonts?.ready)doc.fonts.ready.then(schedule,()=>{});
  function shapeStatus(){const theme=ctx.bridge?root.dataset.theme||ctx.theme:ctx.theme,lib=shapeLibrary();return {shapeProfile:(()=>{const base=lib?.profileFor(theme),id=profileRenderer?.status()?.profile;return base&&!base.locked&&id&&lib?.profiles[id]?{...lib.profiles[id],theme,locked:false,visualActivation:'approved'}:base||null})(),availableShapes:Object.keys(lib?.profiles||{}),visualActivation:profileRenderer?.status()?.profile==='native'?'native':'approved',selectedProfile:profileRenderer?.status()||null}}
  const api=Object.freeze({refresh:schedule,setProfile:id=>profileRenderer?.choose(id)||false,getProfile:()=>profileRenderer?.status()||null,shapeStatus,geometry:(...args)=>shapeLibrary()?.geometry(...args),contours:(...args)=>shapeLibrary()?.contours(...args),motionPolicy:(args)=>shapeLibrary()?.motionPolicy(args),measure:()=>{layout();return Object.freeze({...last})},getStatus:()=>Object.freeze({...last,active,...shapeStatus(),name:names[ctx.locale]||names.en,version:'3.53.0'})});
  // Preserve the diagnostic entry point without retaining a second layout engine.
  const prior=global.__wsOrbit340;
  const adapter=Object.freeze({refresh:schedule,get last(){return api.getStatus()}});
  global.__wsOrbit340=adapter;ctx.onCleanup(()=>{if(global.__wsOrbit340===adapter){if(prior===undefined)delete global.__wsOrbit340;else global.__wsOrbit340=prior}});
  layout();schedule();return {update:schedule,api};
 }};
 (global.WebStudioPlugins331||(global.WebStudioPlugins331=Object.create(null)))['hero-orbit-geometry']=Object.freeze(plugin);
 // Single-instance compatibility path for the older private portfolio.
 if(!global.WebStudioPluginEngine331&&global.document?.body&&!global.__wsOrbit340){
  const doc=global.document,root=doc.body,cleanups=[];
  const ctx={document:doc,root,bridge:true,get theme(){return root.dataset.theme||'orbit'},get locale(){return global.profileI18n?.locale||doc.documentElement.lang||'en'},select:s=>root.querySelector(s),onCleanup:fn=>cleanups.push(fn),listen:(node,event,fn,opts)=>{if(!node?.addEventListener)return;node.addEventListener(event,fn,opts);cleanups.push(()=>node.removeEventListener(event,fn,opts))}};
  if(plugin.supports(ctx)){try{const instance=plugin.mount(ctx);global.__wsHeroOrbitGeometry=Object.freeze({...instance.api,stop:()=>{for(const fn of cleanups.splice(0).reverse())fn();delete global.__wsHeroOrbitGeometry}})}catch(error){for(const fn of cleanups.splice(0).reverse())fn();throw error}}
 }
})(typeof window!=='undefined'?window:undefined);
