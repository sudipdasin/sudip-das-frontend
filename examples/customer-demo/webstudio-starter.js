/* Portable browser-only community starter export. No server, accounts or payment.
   Theme modules are explicit and extendable through a reviewed registry.
   ZIP uses standard stored (method 0) entries for offline compatibility. */
(function(root){
 'use strict';
 const THEMES=Object.freeze({
  orbit:Object.freeze({id:'orbit',label:'Orbit',accent:'#65ddce',background:'#091b2d'}),
  editorial:Object.freeze({id:'editorial',label:'Editorial',accent:'#bd743e',background:'#f6f0e6'}),
  terminal:Object.freeze({id:'terminal',label:'Terminal',accent:'#47da91',background:'#061911'})
 });
 const printable=(v,max)=>typeof v==='string'&&v.trim().length>0&&v.trim().length<=max&&!/[\u0000-\u001f]/.test(v);
 const safeURL=v=>{try{const u=new URL(v);return u.protocol==='https:'&&!u.username&&!u.password&&u.hostname.includes('.')&&!['localhost','127.0.0.1'].includes(u.hostname);}catch{return false;}};
 const escapeHTML=v=>String(v).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const asText=v=>escapeHTML(v||'');
 function validate(profile,theme){
  if(!Object.hasOwn(THEMES,theme))throw Error('Only Orbit, Editorial and Terminal are exportable in the free edition.');
  if(!profile||profile.schemaVersion!==1||profile.demo!==true)throw Error('Please edit a valid WebStudio demo profile.');
  if(!printable(profile.identity?.displayName,70)||!printable(profile.identity?.role,110))throw Error('Name and role are required.');
  if(!printable(profile.identity?.tagline,160))throw Error('Tagline is required.');
  if(!profile.seo||!printable(profile.seo.title,100)||!printable(profile.seo.description,240))throw Error('SEO title and description are required.');
  if(!Array.isArray(profile.projects)||profile.projects.length<1||profile.projects.length>24)throw Error('Add at least one valid project.');
  for(const project of profile.projects){
   if(!printable(project.name,110)||!printable(project.description,650)||project.url&&!safeURL(project.url))
    throw Error('Each project needs a name, description, and optional HTTPS link.');
  }
  if(!Array.isArray(profile.social)||profile.social.length>16||profile.social.some(x=>!printable(x.label,70)||!safeURL(x.url)))throw Error('Social links must be valid HTTPS links.');
  const email=profile.contact?.email||'';
  if(email&&(!printable(email,180)||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)))throw Error('Enter a valid contact email or leave it empty.');
  const json=JSON.stringify(profile);
  if(json.length>128*1024||/BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY|TURNSTILE_SECRET_KEY|VAULT_ADMIN_TOKEN|MAIL_BRIDGE_SECRET/i.test(json))
   throw Error('Private keys, secret tokens, or oversized input cannot be exported.');
  return true;
 }
 const cssBase=String.raw`/* WebStudio free portable theme engine. No external dependencies. */
:root{font-family:system-ui,-apple-system,sans-serif;line-height:1.6;color-scheme:light dark}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;color:var(--ink);background:var(--bg)}
a{color:var(--accent);overflow-wrap:anywhere}
a:focus-visible,button:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.shell{max-width:1080px;margin:auto;padding:0 24px}
header{border-bottom:1px solid var(--line);position:relative}
nav{display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;padding:20px 0}
nav strong{font-size:1.3rem}nav div{display:flex;gap:18px}
.hero{padding:clamp(70px,9vw,140px) 0 64px;display:grid;grid-template-columns:minmax(0,1.6fr) minmax(200px,1fr);gap:35px;align-items:center}
.kicker{letter-spacing:.17em;text-transform:uppercase;color:var(--accent);font-size:.76rem;font-weight:750}
h1{font-size:clamp(2.9rem,7vw,6rem);letter-spacing:-.06em;line-height:1.03;margin:.35em 0}
.lead{font-size:clamp(1.1rem,2.4vw,1.5rem);color:var(--muted)}
.button{display:inline-block;background:var(--accent);color:var(--button-ink);text-decoration:none;padding:14px 20px;border-radius:12px;font-weight:700}
.art{aspect-ratio:1;border:2px solid var(--accent);border-radius:50%;display:grid;place-items:center;box-shadow:0 0 0 16px var(--halo),0 0 90px var(--halo);font-size:clamp(3rem,9vw,6rem);font-weight:900}
section{padding:56px 0;border-top:1px solid var(--line)}
h2{font-size:clamp(1.7rem,3.2vw,2.5rem);letter-spacing:-.035em}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,280px),1fr));gap:18px}
article{padding:23px;border:1px solid var(--line);border-radius:17px;background:var(--panel)}
article h3{margin:0 0 10px}article p{color:var(--muted)}
footer{border-top:1px solid var(--line);padding:24px 0 48px;color:var(--muted)}
@media(max-width:680px){.hero{grid-template-columns:1fr}.art{width:min(65vw,270px);margin:12px auto}.shell{padding:0 18px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
`;
 const themeCSS=Object.freeze({
  orbit:':root{--bg:#091b2d;--panel:#11283b;--ink:#f4f9ff;--muted:#b0c7d5;--accent:#65ddce;--button-ink:#061e28;--line:#35566b;--halo:#65ddce20}\n.art{background:radial-gradient(circle,#1a5575,#091b2d)}\n',
  editorial:':root{--bg:#f6f0e6;--panel:#fffaf3;--ink:#242624;--muted:#565d58;--accent:#9b5431;--button-ink:#fff;--line:#c7b9a8;--halo:#9b543125}\nh1,h2,h3{font-family:Georgia,serif}.art{border-radius:12px;background:#efe0cf;box-shadow:12px 12px 0 var(--halo)}\n',
  terminal:':root{--bg:#061911;--panel:#0e281d;--ink:#e0fbe9;--muted:#a8d7b7;--accent:#47da91;--button-ink:#071c10;--line:#2b6644;--halo:#47da9128}\nbody{font-family:ui-monospace,monospace}.art,article,.button{border-radius:4px}\n'
 });
 function build(profile,theme){
  validate(profile,theme);
  const initials=profile.identity.displayName.trim().split(/\s+/).slice(0,2).map(x=>x[0]).join('').toUpperCase();
  const cards=profile.projects.map(p=>'<article><h3>'+asText(p.name)+'</h3><p>'+asText(p.description)+'</p>'+(p.url?'<a href="'+escapeHTML(p.url)+'" target="_blank" rel="noopener noreferrer">View project</a>':'')+'</article>').join('');
  const socials=profile.social.map(s=>'<a href="'+escapeHTML(s.url)+'" target="_blank" rel="noopener noreferrer">'+asText(s.label)+'</a>').join(' · ');
  const email=profile.contact?.email||'';
  const contact=email?'<a class="button" href="mailto:'+encodeURIComponent(email)+'">Get in touch</a>':'<p>Contact details can be added later.</p>';
  const html='<!doctype html>\n<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="'+escapeHTML(profile.seo.description)+'"><title>'+asText(profile.seo.title)+'</title><link rel="stylesheet" href="assets/base.css"><link rel="stylesheet" href="themes/'+theme+'.css"></head><body><header><nav class="shell" aria-label="Primary"><strong>'+asText(profile.identity.displayName)+'</strong><div><a href="#about">About</a><a href="#projects">Projects</a><a href="#contact">Contact</a></div></nav></header><main><div class="shell"><div class="hero"><div><p class="kicker">'+asText(profile.identity.location||'Independent creator')+'</p><h1>'+asText(profile.identity.displayName)+'</h1><p class="lead">'+asText(profile.identity.role)+'</p><p>'+asText(profile.identity.tagline)+'</p><a class="button" href="#projects">Explore my work</a></div><div class="art" aria-label="Initials logo">'+asText(initials)+'</div></div><section id="about"><h2>About</h2><p>'+asText(profile.about||profile.identity.tagline)+'</p></section><section id="projects"><h2>Selected projects</h2><div class="grid">'+cards+'</div></section><section id="contact"><h2>Connect</h2>'+contact+'<p>'+socials+'</p></section></div></main><footer class="shell">Created with WebStudio Free · Manually deployable, provider-independent static files.</footer></body></html>\n';
  const safeProfile=JSON.parse(JSON.stringify(profile));safeProfile.appearance.portrait='';
  return Object.freeze({
   'index.html':html,
   'assets/base.css':cssBase,
   ['themes/'+theme+'.css']:themeCSS[theme],
   'data/profile.json':JSON.stringify(safeProfile,null,2)+'\n',
   'config/modules.json':JSON.stringify({schemaVersion:1,theme,features:['profile','projects','contact'],plugins:[]},null,2)+'\n',
   'README.txt':'WEBSTUDIO FREE PORTABLE STARTER\n\n1. Extract the ZIP.\n2. Edit data/profile.json to keep a copy of your content. The static page is already rendered.\n3. Upload the contents of the site/ folder to a static hosting provider manually, or preview with python3 -m http.server 8000 inside site/.\n4. Hosting, DNS, analytics, authentication and real verification are NOT included. You must configure hosting yourself.\n5. Files are intentionally readable because client-side web browsers must read HTML/CSS. Never put passwords, private keys, or secrets in this ZIP.\n6. The JSON is a backup/snapshot; editing it alone does not regenerate HTML. Re-export from WebStudio to apply changes.\n'
  });
 }
 const utf8=new TextEncoder();
 function crc32(bytes){let c=0xffffffff;for(const b of bytes){c^=b;for(let i=0;i<8;i++)c=(c>>>1)^((c&1)?0xedb88320:0);}return(c^0xffffffff)>>>0;}
 function zip(files){
  const entries=Object.entries(files);
  if(entries.length>100)throw Error('Too many export entries');
  const chunks=[],central=[];let offset=0;
  for(const [path,content] of entries){
   if(!/^[a-zA-Z0-9._/-]+$/.test(path)||path.startsWith('/')||path.split('/').includes('..'))throw Error('Unsafe export path');
   const data=utf8.encode(String(content)),name=utf8.encode('site/'+path);
   if(data.length>1024*1024)throw Error('Export file exceeds size limit');
   const sum=crc32(data),local=new Uint8Array(30),l=new DataView(local.buffer);
   l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x800,true);
   l.setUint32(14,sum,true);l.setUint32(18,data.length,true);l.setUint32(22,data.length,true);l.setUint16(26,name.length,true);
   chunks.push(local,name,data);
   const c=new Uint8Array(46),d=new DataView(c.buffer);
   d.setUint32(0,0x02014b50,true);d.setUint16(4,20,true);d.setUint16(6,20,true);d.setUint16(8,0x800,true);
   d.setUint32(16,sum,true);d.setUint32(20,data.length,true);d.setUint32(24,data.length,true);
   d.setUint16(28,name.length,true);d.setUint32(42,offset,true);
   central.push(c,name);offset+=local.length+name.length+data.length;
  }
  const size=central.reduce((n,b)=>n+b.length,0);
  const end=new Uint8Array(22),e=new DataView(end.buffer);
  e.setUint32(0,0x06054b50,true);e.setUint16(8,entries.length,true);e.setUint16(10,entries.length,true);
  e.setUint32(12,size,true);e.setUint32(16,offset,true);
  return new Blob([...chunks,...central,end],{type:'application/zip'});
 }

 // Exports the exact working demo app, not a simplified static template.
 // All dependencies are copied from the same isolated build manifest that
 // GitHub Pages deploys. The saved personal profile replaces fictional defaults.
 async function buildInteractive(profile,theme,source='./'){
  validate(profile,theme);
  const base=new URL(source,root.location.href);
  if(!['http:','https:'].includes(base.protocol)||base.origin!==root.location.origin)
   throw Error('The export source must be the current same-origin WebStudio preview.');
  const get=async name=>{
   if(!/^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(name))throw Error('Unsafe runtime asset path');
   const response=await fetch(new URL(name,base),{cache:'no-store',credentials:'omit'});
   if(!response.ok)throw Error('Required interactive preview file unavailable: '+name);
   const body=await response.text();
   if(body.length>1024*1024)throw Error('Runtime asset too large: '+name);
   return body;
  };
  const manifest=JSON.parse(await get('webstudio-runtime-manifest.json'));
  if(manifest.schemaVersion!==1||!Array.isArray(manifest.files)||manifest.files.length<40||manifest.files.length>120)
   throw Error('Invalid isolated runtime manifest');
  const paths=[...new Set(manifest.files)];
  if(paths.length!==manifest.files.length||!paths.includes('index.html')||!paths.includes('app.js')||!paths.includes('studio-features.js'))
   throw Error('Required interactive app modules missing from manifest');
  const pairs=await Promise.all(paths.map(async name=>[name,await get(name)]));
  const files=Object.fromEntries(pairs);
  const clean=structuredClone(profile);
  clean.appearance.portrait='';
  files['profile.json']=JSON.stringify(clean,null,2)+'\n';
  const policy=String.raw`/* WebStudio Free exported-theme and edition restrictions. */
(()=>{
'use strict';
const free=['orbit','editorial','terminal'];
const current='__THEME__';
const apply=()=>{
  const select=document.getElementById('studio-theme');
  if(!select)return;
  for(const opt of select.options)if(!free.includes(opt.value)){opt.disabled=true;opt.textContent=opt.textContent.replace(/\s*·\s*Pro preview/g,'')+' · Pro preview';}
  if(!free.includes(select.value)||select.value!==current){
    select.value=current;select.dispatchEvent(new Event('change',{bubbles:true}));
  }
  document.body.dataset.theme=current;
  const freePanel=document.getElementById('ws-free-starter');
  if(freePanel)freePanel.hidden=true;
  const other=document.getElementById('tour-start');
  if(other)other.hidden=true;
};
document.addEventListener('DOMContentLoaded',apply);
window.addEventListener('pageshow',apply);
})();`.replace('__THEME__',theme);
  files['webstudio-free-runtime.js']=policy;
  files['index.html']=files['index.html'].replace('</body>',
   '<script src="webstudio-free-runtime.js" defer></script></body>');
  files['webstudio-runtime-manifest.json']=JSON.stringify({schemaVersion:1,
   source:'exported-interactive-free',files:[...paths,'webstudio-free-runtime.js']},null,2)+'\n';
  files['README.txt']='WEBSTUDIO INTERACTIVE FREE WEBSITE\n\n'+
   '1. Extract the ZIP and upload the contents of site/ to your own HTTP(S) host.\n'+
   '2. For local testing: cd site && python3 -m http.server 8000\n'+
   '3. The exported site uses the SAME complete WebStudio interactive HTML/CSS/JS runtime as the preview, with your own saved profile.json.\n'+
   '4. Only Orbit, Editorial and Terminal are permitted in this Free export. Four other themes are disabled previews.\n'+
   '5. Editing works in browser-local storage; visitors cannot edit your hosting source remotely. Export new JSON/site files to republish changes.\n'+
   '6. This is a standalone interactive frontend, not a hosted CMS or verified email system. No automatic hosting, backend or secrets are included.\n'+
   '7. Static frontends are readable and can be copied. Never put private keys, credentials or sensitive records in these exported files.\n';
  return files;
 }

  const api=Object.freeze({THEMES,validate,build,buildInteractive,zip});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.WebStudioStarter=api;
})(typeof window!=='undefined'?window:undefined);
