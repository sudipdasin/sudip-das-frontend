/* Public-only GitHub repository discovery, also testable in Node via VM. */
(function (root) {
  'use strict';
  const OWNER = 'sudipdasin';
  const MAX_PAGES = 4;
  const PAGE_SIZE = 100;
  const safeRepoName = /^[A-Za-z0-9_.-]{1,100}$/;
  function isPublicRepo(repo, owner = OWNER) {
    return !!repo && repo.owner?.login?.toLowerCase() === owner.toLowerCase()
      && repo.private === false && repo.fork !== true && repo.archived !== true
      && repo.disabled !== true && safeRepoName.test(repo.name || '');
  }
  function normalizeRepo(repo, owner = OWNER) {
    if (!isPublicRepo(repo, owner)) return null;
    return {
      name: repo.name, owner:{login:owner},
      language: typeof repo.language === 'string' ? repo.language.slice(0, 80) : null,
      stargazers_count: Number.isFinite(repo.stargazers_count) ? Math.max(0, repo.stargazers_count) : 0,
      pushed_at: typeof repo.pushed_at === 'string' && !Number.isNaN(Date.parse(repo.pushed_at)) ? repo.pushed_at : null,
      default_branch: typeof repo.default_branch === 'string' && /^[\w./-]{1,200}$/.test(repo.default_branch) ? repo.default_branch : 'main',
      description: typeof repo.description === 'string' ? repo.description.slice(0, 450) : '',
      private: false, fork: false, archived: false
    };
  }
  async function discoverRepositories(fetcher, owner = OWNER, maxPages = MAX_PAGES) {
    if (typeof fetcher !== 'function') throw new TypeError('A fetch function is required');
    if (!/^[a-z0-9-]{1,39}$/i.test(owner)) throw new TypeError('Invalid account name');
    const collected = new Map();
    for (let page = 1; page <= Math.min(MAX_PAGES, maxPages); page++) {
      const url = 'https://api.github.com/users/' + encodeURIComponent(owner) + '/repos?type=owner&per_page=' + PAGE_SIZE + '&sort=updated&page=' + page;
      const res = await fetcher(url, {headers: {Accept:'application/vnd.github+json'}});
      if (!res.ok) throw new Error('GitHub repository listing failed: ' + res.status);
      const rows = await res.json();
      if (!Array.isArray(rows)) throw new TypeError('Invalid repository listing');
      for (const item of rows) {
        const clean = normalizeRepo(item, owner);
        if (clean) collected.set(clean.name.toLowerCase(), clean);
      }
      if (rows.length < PAGE_SIZE) break;
    }
    return [...collected.values()];
  }
  function mergeProjects(curated, discovered, owner = OWNER) {
    const list = Array.isArray(curated) ? [...curated] : [];
    const known = new Set(list.map(x => String(x.repo || '').toLowerCase()));
    const additional = (Array.isArray(discovered) ? discovered : [])
      .filter(x => isPublicRepo(x, owner) && !known.has(x.name.toLowerCase()))
      .sort((a,b) => (b.pushed_at || '').localeCompare(a.pushed_at || '') || a.name.localeCompare(b.name));
    for (const repo of additional) {
      known.add(repo.name.toLowerCase());
      const summary = (typeof repo.description === 'string' && repo.description.trim())
        ? repo.description.trim().slice(0, 280) : 'Public GitHub repository; open the source for details.';
      list.push({
        repo:repo.name, name:repo.name, type:'Public repository',
        stage:'Repository available', summary,
        analysis:'Automatically discovered from the public GitHub repository listing; not yet editorially reviewed.',
        audiences:['community'], url:'https://github.com/' + owner + '/' + repo.name
      });
    }
    return list;
  }
  const api = Object.freeze({isPublicRepo, normalizeRepo, discoverRepositories, mergeProjects});
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (root) root.PublicRepoDiscovery = api;
})(typeof window !== 'undefined' ? window : undefined);
