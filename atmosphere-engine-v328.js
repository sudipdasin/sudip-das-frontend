/* WebStudio Atmosphere 3.28 — theme-responsive, visitor-interactive and sitewide — adaptive local-only rendering controller.
 * Modes: Auto, Cinematic, Balanced, Eco, Off.
 * GPU: decorative WebGL2 analytic ray/sphere and direct-light shading;
 * Balanced: capped Canvas2D. Eco: CSS-only. No remote requests, telemetry or full-site ray tracing.
 */
(() => {
  'use strict';
  if(window.PORTFOLIO_PREVIEW_MODE!==true||window.__wsAtmosphere328)return;
  const picker=document.getElementById('theme-select');
  const header=document.querySelector('.topbar .theme-control');
  const hero=document.querySelector('main > .hero')||document.querySelector('main .hero');
  if(!picker||!header||!hero)return;
  const THEMES=Object.freeze({'neon-studio':0,orbit:1,editorial:2,terminal:3,'aurora-peak':4,'design-2':5});
  const MODES=['auto','cinematic','balanced','eco','off'];
  const LABELS={auto:'Auto',cinematic:'Cinematic',balanced:'Balanced',eco:'Eco',off:'Off'};
  const KEY='webstudio-atmosphere-preference-v322';
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
  const contrast=window.matchMedia?.('(forced-colors: active)');
  const mem=Number(navigator.deviceMemory)||0;
  const cores=Number(navigator.hardwareConcurrency)||0;
  const slowDevice=(mem>0&&mem<2)||(cores>0&&cores<=2);
  const battery={low:false};
  let mode='auto',effective='off',renderer='off',reason='',degraded=0,glFailed=false,visible=true;
  let sectionIndex=0,sectionId='intro',scrollQueued=false,scrollProgress=0;
  let pointerX=.5,pointerY=.5,softPointerX=.5,softPointerY=.5,pulse=0;
  const calendar=new Date();
  const dailySeed=((calendar.getFullYear()*13+(calendar.getMonth()+1)*71+calendar.getDate()*137)%997)/997;
  const REGION_SPECS=[
    ['intro','main .hero'],['about','main #about'],['projects','main #projects'],
    ['experience','main #experience'],['strengths','main #capabilities'],
    ['contact','main #contact'],['showcase','.ws-powered-wrap'],['footer','main .footer']
  ];
  let layer,canvas,ctx=null,gl=null,program=null,buffer=null,uniforms=null,raf=0,frameTime=0,lastFrame=0;
  let sampleTotal=0,sampleCount=0,slowWindows=0,w=0,h=0,frameBudget=40,lightIntensity=1,stopped=false;
  const create=(tag,cls,text)=>{
    const node=document.createElement(tag);
    if(cls)node.className=cls;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  try{
    const saved=localStorage.getItem(KEY);
    if(MODES.includes(saved))mode=saved;
  }catch{}
  const control=create('details','ws-atmo-control');
  control.id='ws-atmosphere-control';
  const summary=create('summary','ws-atmo-trigger');
  const mark=create('span','ws-atmo-icon','✧');
  mark.setAttribute('aria-hidden','true');
  const name=create('span','ws-atmo-name','Atmosphere');
  const pill=create('span','ws-atmo-level','Auto');
  summary.append(mark,name,pill);
  summary.setAttribute('aria-label','Atmosphere rendering settings');
  const menu=create('div','ws-atmo-menu');
  menu.setAttribute('role','group');
  menu.setAttribute('aria-label','Choose atmosphere quality');
  menu.append(create('strong','ws-atmo-heading','Atmosphere rendering'));
  menu.append(create('p','ws-atmo-explain','Each theme has unique lighting and effects. Select a safe quality for your device.'));
  const choices=create('div','ws-atmo-choices');
  const captions={
    auto:'Adapt to your device and motion preference',
    cinematic:'GPU shaders, lighting, ray intersections and shadows',
    balanced:'Efficient Canvas 2D lighting and movement',
    eco:'Static CSS atmosphere, minimum CPU and GPU',
    off:'Disable all added atmospheric visuals'
  };
  const radios=[];
  MODES.forEach(m=>{
    const label=create('label','ws-atmo-choice');
    const radio=create('input');
    radio.type='radio';radio.name='ws-atmosphere-mode';radio.value=m;
    radio.checked=mode===m;
    const body=create('span','ws-atmo-choice-copy');
    body.append(create('strong','',LABELS[m]),create('small','',captions[m]));
    label.append(radio,body);choices.append(label);radios.push(radio);
    radio.addEventListener('change',()=>{if(radio.checked)choose(m);});
  });
  const output=create('p','ws-atmo-status');
  output.setAttribute('role','status');
  output.setAttribute('aria-live','polite');
  const help=create('p','ws-atmo-safety',
    'Automatic safety caps protect low-power devices. Reduced motion and data-saver preferences override animation.');
  menu.append(choices,output,help);control.append(summary,menu);
  header.after(control);
  layer=create('div','ws-atmo-layer');
  layer.setAttribute('aria-hidden','true');
  // One fixed viewport canvas serves the entire page; never allocate a canvas per section.
  layer.classList.add('ws-atmo-sitewide');
  document.body.append(layer);
  const regions=REGION_SPECS.map(([id,selector])=>({id,node:document.querySelector(selector)}))
    .filter(item=>item.node);
  for(const region of regions){
    region.node.setAttribute('data-atmo-zone',region.id);
    const glow=create('span','ws-atmo-zone-glow');
    glow.setAttribute('aria-hidden','true');
    region.node.prepend(glow);
  }
  function currentSection(){
    const anchor=(window.innerHeight||720)*.42;
    let found=null;
    for(const region of regions){
      const rect=region.node.getBoundingClientRect();
      if(rect.top<=anchor&&rect.bottom>=anchor)found=region;
    }
    if(!found){
      let min=Infinity;
      for(const region of regions){
        const rect=region.node.getBoundingClientRect();
        const distance=Math.min(Math.abs(rect.top-anchor),Math.abs(rect.bottom-anchor));
        if(distance<min){min=distance;found=region;}
      }
    }
    if(!found)return;
    const next=Math.max(0,REGION_SPECS.findIndex(x=>x[0]===found.id));
    const previous=sectionId;
    sectionId=found.id;sectionIndex=next;
    const root=document.documentElement;
    const maximum=Math.max(1,(root?.scrollHeight||0)-(root?.clientHeight||0));
    scrollProgress=Math.min(1,Math.max(0,(window.scrollY||0)/maximum));
    document.body.dataset.atmosphereSection=sectionId;
    if(previous!==sectionId)window.dispatchEvent(new CustomEvent('ws-atmosphere-section',{
      detail:{theme:document.body.dataset.theme,section:sectionId,progress:scrollProgress}
    }));
  }
  function queueSectionUpdate(){
    if(scrollQueued)return;
    scrollQueued=true;
    const update=()=>{scrollQueued=false;currentSection();};
    if(typeof requestAnimationFrame==='function')requestAnimationFrame(update);
    else update();
  }
  currentSection();
  const power=()=>({
    mobile:window.innerWidth<740,
    saveData:Boolean(navigator.connection?.saveData),
    reduced:Boolean(reduced?.matches),
    forced:Boolean(contrast?.matches)
  });
  const browserGPU=()=>{
    if(glFailed||typeof window.WebGL2RenderingContext==='undefined')return false;
    return Boolean(window.__wsAtmosphereShaders325?.fragment);
  };
  function requestedTier(){
    const p=power();
    if(mode==='off'||p.forced)return 'off';
    if(p.reduced||p.saveData||battery.low)return 'eco';
    if(mode!=='auto')return mode;
    if(slowDevice)return 'eco';
    if(mem>=4&&cores>=6&&!p.mobile&&browserGPU())return 'cinematic';
    if((mem===0||mem>=2)&&cores>=4)return 'balanced';
    return 'eco';
  }
  function resolveTier(){
    let tier=requestedTier();
    if(tier==='cinematic'&&(slowDevice||degraded>=1||!browserGPU()))tier='balanced';
    if(tier==='balanced'&&(slowDevice||degraded>=2))tier='eco';
    return tier;
  }
  function destroyCanvas(){
    if(raf){cancelAnimationFrame(raf);raf=0;}
    if(gl){
      try{
        if(buffer)gl.deleteBuffer(buffer);
        if(program)gl.deleteProgram(program);
      }catch{}
    }
    gl=null;ctx=null;program=null;buffer=null;uniforms=null;
    if(canvas){canvas.remove();canvas=null;}
    w=0;h=0;lastFrame=0;sampleCount=0;sampleTotal=0;slowWindows=0;
  }
  function newCanvas(){
    canvas=create('canvas','ws-atmo-canvas');
    canvas.setAttribute('aria-hidden','true');
    layer.append(canvas);
  }
  function compile(gl,type,source){
    const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);
    if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){
      const message=gl.getShaderInfoLog(shader)||'shader unsupported';
      gl.deleteShader(shader);throw new Error(message.slice(0,160));
    }
    return shader;
  }
  function gpuSetup(){
    newCanvas();
    gl=canvas.getContext('webgl2',{
      alpha:true,antialias:false,depth:false,stencil:false,
      preserveDrawingBuffer:false,powerPreference:'high-performance'
    });
    if(!gl)throw new Error('WebGL2 not available');
    const src=window.__wsAtmosphereShaders325;
    if(!src)throw new Error('shader bundle absent');
    const vs=compile(gl,gl.VERTEX_SHADER,src.vertex),fs=compile(gl,gl.FRAGMENT_SHADER,src.fragment);
    program=gl.createProgram();
    gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    gl.deleteShader(vs);gl.deleteShader(fs);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('shader link rejected');
    gl.useProgram(program);
    buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
    gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0,2,gl.FLOAT,false,0,0);
    uniforms={
      resolution:gl.getUniformLocation(program,'u_resolution'),
      time:gl.getUniformLocation(program,'u_time'),
      theme:gl.getUniformLocation(program,'u_theme'),
      intensity:gl.getUniformLocation(program,'u_intensity'),
      section:gl.getUniformLocation(program,'u_section'),
      pointer:gl.getUniformLocation(program,'u_pointer'),
      scroll:gl.getUniformLocation(program,'u_scroll'),
      seed:gl.getUniformLocation(program,'u_seed'),
      pulse:gl.getUniformLocation(program,'u_pulse')
    };
    canvas.addEventListener('webglcontextlost',event=>{
      event.preventDefault();glFailed=true;degraded=Math.max(degraded,1);
      synchronize('GPU context lost; using safer rendering');
    },{passive:false});
    canvas.addEventListener('webglcontextrestored',()=>{
      glFailed=false;if(mode==='auto')synchronize('Graphics context restored');
    });
    renderer='gpu';frameBudget=1000/(power().mobile?22:30);
  }
  function canvasSetup(){
    if(canvas)destroyCanvas();
    newCanvas();
    ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});
    if(!ctx)throw new Error('Canvas 2D unavailable');
    renderer='canvas2d';frameBudget=1000/(power().mobile?18:24);
  }
  function dimensions(){
    if(!canvas)return;
    // Use viewport coordinates, not hero geometry, to keep effects visible while scrolling.
    const viewportWidth=document.documentElement?.clientWidth||window.innerWidth||0;
    const viewportHeight=window.innerHeight||document.documentElement?.clientHeight||0;
    if(viewportWidth<1||viewportHeight<1)return;
    const p=power();
    const scale=renderer==='gpu'?(p.mobile?.67:.86):(p.mobile?.52:.64);
    const pixelRatio=Math.min(window.devicePixelRatio||1,renderer==='gpu'?1.1:.85);
    const maxW=renderer==='gpu'?1152:800,maxH=renderer==='gpu'?704:520;
    const width=Math.max(1,Math.round(Math.min(maxW,viewportWidth*scale*pixelRatio)));
    const height=Math.max(1,Math.round(Math.min(maxH,viewportHeight*scale*pixelRatio)));
    if(width===w&&height===h)return;
    w=width;h=height;canvas.width=w;canvas.height=h;
    if(gl)gl.viewport(0,0,w,h);
  }
  function canvasFrame(t){
    const theme=THEMES[document.body.dataset.theme]??0;
    ctx.clearRect(0,0,w,h);
    const base=[
      ['#08bfdc','#8b42bb'],['#188a9a','#4ae5c7'],['#bd9c68','#d9b88e'],
      ['#16b76a','#48e5a4'],['#9ad8b5','#f6b887'],['#513cbb','#ac74ef']
    ][theme];
    const shift=sectionIndex*.43;
    const focalX=w*(.55+.13*Math.sin(shift)+.10*(softPointerX-.5)),
          focalY=h*(.38+.13*Math.cos(shift)+.08*(softPointerY-.5));
    const bloom=ctx.createRadialGradient(focalX,focalY,4,focalX,focalY,Math.max(w,h)*.68);
    bloom.addColorStop(0,base[0]+'8a');bloom.addColorStop(.45,base[1]+'28');bloom.addColorStop(1,base[1]+'00');
    ctx.globalAlpha=theme===2?.22:.37;
    ctx.fillStyle=bloom;ctx.fillRect(0,0,w,h);
    if(theme===4){
      // Arctic Radiance: two strokes per curtain, no extra render loop or blur.
      const bands=power().mobile?2:3;
      for(let band=0;band<bands;band++){
        const grad=ctx.createLinearGradient(0,0,w,0);
        grad.addColorStop(0,'#68ffb000');grad.addColorStop(.28,'#68ffb0b0');
        grad.addColorStop(.70,band===1?'#c9adffce':'#96fbd2d0');grad.addColorStop(1,'#83f3c300');
        ctx.strokeStyle=grad;ctx.beginPath();
        for(let j=0;j<=36;j++){
          const x=w*j/36,y=h*(.18+band*.055+.08*Math.sin(j*.19+t*.00014+band)+.034*Math.cos(j*.41-t*.00009));
          if(j===0)ctx.moveTo(x,y);else ctx.lineTo(x,y);
        }
        ctx.globalAlpha=.19;ctx.lineWidth=Math.max(3,w*.028);ctx.stroke();
        ctx.globalAlpha=.57;ctx.lineWidth=Math.max(1,w*.004);ctx.stroke();
      }
      ctx.globalAlpha=1;return;
    }
    const count=power().mobile?10:18;
    ctx.lineWidth=Math.max(.6,w/1350);
    for(let i=0;i<count;i++){
      const n=(i*73.13)%97/97;
      const x=w*((i*.6180339+sectionIndex*.083)%1),y=h*((i*.347+sectionIndex*.109)%1);
      const oscillation=Math.sin(t*.00012+i*2.1)*Math.min(10,w*.016);
      ctx.beginPath();
      if(theme===3){ctx.moveTo(x,y);ctx.lineTo(x,y+h*.14);}
      else if(theme===4){
        ctx.moveTo(x-20,y+oscillation);ctx.bezierCurveTo(x,y-30,x+23,y+27,x+60,y-65);
      }else if(theme===2){ctx.moveTo(x-25,y+oscillation);ctx.lineTo(x+30,y-10);}
      else{ctx.arc(x,y+oscillation,Math.max(1.1,w*(.0009+n*.0018)),0,Math.PI*2);}
      ctx.strokeStyle=base[i%2]+'88';ctx.stroke();
    }
    ctx.globalAlpha=1;
  }
  function gpuFrame(t){
    if(!gl||!program)return;
    gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.uniform2f(uniforms.resolution,w,h);
    gl.uniform1f(uniforms.time,t*.001);
    gl.uniform1i(uniforms.theme,THEMES[document.body.dataset.theme]??0);
    gl.uniform1f(uniforms.intensity,lightIntensity);
    gl.uniform1f(uniforms.section,sectionIndex);
    gl.uniform2f(uniforms.pointer,softPointerX,softPointerY);
    gl.uniform1f(uniforms.scroll,scrollProgress);
    gl.uniform1f(uniforms.seed,dailySeed);
    gl.uniform1f(uniforms.pulse,pulse);
    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }
  function eligible(){
    return !stopped&&visible&&document.visibilityState!=='hidden'&&
      (renderer==='gpu'||renderer==='canvas2d')&&canvas!==null;
  }
  function frame(time){
    raf=0;
    if(!eligible())return;
    if(!lastFrame||time-lastFrame>=frameBudget){
      if(lastFrame){
        const dt=time-lastFrame;
        if(dt<220){sampleCount++;sampleTotal+=dt;}
      }
      lastFrame=time;
      softPointerX+=(pointerX-softPointerX)*.095;
      softPointerY+=(pointerY-softPointerY)*.095;
      pulse*=.84;if(pulse<.002)pulse=0;
      dimensions();
      try{
        if(w&&h){
          if(renderer==='gpu')gpuFrame(time);
          else canvasFrame(time);
        }
      }catch{
        degraded=Math.max(degraded,renderer==='gpu'?1:2);
        if(renderer==='gpu')glFailed=true;
        synchronize('Renderer failed; falling back');return;
      }
      if(sampleCount>=45){
        const average=sampleTotal/sampleCount;
        slowWindows=average>(renderer==='gpu'?48:77)?slowWindows+1:0;
        sampleCount=0;sampleTotal=0;
        if(slowWindows>=2){
          degraded=Math.min(2,degraded+1);
          synchronize('Performance safety downgrade');return;
        }
      }
    }
    raf=requestAnimationFrame(frame);
  }
  function schedule(){
    if(typeof requestAnimationFrame!=='function')return;
    if(!raf&&eligible())raf=requestAnimationFrame(frame);
  }
  // Aurora's local decorative layer follows this engine's effective quality,
  // including fallback, reduced motion, tab visibility and manual atmosphere pause.
  let auroraLayer=null;
  function syncAuroraEffects(){
    const art=hero.querySelector('.hero-art');
    const active=document.body.dataset.theme==='aurora-peak'&&effective!=='off'&&Boolean(art);
    if(!active){auroraLayer?.remove();auroraLayer=null;return}
    if(!auroraLayer||auroraLayer.parentElement!==art){
      auroraLayer?.remove();auroraLayer=create('div','ap-atmosphere-fx');
      auroraLayer.setAttribute('aria-hidden','true');
      for(let i=0;i<3;i++)auroraLayer.append(create('span','ap-fx-curtain ap-fx-curtain-'+i));
      for(let i=0;i<24;i++){
        const star=create('span','ap-fx-star');star.style.setProperty('--ap-x',((i*37+9)%89+5)+'%');
        star.style.setProperty('--ap-y',((i*23+7)%61+4)+'%');
        star.style.setProperty('--ap-delay',-(i%9)*.83+'s');star.style.setProperty('--ap-size',(i%7===0?3:1.5)+'px');
        star.dataset.large=String(i%7===0);star.dataset.extra=String(i>=12);auroraLayer.append(star);
      }
      art.prepend(auroraLayer);
    }
    auroraLayer.dataset.quality=effective;
    auroraLayer.dataset.running=String(visible&&document.visibilityState!=='hidden'&&!power().reduced&&(effective==='cinematic'||effective==='balanced'));
  }
  function synchronize(note=''){
    const tier=resolveTier();
    const theme=document.body.dataset.theme;
    currentSection();
    if(!(theme in THEMES))return;
    if(effective!==tier){
      destroyCanvas();
      effective=tier;
      renderer=tier==='off'?'off':'css';
      if(tier==='cinematic'){
        try{gpuSetup();}
        catch{glFailed=true;destroyCanvas();effective='balanced';
          try{canvasSetup();}catch{destroyCanvas();effective='eco';renderer='css';}}
      }else if(tier==='balanced'){
        try{canvasSetup();}catch{destroyCanvas();effective='eco';renderer='css';}
      }
    }
    document.body.dataset.atmosphereReady='true';
    document.body.dataset.atmosphereMode=mode;
    document.body.dataset.atmosphereTier=effective;
    document.body.dataset.atmosphereRenderer=renderer;
    layer.hidden=effective==='off';
    syncAuroraEffects();
    pill.textContent=LABELS[mode];
    radios.forEach(input=>input.checked=input.value===mode);
    reason=note||'';
    const p=power();
    let alert='';
    if(p.forced)alert='Forced-colors accessibility mode';
    else if(p.reduced)alert='System reduced motion';
    else if(p.saveData)alert='Data saver enabled';
    else if(battery.low)alert='Battery saving';
    else if(slowDevice&&mode!=='off')alert='Low-power hardware safety cap';
    else if(degraded)alert='Performance watchdog downgraded quality';
    else if(mode==='cinematic'&&renderer!=='gpu')alert='GPU shaders unavailable';
    output.textContent=LABELS[mode]+' → '+(effective==='cinematic'?'WebGL2 GPU':effective==='balanced'?'Canvas 2D':effective==='eco'?'Static CSS':'No effects')
      +(alert?' · '+alert:reason?' · '+reason:'');
    lightIntensity=theme==='editorial'?.38:theme==='terminal'?.62:.9;
    if(renderer==='gpu'||renderer==='canvas2d'){dimensions();schedule();}
    const detail={mode,effective,renderer,theme,section:sectionId,reason:alert||reason};
    window.dispatchEvent(new CustomEvent('ws-atmosphere-change',{detail}));
  }
  function choose(next){
    if(!MODES.includes(next))return;
    mode=next;degraded=0;
    try{localStorage.setItem(KEY,mode);}catch{}
    synchronize();
  }
  control.addEventListener('keydown',event=>{
    if(event.key==='Escape'&&control.open){control.open=false;summary.focus();}
  });
  document.addEventListener('pointerdown',event=>{
    if(control.open&&!control.contains(event.target))control.open=false;
  });
  picker.addEventListener('change',()=>synchronize());
  document.addEventListener('pointermove',event=>{
    if(renderer==='off'||renderer==='css'||power().reduced||power().saveData)return;
    const width=Math.max(1,window.innerWidth||1),height=Math.max(1,window.innerHeight||1);
    if(Number.isFinite(event.clientX)&&Number.isFinite(event.clientY)){
      pointerX=Math.max(0,Math.min(1,event.clientX/width));
      pointerY=Math.max(0,Math.min(1,event.clientY/height));
    }
  },{passive:true});
  document.addEventListener('click',event=>{
    if(renderer==='off'||renderer==='css'||power().reduced||power().saveData)return;
    if(event.target?.closest?.('button:not([disabled]),a[href],[role="tab"],summary')){
      pulse=Math.min(1,pulse+.75);
    }
  },{passive:true});
  document.addEventListener('visibilitychange',()=>{
    visible=document.visibilityState!=='hidden';
    syncAuroraEffects();
    if(!visible&&raf){cancelAnimationFrame(raf);raf=0;}
    else schedule();
  });
  window.addEventListener('resize',()=>{dimensions();schedule();},{passive:true});
  reduced?.addEventListener?.('change',()=>synchronize());
  contrast?.addEventListener?.('change',()=>synchronize());
  navigator.connection?.addEventListener?.('change',()=>synchronize());
  // No hero intersection gate: the fixed viewport renderer remains active in every section.
  window.addEventListener('scroll',queueSectionUpdate,{passive:true});
  if(typeof ResizeObserver==='function')
    new ResizeObserver(()=>{dimensions();queueSectionUpdate();schedule();}).observe(document.documentElement);
  if(typeof navigator.getBattery==='function'){
    navigator.getBattery().then(b=>{
      const update=()=>{
        const low=!b.charging&&b.level<.18;
        if(low!==battery.low){battery.low=low;synchronize();}
      };
      b.addEventListener('chargingchange',update);
      b.addEventListener('levelchange',update);update();
    }).catch(()=>{});
  }
  function selectedShapeProfile(){
    const lib=window.WebStudioHeroShapes352,theme=document.body.dataset.theme;
    if(!lib)return null;
    const base=lib.profileFor(theme),id=hero.querySelector('.hero-art')?.getAttribute('data-hero-profile');
    return !base.locked&&id&&Object.hasOwn(lib.profiles,id)?Object.freeze({...lib.profiles[id],theme,locked:false,visualActivation:'approved'}):base;
  }
  window.__wsAtmosphere328=Object.freeze({
    getStatus:()=>Object.freeze({mode,effective,renderer,theme:document.body.dataset.theme,
      section:sectionId,scope:'sitewide',progress:scrollProgress,
      interactive:true,dailySeed,
      shapeProfile:selectedShapeProfile(),
      shapeVisualActivation:selectedShapeProfile()?.visualActivation||'native',
      degraded,lowPower:slowDevice,saveData:power().saveData,reducedMotion:power().reduced,
      activeCanvas:Boolean(canvas),auroraEffects:auroraLayer?{quality:auroraLayer.dataset.quality,running:auroraLayer.dataset.running==='true',stars:24}:null,regionCount:regions.length,frameBudgetMs:Math.round(frameBudget),
      expectedFrameRate:renderer==='gpu'||renderer==='canvas2d'?Math.round(1000/frameBudget):0,
      capabilities:Object.freeze(['auto','cinematic','balanced','eco','off','adaptive-fallback','reduced-motion','sitewide','aurora-curtains','aurora-sparkles','shape-profile-registry','shape-motion-policy'])}),
    getShapeProfile:()=>selectedShapeProfile(),
    getShapeMotionPolicy:()=>window.WebStudioHeroShapes352?.motionPolicy({quality:effective,visible:visible&&document.visibilityState!=='hidden',reduced:power().reduced,saveData:power().saveData,lowPower:slowDevice||battery.low,forced:power().forced})||null,
    getAvailableShapeProfiles:()=>window.WebStudioHeroShapes352?.profiles||null,
    setMode:choose,
    refresh:synchronize,
    stop:()=>choose('off')
  });
  // Compatibility alias for existing preview audit and diagnostics clients.
  window.__wsAtmosphere323=window.__wsAtmosphere328;
  synchronize();
})();
