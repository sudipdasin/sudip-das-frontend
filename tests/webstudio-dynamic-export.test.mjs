import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFile} from 'node:fs/promises';

const code=await readFile(new URL('../examples/customer-demo/webstudio-starter.js',import.meta.url),'utf8');
const sample=JSON.parse(await readFile(new URL('../examples/customer-demo/profile.json',import.meta.url),'utf8'));
function makeRuntime(){
 const files={};
 for(let i=0;i<41;i++)files['asset-'+i+'.css']='/* asset '+i+' */';
 files['index.html']='<!doctype html><html><head></head><body><h1 id="name"></h1><script src="app.js" defer></script></body></html>';
 files['app.js']='window.originalDynamicApp = true;';
 files['studio-features.js']='window.interactiveProjectSearch = true;';
 files['profile.json']=JSON.stringify(sample);
 const manifest={schemaVersion:1,files:Object.keys(files)};
 const data={...files,'webstudio-runtime-manifest.json':JSON.stringify(manifest)};
 const window={location:{href:'https://example.test/demo/',origin:'https://example.test'}};
 const context={window,fetch:async url=>{
  const name=new URL(url).pathname.split('/').at(-1);
  return Object.hasOwn(data,name)?{ok:true,text:async()=>data[name]}:{ok:false,status:404};
 },URL,TextEncoder,Blob,structuredClone,console,document:{}};
 vm.runInNewContext(code,context);
 return {api:window.WebStudioStarter,files};
}
test('same-runtime packaging retains every JS/CSS file and custom profile for all three themes',async()=>{
 const {api,files}=makeRuntime();
 const custom=structuredClone(sample);
 custom.identity.displayName='Personal User';
 for(const theme of ['orbit','editorial','terminal']){
  const generated=await api.buildInteractive(custom,theme,'https://example.test/demo/');
  for(const name of Object.keys(files))
   assert.ok(Object.hasOwn(generated,name),'Missing original runtime file '+name);
  assert.equal(generated['app.js'],files['app.js']);
  assert.equal(generated['studio-features.js'],files['studio-features.js']);
  assert.equal(JSON.parse(generated['profile.json']).identity.displayName,'Personal User');
  assert.match(generated['index.html'],/webstudio-free-runtime\.js/);
  assert.match(generated['webstudio-free-runtime.js'],new RegExp('current=\\\''+theme+'\\\''));
  const archive=Buffer.from(await api.zip(generated).arrayBuffer());
  assert.equal(archive.readUInt32LE(0),0x04034b50);
  assert.equal(archive.readUInt32LE(archive.length-22),0x06054b50);
 }
});
test('interactive export rejects premium themes and unavailable source modules',async()=>{
 const {api}=makeRuntime();
 await assert.rejects(()=>api.buildInteractive(sample,'design-2','https://example.test/demo/'),/Only Orbit, Editorial and Terminal/);
});
test('feedback is required and cannot be acknowledged merely by opening mail client',async()=>{
 const code=await readFile(new URL('../examples/customer-demo/webstudio-freemium.js',import.meta.url),'utf8');
 assert.match(code,/Feedback service failed/);
 assert.match(code,/receiptId/);
 assert.match(code,/ZIP remains locked/);
 assert.doesNotMatch(code,/attestButton|manually-attested-email/);
});
