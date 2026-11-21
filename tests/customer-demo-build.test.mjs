import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFile,readdir,rm} from 'node:fs/promises';
import {resolve,dirname,join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const output=join(root,'dist','test-demo-preview');
test('preview build contains only fictional sample assets',async()=>{
 try{
  const result=spawnSync(process.execPath,['scripts/build-customer-demo.mjs'],{cwd:root,env:{...process.env,DEMO_OUTPUT_DIR:output},encoding:'utf8'});
  assert.equal(result.status,0,result.stderr);
  assert.deepEqual((await readdir(output)).sort(),['.nojekyll','app.js','commerce.js','commerce.json','dev-das-portrait.svg','i18n-copy.json','i18n-dynamic.json','i18n-theme.json','i18n-product.json','i18n-profile.json','i18n-ui.json','illustrated-developer.svg','index.html','neon-horizon.svg','neon-reference-portrait.svg','design-two-reference-portrait.svg','premium.css','premium.js','profile.json','robots.txt','studio-email.js','studio-features.css','studio-features.js','studio-i18n.js','studio-layout-fixes.css','studio-new-themes.css','studio-ownership.js','studio-personalization.css','studio-polish.css','studio-product.css','studio-reference-layout.css','studio-orbit-fidelity.css','studio-design-one.css','studio-design-one-highlight-fixes.css','studio-dual-fidelity.css','studio-desktop-reference.css','studio-native-reference-geometry.css','studio-reference-portrait-placement.css','studio-utility-unified.css','studio-cosmic-orbit-fidelity.css','studio-social.css','studio-social.js','studio-avatar.css','studio-avatar.js','studio-creative-avatar.svg','avatar-orbit.svg','avatar-editorial.svg','avatar-terminal.svg','avatar-aurora-peak.svg','avatar-neon-studio.svg','avatar-design-2.svg','studio-theme-controls.css','studio-about.css','studio-about.js','studio-creative-lab.css','studio-creative-lab.js','studio-desktop-reference.js','cosmic-reference-wave.svg','aurora-reference-horizon.svg','studio-design-two.css','studio-design-two.js','studio-reference-layout.js','studio-system-menu.css','studio-system-menu.js','studio-tour.js','studio-visual-final.css'].sort());
  const data=JSON.parse(await readFile(join(output,'profile.json'),'utf8'));
  assert.equal(data.demo,true);
  assert.equal(data.identity.displayName,'Dev Das');
  assert.match(await readFile(join(output,'index.html'),'utf8'),/WebStudio — Interactive Demo/);
  assert.equal(await readFile(join(output,'robots.txt'),'utf8'),'User-agent: *\nDisallow: /\n');
 }finally{await rm(output,{recursive:true,force:true});}
});
test('preview does not include real portfolio portrait, source, or backend',async()=>{
 try{
  const run=spawnSync(process.execPath,['scripts/build-customer-demo.mjs'],{cwd:root,env:{...process.env,DEMO_OUTPUT_DIR:output},encoding:'utf8'});
  assert.equal(run.status,0,run.stderr);
  const names=await readdir(output);
  for(const forbidden of ['sudip-das-portrait.jpg','languages.js','data','workers','wrangler.toml','README.md'])assert.equal(names.includes(forbidden),false,forbidden);
 }finally{await rm(output,{recursive:true,force:true});}
});
