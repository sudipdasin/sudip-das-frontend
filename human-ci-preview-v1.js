/* Human CI review console - preview only. Nothing is sent to any server. */
(() => {
  'use strict';
  if (!window.PORTFOLIO_PREVIEW_MODE || document.getElementById('human-ci-panel')) return;
  const checks = [
    ['visual','Neon Studio layout and visual quality'],
    ['responsive','Desktop and tablet layouts (both tested)'],
    ['themes','Switch all six themes and return to Neon'],
    ['projects','Search, filter and open project links'],
    ['navigation','Navigation, keyboard and focus states'],
    ['media','Professional introduction video playback'],
    ['contact','Contact links and preview-only request safety'],
    ['accessibility','Contrast, keyboard zoom and reduced motion'],
    ['mobile','Real mobile-device and touch interactions'],
    ['captions','Native caption visibility and transcript'],
    ['orbit','Orbit-specific composition and controls'],
    ['editorial','Editorial paper aesthetics and controls'],
    ['terminal','Terminal typography and controls'],
    ['aurora','Aurora Peak arch portrait, layered mountains, trail markers and motion toggle'],
    ['cosmic','Cosmic space styling and controls'],
    ['themeIsolation','No Neon styling leaks across themes'],
    ['videoTheme','Media tile native to each selected theme'],
    ['overflow','No horizontal scrolling at test widths'],
    ['transcript','Transcript and English captions verified'],
    ['feedback','Feedback report exported and opened successfully']
  ];
  const key = 'webstudio-human-ci-v3.18';
  const host = document.createElement('aside');
  host.id = 'human-ci-panel';
  host.className = 'human-ci-panel';
  host.setAttribute('aria-label','Human CI testing console');
  host.innerHTML = '<button type="button" class="human-ci-toggle" aria-controls="human-ci-content" aria-expanded="false">🧪 Review preview <span class="human-ci-count">0/20</span></button><div id="human-ci-content" hidden><h2>Human CI · v3.18 alpine visual verification</h2><p>Results from earlier versions are not proof for this build. Test each theme and device again. Your feedback stays local until exported; never include secrets.</p><div class="human-ci-checks"></div><label for="human-ci-notes">Bugs, screenshots to capture, suggestions</label><textarea id="human-ci-notes" rows="4" maxlength="4000" placeholder="What happened? Steps to reproduce? Expected result?"></textarea><details class="human-ci-defects"><summary>Log reproducible bugs / improvements</summary><label for="hc-issue-theme">Affected theme</label><select id="hc-issue-theme"><option value="all">General / multiple themes</option><option value="orbit">Orbit</option><option value="editorial">Editorial</option><option value="terminal">Terminal</option><option value="aurora-peak">Aurora Peak</option><option value="neon-studio">Neon Studio</option><option value="design-2">Cosmic</option></select><label for="hc-severity">Severity</label><select id="hc-severity"><option value="medium">Medium</option><option value="low">Low</option><option value="high">High</option><option value="blocker">Blocker</option></select><label for="hc-issue-description">Actual / expected behavior</label><textarea id="hc-issue-description" maxlength="1000" rows="3" placeholder="What is wrong, and what should happen?"></textarea><label for="hc-issue-steps">Reproduction steps</label><textarea id="hc-issue-steps" maxlength="1000" rows="3" placeholder="Actions, viewport, screenshot reference"></textarea><button type="button" data-action="add-issue">Add issue</button></details><div class="human-ci-issues" aria-live="polite"></div><div class="human-ci-actions"><button type="button" data-action="export">Export feedback JSON</button><button type="button" data-action="copy">Copy report</button><button type="button" data-action="reset">Clear</button></div><p class="human-ci-status" role="status" aria-live="polite"></p></div>';
  const toggle = host.querySelector('.human-ci-toggle');
  const content = host.querySelector('#human-ci-content');
  const list = host.querySelector('.human-ci-checks');
  const notes = host.querySelector('textarea');
  const status = host.querySelector('.human-ci-status');
  let state = { checks:{},notes:'',issues:[] };
  let recoveredNotes=false;
  try {
    const raw=JSON.parse(localStorage.getItem(key)||'null');
    const source=raw&&typeof raw==='object'?raw:JSON.parse(localStorage.getItem('webstudio-human-ci-v3.17')||localStorage.getItem('webstudio-human-ci-v3.15')||'null');
    if(source&&typeof source==='object'){
      state.notes=typeof source.notes==='string'?source.notes.slice(0,4000):'';
      recoveredNotes=!!state.notes && !raw;
      // No old Pass is accepted as a verified result for this new build.
      if(raw){
        state.checks=Object.fromEntries(checks.map(([id])=>[id,['pass','fail','todo'].includes(source.checks?.[id])?source.checks[id]:'todo']));
        if(Array.isArray(source.issues))state.issues=source.issues.slice(0,30).filter(x=>x&&typeof x.description==='string').map(x=>({
          id:String(x.id||Date.now()),theme:String(x.theme||'all').slice(0,40),
          severity:String(x.severity||'medium').slice(0,20),description:x.description.slice(0,1000),
          steps:String(x.steps||'').slice(0,1000),viewport:String(x.viewport||'').slice(0,30)
        }));
      }
    }
  }catch{}
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
  const issuesNode=host.querySelector('.human-ci-issues');
  const description=host.querySelector('#hc-issue-description');
  const steps=host.querySelector('#hc-issue-steps');
  const issueTheme=host.querySelector('#hc-issue-theme');
  const severity=host.querySelector('#hc-severity');
  const safeTheme=new Set(['all','orbit','editorial','terminal','aurora-peak','neon-studio','design-2']);
  const drawIssues=()=>{
    issuesNode.replaceChildren();
    if(!state.issues.length){const p=document.createElement('p');p.textContent='No issues logged on this build.';issuesNode.append(p);return;}
    state.issues.forEach((issue,i)=>{
      const row=document.createElement('div');row.className='human-ci-issue';
      const label=document.createElement('p');label.textContent=(i+1)+'. '+issue.severity.toUpperCase()+' / '+issue.theme+' — '+issue.description;
      const remove=document.createElement('button');remove.type='button';remove.dataset.removeIssue=issue.id;remove.textContent='Remove';
      row.append(label,remove);issuesNode.append(row);
    });
  };
  host.querySelector('[data-action="add-issue"]').addEventListener('click',()=>{
    const summary=description.value.trim();
    if(!summary){status.textContent='Describe the issue first.';description.focus();return;}
    if(state.issues.length>=30){status.textContent='Maximum 30 issues per report. Export first.';return;}
    state.issues.push({
      id:Date.now()+'-'+state.issues.length,
      theme:safeTheme.has(issueTheme.value)?issueTheme.value:'all',
      severity:['low','medium','high','blocker'].includes(severity.value)?severity.value:'medium',
      description:summary.slice(0,1000),steps:steps.value.slice(0,1000),
      viewport:innerWidth+'x'+innerHeight
    });
    description.value='';steps.value='';persist();status.textContent='Issue stored locally. Add screenshots when sending feedback.';
  });
  issuesNode.addEventListener('click',event=>{
    const button=event.target.closest('button[data-remove-issue]');
    if(!button)return;
    state.issues=state.issues.filter(x=>x.id!==button.dataset.removeIssue);persist();
  });
  const snapshot=()=>({
    schemaVersion:2,project:'Sudip Das portfolio',environment:'preview-personalweb',
    url:location.origin+location.pathname,release:'v3.18-human-ci',reviewType:'manual-observation',automatedBrowserVerified:false,
    collectedAt:new Date().toISOString(),
    theme:document.body.dataset.theme || 'unknown',
    userAgent:navigator.userAgent,viewport:{width:innerWidth,height:innerHeight,dpr:devicePixelRatio||1},checks:Object.fromEntries(checks.map(([id])=>[id,state.checks[id]||'todo'])),notes:state.notes,issues:state.issues,reviewComplete:checks.every(([id])=>state.checks[id]==='pass')&&state.issues.length===0
  });
  const persist=()=>{
    try{localStorage.setItem(key,JSON.stringify(state));}catch{status.textContent='Browser storage unavailable; export your report before closing.';}
    const count=checks.filter(([id])=>state.checks[id]==='pass').length;
    const failed=checks.filter(([id])=>state.checks[id]==='fail').length;
    toggle.querySelector('.human-ci-count').textContent=count+' passed · '+failed+' failed · '+(checks.length-count-failed)+' pending · '+state.issues.length+' logged';
    drawIssues();
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
      '\n\nIssues:\n'+state.issues.map(x=>x.severity+' / '+x.theme+' / '+x.viewport+' — '+x.description+'\n'+x.steps).join('\n')+'\n\nNotes:\n'+state.notes;
  };
  host.querySelector('[data-action="copy"]').addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(reportText());status.textContent='Report copied.';}
    catch{status.textContent='Clipboard unavailable; use Export JSON instead.';}
  });
  host.querySelector('[data-action="export"]').addEventListener('click',()=>{
    const blob=new Blob([JSON.stringify(snapshot(),null,2)+'\n'],{type:'application/json'});
    const url=URL.createObjectURL(blob);
    const link=document.createElement('a');link.href=url;link.download='webstudio-human-ci-v3.18.json';link.click();
    setTimeout(()=>URL.revokeObjectURL(url),2000);
    status.textContent='Report exported locally. Attach the file when providing feedback.';
  });
  host.querySelector('[data-action="reset"]').addEventListener('click',()=>{
    if(!confirm('Clear your locally saved review?'))return;
    state={checks:{},notes:'',issues:[]};notes.value='';description.value='';steps.value='';
    list.querySelectorAll('select').forEach(select=>{select.value='todo';});
    persist();status.textContent='Local review cleared.';
  });
  document.body.append(host);
  persist();
  if(recoveredNotes)status.textContent='Earlier notes recovered; old passing scores reset for this new build.';
})();
