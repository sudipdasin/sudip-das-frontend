/* Theme plugin v3.31 — standalone or native-site bridge, opt-in only. */
((global)=>{
 'use strict';
 if(!global)return;
 const themes=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
 const names=['Orbit','Editorial','Terminal','Aurora Peak','Neon Studio','Cosmic'];
 const copy={
  en:{title:'Theme engine',label:'Choose presentation',description:'Change the look without modifying content'},
  hi:{title:'थीम इंजन',label:'प्रस्तुति चुनें',description:'सामग्री बदले बिना रूप बदलें'},
  bn:{title:'থিম ইঞ্জিন',label:'উপস্থাপনা বেছে নিন',description:'বিষয়বস্তু না বদলে রূপ পরিবর্তন করুন'},
  es:{title:'Motor de temas',label:'Elegir presentación',description:'Cambia la apariencia sin modificar el contenido'},
  fr:{title:'Moteur de thèmes',label:'Choisir la présentation',description:'Changer le style sans modifier le contenu'},
  de:{title:'Design-Engine',label:'Darstellung wählen',description:'Aussehen ohne Inhaltsänderung wechseln'},
  pt:{title:'Motor de temas',label:'Escolher apresentação',description:'Altere o visual sem mudar o conteúdo'},
  ar:{title:'محرك السمات',label:'اختر العرض',description:'غيّر المظهر دون تعديل المحتوى'},
  'zh-CN':{title:'主题引擎',label:'选择显示风格',description:'无需更改内容即可切换外观'},
  ja:{title:'テーマエンジン',label:'表示スタイルを選択',description:'内容を変えずに見た目を変更'}
 };
 const plugin={
  id:'theme',version:'3.31.0',priority:-20,
  mount(ctx){
   const source=ctx.bridge?ctx.document.getElementById('theme-select'):null;
   const host=ctx.host;
   let panel=null,select=null,label=null,description=null;
   if(source){
    const sync=()=>{if(themes.includes(source.value)&&source.value!==host.getStatus().theme)host.setTheme(source.value)};
    ctx.listen(source,'change',sync);sync();
    if(typeof MutationObserver==='function'){
     const observer=new MutationObserver(()=>{
      const selected=ctx.document.body?.dataset?.theme;
      if(themes.includes(selected)&&selected!==host.getStatus().theme)host.setTheme(selected);
     });
     observer.observe(ctx.document.body,{attributes:true,attributeFilter:['data-theme']});
     ctx.onCleanup(()=>observer.disconnect());
    }
   }else{
    panel=ctx.document.createElement('section');
    panel.className='wsp-plugin-panel wsp-theme-switcher';
    panel.setAttribute('data-wsp-ui','theme');
    label=ctx.document.createElement('label');
    label.htmlFor=ctx.uid+'-theme-select';
    select=ctx.document.createElement('select');select.id=label.htmlFor;
    select.setAttribute('aria-label','Choose presentation');
    themes.forEach((id,i)=>{
     const option=ctx.document.createElement('option');option.value=id;option.textContent=names[i];
     select.append(option);
    });
    description=ctx.document.createElement('p');description.className='wsp-help';
    panel.append(label,select,description);
    (ctx.slots.theme||ctx.slots.tools||ctx.root).append(panel);
    ctx.listen(select,'change',()=>host.setTheme(select.value));
    ctx.onCleanup(()=>panel.remove());
   }
   const render=()=>{
    if(select)select.value=host.getStatus().theme;
    if(label)label.textContent=ctx.t(copy,'label');
    if(description)description.textContent=ctx.t(copy,'description');
   };
   render();
   return {
    api:Object.freeze({choose:id=>host.setTheme(id),getStatus:()=>({theme:host.getStatus().theme,bridge:Boolean(source)})}),
    update:render
   };
  }
 };
 (global.WebStudioPlugins331||(global.WebStudioPlugins331=Object.create(null))).theme=Object.freeze(plugin);
})(typeof window!=='undefined'?window:undefined);
