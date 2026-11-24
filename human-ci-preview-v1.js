/* Human CI review console - preview only. Nothing is sent to any server. */
(() => {
  'use strict';
  if (!window.PORTFOLIO_PREVIEW_MODE || document.getElementById('human-ci-panel')) return;
  const checks = [
    ['visual','Neon Studio layout and visual quality'],
    ['responsive','Mobile, tablet and desktop layouts'],
    ['themes','Switch all six themes and return to Neon'],
    ['projects','Search, filter and open project links'],
    ['navigation','Navigation, keyboard and focus states'],
    ['media','Introduction video and captions'],
    ['contact','Contact links and preview-only request safety'],
    ['accessibility','Contrast, zoom and reduced motion']
  ];
  const key = 'webstudio-human-ci-v3.14';
  const host = document.createElement('aside');
  host.id = 'human-ci-panel';
  host.className = 'human-ci-panel';
  host.setAttribute('aria-label','Human CI testing console');
  host.innerHTML = '<button type="button" class="human-ci-toggle" aria-controls="human-ci-content" aria-expanded="false">🧪 Review preview <span class="human-ci-count">0/8</span></button><div id="human-ci-content" hidden><h2>Human CI · v3.14 preview</h2><p>Check the site yourself. Feedback stays in this browser unless you export it. Do not include secrets.</p><div class="human-ci-checks"></div><label for="human-ci-notes">Bugs, screenshots to capture, suggestions</label><textarea id="human-ci-notes" rows="4" maxlength="4000" placeholder="What happened? Steps to reproduce? Expected result?"></textarea><div class="human-ci-actions"><button type="button" data-action="export">Export feedback JSON</button><button type="button" data-action="copy">Copy report</button><button type="button" data-action="reset">Clear</button></div><p class="human-ci-status" role="status" aria-live="polite"></p></div>';
  const toggle = host.querySelector('.human-ci-toggle');
  const content = host.querySelector('#human-ci-content');
  const list = host.querySelector('.human-ci-checks');
  const notes = host.querySelector('textarea');
  const status = host.querySelector('.human-ci-status');
  let state = { checks:{},notes:'' };
  try {
    const raw = JSON.parse(localStorage.getItem(key) || '{}');
    if(raw && typeof raw==='object' && raw.checks && typeof raw.checks==='object') {
      state.checks = Object.fromEntries(checks.map(([id])=>[id,['pass','fail','todo'].includes(raw.checks[id])?raw.checks[id]:'todo']));
      state.notes = typeof raw.notes==='string' ? raw.notes.slice(0,4000) : '';
    }
  } catch {}
  checks.forEach(([id,title])=>{
    const label=document.createElement('label');
    label.textContent=title;
    const select=document.createElement('select');
    select.setAttribute('aria-label', title+' status');
    select.dataset.check=id;
    [['todo','Not checked'],['pass','Pass'],['fail','Issue found']].forEach(([value,caption])=>{
      const o=document.createElement('option');o.value=value;o.textContent=caption;select.append(o);
    });
    select.value=state.checks[id] || 'todo';
    label.append(select);list.append(label);
  });
  notes.value=state.notes;
  const snapshot=()=>({
    schemaVersion:1,project:'Sudip Das portfolio',environment:'preview-personalweb',
    url:location.origin+location.pathname,release:'v3.14-human-ci',
    collectedAt:new Date().toISOString(),
    theme:document.body.dataset.theme || 'unknown',
    userAgent:navigator.userAgent,checks:state.checks,notes:state.notes
  });
  const persist=()=>{
    try{localStorage.setItem(key,JSON.stringify(state));}catch{status.textContent='Browser storage unavailable; export your report before closing.';}
    const count=checks.filter(([id])=>state.checks[id]==='pass').length;
    toggle.querySelector('.human-ci-count').textContent=count+'/'+checks.length;
  };
  list.addEventListener('change',e=>{
    const target=e.target.closest('select[data-check]');
    if(!target)return;
    state.checks[target.dataset.check]=target.value;
    persist();
  });
  notes.addEventListener('input',()=>{state.notes=notes.value;persist();});
  toggle.addEventListener('click',()=>{
    content.hidden=!content.hidden;
    toggle.setAttribute('aria-expanded',String(!content.hidden));
    if(!content.hidden) notes.focus();
  });
  const reportText=()=>{
    const report=snapshot();
    return 'WebStudio human CI · '+report.release+'\nPreview: '+report.url+'\nTheme: '+report.theme+'\n'+
      checks.map(([id,title])=>title+': '+(state.checks[id]||'todo')).join('\n')+
      '\n\nNotes:\n'+state.notes;
  };
  host.querySelector('[data-action="copy"]').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(reportText());status.textContent='Report copied.';}
    catch{status.textContent='Clipboard unavailable; use Export JSON instead.';}
  });
  host.querySelector('[data-action="export"]').addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify(snapshot(),null,2)+'\n'],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download='webstudio-human-ci-v3.14.json';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
    status.textContent='Report exported locally. Attach the file when providing feedback.';
  });
  host.querySelector('[data-action="reset"]').addEventListener('click',()=>{
    if(!confirm('Clear your locally saved review?'))return;
    state={checks:{},notes:''};notes.value='';
    list.querySelectorAll('select').forEach(select=>{select.value='todo';});
    persist();status.textContent='Local review cleared.';
  });
  document.body.append(host);
  persist();
})();
