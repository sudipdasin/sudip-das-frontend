/* Preview-only visual audit for real-browser human CI. Never touches hosting, credentials, APIs or production. */
(() => {
  'use strict';
  if (!window.PORTFOLIO_PREVIEW_MODE || new URLSearchParams(location.search).get('theme-audit') !== '1') return;
  if (document.getElementById('ws-theme-audit-v316')) return;
  const picker = document.getElementById('theme-select');
  const supported = [
    ['orbit','Orbit','42f0d3'],['editorial','Editorial','785338'],
    ['terminal','Terminal','55ffa4'],['aurora-peak','Aurora Peak','86f4d4'],
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
      <summary>◈ Theme audit · v3.16</summary>
      <article>
        <p>Tests active CSS and layout in this browser, one theme at a time. No screenshots or data are uploaded.</p>
        <p class="tip">Repeat at desktop, tablet and mobile widths. Automated checks do not replace your visual review.</p>
        <button id="run" type="button">Run six-theme audit</button>
        <button id="copy" type="button">Copy report</button>
        <p id="status" role="status" aria-live="polite">Not tested yet.</p>
        <pre id="report">No results.</pre>
      </article>
    </details>`;
  const run = shadow.getElementById('run');
  const copy = shadow.getElementById('copy');
  const status = shadow.getElementById('status');
  const reportNode = shadow.getElementById('report');
  const pause = () => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  let reportText='';
  function checksFor(id,label,expectedAccent) {
    const style=getComputedStyle(document.body);
    const chosen=style.getPropertyValue('--ci-accent').trim().replace('#','').toLowerCase();
    const tile=document.querySelector('.pv-intro-tile .pv-intro-hero-cta');
    const video=document.querySelector('.pv-intro-tile .pv-intro-cta-motion');
    const expand=document.getElementById('pv-intro-expand');
    const chips=[...document.querySelectorAll('.hero-art .ws-orbit-chip')];
    const checks=[
      ['theme switched',document.body.dataset.theme===id],
      ['correct distinct theme accent',chosen===expectedAccent],
      ['video expand control remains operable',Boolean(expand && !expand.disabled && expand.getAttribute('aria-controls'))],
      ['approved theme repair sheet linked',Boolean(document.querySelector('link[href*="personal-theme-identity-v316.css"]'))]
    ];
    if(tile && video) {
      const tileStyle=getComputedStyle(tile);
      const videoStyle=getComputedStyle(video);
      if(id==='editorial'||id==='terminal') {
        checks.push(['no Neon hover video in static theme',videoStyle.display==='none']);
        checks.push(['no Neon poster in static theme',tileStyle.backgroundImage==='none'||id==='terminal'&&tileStyle.backgroundImage.includes('repeating-linear-gradient')]);
        checks.push(['no dark video overlay',Number.parseFloat(getComputedStyle(tile,'::after').opacity)===0]);
      } else if(id!=='neon-studio') {
        checks.push(['distinct visual background available',tileStyle.backgroundImage!=='none']);
      }
    } else checks.push(['video UI initialized',false]);
    if(id==='editorial') {
      checks.push(['three editorial margin notes',chips.length===3]);
      if(chips.length===3 && innerWidth>600) {
        const rects=chips.map(chip=>chip.getBoundingClientRect());
        checks.push(['notes form ordered footnote rail',rects[0].left<rects[1].left && rects[1].left<rects[2].left]);
      }
    }
    const result={id,label,checks,pass:checks.filter(c=>Boolean(c[1])).length,total:checks.length};
    return result;
  }
  run.addEventListener('click',async()=>{
    const previous=picker.value;
    run.disabled=true;status.textContent='Checking the real page styles…';
    const results=[];
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
    const total=results.reduce((a,r)=>a+r.total,0);
    const horizontalOverflow=document.documentElement.scrollWidth>document.documentElement.clientWidth+2;
    reportText=[
      'WebStudio theme audit v3.16',
      'Viewport: '+innerWidth+' × '+innerHeight,
      'Checked '+results.length+'/6 themes; static probes '+passed+'/'+total+' passed.',
      'Horizontal overflow present: '+(horizontalOverflow?'yes - visually inspect':'not detected'),
      ...results.flatMap(r=>['',r.label+': '+r.pass+'/'+r.total,...r.checks.map(([name,ok])=>(ok?'PASS':'FAIL')+' — '+name)]),
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
  document.body.append(root);
})();
