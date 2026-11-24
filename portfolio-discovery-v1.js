/* Portfolio discovery enhancement v3.13.0 — no external dependencies. */
(() => {
  'use strict';
  const section = document.getElementById('projects');
  const grid = section?.querySelector('.project-grid');
  if (!grid || section.querySelector('[data-project-discovery]')) return;
  const cards = [...grid.querySelectorAll('article.project')];
  if (cards.length < 2) return;
  const panel = document.createElement('div');
  panel.className = 'project-discovery';
  panel.dataset.projectDiscovery = '';
  panel.setAttribute('role', 'search');
  panel.setAttribute('aria-label', 'Explore projects');
  const label = document.createElement('label');
  label.htmlFor = 'portfolio-project-search';
  label.textContent = 'Find a project';
  const input = document.createElement('input');
  input.id = 'portfolio-project-search';
  input.type = 'search';
  input.autocomplete = 'off';
  input.placeholder = 'Search by project, skill or technology';
  input.setAttribute('aria-controls', 'portfolio-project-grid');
  const select = document.createElement('select');
  select.setAttribute('aria-label', 'Filter projects by focus');
  const options = [{ value: 'all', label: 'All disciplines' }, { value: 'linux', label: 'Linux & desktop' }, { value: 'ai', label: 'AI & media' }, { value: 'web', label: 'Web & apps' }];
  options.forEach(({value,label}) => { const option=document.createElement('option');option.value=value;option.textContent=label;select.append(option); });
  const reset = document.createElement('button');
  reset.type = 'button'; reset.textContent = 'Clear filters'; reset.className = 'project-filter-reset';
  const status = document.createElement('p'); status.className = 'project-discovery-status';
  status.setAttribute('role','status'); status.setAttribute('aria-live','polite');
  panel.append(label,input,select,reset,status);
  grid.id = 'portfolio-project-grid';
  grid.before(panel);
  const normalize = text => text.normalize('NFKD').toLocaleLowerCase().replace(/[\\u0300-\\u036f]/g,'').trim();
  function update() {
    const query = normalize(input.value);
    let shown = 0;
    cards.forEach(card => {
      const content=normalize(card.textContent || '');
      const type=normalize(card.querySelector('.project-type')?.textContent || '');
      const focus=select.value;
      const matchesFocus=focus==='all' ||
        (focus==='linux' && /linux|desktop|system|shell/.test(type+' '+content)) ||
        (focus==='ai' && /ai|video|media|animation|image|model/.test(type+' '+content)) ||
        (focus==='web' && /web|site|portfolio|app|cloud|studio/.test(type+' '+content));
      const matchesQuery=!query || query.split(/\\s+/).every(term=>content.includes(term));
      const visible=matchesFocus && matchesQuery;
      card.hidden=!visible;
      if(visible) shown++;
    });
    status.textContent = shown === 0 ? 'No matching projects. Try a different search.' : `${shown} of ${cards.length} projects shown`;
    reset.disabled=!input.value && select.value==='all';
  }
  input.addEventListener('input', update);
  select.addEventListener('change', update);
  reset.addEventListener('click',()=>{ input.value='';select.value='all';update();input.focus(); });
  update();
})();
