/* GitHub hero explorer v3.24: source and mocked-browser regression suite.
 * Run node scripts/verify-github-hero-v324.mjs
 * Source/mocked tests, not a live GitHub API or real-browser rendering certification.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script,runInNewContext} from 'node:vm';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const js=read('github-hero-explorer-v324.js'),css=read('github-hero-explorer-v324.css'),html=read('index.html');
const pass=[];
function check(name,ok){assert.ok(ok,name);pass.push(name)}
check('Script syntax',Boolean(new Script(js)));
check('CSS balanced',(css.match(/{/g)||[]).length===(css.match(/}/g)||[]).length);
check('JS asset linked',html.includes('github-hero-explorer-v324.js?v=3.24.0'));
check('CSS asset linked',html.includes('github-hero-explorer-v324.css?v=3.24.0'));
check('Fallback anchor exists',html.includes('<a class="button" href="https://github.com/sudipdasin"'));
check('Only public repositories accepted',js.includes('entry.private===true')&&js.includes('entry.fork===true')&&js.includes('entry.archived===true'));
check('Owner checked',js.includes("entry.owner.login.toLowerCase()!==OWNER"));
check('No private GitHub account API',!js.includes('Authorization')&&!js.includes('api.github.com/user/repos'));
check('No mutations or telemetry',!js.includes("method:'POST'")&&!js.includes('sendBeacon'));
check('On-demand public API read',js.includes("shell.addEventListener('pointerenter'")&&js.includes('void load()'));
check('Session cache throttling',js.includes('sessionStorage')&&js.includes('10*60*1000'));
check('Descriptions rendered as text',js.includes("CREATE('p','gh-repo-description',repo.description)"));
check('All six theme skins',['neon-studio','orbit','editorial','terminal','aurora-peak','design-2'].every(t=>css.includes('data-theme="'+t+'"')));
check('Reduced motion respected',css.includes('prefers-reduced-motion:reduce'));
check('Atmosphere Off hides shimmer',css.includes('data-atmosphere-tier="off"'));
check('Keyboard Escape handling',js.includes("event.key==='Escape'"));
check('Mobile constraints',css.includes('max-width:420px'));
check('Preview security maintained',html.includes('window.PUBLIC_API_BASE=""')&&html.includes('noindex,nofollow,noarchive'));
class N {
 constructor(tag='div'){this.tag=tag;this.className='';this.children=[];this.events={};this.attrs={};this.dataset={};
 this.href='';this.textContent='';this.hidden=false;this.scrollHeight=340;this.parent=null;this.hover=false;
 this.vars={};this.style={setProperty:(k,v)=>this.vars[k]=v};
 this.classList={add:k=>{if(!this.className.split(' ').includes(k))this.className=(this.className+' '+k).trim()},
 remove:k=>this.className=this.className.split(' ').filter(x=>x!==k).join(' '),
 toggle:(k,flag)=>flag?this.classList.add(k):this.classList.remove(k),
 contains:k=>this.className.split(' ').includes(k)};}
 append(...a){for(const n of a){this.children.push(n);n.parent=this}}
 replaceChildren(...a){this.children=[];this.append(...a)}
 replaceWith(n){this.replacement=n;n.parent=this.parent}
 setAttribute(k,v){this.attrs[k]=v}
 addEventListener(k,f){(this.events[k]??=[]).push(f)}
 fire(k,extra={}){for(const f of this.events[k]||[])f({type:k,preventDefault(){},relatedTarget:null,...extra})}
 getBoundingClientRect(){return{left:330,right:545,top:240,bottom:293,width:this.tag==='section'?455:215,height:53}}
 contains(n){return n===this||this.children.some(x=>x.contains?.(n))}
 querySelector(q){
  const find=(n,fn)=>{if(fn(n))return n;for(const c of n.children){const v=find(c,fn);if(v)return v}return null};
  if(q==='a')return find(this,n=>n.tag==='a');
  if(q==='small')return find(this,n=>n.tag==='small');
  return null;
 }
 matches(q){return q===':hover'?this.hover:false}
 focus(){this.doc.activeElement=this;this.fire('focus')}
}
const repoData=[
{name:'LinWin',owner:{login:'sudipdasin'},private:false,fork:false,archived:false,description:'Linux shell',language:'C++',stargazers_count:12,pushed_at:'2026-11-21T00:00:00Z'},
{name:'ivivid',owner:{login:'sudipdasin'},private:false,fork:false,archived:false,description:'Creative tools',language:'C++',stargazers_count:5,pushed_at:'2026-11-19T00:00:00Z'},
{name:'hidden-pro',owner:{login:'sudipdasin'},private:true,fork:false,archived:false,description:'PRIVATE',language:'Python',stargazers_count:800,pushed_at:'2026-11-22T00:00:00Z'},
{name:'foreign',owner:{login:'someoneelse'},private:false,fork:false,archived:false,description:'Wrong owner',language:'C',stargazers_count:800,pushed_at:'2026-11-22T00:00:00Z'}
];
class SafeURL{constructor(url){const m=String(url).match(/^https:\/\/([^/]+)(\/[^?#]*)/);if(!m)throw new Error('bad URL');this.hostname=m[1];this.pathname=m[2]}}
function setup({offline=false,cache=null,hover=true}={}){
 const anchor=new N('a'),projects=[
  {name:'LinWin',description:'Local Linux shell'},{name:'ivivid',description:'Creative tools'},
  {name:'tux-steward',description:'Linux system manager'}
 ].map(x=>({querySelector:q=>q.startsWith('a.project-link')?{href:'https://github.com/sudipdasin/'+x.name}:q==='p'?{textContent:x.description}:null}));
 const doc={activeElement:null,events:{},
  querySelector:q=>q==='.hero .actions a[href="https://github.com/sudipdasin"]'?anchor:null,
  querySelectorAll:q=>q==='#projects .project'?projects:[],
  createElement:t=>{const node=new N(t);node.doc=doc;return node},
  addEventListener(k,f){(this.events[k]??=[]).push(f)}
 };
 anchor.doc=doc;
 const win={innerWidth:1200,innerHeight:740,events:{},
  matchMedia:()=>({matches:hover}),addEventListener(k,f){(this.events[k]??=[]).push(f)}};
 const store=cache||new Map();
 const sessionStorage={getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)};
 const calls=[];
 const fetch=async url=>{calls.push(url);return offline?{ok:false,status:403}:
   {ok:true,json:async()=>url.endsWith('/repos?type=owner&sort=pushed&per_page=100')?
     repoData:{public_repos:15,bio:'Technology builder'}}};
 runInNewContext(js,{window:win,document:doc,sessionStorage,fetch,URL:SafeURL,
   setTimeout:()=>1,clearTimeout:()=>{},AbortController:class{constructor(){this.signal={}}abort(){}}},{timeout:1800});
 const shell=anchor.replacement;
 return{shell,trigger:shell.children[0],panel:shell.children[1],store,doc,win,calls};
}
async function settle(){for(let i=0;i<45;i++)await Promise.resolve()}
const live=setup();
check('No network request on page load',live.calls.length===0);
check('Initial state collapsed',live.panel.hidden&&live.trigger.attrs['aria-expanded']==='false');
live.shell.fire('pointerenter');await settle();
check('Hover reveals panel',!live.panel.hidden&&live.trigger.attrs['aria-expanded']==='true');
check('Public GitHub endpoints called on hover',live.calls.length===2);
check('Profile public repository count displayed',live.panel.children[2].children[0].children[1].textContent==='15');
check('Only valid public repositories listed',live.panel.children[4].children.length===2);
check('Private and foreign star totals excluded',live.panel.children[2].children[1].children[1].textContent==='17');
check('Session cache created',live.store.size===1);
const links=live.panel.children[4].children.map(li=>li.children[0].href);
check('Repository links remain GitHub owner-scoped',links.every(x=>x.startsWith('https://github.com/sudipdasin/')));
live.trigger.fire('click');check('Click pins preview',live.win.__wsGithubHero324.getStatus().pinned);
live.shell.fire('keydown',{key:'Escape'});check('Escape closes preview',live.panel.hidden);
check('Escape returns focus to trigger',live.doc.activeElement===live.trigger);
check('Escape focus event does not reopen disclosure',live.panel.hidden&&live.trigger.attrs['aria-expanded']==='false');
live.trigger.fire('click');
live.doc.events.pointerdown?.[0]({target:new N()});
check('Outside click dismisses preview',live.panel.hidden);
const count=live.calls.length;
live.trigger.fire('click');await settle();
check('Reopen does not refetch cached response',live.calls.length===count);
const cached=setup({cache:live.store});cached.trigger.fire('click');await settle();
check('Page reload reuses fresh cache',cached.calls.length===0&&cached.win.__wsGithubHero324.getStatus().loaded);
const offline=setup({offline:true,hover:false});offline.trigger.fire('click');await settle();
check('Rate limit shows portfolio fallback',offline.panel.children[4].children.length===3);
check('Rate limit does not invent metrics',offline.panel.children[2].children[0].children[1].textContent==='—');
check('Fallback status explains data unavailable',offline.panel.children[5].textContent.includes('rate-limited'));
console.log('PASS '+pass.length+'/'+pass.length+' GitHub hero source and simulated browser checks; live review pending.');
