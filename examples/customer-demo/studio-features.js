/* Standalone customer-safe adaptations of the original site's interactive systems. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const storage = (key,value) => {try {if(value===undefined)return localStorage.getItem(key);localStorage.setItem(key,value);}catch{return null;}};
  const messages = {
    en:{about:'About',expertise:'Expertise',projects:'Projects',journey:'Journey',contact:'Contact',search:'Search projects',filter:'Category',journeyTitle:'How I build.',empty:'No projects match those filters.',count:'projects visible',all:'All categories'},
    hi:{about:'परिचय',expertise:'विशेषज्ञता',projects:'परियोजनाएँ',journey:'यात्रा',contact:'संपर्क',search:'परियोजना खोजें',filter:'श्रेणी',journeyTitle:'मैं कैसे बनाता हूँ',empty:'कोई मिलती हुई परियोजना नहीं।',count:'परियोजनाएँ',all:'सभी श्रेणियाँ'},
    bn:{about:'পরিচিতি',expertise:'দক্ষতা',projects:'প্রকল্প',journey:'অভিজ্ঞতা',contact:'যোগাযোগ',search:'প্রকল্প খুঁজুন',filter:'বিভাগ',journeyTitle:'আমার কাজের ধারা',empty:'কোনো প্রকল্প পাওয়া যায়নি।',count:'প্রকল্প দেখা যাচ্ছে',all:'সব বিভাগ'},
    es:{about:'Acerca de',expertise:'Habilidades',projects:'Proyectos',journey:'Trayectoria',contact:'Contacto',search:'Buscar proyectos',filter:'Categoría',journeyTitle:'Cómo trabajo',empty:'No hay proyectos que coincidan.',count:'proyectos visibles',all:'Todas las categorías'},
    fr:{about:'À propos',expertise:'Compétences',projects:'Projets',journey:'Parcours',contact:'Contact',search:'Rechercher un projet',filter:'Catégorie',journeyTitle:'Ma façon de travailler',empty:'Aucun projet correspondant.',count:'projets visibles',all:'Toutes les catégories'},
    de:{about:'Über mich',expertise:'Kompetenzen',projects:'Projekte',journey:'Werdegang',contact:'Kontakt',search:'Projekte suchen',filter:'Kategorie',journeyTitle:'Meine Arbeitsweise',empty:'Keine passenden Projekte.',count:'sichtbare Projekte',all:'Alle Kategorien'}
  };
  const themes=['orbit','editorial','terminal'];
  const sections=['about-section','skills-section','projects-section','journey-section','contact-section','proposal-section'];
  const theme=$('studio-theme'),language=$('studio-language'),nav=$('studio-nav'),menu=$('mobile-menu');
  const progress=document.querySelector('.scroll-progress span');
  let activeSection='about-section';
  let updateQueued=false;
  function updateProgress(){
    const max=document.documentElement.scrollHeight-window.innerHeight;
    if(progress)progress.style.width=(max>0?Math.max(0,Math.min(100,100*window.scrollY/max)):0)+'%';
    updateQueued=false;
  }
  window.addEventListener('scroll',()=>{if(!updateQueued){updateQueued=true;requestAnimationFrame(updateProgress);}},{passive:true});
  window.addEventListener('resize',updateProgress,{passive:true});updateProgress();
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
  const fine=window.matchMedia('(pointer: fine) and (hover: hover)');
  const art=document.querySelector('.hero-art');
  if(art&&fine.matches&&!reduced.matches){
    let frame=0;
    art.addEventListener('pointermove',event=>{
      if(frame)return;
      frame=requestAnimationFrame(()=>{
        const bounds=art.getBoundingClientRect();
        art.style.setProperty('--photo-tilt-x',(-5*((event.clientY-bounds.top)/bounds.height-.5))+'deg');
        art.style.setProperty('--photo-tilt-y',(6*((event.clientX-bounds.left)/bounds.width-.5))+'deg');frame=0;
      });
    });
    art.addEventListener('pointerleave',()=>{
      art.style.removeProperty('--photo-tilt-x');art.style.removeProperty('--photo-tilt-y');
    });
  }
  const setLanguage = value => {
    const lang=messages[value]?value:'en';const lex=messages[lang];
    document.documentElement.lang=lang;
    language.value=lang;
    document.querySelectorAll('[data-copy]').forEach(el=>{const phrase=lex[el.dataset.copy];if(phrase)el.textContent=phrase;});
    $('project-empty').textContent=lex.empty;
    $('project-search').placeholder=lex.search;
    $('project-filter').options[0].textContent=lex.all;
    storage('studio-demo-language-v1',lang);applyProjectFilters();
  };
  const terminalNav=document.createElement('nav');
  terminalNav.className='terminal-nav';terminalNav.setAttribute('aria-label','Terminal section navigation');
  const prev=document.createElement('button'),next=document.createElement('button'),page=document.createElement('span');
  prev.textContent='← Previous';next.textContent='Next →';
  prev.type=next.type='button';prev.dataset.terminalMove='-1';next.dataset.terminalMove='1';
  terminalNav.append(prev,page,next);
  const main=$('top');
  main.append(terminalNav);
  function setTerminalSection(id,opts={}) {
    const found=sections.includes(id)?id:'about-section';activeSection=found;
    document.querySelectorAll('main > .section').forEach(section=>section.classList.toggle('terminal-active',section.id===found));
    const i=sections.indexOf(found);prev.disabled=i===0;next.disabled=i===sections.length-1;page.textContent=(i+1)+' / '+sections.length;
    nav.querySelectorAll('a').forEach(a=>a.setAttribute('aria-current',a.hash==='#'+found?'location':'false'));
    if(opts.scroll!==false && document.body.dataset.theme==='terminal')window.scrollTo({top:0,behavior:'instant'});
  }
  function setTheme(value) {
    const v=themes.includes(value)?value:'orbit';theme.value=v;document.body.dataset.theme=v;
    if(v==='terminal')setTerminalSection(activeSection,{scroll:false});
    else document.querySelectorAll('main > .section').forEach(section=>section.classList.remove('terminal-active'));
    storage('studio-demo-layout-v1',v);updateProgress();
  }
  language.addEventListener('change',()=>setLanguage(language.value));
  theme.addEventListener('change',()=>setTheme(theme.value));
  menu.addEventListener('click',()=>{
    const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));
  });
  nav.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click',event=>{
    nav.classList.remove('open');menu.setAttribute('aria-expanded','false');
    if(document.body.dataset.theme==='terminal'){
      event.preventDefault();setTerminalSection(a.hash.slice(1));
    }
  }));
  [prev,next].forEach(button=>button.addEventListener('click',()=>{
    const offset=Number(button.dataset.terminalMove),i=sections.indexOf(activeSection)+offset;
    if(i>=0&&i<sections.length)setTerminalSection(sections[i]);
  }));
  const projectGrid=$('projects'),search=$('project-search'),filter=$('project-filter'),count=$('project-count'),empty=$('project-empty');
  function syncCategories(){
    const current=filter.value;
    const names=new Set([...projectGrid.querySelectorAll('.card .eyebrow')].map(el=>el.textContent.trim()).filter(Boolean));
    filter.replaceChildren(new Option(messages[language.value]?.all||'All categories','all'),...[...names].sort().map(name=>new Option(name,name)));
    filter.value=names.has(current)?current:'all';
  }
  function applyProjectFilters(){
    const q=search.value.trim().toLocaleLowerCase(),category=filter.value;let visible=0;
    [...projectGrid.querySelectorAll('.card')].forEach(card=>{
      const text=card.textContent.toLocaleLowerCase(),name=card.querySelector('.eyebrow')?.textContent.trim()||'';
      const show=(!q||text.includes(q))&&(category==='all'||name===category);
      card.hidden=!show;if(show)visible++;
    });
    empty.hidden=visible!==0;count.textContent=visible+' '+(messages[language.value]?.count||'projects visible');
  }
  search.addEventListener('input',applyProjectFilters);filter.addEventListener('change',applyProjectFilters);
  if(projectGrid)new MutationObserver(changes=>{
    if(changes.some(change=>change.type==='childList')){syncCategories();applyProjectFilters();}
  }).observe(projectGrid,{childList:true});
  syncCategories();applyProjectFilters();
  const inquiry=$('proposal-form'),inquiryStatus=$('proposal-status');
  inquiry.addEventListener('submit',event=>{
    event.preventDefault();if(!inquiry.reportValidity())return;
    const fields=Object.fromEntries(new FormData(inquiry).entries());
    const content=[
      'FICTIONAL CUSTOMER DEMO — PROJECT BRIEF (NOT SENT)',
      'Name: '+fields.name,'Email: '+fields.email,
      'Service: '+fields.service,'Timeline: '+fields.timeline,
      'Brief:',''+fields.brief,'',
      'This document is a local preview. No message has been delivered.'
    ].join('\n');
    const blob=new Blob([content],{type:'text/plain'});
    const url=URL.createObjectURL(blob),link=document.createElement('a');
    link.href=url;link.download='sample-project-brief.txt';document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),2500);
    inquiryStatus.textContent='Sample brief download requested. No email or API request was sent.';
  });
  setTheme(storage('studio-demo-layout-v1')||'orbit');
  setLanguage(storage('studio-demo-language-v1')||'en');
})();
