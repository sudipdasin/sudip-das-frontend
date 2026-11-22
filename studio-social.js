/* Social Studio — offline-first fictional demo.
 * No OAuth, tracking, remote API calls, background jobs or publishing.
 * Local A/B assignments and events are intentionally browser-only.
 */
(()=>{
 'use strict';
 const byId=id=>document.getElementById(id);
 const root=byId('social-studio');
 if(!root)return;
 const KEY='web-studio:social-studio:v1';
 const MAX_BYTES=100000;
 const PLATFORMS=['GitHub','LinkedIn','YouTube','Instagram','Facebook','Bluesky','Mastodon','X','TikTok','Other'];
 const text=(id,value)=>{const el=byId(id);if(el)el.textContent=String(value);};
 const initial=()=>({version:1,assignment:null,preview:null,links:[],drafts:[],events:{preview_opened:0,link_saved:0,draft_saved:0,exported:0}});
 const plain=v=>typeof v==='string'?v.trim():'';
 const validURL=value=>{
   try{const u=new URL(value);return u.protocol==='https:'&&!!u.hostname&&!u.username&&!u.password&&value.length<=600;}
   catch{return false;}
 };
 const safeDraft=d=>d&&PLATFORMS.includes(d.platform)&&plain(d.title).length>0&&plain(d.title).length<=90&&plain(d.caption).length<=2000;
 const validate=raw=>{
   if(!raw||raw.version!==1||!Array.isArray(raw.links)||!Array.isArray(raw.drafts)||raw.links.length>20||raw.drafts.length>50)throw Error('Invalid Social Studio file');
   if(raw.links.some(l=>!PLATFORMS.includes(l.platform)||!validURL(l.url)))throw Error('Invalid social link');
   if(raw.drafts.some(d=>!safeDraft(d)))throw Error('Invalid draft');
   const state=initial();
   state.links=raw.links.map(l=>({platform:l.platform,url:l.url}));
   state.drafts=raw.drafts.map(d=>({platform:d.platform,title:plain(d.title),caption:plain(d.caption),created:typeof d.created==='string'?d.created.slice(0,30):'',id:typeof d.id==='string'?d.id.slice(0,45):''}));
   state.assignment=['A','B'].includes(raw.assignment)?raw.assignment:null;
   state.preview=['A','B'].includes(raw.preview)?raw.preview:null;
   return state;
 };
 const read=()=>{
   try{const stored=localStorage.getItem(KEY);return stored?validate(JSON.parse(stored)):initial();}
   catch{return initial();}
 };
 let state=read();
 function save(){
   try{localStorage.setItem(KEY,JSON.stringify(state));return true;}
   catch{setStatus('Browser storage unavailable. Export your drafts to retain them.');return false;}
 }
 function setStatus(message){text('social-status',message);}
 function event(name){state.events[name]=Math.min(99999,(Number(state.events[name])||0)+1);save();}
 const el=(tag,content,className)=>{
   const node=document.createElement(tag);
   if(content!==undefined)node.textContent=content;
   if(className)node.className=className;
   return node;
 };
 const random=()=>{try{const n=new Uint32Array(1);crypto.getRandomValues(n);return n[0]%2?'B':'A';}catch{return 'B';}};
 if(!state.assignment){state.assignment=random();save();}
 const active=()=>state.preview||state.assignment;
 function renderVariant(){
   const variant=active();
   text('social-variant-name',variant==='A'?'A · Connect first':'B · Preview first');
   byId('social-variant').value=variant;
   byId('social-variant-explanation').textContent=variant==='A'
    ?'Connect-first concept: account connection would appear before content exploration. OAuth is not available in this public demo.'
    :'Preview-first concept: explore sample cards and the composer before account connection. No personal data is sent.';
   byId('social-variant-preview').replaceChildren();
   const wrap=byId('social-variant-preview');
   if(variant==='A'){
     wrap.append(el('p','Link your accounts to start. Connections are planned, not active.'));
     const button=el('button','Connect an account · Planned','ghost');button.type='button';button.disabled=true;wrap.append(button);
   }else{
     wrap.append(el('p','Preview a creator workspace with local drafts, profile links and future publishing tools.'));
     const link=el('a','Create your first draft →','social-inline-link');link.href='#social-draft-title';wrap.append(link);
   }
 }
 function renderLinks(){
   const list=byId('social-links-list');list.replaceChildren();
   if(!state.links.length){list.append(el('p','No social links saved yet. Add a public HTTPS profile URL.','social-empty'));return;}
   state.links.forEach((item,i)=>{
     const row=el('div',undefined,'social-row'),name=el('strong',item.platform),a=el('a',item.url,'social-link');
     a.href=item.url;a.target='_blank';a.rel='noopener noreferrer nofollow';
     const remove=el('button','Remove','ghost');remove.type='button';remove.dataset.removeLink=String(i);
     row.append(name,a,remove);list.append(row);
   });
 }
 function renderDrafts(){
   const list=byId('social-drafts-list');list.replaceChildren();
   if(!state.drafts.length){list.append(el('p','No drafts yet. Drafts are stored only in this browser.','social-empty'));return;}
   state.drafts.slice().reverse().forEach((draft,j)=>{
     const index=state.drafts.length-1-j,row=el('article',undefined,'social-draft-card');
     row.append(el('strong',draft.title),el('small',draft.platform+' · Local draft · Never published'),el('p',draft.caption));
     const remove=el('button','Delete draft','ghost');remove.type='button';remove.dataset.removeDraft=String(index);row.append(remove);list.append(row);
   });
 }
 function render(){
   renderVariant();renderLinks();renderDrafts();
   text('social-summary',state.links.length+' profile links · '+state.drafts.length+' local drafts');
   text('social-local-events',Object.values(state.events).reduce((a,b)=>a+(Number(b)||0),0)+' local demo interactions (not real-world A/B results)');
 }
 byId('social-variant').addEventListener('change',e=>{
   state.preview=e.target.value==='A'?'A':'B';event('preview_opened');render();setStatus('Showing variant '+active()+'. This is a local preview; no live experiment is running.');
 });
 byId('social-reset-variant').addEventListener('click',()=>{
   state.preview=null;save();render();setStatus('Returned to your assigned local demo variant.');
 });
 byId('social-link-form').addEventListener('submit',e=>{
   e.preventDefault();
   const form=e.currentTarget,platform=form.elements.platform.value,url=plain(form.elements.url.value);
   if(!PLATFORMS.includes(platform)||!validURL(url)){setStatus('Enter a valid HTTPS profile URL (no credentials).');return;}
   if(state.links.length>=20){setStatus('Maximum 20 saved profile links.');return;}
   if(state.links.some(l=>l.platform===platform&&l.url===url)){setStatus('This link is already saved.');return;}
   state.links.push({platform,url});event('link_saved');form.reset();render();setStatus('Public profile link saved locally. No account was connected.');
 });
 byId('social-links-list').addEventListener('click',e=>{
   const control=e.target.closest('[data-remove-link]');if(!control)return;
   const i=Number(control.dataset.removeLink);
   if(!Number.isInteger(i)||i<0||i>=state.links.length)return;
   state.links.splice(i,1);save();render();setStatus('Link removed from this local demo.');
 });
 byId('social-draft-form').addEventListener('submit',e=>{
   e.preventDefault();
   const form=e.currentTarget,platform=form.elements.platform.value,title=plain(form.elements.title.value),caption=plain(form.elements.caption.value);
   const draft={platform,title,caption,created:new Date().toISOString(),id:String(Date.now())};
   if(!safeDraft(draft)){setStatus('Choose a platform and enter a title (up to 90 characters) and caption (up to 2000).');return;}
   if(state.drafts.length>=50){setStatus('Maximum 50 drafts. Export or delete existing drafts first.');return;}
   state.drafts.push(draft);event('draft_saved');form.reset();render();setStatus('Draft saved locally. Nothing has been posted.');
 });
 byId('social-drafts-list').addEventListener('click',e=>{
   const control=e.target.closest('[data-remove-draft]');if(!control)return;
   const i=Number(control.dataset.removeDraft);
   if(!Number.isInteger(i)||i<0||i>=state.drafts.length)return;
   state.drafts.splice(i,1);save();render();setStatus('Draft deleted.');
 });
 byId('social-export').addEventListener('click',()=>{
   const payload={version:1,links:state.links,drafts:state.drafts,assignment:state.assignment,preview:state.preview};
   const blob=new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
   const url=URL.createObjectURL(blob),a=el('a');
   a.href=url;a.download='web-studio-social-drafts.json';document.body.append(a);a.click();a.remove();URL.revokeObjectURL(url);
   event('exported');render();setStatus('Your local social drafts and links were exported as JSON.');
 });
 byId('social-import').addEventListener('change',async e=>{
   const file=e.target.files?.[0];e.target.value='';
   if(!file)return;
   if(file.size>MAX_BYTES){setStatus('Import rejected: file exceeds 100 KB.');return;}
   try{
     const imported=validate(JSON.parse(await file.text()));
     // Explicit import replaces local drafts, but does not change experiment assignment.
     state.links=imported.links;state.drafts=imported.drafts;save();render();
     setStatus('Social drafts and links imported locally. No account connections were created.');
   }catch{setStatus('Import rejected: invalid or unsupported Social Studio JSON.');}
 });
 byId('social-clear').addEventListener('click',()=>{
   if(!confirm('Clear locally saved Social Studio drafts and links? This does not affect your profile editor.'))return;
   state.links=[];state.drafts=[];save();render();setStatus('Social Studio drafts and links cleared.');
 });
 render();
})();