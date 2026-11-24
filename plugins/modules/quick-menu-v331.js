/* Quick Menu plugin v3.31 — accessible section navigator, native bridge when present. */
((global)=>{
 'use strict';if(!global)return;
 const copy={
  en:['Quick menu','Close menu','Navigate','Themes','No navigation sections'],
  hi:['त्वरित मेनू','मेनू बंद करें','नेविगेशन','थीम','कोई अनुभाग नहीं'],
  bn:['দ্রুত মেনু','মেনু বন্ধ করুন','নেভিগেশন','থিম','কোনো বিভাগ নেই'],
  es:['Menú rápido','Cerrar menú','Navegar','Temas','Sin secciones'],
  fr:['Menu rapide','Fermer le menu','Navigation','Thèmes','Aucune section'],
  de:['Schnellmenü','Menü schließen','Navigation','Designs','Keine Abschnitte'],
  pt:['Menu rápido','Fechar menu','Navegação','Temas','Sem seções'],
  ar:['القائمة السريعة','إغلاق القائمة','التنقل','السمات','لا توجد أقسام'],
  'zh-CN':['快捷菜单','关闭菜单','导航','主题','没有章节'],
  ja:['クイックメニュー','メニューを閉じる','ナビゲーション','テーマ','セクションなし']
 };
 const plugin={
  id:'quick-menu',version:'3.31.0',priority:15,
  mount(ctx){
   const native=Boolean(ctx.bridge&&
    (global.__wsQuickMenu330?.getStatus||ctx.document.getElementById('ws-visitor-quick-panel')));
   if(native){
    const api={
     open:()=>{if(global.__wsQuickMenu330?.openTab)return global.__wsQuickMenu330.openTab('navigate');
      const panel=ctx.document.getElementById('ws-visitor-quick-panel');
      if(panel?.hidden)ctx.document.getElementById('ws-visitor-quick-open')?.click();return true;},
     close:()=>{if(global.__wsQuickMenu330?.close)return global.__wsQuickMenu330.close();
      const panel=ctx.document.getElementById('ws-visitor-quick-panel');
      if(panel&&!panel.hidden)ctx.document.getElementById('ws-visitor-quick-open')?.click();return true;},
     getStatus:()=>({bridge:true,...(global.__wsQuickMenu330?.getStatus?.()||{})})
    };
    return {api:Object.freeze(api)};
   }
   const doc=ctx.document,root=ctx.root;
   const panel=doc.createElement('div');panel.className='wsp-plugin-panel wsp-quick-menu';
   panel.setAttribute('data-wsp-ui','quick');
   const trigger=doc.createElement('button');trigger.type='button';
   trigger.className='wsp-quick-trigger';
   trigger.setAttribute('aria-expanded','false');
   const popup=doc.createElement('nav');popup.className='wsp-quick-popup';
   popup.hidden=true;popup.id='wsp-quick-popup';
   trigger.setAttribute('aria-controls',popup.id);
   const head=doc.createElement('strong'),links=doc.createElement('div');links.className='wsp-quick-links';
   const themeTitle=doc.createElement('strong'),themes=doc.createElement('div');themes.className='wsp-quick-themes';
   const close=doc.createElement('button');close.type='button';close.className='wsp-quick-close';
   popup.append(head,links,themeTitle,themes,close);panel.append(trigger,popup);
   (ctx.slots.quick||ctx.slots.tools||root).append(panel);
   const open=()=>{popup.hidden=false;trigger.setAttribute('aria-expanded','true');close.focus();return true};
   const shut=()=>{popup.hidden=true;trigger.setAttribute('aria-expanded','false');trigger.focus();return true};
   ctx.listen(trigger,'click',()=>popup.hidden?open():shut());
   ctx.listen(close,'click',shut);
   ctx.listen(panel,'keydown',event=>{if(event.key==='Escape'&&!popup.hidden){event.preventDefault();shut()}});
   ctx.listen(links,'click',event=>{
    if(event.target?.closest?.('a[href^="#"]')){
     popup.hidden=true;trigger.setAttribute('aria-expanded','false');
    }
   });
   ctx.listen(themes,'click',event=>{
    const button=event.target?.closest?.('button[data-wsp-theme-id]');
    if(button)ctx.host.setTheme(button.dataset.wspThemeId);
   });
   ctx.listen(doc,'pointerdown',event=>{
    if(!popup.hidden&&!panel.contains(event.target)){
     popup.hidden=true;trigger.setAttribute('aria-expanded','false');
    }
   });
   const sectionNodes=()=>{
    const nodes=ctx.selectAll('[data-wsp-section],main section[id],section[data-section]');
    return nodes.filter(n=>n.id&&/^[a-z][\w-]{0,63}$/i.test(n.id)).slice(0,12);
   };
   function render(){
    const t=copy[ctx.host.getStatus().locale]||copy.en;
    trigger.textContent=t[0];trigger.setAttribute('aria-label',t[0]);
    close.textContent=t[1];head.textContent=t[2];themeTitle.textContent=t[3];
    links.replaceChildren();themes.replaceChildren();
    const sections=sectionNodes();
    if(!sections.length)links.append(doc.createTextNode(t[4]));
    for(const section of sections){
     const a=doc.createElement('a');a.href='#'+section.id;
     a.textContent=section.getAttribute('data-wsp-label')||
      section.querySelector('h2,h3')?.textContent?.trim()||section.id;
     links.append(a);
    }
    const themeLabels=['Orbit','Editorial','Terminal','Aurora Peak','Neon Studio','Cosmic'];
    Object.keys(global.WebStudioPluginEngine331?.themes||{}).forEach((id,i)=>{
     const b=doc.createElement('button');b.type='button';
     b.textContent=themeLabels[i]||id;
     b.dataset.wspThemeId=id;
     b.setAttribute('aria-pressed',String(id===ctx.host.getStatus().theme));
     themes.append(b);
    });
   }
   render();
   ctx.onCleanup(()=>panel.remove());
   return {api:Object.freeze({open,close:shut,getStatus:()=>({
    bridge:false,open:!popup.hidden,sections:sectionNodes().length
   })}),update:render};
  }
 };
 (global.WebStudioPlugins331||(global.WebStudioPlugins331=Object.create(null)))['quick-menu']=Object.freeze(plugin);
})(typeof window!=='undefined'?window:undefined);
