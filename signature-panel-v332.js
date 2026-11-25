/* WebStudio Signature Panel v3.32 — presentation-only adapter.
 * Never moves or replaces the GitHub disclosure, portfolio launcher or video.
 * DOM edits are restricted to a heading, markers and accessible metadata.
 */
(() => {
 'use strict';
 if(window.PORTFOLIO_PREVIEW_MODE!==true || window.__wsSignaturePanel332)return;
 const hero=document.querySelector('main > .hero .hero-text');
 const actions=hero?.querySelector(':scope > .actions');
 if(!hero||!actions)return;
 const i18n={
  en:['Signature Panel','Explore · Discover · Connect','Explore the portfolio and open-source work'],
  hi:['सिग्नेचर पैनल','खोजें · देखें · जुड़ें','पोर्टफोलियो और ओपन-सोर्स कार्य देखें'],
  bn:['সিগনেচার প্যানেল','খুঁজুন · দেখুন · যোগাযোগ করুন','পোর্টফোলিও এবং ওপেন-সোর্স কাজ দেখুন'],
  es:['Panel de autor','Explorar · Descubrir · Conectar','Explora el portafolio y el trabajo abierto'],
  fr:['Espace signature','Explorer · Découvrir · Échanger','Découvrez le portfolio et les projets ouverts'],
  de:['Signatur-Panel','Entdecken · Ansehen · Vernetzen','Portfolio und Open-Source-Arbeit erkunden'],
  pt:['Painel de destaque','Explorar · Descobrir · Conectar','Explore o portfólio e projetos abertos'],
  ar:['لوحة الهوية','استكشف · اكتشف · تواصل','استكشف معرض الأعمال والمشاريع مفتوحة المصدر'],
  'zh-CN':['个人精选面板','探索 · 发现 · 联系','探索作品集与开源项目'],
  ja:['シグネチャーパネル','探す · 発見する · つながる','ポートフォリオとオープンソース作品を見る']
 };
 const supported=Object.keys(i18n);
 const heading=document.createElement('div');heading.className='ws-signature-heading';
 heading.id='ws-signature-heading';
 const marque=document.createElement('span');marque.className='ws-signature-heading-mark';marque.textContent='✦';marque.setAttribute('aria-hidden','true');
 const label=document.createElement('strong');label.className='ws-signature-heading-title';label.id='ws-signature-title';
 const tagline=document.createElement('span');tagline.className='ws-signature-heading-hint';
 heading.append(marque,label,tagline);
 actions.before(heading);
 hero.classList.add('ws-signature-host');
 actions.classList.add('ws-signature-actions');
 actions.setAttribute('role','group');
 actions.setAttribute('aria-labelledby',label.id);
 const dossier=hero.querySelector('.ws29-hero-dossier');
 if(dossier)dossier.classList.add('ws-signature-dossier');
 const location=hero.querySelector('.location');
 if(location)location.classList.add('ws-signature-availability');
 let locale='en';
 function render(){
  const selected=window.profileI18n?.locale||document.getElementById('language-select')?.value||document.documentElement.lang;
  locale=supported.includes(selected)?selected:'en';
  const terms=i18n[locale];
  label.textContent=terms[0];
  tagline.textContent=terms[1];
  actions.setAttribute('aria-description',terms[2]);
  heading.setAttribute('dir',locale==='ar'?'rtl':'auto');
 }
 function schedule(){if(typeof requestAnimationFrame==='function')requestAnimationFrame(render);else Promise.resolve().then(render)}
 document.addEventListener('profile-language-change',schedule);
 document.getElementById('language-select')?.addEventListener('change',schedule);
 render();
 window.__wsSignaturePanel332=Object.freeze({
  version:'3.32.0',
  name:'Signature Panel',
  refresh:render,
  getStatus:()=>Object.freeze({
   theme:document.body.dataset.theme||'unknown',locale,
   actionCount:[...actions.children].filter(n=>n.matches?.('a,button,.gh-hero-shell,.pv-intro-tile')).length,
   hasGitHub:Boolean(actions.querySelector('.gh-hero-shell')),
   hasGallery:Boolean(actions.querySelector('.portfolio-gallery-hero-launch')),
   hasIntroduction:Boolean(actions.querySelector('.pv-intro-tile'))
  })
 });
})();