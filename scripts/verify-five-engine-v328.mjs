/* v3.28 coordinated engine integration regression. Run:
 * node scripts/verify-five-engine-v328.mjs
 * These are source and synthetic DOM checks, not deployed-device certification.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const html=read('index.html');
const files=['webstudio-engine-mesh-v328.js','portfolio-discovery-v328.js','atmosphere-engine-v328.js',
 'atmosphere-shaders-v325.js','atmosphere-audio-v328.js','hero-display-engine-v327.js',
 'personal-quick-hub-v2.js','personal-translation-expansion-v1.js','human-ci-preview-v1.js',
 'preview-theme-audit-v316.js','preview-diagnostics-v321.js'];
const style=['webstudio-engine-mesh-v328.css','atmosphere-audio-v328.css','hero-display-layout-v327.css'];
const data=Object.fromEntries([...files,...style].map(p=>[p,read(p)]));
const assertions=[];
function ok(name,condition){assert.ok(condition,name);assertions.push(name)}
for(const p of files)ok('JS syntax '+p,Boolean(new Script(data[p])));
for(const p of style)ok('CSS balance '+p,(data[p].match(/{/g)||[]).length===(data[p].match(/}/g)||[]).length);
const themes=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
ok('Six visual style contracts',themes.every(t=>data[style[0]].includes('data-theme="'+t+'"')));
ok('Six unique accent palette entries',new Set([...data[files[0]].matchAll(/accent:'(#[a-f0-9]{6})'/g)].map(x=>x[1])).size===6);
ok('Shared mesh connects hero',data[files[0]].includes('__wsHeroDisplay327'));
ok('Shared mesh connects Atmosphere',data[files[0]].includes('__wsAtmosphere323'));
ok('Shared mesh connects Portfolio API',data[files[0]].includes('__wsPortfolio328?.getStatus'));
ok('Quick menu calls portfolio search',data[files[6]].includes('__wsPortfolio328.focusSearch'));
ok('Project search retains original-language index',data[files[1]].includes("row.original+' '+norm(row.card.textContent)"));
ok('Project sort is deterministic',data[files[1]].includes('a.title.localeCompare(b.title)'));
ok('Atmosphere GPU pointer uniform',data[files[2]].includes('gl.uniform2f(uniforms.pointer'));
ok('Atmosphere shader scroll progress',data[files[3]].includes('uniform float u_scroll'));
ok('Audio strictly opt-in',data[files[4]].includes('let ctx=null')&&data[files[4]].includes('async function ready()'));
ok('Original audio six profiles',(data[files[4]].match(/intervals:\[/g)||[]).length===6);
ok('Audio no network or telemetry',!data[files[4]].includes('fetch(')&&!data[files[4]].includes('sendBeacon'));
ok('All current assets linked',['webstudio-engine-mesh-v328.js','portfolio-discovery-v328.js','atmosphere-engine-v328.js','atmosphere-audio-v328.js',
 'webstudio-engine-mesh-v328.css','atmosphere-audio-v328.css'].every(p=>html.includes(p+'?v=3.28.0')));
ok('Old engine files not linked',!html.includes('atmosphere-engine-v323.js')&&!html.includes('portfolio-discovery-v1.js'));
ok('Human CI checklist enlarged',data['human-ci-preview-v1.js'].includes('0/42'));
ok('Preview noindex, disabled private API',html.includes('noindex,nofollow,noarchive')&&html.includes('window.PUBLIC_API_BASE=""'));
const translate=data['personal-translation-expansion-v1.js'];
const declarations=translate.slice(translate.indexOf('const rows='),translate.indexOf('const map=new Map('));
const dictionary=new Function(declarations+'return {engineRows,githubRows}')();
ok('Thirty-eight new engine translations',dictionary.engineRows.length===38);
ok('Twenty-six GitHub and quick translations',dictionary.githubRows.length===26);
const words=[...dictionary.engineRows,...dictionary.githubRows];
ok('All 64 rows have ten translated columns',words.length===64&&words.every(r=>r.length===10&&r.every(x=>typeof x==='string'&&x.length)));
ok('No repeated new phrase keys',new Set(words.map(r=>r[0])).size===words.length);
ok('Form-control placeholder bug corrected',translate.includes('Form controls are excluded'));
const dyn=translate.slice(translate.indexOf('function translateDynamic('),translate.indexOf('function translate(str,locale)'));
const dynamic=new Function(dyn+'return translateDynamic')();
for(const locale of ['hi','bn','es','fr','de','pt','ar','zh-CN','ja']){
 ok('Localized count '+locale,dynamic('3 of 6 projects shown',locale)!=='3 of 6 projects shown');
 ok('Localized progress '+locale,dynamic('34% viewed',locale)!=='34% viewed');
}
class N{
 constructor(){this.dataset={};this.listeners={};this.styles={};this.children=[];this.value='';this.hidden=true;
 this.style={setProperty:(k,v)=>{this.styles[k]=v}}}
 append(...els){this.children.push(...els)}
 setAttribute(){}
 addEventListener(k,f){(this.listeners[k]??=[]).push(f)}
 fire(k,event={}){for(const fn of this.listeners[k]||[])fn({type:k,target:this,...event})}
 focus(){this.focused=true}
 querySelector(s){return s==='[role="tab"]'?{focus:()=>{this.tabFocused=true}}:null}
 closest(){return null}
}
const body=new N(),picker=new N(),menu=new N(),menuButton=new N();
const projects=new N(),hero=new N();body.dataset.theme='neon-studio';body.dataset.atmosphereTier='cinematic';
picker.value='neon-studio';picker.options=themes.map(value=>({value,disabled:false}));
let clickCount=0;
menuButton.click=()=>{clickCount++;menu.hidden=!menu.hidden};
const doc={body,listeners:{},getElementById:id=>({
 'theme-select':picker,'ws-visitor-quick-panel':menu,'ws-visitor-quick-open':menuButton})[id]||null,
 querySelector:s=>s==='#projects'?projects:s==='main > .hero'?hero:null,
 addEventListener(k,f){(this.listeners[k]??=[]).push(f)}};
const events={},win={PORTFOLIO_PREVIEW_MODE:true,
 matchMedia:()=>({matches:false,addEventListener(){}}),
 addEventListener(k,f){(events[k]??=[]).push(f)},
 dispatchEvent(e){for(const f of events[e.type]||[])f(e)}};
const frames=[];const nav={deviceMemory:8,hardwareConcurrency:8,connection:{saveData:false,addEventListener(){}}};
runInNewContext(data[files[0]],{window:win,document:doc,navigator:nav,
 requestAnimationFrame:fn=>{frames.push(fn);return frames.length},
 MutationObserver:class{observe(){}},
 Event:class{constructor(type){this.type=type}},
 CustomEvent:class{constructor(type,o){this.type=type;this.detail=o?.detail}}},{timeout:2000});
const mesh=win.__wsEngineMesh328;
ok('Mesh bootstraps',!!mesh&&mesh.getStatus().themeCount===6);
for(const id of themes){
 body.dataset.theme=id;picker.value=id;picker.fire('change');
 while(frames.length)frames.shift()();
 ok('Switches theme '+id,mesh.getStatus().theme===id&&body.dataset.wsxTheme===id);
}
ok('Theme accent CSS variable is synchronized',Boolean(body.styles['--wsx-accent']));
let prevented=0;
doc.listeners.keydown[0]({altKey:true,shiftKey:true,code:'KeyQ',ctrlKey:false,metaKey:false,repeat:false,
 target:new N(),preventDefault(){prevented++}});
ok('Quick Menu hotkey opens panel',clickCount===1&&!menu.hidden&&prevented===1);
doc.listeners.keydown[0]({key:'Escape',repeat:false,target:new N(),preventDefault(){prevented++}});
ok('Escape closes Quick Menu and restores focus',clickCount===2&&menu.hidden&&menuButton.focused);
// Audio mock: AudioContext creation is forbidden before explicit checkbox change.
class Element{
 constructor(){this.children=[];this.listeners={};this.value='';this.checked=false;this.textContent=''}
 append(...x){this.children.push(...x)}
 setAttribute(){}
 addEventListener(k,f){(this.listeners[k]??=[]).push(f)}
 fire(k){for(const f of this.listeners[k]||[])f({target:this,type:k})}
 contains(x){return this===x}
}
let contexts=0,notes=0;
const aEls={},aHost=new Element(),aDoc={body:{dataset:{theme:'orbit'}},visibilityState:'visible',
 querySelector:s=>s==='#ws-atmosphere-control .ws-atmo-menu'?aHost:null,
 createElement:()=>{const n=new Element();Object.defineProperty(n,'id',{set(v){aEls[v]=n}});return n},
 getElementById:id=>aEls[id],addEventListener(){}};
class Audio{
 constructor(){contexts++;this.state='running';this.currentTime=1;this.destination={}}
 createGain(){return{gain:{value:0,setValueAtTime(){},setTargetAtTime(){},exponentialRampToValueAtTime(){}},connect(){},disconnect(){}}}
 createOscillator(){notes++;return{frequency:{setValueAtTime(){}},connect(){},disconnect(){},start(){},stop(){}}}
 suspend(){this.state='suspended';return Promise.resolve()}
 resume(){this.state='running';return Promise.resolve()}
}
const aWin={PORTFOLIO_PREVIEW_MODE:true,AudioContext:Audio,addEventListener(){}};
runInNewContext(data[files[4]],{window:aWin,document:aDoc,setTimeout:()=>1,clearTimeout:()=>{},Date,Promise},{timeout:2000});
ok('Audio engine mounted',Boolean(aWin.__wsAtmosphereAudio328));
ok('Audio context absent before consent',contexts===0);
ok('Audio switches start unchecked',!aWin.__wsAtmosphereAudio328.getStatus().music&&!aWin.__wsAtmosphereAudio328.getStatus().effects);
const fx=aEls['ws-audio-ui-sounds'];fx.checked=true;fx.fire('change');
for(let i=0;i<18;i++)await Promise.resolve();
ok('Audio context created only on explicit checkbox',contexts===1);
ok('Original UI sound generated',notes>=1);
aWin.__wsAtmosphereAudio328.stop();
ok('Audio stop disables both tracks',!aWin.__wsAtmosphereAudio328.getStatus().effects&&!aWin.__wsAtmosphereAudio328.getStatus().music);
console.log('PASS '+assertions.length+'/'+assertions.length+' five-engine source, locale and mock interaction checks; physical QA pending.');
