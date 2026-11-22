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
  // Keep Quick Actions within the responsive header flow, not floating over
  // project cards or the four WebStudio Cosmic information tiles.
  const nav = document.querySelector('.topbar .nav');
  if (nav) nav.insertBefore(quick, nav.querySelector('.language-control'));
  else document.body.append(quick);
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
  // Theme-specific orbit treatments follow WebStudio's actual reference
  // compositions. Labels refer ONLY to existing approved portfolio skill areas.
  // Aurora Studio: five compact role badges; Cosmic: four circular satellites;
  // remaining four themes: three restrained labels. No fictional/demo content.
  const art = document.querySelector('.hero-art');
  if (art) {
    const skills = [
      ['CRM & SQL', 'a', '◈'],
      ['Linux tools', 'b', '⌘'],
      ['Systems', 'c', '▣'],
      ['Creative technology', 'd', '✦'],
      ['Technical support', 'e', '◎']
    ];
    const updateOrbitBadges = () => {
      art.querySelectorAll('.ws-orbit-chip').forEach(chip => chip.remove());
      const theme = document.body.dataset.theme || themeSelect.value;
      const isCosmic = theme === 'design-2';
      const list = theme === 'neon-studio' ? skills : isCosmic ? skills.slice(0, 4) : skills.slice(0, 3);
      for (const [name, position, glyph] of list) {
        const isAuroraReference = theme === 'neon-studio';
        const chip = node('span', 'ws-orbit-chip', isCosmic ? glyph : isAuroraReference ? undefined : name);
        chip.dataset.pos = position;
        chip.setAttribute('aria-label', name);
        chip.setAttribute('aria-hidden', 'true');
        if (isAuroraReference) {
          chip.append(node('span', 'ws-orbit-glyph', glyph), node('span', 'ws-orbit-label', name));
        } else if (!isCosmic) {
          chip.prepend(node('i'));
        }
        art.append(chip);
      }
    };
    themeSelect.addEventListener('change', updateOrbitBadges);
    updateOrbitBadges();
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

    // WebStudio Aurora composition: a 1+4 information band, six compact
    // feature tiles and a three-action strip. Reuse only PUBLIC, already
    // approved site themes/skills/navigation; no fictional demo claims,
    // private details, owner settings, requests or publishing actions.
    const aurora = node('section', 'ws-aurora-reference');
    aurora.id = 'ws-aurora-reference';
    aurora.setAttribute('aria-label', 'Portfolio skills and quick navigation');
    const inner = node('div', 'ws-aurora-reference-inner wrap');
    const band = node('div', 'ws-aurora-info-band');
    const bandIntro = node('div', 'ws-aurora-band-intro');
    bandIntro.append(node('span', 'ws-aurora-infinity', '∞'));
    const bandCopy = node('div', 'ws-aurora-band-copy');
    bandCopy.append(
      node('strong', '', 'Building practical tools, better everyday experiences.'),
      node('small', '', 'Technology, systems, open source and creative work.')
    );
    bandIntro.append(bandCopy);
    band.append(bandIntro);
    const details = node('div', 'ws-aurora-band-details');
    for (const [icon, label] of [
      ['⌘', 'Linux & desktop'], ['◎', 'Systems & CRM'],
      ['◇', 'Technical support'], ['✦', 'Creative technology']
    ]) {
      const detail = node('span', 'ws-aurora-mini-detail');
      detail.append(node('span', 'ws-aurora-mini-icon', icon), node('span', '', label));
      details.append(detail);
    }
    band.append(details);
    inner.append(band);

    const featureGrid = node('nav', 'ws-aurora-feature-grid');
    featureGrid.setAttribute('aria-label', 'Portfolio areas');
    const sixSkills = [...ticker.querySelectorAll('.ticker-in > span')].slice(0, 6);
    const featureIcons = ['⬡', '◇', '≋', '◎', '⇄', '▦'];
    const featureLinks = ['#projects', '#capabilities', '#experience', '#experience', '#capabilities', '#projects'];
    sixSkills.forEach((skill, index) => {
      const link = node('a', 'ws-aurora-feature');
      link.href = featureLinks[index];
      const label = skill.textContent.replace(/[✳✱*]/g, '').trim();
      link.append(node('span', 'ws-aurora-feature-icon', featureIcons[index]));
      const copy = node('span', 'ws-aurora-feature-copy');
      copy.append(node('strong', '', label), node('small', '', index < 2 ? 'Explore practical work' : 'View experience'));
      link.append(copy);
      featureGrid.append(link);
    });
    inner.append(featureGrid);

    const cta = node('div', 'ws-aurora-cta');
    const ctaCopy = node('div', 'ws-aurora-cta-copy');
    ctaCopy.append(
      node('strong', '', 'Explore selected projects and experience.'),
      node('small', '', 'Practical software, systems, service and creative technology.')
    );
    cta.append(ctaCopy);
    const ctaActions = node('div', 'ws-aurora-cta-actions');
    for (const [label, href, primary] of [
      ['Explore my work', '#projects', true],
      ['Experience', '#experience', false],
      ['Get in touch', '#contact', false]
    ]) {
      const link = node('a', primary ? 'ws-aurora-cta-primary' : '', label);
      link.href = href;
      ctaActions.append(link);
    }
    cta.append(ctaActions);
    inner.append(cta);
    aurora.append(inner);
    ticker.before(aurora);
  }
})();
