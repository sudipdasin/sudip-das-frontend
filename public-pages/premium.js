/* Progressive visual enhancements: never required for editing the customer profile. */
(() => {
  'use strict';
  const reveal = () => {
    const items = document.querySelectorAll('.reveal:not(.visible)');
    if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(item => item.classList.add('visible'));
      return;
    }
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    },{threshold:0.08,rootMargin:'0px 0px 30px 0px'});
    items.forEach(item=>observer.observe(item));
  };
  const setNav = () => {
    const anchors = [...document.querySelectorAll('.nav-links a[href^="#"]')];
    const sections = anchors.map(a=>({a,section:document.querySelector(a.getAttribute('href'))})).filter(x=>x.section);
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries=>{
      for(const entry of entries) if(entry.isIntersecting){
        sections.forEach(x=>{
          if(x.section === entry.target) x.a.setAttribute('aria-current','location');
          else x.a.removeAttribute('aria-current');
        });
      }
    },{rootMargin:'-15% 0px -70% 0px',threshold:0});
    sections.forEach(x=>observer.observe(x.section));
  };
  reveal();
  setNav();
  document.addEventListener('visibilitychange',()=>{if(!document.hidden)reveal();});
})();
