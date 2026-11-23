/* Personal portfolio: visitor-only presentation. No Studio, owner controls,
 * global mutations, profile editing or appearance import/export.
 * Owner changes are managed separately through trusted authenticated tooling.
 */
(() => {
  'use strict';
  if (document.body.dataset.wsParityReady === 'true') return;
  const themeSelect = document.getElementById('theme-select');
  if (!themeSelect) return;
  document.body.classList.add('ws-parity');
  document.body.dataset.wsParityReady = 'true';
  const node = (tag, cls, content) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (content !== undefined) el.textContent = content;
    return el;
  };
  const banner = node('div', 'ws-utility');
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Personal portfolio information');
  banner.append(
    node('strong', '', 'SUDIP DAS / INTERACTIVE PORTFOLIO'),
    node('span', 'ws-utility-right', 'CURRENT PERSONAL PREVIEW · Private requests disabled')
  );
  document.querySelector('.topbar')?.before(banner);
  // Visitor Quick Actions: local theme choice and read-only section navigation ONLY.
  // No settings, uploads, exports, server writes, or owner management.
  const quick = node('div', 'ws-visitor-quick');
  const quickButton = node('button', 'ws-visitor-quick-toggle', '⌘ Quick actions');
  quickButton.type = 'button';
  quickButton.id = 'ws-visitor-quick-open';
  quickButton.setAttribute('aria-expanded', 'false');
  quickButton.setAttribute('aria-controls', 'ws-visitor-quick-panel');
  quickButton.setAttribute('aria-haspopup', 'true');
  const quickPanel = node('div', 'ws-visitor-quick-panel');
  quickPanel.id = 'ws-visitor-quick-panel';
  quickPanel.hidden = true;
  quickPanel.setAttribute('aria-label', 'Visitor quick navigation and themes');
  const quickTitle = node('strong', '', 'Explore this portfolio');
  quickPanel.append(quickTitle);
  const navActions = node('div', 'ws-visitor-quick-links');
  const sections = [
    ['Top', 'top'], ['About', 'about'], ['Projects', 'projects'],
    ['Experience', 'experience'], ['Strengths', 'capabilities'], ['Contact', 'contact']
  ];
  const closeQuick = (restoreFocus = false) => {
    quickPanel.hidden = true;
    quickButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) quickButton.focus();
  };
  for (const [label, id] of sections) {
    if (!document.getElementById(id)) continue;
    const link = node('a', '', label);
    link.href = '#' + id;
    link.addEventListener('click', () => closeQuick());
    navActions.append(link);
  }
  quickPanel.append(navActions, node('strong', 'ws-visitor-quick-title', 'Switch theme'));
  const themeActions = node('div', 'ws-visitor-quick-themes');
  for (const opt of themeSelect.options) {
    const choice = node('button', '', opt.textContent.trim());
    choice.type = 'button';
    choice.dataset.theme = opt.value;
    choice.addEventListener('click', () => {
      themeSelect.value = opt.value;
      themeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      closeQuick(true);
    });
    themeActions.append(choice);
  }
  quickPanel.append(themeActions);
  quick.append(quickButton, quickPanel);
  // A read-only floating visitor launcher lives outside the sticky header,
  // preserving navigation width at all viewports. Positioning and contextual
  // suggestions are provided by personal-smart-navigation-v1.js.
  document.body.append(quick);
  quickButton.addEventListener('click', () => {
    quickPanel.hidden = !quickPanel.hidden;
    quickButton.setAttribute('aria-expanded', String(!quickPanel.hidden));
    if (!quickPanel.hidden) quickPanel.querySelector('a,button')?.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !quickPanel.hidden) closeQuick(true);
  });
  document.addEventListener('click', event => {
    if (!quickPanel.hidden && !quick.contains(event.target)) closeQuick();
  });
  // Theme-specific orbit treatments follow WebStudio's actual reference
  // compositions. Labels refer ONLY to existing approved portfolio skill areas.
  // Aurora Studio: five compact role badges; Cosmic: four circular satellites;
  // remaining four themes: three restrained labels. No fictional/demo content.

  // Locally defined vector symbols; no external icon fonts or network.
  const namespace='http://www.w3.org/2000/svg';
  const shapes={
    database:['ellipse|12 5 9 3','path|M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5','path|M3 12c0 1.7 4 3 9 3s9-1.3 9-3'],
    terminal:['rect|3 4 18 16 2','path|m7 9 3 3-3 3','path|M12 16h5'],
    layers:['path|m12 3 9 5-9 5-9-5 9-5Z','path|m3 12 9 5 9-5','path|m3 16 9 5 9-5'],
    sparkle:['path|m12 3 1.8 5.4L19 10l-5.2 1.6L12 17l-1.8-5.4L5 10l5.2-1.6L12 3Z','path|m19 16 .7 2.3L22 19l-2.3.7L19 22l-.7-2.3L16 19l2.3-.7L19 16Z'],
    headset:['path|M4 13v-2a8 8 0 0 1 16 0v2','rect|3 12 4 8 2','rect|17 12 4 8 2','path|M21 19c0 2-3 3-7 3h-2'],
    chart:['rect|3 3 18 18 2','path|M7 16v-3M12 16V8M17 16v-5'],
    refresh:['path|M20 11a8 8 0 0 0-14-5L3 9','path|M3 4v5h5','path|M4 13a8 8 0 0 0 14 5l3-3','path|M21 20v-5h-5']
  };
  const vectorIcon=kind=>{
    const svg=document.createElementNS(namespace,'svg');
    for(const [key,val] of Object.entries({'viewBox':'0 0 24 24',
      'fill':'none','stroke':'currentColor','stroke-width':'1.7',
      'stroke-linecap':'round','stroke-linejoin':'round','aria-hidden':'true',
      'focusable':'false'}))svg.setAttribute(key,val);
    for(const item of (shapes[kind]||shapes.layers)){
      const [type,value]=item.split('|');
      const el=document.createElementNS(namespace,type);
      if(type==='path')el.setAttribute('d',value);
      else{
        const keys=type==='rect'?['x','y','width','height','rx']:['cx','cy','rx','ry'];
        value.split(' ').forEach((v,i)=>el.setAttribute(keys[i],v));
      }
      svg.append(el);
    }
    return svg;
  };
  const art = document.querySelector('.hero-art');
  if (art) {
    const skills = [
      ['CRM & SQL', 'a', '◈'],
      ['Linux tools', 'b', '⌘'],
      ['Systems', 'c', '▣'],
      ['Creative technology', 'd', '✦'],
      ['Technical support', 'e', '◎']
    ];
    const updateOrbitBadges = () => {
      art.querySelectorAll('.ws-orbit-chip').forEach(chip => chip.remove());
      const theme = document.body.dataset.theme || themeSelect.value;
      const isCosmic = theme === 'design-2';
      const list = theme === 'neon-studio' ? skills : isCosmic ? skills.slice(0, 4) : skills.slice(0, 3);
      for (const [name, position, glyph] of list) {
        const isAuroraReference = theme === 'neon-studio';
        const chip = node('span', 'ws-orbit-chip', isCosmic ? glyph : isAuroraReference ? undefined : name);
        chip.dataset.pos = position;
        chip.setAttribute('aria-label', name);
        chip.setAttribute('aria-hidden', 'true');
        if (isAuroraReference) {
          const symbol={a:'database',b:'terminal',c:'layers',d:'sparkle',e:'headset'}[position];
          const bubble=node('span','ws-orbit-glyph');
          bubble.append(vectorIcon(symbol));
          chip.append(bubble,node('span','ws-orbit-label',name));
        } else if (!isCosmic) {
          chip.prepend(node('i'));
        }
        art.append(chip);
      }
    };
    themeSelect.addEventListener('change', updateOrbitBadges);
    updateOrbitBadges();

    // The older theme bundles have animated !important geometry rules that
    // continue to win at runtime on some Chromium builds. Lock only the
    // WebStudio Design 1 portrait/ring geometry with inline-important styles.
    // This is intentionally reversible on theme switches, with all five
    // other themes retaining their untouched CSS geometry.
    // Independently rendered orbit outlines prevent legacy .orbit CSS
    // animations/calc rules from displacing concentric geometry. Source
    // rings remain available for other themes but are hidden here.
    const ringLayer=document.createElement('div');
    ringLayer.className='ws-neon-precise-orbits';
    ringLayer.setAttribute('aria-hidden','true');
    const outerPrecision=node('span','ws-neon-precise-ring ws-neon-precise-outer');
    const innerPrecision=node('span','ws-neon-precise-ring ws-neon-precise-inner');
    ringLayer.append(outerPrecision,innerPrecision);
    art.prepend(ringLayer);
    const rings=[...art.querySelectorAll('.orbit')];
    const core=art.querySelector('.core');
    const portraitLayer=node('div','ws-neon-precision-portrait');
    const existingPortrait=core?.querySelector('img');
    if(existingPortrait)portraitLayer.append(existingPortrait.cloneNode(true));
    art.append(portraitLayer);
    const nameplate=art.querySelector('.portrait-caption');
    const managed=new Map();
    const setLocked=(el,prop,val)=>{
      if(!el)return;
      if(!managed.has(el))managed.set(el,new Set());
      managed.get(el).add(prop);
      el.style.setProperty(prop,val,'important');
    };
    const clampValue=(low,value,high)=>Math.min(high,Math.max(low,value));
    const syncNeonRing=()=>{
      if(document.body.dataset.theme!=='neon-studio'){
        for(const [el,props] of managed)
          for(const prop of props)el.style.removeProperty(prop);
        managed.clear();
        return;
      }
      const vw=window.innerWidth;
      const diameter=vw<=600?clampValue(250,.70*vw,330):
        vw<=980?clampValue(290,.50*vw,415):
        vw<=1380?clampValue(300,.27*vw,395):
        clampValue(340,.25*vw,434);
      const artHeight=vw<=600?425:vw<=980?Math.max(390,diameter+40):
        vw<=1380?525:clampValue(545,.34*vw,580);
      // In the stacked tablet layout, the nameplate extends beyond the
      // photo/orbit card. Reserve bottom room in the actual hero so it
      // cannot overlap the succeeding infinity/skills band.
      const hero=art.closest('main>.hero');
      if(hero){
        if(vw>600&&vw<=980)setLocked(hero,'padding-bottom','64px');
        else{
          hero.style.removeProperty('padding-bottom');
          managed.get(hero)?.delete('padding-bottom');
        }
      }
      setLocked(art,'min-height',artHeight+'px');
      setLocked(art,'--wf-orbit-size',diameter+'px');
      setLocked(ringLayer,'--neon-ring-px',diameter+'px');
      for(const [ring,size] of [[outerPrecision,diameter],[innerPrecision,diameter*.84]]){
        setLocked(ring,'width',size+'px');
        setLocked(ring,'height',size+'px');
        setLocked(ring,'left','50%');
        setLocked(ring,'top','50%');
        setLocked(ring,'transform','translate(-50%,-50%)');
      }
      rings.forEach((ring,index)=>{
        const size=diameter*(index===0?1:.84);
        for(const [prop,val] of Object.entries({
          left:'50%',top:'50%',right:'auto',bottom:'auto',
          width:size+'px',height:size+'px',margin:'0px',
          translate:'-50% -50%'
        }))setLocked(ring,prop,val);
      });
      const portrait=diameter*.73;
      setLocked(portraitLayer,'width',portrait+'px');
      setLocked(portraitLayer,'height',portrait+'px');
      setLocked(nameplate,'left','50%');
      // Screenshot reference: nameplate begins just BELOW the cyan outer
      // orbit, never halfway inside the lower ring. Keep its gap constant
      // across viewport sizes rather than scaling the offset by 0.395.
      setLocked(nameplate,'top','calc(50% + '+(diameter/2+(vw<=600?12:14))+'px)');
      setLocked(nameplate,'bottom','auto');
      setLocked(nameplate,'transform','translateX(-50%)');
    };
    themeSelect.addEventListener('change',syncNeonRing);
    window.addEventListener('resize',syncNeonRing,{passive:true});
    syncNeonRing();
  }
  const ticker = document.querySelector('main>.ticker');
  if (ticker) {
    const row = node('div', 'ws-value-bar wrap');
    row.append(node('strong', '', 'Building practical tools, better everyday experiences.'));
    for (const [heading, detail] of [
      ['Linux & desktop', 'Tools for everyday workflows'],
      ['CRM & support', 'Systems, data and service'],
      ['Creative technology', 'Design with useful outcomes']
    ]) {
      const cell = node('span');
      cell.append(node('b', '', heading), document.createTextNode(detail));
      row.append(cell);
    }
    ticker.insertAdjacentElement('afterend', row);

    // WebStudio Aurora composition: a 1+4 information band, six compact
    // feature tiles and a three-action strip. Reuse only PUBLIC, already
    // approved site themes/skills/navigation; no fictional demo claims,
    // private details, owner settings, requests or publishing actions.
    const aurora = node('section', 'ws-aurora-reference');
    aurora.id = 'ws-aurora-reference';
    aurora.setAttribute('aria-label', 'Portfolio skills and quick navigation');
    const inner = node('div', 'ws-aurora-reference-inner wrap');
    const band = node('div', 'ws-aurora-info-band');
    const bandIntro = node('div', 'ws-aurora-band-intro');
    bandIntro.append(node('span', 'ws-aurora-infinity', '∞'));
    const bandCopy = node('div', 'ws-aurora-band-copy');
    bandCopy.append(
      node('strong', '', 'Building practical tools, better everyday experiences.'),
      node('small', '', 'Technology, systems, open source and creative work.')
    );
    bandIntro.append(bandCopy);
    band.append(bandIntro);
    const details = node('div', 'ws-aurora-band-details');
    for(const [kind,label] of [
      ['terminal','Linux & desktop'],['database','Systems & CRM'],
      ['headset','Technical support'],['sparkle','Creative technology']
    ]){
      const detail=node('span','ws-aurora-mini-detail');
      const icon=node('span','ws-aurora-mini-icon');
      icon.append(vectorIcon(kind));
      detail.append(icon,node('span','',label));
      details.append(detail);
    }
    band.append(details);
    inner.append(band);

    const featureGrid = node('nav', 'ws-aurora-feature-grid');
    featureGrid.setAttribute('aria-label', 'Portfolio areas');
    // The live ticker groups its spans; the previous direct-child selector
    // matched nothing and silently removed all six Aurora feature tabs.
    const sixSkills=[...ticker.querySelectorAll('.ticker-in .ticker-group:first-child > span')].slice(0,6);
    const featureIcons=['database','terminal','layers','headset','refresh','chart'];
    const featureLinks = ['#projects', '#capabilities', '#experience', '#experience', '#capabilities', '#projects'];
    sixSkills.forEach((skill, index) => {
      const link = node('a', 'ws-aurora-feature');
      link.href = featureLinks[index];
      const label = skill.textContent.replace(/[✳✱*]/g, '').trim();
      const icon=node('span','ws-aurora-feature-icon');
      icon.append(vectorIcon(featureIcons[index]));
      link.append(icon);
      const copy = node('span', 'ws-aurora-feature-copy');
      copy.append(node('strong', '', label), node('small', '', index < 2 ? 'Explore practical work' : 'View experience'));
      link.append(copy);
      featureGrid.append(link);
    });
    inner.append(featureGrid);

    const cta = node('div', 'ws-aurora-cta');
    const ctaCopy = node('div', 'ws-aurora-cta-copy');
    ctaCopy.append(
      node('strong', '', 'Explore selected projects and experience.'),
      node('small', '', 'Practical software, systems, service and creative technology.')
    );
    cta.append(ctaCopy);
    const ctaActions = node('div', 'ws-aurora-cta-actions');
    for (const [label, href, primary] of [
      ['Explore my work', '#projects', true],
      ['Experience', '#experience', false],
      ['Get in touch', '#contact', false]
    ]) {
      const link = node('a', primary ? 'ws-aurora-cta-primary' : '', label);
      link.href = href;
      ctaActions.append(link);
    }
    cta.append(ctaActions);
    inner.append(cta);
    aurora.append(inner);

    // True theme component isolation: the Aurora-only layout is not placed
    // in the DOM for Orbit, Editorial (owner-frozen), Terminal, Aurora Peak
    // or Cosmic. It cannot leak into other themes through CSS overrides,
    // keyboard navigation, or future style regressions.
    const syncAuroraComponent = () => {
      const theme = document.body.dataset.theme || themeSelect.value;
      const shouldMount = theme === 'neon-studio';
      if (shouldMount && !aurora.isConnected) {
        ticker.before(aurora);
      } else if (!shouldMount && aurora.isConnected) {
        aurora.remove();
      }
    };
    themeSelect.addEventListener('change', syncAuroraComponent);
    syncAuroraComponent();
  }
})();

