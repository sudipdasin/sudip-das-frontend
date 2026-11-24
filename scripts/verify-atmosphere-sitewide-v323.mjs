/* v3.23 sitewide atmosphere contract and simulated browser regression.
 * node scripts/verify-atmosphere-sitewide-v323.mjs
 * Does not verify real GPU compilation, Cloudflare deployment, or screenshots.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,runInNewContext} from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html'),engine=read('atmosphere-engine-v323.js');
const shader=read('atmosphere-shaders-v323.js'),css=read('atmosphere-sitewide-v323.css');
const audit=read('preview-theme-audit-v316.js'),diagnostics=read('preview-diagnostics-v321.js');
const review=read('human-ci-preview-v1.js'),headers=read('_headers'),circle=read('.circleci/config.yml');
const success=[];
const check=(name,ok)=>{assert.ok(ok,name);success.push(name)};
check('JS parses',Boolean(new Script(engine))&&Boolean(new Script(shader)));
check('CSS brackets balanced',(css.match(/{/g)||[]).length===(css.match(/}/g)||[]).length);
check('Sitewide CSS loaded',html.includes('atmosphere-sitewide-v323.css?v=3.23.0'));
check('Correct engine loaded',html.includes('atmosphere-engine-v323.js?v=3.23.0')&&!html.includes('atmosphere-engine-v322.js'));
check('Shader loaded before engine',html.indexOf('atmosphere-shaders-v323.js')<html.indexOf('atmosphere-engine-v323.js'));
check('Viewport compositor mounted on body',engine.includes('document.body.append(layer)'));
check('Renderer independent of hero scroll gate',engine.includes("addEventListener('scroll',queueSectionUpdate")&&!engine.includes('intersecting&&'));
check('Renderer bounded by viewport',engine.includes('viewportWidth*scale*pixelRatio'));
check('Section uniform on GPU',shader.includes('uniform float u_section;')&&engine.includes('gl.uniform1f(uniforms.section,sectionIndex)'));
const names=['intro','about','projects','experience','strengths','contact','showcase','footer'];
check('Eight section selectors',names.every(n=>engine.includes("['"+n+"',")));
check('Eight section effects',names.every(n=>css.includes('data-atmo-zone="'+n+'"')));
check('All six themes',['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'].every(n=>css.includes('data-theme="'+n+'"')));
check('Overlay cannot intercept input',css.includes('pointer-events:none!important'));
check('Preserves old element positioning',!css.includes('> :not(.ws-atmo-zone-glow)'));
check('Off removes zone effects',css.includes('data-atmosphere-tier="off"] [data-atmo-zone]'));
check('Review includes sitewide QA',review.includes("['atmosphereSitewide'")&&review.includes('0/26'));
check('Audit validates zones',audit.includes('Atmosphere covers all eight content regions'));
check('Diagnostics include scroll tracking',diagnostics.includes('Scroll-aware current section available'));
check('No private API',html.includes('window.PUBLIC_API_BASE=""'));
check('Noindex and frame protection',html.includes('noindex,nofollow,noarchive')&&headers.includes('X-Frame-Options: DENY'));
check('No paid CI on preview',circle.includes('ignore:\n                - preview-personalweb'));
let scroll=0;
class E {
 constructor(){this.children=[];this.parent=null;this.events={};this.attrs={};this.dataset={};this.pos=0;this.textContent='';this.value='';this.hidden=false;this.width=0;this.height=0;this.className='';this.classList={add:x=>{this.className+=' '+x}}}
 append(...ns){for(const n of ns){this.children.push(n);n.parent=this}}
 prepend(n){this.children.unshift(n);n.parent=this}
 after(n){this.next=n}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);this.parent=null}
 setAttribute(k,v){this.attrs[k]=v;if(k==='data-atmo-zone')this.dataset.atmoZone=v}
 addEventListener(k,f){(this.events[k]??=[]).push(f)}
 fire(k){for(const f of this.events[k]||[])f({type:k})}
 getBoundingClientRect(){return{width:1200,height:720,top:this.pos-scroll,bottom:this.pos+720-scroll}}
 getContext(k){return k==='webgl2'?gpu:k==='2d'?paint:null}
}
const gpu={VERTEX_SHADER:1,FRAGMENT_SHADER:2,COMPILE_STATUS:3,LINK_STATUS:4,ARRAY_BUFFER:5,STATIC_DRAW:6,FLOAT:7,TRIANGLE_STRIP:8,COLOR_BUFFER_BIT:9,uniforms:{},
 createShader(){return{}},shaderSource(){},compileShader(){},getShaderParameter(){return true},deleteShader(){},createProgram(){return{}},attachShader(){},linkProgram(){},getProgramParameter(){return true},deleteProgram(){},useProgram(){},createBuffer(){return{}},bindBuffer(){},bufferData(){},enableVertexAttribArray(){},vertexAttribPointer(){},getUniformLocation(p,k){return k},viewport(){},deleteBuffer(){},clearColor(){},clear(){},uniform1f(k,v){this.uniforms[k]=v},uniform1i(k,v){this.uniforms[k]=v},uniform2f(){},drawArrays(){}};
const paint={clearRect(){},createRadialGradient(){return{addColorStop(){}}},fillRect(){},beginPath(){},moveTo(){},lineTo(){},bezierCurveTo(){},arc(){},stroke(){}};
const body=new E(),picker=new E(),header=new E();body.dataset.theme='neon-studio';
const zones=Object.fromEntries(names.map((n,i)=>{const e=new E();e.pos=i*720;return[n,e]}));
const selectors={'.topbar .theme-control':header,'main > .hero':zones.intro,'main .hero':zones.intro,'main #about':zones.about,'main #projects':zones.projects,'main #experience':zones.experience,'main #capabilities':zones.strengths,'main #contact':zones.contact,'.ws-powered-wrap':zones.showcase,'main .footer':zones.footer};
const doc={body,documentElement:{clientWidth:1200,clientHeight:700},visibilityState:'visible',querySelector:q=>selectors[q]||null,getElementById:q=>q==='theme-select'?picker:null,createElement:()=>new E(),addEventListener(){}};
const handlers={},win={PORTFOLIO_PREVIEW_MODE:true,innerWidth:1200,innerHeight:700,devicePixelRatio:1,WebGL2RenderingContext:class{},__wsAtmosphereShaders323:{vertex:'mock',fragment:'mock'},matchMedia:()=>({matches:false,addEventListener(){}}),addEventListener(k,f){(handlers[k]??=[]).push(f)},dispatchEvent(){}};
const nav={deviceMemory:8,hardwareConcurrency:8,connection:{saveData:false,addEventListener(){}}};
const state=new Map(),storage={getItem:k=>state.get(k)||null,setItem:(k,v)=>state.set(k,v)};
let tasks=[],number=0;
runInNewContext(engine,{window:win,document:doc,navigator:nav,localStorage:storage,requestAnimationFrame:f=>{tasks.push({id:++number,f});return number},cancelAnimationFrame:id=>{tasks=tasks.filter(t=>t.id!==id)},CustomEvent:class{constructor(k,o){this.type=k;this.detail=o?.detail}},ResizeObserver:class{observe(){}}},{timeout:2000});
const app=win.__wsAtmosphere323;
check('Starts on GPU',app.getStatus().renderer==='gpu');
check('One global layer',body.children.length===1&&body.children[0].className.includes('ws-atmo-sitewide'));
check('Hero does not own the canvas',zones.intro.children.every(x=>!x.className.includes('ws-atmo-layer')));
check('All regions have one glow',names.every(n=>zones[n].dataset.atmoZone===n&&zones[n].children.filter(e=>e.className==='ws-atmo-zone-glow').length===1));
check('Sitewide status reported',app.getStatus().scope==='sitewide');
const moveTo=y=>{scroll=y;for(const h of handlers.scroll||[])h();const q=tasks.splice(0);for(const t of q)t.f(1200)};
app.setMode('eco');moveTo(1680);
check('Projects tracked after leaving hero',app.getStatus().section==='projects');
moveTo(3620);
check('Contact tracked later in page',app.getStatus().section==='contact');
check('Eco has no active canvas',app.getStatus().renderer==='css'&&body.children[0].children.length===0);
app.setMode('balanced');
check('Balanced canvas works later in page',app.getStatus().renderer==='canvas2d');
app.setMode('off');
check('Off removes the canvas',app.getStatus().renderer==='off'&&body.children[0].hidden&&body.children[0].children.length===0);
app.setMode('cinematic');
check('Cinematic restarts GPU after Off',app.getStatus().renderer==='gpu');
const q=tasks.splice(0);for(const t of q)t.f(1400);
check('Shader receives Contact section uniform',gpu.uniforms.u_section===5);
check('Canvas resolution remains capped',body.children[0].children[0].width<=1152&&body.children[0].children[0].height<=704);
console.log('PASS '+success.length+'/'+success.length+' Atmosphere v3.23 simulated and source checks; physical GPU/browser verification pending.');
