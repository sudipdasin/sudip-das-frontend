/* Aurora Peak v3.18 — isolated scenic composition for the personal preview.
 * Native DOM + CSS only; no remote media, tracking, storage or privileged controls.
 * Dynamically mount only in Aurora Peak, restoring original DOM for other themes. */
(() => {
  'use strict';
  if((window.PORTFOLIO_PREVIEW_MODE!==true&&window.PORTFOLIO_VISITOR_FEATURES!==true))return;
  const picker=document.getElementById('theme-select');
  const hero=document.querySelector('main .hero');
  const art=hero?.querySelector('.hero-art');
  const text=hero?.querySelector('.hero-text');
  if(!picker||!hero||!art||!text||window.__auroraPeakSceneV318)return;
  window.__auroraPeakSceneV318=true;
  const originalArtLabel=art.getAttribute('aria-label');
  const create=(tag,className,copy)=>{
    const element=document.createElement(tag);
    if(className)element.className=className;
    if(copy!==undefined)element.textContent=copy;
    return element;
  };
  const scene=create('div','ap-landscape');
  scene.setAttribute('aria-hidden','true');
  for(const name of ['sky','halo','mist mist-back','ridge ridge-back','ridge ridge-mid','ridge ridge-front','contour','lightline']){
    const node=create('span','ap-'+name.split(' ').join(' ap-'));
    scene.append(node);
  }

  // Approved hybrid: four medallions on the real outer arch and a static apex
  // star. Atmosphere Engine controls the optional luminous animation in CSS.
  const hybridLabels={"en":["CRM & SQL","Linux tools","Systems","Automation"],"hi":["CRM और SQL","Linux उपकरण","सिस्टम","स्वचालन"],"bn":["CRM ও SQL","Linux টুল","সিস্টেম","অটোমেশন"],"es":["CRM y SQL","Herramientas Linux","Sistemas","Automatización"],"fr":["CRM et SQL","Outils Linux","Systèmes","Automatisation"],"de":["CRM & SQL","Linux-Werkzeuge","Systeme","Automatisierung"],"pt":["CRM e SQL","Ferramentas Linux","Sistemas","Automação"],"ar":["CRM وSQL","أدوات Linux","الأنظمة","الأتمتة"],"zh-CN":["CRM 与 SQL","Linux 工具","系统","自动化"],"ja":["CRM と SQL","Linux ツール","システム","自動化"]};
  const iconPaths=[
    ['M4 6c0-2 3.6-3 8-3s8 1 8 3-3.6 3-8 3-8-1-8-3Z','M4 6v6c0 2 3.6 3 8 3s8-1 8-3V6','M4 12v6c0 2 3.6 3 8 3s8-1 8-3v-6'],
    ['M12 3c-2.3 0-3.4 2.2-3.4 4.8 0 2-1.8 4.2-2.6 6.4-.7 2-.2 4.3 2.6 5.5h6.8c2.8-1.2 3.3-3.5 2.6-5.5-.8-2.2-2.6-4.4-2.6-6.4C15.4 5.2 14.3 3 12 3Z','M9 19l-3 2h5l1-2m3 0 3 2h-5l-1-2','M10.3 7h.1m3.2 0h.1M10.5 9l1.5 1 1.5-1','M9 13c0-1.7 1-2.5 3-2.5s3 .8 3 2.5v3c0 1.2-1 2-3 2s-3-.8-3-2z'],
    ['M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z','M10 2h4l.6 3 2 .9 2.6-1.5 2 3.4-2.1 2.2v2l2.1 2.2-2 3.4-2.6-1.5-2 .9-.6 3h-4l-.6-3-2-.9-2.6 1.5-2-3.4L5 12v-2L2.8 7.8l2-3.4 2.6 1.5 2-.9Z'],
    ['M8 6l-6 6 6 6','M16 6l6 6-6 6','M14 4l-4 16']
  ];
  const crown=create('div','ap-hybrid-star');crown.setAttribute('aria-hidden','true');
  scene.append(crown);
  const badges=iconPaths.map((paths,i)=>{
    const badge=create('div','ap-hybrid-badge');badge.dataset.slot=String(i);
    const medallion=create('div','ap-hybrid-medallion');
    const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    for(const [k,v] of Object.entries({viewBox:'0 0 24 24',fill:'none',stroke:'currentColor','stroke-width':'1.7','stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true'}))svg.setAttribute(k,v);
    for(const d of paths){const p=document.createElementNS('http://www.w3.org/2000/svg','path');p.setAttribute('d',d);svg.append(p)}
    medallion.append(svg);const title=create('div','ap-hybrid-label');badge.append(medallion,title);scene.append(badge);return {badge,title};
  });
  function updateHybridLabels(){
    const locale=document.documentElement.lang||'en',t=hybridLabels[locale==='zh'?'zh-CN':locale]||hybridLabels[locale.split('-')[0]]||hybridLabels.en;
    badges.forEach(({badge,title},i)=>{title.textContent=t[i];badge.title=t[i]});
  }
  document.addEventListener('profile-language-change',updateHybridLabels);
  updateHybridLabels();
  const reducedMotion=typeof window.matchMedia==='function'
    ?window.matchMedia('(prefers-reduced-motion: reduce)'):null;
  let ambient=!(reducedMotion&&reducedMotion.matches);
  const label=create('div','ap-edition');
  label.append(
    create('span','ap-edition-index','01 / FIELD NOTES'),
    create('span','ap-edition-copy','The alpine edition · Clarity by design')
  );
  const motionControl=create('button','ap-motion-control');
  motionControl.type='button';
  function updateMotion(){
    const reduced=Boolean(reducedMotion&&reducedMotion.matches);
    motionControl.disabled=reduced;
    motionControl.textContent=reduced?'Motion reduced':ambient?'Pause atmosphere':'Resume atmosphere';
    motionControl.setAttribute('aria-pressed',String(!ambient||reduced));
    motionControl.title=reduced?'Your system requests reduced motion':'Toggle subtle Alpine atmosphere animations';
    if(art.dataset.auroraPeakMotion!==undefined)art.dataset.auroraPeakMotion=ambient&&!reduced?'ambient':'paused';
  }
  motionControl.addEventListener('click',()=>{
    if(reducedMotion&&reducedMotion.matches)return;
    ambient=!ambient;
    updateMotion();
  });
  reducedMotion?.addEventListener?.('change',event=>{
    if(event.matches)ambient=false;
    updateMotion();
  });
  label.append(motionControl);updateMotion();
  const marker=create('div','ap-trail-mark');
  marker.append(
    create('span','ap-trail-glyph','⌁'),
    create('span','ap-trail-copy','People · Systems · Possibility')
  );
  marker.setAttribute('aria-hidden','true');
  const manifest=create('div','ap-manifest');
  manifest.append(
    create('span','ap-manifest-kicker','BUILT WITH PURPOSE'),
    create('strong','ap-manifest-title','Practical ideas, considered details.'),
    create('span','ap-manifest-copy','Exploring thoughtful software for real-world workflows.')
  );
  function synchronize(){
    const active=document.body.dataset.theme==='aurora-peak';
    if(active){
      if(!scene.isConnected)art.prepend(scene);
      updateHybridLabels();
      if(!marker.isConnected)art.append(marker);
      if(!label.isConnected)text.prepend(label);
      if(!manifest.isConnected)text.append(manifest);
      art.setAttribute('aria-label','Portrait of Sudip Das against a decorative layered alpine landscape');
      document.body.dataset.auroraPeakComposition='hybrid-v348';
      art.dataset.auroraPeakMotion='paused';
      updateMotion();
    }else{
      scene.remove();marker.remove();label.remove();manifest.remove();
      if(originalArtLabel===null)art.removeAttribute('aria-label');
      else art.setAttribute('aria-label',originalArtLabel);
      delete document.body.dataset.auroraPeakComposition;
      delete art.dataset.auroraPeakMotion;
    }
  }
  picker.addEventListener('change',synchronize);
  const observer=new MutationObserver(synchronize);
  observer.observe(document.body,{attributes:true,attributeFilter:['data-theme']});
  synchronize();
})();
