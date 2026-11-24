/* Hero Display Layout Engine v3.28 zero-dependency regression checks.
 * Run: node scripts/verify-hero-display-v327.mjs
 * Source and mock-DOM tests; physical browser/pixel QA remains pending.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html'),js=read('hero-display-engine-v327.js'),css=read('hero-display-layout-v327.css');
const checks=[];const test=(name,value)=>{assert.ok(value,name);checks.push(name)};
test('JavaScript syntax',!!new Script(js));
test('CSS balanced',(css.match(/{/g)||[]).length===(css.match(/}/g)||[]).length);
test('Stylesheet linked',html.includes('hero-display-layout-v327.css?v=3.28.0'));
test('Controller linked',html.includes('hero-display-engine-v327.js?v=3.28.0'));
test('CSS after GitHub hero',html.indexOf('hero-display-layout-v327.css')>html.indexOf('github-hero-explorer-v324.css'));
test('JS after GitHub hero',html.indexOf('hero-display-engine-v327.js')>html.indexOf('github-hero-explorer-v324.js'));
test('Build fingerprint',html.includes('preview-five-engine-mesh-i18n-audio-v3.28.0'));
const themes=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
test('All six theme CSS contracts',themes.every(name=>css.includes('data-theme="'+name+'"')));
test('All six runtime theme contracts',themes.every(name=>js.includes("'"+name+"'")));
test('Desktop grid regions',css.includes('grid-template-areas:"hd-copy hd-art"'));
test('Tablet and mobile breakpoints',css.includes('max-width:1040px')&&css.includes('max-width:620px'));
test('Mobile portrait safeguards',css.includes('max-width:390px'));
test('Neon legacy portrait and spacing preserved',css.includes('locked Neon mobile reference')&&css.includes('not([data-theme="neon-studio"]) main>.hero.hd-hero>.hero-art'));
test('Neon mobile grid areas synchronize with original one-column lock',css.includes('data-theme="neon-studio"] main>.hero.hd-hero')&&css.includes('grid-template-areas:"hd-copy" "hd-art"!important'));
test('Atmosphere Off hides introduced glows while preserving layout',css.includes('data-atmosphere-tier="off"] main>.hero.hd-hero :is(')&&css.includes('display:none!important;opacity:0!important'));
test('Aurora landscape retained',html.includes('aurora-peak-scene-v318.js')&&css.includes('Preserve the existing mountains'));
test('Decor is non-interactive',css.includes('pointer-events:none!important')&&js.includes("stage.setAttribute('aria-hidden','true')"));
test('No canvas/network/storage',[js,css].every(s=>!s.includes('fetch(')&&!s.includes('localStorage')&&!s.includes('getContext(')));
test('Original portrait source',html.includes('sudip-das-portrait.jpg'));
test('Hero headline unchanged',html.includes('<h1><span class="neon-name-gradient">Sudip Das</span>'));
test('GitHub enhancement preserved',html.includes('github-hero-explorer-v324.js'));
test('Atmosphere remains present',html.includes('atmosphere-engine-v328.js'));
test('Noindex preview',html.includes('noindex,nofollow,noarchive'));
test('Private API disabled',html.includes('window.PUBLIC_API_BASE=""'));
test('Reduced motion',css.includes('prefers-reduced-motion:reduce'));
test('Forced color support',css.includes('forced-colors:active'));
test('Contrast support',css.includes('prefers-contrast:more'));
function scenario(opts={}){
 class Node{
  constructor(tag='div'){this.tag=tag;this.className='';this.dataset={};this.attrs={};this.children=[];this.width=1200;this.textContent='';this.events={};
  this.classList={add:c=>{this.className+=' '+c}}}
  append(...els){this.children.push(...els)}
  prepend(el){this.children.unshift(el)}
  setAttribute(k,v){this.attrs[k]=v}
  addEventListener(k,f){(this.events[k]??=[]).push(f)}
  fire(k){for(const f of this.events[k]||[])f({type:k})}
  getBoundingClientRect(){return{width:this.width,height:600}}
  querySelector(q){return q==='.hero-text'?heroText:q==='.hero-art'?heroArt:null}
 }
 const hero=new Node(),heroText=new Node(),heroArt=new Node(),picker=new Node();
 hero.children=[heroText,heroArt];picker.value='neon-studio';
 const body=new Node('body');body.dataset.theme='neon-studio';body.dataset.atmosphereTier='cinematic';
 const doc={body,visibilityState:'visible',getElementById:id=>id==='theme-select'?picker:null,
  querySelector:q=>q==='main > .hero'?hero:null,createElement:tag=>new Node(tag),listeners:{},
  addEventListener(k,f){(this.listeners[k]??=[]).push(f)}};
 const media={};
 const win={PORTFOLIO_PREVIEW_MODE:opts.preview!==false,events:{},
  matchMedia(q){if(!media[q])media[q]={matches:!!opts.reduced&&q.includes('reduced-motion'),events:[],
   addEventListener(k,f){this.events.push(f)}};return media[q]},
  addEventListener(k,f){(this.events[k]??=[]).push(f)}};
 const navigator={deviceMemory:opts.mem??8,hardwareConcurrency:opts.cores??8,
  connection:{saveData:!!opts.saveData,addEventListener(){}}};
 const raf=[],mutation=[],resizes=[],intersections=[];
 const globals={window:win,document:doc,navigator,Promise,
  requestAnimationFrame:f=>{raf.push(f);return raf.length},
  MutationObserver:class{constructor(f){mutation.push(f)}observe(){}},
  ResizeObserver:class{constructor(f){resizes.push(f)}observe(){}},
  IntersectionObserver:class{constructor(f){intersections.push(f)}observe(){}}
 };
 runInNewContext(js,globals,{timeout:2000});
 const flush=()=>{let i=0;while(raf.length&&i++<12)raf.shift()()};
 const update=()=>{for(const f of mutation)f();flush()};
 return{win,doc,body,hero,heroArt,heroText,picker,media,flush,update,resize:n=>{hero.width=n;for(const f of resizes)f();flush()},
  intersect:v=>{for(const f of intersections)f([{isIntersecting:v}]);flush()},globals};
}
const app=scenario();
const api=app.win.__wsHeroDisplay327;
test('Preview initialization',!!api);
test('One stage is mounted',app.hero.children.filter(x=>x.className==='hd-stage').length===1);
test('Accessibility stage aria-hidden',app.hero.children[0].attrs['aria-hidden']==='true');
test('Original content nodes preserved',app.hero.children[1]===app.heroText&&app.hero.children[2]===app.heroArt);
test('Initial Neon profile',api.getStatus().theme==='neon-studio'&&api.getStatus().composition==='neon');
test('Six modules exposed',api.getStatus().modules.length===6);
const pairs=[['orbit','orbit'],['editorial','editorial'],['terminal','terminal'],['aurora-peak','alpine'],['neon-studio','neon'],['design-2','cosmic']];
const captions=[];
for(const [theme,variant] of pairs){
 app.body.dataset.theme=theme;app.picker.value=theme;app.picker.fire('change');app.update();
 test('Runtime theme '+theme,api.getStatus().theme===theme&&api.getStatus().composition===variant);
 captions.push(app.hero.children[0].children[6].children[0].textContent);
}
test('Distinct themed display captions',new Set(captions).size===6);
test('Theme switching never replaces portrait',app.hero.children[2]===app.heroArt&&app.heroArt.dataset.hdPortrait==='original');
app.resize(760);test('Tablet layout reporting',api.getStatus().density==='stacked');
app.resize(470);test('Mobile layout reporting',api.getStatus().density==='compact');
app.resize(1200);test('Desktop restored',api.getStatus().density==='wide');
app.body.dataset.atmosphereTier='off';app.update();
test('Atmosphere Off limits motion',api.getStatus().motion==='still');
app.body.dataset.atmosphereTier='cinematic';app.update();
test('Atmosphere resumed',api.getStatus().motion==='ambient');
app.body.dataset.atmosphereTier='eco';app.update();
test('Eco disables additional hero animation',api.getStatus().motion==='still');
app.body.dataset.atmosphereTier='cinematic';app.update();
const reduced=Object.entries(app.media).find(([k])=>k.includes('reduced-motion'))?.[1];
if(reduced){reduced.matches=true;for(const fn of reduced.events)fn();app.flush()}
test('Reduced motion disables motion',api.getStatus().motion==='still');
if(reduced){reduced.matches=false;for(const fn of reduced.events)fn();app.flush()}
app.intersect(false);test('Offscreen animation suspended',api.getStatus().motion==='still');
app.intersect(true);test('Visible animation resumes',api.getStatus().motion==='ambient');
test('No duplicate decoration after switches',app.hero.children.filter(x=>x.className==='hd-stage').length===1);
const low=scenario({mem:1,cores:2});
test('Low spec device remains still',low.win.__wsHeroDisplay327.getStatus().motion==='still');
const saver=scenario({saveData:true});
test('Data saver remains still',saver.win.__wsHeroDisplay327.getStatus().motion==='still');
const blocked=scenario({preview:false});
test('Non-preview is not modified',!blocked.win.__wsHeroDisplay327&&blocked.hero.children.length===2);
runInNewContext(js,app.globals,{timeout:2000});
test('Script idempotence',app.hero.children.filter(x=>x.className==='hd-stage').length===1);
console.log('PASS '+checks.length+'/'+checks.length+' Hero Display source & simulated browser tests. Real visuals not certified.');
