/* WebStudio Free 3-theme interactive release flow.
   Preview -> approve exact profile/theme -> submit feedback -> export.
   Server receipts are real only if a configured feedback endpoint acknowledges.
   Without a deployed receiver, export stays locked rather than faking proof. */
(()=>{
 'use strict';
 const api=window.WebStudioStarter,$=id=>document.getElementById(id);
 if(!api||!$('ws-free-starter'))return;
 const embedded=new URLSearchParams(location.search).get('ws-free-preview')==='1';
 if(embedded){
  document.body.classList.add('ws-embedded-preview');
  return; // Preview is the same app, but never starts another nested export.
 }
 const steps=[
  ['Choose an interactive theme','Orbit, Editorial and Terminal include the working Free website runtime. Aurora Peak, Neon Studio and Cosmic are Pro previews.','01','Design'],
  ['Personalize real website content','Edit and save your name, role, SEO, skills, projects, contact fields and links in the live local editor.','02','Create'],
  ['Inspect the real live preview','See the exact selected theme with your saved data in an interactive browser frame, then explicitly approve it.','03','Review'],
  ['Protect your private records','HTML, CSS, JavaScript and JSON used in a browser are readable. Never include secrets in files you publish.','04','Protect'],
  ['Feedback unlocks the export','After approval, submit detailed feedback. A real server acknowledgment is required before ZIP generation.','05','Feedback']
 ];
 const intro=$('ws-free-onboard'),begin=$('ws-free-begin'),next=$('ws-free-next'),back=$('ws-free-back');
 const theme=$('ws-free-theme'),reply=$('ws-free-reply'),terms=$('ws-free-terms');
 const notes=$('ws-free-feedback-text'),feedbackButton=$('ws-free-feedback');
 const exportButton=$('ws-free-export'),status=$('ws-free-status');
 const previewButton=$('ws-free-preview'),panel=$('ws-free-preview-panel'),
  frame=$('ws-free-preview-frame'),approveButton=$('ws-free-approve');
 const approveCheckbox=$('ws-free-accept-preview');
 const key='webstudio:free-intro-v1',firstKey='webstudio:free-feedback-start-v1',
  reminderKey='webstudio:free-feedback-reminded-v1';
 let step=0,completed=false,approved=null,receipt=null,feedbackEndpoint='',challengeSiteKey='',challengeToken='';
 const storage={
  read(k){try{return localStorage.getItem(k)}catch{return null}},
  write(k,v){try{localStorage.setItem(k,v)}catch{}}
 };
 const current=()=>window.StudioDemo?.getProfile?.();
 const signature=()=>JSON.stringify({theme:theme.value,profile:current()});
 function notice(message){status.textContent=message;}
 function revokeApproval(message){
  approved=null;receipt=null;exportButton.disabled=true;
  approveCheckbox.checked=false;
  if(message)notice(message);
 }
 function validReply(email){return !email||email.length<=180&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);}
 function redrawTour(){
  const [heading,body,index,kind]=steps[step];
  $('ws-free-step').textContent='STEP '+index+' / 5 · '+kind.toUpperCase();
  $('ws-free-tour-title').textContent=heading;
  $('ws-free-tour-copy').textContent=body;
  $('ws-free-tour-icon').textContent=['✦','◈','⬡','◇','✉'][step];
  $('ws-free-meter').style.width=Math.round((step+1)*20)+'%';
  back.disabled=step===0;next.textContent=step===4?'Complete walkthrough':'Next chapter';
 }
 function markComplete(){
  completed=true;storage.write(key,'completed');
  if(!storage.read(firstKey))storage.write(firstKey,String(Date.now()));
  intro.hidden=true;begin.textContent='Replay full walkthrough';
  notice('Walkthrough complete. Save your personal details, preview the chosen Free theme, and approve it.');
 }
 begin.addEventListener('click',()=>{
  step=0;completed=false;intro.hidden=false;redrawTour();
  intro.scrollIntoView({behavior:'smooth',block:'center'});next.focus();
 });
 back.addEventListener('click',()=>{if(step>0){step--;redrawTour()}});
 next.addEventListener('click',()=>{if(step===4)markComplete();else{step++;redrawTour();}});
 $('ws-free-edit').addEventListener('click',()=>{
  const editor=$('editor');
  if(editor&&!editor.classList.contains('open'))$('edit-toggle')?.click();
  editor?.scrollIntoView({behavior:'smooth',block:'start'});
 });
 // Save/edit/reset/import in app.js all invalidate the approved preview.
 document.addEventListener('studio:profile-saved',()=>{
  revokeApproval('Saved profile changed. The live interactive preview is refreshing; approve it again before exporting.');
  if(!panel.hidden)refreshPreview();
 });
 theme.addEventListener('change',()=>{
  revokeApproval('Theme changed. Inspect and approve the new preview.');
  if(!panel.hidden)refreshPreview();
 });
 function refreshPreview(){
  if(panel.hidden)return;
  const url=new URL(location.href);
  url.searchParams.set('ws-free-preview','1');
  url.hash='';
  frame.src=url.href;
  frame.onload=()=>{
   try{
    const select=frame.contentDocument?.getElementById('studio-theme');
    if(select){select.value=theme.value;select.dispatchEvent(new Event('change',{bubbles:true}));}
   }catch{notice('Interactive iframe preview could not be initialized. Confirm browser permits same-origin frames.');}
  };
 }
 previewButton.addEventListener('click',()=>{
  if(!completed){notice('Complete all five chapters first.');begin.focus();return;}
  if(!terms.checked){notice('Accept the export terms before inspecting the final build.');terms.focus();return;}
  try{
   api.validate(current(),theme.value);
   panel.hidden=false;revokeApproval();
   refreshPreview();
   notice('Review the full live interactive website below, then approve this exact theme and saved profile.');
   panel.scrollIntoView({behavior:'smooth',block:'start'});
  }catch(error){notice('Cannot preview: '+error.message);}
 });
 approveButton.addEventListener('click',()=>{
  if(panel.hidden||!frame.contentDocument||frame.contentDocument.readyState!=='complete'){
   notice('The interactive preview is not loaded yet.');return;
  }
  if(!approveCheckbox.checked){notice('Check the preview approval box first.');approveCheckbox.focus();return;}
  try{
   api.validate(current(),theme.value);
   approved=signature();receipt=null;exportButton.disabled=true;
   notice('Preview approved. Submit detailed feedback to unlock ZIP generation.');
  }catch(error){notice('Approval rejected: '+error.message);}
 });
 const feedbackReady=()=>{
  if(!approved||signature()!==approved){
   revokeApproval('Your saved profile or theme changed; preview and approve it again.');
   return false;
  }
  if(notes.value.trim().length<60||notes.value.trim().length>1800){
   notice('Detailed feedback must contain 60–1800 characters.');notes.focus();return false;
  }
  if(!validReply(reply.value.trim())){notice('Enter a valid optional reply email or leave it blank.');reply.focus();return false;}
  return true;
 };
 const allowExport=(acknowledgment)=>{
  if(!feedbackReady())return;
  receipt={approved,acknowledgment,feedback:notes.value.trim(),theme:theme.value};
  exportButton.disabled=false;
  $('ws-free-reminder').hidden=true;storage.write(reminderKey,'1');
  notice(acknowledgment==='server-confirmed'?
   'Feedback received by the configured service. You may generate the approved interactive ZIP.':
   'Feedback delivery was acknowledged by the configured server.');
 };
 feedbackButton.addEventListener('click',async()=>{
  if(!feedbackReady())return;
  feedbackButton.disabled=true;
  const body={schemaVersion:1,theme:theme.value,turnstileToken:challengeToken,feedback:notes.value.trim(),
   replyEmail:reply.value.trim(),source:'webstudio-free-interactive-preview'};
  try{
   if(feedbackEndpoint){
    if(!challengeToken)throw Error('Complete the CAPTCHA challenge before submitting feedback.');
    const url=new URL(feedbackEndpoint,location.href);
    if(url.protocol!=='https:')throw Error('Feedback service must use HTTPS.');
    const response=await fetch(url.href,{method:'POST',mode:'cors',credentials:'omit',
     headers:{'Content-Type':'application/json'},body:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
    if(!response.ok)throw Error('Feedback service failed (HTTP '+response.status+'). No receipt was issued.');
    const ack=await response.json();
    if(ack?.accepted!==true||typeof ack.receiptId!=='string'||ack.receiptId.length<8)
     throw Error('Feedback service did not acknowledge delivery.');
    allowExport('server-confirmed');
   }else{
    throw Error('Verified feedback delivery is not configured yet; website generation remains locked.');

   }
  }catch(e){notice('Feedback not acknowledged: '+e.message+' ZIP remains locked.');}
  finally{feedbackButton.disabled=false;}
 });
 exportButton.addEventListener('click',async()=>{
  if(!receipt||!approved||receipt.approved!==signature()){
   revokeApproval('Export locked: approve the current profile and submit feedback first.');
   return;
  }
  exportButton.disabled=true;
  try{
   notice('Collecting the exact interactive WebStudio runtime for your ZIP…');
   const files=await api.buildInteractive(current(),theme.value);
   if(receipt.approved!==signature())throw Error('Your profile changed during packaging. Please approve again.');
   const blob=api.zip(files),href=URL.createObjectURL(blob),link=document.createElement('a');
   link.href=href;link.download='WebStudio-Free-'+theme.value+'-interactive-website.zip';
   document.body.append(link);link.click();link.remove();
   setTimeout(()=>URL.revokeObjectURL(href),5000);
   notice('Full interactive ZIP generated. The same WebStudio modules are included; host the site/ folder manually.');
  }catch(error){notice('ZIP generation failed: '+error.message);}
  finally{exportButton.disabled=false;}
 });
 $('ws-free-reminder-dismiss').addEventListener('click',()=>{
  $('ws-free-reminder').hidden=true;storage.write(reminderKey,'1');
 });
 fetch('./webstudio-editions.json',{cache:'no-store'}).then(r=>r.json()).then(edition=>{
  const configured=edition.feedback||{};
  feedbackEndpoint=typeof configured.endpoint==='string'?configured.endpoint:'';
  challengeSiteKey=typeof configured.challengeSiteKey==='string'?configured.challengeSiteKey:'';
  if(feedbackEndpoint&& !challengeSiteKey){
   feedbackEndpoint=''; // Don't claim server verification without a configured challenge.
  }
  if(!feedbackEndpoint)notice('Feedback submission service is not configured. Preview and approval work, but ZIP export remains locked until verified feedback delivery is available.');
  if(feedbackEndpoint&&challengeSiteKey){
   $('ws-free-turnstile').hidden=false;
   const script=document.createElement('script');
   script.src='https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
   script.async=true;script.defer=true;
   script.addEventListener('load',()=>{
    if(!window.turnstile?.render){notice('Feedback anti-spam widget could not be loaded.');return;}
    window.turnstile.render('#ws-free-turnstile',{sitekey:challengeSiteKey,
      callback:token=>{challengeToken=token},
      'expired-callback':()=>{challengeToken=''},
      'error-callback':()=>{challengeToken=''}
    });
   });
   script.addEventListener('error',()=>notice('The feedback challenge could not load. Please retry.'));
   document.head.append(script);
  }
 }).catch(()=>{});
 completed=storage.read(key)==='completed';
 if(completed){intro.hidden=true;begin.textContent='Replay full walkthrough';}
 const started=Number(storage.read(firstKey)||0);
 if(started&&Date.now()-started>=48*3600000&&!storage.read(reminderKey))
  $('ws-free-reminder').hidden=false;
 redrawTour();
})();
