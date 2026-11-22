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
