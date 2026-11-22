/* Email composition only. A browser email client handles the final send.
   No simulated delivery, direct sends, data collection or demo-to-real-owner routing. */
(function(root){
 'use strict';
 const validRecipient=email=>{
   if(typeof email!=='string'||email.length>180||/[\r\n\0]/.test(email))return false;
   if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email))return false;
   const domain=email.split('@')[1].toLowerCase();
   return !['example.com','example.org','example.net','localhost','invalid','test'].includes(domain)&&!domain.endsWith('.example')&&!domain.endsWith('.invalid')&&!domain.endsWith('.test');
 };
 function createEmailDraft(recipient,data){
   if(!validRecipient(recipient))throw Error('Configure a real receiving email address in Studio & system before composing enquiries.');
   const values=Object.fromEntries(['name','email','service','timeline','brief'].map(k=>[k,typeof data?.[k]==='string'?data[k].trim():'']));
   if(values.name.length<2||values.name.length>100||!validRecipient(values.email)||values.brief.length<12||values.brief.length>3000||!values.service||!values.timeline)throw Error('Complete all required fields with valid details.');
   const subject='Portfolio enquiry — '+values.service.slice(0,80);
   const body=['Hello,','','I would like to enquire about a project.','','Name: '+values.name,'Reply email: '+values.email,'Service: '+values.service,'Timeline: '+values.timeline,'','Project brief:',values.brief,'','— Composed locally in Personal Profile Web Studio'].join('\n');
   const href='mailto:'+encodeURIComponent(recipient)+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
   if(href.length>6500)throw Error('This email is too long for a browser mail link. Shorten the project brief.');
   return href;
 }
 const api=Object.freeze({validRecipient,createEmailDraft});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(!root?.document)return;
 const form=root.document.getElementById('proposal-form'),status=root.document.getElementById('proposal-status');
 if(!form||!status)return;
 form.addEventListener('submit',event=>{
   event.preventDefault();
   if(!form.reportValidity())return;
   const values=Object.fromEntries(new FormData(form).entries());
   const recipient=root.StudioDemo?.getRecipient?.()||'';
   try{
     const href=createEmailDraft(recipient,values);
     // Browsers open their configured email application. Only the user can press Send.
     const link=root.document.createElement('a');
     link.href=href;link.setAttribute('aria-label','Open email application to send enquiry');
     link.style.display='none';root.document.body.append(link);
     status.textContent='Email draft prepared. Your email app should open; review it and press Send. Delivery is not confirmed here.';
     link.click();link.remove();
   }catch(error){
     status.textContent=error.message;
     if(!validRecipient(recipient)){
       const open=root.document.getElementById('editor'),toggle=root.document.getElementById('edit-toggle');
       if(open&&!open.classList.contains('open'))toggle?.click();
       root.document.querySelector('[name="contactEmail"]')?.focus();
     }
   }
 });
})(typeof window!=='undefined'?window:undefined);
