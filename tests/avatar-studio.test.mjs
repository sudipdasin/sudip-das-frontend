import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=name=>readFile(join(root,'examples/customer-demo',name),'utf8');
test('avatar studio includes two actual SVG vector presets',async()=>{
  const js=await read('studio-avatar.js');
  const svg=await read('studio-creative-avatar.svg');
  const old=await read('dev-das-portrait.svg');
  assert.match(svg,/<svg/);assert.doesNotMatch(svg,/<image\b|data:image\/|base64/i);
  assert.match(old,/<svg/);assert.doesNotMatch(old,/<image\b|data:image\/|base64/i);
  assert.match(js,/studio-creative-avatar\.svg/);
  assert.match(js,/dev-das-portrait\.svg/);
  assert.match(js,/data-theme/);
  assert.match(js,/editorial/);
});
test('user photo is browser-preview-only and export schema is unaltered',async()=>{
  const js=await read('studio-avatar.js'),app=await read('app.js'),html=await read('index.html');
  assert.match(js,/URL\.createObjectURL/);
  assert.match(js,/URL\.revokeObjectURL/);
  assert.match(js,/photoURL/);
  assert.match(js,/8 \* 1024 \* 1024/);
  assert.match(js,/image\/jpeg/);
  assert.match(js,/image\/png/);
  assert.match(js,/image\/webp/);
  assert.doesNotMatch(js, /fetch\s*\(|XMLHttpRequest|sendBeacon|FormData|indexedDB/i);
  assert.match(app,/const portrait='';/);
  assert.match(html,/studio-avatar\.js/);
  assert.match(html,/studio-avatar\.css/);
});

test('all six visual themes use distinct real SVG image files in auto mode',async()=>{
  const js=await read('studio-avatar.js');
  const names=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
  const svgContents=[];
  for(const name of names){
    assert.ok(js.includes(name+": './avatar-"+name+".svg'") || js.includes("'"+name+"': './avatar-"+name+".svg'"),'no theme-to-asset mapping for '+name);
    const svg=await read('avatar-'+name+'.svg');
    assert.match(svg,/<svg\b/);
    assert.doesNotMatch(svg,/<image\b|data:image\/|base64/i);
    svgContents.push(svg);
  }
  assert.equal(new Set(svgContents).size,6,'theme portraits must not be duplicates');
  assert.match(js,/chooseAuto\(\)/);
  assert.match(js,/attributeFilter:\['data-theme'\]/);
  assert.match(js,/src = next === 'photo'/);
});
test('WebStudio is the standalone demo, while LifeSphere is found only in About/Help',async()=>{
  const html=await read('index.html');
  assert.match(html,/WebStudio — Interactive Demo \| DevDas Development/);
  assert.match(html,/<strong>WebStudio<\/strong>/);
  assert.match(html,/id="ws-about-modal"/);
  assert.match(html,/WebStudio is part of the LifeSphere suite/);
  assert.match(html,/id="ws-suite-details"/);
  assert.doesNotMatch(html,/id="exposure-watch"|id="lifesphere"|ls-renewal-form/);
  assert.doesNotMatch(html,/studio-exposure\.js|studio-lifesphere-renewals\.js/);
});
