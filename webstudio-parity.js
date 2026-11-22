/* WebStudio-style system menu and theme cockpit for the real portfolio.
 * This code is visitor-side only. It cannot publish, mutate owner records,
 * access the private API, send telemetry or store uploaded portraits.
 */
(() => {
  'use strict';
  if (document.body.dataset.wsParityReady==='true') return;
  const themeSelect=document.getElementById('theme-select');
  const languageSelect=document.getElementById('language-select');
  const navbar=document.querySelector('.topbar .nav');
  if(!themeSelect||!languageSelect||!navbar)return;
  document.body.classList.add('ws-parity');
  document.body.dataset.wsParityReady='true';
  const themes=[
    ['orbit','Orbit','#0c2632','#3fefcd'],
    ['editorial','Editorial','#e9dfd1','#94684a'],
    ['terminal','Terminal','#04150c','#53fa9d'],
    ['aurora-peak','Aurora Peak','#0e1b37','#67efcc'],
    ['neon-studio','Neon Studio','#03132b','#05e6f7'],
    ['design-2','Cosmic','#091039','#a464ff']
  ];
  const node=(tag,cls,text)=>{
    const item=document.createElement(tag);
    if(cls)item.className=cls;
    if(text!==undefined)item.textContent=text;
    return item;
  };
  // Match WebStudio's utility/navigation layout without impersonating
  // the demo product or adding a visitor-facing profile publisher.
  const banner=node('div','ws-utility');
  banner.setAttribute('role','region');
  banner.setAttribute('aria-label','Personal portfolio information');
  const brand=node('strong','','SUDIP DAS / INTERACTIVE PORTFOLIO');
  const rhs=node('span','ws-utility-right','Real projects · Six design experiences · No account required');
  banner.append(brand,rhs);
  document.querySelector('.topbar')?.before(banner);
  const opener=node('button','ws-studio-toggle','✦ Studio & system');
  opener.id='ws-studio-open';opener.type='button';opener.setAttribute('aria-haspopup','dialog');
  opener.setAttribute('aria-expanded','false');opener.setAttribute('aria-controls','ws-studio-panel');
  navbar.append(opener);

  const backdrop=node('div','ws-studio-backdrop');backdrop.hidden=true;
  const panel=node('section','ws-studio-panel');
  panel.id='ws-studio-panel';panel.hidden=true;
  panel.setAttribute('role','dialog');panel.setAttribute('aria-modal','true');
  panel.setAttribute('aria-labelledby','ws-studio-title');
  const closeButton=node('button','ws-studio-close','×');
  closeButton.type='button';closeButton.setAttribute('aria-label','Close Studio menu');
  const heading=node('h2','','Your portfolio studio');heading.id='ws-studio-title';
  const intro=node('p','','Explore the same six themes and visual tools as WebStudio, adapted to the approved personal portfolio. Changes here are local to your browser.');
  const themeHeading=node('h3','','Choose a design');
  const grid=node('div','ws-theme-grid');
  grid.setAttribute('role','group');grid.setAttribute('aria-label','Six WebStudio design themes');
  const controls=[];
  for(const [key,label,base,accent] of themes){
    const button=node('button','','');
    button.type='button';button.dataset.theme=key;
    button.setAttribute('aria-label','Activate '+label+' theme');
    const swatch=node('span','ws-theme-swatch');
    swatch.style.setProperty('--a',base);swatch.style.setProperty('--b',accent);
    swatch.setAttribute('aria-hidden','true');
    const text=node('span','',label);
    button.append(swatch,text);
    button.addEventListener('click',()=>{
      themeSelect.value=key;
      themeSelect.dispatchEvent(new Event('change',{bubbles:true}));
      refresh();
    });
    controls.push(button);grid.append(button);
  }
  const actionsHeading=node('h3','','Studio & system actions');
  const actions=node('div','ws-studio-action-grid');
  const buttons=[
    ['✦ Appearance','appearance'],
    ['▦ Project explorer','projects'],
    ['▶ Guided tour','tour'],
    ['◇ Project stories','stories'],
    ['▣ Compare projects','compare'],
    ['◉ Focus view','focus'],
    ['↓ Export my look','export'],
    ['↑ Import a look','import'],
    ['↺ Reset my look','reset'],
    ['▤ Print portfolio','print']
  ];
  const actionButtons=new Map();
  for(const [title,key] of buttons){
    const button=node('button','',title);
    button.type='button';button.dataset.action=key;
    button.addEventListener('click',()=>run(key));
    actions.append(button);actionButtons.set(key,button);
  }
  const demoLink=node('a','ws-studio-demo-link','Open full WebStudio editor (separate demo) ↗');
  demoLink.href='https://sudipdasin.github.io/sudip-das-frontend/';
  demoLink.target='_blank';demoLink.rel='noopener noreferrer';
  demoLink.style.cssText='display:block;margin-top:12px;padding:12px;color:var(--ws-accent);border:1px solid var(--ws-edge);border-radius:11px;text-decoration:none;font-size:.8rem;font-weight:750';
  const foot=node('p','ws-studio-foot','Live profile publishing and private requests remain protected. Visitors can change only their own local view. WebStudio’s full editor opens separately as a demo.');
  const status=node('p','','');status.id='ws-studio-status';status.setAttribute('role','status');status.setAttribute('aria-live','polite');
  panel.append(closeButton,heading,intro,themeHeading,grid,actionsHeading,actions,demoLink,foot,status);
  document.body.append(backdrop,panel);
  let priorFocus=null;
  function refresh(){
    const current=themeSelect.value;
    controls.forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.theme===current)));
  }
  function open(){
    priorFocus=document.activeElement;
    panel.hidden=false;backdrop.hidden=false;
    opener.setAttribute('aria-expanded','true');
    refresh();closeButton.focus();
  }
  function close(){
    if(panel.hidden)return;
    panel.hidden=true;backdrop.hidden=true;opener.setAttribute('aria-expanded','false');
    if(priorFocus?.isConnected)priorFocus.focus();
    else opener.focus();
  }
  function click(selector){
    const element=document.querySelector(selector);
    if(!element)return false;
    element.click();
    return true;
  }
  function inform(message){status.textContent=message;}
  function openAppearance(){
    close();
    return click('#profile-look-open');
  }
  function run(key){
    if(key==='appearance'){if(!openAppearance())inform('Appearance is unavailable.');return;}
    if(key==='projects'){
      close();
      const anchor=document.getElementById('profile-showcase')||document.getElementById('projects');
      anchor?.scrollIntoView({behavior:'smooth',block:'start'});
      const btn=document.querySelector('#profile-showcase .portfolio-gallery-open');
      btn?.focus({preventScroll:true});
      return;
    }
    if(key==='tour'){close();if(!click('#ws-tour-start'))inform('Tour is unavailable.');return;}
    if(key==='stories'){close();if(!click('#profile-showcase .portfolio-gallery-open'))inform('Project stories are unavailable.');return;}
    if(key==='compare'){
      close();
      document.getElementById('profile-showcase')?.scrollIntoView({behavior:'smooth',block:'start'});
      document.querySelector('.portfolio-compare-choice')?.focus({preventScroll:true});
      return;
    }
    if(key==='focus'){close();click('#portfolio-focus-toggle');return;}
    if(key==='print'){close();window.print();return;}
    if(key==='export'||key==='import'||key==='reset'){
      if(!openAppearance())return;
      const selector=key==='export'?'[data-export-look]':key==='import'?'input[data-import-look]':'[data-reset-look]';
      if(!click('#profile-look-dialog '+selector)) {
        const text='Open Appearance to '+(key==='export'?'download':'manage')+' your local design.';
        inform(text);
      }
      return;
    }
  }
  opener.addEventListener('click',()=>panel.hidden?open():close());
  closeButton.addEventListener('click',close);backdrop.addEventListener('click',close);
  document.addEventListener('keydown',event=>{
    if(panel.hidden)return;
    if(event.key==='Escape'){event.preventDefault();close();return;}
    if(event.key!=='Tab')return;
    const focusable=[...panel.querySelectorAll('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled])')].filter(x=>x.getClientRects().length);
    if(!focusable.length)return;
    const first=focusable[0],last=focusable.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus();}
  });
  themeSelect.addEventListener('change',refresh);
  languageSelect.addEventListener('change',()=>{for(const [key,label] of themes){
    const opt=themeSelect.querySelector('option[value="'+key+'"]');
    const button=controls.find(x=>x.dataset.theme===key);
    if(button&&opt){button.lastElementChild.textContent=opt.textContent.trim()||label;}
  }});
  refresh();
  // Make the reference orbit badges announce existing skill areas only.
  const art=document.querySelector('.hero-art');
  if(art){
    const skills=[['CRM & SQL','a'],['Linux tools','b'],['Systems','c']];
    for(const [name,pos] of skills){
      const chip=node('span','ws-orbit-chip',name);
      chip.dataset.pos=pos;chip.setAttribute('aria-hidden','true');
      const dot=node('i');chip.prepend(dot);art.append(chip);
    }
  }
  // Source-of-truth role and public section content are unchanged by runtime.
  const ticker=document.querySelector('main>.ticker');
  if(ticker){
    const row=node('div','ws-value-bar wrap');
    const lead=node('strong','','Building practical tools, better everyday experiences.');
    row.append(lead);
    for(const [heading,detail] of [
      ['Linux & desktop','Tools for everyday workflows'],
      ['CRM & support','Systems, data and service'],
      ['Creative technology','Design with useful outcomes']
    ]){
      const cell=node('span');
      const mark=node('b','',heading);
      cell.append(mark,document.createTextNode(detail));row.append(cell);
    }
    ticker.insertAdjacentElement('afterend',row);
  }
})();
