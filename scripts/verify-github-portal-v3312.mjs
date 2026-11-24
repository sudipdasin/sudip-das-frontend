#!/usr/bin/env node
/* WebStudio v3.31.2 GitHub overlay source/interaction checks.
 * Offline and manually invoked. No browser, network, hosted CI or deployments.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const read=(path)=>fs.readFileSync(new URL('../'+path,import.meta.url),'utf8');
const js=read('github-hero-explorer-v324.js');
const css=read('github-hero-portal-v3312.css');
const html=read('index.html');
new vm.Script(js,{filename:'github-hero-explorer-v324.js'});
const tests={};
const check=(name,condition)=>{assert.ok(condition,name);tests[name]=true;console.log('PASS '+name)};
class NodeStub {
 constructor(tag='div',cls=''){
  this.tagName=tag.toUpperCase();this.className=cls;this.children=[];
  this.parentElement=null;this.handlers={};this.dataset={};this.attrs={};
  this.hidden=false;this.scrollHeight=300;
  this.style={properties:{},setProperty:(k,v)=>this.style.properties[k]=String(v),
   removeProperty:k=>delete this.style.properties[k]};
  this.classList={
   add:(...args)=>{const names=new Set(this.className.split(' ').filter(Boolean));args.forEach(x=>names.add(x));this.className=[...names].join(' ')},
   remove:(...args)=>{const names=new Set(this.className.split(' ').filter(Boolean));args.forEach(x=>names.delete(x));this.className=[...names].join(' ')},
   contains:x=>this.className.split(' ').includes(x),
   toggle:(x,enabled)=>enabled?this.classList.add(x):this.classList.remove(x)
  };
 }
 remove(){if(this.parentElement){this.parentElement.children=this.parentElement.children.filter(x=>x!==this);this.parentElement=null}}
 append(...nodes){for(const n of nodes){n.remove();this.children.push(n);n.parentElement=this}}
 replaceWith(n){
  const parent=this.parentElement,index=parent.children.indexOf(this);
  this.remove();n.remove();parent.children.splice(index,0,n);n.parentElement=parent;
 }
 replaceChildren(...nodes){this.children=[];this.append(...nodes)}
 setAttribute(k,v){this.attrs[k]=String(v)}
 addEventListener(k,fn){(this.handlers[k]??=[]).push(fn)}
 dispatch(k,args={}){for(const fn of this.handlers[k]||[])fn({type:k,target:this,...args})}
 contains(n){return this===n||this.children.some(x=>x.contains(n))}
 closest(){return hero}
 matches(){return false}
 querySelector(selector){
  if(selector==='small')return this.children.flatMap(x=>[x,...x.children]).find(x=>x.tagName==='SMALL')||null;
  if(selector==='a'){const first=n=>n.tagName==='A'?n:n.children.map(first).find(Boolean);return first(this)}
  return null;
 }
 getBoundingClientRect(){
  return this.tagName==='BUTTON'?{left:164,right:362,top:328,bottom:382,width:198,height:54}:{width:420,height:300};
 }
 focus(){documentStub.activeElement=this;this.dispatch('focus')}
}
const body=new NodeStub('body','ws-parity');
const main=new NodeStub('main');
const hero=new NodeStub('div','hero hd-hero');
const actions=new NodeStub('div','actions');
const original=new NodeStub('a');
const picker=new NodeStub('select');
picker.value='neon-studio';body.dataset.theme='neon-studio';
body.append(main);main.append(hero);hero.append(actions);actions.append(original);
const documentStub={
 body,documentElement:{clientWidth:1420,clientHeight:927},activeElement:body,handlers:{},
 createElement:tag=>new NodeStub(tag),
 getElementById:id=>id==='theme-select'?picker:null,
 querySelector:selector=>selector.startsWith('.hero .actions a')?original:null,
 querySelectorAll:()=>[],
 addEventListener(k,fn){(this.handlers[k]??=[]).push(fn)},
 dispatch(k,args){for(const fn of this.handlers[k]||[])fn(args)}
};
let onMutation;
class MutationObserverStub {constructor(fn){onMutation=fn}observe(){}disconnect(){}}
const windowStub={innerWidth:1420,innerHeight:927,matchMedia:()=>({matches:false}),addEventListener(){}};
vm.runInNewContext(js,{
 window:windowStub,document:documentStub,fetch:undefined,
 MutationObserver:MutationObserverStub,sessionStorage:{getItem:()=>null},
 setTimeout:()=>1,clearTimeout:()=>{}
});
const shell=actions.children[0],trigger=shell.children[0],panel=shell.children[1];
const api=windowStub.__wsGithubHero324;
check('Explorer initialized',Boolean(api));
check('Panel starts attached to its trigger',panel.parentElement===shell);
for(const id of ['orbit','editorial','terminal','aurora-peak','neon-studio','design-2']){
 picker.value=id;body.dataset.theme=id;trigger.dispatch('click');
 const state=api.getStatus();
 check(id+' opens with isolated viewport portal',state.open&&state.portaled&&state.theme===id&&
  panel.parentElement===body&&typeof panel.style.left==='string'&&panel.style.left.endsWith('px'));
 check(id+' has independent native palette',css.includes('data-gh-theme="'+id+'"'));
 trigger.dispatch('click');
 check(id+' closes and restores DOM',!api.getStatus().open&&
  panel.parentElement===shell&&panel.hidden&&panel.dataset.ghTheme===undefined);
}
picker.value='design-2';body.dataset.theme='design-2';trigger.dispatch('click');
picker.value='neon-studio';body.dataset.theme='neon-studio';onMutation();
check('Theme changes synchronize while menu is open',panel.dataset.ghTheme==='neon-studio');
documentStub.dispatch('pointerdown',{target:body});
check('Click outside dismisses popup',!api.getStatus().open);
check('Keyboard escape supported in portal',Boolean(panel.handlers.keydown?.length));
check('Portal CSS braces balanced',css.split('{').length===css.split('}').length);
check('Previous hero elevation sheets not loaded',
 !html.includes('href="editorial-github-layer-v331.css')&&
 !html.includes('href="github-hero-layer-v3311.css'));
check('Versioned portal stylesheet linked',html.includes('href="github-hero-portal-v3312.css?v=3.31.2"'));
console.log(Object.keys(tests).length+'/'+Object.keys(tests).length+
 ' offline checks passed; actual Cloudflare and browser verification NOT RUN.');
