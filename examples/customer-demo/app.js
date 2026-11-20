/* Fictional, isolated customer-demo preview. No production API or credentials. */
(() => {
  'use strict';
  let initialProfile, profile;
  const byId = id => document.getElementById(id);
  const text = (id, value) => { byId(id).textContent = value || ''; };
  const make = (tag, content, cls) => {
    const element = document.createElement(tag);
    if (cls) element.className = cls;
    element.textContent = content || '';
    return element;
  };
  const validExampleUrl = value => {
    try {
      const uri = new URL(value);
      return uri.protocol === 'https:' && ['example.com','github.com'].includes(uri.hostname) &&
        (uri.hostname !== 'github.com' || uri.pathname === '/example');
    } catch { return false; }
  };
  function draw() {
    const identity = profile.identity;
    text('name',identity.displayName);
    text('role',identity.role);
    text('location',identity.location);
    text('tagline',identity.tagline);
    text('about',profile.about);
    text('avatar',identity.initials);
    document.documentElement.style.setProperty('--accent',profile.appearance.accent);
    document.documentElement.style.setProperty('--base',profile.appearance.background);
    const skills=byId('skills');
    skills.replaceChildren(...profile.skills.map(s=>make('span',s,'chip')));
    const projects=byId('projects');
    projects.replaceChildren(...profile.projects.map(p=>{
      const card=make('article','','card');
      card.append(make('span',p.category,'eyebrow'),make('h3',p.name),make('p',p.description,'muted'));
      if (validExampleUrl(p.url)) {
        const link=make('a','Example project link');
        link.href=p.url;
        link.target='_blank';
        link.rel='noopener noreferrer';
        card.append(link);
      }
      return card;
    }));
    const social=byId('social');
    social.replaceChildren(...profile.social.filter(item=>validExampleUrl(item.url)).map(item=>{
      const link=make('a',item.label);
      link.href=item.url;
      link.target='_blank';
      link.rel='noopener noreferrer';
      return link;
    }));
    text('email',profile.contact.label+' · '+profile.contact.email+' (not monitored)');
  }
  function populateForm() {
    const form=byId('profile-form');
    for (const key of ['displayName','role','location','tagline']) form.elements.namedItem(key).value=profile.identity[key]||'';
    form.elements.namedItem('accent').value=profile.appearance.accent;
    form.elements.namedItem('about').value=profile.about;
    form.elements.namedItem('skills').value=profile.skills.join(', ');
  }
  const status = message => text('editor-status', message);
  byId('edit-toggle').addEventListener('click',()=>{
    const editor=byId('editor'), open=editor.classList.toggle('open');
    byId('edit-toggle').setAttribute('aria-expanded',String(open));
    if(open)editor.querySelector('input').focus();
  });
  byId('profile-form').addEventListener('submit',event=>{
    event.preventDefault();
    if (!profile) return;
    const form=event.currentTarget;
    for (const key of ['displayName','role','location','tagline']) profile.identity[key]=form.elements.namedItem(key).value.trim();
    profile.identity.initials=profile.identity.displayName.split(/\s+/).slice(0,2).map(s=>s[0]||'').join('').toUpperCase();
    profile.appearance.accent=form.elements.namedItem('accent').value;
    profile.about=form.elements.namedItem('about').value.trim();
    profile.skills=form.elements.namedItem('skills').value.split(',').map(s=>s.trim()).filter(Boolean).slice(0,24);
    draw();
    status('Preview updated locally. Export JSON to save your example profile.');
  });
  byId('reset-profile').addEventListener('click',()=>{
    if(!initialProfile)return;
    profile=structuredClone(initialProfile);
    populateForm();
    draw();
    status('Demo restored to its original fictional profile.');
  });
  byId('export-profile').addEventListener('click',()=>{
    if(!profile)return;
    const blob=new Blob([JSON.stringify(profile,null,2)+'\n'],{type:'application/json'});
    const href=URL.createObjectURL(blob);
    const link=document.createElement('a');
    link.href=href;
    link.download='customer-demo-profile.json';
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(href);
    status('Profile JSON export requested. No data was sent to a server.');
  });
  fetch('./profile.json',{cache:'no-store'}).then(response=>{
    if(!response.ok)throw Error('Profile sample unavailable');
    return response.json();
  }).then(data=>{
    if(data.schemaVersion!==1 || data.demo!==true || !data.identity?.displayName || !Array.isArray(data.projects) || !Array.isArray(data.skills))throw Error('Profile sample is invalid');
    initialProfile=structuredClone(data);
    profile=structuredClone(data);
    populateForm();
    draw();
  }).catch(()=>{
    status('The demo data could not load. Serve this folder over HTTP rather than opening the HTML file directly.');
    byId('name').textContent='Demo profile unavailable';
  });
})();
