/* Scroll-aware, ten-language breadcrumbs; no trackers or network requests. */
(()=>{
'use strict';
const nav=document.getElementById('ws-smart-breadcrumb');if(!nav)return;
const steps=[['top','Introduction',null],['about','About','nav.0'],['projects','Projects','nav.1'],['experience','Experience','nav.2'],['capabilities','Strengths','nav.3'],['contact','Contact','nav.4']];
const word={
en:['Introduction','Next','You are here'],hi:['परिचय','आगे','आप यहाँ हैं'],bn:['পরিচিতি','পরবর্তী','আপনি এখানে'],es:['Introducción','Siguiente','Estás aquí'],fr:['Présentation','Suivant','Vous êtes ici'],de:['Einführung','Weiter','Sie sind hier'],pt:['Introdução','Próximo','Você está aqui'],ar:['مقدمة','التالي','أنت هنا'],'zh-CN':['简介','下一步','当前位置'],ja:['紹介','次へ','現在の場所']};
const home=nav.querySelector('.ws-crumb-home'),current=nav.querySelector('.ws-crumb-current'),sep=nav.querySelector('.ws-crumb-divider'),next=nav.querySelector('.ws-crumb-next');
function now(){
const terminal=document.body.dataset.theme==='terminal'?document.body.dataset.terminalSection:null;
if(terminal&&steps.some(s=>s[0]===terminal))return terminal;
let active='top';const p=window.innerHeight*.36;
for(const [id] of steps.slice(1)){const el=document.getElementById(id);if(!el)continue;const b=el.getBoundingClientRect();if(b.top<=p&&b.bottom>p)active=id}
if(window.innerHeight+window.scrollY>=document.documentElement.scrollHeight-10)return 'contact';
return active;
}
function update(){
const locale=window.profileI18n?.locale||'en',words=word[locale]||word.en;
const id=now(),ix=steps.findIndex(s=>s[0]===id),stage=steps[Math.max(0,ix)];
const label=step=>step[2]?window.profileI18n?.get(step[2])||step[1]:words[0];
const labelCurrent=label(stage);
home.textContent=words[0];home.setAttribute('aria-current',id==='top'?'page':'false');
current.textContent=labelCurrent;current.hidden=id==='top';sep.hidden=id==='top';
nav.setAttribute('aria-label',words[2]+': '+labelCurrent);nav.dataset.currentSection=id;
const upcoming=steps[ix+1];
if(upcoming&&document.getElementById(upcoming[0])){
next.hidden=false;next.href='#'+upcoming[0];next.textContent=words[1]+': '+label(upcoming)+' ↗';
next.setAttribute('aria-label',words[1]+': '+label(upcoming));
}else next.hidden=true;
}
let pending=false;
function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;update()})}
window.addEventListener('scroll',schedule,{passive:true});
window.addEventListener('resize',schedule,{passive:true});
window.addEventListener('hashchange',schedule);
document.addEventListener('profile-language-change',schedule);
new MutationObserver(schedule).observe(document.body,{attributes:true,attributeFilter:['data-theme','data-terminal-section']});
update();
})();