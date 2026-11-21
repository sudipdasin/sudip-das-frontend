/* Guided free-plan onboarding, real local ZIP export, and transparent feedback.
   No account verification claims, tracking endpoints, or artificial degradation. */
(()=>{
 'use strict';
 const api=window.WebStudioStarter;
 const panel=document.getElementById('ws-free-starter');
 if(!panel||!api)return;
 const $=id=>document.getElementById(id);
 const steps=[
  ['Welcome to WebStudio','Explore six distinctive visual directions. Free includes the Orbit and Editorial starter themes; the other four are Pro previews.','01','Design'],
  ['Build a genuine portfolio','Edit your display name, role, tagline, SEO, projects, and contact information in the working local editor.','02','Create'],
  ['Own your starter files','Generate a complete static-site ZIP with HTML, CSS, JSON and manual publishing instructions. No hosting account is needed to export.','03','Export'],
  ['Keep your privacy','Static website files are readable by visitors. Never place passwords or private records in browser assets. Cloud vault and encrypted server features are not in this edition.','04','Protect'],
  ['Help shape the product','Feedback after two days is appreciated. You can compose it in your email application; delivery cannot be verified from this static site.','05','Improve']
 ];
 const onboard=$('ws-free-onboard'),begin=$('ws-free-begin'),next=$('ws-free-next'),back=$('ws-free-back');
 const tourProgress=$('ws-free-step'),tourTitle=$('ws-free-tour-title'),tourCopy=$('ws-free-tour-copy'),tourIcon=$('ws-free-tour-icon');
 const terms=$('ws-free-terms'),theme=$('ws-free-theme'),email=$('ws-free-reply'),status=$('ws-free-status');
 const exportBtn=$('ws-free-export'),feedback=$('ws-free-feedback'),feedbackNotes=$('ws-free-feedback-text');
 let step=0,completed=false;
 const storeKey='webstudio:free-intro-v1';
 const firstKey='webstudio:free-feedback-start-v1';
 const feedbackAfter=48*60*60*1000;
 const safeRead=(key)=>{try{return localStorage.getItem(key);}catch{return null;}};
 const safeWrite=(key,value)=>{try{localStorage.setItem(key,value);}catch{}};
 function update(){
  const s=steps[step];
  tourProgress.textContent='STEP '+s[2]+' / '+steps.length+' · '+s[3].toUpperCase();
  tourTitle.textContent=s[0];tourCopy.textContent=s[1];
  tourIcon.textContent=['✦','◈','⬡','◇','✉'][step];
  back.disabled=step===0;
  next.textContent=step===steps.length-1?'Complete walkthrough':'Next chapter';
  const percent=Math.round((step+1)/steps.length*100);
  $('ws-free-meter').style.width=percent+'%';
 }
 function renderStart(){
  completed=safeRead(storeKey)==='completed';
  if(completed){onboard.hidden=true;begin.textContent='Replay full walkthrough';}
  const started=Number(safeRead(firstKey)||0),elapsed=started?Date.now()-started:0;
  if(started&&elapsed>=feedbackAfter&&!safeRead('webstudio:free-feedback-reminded-v1')){
   $('ws-free-reminder').hidden=false;
  }
 }
 begin.addEventListener('click',()=>{
  step=0;completed=false;onboard.hidden=false;update();
  onboard.scrollIntoView({behavior:'smooth',block:'center'});next.focus();
 });
 back.addEventListener('click',()=>{if(step>0){step--;update();}});
 next.addEventListener('click',()=>{
  if(step<steps.length-1){step++;update();return;}
  completed=true;safeWrite(storeKey,'completed');
  if(!safeRead(firstKey))safeWrite(firstKey,String(Date.now()));
  onboard.hidden=true;begin.textContent='Replay full walkthrough';
  status.textContent='Walkthrough complete. Choose a free theme, accept the starter terms, and export your site.';
  theme.focus();
 });
 function clearReminder(){
  $('ws-free-reminder').hidden=true;safeWrite('webstudio:free-feedback-reminded-v1','1');
 }
 $('ws-free-reminder-dismiss').addEventListener('click',clearReminder);
 const validReply=v=>v===''||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)&&v.length<=180;
 exportBtn.addEventListener('click',()=>{
  status.textContent='';
  if(!completed){status.textContent='Complete all five walkthrough chapters before exporting.';begin.focus();return;}
  if(!terms.checked){status.textContent='Review and accept the local export terms first.';terms.focus();return;}
  if(!validReply(email.value.trim())){status.textContent='Enter a valid optional reply email or leave it empty.';email.focus();return;}
  try{
   const current=window.StudioDemo?.getProfile?.();
   if(!current)throw Error('The editable demo profile is still loading. Try again.');
   const files=api.build(current,theme.value),archive=api.zip(files);
   const address=URL.createObjectURL(archive),link=document.createElement('a');
   link.href=address;link.download='WebStudio-Free-'+theme.value+'-website.zip';
   document.body.append(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(address),4000);
   status.textContent='Your self-contained site ZIP is ready. Extract it and publish manually. No files were uploaded.';
  }catch(error){status.textContent='Export not completed: '+error.message;}
 });
 $('ws-free-edit').addEventListener('click',()=>{
  const editor=$('editor');
  if(editor&&!editor.classList.contains('open'))$('edit-toggle')?.click();
  editor?.scrollIntoView({behavior:'smooth',block:'start'});
 });
 feedback.addEventListener('click',()=>{
  const notes=feedbackNotes.value.trim(),reply=email.value.trim();
  if(notes.length<20||notes.length>1800){status.textContent='Please write 20–1800 characters of useful product feedback.';feedbackNotes.focus();return;}
  if(!validReply(reply)){status.textContent='The optional reply address is not valid.';email.focus();return;}
  const subject='WebStudio Free · Product feedback';
  const body=['WebStudio Free tester feedback','',notes,'','Preferred reply address (optional): '+(reply||'Not supplied'),
   'Edition: Free (Orbit / Editorial)','', 'Sent by the tester using their own email application.'].join('\n');
  const uri='mailto:sudipdasin@gmail.com?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  if(uri.length>5000){status.textContent='Feedback is too long for a mail application. Please shorten it.';return;}
  const link=document.createElement('a');link.href=uri;document.body.append(link);link.click();link.remove();
  status.textContent='Your email application was requested. Review the message and press Send. This website cannot verify delivery.';
  clearReminder();
 });
 // Premium theme availability is explained by the plan cards; preserve
 // localized theme selector labels and all existing translation contracts.
 update();renderStart();
})();