import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const script=fileURLToPath(new URL('../scripts/verify-customer-demo.mjs',import.meta.url));
async function fixture(fn){
 const root=await mkdtemp(join(tmpdir(),'webstudio-artifact-'));
 try{
  await Promise.all([
   writeFile(join(root,'index.html'),'<html><body><script src="app.js"></script><a href="#top">Home</a></body></html>'),
   writeFile(join(root,'app.js'),'console.log("fictional demo");'),
   writeFile(join(root,'profile.json'),JSON.stringify({demo:true,schemaVersion:1,identity:{displayName:'Dev Das'}})),
   writeFile(join(root,'robots.txt'),'User-agent: *\nDisallow: /\n'),
   writeFile(join(root,'.nojekyll'),'')
  ]);
  await fn(root);
 }finally{await rm(root,{recursive:true,force:true});}
}
function verify(root){
 return spawnSync(process.execPath,[script,root],{encoding:'utf8'});
}
test('clean fictional preview gets deterministic SHA-256 inventory',()=>fixture(async root=>{
 const run=verify(root);
 assert.equal(run.status,0,run.stderr);
 const report=JSON.parse(run.stdout);
 assert.equal(report.status,'PASS');
 assert.equal(report.files,5);
 assert.ok(report.sha256Manifest.every(entry=>/^[a-f0-9]{64}$/.test(entry.sha256)));
 assert.equal(verify(root).stdout,run.stdout);
}));
test('broken referenced asset blocks public deployment',()=>fixture(async root=>{
 await writeFile(join(root,'index.html'),'<script src="missing.js"></script>');
 const run=verify(root);
 assert.notEqual(run.status,0);
 assert.match(run.stderr,/Missing referenced asset: missing\.js/);
}));
test('path traversal and unexpected private directory block deployment',()=>fixture(async root=>{
 await writeFile(join(root,'index.html'),'<img src="../private/photo.png">');
 await mkdir(join(root,'private'));
 await writeFile(join(root,'private','backup.json'),'{}');
 const run=verify(root);
 assert.notEqual(run.status,0);
 assert.match(run.stderr,/Unsafe asset path/);
 assert.match(run.stderr,/Nonpublic directory included/);
}));
test('credential-like secret blocks public deployment',()=>fixture(async root=>{
 await writeFile(join(root,'app.js'),'const leaked = "ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";');
 const run=verify(root);
 assert.notEqual(run.status,0);
 assert.match(run.stderr,/Possible GitHub access token/);
}));
test('unmarked customer profile cannot be published',()=>fixture(async root=>{
 await writeFile(join(root,'profile.json'),JSON.stringify({demo:false,schemaVersion:1,identity:{displayName:'Dev Das'}}));
 const run=verify(root);
 assert.notEqual(run.status,0);
 assert.match(run.stderr,/Demo profile marker/);
}));
