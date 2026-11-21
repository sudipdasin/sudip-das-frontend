import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, writeFile, mkdir, rm } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const tmp=join(root,'dist','personalized-test');
const sample=join(root,'examples','customer-demo','profile.json');
function run(path){return spawnSync(process.execPath,['scripts/build-personalized-preview.mjs',path,tmp],{cwd:root,encoding:'utf8'});}
test('exported customer profile can be baked into isolated static preview',async()=>{
  const input=join(root,'dist','personalized-input.json');
  await mkdir(join(root,'dist'),{recursive:true});
  try{
    const profile=JSON.parse(await readFile(sample,'utf8'));
    profile.identity.displayName='Avery Demo';
    await writeFile(input,JSON.stringify(profile));
    const result=run(input);
    assert.equal(result.status,0,result.stderr);
    const output=JSON.parse(await readFile(join(tmp,'profile.json'),'utf8'));
    assert.equal(output.identity.displayName,'Avery Demo');
    assert.equal(output.demo,true);
    assert.match(await readFile(join(tmp,'CUSTOMIZATION.txt'),'utf8'),/not a production CMS/);
    await readFile(join(tmp,'index.html'));
  }finally{await rm(input,{force:true});await rm(tmp,{recursive:true,force:true});}
});
test('rejects invalid/unsafe external URLs before building',async()=>{
  const input=join(root,'dist','personalized-malicious.json');
  await mkdir(join(root,'dist'),{recursive:true});
  try{
    const profile=JSON.parse(await readFile(sample,'utf8'));
    profile.social=[{label:'Dangerous',url:'javascript:alert(1)'}];
    await writeFile(input,JSON.stringify(profile));
    const result=run(input);
    assert.notEqual(result.status,0);
    assert.match(result.stderr,/Invalid social link/);
  }finally{await rm(input,{force:true});await rm(tmp,{recursive:true,force:true});}
});
