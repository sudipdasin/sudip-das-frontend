/* Public-DOM-only live summaries. No API, timers, or private data. */
(()=>{'use strict';
const grid=document.querySelector('#projects .project-grid');
if(!grid||window.__wsSmartLanding)return;
const words={en:['Projects','Featured project','No matching projects'],hi:['परियोजनाएँ','चुनिंदा परियोजना','कोई मिलती परियोजना नहीं'],bn:['প্রকল্প','নির্বাচিত প্রকল্প','কোনো মিল নেই'],es:['Proyectos','Proyecto destacado','Sin coincidencias'],fr:['Projets','Projet à la une','Aucun résultat'],de:['Projekte','Projekt im Fokus','Keine Treffer'],pt:['Projetos','Projeto em destaque','Sem resultados'],ar:['المشاريع','مشروع مميز','لا توجد نتائج مطابقة'],'zh-CN':['项目','精选项目','没有匹配的项目'],ja:['プロジェクト','注目のプロジェクト','一致するプロジェクトなし']};
const make=(tag,cls)=>{const n=document.createElement(tag);n.className=cls;return n};
const put=(node,value)=>{if(node.textContent!==value)node.textContent=value};
function render(){
 const locale=document.documentElement.lang||'en',lang=words[locale]||words[locale.split('-')[0]]||words.en;
 const cards=[...grid.querySelectorAll('article.project')],visible=cards.filter(c=>!c.hidden),fmt=new Intl.NumberFormat(locale);
 const feature=document.querySelector('#portfolio-feature-title')?.textContent?.trim();
 const featured=visible.find(c=>c.querySelector('h3')?.textContent?.trim()===feature)||visible[0];
 for(const [selector,isPortfolio] of [['.hero .actions a[href="#projects"]',false],['.hero .actions .portfolio-gallery-hero-launch',true]]){
  const button=document.querySelector(selector);if(!button)continue;
  let summary=button.querySelector('.ws-live-summary');
  if(!summary){summary=make('span','ws-live-summary');summary.append(make('span','ws-live-count'),make('strong','ws-live-name'));button.append(summary);button.classList.add('ws-live-action');}
  const card=isPortfolio?featured:visible[0];
  put(summary.firstElementChild,fmt.format(visible.length)+(visible.length!==cards.length?' / '+fmt.format(cards.length):'')+' '+lang[0]);
  put(summary.lastElementChild,card?((isPortfolio?lang[1]+': ':'')+(card.querySelector('h3')?.textContent?.trim()||'')):lang[2]);
 }
}
let pending=false;function schedule(){if(pending)return;pending=true;requestAnimationFrame(()=>{pending=false;render()})}
new MutationObserver(schedule).observe(grid,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});
const stage=document.getElementById('profile-showcase');if(stage)new MutationObserver(schedule).observe(stage,{subtree:true,childList:true,characterData:true});
document.addEventListener('profile-language-change',schedule);window.addEventListener('ws-portfolio-filter-change',schedule);
window.__wsSmartLanding=Object.freeze({refresh:render});render();
})();
