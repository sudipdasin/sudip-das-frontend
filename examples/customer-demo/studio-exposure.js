/* Exposure Watch — private, local security triage, NOT an automated breach scanner. */
(() => {
  'use strict';
  const root = document.getElementById('exposure-watch');
  if (!root) return;
  const $ = id => root.querySelector('#' + id);
  const KEY = 'devdas-webstudio:exposure-watch:v1';
  const MAX = 30;
  let incidents = [];
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || '[]');
    if (Array.isArray(saved)) incidents = saved.slice(0,MAX).filter(x=>
      x && typeof x.id === 'string' && /^[0-9a-f-]{16,64}$/i.test(x.id) &&
      typeof x.category === 'string' && ['account','identity','financial','phishing'].includes(x.category) &&
      typeof x.note === 'string' && x.note.length <= 240 &&
      ['reported','investigating','resolved'].includes(x.status) &&
      typeof x.when === 'string' && !Number.isNaN(Date.parse(x.when))
    );
  } catch {}
  function save(){
    try { localStorage.setItem(KEY, JSON.stringify(incidents)); return true; }
    catch { $('ew-status').textContent = 'Browser storage unavailable: items will not survive a reload.'; return false; }
  }
  const guidance = {
    account: 'Change the affected password directly on the service, revoke suspicious sessions, enable MFA, and check account recovery settings.',
    identity: 'Secure impacted accounts, review exposed profile details, and watch for impersonation or phishing. Consider local identity-protection resources.',
    financial: 'Contact your bank or card issuer via official channels, review transactions, and follow their fraud-response instructions.',
    phishing: 'Do not open suspicious links. Verify messages using a known official website or phone number; report and block the sender.'
  };
  function render(){
    const list = $('ew-list'); list.replaceChildren();
    const open=incidents.filter(x=>x.status!=='resolved').length;
    $('ew-count').textContent = open
      ? open+' user-reported concern'+(open===1?'':'s')+' needing review'
      : 'No unresolved concerns recorded locally';
    $('ew-count').className = open ? 'ew-alert' : 'ew-ok';
    if (!incidents.length){
      const empty=document.createElement('p');
      empty.className='muted';
      empty.textContent='No incidents recorded. This is not proof that your identity is safe or that no breach exists.';
      list.append(empty); return;
    }
    for (const item of incidents){
      const card=document.createElement('article');card.className='ew-item';
      const title=document.createElement('strong');title.textContent=({
        account:'Account or password concern',identity:'Identity or personal-data concern',
        financial:'Financial information concern',phishing:'Phishing or impersonation concern'
      })[item.category];
      const meta=document.createElement('p');meta.className='muted';
      meta.textContent='Self-reported • '+new Date(item.when).toLocaleDateString()+' • '+item.status;
      const note=document.createElement('p');note.textContent=item.note;
      const tips=document.createElement('p');tips.className='ew-guidance';tips.textContent=guidance[item.category];
      const actions=document.createElement('div');actions.className='ew-actions';
      const status=document.createElement('select');
      status.setAttribute('aria-label','Update incident status');
      for(const name of ['reported','investigating','resolved']){
        const option=document.createElement('option');option.value=name;option.textContent=name;
        status.append(option);
      }
      status.value=item.status;
      status.addEventListener('change',()=>{
        item.status=status.value;
        save(); render();
        $('ew-status').textContent='Incident status updated locally.';
      });
      const remove=document.createElement('button');remove.type='button';remove.className='ghost';
      remove.textContent='Delete record';remove.addEventListener('click',()=>{
        incidents=incidents.filter(x=>x.id!==item.id);save();render();
        $('ew-status').textContent='Local incident record deleted.';
      });
      actions.append(status,remove);card.append(title,meta,note,tips,actions);list.append(card);
    }
  }
  $('ew-form').addEventListener('submit',event=>{
    event.preventDefault();
    if(incidents.length>=MAX){$('ew-status').textContent='Maximum 30 local incidents; resolve or delete older items.';return;}
    const category=$('ew-category').value;
    const note=$('ew-note').value.trim().slice(0,240);
    if (!guidance[category] || !note){$('ew-status').textContent='Choose a concern type and describe it briefly.';return;}
    incidents.unshift({id:crypto.randomUUID(),category,note,status:'reported',when:new Date().toISOString()});
    save();render();$('ew-note').value='';
    $('ew-status').textContent='Concern recorded locally. Not externally verified. Review recommended steps.';
  });
  $('ew-clear').addEventListener('click',()=>{
    if(!incidents.length)return;
    if(!window.confirm('Delete all locally stored Exposure Watch records on this device?'))return;
    incidents=[];save();render();$('ew-status').textContent='Local records cleared.';
  });
  render();
})();
