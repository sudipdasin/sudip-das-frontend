/* Matrix rain: bounded decorative DOM streams, no additional canvas, timer or RAF. */
((global)=>{'use strict';if(!global)return;
 const profiles=Object.freeze({off:{label:'Off',columns:0},subtle:{label:'Ghost Code',columns:10,speed:1.3},classic:{label:'Matrix Rain',columns:32,speed:1.08},cascade:{label:'Neon Cascade',columns:26,speed:.78},data:{label:'Binary Streams',columns:16,speed:1.15}});
 for(const p of Object.values(profiles))Object.freeze(p);
 const alphabet='01ABCDEF0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿ';
 function plan(id,{theme='terminal',quality='off',visible=true,reduced=false,forced=false,saveData=false,lowPower=false,mobile=false}={}){
  const p=profiles[id];const enabled=Boolean(p&&id!=='off'&&theme==='terminal'&&quality!=='off'&&!forced);
  const running=enabled&&visible&&!reduced&&!saveData&&!lowPower&&['balanced','cinematic'].includes(quality);
  return Object.freeze({id:enabled?id:'off',running,columns:enabled?Math.min(p.columns,mobile?10:Infinity,quality==='cinematic'?(id==='classic'?32:26):quality==='balanced'?(id==='classic'?20:16):8):0});
 }
 function stream(i,id){const chars=id==='data'?'0101101001100011':alphabet;return Array.from({length:(id==='classic'?27:18)+(i%7)},(_,j)=>chars[(i*17+j*13+j*j*3)%chars.length]).join('\n')}
 function mount({doc,hero,menu,getPolicy}){
  const key='ws-atmo-matrix-v356';let choice='classic';try{const marker=key+'-console-v357';if(global.localStorage?.getItem(marker)==='true'){const v=global.localStorage?.getItem(key);if(Object.hasOwn(profiles,v))choice=v}else{global.localStorage?.setItem(key,'classic');global.localStorage?.setItem(marker,'true')}}catch{}
  const label=doc.createElement('label');label.className='ws-matrix-control';const title=doc.createElement('span');title.textContent='Digital rain';const select=doc.createElement('select');select.setAttribute('aria-label','Digital rain effect');
  for(const [id,p] of Object.entries(profiles)){const option=doc.createElement('option');option.value=id;option.textContent=p.label;select.append(option)}label.append(title,select);menu.append(label);
  let layer=null,signature='',last=plan('off');let active=true;
  function clear(){layer?.remove();layer=null;signature=''}
  function sync(){if(!active)return;const policy=getPolicy();label.hidden=policy.theme!=='terminal';select.value=choice;last=plan(choice,policy);if(!last.columns){clear();return}
   const sig=last.id+':'+last.columns;
   if(sig!==signature||!layer?.isConnected){clear();signature=sig;layer=doc.createElement('div');layer.className='ws-matrix-rain';layer.setAttribute('aria-hidden','true');layer.dataset.matrixStyle=last.id;
    for(let i=0;i<last.columns;i++){const col=doc.createElement('span');col.className='ws-matrix-column';col.textContent=stream(i,last.id);col.style.setProperty('--mx-x',((i+.5)*100/last.columns).toFixed(2)+'%');col.style.setProperty('--mx-y',((i*37)%85)+'%');col.style.setProperty('--mx-period',((12+i%9*1.4)*profiles[last.id].speed).toFixed(2)+'s');col.style.setProperty('--mx-delay',(-((i*7.31)%19.7)).toFixed(2)+'s');col.style.setProperty('--mx-stream-alpha',(.48+(i%7)*.075).toFixed(2));layer.append(col)}hero.prepend(layer)}
   layer.dataset.running=String(last.running);
  }
  function set(id){if(!active||!Object.hasOwn(profiles,id)||getPolicy().theme!=='terminal')return false;choice=id;try{global.localStorage?.setItem(key,id)}catch{}sync();return true}
  select.addEventListener('change',()=>set(select.value));sync();
  return Object.freeze({sync,set,getStatus:()=>Object.freeze({...last,choice,available:Object.keys(profiles)}),stop(){active=false;clear();label.remove()}});
 }
 global.WebStudioMatrix356=Object.freeze({profiles,plan,stream,mount});
})(typeof window!=='undefined'?window:undefined);
