/* WebStudio Visitor Experience — local-only, read-only guide over owner-approved public DOM.
 * No analytics, external requests, private records, or account mutation.
 */
(() => {
 'use strict';
 const byId=id=>document.getElementById(id);
 const gallery=byId('profile-showcase'), projectGrid=document.querySelector('#projects .project-grid');
 if(!gallery||!projectGrid)return;
 const sectionIds=['about','projects','experience','capabilities','contact'];
 const sections=sectionIds.map(id=>({id,element:byId(id)})).filter(item=>item.element);
 const cards=[...projectGrid.querySelectorAll('article.project')];
 const el=(tag,cls,text)=>{
   const x=document.createElement(tag);if(cls)x.className=cls;if(text!==undefined)x.textContent=text;return x;
 };
 const side=el('section','ws-visitor-hub');side.id='ws-visitor-hub';side.setAttribute('aria-labelledby','ws-hub-heading');
 const title=el('h3','', 'Portfolio explorer');title.id='ws-hub-heading';
 const desc=el('p','ws-hub-intro','Take a guided tour or build a shortlist of publicly listed projects. No account or tracking required.');
 const actions=el('div','ws-hub-actions');
 const tourLaunch=el('button','ws-hub-primary','Start guided tour');tourLaunch.type='button';tourLaunch.id='ws-tour-start';
 const copyLaunch=el('button','ws-hub-secondary','Copy selected projects');copyLaunch.type='button';copyLaunch.id='ws-shortlist-copy';
 const clearLaunch=el('button','ws-hub-secondary','Clear shortlist');clearLaunch.type='button';clearLaunch.id='ws-shortlist-clear';
 actions.append(tourLaunch,copyLaunch,clearLaunch);
 const label=el('p','ws-hub-selected');label.id='ws-shortlist-status';label.setAttribute('role','status');
 const info=el('p','ws-hub-privacy','Shortlist is stored only in this browser session and never sent to the website.');
 side.append(title,desc,actions,label,info);
 gallery.insertAdjacentElement('afterend',side);

 const shortlist=new Set();
 const items=cards.map((card,i)=>{
   const name=card.querySelector('h3')?.textContent?.trim()||'Project '+(i+1);
   const href=card.querySelector('.project-link[href]')?.getAttribute('href')||'';
   const summary=card.querySelector('p:not(.project-note)')?.textContent?.trim()||'';
   const button=el('button','ws-shortlist-toggle');button.type='button';
   button.dataset.shortlistIndex=String(i);
   button.setAttribute('aria-label','Add '+name+' to project shortlist');
   card.append(button);
   button.addEventListener('click',()=>{
     if(shortlist.has(i))shortlist.delete(i);
     else shortlist.add(i);
     updateShortlist();
   });
   return {name,href,summary,button};
 });
 function updateShortlist(message){
   for(const [index,item] of items.entries()){
     const selected=shortlist.has(index);
     item.button.setAttribute('aria-pressed',String(selected));
     item.button.textContent=selected?'✓ Shortlisted':'+ Shortlist';
     item.button.setAttribute('aria-label',(selected?'Remove ':'Add ')+item.name+(selected?' from':' to')+' project shortlist');
   }
   copyLaunch.disabled=shortlist.size===0;
   clearLaunch.disabled=shortlist.size===0;
   label.textContent=message||shortlist.size+' of '+items.length+' public projects shortlisted.';
 }
 async function copyShortlist(){
   if(!shortlist.size)return;
   const text=['Selected public projects from Sudip Das portfolio',
     ...[...shortlist].sort((a,b)=>a-b).map(i=>{
       const x=items[i];
       // Only approved public project fields are included. Never append private URLs or records.
       const allowed=/^https:\/\//i.test(x.href)||/^http:\/\//i.test(x.href);
       return '\n'+x.name+'\n'+x.summary+(allowed?'\n'+new URL(x.href,location.origin).href:'');
     })].join('\n');
   try{
     if(!navigator.clipboard?.writeText)throw Error('Clipboard API unavailable');
     await navigator.clipboard.writeText(text);
     updateShortlist('Copied '+shortlist.size+' publicly listed projects to clipboard.');
   }catch{
     // Fallback is explicitly user-driven; do not write to clipboard with hidden hacks.
     const panel=byId('ws-shortlist-text');
     panel.hidden=false;panel.value=text;panel.focus();panel.select();
     updateShortlist('Clipboard unavailable. Select and copy the public project list below.');
   }
 }
 const fallback=el('textarea','ws-shortlist-text');
 fallback.id='ws-shortlist-text';fallback.hidden=true;fallback.readOnly=true;
 fallback.setAttribute('aria-label','Copyable list of shortlisted public projects');
 fallback.rows=7;side.append(fallback);
 copyLaunch.addEventListener('click',copyShortlist);
 clearLaunch.addEventListener('click',()=>{shortlist.clear();fallback.hidden=true;updateShortlist();});
 updateShortlist();

 // Guided portfolio walkthrough built from existing approved section headings.
 const modal=el('div','ws-tour');modal.id='ws-tour';modal.hidden=true;
 modal.setAttribute('role','dialog');modal.setAttribute('aria-modal','true');
 modal.setAttribute('aria-labelledby','ws-tour-heading');
 const shade=el('div','ws-tour-shade');
 const shell=el('div','ws-tour-panel');
 const top=el('div','ws-tour-top'), heading=el('h2','','Explore this portfolio');
 heading.id='ws-tour-heading';
 const close=el('button','ws-tour-close','×');close.type='button';close.setAttribute('aria-label','Close guided tour');
 top.append(heading,close);
 const progress=el('p','ws-tour-progress');progress.setAttribute('role','status');
 const stepHeading=el('h3','ws-tour-step-heading');
 const body=el('p','ws-tour-body');
 const navigation=el('div','ws-tour-navigation');
 const previous=el('button','','← Back');previous.type='button';
 const visit=el('button','ws-tour-visit','Visit section');visit.type='button';
 const next=el('button','','Next →');next.type='button';
 navigation.append(previous,visit,next);
 const hint=el('p','ws-tour-hint','Use ← and → to move through the tour. Escape closes this dialog.');
 shell.append(top,progress,stepHeading,body,navigation,hint);
 modal.append(shade,shell);document.body.append(modal);
 let position=0,opener=null;
 const descriptions={
  about:'See the public introduction and experience summary.',
  projects:'Explore selected software projects and their linked public repositories.',
  experience:'Review the public professional timeline and the skills developed there.',
  capabilities:'Discover technology strengths and practical areas of expertise.',
  contact:'Find approved public contact and collaboration information.'
 };
 function showStep(){
   const step=sections[position];if(!step)return;
   const candidate=step.element.querySelector('.section-head h2,h2');
   stepHeading.textContent=candidate?.textContent?.trim()||step.id.charAt(0).toUpperCase()+step.id.slice(1);
   body.textContent=descriptions[step.id]||'Explore this public section.';
   progress.textContent='Stop '+(position+1)+' of '+sections.length;
   previous.disabled=position===0;
   next.textContent=position===sections.length-1?'Finish tour':'Next →';
 }
 function openTour(){
   if(!sections.length)return;
   opener=document.activeElement;position=0;showStep();modal.hidden=false;close.focus();
 }
 function closeTour(){
   if(modal.hidden)return;
   modal.hidden=true;
   if(opener?.isConnected)opener.focus();
 }
 function goToSection(){
   const step=sections[position];
   if(document.body.dataset.theme==='terminal'){
     const link=document.querySelector('.navlinks a[href="#'+step.id+'"]');
     if(link)link.click();
   }
   step.element.scrollIntoView({behavior:'auto',block:'start'});
   closeTour();
 }
 tourLaunch.addEventListener('click',openTour);
 close.addEventListener('click',closeTour);shade.addEventListener('click',closeTour);
 previous.addEventListener('click',()=>{position=Math.max(position-1,0);showStep();});
 next.addEventListener('click',()=>{
   if(position===sections.length-1){closeTour();return;}
   position++;showStep();
 });
 visit.addEventListener('click',goToSection);
 modal.addEventListener('keydown',event=>{
   if(event.key==='Escape'){event.preventDefault();closeTour();return;}
   if(event.key==='ArrowRight'){event.preventDefault();position=Math.min(position+1,sections.length-1);showStep();return;}
   if(event.key==='ArrowLeft'){event.preventDefault();position=Math.max(position-1,0);showStep();return;}
   if(event.key!=='Tab')return;
   const controls=[close,previous,visit,next].filter(x=>!x.disabled);
   const first=controls[0],last=controls.at(-1);
   if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
   else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
 });
 // Honor user's reduced-motion and browser privacy choices, no analytics.
})();
