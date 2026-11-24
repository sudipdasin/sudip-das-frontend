/* Visitor-only WebStudio-inspired Theme Library for the REAL personal preview.
 * Only uses already approved theme IDs, CSS and public page sections.
 * No Studio/editor APIs, private requests, analytics, imports, exports,
 * user-auth controls or external JavaScript. Does not alter initial layout.
 */
(()=>{
'use strict';
if(window.PORTFOLIO_PREVIEW_MODE!==true)return;
const picker=document.getElementById('theme-select');
const quick=document.getElementById('ws-visitor-quick-panel');
const quickButton=document.getElementById('ws-visitor-quick-open');
if(!picker||!quick||!quickButton||document.getElementById('pv-theme-library'))return;
const IDS=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
const EXPECTED_SOURCE='c5383df1ebda7a0e5f05d9f59048a136dc99dac5';
const PALETTES={
 orbit:['#092431','#51d6cb'],editorial:['#efece4','#8d583d'],
 terminal:['#081b17','#42d98e'],'aurora-peak':['#081b20','#d8e5ae'],
 'neon-studio':['#071933','#25f1e6'],'design-2':['#121e47','#b970ff']
};
// PREVIEW-LOCAL bundled theme list. This avoids a network fetch that would
// lose the Cloudflare Access session when credentials were omitted.
// Keep in sync with theme-visual-contract.json through the source verifier.
const BUNDLED_CONTRACT=Object.freeze({
 schemaVersion:1,
 previewOnly:true,
 currentPreview:'https://preview-personalweb.sudip-das-frontend.pages.dev/',
 editorialFreeze:{immutableCommit:EXPECTED_SOURCE},
 themes:[
  {id:'orbit',personalLabel:'Orbit · Portfolio',personalPreviewAvailable:true,distinctive:'Ocean teal, circular portrait and read-only portfolio.'},
  {id:'editorial',personalLabel:'Editorial · Profile',personalPreviewAvailable:true,distinctive:'Warm paper surfaces, serif typography and refined framing. The preserved favorite.'},
  {id:'terminal',personalLabel:'Terminal · Explorer',personalPreviewAvailable:true,distinctive:'Monospaced Linux-inspired design with sharp corners and high contrast.'},
  {id:'aurora-peak',personalLabel:'Aurora Peak',personalPreviewAvailable:true,distinctive:'Alpine sunrise, lichen accents, arched portrait, mountain layers and field notes.'},
  {id:'neon-studio',personalLabel:'Neon Studio',personalPreviewAvailable:true,distinctive:'Turquoise aurora ribbon, five medallions and six compact feature tiles.'},
  {id:'design-2',personalLabel:'Cosmic',personalPreviewAvailable:true,distinctive:'Deep cosmic blues, four satellites and four glass information cards.'}
 ]
});
const safeLabel=t=>typeof t==='string'&&t.length<=100&&!/[<>]/.test(t);
const el=(tag,cls,text)=>{
 const x=document.createElement(tag);
 if(cls)x.className=cls;
 if(text!==undefined)x.textContent=text;
 return x;
};
const status={loaded:false,items:[],error:null,original:null};
function safeManifest(data){
 if(!data||data.schemaVersion!==1||data.previewOnly!==true||
   data.editorialFreeze?.immutableCommit!==EXPECTED_SOURCE||
   !Array.isArray(data.themes)||data.themes.length!==6||
   data.currentPreview!=='https://preview-personalweb.sudip-das-frontend.pages.dev/')
  throw Error('Unexpected canonical personal theme manifest');
 return data.themes.map((t,i)=>{
  if(t.id!==IDS[i]||t.personalPreviewAvailable!==true||
     !safeLabel(t.personalLabel)||!safeLabel(t.distinctive))
   throw Error('Unknown or invalid theme definition');
  return Object.freeze({
   id:t.id,name:t.personalLabel,description:t.distinctive,
   colors:PALETTES[t.id],ownerFavorite:t.id==='editorial'
  });
 });
}
function currentTheme(){
 return IDS.includes(document.body.dataset.theme)?document.body.dataset.theme:picker.value;
}
function chooseTheme(id){
 if(!status.items.some(item=>item.id===id))return false;
 const option=[...picker.options].find(o=>o.value===id&&!o.disabled);
 if(!option)return false;
 picker.value=id;
 picker.dispatchEvent(new Event('change',{bubbles:true}));
 return true;
}
const root=el('div','pv-theme-overlay');
root.id='pv-theme-library';root.hidden=true;
root.setAttribute('role','dialog');
root.setAttribute('aria-modal','true');
root.setAttribute('aria-labelledby','pv-theme-heading');
root.setAttribute('aria-describedby','pv-theme-description');
const panel=el('section','pv-theme-panel');
const head=el('div','pv-theme-head');
const intro=el('div');
const title=el('h2','', 'Explore six portfolio themes');
title.id='pv-theme-heading';
const desc=el('p','','Switch the presentation of this portfolio. Personal information and website settings stay unchanged.');
desc.id='pv-theme-description';
intro.append(title,desc);
const close=el('button','pv-theme-close','Close');
close.type='button';
head.append(intro,close);
const tools=el('div','pv-theme-tools');
const search=el('input','pv-theme-search');
search.type='search';search.placeholder='Find a visual style';
search.maxLength=80;search.setAttribute('aria-label','Search portfolio themes');
const filter=el('select','pv-theme-filter');
filter.setAttribute('aria-label','Filter portfolio themes');
for(const [value,label] of [['all','All themes'],['light','Light'],['dark','Dark']]){
 const option=el('option','',label);option.value=value;filter.append(option);
}
tools.append(search,filter);
const statusLine=el('p','pv-theme-status');
statusLine.setAttribute('role','status');statusLine.setAttribute('aria-live','polite');
const grid=el('div','pv-theme-grid');
const footer=el('div','pv-theme-footer');
const notice=el('p','','Visitor-safe: theme selection is local to your browser. Owner-only site changes are not available here.');
const restore=el('button','pv-theme-restore','Restore previous theme');
restore.type='button';footer.append(notice,restore);
panel.append(head,tools,statusLine,grid,footer);root.append(panel);
document.body.append(root);
// Keep the six-theme gallery visibly anchored at the TOP-RIGHT of the
// sticky navigation. The separate Quick Actions launcher floats by itself.
const openButton=el('button','pv-theme-launch');
openButton.append(
 el('span','pv-theme-launch-glyph','◈'),
 el('span','pv-theme-launch-label','Explore themes'),
 el('span','pv-theme-launch-counter','6')
);
openButton.setAttribute('aria-label','Explore six portfolio themes');
openButton.type='button';openButton.id='pv-theme-launch';
openButton.setAttribute('aria-haspopup','dialog');
openButton.setAttribute('aria-controls',root.id);
openButton.setAttribute('aria-expanded','false');
// Append after the language/theme selectors: last item at the right edge.
// At narrow widths the dedicated responsive rule keeps it in the header's
// first row, independent of the floating Quick Actions container.
const navigation=document.querySelector('.topbar .nav');
if(navigation)navigation.append(openButton);
else document.querySelector('.topbar')?.append(openButton);
let lastFocus=null;
function render(){
 const query=search.value.trim().toLowerCase(),which=filter.value;
 const items=status.items.filter(t=>
  (which==='all'||(which==='light')===(t.id==='editorial')) &&
  (!query||[t.name,t.description,t.id].some(v=>v.toLowerCase().includes(query))));
 grid.replaceChildren();
 const active=currentTheme();
 for(const t of items){
  const card=el('article','pv-theme-card');
  card.dataset.themeId=t.id;
  card.dataset.selected=String(t.id===active);
  const swatch=el('div','pv-theme-swatch');
  swatch.style.setProperty('--pv-chip-base',t.colors[0]);
  swatch.style.setProperty('--pv-chip-highlight',t.colors[1]);
  swatch.setAttribute('aria-hidden','true');
  const heading=el('h3','',t.name);
  const meta=el('span','pv-theme-meta',t.ownerFavorite?'Favorite · Protected design':t.id==='editorial'?'Editorial':'Available to visitors');
  const copy=el('p','',t.description);
  const action=el('button','pv-theme-choose',t.id===active?'Selected':'Try this theme');
  action.type='button';
  action.disabled=t.id===active;
  action.addEventListener('click',()=>{
   if(chooseTheme(t.id)){
    statusLine.textContent='Showing '+t.name+'. No site settings were modified.';
    render();
   }
  });
  card.append(swatch,heading,meta,copy,action);grid.append(card);
 }
 if(!items.length)grid.append(el('p','pv-theme-empty','No matching themes. Try another search.'));
 if(!statusLine.textContent)statusLine.textContent=String(items.length)+' available theme'+(items.length===1?'':'s');
}
function dismiss(){
 if(root.hidden)return;
 root.hidden=true;
 openButton.setAttribute('aria-expanded','false');
 (lastFocus?.isConnected?lastFocus:openButton).focus();
}
function show(){
 if(!status.loaded)return;
 status.original=currentTheme();
 lastFocus=document.activeElement||openButton;
 // Close the quick-actions menu behind the modal and return focus to the
 // original always-visible header control on dismiss.
 if(!quick.hidden)quickButton.click();
 search.value='';filter.value='all';statusLine.textContent='';
 root.hidden=false;openButton.setAttribute('aria-expanded','true');
 render();search.focus();
}
openButton.addEventListener('click',show);
close.addEventListener('click',dismiss);
restore.addEventListener('click',()=>{
 if(status.original&&chooseTheme(status.original)){
  statusLine.textContent='Restored the earlier theme.';render();
 }
});
search.addEventListener('input',()=>{statusLine.textContent='';render()});
filter.addEventListener('change',()=>{statusLine.textContent='';render()});
picker.addEventListener('change',()=>{if(!root.hidden)render()});
root.addEventListener('click',event=>{if(event.target===root)dismiss()});
root.addEventListener('keydown',event=>{
 if(event.key==='Escape'){event.preventDefault();dismiss();return;}
 if(event.key!=='Tab')return;
 const focusable=[...root.querySelectorAll('button:not([disabled]),input:not([disabled]),select:not([disabled])')];
 if(!focusable.length)return;
 const first=focusable[0],last=focusable.at(-1);
 if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
 else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
});
function initialize(){
 try{
  status.items=safeManifest(BUNDLED_CONTRACT);
  status.loaded=true;
  openButton.disabled=false;
 }catch(e){
  status.error=String(e);
  openButton.disabled=true;
  openButton.title='Theme Gallery unavailable';
 }
}
openButton.disabled=true;
initialize();
})();
