/* WebStudio Plugin Engine 3.31.0
 * Framework-independent, dependency-aware, opt-in plugin host.
 * Zero third-party dependencies, zero network calls, no automatic mutations.
 * Register TRUSTED plugins only: plugins execute JavaScript in page context.
 */
(function(global){
 'use strict';
 if(!global||global.WebStudioPluginEngine331)return;
 const VERSION='3.31.0';
 const THEME_PROFILES=Object.freeze({
  orbit:Object.freeze({accent:'#75efdb',surface:'#092938',ink:'#edfffb',geometry:'round',motion:'orbit'}),
  editorial:Object.freeze({accent:'#805337',surface:'#fffaf2',ink:'#352a22',geometry:'folio',motion:'still'}),
  terminal:Object.freeze({accent:'#73ffa9',surface:'#081d16',ink:'#e2ffe9',geometry:'square',motion:'cursor'}),
  'aurora-peak':Object.freeze({accent:'#dce8ad',surface:'#1c3c32',ink:'#f2f7e8',geometry:'arch',motion:'mist'}),
  'neon-studio':Object.freeze({accent:'#61f5e4',surface:'#0d273a',ink:'#edfbff',geometry:'glass',motion:'glow'}),
  'design-2':Object.freeze({accent:'#d2c0ff',surface:'#1a1a42',ink:'#f7f1ff',geometry:'prism',motion:'stars'})
 });
 const LOCALES=Object.freeze(['en','hi','bn','es','fr','de','pt','ar','zh-CN','ja']);
 const MODES=Object.freeze(['auto','cinematic','balanced','eco','off']);
 const NAME=/^[a-z][a-z0-9-]{1,63}$/;
 const now=()=>global.performance?.now?.()??Date.now();
 function create(options={}){
  const doc=options.document||global.document;
  const root=options.root||doc?.body;
  if(!root||typeof root.querySelector!=='function')
   throw new TypeError('WebStudio host requires a DOM root with querySelector');
  const registry=new Map(),instances=new Map(),state=new Map(),events=new Map();
  const resourceCleanups=new Map(),errors=[];
  const profileKeys=Object.keys(THEME_PROFILES);
  let phase='idle',busy=null;
  let theme=profileKeys.includes(options.theme)?options.theme:'orbit';
  let locale=LOCALES.includes(options.locale)?options.locale:'en';
  let quality=MODES.includes(options.quality)?options.quality:'auto';
  const metrics={mounts:0,updates:0,unmounts:0,totalMountMs:0};
  const original={
   theme:root.getAttribute?.('data-wsp-theme')??null,
   locale:root.getAttribute?.('data-wsp-locale')??null,
   quality:root.getAttribute?.('data-wsp-quality')??null,
   attr:root.getAttribute?.('data-wsp-host')??null
  };
  const cssKeys=['--wsp-accent','--wsp-surface','--wsp-ink'];
  const oldStyle=Object.fromEntries(cssKeys.map(k=>[k,root.style?.getPropertyValue?.(k)||'']));
  function announce(type,detail){
   for(const fn of events.get(type)||[])try{fn(Object.freeze({...detail}))}
   catch(error){errors.push({plugin:'host-event',event:type,message:String(error?.message||error).slice(0,200)});}
  }
  function on(type,listener){
   if(typeof type!=='string'||typeof listener!=='function')throw new TypeError('Invalid event listener');
   if(!events.has(type))events.set(type,new Set());
   events.get(type).add(listener);
   return ()=>events.get(type)?.delete(listener);
  }
  function paint(){
   const p=THEME_PROFILES[theme];
   root.setAttribute('data-wsp-host','v331');
   root.setAttribute('data-wsp-theme',theme);
   root.setAttribute('data-wsp-locale',locale);
   root.setAttribute('data-wsp-quality',quality);
   for(const [key,val] of Object.entries({'--wsp-accent':p.accent,'--wsp-surface':p.surface,'--wsp-ink':p.ink}))
    root.style?.setProperty?.(key,val);
  }
  function restore(){
   for(const [attr,prev] of [['data-wsp-theme',original.theme],['data-wsp-locale',original.locale],
      ['data-wsp-quality',original.quality],['data-wsp-host',original.attr]]){
    if(prev===null)root.removeAttribute?.(attr);else root.setAttribute(attr,prev);
   }
   for(const key of cssKeys){
    if(oldStyle[key])root.style?.setProperty?.(key,oldStyle[key]);
    else root.style?.removeProperty?.(key);
   }
  }
  function register(definition){
   if(!definition||typeof definition!=='object'||!NAME.test(definition.id||'')||
    typeof definition.mount!=='function')throw new TypeError('Invalid plugin manifest');
   if(phase==='mounted'||phase==='mounting'||phase==='stopping')
    throw new Error('Cannot register plugins while host is mounted');
   if(registry.has(definition.id))throw new Error('Plugin ID already registered: '+definition.id);
   const deps=Array.isArray(definition.dependsOn)?definition.dependsOn.slice():[];
   if(deps.some(d=>!NAME.test(d)||d===definition.id))
    throw new TypeError('Invalid plugin dependency');
   const record=Object.freeze({
    id:definition.id,version:typeof definition.version==='string'?definition.version:'0.0.0',
    dependsOn:Object.freeze([...new Set(deps)]),
    mount:definition.mount,update:typeof definition.update==='function'?definition.update:null,
    supports:typeof definition.supports==='function'?definition.supports:null,
    priority:Number.isFinite(definition.priority)?Math.max(-100,Math.min(100,definition.priority)):0
   });
   registry.set(record.id,record);state.set(record.id,'registered');return api;
  }
  function order(){
   const sorted=[],visited=new Set(),visiting=new Set();
   const items=[...registry.values()].sort((a,b)=>a.priority-b.priority||a.id.localeCompare(b.id));
   function walk(p){
    if(visited.has(p.id))return;
    if(visiting.has(p.id))throw new Error('Plugin dependency cycle: '+p.id);
    visiting.add(p.id);
    for(const id of p.dependsOn) {
     const dependency=registry.get(id);
     if(!dependency)throw new Error('Missing plugin dependency '+id+' for '+p.id);
     walk(dependency);
    }
    visiting.delete(p.id);visited.add(p.id);sorted.push(p);
   }
   for(const p of items)walk(p);
   return sorted;
  }
  function makeContext(plugin){
   const cleanups=resourceCleanups.get(plugin.id);
   const ctx={
    id:plugin.id,host:api,root,document:doc,
    options:Object.freeze({...options,root:undefined,document:undefined}),
    slots:options.slots||{},
    bridge:Boolean(options.bridge),
    get theme(){return theme},get locale(){return locale},get quality(){return quality},
    get palette(){return THEME_PROFILES[theme]},
    t(dictionary,key,fallback){
     if(!dictionary||typeof key!=='string')return fallback??key;
     return dictionary[locale]?.[key]??dictionary.en?.[key]??fallback??key;
    },
    onCleanup(fn){if(typeof fn==='function')cleanups.push(fn);return fn},
    listen(target,event,fn,opts){
     if(!target?.addEventListener||typeof fn!=='function')return ()=>{};
     target.addEventListener(event,fn,opts);
     const stop=()=>target.removeEventListener?.(event,fn,opts);
     cleanups.push(stop);return stop;
    },
    emit:announce,on,
    select:(selector)=>root.querySelector(selector),
    selectAll:(selector)=>Array.from(root.querySelectorAll?.(selector)||[]),
    status:(id)=>id?state.get(id):Object.fromEntries(state)
   };
   return Object.freeze(ctx);
  }
  async function safeCleanup(id){
   const entry=instances.get(id);
   try{await entry?.teardown?.()}catch(e){errors.push({plugin:id,stage:'unmount',message:String(e?.message||e).slice(0,200)})}
   const cleanup=resourceCleanups.get(id)||[];
   for(let i=cleanup.length-1;i>=0;i--)try{await cleanup[i]()}
   catch(e){errors.push({plugin:id,stage:'cleanup',message:String(e?.message||e).slice(0,200)})}
   resourceCleanups.delete(id);instances.delete(id);
  }
  async function mount(){
   if(busy)return busy;
   if(phase==='mounted')return status();
   if(phase==='stopping')throw Error('Host is currently unmounting');
   busy=(async()=>{
    phase='mounting';paint();
    let ordered;
    try{ordered=order()}catch(e){phase='idle';restore();throw e}
    for(const plugin of ordered){
     if(plugin.dependsOn.some(d=>state.get(d)!=='mounted')){
      state.set(plugin.id,'blocked');announce('plugin-status',{id:plugin.id,status:'blocked'});continue;
     }
     let supported=true;
     try{if(plugin.supports)supported=await plugin.supports({
      root,document:doc,bridge:Boolean(options.bridge),options,theme,locale
     });}catch(e){supported=false;errors.push({plugin:plugin.id,stage:'supports',message:String(e?.message||e).slice(0,200)})}
     if(!supported){state.set(plugin.id,'skipped');continue}
     const started=now();
     resourceCleanups.set(plugin.id,[]);
     const ctx=makeContext(plugin);
     try{
      const outcome=await plugin.mount(ctx);
      const normalized=typeof outcome==='function'?{teardown:outcome}:
       outcome&&typeof outcome==='object'?outcome:{};
      instances.set(plugin.id,{ctx,...normalized});
      state.set(plugin.id,'mounted');metrics.mounts++;metrics.totalMountMs+=Math.max(0,now()-started);
      announce('plugin-status',{id:plugin.id,status:'mounted'});
     }catch(error){
      errors.push({plugin:plugin.id,stage:'mount',message:String(error?.message||error).slice(0,200)});
      state.set(plugin.id,'failed');await safeCleanup(plugin.id);
      announce('plugin-status',{id:plugin.id,status:'failed'});
     }
    }
    phase='mounted';announce('ready',{plugins:Object.fromEntries(state),theme,locale});
    return status();
   })();
   try{return await busy}finally{busy=null}
  }
  async function update(reason='manual'){
   if(phase!=='mounted')return status();
   for(const [id,instance]of instances){
    const plugin=registry.get(id);
    try{
     if(typeof instance.update==='function')await instance.update({theme,locale,quality,reason,palette:THEME_PROFILES[theme]});
     else if(plugin?.update)await plugin.update(instance.ctx,{theme,locale,quality,reason,palette:THEME_PROFILES[theme]});
     metrics.updates++;
    }catch(e){
     errors.push({plugin:id,stage:'update',message:String(e?.message||e).slice(0,200)});
     announce('plugin-status',{id,status:'update-error'});
    }
   }
   announce('update',{reason,theme,locale,quality});return status();
  }
  function setTheme(id){if(!THEME_PROFILES[id])return false;theme=id;paint();void update('theme');return true}
  function setLocale(id){if(!LOCALES.includes(id))return false;locale=id;paint();void update('locale');return true}
  function setQuality(id){if(!MODES.includes(id))return false;quality=id;paint();void update('quality');return true}
  async function unmount(){
   if(busy)await busy;
   if(phase==='idle'||phase==='stopped')return status();
   phase='stopping';
   for(const id of [...instances.keys()].reverse()){
    await safeCleanup(id);state.set(id,'stopped');metrics.unmounts++;
   }
   restore();phase='stopped';announce('stopped',{theme,locale});return status();
  }
  function status(){
   return Object.freeze({
    version:VERSION,phase,theme,locale,quality,bridge:Boolean(options.bridge),
    installed:registry.size,mounted:[...state.values()].filter(x=>x==='mounted').length,
    modules:Object.freeze(Object.fromEntries(state)),
    metrics:Object.freeze({...metrics}),
    errors:Object.freeze(errors.map(e=>Object.freeze({...e})))
   });
  }
  const api=Object.freeze({
   version:VERSION,register,use:register,mount,unmount,update,
   setTheme,setLocale,setQuality,on,getStatus:status,
   getModules:()=>Object.freeze([...registry.keys()]),
   getProfile:id=>THEME_PROFILES[id||theme]||null
  });
  return api;
 }
 global.WebStudioPluginEngine331=Object.freeze({
  version:VERSION,create,
  themes:THEME_PROFILES,locales:LOCALES,modes:MODES
 });
})(typeof window!=='undefined'?window:undefined);
