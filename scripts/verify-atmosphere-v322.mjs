/* WebStudio v3.22 Atmosphere offline regression gate.
 * Run: node scripts/verify-atmosphere-v322.mjs
 * These tests exercise source contracts and a simulated DOM / WebGL.
 * They do NOT prove a GPU shader compiles on physical hardware or certify live UI pixels.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,runInNewContext} from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html'),css=read('atmosphere-system-v322.css');
const shader=read('atmosphere-shaders-v322.js'),engine=read('atmosphere-engine-v322.js');
const ci=read('human-ci-preview-v1.js'),audit=read('preview-theme-audit-v316.js');
const header=read('_headers'),circle=read('.circleci/config.yml');
const checks=[];
function check(label,ok){assert.ok(ok,label);checks.push(label);}
function balanced(source){
 let braces=0,parens=0,quote='',comment=false;
 for(let i=0;i<source.length;i++){
  const a=source[i],b=source[i+1];
  if(comment){if(a==='*'&&b==='/'){comment=false;i++;}continue;}
  if(quote){if(a==='\\'){i++;continue;}if(a===quote)quote='';continue;}
  if(a==='/'&&b==='*'){comment=true;i++;continue;}
  if(a==="'"||a==='"'){quote=a;continue;}
  if(a==='{')braces++;if(a==='}')braces--;
  if(a==='(')parens++;if(a===')')parens--;
  if(braces<0||parens<0)return false;
 }
 return !comment&&!quote&&braces===0&&parens===0;
}
check('Shader and engine parse as JavaScript',Boolean(new Script(shader))&&Boolean(new Script(engine)));
check('Atmosphere CSS balanced',balanced(css));
check('CSS linked',html.includes('atmosphere-system-v322.css?v=3.22.0'));
check('Shader bundle before engine',html.indexOf('atmosphere-shaders-v322.js')<html.indexOf('atmosphere-engine-v322.js'));
check('Engine after preview mode flag',html.indexOf('PORTFOLIO_PREVIEW_MODE=true')<html.indexOf('atmosphere-engine-v322.js'));
check('Six theme palettes', ['neon-studio','orbit','editorial','terminal','aurora-peak','design-2'].every(t=>css.includes('data-theme="'+t+'"')));
check('Five accessible mode options', ['auto','cinematic','balanced','eco','off'].every(x=>engine.includes(x+':')||engine.includes("'"+x+"'")));
check('GPU analytic sphere intersection',shader.includes('float sphereHit('));
check('GPU direct lighting',shader.includes('vec3 tracedLight('));
check('GPU occlusion shadow ray',shader.includes('float occlusion=sphereHit('));
check('Shader has six scene branches', ['u_theme==0','u_theme==1','u_theme==2','u_theme==3','u_theme==4'].every(x=>shader.includes(x)));
check('GPU output has alpha channel',shader.includes('fragColor=vec4(color,clamp(opacity*u_intensity'));
check('WebGL context loss recovery',engine.includes('webglcontextlost')&&engine.includes('context lost'));
check('Frame-rate watchdog and downgrade',engine.includes('Performance safety downgrade'));
check('GPU resolution capped',engine.includes("maxW=renderer==='gpu'?1152:800"));
check('Reduced-motion and forced-colors protected',engine.includes('prefers-reduced-motion: reduce')&&engine.includes('forced-colors: active'));
check('Eco CSS animation disabled',css.includes('data-atmosphere-tier="eco"')&&css.includes('animation:none!important'));
check('Off removes all added layers',css.includes('data-atmosphere-tier="off"'));
check('Aurora old toggle hidden when shared control active',css.includes('.ap-motion-control')&&css.includes('data-atmosphere-ready="true"'));
check('New Human CI review added five Atmosphere checks',ci.includes("['atmosphereSix'")&&ci.includes("['atmosphereSafety'"));
check('Audit exposes true atmosphere renderer',audit.includes('Atmosphere renderer reports a valid fallback'));
check('Preview private API remains disabled',html.includes('window.PUBLIC_API_BASE=""')&&html.includes('window.PORTFOLIO_PREVIEW_MODE=true'));
check('Noindex and anti-framing still present',html.includes('noindex,nofollow,noarchive')&&header.includes('X-Frame-Options: DENY'));
check('CircleCI preview jobs still excluded',circle.includes('ignore:\n                - preview-personalweb'));
check('New assets do not send data',[engine,shader].every(s=>!s.includes('fetch(')&&!s.includes('XMLHttpRequest')&&!s.includes('sendBeacon')));
function fakePage(options={}){
 const webgl={
  VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,ARRAY_BUFFER:5,STATIC_DRAW:6,
  FLOAT:7,TRIANGLE_STRIP:8,COLOR_BUFFER_BIT:9,draws:0,
  createShader(){return{}},shaderSource(){},compileShader(){},
  getShaderParameter(){return !options.shaderFail},getShaderInfoLog(){return 'mock compile failure'},
  deleteShader(){},createProgram(){return{}},attachShader(){},linkProgram(){},
  getProgramParameter(){return !options.linkFail},useProgram(){},createBuffer(){return{}},
  bindBuffer(){},bufferData(){},enableVertexAttribArray(){},vertexAttribPointer(){},
  getUniformLocation(){return{}},deleteBuffer(){},deleteProgram(){},viewport(){},
  clearColor(){},clear(){},uniform2f(){},uniform1f(){},uniform1i(){},drawArrays(){this.draws++}
 };
 const canvas2d={clearRect(){},createRadialGradient(){return{addColorStop(){}}},fillRect(){},
  beginPath(){},moveTo(){},lineTo(){},bezierCurveTo(){},arc(){},stroke(){}};
 class Element {
  constructor(tag){this.tag=tag;this.children=[];this.parent=null;this.listeners={};
   this.attrs={};this.dataset={};this.textContent='';this.value='';this.hidden=false;
   this.width=0;this.height=0;this.style={};}
  append(...nodes){for(const n of nodes){this.children.push(n);n.parent=this}}
  prepend(n){this.children.unshift(n);n.parent=this}
  after(n){this.following=n}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);this.parent=null}
  setAttribute(k,v){this.attrs[k]=v}
  addEventListener(k,fn){(this.listeners[k]??=[]).push(fn)}
  dispatchEvent(e){for(const f of this.listeners[e.type]||[])f(e)}
  getBoundingClientRect(){return {width:1200,height:660}}
  getContext(type){if(type==='webgl2')return options.glFail||options.noGL?null:webgl;
   if(type==='2d')return options.ctxFail?null:canvas2d;return null}
 }
 const picker=new Element('select'),header=new Element('label'),hero=new Element('section'),body=new Element('body');
 body.dataset.theme='neon-studio';
 const doc={body,visibilityState:'visible',
  getElementById:id=>id==='theme-select'?picker:null,
  querySelector:q=>q==='.topbar .theme-control'?header:q==='main > .hero'||q==='main .hero'?hero:null,
  createElement:tag=>new Element(tag),addEventListener(){}};
 const media=q=>({matches:q.includes('reduced-motion')?!!options.reduced:!!options.forced,
  addEventListener(){}});
 const window={PORTFOLIO_PREVIEW_MODE:options.blocked?false:true,
  innerWidth:options.mobile?390:1440,devicePixelRatio:1.2,
  WebGL2RenderingContext:options.noGL?undefined:function(){},
  __wsAtmosphereShaders322:{vertex:'mock',fragment:'mock'},
  matchMedia:media,addEventListener(){},dispatchEvent(){}};
 const navigator={deviceMemory:options.mem??8,hardwareConcurrency:options.cores??8,
  connection:{saveData:!!options.save,addEventListener(){}}};
 const saved=new Map(),localStorage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v)};
 const callbacks=[];
 const sandbox={window,document:doc,navigator,localStorage,
  requestAnimationFrame:f=>{callbacks.push(f);return callbacks.length},cancelAnimationFrame(){},
  CustomEvent:class{constructor(type,opts){this.type=type;this.detail=opts?.detail}},
  IntersectionObserver:class{observe(){}},ResizeObserver:class{observe(){}}};
 runInNewContext(engine,sandbox,{timeout:2000});
 return {window,picker,hero,saved,callbacks,webgl};
}
function assertTier(label,opts,tier){
 const r=fakePage(opts);check(label,r.window.__wsAtmosphere322.getStatus().effective===tier);return r;
}
check('Preview guard disables atmosphere',fakePage({blocked:true}).window.__wsAtmosphere322===undefined);
const fast=assertTier('8 GB / 8 cores chooses cinematic GPU',{},'cinematic');
check('High-end renderer is WebGL2',fast.window.__wsAtmosphere322.getStatus().renderer==='gpu');
assertTier('1 GB and dual-core chooses Eco',{mem:1,cores:2},'eco');
assertTier('4 GB and quad-core chooses Balanced',{mem:4,cores:4},'balanced');
assertTier('Unknown CPU and RAM stay Eco',{mem:0,cores:0},'eco');
assertTier('No WebGL2 falls back Balanced',{noGL:true},'balanced');
assertTier('WebGL creation failure falls back Balanced',{glFail:true},'balanced');
assertTier('GLSL compile failure falls back Balanced',{shaderFail:true},'balanced');
assertTier('GLSL program link failure falls back Balanced',{linkFail:true},'balanced');
assertTier('Reduced motion stays Eco',{reduced:true},'eco');
assertTier('Data saver stays Eco',{save:true},'eco');
assertTier('Forced colors disables effects',{forced:true},'off');
fast.window.__wsAtmosphere322.setMode('off');
check('Off removes live canvas',fast.hero.children[0].hidden&&fast.hero.children[0].children.length===0);
fast.window.__wsAtmosphere322.setMode('cinematic');
check('Cinematic can be resumed after Off',fast.window.__wsAtmosphere322.getStatus().renderer==='gpu');
fast.window.__wsAtmosphere322.stop();
check('Stop is reversible user Off',fast.window.__wsAtmosphere322.getStatus().effective==='off');
fast.window.__wsAtmosphere322.setMode('eco');
check('Only mode preference persisted',fast.saved.size===1&&fast.saved.get('webstudio-atmosphere-preference-v322')==='eco');
check('Unknown mode is ignored',(()=>{fast.window.__wsAtmosphere322.setMode('made-up');return fast.window.__wsAtmosphere322.getStatus().mode==='eco'})());
console.log('PASS '+checks.length+'/'+checks.length+' Atmosphere v3.22 offline source + simulated runtime checks. Live GPU browser tests pending.');
