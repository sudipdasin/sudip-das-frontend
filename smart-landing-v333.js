/* Smart Landing v3.37 — reversible WebStudio plugin, with standalone adapter for legacy hosts. */
((global)=>{'use strict';if(!global)return;
const words={en:['Projects','Featured project','No matching projects'],hi:['परियोजनाएँ','चुनिंदा परियोजना','कोई मिलती परियोजना नहीं'],bn:['প্রকল্প','নির্বাচিত প্রকল্প','কোনো মিল নেই'],es:['Proyectos','Proyecto destacado','Sin coincidencias'],fr:['Projets','Projet à la une','Aucun résultat'],de:['Projekte','Projekt im Fokus','Keine Treffer'],pt:['Projetos','Projeto em destaque','Sem resultados'],ar:['المشاريع','مشروع مميز','لا توجد نتائج مطابقة'],'zh-CN':['项目','精选项目','没有匹配的项目'],ja:['プロジェクト','注目のプロジェクト','一致するプロジェクトなし']};

const storyLabels={"en":"Featured story","hi":"चुनिंदा कहानी","bn":"নির্বাচিত গল্প","es":"Historia destacada","fr":"Histoire à la une","de":"Projekt im Fokus","pt":"História em destaque","ar":"قصة مميزة","zh-CN":"精选故事","ja":"注目のストーリー"};
const names={en:'Smart Landing',hi:'स्मार्ट लैंडिंग',bn:'স্মার্ট ল্যান্ডিং',es:'Inicio inteligente',fr:'Accueil intelligent',de:'Intelligente Startseite',pt:'Página inicial inteligente',ar:'الواجهة الذكية','zh-CN':'智能首页',ja:'スマートランディング'};
const plugin={id:'smart-landing',version:'3.37.0',priority:20,dependsOn:['hero','portfolio'],
 supports:({root})=>Boolean(root.querySelector('#projects .project-grid')&&root.querySelector('.hero .actions')),
 mount(ctx){
 const doc=ctx.document,root=ctx.root,grid=ctx.select('#projects .project-grid'),actions=ctx.select('.hero .actions');
 const owned=new Map();let frame=null,active=true,last={total:0,shown:0,buttons:0};
 const marker='data-wsp-smart-landing',previous=root.getAttribute(marker);
 const fitMarker='data-wsp-landing-fit',oldFit=root.getAttribute(fitMarker);
 const hero=actions.closest('.hero'),main=hero?.parentElement;
 let fitFrame=null,fitResult={mode:'pending',bottom:0,viewport:0};
 function measure(){
  const candidates=[hero,...(main?.querySelectorAll(':scope > .ticker,:scope > .ws-value-bar,:scope > .ws-aurora-reference .ws-aurora-feature-grid')||[])];
  return Math.ceil(Math.max(0,...candidates.filter(n=>n&&n.getClientRects().length).map(n=>n.getBoundingClientRect().bottom+(global.scrollY||0))));
 }
 function fit(){
  if(!active||!hero)return;
  const viewport=Math.floor(global.visualViewport?.height||global.innerHeight||0);
  if(!viewport)return;
  let bottom=0,mode='fallback';
  for(const level of ['normal','compact','tight']){
   root.setAttribute(fitMarker,level);bottom=measure();
   if(bottom<=viewport-8){mode=level;break}
  }
  // Retain tight spacing if content genuinely exceeds the viewport. Never hide text,
  // scale interactive controls or force clipping merely to claim a fit.
  fitResult={mode,bottom,viewport,overflow:Math.max(0,bottom-viewport)};
 }
 function scheduleFit(){
  if(!active||fitFrame!==null)return;
  fitFrame=global.requestAnimationFrame(()=>{fitFrame=null;fit()});
 }
 ctx.onCleanup(()=>{if(fitFrame!==null)global.cancelAnimationFrame(fitFrame);if(oldFit===null)root.removeAttribute(fitMarker);else root.setAttribute(fitMarker,oldFit)});
 ctx.listen(global,'resize',scheduleFit,{passive:true});
 ctx.listen(global.visualViewport,'resize',scheduleFit,{passive:true});
 ctx.listen(doc,'profile-language-change',scheduleFit);
 ctx.listen(global,'ws-engine-theme-change',scheduleFit);
 ctx.listen(doc.getElementById('theme-select'),'change',scheduleFit);
 if(doc.fonts?.ready)doc.fonts.ready.then(scheduleFit);
 if(global.ResizeObserver&&hero){
  const ro=new global.ResizeObserver(scheduleFit);ro.observe(hero);
  for(const n of main?.querySelectorAll(':scope > .ticker,:scope > .ws-value-bar,:scope > .ws-aurora-reference')||[])ro.observe(n);
  const header=doc.querySelector('.topbar');if(header)ro.observe(header);
  ctx.onCleanup(()=>ro.disconnect());
 }
 root.setAttribute(marker,'active');
 const make=(tag,cls)=>{const n=doc.createElement(tag);n.className=cls;return n};
 const put=(n,v)=>{if(n.textContent!==v)n.textContent=v};
 function release(button,entry){
  entry.summary.remove();entry.visual.remove();
  if(entry.title){entry.title.replaceWith(...entry.title.childNodes);}
  if(entry.description===null)button.removeAttribute('aria-describedby');else button.setAttribute('aria-describedby',entry.description);
  if(!entry.hadClass)button.classList.remove('ws-live-action');
 }
 function build(button,isPortfolio){
  const summary=make('span','ws-live-summary');summary.id=(ctx.uid||'ws-smart-landing')+(isPortfolio?'-portfolio':'-work');
  summary.setAttribute('data-no-translate','');summary.append(make('span','ws-live-count'),make('strong','ws-live-name'));
  const visual=make('span','ws-live-visual '+(isPortfolio?'ws-live-gallery':'ws-live-work'));
  visual.setAttribute('aria-hidden','true');for(let i=0;i<4;i++)visual.append(make('span','ws-live-cell'));
  const titleNodes=[...button.childNodes].filter(n=>n.nodeType===3&&n.textContent.trim());
  let title=null;if(titleNodes.length){title=make('span','ws-live-title');titleNodes[0].before(title);for(const n of titleNodes)title.append(n)}
  const description=button.getAttribute('aria-describedby'),hadClass=button.classList.contains('ws-live-action');
  button.prepend(visual);button.append(summary);button.classList.add('ws-live-action');
  button.setAttribute('aria-describedby',[description,summary.id].filter(Boolean).join(' '));
  return {summary,visual,title,description,hadClass};
 }
 function render(){
 if(!active)return;
 const locale=ctx.locale||doc.documentElement.lang||'en',lang=words[locale]||words.en;
 const cards=[...grid.querySelectorAll('article.project')],visible=cards.filter(c=>!c.hidden),fmt=new Intl.NumberFormat(locale);
 const feature=ctx.select('#portfolio-feature-title')?.textContent?.trim();
 const featured=visible.find(c=>c.querySelector('h3')?.textContent?.trim()===feature)||visible[0];
 for(const [button,entry] of owned)if(!actions.contains(button)){release(button,entry);owned.delete(button)}
 for(const [selector,isPortfolio] of [['a[href="#projects"]',false],['.portfolio-gallery-hero-launch',true]]){
 const button=actions.querySelector(selector);if(!button)continue;
 let entry=owned.get(button);
 if(!entry){entry=build(button,isPortfolio);owned.set(button,entry)}
 const card=isPortfolio?featured:visible[0];
 // Work is a catalog: live breadth and actual public project domains.
 // Portfolio is a curated story: the gallery's currently featured public project.
 const domains=[...new Set(visible.map(c=>c.querySelector('.project-type')?.textContent?.split('·')[0]?.trim()).filter(Boolean))];
 const count=fmt.format(visible.length)+(visible.length!==cards.length?' / '+fmt.format(cards.length):'')+' '+lang[0];
 const title=card?.querySelector('h3')?.textContent?.trim()||'';
 put(entry.summary.firstElementChild,isPortfolio?(storyLabels[locale]||storyLabels.en):count);
 put(entry.summary.lastElementChild,isPortfolio?(title||lang[2]):(domains.slice(0,3).join(' · ')||visible.map(c=>c.querySelector('h3')?.textContent?.trim()).filter(Boolean).slice(0,2).join(' · ')||lang[2]));
 const cells=[...entry.visual.children];cells.forEach((cell,i)=>cell.classList.toggle('is-filled',isPortfolio?Boolean(card)&&i===0:i<Math.ceil(visible.length/Math.max(cards.length,1)*cells.length)));
 }
 last={total:cards.length,shown:visible.length,buttons:owned.size};scheduleFit();
 }
 function schedule(){if(!active||frame!==null)return;frame=global.requestAnimationFrame(()=>{frame=null;render()})}
 function cleanup(){active=false;if(frame!==null)global.cancelAnimationFrame(frame);for(const [button,entry] of owned){release(button,entry)}owned.clear();if(previous===null)root.removeAttribute(marker);else root.setAttribute(marker,previous)}
 ctx.onCleanup(cleanup);
 const observer=new global.MutationObserver(schedule);ctx.onCleanup(()=>observer.disconnect());
 observer.observe(grid,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['hidden']});
 observer.observe(actions,{childList:true});
 const stage=ctx.select('#profile-showcase');if(stage)observer.observe(stage,{subtree:true,childList:true,characterData:true});
 ctx.listen(doc,'profile-language-change',schedule);ctx.listen(global,'ws-portfolio-filter-change',schedule);
 render();
 return {update:render,api:Object.freeze({refresh:render,getStatus:()=>Object.freeze({...last,fit:{...fitResult},active,name:names[ctx.locale]||names.en,version:'3.37.0'})})};
 }};
(global.WebStudioPlugins331||(global.WebStudioPlugins331=Object.create(null)))['smart-landing']=Object.freeze(plugin);
// Legacy private portfolio has no plugin host yet. Run the same lifecycle once.
if(!global.WebStudioPluginEngine331&&global.document?.body){
 const doc=global.document,root=doc.body,cleanups=[];
 const ctx={document:doc,root,get locale(){return global.profileI18n?.locale||doc.documentElement.lang||'en'},select:s=>root.querySelector(s),onCleanup:fn=>cleanups.push(fn),listen:(node,event,fn,opts)=>{if(!node?.addEventListener)return;node.addEventListener(event,fn,opts);cleanups.push(()=>node.removeEventListener(event,fn,opts))}};
 if(plugin.supports(ctx)){try{const instance=plugin.mount(ctx);global.__wsSmartLanding=Object.freeze({...instance.api,stop:()=>{for(const fn of cleanups.splice(0).reverse())fn()}})}catch(error){for(const fn of cleanups.splice(0).reverse())fn();throw error}}
}
})(typeof window!=='undefined'?window:undefined);
