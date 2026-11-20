/* Fully interactive fictional customer preview: all edits remain local. */
(() => {
  'use strict';
  const STORAGE_KEY = 'personal-profile-web-studio:fictional-demo:v1';
  const MAX_IMPORT_BYTES = 128 * 1024;
  let initialProfile, profile;
  const byId = id => document.getElementById(id);
  const text = (id, value) => { byId(id).textContent = value || ''; };
  const make = (tag, content, cls) => {
    const element = document.createElement(tag);
    if (cls) element.className = cls;
    element.textContent = content || '';
    return element;
  };
  const safeText = (v,max=240) => typeof v === 'string' ? v.trim().slice(0,max) : '';
  const validExampleUrl = value => {
    try {
      const uri = new URL(value);
      return uri.protocol === 'https:' && !uri.username && !uri.password &&
        !['localhost','127.0.0.1','0.0.0.0'].includes(uri.hostname) &&
        !uri.hostname.endsWith('.local') && !!uri.hostname.includes('.');
    } catch { return false; }
  };
  const validColor = v => typeof v === 'string' && /^#[a-fA-F0-9]{6}$/.test(v);
  function validateProfile(raw) {
    if (!raw || typeof raw !== 'object' || Array.isArray(raw) || raw.schemaVersion !== 1 || raw.demo !== true) throw Error('This must be a version 1 fictional demo profile.');
    const identity = raw.identity, appearance = raw.appearance, seo = raw.seo, contact = raw.contact;
    if (!identity || !appearance || !seo || !contact) throw Error('Missing profile section.');
    if (!safeText(identity.displayName,70) || !safeText(identity.role,110)) throw Error('Name and role are required.');
    if (!validColor(appearance.accent) || !validColor(appearance.background)) throw Error('Invalid profile colors.');
    if (!Array.isArray(raw.skills) || raw.skills.length > 24 || !Array.isArray(raw.projects) || raw.projects.length > 24 || !Array.isArray(raw.social) || raw.social.length > 16) throw Error('Too many skills, projects, or social links.');
    const skills = raw.skills.map(s => safeText(s,70)).filter(Boolean);
    const projects = raw.projects.map((p,i) => {
      if (!p || !safeText(p.name,110) || !safeText(p.description,650)) throw Error('Project '+(i+1)+' needs a name and description.');
      if (p.url && !validExampleUrl(p.url)) throw Error('Project '+(i+1)+' needs a valid HTTPS URL.');
      return {name:safeText(p.name,110), category:safeText(p.category,80), description:safeText(p.description,650), caseStudy:safeText(p.caseStudy,700), url:safeText(p.url,500)};
    });
    const social = raw.social.map((s,i)=>{
      if (!s || !safeText(s.label,70) || !validExampleUrl(s.url)) throw Error('Social link '+(i+1)+' needs a label and HTTPS URL.');
      return {label:safeText(s.label,70),url:safeText(s.url,500)};
    });
    const email=safeText(contact.email,180);
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw Error('Invalid contact email.');
    return {
      schemaVersion:1, demo:true,
      identity:{displayName:safeText(identity.displayName,70),role:safeText(identity.role,110),tagline:safeText(identity.tagline,160),location:safeText(identity.location,100),initials:safeText(identity.displayName,70).split(/\s+/).slice(0,2).map(s=>s[0]||'').join('').toUpperCase()},
      about:safeText(raw.about,1200),skills,projects,social,
      contact:{label:safeText(contact.label,90),email},
      appearance:{accent:appearance.accent,background:appearance.background},
      seo:{title:safeText(seo.title,100),description:safeText(seo.description,240)}
    };
  }
  const status = message => text('editor-status',message);
  function save() {
    try {localStorage.setItem(STORAGE_KEY,JSON.stringify(profile));return true;}
    catch {status('Preview updated, but browser storage is unavailable. Export JSON to retain changes.');return false;}
  }
  function draw() {
    if (!profile) return;
    const identity=profile.identity;
    text('name',identity.displayName);
    text('demo-brand',identity.displayName);
    text('portrait-caption','Fictional developer • '+identity.displayName);
    text('role',identity.role);
    text('location',identity.location);
    text('tagline',identity.tagline);
    text('about',profile.about);
    const avatar=byId('avatar');
    avatar.replaceChildren();
    const portrait=document.createElement('img');
    portrait.src='./illustrated-developer.svg';
    portrait.alt='';
    portrait.width=600;
    portrait.height=600;
    portrait.className='demo-portrait';
    avatar.append(portrait);
    document.documentElement.style.setProperty('--accent',profile.appearance.accent);
    document.documentElement.style.setProperty('--base',profile.appearance.background);
    document.title=(profile.seo.title || identity.displayName + ' | Demo Portfolio') + ' — Demo';
    const meta=document.querySelector('meta[name="description"]');
    if(meta)meta.content=profile.seo.description;
    byId('skills').replaceChildren(...profile.skills.map(s=>make('span',s,'chip')));
    byId('projects').replaceChildren(...profile.projects.map(p=>{
      const card=make('article','','card');
      card.append(make('span',p.category,'eyebrow'),make('h3',p.name),make('p',p.description,'muted'));
      if (p.caseStudy) {
        const study=make('details','','project-study');
        study.append(make('summary','Read sample case study'),make('p',p.caseStudy,'muted'));
        card.append(study);
      }
      if (p.url && validExampleUrl(p.url)) {
        const link=make('a','View project');
        link.href=p.url;link.target='_blank';link.rel='noopener noreferrer';card.append(link);
      }
      return card;
    }));
    byId('social').replaceChildren(...profile.social.filter(s=>validExampleUrl(s.url)).map(item=>{
      const link=make('a',item.label);
      link.href=item.url;link.target='_blank';link.rel='noopener noreferrer';return link;
    }));
    text('email',profile.contact.label+' · '+profile.contact.email+' (display only; no mail sent)');
  }
  function field(parent,title,value,kind,property,maxlength) {
    const label=make('label',title);
    const element=document.createElement(kind==='textarea'?'textarea':'input');
    if(kind!=='textarea')element.type=kind==='url'?'url':'text';
    element.dataset.property=property;
    element.value=value||'';
    element.maxLength=maxlength;
    label.append(element);parent.append(label);
    return element;
  }
  function drawEditors() {
    const projectEditor=byId('project-editor'),socialEditor=byId('social-editor');
    projectEditor.replaceChildren(...profile.projects.map((p,i)=>{
      const row=make('div','','edit-row');
      row.dataset.projectIndex=String(i);
      row.append(make('h4','Project '+(i+1)));
      const fields=make('div','','fields');
      field(fields,'Project name',p.name,'text','name',110);
      field(fields,'Category',p.category,'text','category',80);
      const desc=field(fields,'Description',p.description,'textarea','description',650);
      desc.parentElement.classList.add('wide');
      const caseStudy=field(fields,'Case study / approach',p.caseStudy||'','textarea','caseStudy',700);
      caseStudy.parentElement.classList.add('wide');
      const url=field(fields,'HTTPS project link',p.url,'url','url',500);
      url.parentElement.classList.add('wide');
      row.append(fields);
      const remove=make('button','Remove project','ghost');
      remove.type='button';remove.dataset.removeProject=String(i);row.append(remove);
      return row;
    }));
    socialEditor.replaceChildren(...profile.social.map((s,i)=>{
      const row=make('div','','edit-row');
      row.dataset.socialIndex=String(i);
      const fields=make('div','','fields');
      field(fields,'Link label',s.label,'text','label',70);
      field(fields,'HTTPS URL',s.url,'url','url',500);
      row.append(fields);
      const remove=make('button','Remove link','ghost');
      remove.type='button';remove.dataset.removeSocial=String(i);row.append(remove);
      return row;
    }));
  }
  function populateForm() {
    const form=byId('profile-form');
    for(const key of ['displayName','role','location','tagline'])form.elements.namedItem(key).value=profile.identity[key]||'';
    form.elements.namedItem('accent').value=profile.appearance.accent;
    form.elements.namedItem('background').value=profile.appearance.background;
    form.elements.namedItem('about').value=profile.about;
    form.elements.namedItem('skills').value=profile.skills.join(', ');
    form.elements.namedItem('seoTitle').value=profile.seo.title;
    form.elements.namedItem('seoDescription').value=profile.seo.description;
    form.elements.namedItem('contactLabel').value=profile.contact.label;
    form.elements.namedItem('contactEmail').value=profile.contact.email;
    drawEditors();
  }
  function readDraft() {
    const form=byId('profile-form');
    const draft=structuredClone(profile);
    for(const key of ['displayName','role','location','tagline'])draft.identity[key]=form.elements.namedItem(key).value;
    draft.appearance.accent=form.elements.namedItem('accent').value;
    draft.appearance.background=form.elements.namedItem('background').value;
    draft.about=form.elements.namedItem('about').value;
    draft.skills=form.elements.namedItem('skills').value.split(',').map(x=>x.trim()).filter(Boolean);
    draft.seo.title=form.elements.namedItem('seoTitle').value;
    draft.seo.description=form.elements.namedItem('seoDescription').value;
    draft.contact.label=form.elements.namedItem('contactLabel').value;
    draft.contact.email=form.elements.namedItem('contactEmail').value;
    draft.projects=[...byId('project-editor').children].map(row=>{
      const item={};
      row.querySelectorAll('[data-property]').forEach(e=>item[e.dataset.property]=e.value);
      return item;
    });
    draft.social=[...byId('social-editor').children].map(row=>{
      const item={};row.querySelectorAll('[data-property]').forEach(e=>item[e.dataset.property]=e.value);return item;
    });
    return validateProfile(draft);
  }
  function applyDraft(message='Preview updated. Changes are saved in this browser.') {
    try {profile=readDraft();save();draw();populateForm();status(message);return true;}
    catch(error){status('Please correct the form: '+error.message);return false;}
  }
  byId('edit-toggle').addEventListener('click',()=>{
    const editor=byId('editor'),open=editor.classList.toggle('open');
    byId('edit-toggle').setAttribute('aria-expanded',String(open));
    if(open)editor.querySelector('input').focus();
  });
  byId('profile-form').addEventListener('submit',event=>{event.preventDefault();if(profile)applyDraft();});
  byId('add-project').addEventListener('click',()=>{
    if(!profile||!applyDraft('Current changes saved.'))return;
    if(profile.projects.length>=24){status('Maximum 24 projects.');return;}
    profile.projects.push({name:'New Project',category:'Portfolio',description:'Describe your project.',caseStudy:'Explain the challenge and how it was approached.',url:''});
    save();drawEditors();draw();status('New project added. Edit it and save.');
  });
  byId('add-social').addEventListener('click',()=>{
    if(!profile||!applyDraft('Current changes saved.'))return;
    if(profile.social.length>=16){status('Maximum 16 links.');return;}
    profile.social.push({label:'New link',url:'https://example.com'});
    save();drawEditors();draw();status('New link added. Edit it and save.');
  });
  byId('project-editor').addEventListener('click',event=>{
    const button=event.target.closest('[data-remove-project]');
    if(!button||!profile)return;
    const index=Number(button.dataset.removeProject);
    profile.projects.splice(index,1);save();drawEditors();draw();status('Project removed.');
  });
  byId('social-editor').addEventListener('click',event=>{
    const button=event.target.closest('[data-remove-social]');
    if(!button||!profile)return;
    profile.social.splice(Number(button.dataset.removeSocial),1);save();drawEditors();draw();status('Social link removed.');
  });
  byId('reset-profile').addEventListener('click',()=>{
    if(!initialProfile)return;
    profile=structuredClone(initialProfile);
    try{localStorage.removeItem(STORAGE_KEY);}catch{}
    populateForm();draw();status('Original fictional demo restored.');
  });
  byId('export-profile').addEventListener('click',()=>{
    if(!profile||!applyDraft('Profile prepared for export.'))return;
    const blob=new Blob([JSON.stringify(profile,null,2)+'\n'],{type:'application/json'});
    const href=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=href;link.download='customer-demo-profile.json';document.body.append(link);link.click();link.remove();
    setTimeout(()=>URL.revokeObjectURL(href),2000);
    status('Profile JSON export requested. Nothing was sent to a server.');
  });
  byId('import-profile').addEventListener('change',async event=>{
    const file=event.target.files?.[0];
    event.target.value='';
    if(!file)return;
    if(file.size>MAX_IMPORT_BYTES){status('The JSON file is too large (128 KB maximum).');return;}
    try{
      const candidate=validateProfile(JSON.parse(await file.text()));
      profile=candidate;save();populateForm();draw();
      status('Demo profile imported and previewed. Saved locally in this browser.');
    }catch(error){status('Import rejected: '+error.message);}
  });
  fetch('./profile.json',{cache:'no-store'}).then(response=>{
    if(!response.ok)throw Error('Profile sample unavailable');
    return response.json();
  }).then(data=>{
    initialProfile=validateProfile(data);
    profile=structuredClone(initialProfile);
    try{
      const stored=localStorage.getItem(STORAGE_KEY);
      if(stored) profile=validateProfile(JSON.parse(stored));
    }catch{status('Saved changes were invalid; the original demo was loaded.');}
    populateForm();draw();
  }).catch(()=>{
    status('The demo data could not load. Serve this folder over HTTP rather than opening the HTML file directly.');
    byId('name').textContent='Demo profile unavailable';
  });
})();
