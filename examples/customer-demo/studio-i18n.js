/* Standalone, privacy-preserving and reversible demo translation engine.
   Ships dictionaries locally; never sends profile data to translation services. */
(() => {
  'use strict';
  const locales = ['en','hi','bn','es','fr','de','pt','ar','zh-CN','ja'];
  const language = document.getElementById('studio-language');
  const originals = new WeakMap();
  const originalAttributes = new WeakMap();
  let product = null;
  let labels = null;
  let active = 'en';
  let scheduled = false;
  let applying = false;
  const normalize = value => String(value||'').trim();
  const translate = (text,lang) => labels?.translations?.[lang]?.[text] || text;
  function apply() {
    if(!product || !labels)return;
    applying = true;
    const dict = product.locales[active] || product.locales.en;
    document.documentElement.lang = active;
    document.documentElement.dir = active === 'ar' ? 'rtl' : 'ltr';
    document.querySelectorAll('[data-i18n]').forEach(node=>{
      const key = node.dataset.i18n;
      const replacement = dict[key] || product.locales.en[key];
      if(replacement && node.textContent !== replacement)node.textContent = replacement;
    });
    const walker = document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
    const nodes = [];
    while(walker.nextNode())nodes.push(walker.currentNode);
    for(const node of nodes) {
      if(node.parentElement?.closest('script,style,[data-i18n],#name,#role,#tagline,#about,#skills,#projects,#social,#email,#demo-brand,#portrait-caption'))continue;
      const existing = originals.get(node);
      const current = normalize(node.nodeValue);
      const original = existing || current;
      if(!existing && !(original in (labels.translations.hi||{})))continue;
      if(!existing)originals.set(node,original);
      const desired = translate(original,active);
      if(current !== desired)node.nodeValue = node.nodeValue.replace(current,desired);
    }
    const attrs=['aria-label','placeholder','title'];
    document.querySelectorAll('[aria-label],[placeholder],[title]').forEach(element=>{
      let saved=originalAttributes.get(element);
      if(!saved){saved={};for(const name of attrs){const value=element.getAttribute(name);if(value && value in (labels.translations.hi||{}))saved[name]=value;}originalAttributes.set(element,saved);}
      for(const [name,source] of Object.entries(saved)){const value=translate(source,active);if(element.getAttribute(name)!==value)element.setAttribute(name,value);}
    });
    applying = false;
  }
  function schedule(){
    if(scheduled || applying)return;
    scheduled = true;
    queueMicrotask(()=>{scheduled=false;apply();});
  }
  function select(lang){
    active = locales.includes(lang) ? lang : 'en';
    language.value=active;
    apply();
    document.dispatchEvent(new CustomEvent('studio:language',{detail:{language:active}}));
  }
  const data = Promise.all([
    fetch('./i18n-product.json',{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('Product translations missing');return r.json();}),
    fetch('./i18n-ui.json',{cache:'force-cache'}).then(r=>{if(!r.ok)throw Error('UI translations missing');return r.json();})
  ]).then(([productData,uiData])=>{
    for(const lang of locales){
      if(!productData.locales[lang])throw Error('Missing product language: '+lang);
      if(lang!=='en'&&!uiData.translations[lang])throw Error('Missing UI language: '+lang);
    }
    product=productData;
    labels=uiData;
    const current=language.value;
    select(current);
    language.addEventListener('change',()=>select(language.value));
    new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,characterData:true});
    window.StudioI18n=Object.freeze({select,get language(){return active;},translate:(text,lang=active)=>translate(text,lang),ready:Promise.resolve(true)});
    return true;
  }).catch(error=>{
    console.error('Local translations could not initialize:',error);
    document.documentElement.lang='en';document.documentElement.dir='ltr';
    return false;
  });
  window.StudioI18nReady=data;
})();
