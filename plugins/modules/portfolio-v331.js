/* Portfolio plugin v3.31 — bounded read-only discovery over existing DOM cards. */
((global)=>{
 'use strict';if(!global)return;
 const copy={
  en:['Find a project','Search projects','All','Linux & desktop','AI & media','Web & apps','Clear','shown','No matching projects','Project filter','Sort','Featured','Name A–Z'],
  hi:['प्रोजेक्ट खोजें','प्रोजेक्ट खोजें','सभी','लिनक्स और डेस्कटॉप','AI और मीडिया','वेब और ऐप्स','हटाएँ','दिखाए गए','कोई प्रोजेक्ट नहीं मिला','प्रोजेक्ट फ़िल्टर','क्रम','प्रमुख','नाम अ–ज्ञ'],
  bn:['প্রকল্প খুঁজুন','প্রকল্প অনুসন্ধান','সব','লিনাক্স ও ডেস্কটপ','AI ও মিডিয়া','ওয়েব ও অ্যাপ','মুছুন','দেখানো','কোনো প্রকল্প মেলেনি','প্রকল্প ফিল্টার','ক্রম','নির্বাচিত','নাম ক–হ'],
  es:['Buscar proyecto','Buscar proyectos','Todos','Linux y escritorio','IA y medios','Web y apps','Borrar','mostrados','Sin resultados','Filtro de proyectos','Orden','Destacados','Nombre A–Z'],
  fr:['Trouver un projet','Rechercher des projets','Tout','Linux et bureau','IA et médias','Web et apps','Effacer','affichés','Aucun projet trouvé','Filtre des projets','Tri','Sélection','Nom A–Z'],
  de:['Projekt finden','Projekte suchen','Alle','Linux & Desktop','KI & Medien','Web & Apps','Zurücksetzen','angezeigt','Keine Treffer','Projektfilter','Sortieren','Empfohlen','Name A–Z'],
  pt:['Encontrar projeto','Buscar projetos','Todos','Linux e desktop','IA e mídia','Web e apps','Limpar','exibidos','Nenhum projeto encontrado','Filtro de projetos','Ordenar','Destaques','Nome A–Z'],
  ar:['ابحث عن مشروع','بحث المشاريع','الكل','لينكس وسطح المكتب','الذكاء الاصطناعي والوسائط','الويب والتطبيقات','مسح','معروضة','لا توجد مشاريع مطابقة','تصفية المشاريع','الترتيب','المميز','الاسم أ–ي'],
  'zh-CN':['查找项目','搜索项目','全部','Linux 与桌面','AI 与媒体','网站与应用','清除','已显示','没有匹配项目','项目筛选','排序','精选','名称 A–Z'],
  ja:['プロジェクトを探す','プロジェクトを検索','すべて','Linux・デスクトップ','AI・メディア','Web・アプリ','クリア','表示中','一致する作品なし','作品フィルター','並べ替え','注目','名前 A–Z']
 };
 const categories=['all','linux','ai','web'];
 const plugin={
  id:'portfolio',version:'3.31.0',priority:10,
  mount(ctx){
   const native=Boolean(ctx.bridge&&global.__wsPortfolio328?.getStatus);
   if(native){
    const source=global.__wsPortfolio328;
    return {api:Object.freeze({
     search:q=>source.search?.(q)||false,filter:k=>source.setFocus?.(k)||false,
     sort:s=>source.setSort?.(s)||false,reset:()=>source.reset?.(),
     refresh:()=>source.getStatus?.(),getStatus:()=>({bridge:true,...source.getStatus?.()})
    })};
   }
   const doc=ctx.document;
   let cards=[],initialHidden=new Map(),parent=null,originalOrder=[],filter='all',sort='original',query='';
   const panel=doc.createElement('section');panel.className='wsp-plugin-panel wsp-portfolio-search';
   panel.setAttribute('data-wsp-ui','portfolio');panel.setAttribute('role','search');
   const label=doc.createElement('label');label.htmlFor='wsp-portfolio-query';
   const input=doc.createElement('input');input.type='search';input.id=label.htmlFor;
   input.autocomplete='off';
   const focus=doc.createElement('select');focus.setAttribute('aria-label','Project filter');
   for(const id of categories){const option=doc.createElement('option');option.value=id;focus.append(option)}
   const order=doc.createElement('select');order.setAttribute('aria-label','Sort projects');
   for(const id of ['original','az']){const option=doc.createElement('option');option.value=id;order.append(option)}
   const clear=doc.createElement('button');clear.type='button';
   const status=doc.createElement('p');status.setAttribute('role','status');
   status.setAttribute('aria-live','polite');
   panel.append(label,input,focus,order,clear,status);
   let lastSort=null,lastCount=-1;
   function scan(){
    const found=ctx.selectAll('[data-wsp-project],.project');
    const unique=[...new Set(found)].slice(0,300);
    for(const item of unique)if(!initialHidden.has(item))initialHidden.set(item,Boolean(item.hidden));
    cards=unique;parent=cards[0]?.parentElement||null;
    if(!originalOrder.length)originalOrder=cards.slice();
   }
   function update(){
    query=input.value.trim().toLocaleLowerCase();filter=focus.value;sort=order.value;
    let shown=0;
    for(const card of cards){
     const hay=String(card.textContent||'').toLocaleLowerCase();
     const category=(card.getAttribute('data-wsp-category')||card.dataset?.focus||'').toLocaleLowerCase();
     const matches=(!query||query.split(/\s+/).every(k=>hay.includes(k)))&&
      (filter==='all'||category.split(/[\s,]+/).includes(filter));
     card.hidden=!matches||Boolean(initialHidden.get(card));
     if(!card.hidden)shown++;
    }
    if(parent&&sort!==lastSort&&cards.every(c=>c.parentElement===parent)){
     const sorted=sort==='az'?[...cards].sort((a,b)=>
      (a.querySelector('h3,h2')?.textContent||a.textContent||'').localeCompare(
       b.querySelector('h3,h2')?.textContent||b.textContent||'')):originalOrder;
     for(const card of sorted)parent.append(card);
    }
    lastSort=sort;
    const t=copy[ctx.host.getStatus().locale]||copy.en;
    if(lastCount!==shown){status.textContent=shown+' / '+cards.length+' '+t[7];lastCount=shown;}
    if(!shown)status.textContent=t[8];
    clear.disabled=!query&&filter==='all'&&sort==='original';
   }
   function render(){
    const t=copy[ctx.host.getStatus().locale]||copy.en;
    label.textContent=t[0];input.placeholder=t[1];input.setAttribute('aria-label',t[1]);
    [...focus.options].forEach((o,i)=>o.textContent=t[i+2]);
    focus.setAttribute('aria-label',t[9]);
    [...order.options].forEach((o,i)=>o.textContent=t[i+11]);
    order.setAttribute('aria-label',t[10]);clear.textContent=t[6];
    lastCount=-1;update();
   }
   scan();
   const target=ctx.slots.portfolio||parent||ctx.root;
   if(ctx.slots.portfolio)target.prepend(panel);
   else if(parent?.before)parent.before(panel);
   else target.prepend(panel);
   ctx.listen(input,'input',update);ctx.listen(focus,'change',update);ctx.listen(order,'change',update);
   ctx.listen(clear,'click',()=>{input.value='';focus.value='all';order.value='original';update();input.focus()});
   ctx.onCleanup(()=>{
    for(const [card,hidden]of initialHidden)card.hidden=hidden;
    if(parent&&originalOrder.every(card=>card.parentElement===parent))
     for(const card of originalOrder)parent.append(card);
    panel.remove();
   });
   render();
   const api=Object.freeze({
    search:text=>{if(typeof text!=='string')return false;input.value=text.slice(0,120);update();return true},
    filter:id=>{if(!categories.includes(id))return false;focus.value=id;update();return true},
    sort:id=>{if(!['original','az'].includes(id))return false;order.value=id;update();return true},
    reset:()=>{input.value='';focus.value='all';order.value='original';update()},
    refresh:()=>{scan();update()},
    getStatus:()=>({bridge:false,total:cards.length,shown:cards.filter(c=>!c.hidden).length,filter,sort,query})
   });
   return {api,update:render};
  }
 };
 (global.WebStudioPlugins331||(global.WebStudioPlugins331=Object.create(null))).portfolio=Object.freeze(plugin);
})(typeof window!=='undefined'?window:undefined);
