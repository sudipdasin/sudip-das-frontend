/* v3.53 — approved, local-only Hero profile renderer. One SVG, no extra RAF.
   Geometry from measured original portrait. Theme locks are enforced before DOM changes. */
((global)=>{'use strict';if(!global)return;
 const ids=Object.freeze({native:'Theme original',round:'Celestial Precision',rectangle:'Paper & Ink Atelier',hexagon:'Technical Blueprint',squircle:'Prismatic Glass',console:'Cyberpunk Console'});
 const defaults=Object.freeze({orbit:'round',editorial:'rectangle','design-2':'round',terminal:'console'});
 const locked=t=>t==='aurora-peak'||t==='neon-studio';
 const valid=id=>Object.hasOwn(ids,id);
 const effective=(theme,choice)=>locked(theme)?'native':valid(choice)&&(choice!=='console'||theme==='terminal')?choice:defaults[theme]||'native';
 const NS='http://www.w3.org/2000/svg',key='ws-hero-profiles-v353';
 function mount(ctx,art,schedule){
  const doc=ctx.document,root=ctx.root,lib=global.WebStudioHeroShapes352,core=art.querySelector('.core');
  if(!lib||!core)return null;
  let preferences={};try{const v=JSON.parse(global.localStorage?.getItem(key)||'{}');if(v&&typeof v==='object'){for(const t of Object.keys(defaults))if(valid(v[t]))preferences[t]=v[t];if(v.terminalConsoleV357!==true){preferences.terminal='console';preferences.terminalConsoleV357=true;global.localStorage?.setItem(key,JSON.stringify(preferences))}else preferences.terminalConsoleV357=true}}catch{}
  let svg=null,signature='',profile='native',theme='',geometry=null,visible=true,active=true;
  const old=art.getAttribute('data-hero-profile'),oldClip=core.style.getPropertyValue('--hp-clip');
  const oldMotion=art.getAttribute('data-hero-motion'),oldAtmos=art.getAttribute('data-hero-atmosphere');
  const restore=(el,k,v)=>v===null?el.removeAttribute(k):el.setAttribute(k,v);
  const node=(tag,cls)=>{const n=doc.createElement(tag);if(cls)n.className=cls;return n};
  const elem=(tag,attrs)=>{const n=doc.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))n.setAttribute(k,String(v));return n};
  const control=node('label','hp-profile-control'),title=node('span'),select=node('select');
  const labels={en:['Hero design','Theme original'],hi:['मुख्य डिज़ाइन','मूल थीम'],bn:['প্রধান ডিজাইন','মূল থিম'],es:['Diseño principal','Tema original'],fr:['Design principal','Thème original'],de:['Hauptdesign','Originaldesign'],pt:['Design principal','Tema original'],ar:['تصميم الواجهة','التصميم الأصلي'],'zh-CN':['主视觉设计','原始主题'],ja:['メインデザイン','元のテーマ']};
  function localize(){const lang=ctx.locale||doc.documentElement.lang||'en',t=labels[lang]||labels[lang.split('-')[0]]||labels.en;title.textContent=t[0];select.setAttribute('aria-label',t[0]);const first=select.options?.[0]||select.children?.[0];if(first)first.textContent=t[1]}
  title.textContent='Hero design';select.setAttribute('aria-label','Hero design profile');
  for(const [id,label] of Object.entries(ids)){const option=node('option');option.value=id;option.textContent=label;select.append(option)}
  control.append(title,select);localize();
  ctx.listen(doc,'profile-language-change',localize);
  const panel=doc.querySelector('.ws-atmo-menu')||doc.getElementById('pv-hub-panel-tools');
  if(panel)panel.append(control);
  const getTheme=()=>ctx.bridge?root.dataset.theme||ctx.theme:ctx.theme;
  const getPolicy=()=>global.__wsAtmosphere328?.getShapeMotionPolicy?.()||lib.motionPolicy({quality:root.dataset.atmosphereTier||root.dataset.wspAtmoEffect||'off',reduced:!!global.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches,saveData:!!global.navigator?.connection?.saveData,visible:doc.visibilityState!=='hidden'});
  function motion(){if(profile==='native')return;const p=getPolicy();art.setAttribute('data-hero-motion',p.animated&&visible&&doc.visibilityState!=='hidden'?'running':'static');art.setAttribute('data-hero-atmosphere',p.quality==='off'?'off':p.quality);}
  function clear(){svg?.remove();svg=null;geometry=null;signature='';restore(art,'data-hero-profile',old);restore(art,'data-hero-motion',oldMotion);restore(art,'data-hero-atmosphere',oldAtmos);if(oldClip)core.style.setProperty('--hp-clip',oldClip);else core.style.removeProperty('--hp-clip')}
  function choose(id){const t=getTheme();if(!valid(id)||locked(t)||!active||(id==='console'&&t!=='terminal'))return false;preferences[t]=id;try{global.localStorage?.setItem(key,JSON.stringify(preferences))}catch{}schedule();return true}
  ctx.listen(select,'change',()=>choose(select.value));
  ctx.listen(global,'ws-atmosphere-change',motion);ctx.listen(doc,'visibilitychange',motion);
  ctx.listen(global.matchMedia?.('(prefers-reduced-motion: reduce)'),'change',motion);
  ctx.listen(global.navigator?.connection,'change',motion);
  let io=null;if(global.IntersectionObserver){io=new global.IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting!==false;motion()});io.observe(art)}
  function render(){
   if(!active)return null;const t=getTheme(),next=effective(t,preferences[t]);
   control.hidden=locked(t);const consoleOption=[...(select.options||select.children)].find(o=>o.value==='console');if(consoleOption){consoleOption.hidden=t!=='terminal';consoleOption.disabled=t!=='terminal'}select.value=next;localize();
   if(next==='native'){if(profile!=='native')clear();profile='native';theme=t;return null}
   if(next!==profile||t!==theme){clear();profile=next;theme=t;art.setAttribute('data-hero-profile',next)}
   motion();
   const ar=art.getBoundingClientRect(),cr=core.getBoundingClientRect(),sx=ar.width/art.offsetWidth,sy=ar.height/art.offsetHeight;
   if(![sx,sy,core.offsetWidth,core.offsetHeight].every(v=>Number.isFinite(v)&&v>0))return null;
   const w=core.offsetWidth,h=core.offsetHeight,cx=(cr.left+cr.width/2-ar.left)/sx-art.clientLeft,cy=(cr.top+cr.height/2-ar.top)/sy-art.clientTop;
   const margin=Math.max(4,Math.min(24,cx-w/2-4,art.clientWidth-cx-w/2-4,cy-h/2-4,art.clientHeight-cy-h/2-4));
   const gap=margin/3,ow=w+margin*2,oh=h+margin*2;
   const sig=[next,w,h,cx,cy,margin,art.clientWidth,art.clientHeight].map(v=>typeof v==='number'?v.toFixed(2):v).join(':');
   if(sig===signature&&svg?.isConnected)return geometry;
   signature=sig;svg?.remove();
   svg=elem('svg',{class:'hp-geometry','aria-hidden':'true',focusable:'false',viewBox:'0 0 '+art.clientWidth+' '+art.clientHeight});
   const g=elem('g',{transform:'translate('+(cx-ow/2)+' '+(cy-oh/2)+')'});
   const frameShape=next==='console'?'hexagon':next;
   const contours=lib.contours(frameShape,ow,oh,4,gap);
   const toLocal=p=>({x:p.x+cx-ow/2,y:p.y+cy-oh/2});
   // All outlines, stationary nodes and moving stroke use the same path family.
   contours.forEach((c,i)=>g.append(elem('path',{d:c.path,class:'hp-ring hp-ring-'+i,'vector-effect':'non-scaling-stroke'})));
   const outer=contours[0],track=contours[1];
   g.append(elem('path',{d:track.path,class:'hp-travel',pathLength:100,'vector-effect':'non-scaling-stroke'}));
   const vertexPoints=next==='console'?outer.path.match(/(?:M|L) [-\d.]+ [-\d.]+/g).map(v=>{const [,x,y]=v.split(' ');return {x:Number(x),y:Number(y)}}):null;
   for(let i=0;i<(frameShape==='hexagon'?6:8);i++){const p=vertexPoints?vertexPoints[i]:outer.pointAt(i/(frameShape==='hexagon'?6:8));g.append(elem('circle',{cx:p.x,cy:p.y,r:i%2===0?2.8:1.8,class:'hp-node hp-node-'+(i%4)}))}
   if(next==='console')g.append(elem('path',{d:track.path,class:'hp-console-pulses',pathLength:100,'vector-effect':'non-scaling-stroke'}));
   svg.append(g);
   let dock=outer,anchor=i=>toLocal(outer.pointAt(i)),hudRadius=0;
   if(next==='console'){
    // Match approved HUD reference: hexagonal portrait frames surrounded by
    // separate true circular tracks, with satellites on the outermost track.
    hudRadius=Math.max(0,Math.min(cx-14,art.clientWidth-cx-14,cy-12,art.clientHeight-cy-46,Math.max(w,h)*.72));
    if(hudRadius>Math.max(w,h)*.50){
     const hud=elem('g',{class:'hp-console-hud',transform:'translate('+cx+' '+cy+')'});
     for(const [scale,cls] of [[1,'hp-hud-outer'],[.925,'hp-hud-mid'],[.86,'hp-hud-inner']]){
      hud.append(elem('circle',{cx:0,cy:0,r:hudRadius*scale,class:cls,pathLength:100,'vector-effect':'non-scaling-stroke'}));
     }
     for(let i=0;i<12;i++){const p=lib.circlePoint(0,0,hudRadius,i*30-90);
      hud.append(elem('circle',{cx:p.x,cy:p.y,r:i%3===0?3.3:1.7,class:'hp-hud-dot hp-node hp-node-'+(i%4)}))}
     hud.append(elem('circle',{cx:0,cy:0,r:hudRadius*.925,class:'hp-hud-energy',pathLength:100,'vector-effect':'non-scaling-stroke'}));
     svg.prepend(hud);
     dock=lib.geometry('round',hudRadius*2,hudRadius*2,0);
     anchor=i=>{const p=dock.pointAt(i);return {x:p.x+cx-hudRadius,y:p.y+cy-hudRadius}};
    }
   }
   art.prepend(svg);
   if(next==='hexagon'||next==='squircle'||next==='console'){
    const clip=lib.geometry(frameShape,w,h,0).path.match(/(?:M|L) [-\d.]+ [-\d.]+/g).map(p=>{const [,x,y]=p.split(' ');return (100*Number(x)/w).toFixed(3)+'% '+(100*Number(y)/h).toFixed(3)+'%'}).join(',');
    core.style.setProperty('--hp-clip','polygon('+clip+')');
   }else core.style.removeProperty('--hp-clip');
   geometry={profile:next,frameShape,cx,cy,outer:dock,anchor,width:w,height:h,margin,hudRadius};
   return geometry;
  }
  function status(){return Object.freeze({profile,theme,available:Object.keys(ids),locked:locked(getTheme()),motion:art.getAttribute('data-hero-motion')||'static',outlineCount:svg?4:0})}
  ctx.onCleanup(()=>{active=false;io?.disconnect();clear();control.remove()});
  return Object.freeze({render,choose,status});
 }
 global.WebStudioHeroProfiles353=Object.freeze({version:'3.58.0',ids,effective,locked,mount});
})(typeof window!=='undefined'?window:undefined);
