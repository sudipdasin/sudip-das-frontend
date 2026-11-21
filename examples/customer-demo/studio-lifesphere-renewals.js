/* LifeSphere Documents & Renewals: fictional, session-only public preview.
   This module NEVER accesses the encrypted private vault or stores personal files. */
(() => {
 'use strict';
 const host=document.getElementById('lifesphere');
 if (!host) return;
 const section=document.createElement('section');
 section.className='lifesphere-renewals';
 section.setAttribute('aria-labelledby','ls-renewal-title');
 const heading=document.createElement('h3');
 heading.id='ls-renewal-title';heading.textContent='Documents & Renewals — sample planner';
 const description=document.createElement('p');
 description.textContent='Preview deadline alerts with fictional examples. No government ID, bank record, password or personal document is collected or uploaded.';
 const form=document.createElement('form');form.className='ls-renewal-form';
 const label=document.createElement('label');label.textContent='Sample document';
 const kind=document.createElement('select');kind.setAttribute('aria-label','Select fictional document category');
 const options=[['insurance','Sample insurance renewal'],['bond','Sample bond maturity'],['passport','Sample passport expiry'],['vehicle','Sample vehicle registration'],['property','Sample property tax'],['sip','Sample SIP installment']];
 for(const [key,name] of options){const opt=document.createElement('option');opt.value=key;opt.textContent=name;kind.append(opt);}
 label.append(kind);
 const dateLabel=document.createElement('label');dateLabel.textContent='Example due date';
 const date=document.createElement('input');date.type='date';date.required=true;date.setAttribute('aria-label','Select example due date');dateLabel.append(date);
 const rangeLabel=document.createElement('label');rangeLabel.textContent='Notify ahead';
 const lead=document.createElement('select');lead.setAttribute('aria-label','Sample reminder lead time');
 for (const days of [7,14,30,60,90]){const opt=document.createElement('option');opt.value=String(days);opt.textContent=days+' days';if(days===30)opt.selected=true;lead.append(opt);}rangeLabel.append(lead);
 const button=document.createElement('button');button.type='submit';button.textContent='Preview reminder';button.className='ghost';
 const result=document.createElement('p');result.className='ls-renewal-result';result.setAttribute('role','status');
 const safety=document.createElement('p');safety.className='lifesphere-disclaimer';safety.textContent='Fictional interactive preview only. Your entries are not saved. The actual encrypted Documents module is distributed separately as a development prototype; no background alerts, cloud sync or official document retrieval operate on this public page.';
 form.append(label,dateLabel,rangeLabel,button);section.append(heading,description,form,result,safety);
 const footer=host.querySelector('.lifesphere-disclaimer');if(footer)host.insertBefore(section,footer);else host.append(section);
 const today=new Date();today.setHours(12,0,0,0);
 const initial=new Date(today);initial.setDate(initial.getDate()+29);
 const local=date=>date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');
 date.value=local(initial);
 form.addEventListener('submit',event=>{
  event.preventDefault();
  const raw=date.value;
  if(!/^\d{4}-\d{2}-\d{2}$/.test(raw)){result.textContent='Enter a valid date.';return;}
  const due=new Date(raw+'T12:00:00');
  if(Number.isNaN(+due)||local(due)!==raw){result.textContent='Enter a valid date.';return;}
  const now=new Date();now.setHours(12,0,0,0);
  const days=Math.round((due-now)/86400000);
  const chosen=kind.selectedOptions[0]?.textContent||'Example record';
  const advance=Number(lead.value);
  result.textContent=(days<0?'OVERDUE example: '+Math.abs(days)+' days past due':days<=advance?'DUE SOON example: '+days+' day(s) remaining':'UPCOMING example: '+days+' day(s) remaining')+' · '+chosen+'. '+advance+'-day advance reminder. No alert was scheduled.';
 });
})();
