/* Cosmic: independent reference composition. Keep Aurora isolated. */
(()=>{
'use strict';
const theme=document.getElementById('studio-theme');
const hero=document.querySelector('main>.hero');
const banner=document.querySelector('.banner');
if(!theme||!hero||!banner)return;
const NS='http://www.w3.org/2000/svg';
const paths={
 shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/>',
 layers:'<path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5"/>',
 bolt:'<path d="m13 2-9 11h7l-1 9 10-12h-7l0-8Z"/>',
 refresh:'<path d="M20 7v5h-5M4 17v-5h5M5.8 9a7 7 0 0 1 11.8-2L20 12M4 12l2.4 5a7 7 0 0 0 11.8-2"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
 };
function icon(key){
 const svg=document.createElementNS(NS,'svg');
 svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('stroke','currentColor');
 svg.setAttribute('stroke-width','1.8');svg.setAttribute('fill','none');
 svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');
 svg.setAttribute('aria-hidden','true');svg.innerHTML=paths[key];
 return svg;
}
// Both reference themes reuse the same accessible utility banner.
 // The d2-utility and d2-trust classes on that banner preserve theme isolation.
const stats=document.createElement('div');stats.className='d2-stats';stats.setAttribute('aria-label','Illustrative demo metrics — not actual users or downloads');
const examples=[['⌘','50+','Projects'],['♧','8K+','Users'],['☆','4.9','Community Rating'],['↓','100K+','Downloads']];
for(const [symbol,value,label] of examples){
 const stat=document.createElement('div');stat.className='d2-stat';
 const strong=document.createElement('strong'),mark=document.createElement('span');mark.className='stat-icon';mark.textContent=symbol;
 strong.append(mark,document.createTextNode(value));
 const small=document.createElement('small');small.textContent=label;
 stat.append(strong,small);stats.append(stat);
}
hero.append(stats);
const row=document.createElement('section');row.className='d2-feature-row';row.setAttribute('aria-label','Cosmic visual feature cards');
const features=[
 ['shield','Everlasting Presence','Stay online through provider changes, expiry, or attacks.','Planned'],
 ['layers','Your Data, Your Control','Backup, restore and move anytime, anywhere.','Local JSON works; automatic backup planned'],
 ['bolt','One-Click Setup','GitHub + Cloudflare + is-a.dev with an easy wizard.','Planned'],
 ['refresh','Auto Recovery','Self-healing, multi-backup and quick restore.','Planned']
];
for(const [kind,title,description,status] of features){
 const article=document.createElement('article');article.className='d2-feature';
 const shape=document.createElement('span');shape.className='d2-feature-icon';shape.append(icon(kind));
 const text=document.createElement('div'),h=document.createElement('h3'),p=document.createElement('p'),small=document.createElement('small');
 h.textContent=title;p.textContent=description;small.textContent=status;
 text.append(h,p,small);article.append(shape,text);row.append(article);
}
const existing=document.querySelector('.neon-feature-grid');
if(existing)existing.insertAdjacentElement('afterend',row);
else hero.insertAdjacentElement('afterend',row);
const menuTrigger=document.getElementById('system-menu-trigger');
const systemLabel=menuTrigger?.querySelector('span:first-child');
const role=document.getElementById('role'),tagline=document.getElementById('tagline');
const originalRole='Creative Developer & Interface Engineer';
const designTwoRole='Developer · Designer · Creator';
const originalTagline='Designing expressive, high-performance and user-friendly experiences that just work — from idea to real world.';
const designTwoTagline='Building useful, creative and open-source software for Linux, the web and everyday life.';
function updateThemeIdentity(){
 const first=document.body.dataset.theme==='design-2';
 banner.querySelector('.studio-utility-brand')?.classList.toggle('d2-utility',first);
 banner.querySelector('.studio-utility-trust')?.classList.toggle('d2-trust',first);
 const referencePortrait=document.querySelector('.hero-art .neon-reference-photo');
 if(referencePortrait && !document.body.classList.contains('avatar-studio-active')){
   const next=first?'design-two-reference-portrait.svg':'neon-reference-portrait.svg';
   if(referencePortrait.getAttribute('src')!==next)referencePortrait.setAttribute('src',next);
 }
 if(systemLabel)systemLabel.textContent=first?'Services':'System';
 // Translate only the stock fictional reference identity. User-edited profile
 // fields are deliberately not machine-translated or silently overwritten.
 const l10n=window.StudioI18n;
 const locales=['en','hi','bn','es','fr','de','pt','ar','zh-CN','ja'];
 const variants=[originalRole,designTwoRole,originalTagline,designTwoTagline];
 const knownDemoText=value=>variants.some(source=>source===value||locales.some(lang=>l10n?.translate(source,lang)===value));
 const translated=source=>l10n?.translate(source)||source;
 if(role && knownDemoText(role.textContent.trim()))
   role.textContent=translated(first?designTwoRole:originalRole);
 if(tagline && knownDemoText(tagline.textContent.trim()))
   tagline.textContent=translated(first?designTwoTagline:originalTagline);
}
new MutationObserver(updateThemeIdentity).observe(document.body,{attributes:true,attributeFilter:['data-theme']});
theme.addEventListener('change',updateThemeIdentity);
document.addEventListener('studio:language',updateThemeIdentity);
window.addEventListener('load',updateThemeIdentity,{once:true});
updateThemeIdentity();
})();