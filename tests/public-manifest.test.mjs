import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
test('public manifest is parseable and schema versioned',async()=>{
 const data=JSON.parse(await read('data/site.json'));
 assert.equal(data.schemaVersion,1);
 assert.ok(Array.isArray(data.projects) && data.projects.length>=1);
 assert.ok(Array.isArray(data.modules));
});
test('every curated project has complete public card data',async()=>{
 const {projects}=JSON.parse(await read('data/site.json'));
 for(const p of projects){
  for(const key of ['repo','name','type','stage','summary','analysis','url'])assert.equal(typeof p[key],'string',`${p.repo}.${key}`);
  assert.ok(Array.isArray(p.audiences) && p.audiences.length>0);
  const u=new URL(p.url);
  assert.equal(u.protocol,'https:');
  assert.equal(u.hostname,'github.com');
  assert.equal(u.pathname,`/sudipdasin/${p.repo}`);
 }
 assert.equal(new Set(projects.map(p=>p.repo)).size,projects.length);
});
test('all project-card translation labels are present',async()=>{
 const {uiLabels}=JSON.parse(await read('data/site.json'));
 for(const key of ['lensTitle','lensHint','all','release','build','stars','language','recent','statusSummary','noRelease','noBuild','statusUnavailable','caseHeading','caseIntro'])assert.ok(uiLabels.en[key],key);
});
test('public profile metadata has no private credentials',async()=>{
 const data=await read('data/site.json');
 assert.doesNotMatch(data,/VAULT_ADMIN_TOKEN|MAIL_BRIDGE_SECRET|TURNSTILE_SECRET|PRIVATE_KEY|BEGIN RSA PRIVATE/i);
});
test('HTML-referenced public data assets exist',async()=>{
 const html=await read('index.html');
 for(const path of ['data/site.json','data/site.xml']){
  assert.ok(html.includes(`href="${path}"`) || html.includes(`fetch('${path}'`),path);
  assert.equal(existsSync(new URL('../'+path,import.meta.url)),true,path);
 }
});
test('XML public project feed is syntactically present and complete',async()=>{
 const xml=await read('data/site.xml');
 assert.ok(xml.startsWith('<?xml version="1.0"'));
 assert.ok(xml.includes('<profile '));
 const {projects}=JSON.parse(await read('data/site.json'));
 for(const p of projects)assert.ok(xml.includes(p.url),p.repo);
});
