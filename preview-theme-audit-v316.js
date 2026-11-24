/* Preview-only visual audit for real-browser human CI. Never touches hosting, credentials, APIs or production. */
(() => {
  'use strict';
  if (!window.PORTFOLIO_PREVIEW_MODE || new URLSearchParams(location.search).get('theme-audit') !== '1') return;
  if (document.getElementById('ws-theme-audit-v316')) return;
  const picker = document.getElementById('theme-select');
  const supported = [
    ['orbit','Orbit','42f0d3'],['editorial','Editorial','785338'],
    ['terminal','Terminal','55ffa4'],['aurora-peak','Aurora Peak','d8e5ae'],
    ['neon-studio','Neon Studio','05eff2'],['design-2','Cosmic','a9a0ff']
  ];
  if (!picker) return;
  const root = document.createElement('aside');
  root.id='ws-theme-audit-v316';
  root.setAttribute('aria-label','Theme fidelity test laboratory');
  Object.assign(root.style,{position:'fixed',top:'92px',left:'12px',zIndex:'950',width:'min(340px,calc(100vw - 24px))'});
  const shadow = root.attachShadow({mode:'open'});
  shadow.innerHTML = `
    <style>
      :host{all:initial;color-scheme:dark;font:13px/1.45 system-ui,sans-serif}
      *{box-sizing:border-box}
      details{max-height:calc(100dvh - 110px);overflow:auto;background:#101d29;color:#f0faff;border:1px solid #72bcd2;border-radius:10px;box-shadow:0 18px 45px #000a}
      summary{cursor:pointer;position:sticky;top:0;background:#152939;color:#f0faff;font-weight:750;padding:11px 13px;list-style:none}
      summary::-webkit-details-marker{display:none}
      article{padding:12px}
      p{margin:7px 0;color:#d0e4ee}
      button{margin:5px 6px 6px 0;padding:8px 10px;border-radius:5px;border:1px solid #67dae0;background:#173c45;color:#fff;font:inherit;cursor:pointer}
      button:disabled{opacity:.6;cursor:wait}
      button:focus-visible,summary:focus-visible{outline:3px solid #d5ff9e;outline-offset:2px}
      pre{overflow:auto;max-height:45dvh;white-space:pre-wrap;word-break:break-word;background:#07131e;border:1px solid #395268;border-radius:6px;padding:9px;font:12px/1.5 ui-monospace,monospace}
      .tip{font-size:12px}
    </style>
    <details>
      <summary>◈ Theme audit · v3.28.1</summary>
      <article>
        <p>Tests active CSS and layout in this browser, one theme at a time. No screenshots or data are uploaded.</p>
        <p class="tip">Repeat at desktop, tablet and mobile widths. Automated checks do not replace your visual review.</p>
        <button id="run" type="button">Run six-theme audit</button>
        <button id="copy" type="button">Copy report</button>
        <button id="export" type="button">Export findings JSON</button>
        <p id="status" role="status" aria-live="polite">Not tested yet.</p>
        <pre id="report">No results.</pre>
      </article>
    </details>`;
  const run = shadow.getElementById('run');
  const copy = shadow.getElementById('copy');
  const status = shadow.getElementById('status');
  const reportNode = shadow.getElementById('report');
  const exportButton = shadow.getElementById('export');
  let resultData=null;
  const pause = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  let reportText='';
  const luminance=hex=>{
    const color=hex.trim().replace('#','');
    if(!/^[0-9a-f]{6}$/i.test(color))return null;
    const channels=[0,2,4].map(n=>Number.parseInt(color.slice(n,n+2),16)/255).map(x=>x<=0.04045?x/12.92:Math.pow((x+0.055)/1.055,2.4));
    return channels[0]*0.2126+channels[1]*0.7152+channels[2]*0.0722;
  };
  const contrast=(a,b)=>{
    const x=luminance(a),y=luminance(b);
    return x===null||y===null?0:(Math.max(x,y)+0.05)/(Math.min(x,y)+0.05);
  };
  const intersects=(a,b)=>{
    if(!a||!b)return false;
    return a.left<b.right&&a.right>b.left&&a.top<b.bottom&&a.bottom>b.top;
  };
  function chipsCount(id){return id==='neon-studio'?5:id==='design-2'?4:3;}
  function checksFor(id,label,expectedAccent) {
    const style=getComputedStyle(document.body);
    const chosen=style.getPropertyValue('--ci-accent').trim().replace('#','').toLowerCase();
    const bg=style.getPropertyValue('--ci-bg').trim();
    const ink=style.getPropertyValue('--ci-ink').trim();
    const art=document.querySelector('.hero-art');
    // Neon hides the legacy .core and uses its own visible precision portrait.
    const portraitSelector=id==='neon-studio'?'.hero-art > .ws-neon-precision-portrait':'.hero-art > .core';
    const portrait=document.querySelector(portraitSelector);
    const title=document.querySelector('.hero h1');
    const portraitRect=portrait?.getBoundingClientRect(),titleRect=title?.getBoundingClientRect();
    const portraitStyle=portrait?getComputedStyle(portrait):null;
    const activePortraitGeometry=Boolean(portraitRect?.width>100&&portraitRect?.height>100&&
      titleRect?.width>150&&titleRect?.height>20&&portraitStyle?.display!=='none'&&
      portraitStyle?.visibility!=='hidden');
    const tile=document.querySelector('.pv-intro-tile .pv-intro-hero-cta');
    const video=document.querySelector('.pv-intro-tile .pv-intro-cta-motion');
    const expand=document.getElementById('pv-intro-expand');
    const chips=[...document.querySelectorAll('.hero-art .ws-orbit-chip')];
    const checks=[
      ['theme switched',document.body.dataset.theme===id],
      ['correct distinct theme accent',chosen===expectedAccent],
      ['video expand control remains operable',Boolean(expand && !expand.disabled && expand.getAttribute('aria-controls'))],
      ['approved theme repair sheet linked',Boolean(document.querySelector('link[href*="personal-theme-identity-v316.css"]'))],
      ['theme has readable surface contrast',contrast(bg,ink)>=4.5],
      ['portrait and title have real geometry',activePortraitGeometry],
      ['theme-active portrait visible and sized',Boolean(portraitRect?.width>100&&portraitRect?.height>100&&
        portraitStyle?.display!=='none'&&portraitStyle?.visibility!=='hidden')],
      ['no document horizontal overflow',document.documentElement.scrollWidth<=document.documentElement.clientWidth+3],
      ['no duplicate/missing orbital skills',chipsCount(id)===document.querySelectorAll('.hero-art .ws-orbit-chip').length]
    ];
    if(tile && video) {
      const tileStyle=getComputedStyle(tile);
      const videoStyle=getComputedStyle(video);
      if(id==='editorial'||id==='terminal') {
        checks.push(['no Neon hover video in static theme',videoStyle.display==='none']);
        checks.push(['no Neon poster in static theme',tileStyle.backgroundImage==='none'||id==='terminal'&&tileStyle.backgroundImage.includes('repeating-linear-gradient')]);
        const overlay=getComputedStyle(tile,'::after');
        checks.push(['no dark video overlay',overlay.display==='none'||overlay.visibility==='hidden'||
          overlay.content==='none'||Number.parseFloat(overlay.opacity)<=.01]);
      } else if(id!=='neon-studio') {
        checks.push(['distinct visual background available',tileStyle.backgroundImage!=='none']);
      }
    } else checks.push(['video UI initialized',false]);
    // v3.22: quality-mode correctness is checked without forcing a mode change.
    const atmosphere=window.__wsAtmosphere323?.getStatus?.();
    const atmosphereControl=document.getElementById('ws-atmosphere-control');
    const ambient=document.querySelector('body > .ws-atmo-layer.ws-atmo-sitewide');
    const rendererCanvas=ambient?.querySelector('canvas');
    checks.push(['Shared Atmosphere control exists in this theme',
      Boolean(atmosphereControl&&atmosphereControl.querySelectorAll('input[name="ws-atmosphere-mode"]').length===5)]);
    checks.push(['Atmosphere mode matches the selection',
      Boolean(atmosphere&&atmosphere.theme===id&&document.body.dataset.atmosphereMode===atmosphere.mode)]);
    checks.push(['Atmosphere renderer reports a valid fallback',
      Boolean(atmosphere&&['gpu','canvas2d','css','off'].includes(atmosphere.renderer))]);
    const regions=[...document.querySelectorAll('[data-atmo-zone]')];
    const regionIDs=['intro','about','projects','experience','strengths','contact','showcase','footer'];
    checks.push(['Atmosphere covers all eight content regions',
      regionIDs.every(name=>regions.some(el=>el.dataset.atmoZone===name))]);
    checks.push(['Atmosphere compositor is fixed to the viewport',
      Boolean(ambient&&getComputedStyle(ambient).position==='fixed')]);
    checks.push(['Renderer is independent of hero visibility',
      Boolean(atmosphere?.scope==='sitewide'&&document.body.dataset.atmosphereSection)]);

    if(atmosphere?.effective==='off'){
      checks.push(['Off mode removes atmosphere rendering',
        Boolean(ambient?.hidden&&!rendererCanvas)]);
    }else if(atmosphere?.effective==='eco'){
      checks.push(['Eco mode does not run canvas or WebGL',
        Boolean(!rendererCanvas&&atmosphere.renderer==='css')]);
    }else if(atmosphere?.renderer==='gpu'||atmosphere?.renderer==='canvas2d'){
      checks.push(['Active atmosphere has a canvas',
        Boolean(rendererCanvas&&rendererCanvas.width>0&&rendererCanvas.height>0)]);
    }
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
      checks.push(['Reduced motion forbids animated renderer',
        Boolean(atmosphere&&['eco','off'].includes(atmosphere.effective))]);
    }
    // Five-engine sync, portfolio and opt-in audio. No sound or API call is triggered.
    const mesh=window.__wsEngineMesh328?.getStatus?.();
    const themeSurface=getComputedStyle(document.body);
    const projectEngine=window.__wsPortfolio328?.getStatus?.();
    const sound=window.__wsAtmosphereAudio328?.getStatus?.();
    checks.push(['Engine mesh owns six-theme identity',
      Boolean(mesh?.theme===id&&mesh.themeCount===6&&document.body.dataset.wsxTheme===id)]);
    checks.push(['Theme material is available across engine surfaces',
      Boolean(themeSurface.getPropertyValue('--wsx-accent').trim()&&
        document.querySelector('#projects')?.dataset.wsxTheme===id)]);
    checks.push(['Portfolio search and sort controls are available',
      Boolean(projectEngine?.total>0&&document.querySelector('#portfolio-project-search')&&
        document.querySelector('.project-discovery select.project-sort'))]);
    checks.push(['Atmosphere optional audio controls mounted',
      Boolean(sound&&document.querySelector('#ws-audio-ui-sounds')&&
        document.querySelector('#ws-audio-soundscape')&&document.querySelector('#ws-audio-volume'))]);
    // Hero Display v3.27 is checked without triggering animations or video playback.
    const heroDisplay=window.__wsHeroDisplay327?.getStatus?.();
    const heroLayout=document.querySelector('main>.hero.hd-hero');
    const stage=heroLayout?.querySelector('.hd-stage');
    const expectedCompositions={orbit:'orbit',editorial:'editorial',terminal:'terminal',
      'aurora-peak':'alpine','neon-studio':'neon','design-2':'cosmic'};
    const geometry=heroLayout?getComputedStyle(heroLayout):null;
    const tint=geometry?.getPropertyValue('--hd-accent').trim()||'';
    checks.push(['Hero Display Engine theme composition synchronized',
      Boolean(heroDisplay&&heroDisplay.theme===id&&heroDisplay.composition===expectedCompositions[id]&&heroLayout?.dataset.hdLayout===heroDisplay.composition)]);
    checks.push(['Hero has a single non-interactive stage',
      Boolean(stage&&heroLayout.querySelectorAll('.hd-stage').length===1&&stage.getAttribute('aria-hidden')==='true'&&getComputedStyle(stage).pointerEvents==='none')]);
    checks.push(['Theme-native hero layout and palette active',
      Boolean(tint&&heroDisplay?.density&&geometry?.display==='grid')]);
    checks.push(['Hero headline, portrait and actions remain',
      Boolean(heroLayout?.querySelector('h1')&&heroLayout?.querySelector('.hero-art .core img')&&
        heroLayout?.querySelector('.actions a[href="#projects"]')&&document.getElementById('gh-hero-trigger'))]);
    if(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches){
      checks.push(['Hero animations are disabled by reduced motion',
        Boolean(heroDisplay?.motion==='still')]);
    }
        // GitHub hero is inspected without opening it or consuming public API quota.
    const ghRoot=document.getElementById('gh-hero-explorer');
    const ghButton=document.getElementById('gh-hero-trigger');
    const ghPanel=document.getElementById('gh-hero-panel');
    const ghSkin=ghRoot?getComputedStyle(ghRoot):null;
    checks.push(['GitHub hero interactive preview initialized',
      Boolean(ghRoot&&ghButton&&ghPanel&&window.__wsGithubHero324)]);
    checks.push(['GitHub hero has native theme material',
      Boolean(ghSkin?.getPropertyValue('--gh-surface').trim()&&ghSkin?.getPropertyValue('--gh-accent').trim())]);
    checks.push(['GitHub disclosure accessible to keyboard and touch',
      Boolean(ghButton?.getAttribute('aria-controls')==='gh-hero-panel'&&
      ['true','false'].includes(ghButton?.getAttribute('aria-expanded'))&&ghPanel?.getAttribute('role')==='region')]);
    const footer=document.querySelector('.ws-powered-band');
    const footerStyle=footer?getComputedStyle(footer):null;
    if(id!=='neon-studio'){
      const footerInk=footerStyle?.getPropertyValue('--xf-ink').trim()||'';
      const footerSurface=footerStyle?.getPropertyValue('--xf-panel').trim()||'';
      const footerAccent=footerStyle?.getPropertyValue('--xf-accent').trim()||'';
      const ratio=contrast(footerInk,footerSurface);
      const demo=document.getElementById('ws-demo-jump');
      const contact=document.getElementById('ws-interest-toggle');
      checks.push(['Theme-native WebStudio footer material loaded',Boolean(footerInk&&footerSurface&&footerAccent)]);
      checks.push(['Footer ink-on-panel contrast >=4.5:1',ratio>=4.5]);
      checks.push(['Footer demo control available',Boolean(demo&&demo.getAttribute('aria-controls')==='ws-inline-demo')]);
      checks.push(['Footer contact disclosure available',Boolean(contact&&contact.getAttribute('aria-expanded')!==null)]);
      const rings=[...document.querySelectorAll('.ws-powered-band .ws-powered-orbit')];
      const hidden=rings.length&&rings.every(node=>getComputedStyle(node).display==='none');
      if(['editorial','terminal','aurora-peak'].includes(id)){
        checks.push(['Footer orbital rings absent in non-orbital composition',Boolean(hidden)]);
      }else{
        checks.push(['Footer orbit artwork visible for orbital composition',rings.length>0&&rings.some(node=>getComputedStyle(node).display!=='none')]);
      }
    }else{
      checks.push(['Approved Neon footer remains independent',!footerStyle?.getPropertyValue('--xf-accent').trim()]);
    }
    if(id==='terminal') {
      const footer=document.querySelector('.ws-powered-band');
      const glyph=footer?.querySelector('.ws-powered-glyph');
      const orbits=[...(footer?.querySelectorAll('.ws-powered-orbit')||[])];
      const launcher=document.querySelector('#human-ci-panel>.human-ci-toggle');
      const badge=launcher?.querySelector('.human-ci-count');
      checks.push(['Terminal footer uses native square geometry',
        Boolean(footer&&getComputedStyle(footer).borderTopLeftRadius==='0px')]);
      checks.push(['Terminal footer uses mono text heading',
        Boolean(footer&&getComputedStyle(footer.querySelector('h2')).fontFamily.toLowerCase().includes('mono'))]);
      checks.push(['Terminal console glyph replaces Neon artwork',
        Boolean(glyph&&getComputedStyle(glyph).fontSize==='0px')]);
      checks.push(['Terminal footer orbital decorations hidden',
        orbits.length>0&&orbits.every(n=>getComputedStyle(n).display==='none')]);
      checks.push(['Human CI launcher remains compact',
        Boolean(launcher&&launcher.getBoundingClientRect().width<=250)]);
      checks.push(['Human CI badge stays short',
        Boolean(badge&&badge.textContent.trim().split('/').length===2&&badge.textContent.trim().endsWith('/42'))]);
    }
    if(id==='aurora-peak') {
      const connectLink=document.querySelector('.topbar .navlinks a.nav-cta');
      const galleryLaunch=document.querySelector('.topbar .pv-theme-launch');
      const trail=document.querySelector('.hero-art .ap-trail-mark');
      const caption=document.querySelector('.hero-art .portrait-caption');
      const toHex=value=>{
        const parts=(value||'').match(/[0-9]+/g);
        if(!parts||parts.length<3)return '';
        return '#'+parts.slice(0,3).map(n=>Math.min(255,Math.max(0,Math.round(Number(n)))).toString(16).padStart(2,'0')).join('');
      };
      const linkColors=connectLink?getComputedStyle(connectLink):null;
      const galleryColors=galleryLaunch?getComputedStyle(galleryLaunch):null;
      const navContrast=linkColors?contrast(toHex(linkColors.backgroundColor),toHex(linkColors.color)):0;
      checks.push(['Alpine header CTA contrast 4.5:1 or better',navContrast>=4.5]);
      checks.push(['Theme Library uses alpine material',
        Boolean(galleryColors&&galleryColors.backgroundImage.includes('linear-gradient')&&
          toHex(galleryColors.color)==='#18332b')]);
      if(innerWidth>600)checks.push(['Trail note and portrait caption do not overlap',
        Boolean(trail&&caption&&!intersects(trail.getBoundingClientRect(),caption.getBoundingClientRect()))]);

      const landscape=document.querySelector('.hero-art .ap-landscape');
      const portrait=document.querySelector('.hero-art .core');
      const orbit=document.querySelector('.hero-art .orbit');
      const edition=document.querySelector('.hero-text .ap-edition');
      checks.push(['Alpine landscape mounted',Boolean(landscape&&getComputedStyle(landscape).display!=='none')]);
      checks.push(['Arched portrait shape',Boolean(portrait&&getComputedStyle(portrait).borderTopLeftRadius.includes('48%'))]);
      checks.push(['Generic orbit rings hidden',Boolean(orbit&&getComputedStyle(orbit).display==='none')]);
      checks.push(['Alpine edition identity visible',Boolean(edition&&edition.getBoundingClientRect().height>10)]);
      checks.push(['Mountain relief has three layers',document.querySelectorAll('.ap-landscape .ap-ridge').length===3]);
      checks.push(['Aurora mount contract active',document.body.dataset.auroraPeakComposition==='scenic-v318']);
      const control=document.querySelector('.ap-motion-control');
      checks.push(['Alpine motion control available',Boolean(control&&control.tagName==='BUTTON'&&control.getAttribute('aria-pressed')!==null)]);
      checks.push(['Motion preference honored',Boolean(control&&(!window.matchMedia('(prefers-reduced-motion: reduce)').matches||control.disabled))]);
    }
    if(id==='editorial') {
      checks.push(['three editorial margin notes',chips.length===3]);
      if(art&&portrait&&innerWidth>900){
        const p=portrait.getBoundingClientRect();
        checks.push(['editorial labels do not cover photo',chips.every(chip=>!intersects(chip.getBoundingClientRect(),p))]);
      }
      if(chips.length===3 && innerWidth>600) {
        const rects=chips.map(chip=>chip.getBoundingClientRect());
        checks.push(['notes form ordered footnote rail',rects[0].left<rects[1].left && rects[1].left<rects[2].left]);
      }
    }
    const overlayStyle=(id==='editorial'||id==='terminal')&&tile?getComputedStyle(tile,'::after'):null;
    const measurements={portraitSelector,portraitWidth:Math.round(portraitRect?.width||0),
      portraitHeight:Math.round(portraitRect?.height||0),portraitDisplay:portraitStyle?.display||'missing',
      titleWidth:Math.round(titleRect?.width||0),titleHeight:Math.round(titleRect?.height||0),
      overlayOpacity:overlayStyle?.opacity??null,overlayDisplay:overlayStyle?.display??null,
      overlayVisibility:overlayStyle?.visibility??null,overlayContent:overlayStyle?.content??null};
    const result={id,label,accent:chosen,contrastRatio:Number(contrast(bg,ink).toFixed(2)),
      checks,measurements,pass:checks.filter(c=>Boolean(c[1])).length,total:checks.length};
    return result;
  }
  run.addEventListener('click',async()=>{
    const previous=picker.value;
    run.disabled=true;status.textContent='Checking the real page styles…';
    const results=[];
    resultData=null;
    try{
      for(const [id,label,accent] of supported) {
        picker.value=id;
        picker.dispatchEvent(new Event('change',{bubbles:true}));
        await pause();
        results.push(checksFor(id,label,accent));
      }
    }catch(error){status.textContent='Audit encountered an error: '+String(error);}
    finally{
      picker.value=previous;picker.dispatchEvent(new Event('change',{bubbles:true}));
      run.disabled=false;
    }
    const passed=results.reduce((a,r)=>a+r.pass,0);
    resultData={
      release:'v3.28.1-theme-audit',source:'real-browser-computed-styles',
      generatedAt:new Date().toISOString(),url:location.origin+location.pathname,
      viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio||1},
      userAgent:navigator.userAgent,originalTheme:previous,
      successfulThemes:results.length,totalThemes:supported.length,
      results,verifiedByServer:false
    };
    const total=results.reduce((a,r)=>a+r.total,0);
    const horizontalOverflow=document.documentElement.scrollWidth>document.documentElement.clientWidth+2;
    reportText=[
      'WebStudio theme audit v3.28.1',
      'Page build: '+(document.querySelector('meta[name="portfolio-visual-build"]')?.content||'unknown'),
      'Human CI repair: '+(document.querySelector('meta[name="portfolio-human-ci-repair"]')?.content||'not loaded'),
      'Viewport: '+innerWidth+' × '+innerHeight,
      'Checked '+results.length+'/6 themes; static probes '+passed+'/'+total+' passed.',
      'Horizontal overflow present: '+(horizontalOverflow?'yes - visually inspect':'not detected'),
      ...results.flatMap(r=>['',r.label+': '+r.pass+'/'+r.total+' · contrast '+r.contrastRatio+':1',
        ...r.checks.map(([name,ok])=>(ok?'PASS':'FAIL')+' — '+name),
        'Measurements: portrait '+r.measurements.portraitWidth+'×'+r.measurements.portraitHeight+
          ' ('+r.measurements.portraitSelector+', '+r.measurements.portraitDisplay+')'+
          '; title '+r.measurements.titleWidth+'×'+r.measurements.titleHeight+
          '; overlay opacity '+r.measurements.overlayOpacity+
          ', display '+r.measurements.overlayDisplay+
          ', visibility '+r.measurements.overlayVisibility+
          ', content '+r.measurements.overlayContent]),
      '',
      'Manual checks still required: placement, screenshots, responsive touch, video captions and visual identity.'
    ].join('\n');
    reportNode.textContent=reportText;
    status.textContent=results.length===6 && passed===total?'All source-style browser probes passed. Visual review remains required.':'Some probes need attention; review results.';
  });
  copy.addEventListener('click',async()=>{
    if(!reportText){status.textContent='Run the audit first.';return;}
    try{await navigator.clipboard.writeText(reportText);status.textContent='Audit report copied. Paste it into your feedback.';}
    catch{status.textContent='Clipboard unavailable; select the report text manually.';}
  });
  exportButton.addEventListener('click',()=>{
    if(!resultData){status.textContent='Run the audit before exporting.';return;}
    const file=new Blob([JSON.stringify(resultData,null,2)+'\n'],{type:'application/json'});
    const url=URL.createObjectURL(file);
    const link=document.createElement('a');
    link.download='webstudio-theme-audit-v3.28.1.json';link.href=url;
    document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1500);
    status.textContent='Local theme audit JSON exported. Attach it to your Human CI feedback.';
  });
  document.body.append(root);
})();
