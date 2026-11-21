#!/usr/bin/env node
/**
 * Create a personalized, deployable STATIC DEMO from a locally exported
 * WebStudio JSON profile. It does NOT produce a licensed commercial CMS.
 *
 * node scripts/build-personalized-preview.mjs exported-profile.json [output-folder]
 */
import { readFile, writeFile, mkdir, rm, stat } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)), '..');
if (!process.argv[2]) throw Error('Usage: node scripts/build-personalized-preview.mjs <profile.json> [dist/output-folder]');
const source=resolve(process.argv[2]);
const target=resolve(process.argv[3] || join(root,'dist','personalized-preview'));
const allowedRoot=join(root,'dist')+'/';
if (!target.startsWith(allowedRoot) || target===join(root,'dist','customer-demo-preview') || target===join(root,'dist','webstudio-package-stage')) throw Error('Destination must be a separate folder inside dist/');
const info=await stat(source);
if (!info.isFile() || info.size>128*1024) throw Error('Profile must be a JSON file smaller than 128 KiB');
const raw=JSON.parse(await readFile(source,'utf8'));
const printable=(value,max)=>typeof value==='string' && value.length<=max && !!value.trim() && !/[\u0000-\u001F]/.test(value);
const https=(value)=>{try{const u=new URL(value);return u.protocol==='https:' && !u.username && !u.password && u.hostname.includes('.') && !['localhost','127.0.0.1','0.0.0.0'].includes(u.hostname) && !u.hostname.endsWith('.local');}catch{return false;}};
if (raw.schemaVersion!==1 || raw.demo!==true || !raw.identity || !raw.appearance || !raw.seo || !raw.contact || !Array.isArray(raw.skills) || !Array.isArray(raw.projects) || !Array.isArray(raw.social)) throw Error('Expected valid version 1 fictional WebStudio demo profile');
if (!printable(raw.identity.displayName,70) || !printable(raw.identity.role,110)) throw Error('Name/role required');
if (raw.skills.length>24 || raw.projects.length>24 || raw.social.length>16) throw Error('Too many profile entries');
if (!/^#[0-9a-f]{6}$/i.test(raw.appearance.accent) || !/^#[0-9a-f]{6}$/i.test(raw.appearance.background)) throw Error('Invalid palette');
for(const p of raw.projects) if(!p || !printable(p.name,110) || !printable(p.description,650) || (p.url && !https(p.url))) throw Error('Invalid project data');
for(const s of raw.social) if(!s || !printable(s.label,70) || !https(s.url)) throw Error('Invalid social link');
if(raw.contact.email && (typeof raw.contact.email!=='string'||raw.contact.email.length>180||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.contact.email))) throw Error('Invalid contact email');
if(JSON.stringify(raw).match(/(?:BEGIN PRIVATE KEY|MAIL_BRIDGE_SECRET|TURNSTILE_SECRET_KEY|VAULT_ADMIN_TOKEN)/i)) throw Error('Sensitive marker in input');
const build=spawnSync(process.execPath,[join(root,'scripts/build-customer-demo.mjs')], {cwd:root,encoding:'utf8',env:{...process.env,DEMO_OUTPUT_DIR:target}});
if(build.status!==0)throw Error('Isolated demo build failed: '+build.stderr);
await writeFile(join(target,'profile.json'),JSON.stringify(raw,null,2)+'\n');
await writeFile(join(target,'CUSTOMIZATION.txt'), [
  'Personalized WebStudio STATIC DEMO export',
  'Upload the contents of this folder to a static host.',
  'This is still a clearly marked fictional/demo website, not a production CMS.',
  'The editable sample profile was baked into profile.json.',
  'Existing localStorage edits in a browser may override the new default.',
  'Use a clean browser profile to see the newly built defaults.',
  'No payments, email delivery, cloud backup, automatic failover or accounts are included.',
  'Review licenses and remove demo labels only as part of a separately reviewed commercial product.',
  ''
].join('\n'));
console.log('Created personalized preview: '+target);
