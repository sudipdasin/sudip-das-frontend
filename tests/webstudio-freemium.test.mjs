import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const starter=require('../examples/customer-demo/webstudio-starter.js');
const base=JSON.parse(await readFile(new URL('../examples/customer-demo/profile.json',import.meta.url),'utf8'));
test('only three first themes are authorized for Free manual site export',()=>{
 assert.deepEqual(Object.keys(starter.THEMES),['orbit','editorial','terminal']);
 for(const theme of ['orbit','editorial','terminal'])assert.equal(starter.validate(base,theme),true);
 for(const theme of ['aurora-peak','neon-studio','design-2'])assert.throws(()=>starter.build(base,theme),/only Orbit, Editorial and Terminal/i);
});
test('build creates stand-alone website, separate modular CSS, JSON and instructions',()=>{
 for(const theme of Object.keys(starter.THEMES)){
  const files=starter.build(base,theme);
  assert.deepEqual(Object.keys(files).sort(),['index.html','assets/base.css','themes/'+theme+'.css','data/profile.json','config/modules.json','README.txt'].sort());
  assert.match(files['index.html'],/<!doctype html>/i);
  assert.match(files['index.html'],/<main>/i);
  assert.match(files['index.html'],/Project Atlas/);
  assert.match(files['index.html'],new RegExp('themes/'+theme+'.css'));
  assert.match(files['assets/base.css'],/prefers-reduced-motion/);
  assert.match(files['README.txt'],/manual|manually/i);
  assert.equal(JSON.parse(files['config/modules.json']).theme,theme);
  assert.equal(JSON.parse(files['data/profile.json']).identity.displayName,'Dev Das');
 }
});
test('site output escapes HTML injection and blocks dangerous project URLs',()=>{
 const p=structuredClone(base);
 p.identity.displayName='<svg onload=alert(1)>';
 p.projects[0].name='<img src=x onerror=alert(1)>';
 const files=starter.build(p,'orbit');
 assert.ok(files['index.html'].includes('&lt;svg onload=alert(1)&gt;'));
 assert.ok(!files['index.html'].includes('<svg onload=alert(1)>'));
 assert.ok(!files['index.html'].includes('<img src=x onerror=alert(1)>'));
 p.projects[0].url='javascript:alert(1)';
 assert.throws(()=>starter.build(p,'orbit'),/HTTPS link/i);
});
test('Free ZIP is valid stored-entry archive with all manual website files',async()=>{
 const zip=Buffer.from(await starter.zip(starter.build(base,'editorial')).arrayBuffer());
 assert.equal(zip.readUInt32LE(0),0x04034b50);
 const names=[];let pos=0;
 while(pos+30<=zip.length&&zip.readUInt32LE(pos)===0x04034b50){
  const size=zip.readUInt32LE(pos+18),len=zip.readUInt16LE(pos+26);
  names.push(zip.subarray(pos+30,pos+30+len).toString());
  pos+=30+len+size;
 }
 assert.equal(names.length,6);
 assert.ok(names.includes('site/index.html'));
 assert.ok(names.includes('site/themes/editorial.css'));
 assert.ok(names.includes('site/data/profile.json'));
 assert.equal(zip.subarray(-22).readUInt32LE(0),0x06054b50);
});
test('edition manifest keeps premium additions future-only and account verification honest',async()=>{
 const edition=JSON.parse(await readFile(new URL('../examples/customer-demo/webstudio-editions.json',import.meta.url),'utf8'));
 assert.deepEqual(edition.freeThemeIds,['orbit','editorial','terminal']);
 assert.equal(edition.premiumThemeIds.length,3);
 assert.equal(edition.security.emailVerifiedByBackend,false);
 assert.equal(edition.security.encryptedPrivateServerCodeInClient,false);
 assert.equal(edition.feedback.requiredBeforeExport,true);
 assert.equal(edition.feedback.requiresPreviewApproval,true);
});

test('interactive site builder is implemented separately from legacy static fallback',async()=>{
 const source=await readFile(new URL('../examples/customer-demo/webstudio-starter.js',import.meta.url),'utf8');
 assert.equal(typeof starter.buildInteractive,'function');
 assert.ok(source.includes('webstudio-runtime-manifest.json'));
 assert.ok(source.includes('webstudio-free-runtime.json'));
 assert.ok(source.includes('profile.json'));
});
