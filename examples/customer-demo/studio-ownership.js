/* Customer-controlled manual backup and restore; entirely browser-local. */
(() => {
 'use strict';
 const exportButton=document.getElementById('backup-download');
 const importButton=document.getElementById('backup-import');
 const editor=document.getElementById('editor');
 exportButton.addEventListener('click',()=>document.getElementById('export-profile').click());
 importButton.addEventListener('click',()=>{
   if(!editor.classList.contains('open'))document.getElementById('edit-toggle').click();
   editor.scrollIntoView({block:'start',behavior:'smooth'});
   const input=document.getElementById('import-profile');
   input.focus();
   input.click();
 });
})();
