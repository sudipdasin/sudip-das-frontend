#!/usr/bin/env node
/**
 * Non-destructive domain transition audit.
 * Usage: node scripts/audit-domain.mjs [--live]
 * --live performs GET requests against public endpoints; no form submission.
 */
import { readFile } from 'node:fs/promises';

const canonical = 'https://sudipdas.is-a.dev';
const oldHost = 'sudip-das-portfolio.grittyonyx10.chatgpt.site';
const files = ['index.html', 'languages.js'];
const findings = [];
for (const file of files) {
  const content = await readFile(new URL('../' + file, import.meta.url), 'utf8');
  const matches = [...content.matchAll(new RegExp(oldHost.replaceAll('.', '\\.'), 'g'))];
  if (matches.length) findings.push({ severity:'WARN', check:'legacy-domain', file, count:matches.length, note:'Replace legacy links after the new domain serves the portfolio.' });
  if (file === 'index.html') {
    if (!/<link\s+[^>]*rel=["']canonical["']/i.test(content)) findings.push({ severity:'WARN',check:'canonical',file,note:'Canonical link missing; add when domain is verified.' });
    if (!/property=["']og:url["']/i.test(content)) findings.push({ severity:'WARN',check:'open-graph-url',file,note:'og:url missing; publish a consistent canonical URL.' });
    if (!/turnstile/i.test(content)) findings.push({ severity:'REVIEW',check:'turnstile',file,note:'No Turnstile reference found in HTML; verify contact challenge and backend validation separately.' });
    if (!/name=["']viewport["']/i.test(content)) findings.push({ severity:'FAIL',check:'viewport',file,note:'Mobile viewport missing.' });
  }
}
for (const file of ['robots.txt','sitemap.xml']) {
  try { await readFile(new URL('../' + file, import.meta.url), 'utf8'); }
  catch { findings.push({severity:'WARN',check:'seo-file',file,note:'File absent from repository.'}); }
}
if (process.argv.includes('--live')) {
  for (const site of [canonical, 'https://sudip-das-frontend.pages.dev']) {
    try {
      const response = await fetch(site, {signal:AbortSignal.timeout(12000),redirect:'follow'});
      const html = await response.text();
      const ok = response.ok && /<html\b/i.test(html);
      if (!ok) findings.push({severity:'FAIL',check:'live-homepage',site,status:response.status,note:'Expected successful HTML response.'});
      const hosts = [...html.matchAll(/https?:\/\/[^\s"'<>]+/g)].map(m => m[0]);
      if (hosts.some(url=>url.includes(oldHost))) findings.push({severity:'WARN',check:'live-legacy-urls',site,note:'Live HTML contains legacy host.'});
      console.log('LIVE',site,'status',response.status,'final',response.url,'HTML',ok);
    } catch (error) { findings.push({severity:'FAIL',check:'live-homepage',site,note:String(error)}); }
  }
}
console.log(JSON.stringify({auditedAt:new Date().toISOString(),canonical,findings},null,2));
if (findings.some(f=>f.severity==='FAIL')) process.exitCode = 1;
