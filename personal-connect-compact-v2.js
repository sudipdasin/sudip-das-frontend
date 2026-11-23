/* Compact Let's Connect v2 — progressive enhancement for native <details>.
 * All existing links, copy controls, and private request behaviors are owned
 * by previous scripts and remain unchanged. This script only animates opening
 * on fine-pointer hover (with delay) and pins sections on explicit clicks.
 */
(()=>{
'use strict';
const root=document.querySelector('body.ws-parity .pv-connect-card');
if(!root||root.dataset.compactInitialized)return;
root.dataset.compactInitialized='true';
const groups=[...root.querySelectorAll('.pv-connect-accordion')];
if(groups.length!==4)return;
const finePointer=window.matchMedia('(hover:hover) and (pointer:fine)');
const reduceMotion=window.matchMedia('(prefers-reduced-motion:reduce)');
const canPreview=()=>finePointer.matches&&!reduceMotion.matches;
let opening=null;
function shutHover(except){
 for(const d of groups){
  if(d===except)continue;
  if(d.dataset.hoverOwned==='true'&&d.dataset.pinned!=='true'){
   d.open=false;d.dataset.hoverOwned='false';
  }
 }
}
for(const detail of groups){
 const summary=detail.querySelector('summary');
 if(!summary)continue;
 let openDelay=null,closeDelay=null;
 detail.dataset.hoverOwned='false';
 detail.dataset.pinned='false';
 const stopDelays=()=>{
  if(openDelay!==null){clearTimeout(openDelay);openDelay=null;}
  if(closeDelay!==null){clearTimeout(closeDelay);closeDelay=null;}
 };
 detail.addEventListener('pointerenter',e=>{
  if(e.pointerType!=='mouse'||!canPreview())return;
  if(closeDelay!==null){clearTimeout(closeDelay);closeDelay=null;}
  if(detail.open)return;
  if(openDelay!==null)clearTimeout(openDelay);
  openDelay=setTimeout(()=>{
   openDelay=null;
   if(detail.open||!detail.matches(':hover')||!canPreview())return;
   shutHover(detail);
   detail.dataset.hoverOwned='true';
   detail.open=true;
  },160);
 });
 detail.addEventListener('pointerleave',()=>{
  if(openDelay!==null){clearTimeout(openDelay);openDelay=null;}
  if(detail.dataset.hoverOwned!=='true'||detail.dataset.pinned==='true')return;
  if(closeDelay!==null)clearTimeout(closeDelay);
  closeDelay=setTimeout(()=>{
   closeDelay=null;
   if(detail.dataset.hoverOwned==='true'&&detail.dataset.pinned!=='true'){
    detail.dataset.hoverOwned='false';
    detail.open=false;
   }
  },260);
 });
 summary.addEventListener('click',event=>{
  stopDelays();
  if(detail.dataset.hoverOwned==='true'&&detail.dataset.pinned!=='true'){
   // An already-hovered native details element would normally CLOSE on
   // click. Instead, the first click makes the open state persistent.
   event.preventDefault();
   detail.dataset.hoverOwned='false';
   detail.dataset.pinned='true';
   detail.open=true;
   for(const other of groups){
    if(other!==detail&&other.dataset.pinned==='true'){
     other.open=false;other.dataset.pinned='false';
    }
   }
   return;
  }
  if(detail.open){
   detail.dataset.pinned='false';
   detail.dataset.hoverOwned='false';
  }else{
   detail.dataset.pinned='true';
   shutHover(detail);
   for(const other of groups){
    if(other!==detail&&other.dataset.pinned==='true'){
     other.open=false;other.dataset.pinned='false';
    }
   }
  }
 });
 detail.addEventListener('toggle',()=>{
  if(!detail.open){
   detail.dataset.hoverOwned='false';
   detail.dataset.pinned='false';
  }
 });
}
finePointer.addEventListener?.('change',()=>{
 if(!canPreview())shutHover(null);
});
reduceMotion.addEventListener?.('change',()=>{
 if(!canPreview())shutHover(null);
});
})();
