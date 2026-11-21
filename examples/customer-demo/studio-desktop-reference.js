/* Faithful desktop menu compositions for the TWO independent supplied screenshots.
 * Aurora: both Studio and System panels visible, as in design 1.png.
 * Cosmic: the single comprehensive Studio panel, as in design 2.png.
 * All implemented actions delegate to existing working controls.
 * All unimplemented capabilities are native disabled buttons.
 * Mobile and other themes retain their normal interactive menus.
 */
(()=>{
  'use strict';
  const theme=document.getElementById('studio-theme');
  const studioTrigger=document.querySelector('.studio-nav-trigger');
  const studioPanel=document.getElementById('studio-nav-panel');
  const systemTrigger=document.getElementById('system-menu-trigger');
  const systemPanel=document.getElementById('system-menu-panel');
  if(!theme||!studioTrigger||!studioPanel||!systemTrigger||!systemPanel)return;
  const allowed=['neon-studio','design-2'];
  let active=false,dismissed=false;
  const run=id=>document.getElementById(id)?.click();
  const editor=()=>run('edit-toggle');
  const item=(text,{icon='◇',action=null,pro=false,disabled=false}={})=>{
    const b=document.createElement('button');b.type='button';
    b.className='cosmic-menu-action';
    const graphic=document.createElement('span');graphic.className='cosmic-menu-icon';graphic.textContent=icon;graphic.setAttribute('aria-hidden','true');
    const label=document.createElement('span');label.className='cosmic-menu-label';label.textContent=text;
    b.append(graphic,label);
    if(pro){
      const p=document.createElement('span');p.className='cosmic-pro';p.textContent='Pro · Planned';b.append(p);
    }
    if(disabled||!action){
      b.disabled=true;b.title=text+' — coming soon';
      if(!pro){const status=document.createElement('small');status.textContent='Soon';status.className='cosmic-soon';b.append(status);}
    }else b.addEventListener('click',()=>{
      action();
      studioPanel.hidden=true;studioTrigger.setAttribute('aria-expanded','false');
      dismissed=true;
    });
    return b;
  };
  const group=(title,items)=>{
    const section=document.createElement('section');section.className='cosmic-menu-section';
    const h=document.createElement('h3');h.textContent=title;section.append(h,...items);return section;
  };
  const cosmic=document.createElement('div');cosmic.className='cosmic-menu-reference';
  cosmic.append(
    group('Profile & Content',[
      item('Edit Profile',{icon:'✎',action:editor}),
      item('Manage Projects',{icon:'▱',action:()=>{
        editor();
        document.getElementById('project-editor')?.scrollIntoView({behavior:'smooth',block:'start'});
      }}),
      item('Background & Theme',{icon:'◉',action:()=>theme.focus()}),
      item('Site Settings',{icon:'⚙',action:editor}),
    ]),
    group('Backup & Restore',[
      item('Download My Profile Backup (JSON)',{icon:'↓',action:()=>run('backup-download')}),
      item('Restore from My JSON Backup',{icon:'↑',action:()=>run('backup-import')}),
    ]),
    group('System & Services',[
      item('Hosting & Domain Wizard',{icon:'☁',pro:true}),
      item('Deploy & Publish',{icon:'↗',disabled:true}),
      item('Backup & Recovery',{icon:'◇',disabled:true}),
      item('Logs & Diagnostics',{icon:'⌁',disabled:true}),
    ]),
    group('More',[
      item('Email Client Enquiry',{icon:'✉',action:()=>document.getElementById('contact-section')?.scrollIntoView({behavior:'smooth'})}),
      item('Import / Export Data',{icon:'⇄',action:()=>run('backup-download')}),
      item('Advanced Tools',{icon:'⌘',disabled:true}),
    ])
  );
  studioPanel.append(cosmic);
  // Reference styling is available on deliberate interaction only.
  // Auto-opening both menus on desktop obscured the hero and feature cards.
  const isWideReference=()=>allowed.includes(document.body.dataset.theme)
    &&window.innerWidth>=1570&&window.matchMedia('(pointer:fine)').matches;
  const syncPreviewStyle=()=>{
    document.body.classList.toggle(
      'desktop-reference-preview',
      isWideReference()&&(!studioPanel.hidden||!systemPanel.hidden)
    );
  };
  // Never expand dropdowns on page load, theme change or viewport resize.
  studioPanel.hidden=true;studioTrigger.setAttribute('aria-expanded','false');
  systemPanel.hidden=true;systemTrigger.setAttribute('aria-expanded','false');
  studioTrigger.addEventListener('click',syncPreviewStyle);
  systemTrigger.addEventListener('click',syncPreviewStyle);
  document.addEventListener('pointerdown',event=>{
    if(!event.target.closest('.studio-nav-dropdown,.system-menu')) {
      // Existing click-away listeners close the panels synchronously.
      syncPreviewStyle();
    }
  });
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape')requestAnimationFrame(syncPreviewStyle);
  });
  theme.addEventListener('change',()=>{
    studioPanel.hidden=true;studioTrigger.setAttribute('aria-expanded','false');
    systemPanel.hidden=true;systemTrigger.setAttribute('aria-expanded','false');
    syncPreviewStyle();
  });
  window.addEventListener('resize',syncPreviewStyle);
})();