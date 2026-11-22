/* Personal portfolio: visitor-only presentation. No Studio, owner controls,
 * global mutations, profile editing or appearance import/export.
 * Owner changes are managed separately through trusted authenticated tooling.
 */
(() => {
  'use strict';
  if (document.body.dataset.wsParityReady === 'true') return;
  const themeSelect = document.getElementById('theme-select');
  if (!themeSelect) return;
  document.body.classList.add('ws-parity');
  document.body.dataset.wsParityReady = 'true';
  const node = (tag, cls, content) => {
    const el = document.createElement(tag);
    if (cls) el.className = cls;
    if (content !== undefined) el.textContent = content;
    return el;
  };
  const banner = node('div', 'ws-utility');
  banner.setAttribute('role', 'region');
  banner.setAttribute('aria-label', 'Personal portfolio information');
  banner.append(
    node('strong', '', 'SUDIP DAS / INTERACTIVE PORTFOLIO'),
    node('span', 'ws-utility-right', 'CURRENT PERSONAL PREVIEW · Private requests disabled')
  );
  document.querySelector('.topbar')?.before(banner);
  // Visitor Quick Actions: local theme choice and read-only section navigation ONLY.
  // No settings, uploads, exports, server writes, or owner management.
  const quick = node('div', 'ws-visitor-quick');
  const quickButton = node('button', 'ws-visitor-quick-toggle', '⌘ Quick actions');
  quickButton.type = 'button';
  quickButton.id = 'ws-visitor-quick-open';
  quickButton.setAttribute('aria-expanded', 'false');
  quickButton.setAttribute('aria-controls', 'ws-visitor-quick-panel');
  quickButton.setAttribute('aria-haspopup', 'true');
  const quickPanel = node('div', 'ws-visitor-quick-panel');
  quickPanel.id = 'ws-visitor-quick-panel';
  quickPanel.hidden = true;
  quickPanel.setAttribute('aria-label', 'Visitor quick navigation and themes');
  const quickTitle = node('strong', '', 'Explore this portfolio');
  quickPanel.append(quickTitle);
  const navActions = node('div', 'ws-visitor-quick-links');
  const sections = [
    ['Top', 'top'], ['About', 'about'], ['Projects', 'projects'],
    ['Experience', 'experience'], ['Strengths', 'capabilities'], ['Contact', 'contact']
  ];
  const closeQuick = (restoreFocus = false) => {
    quickPanel.hidden = true;
    quickButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) quickButton.focus();
  };
  for (const [label, id] of sections) {
    if (!document.getElementById(id)) continue;
    const link = node('a', '', label);
    link.href = '#' + id;
    link.addEventListener('click', () => closeQuick());
    navActions.append(link);
  }
  quickPanel.append(navActions, node('strong', 'ws-visitor-quick-title', 'Switch theme'));
  const themeActions = node('div', 'ws-visitor-quick-themes');
  for (const opt of themeSelect.options) {
    const choice = node('button', '', opt.textContent.trim());
    choice.type = 'button';
    choice.dataset.theme = opt.value;
    choice.addEventListener('click', () => {
      themeSelect.value = opt.value;
      themeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      closeQuick(true);
    });
    themeActions.append(choice);
  }
  quickPanel.append(themeActions);
  quick.append(quickButton, quickPanel);
  document.body.append(quick);
  quickButton.addEventListener('click', () => {
    quickPanel.hidden = !quickPanel.hidden;
    quickButton.setAttribute('aria-expanded', String(!quickPanel.hidden));
    if (!quickPanel.hidden) quickPanel.querySelector('a,button')?.focus();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !quickPanel.hidden) closeQuick(true);
  });
  document.addEventListener('click', event => {
    if (!quickPanel.hidden && !quick.contains(event.target)) closeQuick();
  });
  const art = document.querySelector('.hero-art');
  if (art) {
    for (const [name, position] of [['CRM & SQL', 'a'], ['Linux tools', 'b'], ['Systems', 'c']]) {
      const chip = node('span', 'ws-orbit-chip', name);
      chip.dataset.pos = position;
      chip.setAttribute('aria-hidden', 'true');
      chip.prepend(node('i'));
      art.append(chip);
    }
  }
  const ticker = document.querySelector('main>.ticker');
  if (ticker) {
    const row = node('div', 'ws-value-bar wrap');
    row.append(node('strong', '', 'Building practical tools, better everyday experiences.'));
    for (const [heading, detail] of [
      ['Linux & desktop', 'Tools for everyday workflows'],
      ['CRM & support', 'Systems, data and service'],
      ['Creative technology', 'Design with useful outcomes']
    ]) {
      const cell = node('span');
      cell.append(node('b', '', heading), document.createTextNode(detail));
      row.append(cell);
    }
    ticker.insertAdjacentElement('afterend', row);
  }
})();
