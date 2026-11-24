/* Hero Display orbit geometry v3.40. Uses the real portrait and outer ring. */
(()=>{'use strict';
 const art=document.querySelector('main>.hero .hero-art');if(!art||window.__wsOrbit340)return;
 const circular=new Set(['orbit','terminal','neon-studio','design-2']);
 const angleSets={orbit:{a:-48,b:180,c:48},terminal:{a:-48,b:180,c:48},'neon-studio':{a:-50,b:-148,c:0,d:148,e:50},'design-2':{a:-68,b:9,c:145,d:57}};
 function point(cx,cy,r,angle){const t=angle*Math.PI/180;return {x:cx+r*Math.cos(t),y:cy+r*Math.sin(t)}}
 function layout(){
  const theme=document.body.dataset.theme||'orbit',chips=[...art.querySelectorAll('.ws-orbit-chip')];
  if(!circular.has(theme)){art.removeAttribute('data-orbit-geometry');return}
  const ring=art.querySelector(theme==='neon-studio'?'.ws-neon-precise-outer':'.orbit:not(.two)');
  if(!ring||!ring.getClientRects().length)return;
  art.setAttribute('data-orbit-geometry','circular');
  const ar=art.getBoundingClientRect(),rr=ring.getBoundingClientRect(),scale=ar.width/art.offsetWidth||1;
  const cx=(rr.left+rr.width/2-ar.left)/scale-art.clientLeft,cy=(rr.top+rr.height/2-ar.top)/scale-art.clientTop,r=ring.offsetWidth/2;
  if(!Number.isFinite(r)||r<=0)return;
  const bounds=art.clientWidth;
  for(const chip of chips){
   let angle=angleSets[theme][chip.dataset.pos];if(angle===undefined)continue;
   let p=point(cx,cy,r,angle);
   if((theme==='terminal'||theme==='orbit')&&Math.min(p.x,bounds-p.x)<42){angle=angle===180?150:angle<0?-65:65;p=point(cx,cy,r,angle)}
   const glyph=chip.querySelector('.ws-orbit-glyph');
   if(glyph)chip.style.setProperty('--orbit-glyph-size',glyph.offsetWidth+'px');
   let side=theme==='design-2'?'center':p.x<cx?'left':'right';
   if(theme==='neon-studio'&&glyph&&bounds<490)side='center';
   const available=side==='left'?p.x:bounds-p.x;
   if(side!=='center'&&available<65)side='center';
   chip.dataset.orbitDock=side;
   chip.style.setProperty('--orbit-dock-x',p.x+'px');chip.style.setProperty('--orbit-dock-y',p.y+'px');
   chip.style.setProperty('--orbit-dock-space',Math.max(40,available+2)+'px');
  }
  window.__wsOrbit340.last={theme,radius:r,anchors:chips.length};
 }
 let frame=0;function schedule(){if(frame)return;frame=requestAnimationFrame(()=>{frame=0;layout()})}
 window.__wsOrbit340={refresh:schedule,last:null};
 window.addEventListener('resize',schedule,{passive:true});window.addEventListener('ws-engine-theme-change',schedule);
 document.getElementById('theme-select')?.addEventListener('change',schedule);
 document.addEventListener('profile-language-change',schedule);
 new MutationObserver(schedule).observe(art,{childList:true});
 new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-theme','data-wsp-landing-fit']});
 if(window.ResizeObserver){const observer=new ResizeObserver(schedule);observer.observe(art);for(const ring of art.querySelectorAll('.orbit,.ws-neon-precise-outer'))observer.observe(ring)}
 document.fonts?.ready.then(schedule);schedule();
})();
