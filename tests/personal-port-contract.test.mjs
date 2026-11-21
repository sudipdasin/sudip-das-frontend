import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const contract=JSON.parse(await readFile(resolve(root,'contracts/personal-port-v1.json'),'utf8'));
test('upstream WebStudio contract is directional and never publishes personal content',()=>{
 assert.equal(contract.schemaVersion,1);
 assert.equal(contract.source.repository,'sudipdasin/sudip-das-frontend');
 assert.equal(contract.destination.repository,'sudipdasin/sudip-das-profile');
 assert.equal(contract.promotion.direction,'webstudio-to-personal-only');
 assert.equal(contract.promotion.requireHumanReview,true);
 assert.equal(contract.promotion.autoDeploy,false);
 assert.equal(contract.promotion.upstreamContractMustMatch,true);
 assert.equal(contract.promotion.requireBuildAndBrowserAcceptance,true);
 assert.equal(new Set(contract.themes).size,6);
 assert.equal(new Set(contract.languageCodes).size,10);
 assert.ok(contract.excludedFromPersonal.some(x=>/LifeSphere/i.test(x)));
 assert.ok(contract.protectedPersonal.some(x=>/Turnstile/i.test(x)));
});
test('every upstream feature maps to existing public demo asset and private-specific port target',async()=>{
 const known=new Set();
 for(const item of contract.features){
  assert.match(item.id,/^[a-z][a-z0-9-]+$/);
  assert.ok(!known.has(item.id),'duplicate feature id '+item.id);known.add(item.id);
  assert.ok(item.publicAssets.length>0&&item.personalAssets.length>0&&item.personalMarkers.length>0);
  for(const file of item.publicAssets){
   assert.match(file,/^[a-zA-Z0-9-]+\.(?:js|css|svg)$/);
   assert.ok((await stat(resolve(root,'examples/customer-demo',file))).size>100,file);
  }
  for(const file of item.personalAssets)assert.match(file,/^[a-zA-Z0-9-]+\.(?:js|css|svg)$/);
 }
 assert.deepEqual([...known].sort(),['appearance-local-only','portfolio-gallery','scene-artwork','six-themes','visitor-hub'].sort());
});
