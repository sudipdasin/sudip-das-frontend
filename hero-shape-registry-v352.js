/* v3.52 shared geometry and atmosphere contracts. Pure data/math; no DOM,
   renderer allocation, network, mutation or automatic visual activation. */
((global)=>{'use strict';if(!global)return;
 const TAU=2*Math.PI,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const profiles=Object.freeze(Object.fromEntries(Object.entries({
  round:{shape:'round',atmosphere:'orbital-light',motion:'orbit',rings:3,period:32},
  rectangle:{shape:'rectangle',atmosphere:'paper-ink',motion:'edge-drift',rings:3,period:48},
  arch:{shape:'arch',atmosphere:'alpine-aurora',motion:'curtain',rings:4,period:42},
  capsule:{shape:'capsule',atmosphere:'soft-bloom',motion:'edge-drift',rings:2,period:44},
  hexagon:{shape:'hexagon',atmosphere:'blueprint',motion:'node-trace',rings:3,period:36},
  diamond:{shape:'diamond',atmosphere:'prism-light',motion:'node-trace',rings:3,period:40},
  squircle:{shape:'squircle',atmosphere:'glass-haze',motion:'edge-drift',rings:3,period:40}
 }).map(([id,p])=>[id,Object.freeze(p)])));
 const themeMap=Object.freeze({orbit:'round',editorial:'rectangle',terminal:'round','aurora-peak':'arch','neon-studio':'round','design-2':'round'});
 const locked=new Set(['aurora-peak','neon-studio']);
 const num=(v)=>typeof v==='number'&&Number.isFinite(v);
 function circlePoint(cx,cy,r,angle){const t=angle*Math.PI/180;return {x:cx+r*Math.cos(t),y:cy+r*Math.sin(t)}}
 function geometry(id,width,height,inset=0){
  if(!Object.hasOwn(profiles,id)||![width,height,inset].every(num)||width<=0||height<=0||inset<0||inset*2>=Math.min(width,height))throw new RangeError('Invalid shape dimensions');
  const cx=width/2,cy=height/2,rx=width/2-inset,ry=height/2-inset,points=[];
  const add=(x,y)=>points.push(Object.freeze({x,y}));
  const arc=(x,y,a,b,from,to,n=20)=>{for(let i=0;i<=n;i++){const t=from+(to-from)*i/n;add(x+a*Math.cos(t),y+b*Math.sin(t))}};
  if(id==='round'){const r=Math.min(rx,ry);arc(cx,cy,r,r,-Math.PI/2,3*Math.PI/2,128)}
  else if(id==='rectangle'||id==='capsule'){
   const r=id==='capsule'?Math.min(rx,ry):Math.min(14,rx*.22,ry*.22);
   arc(cx+rx-r,cy-ry+r,r,r,-Math.PI/2,0);arc(cx+rx-r,cy+ry-r,r,r,0,Math.PI/2);
   arc(cx-rx+r,cy+ry-r,r,r,Math.PI/2,Math.PI);arc(cx-rx+r,cy-ry+r,r,r,Math.PI,3*Math.PI/2);
  }else if(id==='arch'){
   const crown=Math.min(ry*1.2,rx*1.25),top=cy-ry,bottom=cy+ry,r=Math.min(rx*.14,ry*.12);
   arc(cx,top+crown,rx,crown,Math.PI,TAU,48);
   arc(cx+rx-r,bottom-r,r,r,0,Math.PI/2);arc(cx-rx+r,bottom-r,r,r,Math.PI/2,Math.PI);
  }else if(id==='hexagon'){
   for(let i=0;i<6;i++){const t=-Math.PI/2+i*TAU/6;add(cx+rx*Math.cos(t),cy+ry*Math.sin(t))}
  }else if(id==='diamond'){add(cx,cy-ry);add(cx+rx,cy);add(cx,cy+ry);add(cx-rx,cy)}
  else {for(let i=0;i<128;i++){const t=-Math.PI/2+i*TAU/128,c=Math.cos(t),s=Math.sin(t);add(cx+rx*Math.sign(c)*Math.sqrt(Math.abs(c)),cy+ry*Math.sign(s)*Math.sqrt(Math.abs(s)))}}
  const lengths=[0];for(let i=0;i<points.length;i++){const a=points[i],b=points[(i+1)%points.length];lengths.push(lengths[i]+Math.hypot(b.x-a.x,b.y-a.y))}
  const perimeter=lengths.at(-1),fmt=v=>Number(v.toFixed(3));
  function pointAt(progress){if(!num(progress))throw new TypeError('Invalid progress');const t=((progress%1)+1)%1;
   if(id==='round'){const p=circlePoint(cx,cy,Math.min(rx,ry),t*360-90);return Object.freeze(p)}
   const d=t*perimeter;let i=0;while(i<points.length-1&&lengths[i+1]<=d)i++;const a=points[i],b=points[(i+1)%points.length],span=lengths[i+1]-lengths[i],u=span?(d-lengths[i])/span:0;return Object.freeze({x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u})}
  const path=id==='round'?(()=>{const r=Math.min(rx,ry);return 'M '+fmt(cx)+' '+fmt(cy-r)+' A '+fmt(r)+' '+fmt(r)+' 0 1 1 '+fmt(cx)+' '+fmt(cy+r)+' A '+fmt(r)+' '+fmt(r)+' 0 1 1 '+fmt(cx)+' '+fmt(cy-r)+' Z'})():points.map((p,i)=>(i?'L ':'M ')+fmt(p.x)+' '+fmt(p.y)).join(' ')+' Z';
  return Object.freeze({id,cx,cy,width,height,inset,perimeter,path,pointAt});
 }
 function contours(id,w,h,count=3,gap=8){
  if(!Number.isInteger(count)||count<1||count>8||!num(gap)||gap<0)throw new RangeError('Invalid contours');
  return Object.freeze(Array.from({length:count},(_,i)=>geometry(id,w,h,i*gap)));
 }
 function motionPolicy({quality='off',visible=true,reduced=false,saveData=false,lowPower=false,forced=false}={}){
  const animated=visible&&!reduced&&!saveData&&!lowPower&&!forced&&['cinematic','balanced'].includes(quality);
  return Object.freeze({animated,quality,frameRate:animated?(quality==='cinematic'?30:18):0,particleBudget:animated?(quality==='cinematic'?24:10):0});
 }
 function profileFor(theme){const id=themeMap[theme]||'round';return Object.freeze({...profiles[id],theme,locked:locked.has(theme),visualActivation:'approval-required'})}
 global.WebStudioHeroShapes352=Object.freeze({version:'3.52.0',profiles,themeMap,geometry,contours,circlePoint,profileFor,motionPolicy});
})(typeof window!=='undefined'?window:undefined);
