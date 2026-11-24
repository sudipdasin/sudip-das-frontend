/* Aurora Peak v3.18 — isolated scenic composition for the personal preview.
 * Native DOM + CSS only; no remote media, tracking, storage or privileged controls.
 * Dynamically mount only in Aurora Peak, restoring original DOM for other themes. */
(() => {
  'use strict';
  if(window.PORTFOLIO_PREVIEW_MODE!==true)return;
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
      if(!marker.isConnected)art.append(marker);
      if(!label.isConnected)text.prepend(label);
      if(!manifest.isConnected)text.append(manifest);
      art.setAttribute('aria-label','Portrait of Sudip Das against a decorative layered alpine landscape');
      document.body.dataset.auroraPeakComposition='scenic-v318';
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
