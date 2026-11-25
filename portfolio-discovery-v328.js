/* Portfolio Discovery Engine v3.28 — original-language indexed search, robust category filters, accessible optional sorting. Public DOM only. */
(()=>{'use strict';if(window.__wsPortfolio328)return;
const section=document.getElementById('projects'),grid=section?.querySelector('.project-grid');
if(!grid||section.querySelector('[data-project-discovery]'))return;
const cards=[...grid.querySelectorAll('article.project')];if(cards.length<2)return;
const el=(tag,cls,txt)=>{const x=document.createElement(tag);if(cls)x.className=cls;if(txt!==undefined)x.textContent=txt;return x};
const norm=s=>String(s||'').normalize('NFKD').toLocaleLowerCase().replace(/[\u0300-\u036f]/g,'').trim();
const index=cards.map((card,i)=>{
 const original=norm(card.textContent),title=norm(card.querySelector('h3')?.textContent);
 const type=norm(card.querySelector('.project-type')?.textContent);
 const subject=type+' '+original+' '+norm(card.dataset.focus||'');
 return{card,i,title,original,focus:{
  linux:/linux|desktop|system|shell|kernel|task|mint/.test(subject),
  ai:/\bai\b|video|media|animation|image|model|vector|generator/.test(subject),
  web:/web|site|portfolio|app|cloud|studio|front.?end/.test(subject)
 }};
});
const panel=el('div','project-discovery');panel.dataset.projectDiscovery='';
panel.setAttribute('role','search');panel.setAttribute('aria-label','Explore projects');
const label=el('label','','Find a project');label.htmlFor='portfolio-project-search';
const input=el('input');input.id='portfolio-project-search';input.type='search';input.autocomplete='off';
input.placeholder='Search by project, skill or technology';input.setAttribute('aria-controls','portfolio-project-grid');
const focus=el('select');focus.setAttribute('aria-label','Filter projects by focus');
for(const [value,name] of [['all','All disciplines'],['linux','Linux & desktop'],['ai','AI & media'],['web','Web & apps']]){
 const o=el('option','',name);o.value=value;focus.append(o);
}
const sort=el('select','project-sort');sort.setAttribute('aria-label','Sort projects');
for(const [value,name] of [['original','Featured order'],['az','Name A–Z']]){
 const o=el('option','',name);o.value=value;sort.append(o);
}
const reset=el('button','project-filter-reset','Clear filters');reset.type='button';
const status=el('p','project-discovery-status');status.setAttribute('role','status');
status.setAttribute('aria-live','polite');status.setAttribute('aria-atomic','true');
panel.append(label,input,focus,sort,reset,status);grid.id='portfolio-project-grid';grid.before(panel);
let shown=cards.length,previous='',lastSort='';
const count=()=>({shown,total:index.length,focus:focus.value,sort:sort.value,query:input.value.trim()});
function update(){
 const terms=norm(input.value).split(/\s+/).filter(Boolean),kind=focus.value;let visible=0;
 for(const row of index){
  const haystack=row.original+' '+norm(row.card.textContent);
  const match=(kind==='all'||Boolean(row.focus[kind]))&&terms.every(t=>haystack.includes(t));
  row.card.hidden=!match;if(match)visible++;
 }
 shown=visible;
 const ordering=sort.value==='az'?index.slice().sort((a,b)=>a.title.localeCompare(b.title)):index;
 if(sort.value!==lastSort){for(const row of ordering)grid.append(row.card);lastSort=sort.value;}
 const message=visible===0?'No matching projects. Try a different search.':visible+' of '+index.length+' projects shown';
 if(status.textContent!==message)status.textContent=message;
 reset.disabled=!input.value&&focus.value==='all'&&sort.value==='original';
 const signature=visible+'|'+kind+'|'+sort.value+'|'+input.value;
 if(signature!==previous){previous=signature;window.dispatchEvent(new CustomEvent('ws-portfolio-filter-change',{detail:count()}))}
}
input.addEventListener('input',update);
input.addEventListener('keydown',e=>{if(e.key==='Escape'&&input.value){input.value='';update();e.stopPropagation()}});
focus.addEventListener('change',update);sort.addEventListener('change',update);
reset.addEventListener('click',()=>{input.value='';focus.value='all';sort.value='original';update();input.focus()});
document.addEventListener('profile-language-change',()=>Promise.resolve().then(update));
window.__wsPortfolio328=Object.freeze({
 getStatus:()=>Object.freeze(count()),
 focusSearch:()=>{input.focus();input.scrollIntoView({block:'center',behavior:window.matchMedia?.('(prefers-reduced-motion:reduce)').matches?'auto':'smooth'})},
 reset:()=>{input.value='';focus.value='all';sort.value='original';update()},
 setFocus:kind=>{if(!['all','linux','ai','web'].includes(kind))return false;focus.value=kind;update();return true},
 setSort:order=>{if(!['original','az'].includes(order))return false;sort.value=order;update();return true},
 search:query=>{if(typeof query!=='string')return false;input.value=query.slice(0,120);update();return true},
 capabilities:Object.freeze(['search','focus-filter','name-sort','reset','keyboard','public-only']),
 version:'3.30.0'
});
update();
})();