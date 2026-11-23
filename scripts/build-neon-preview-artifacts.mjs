/**
 * Construct a narrow, auditable public-only Pages upload. Avoid accidentally
 * publishing .git, .github, source tests, logs, or private development files.
 * This build is for preview-personalweb ONLY, not main/production.
 */
import {readdir, stat, copyFile, mkdir, readFile, cp} from 'node:fs/promises';
import {resolve,join,extname} from 'node:path';
import assert from 'node:assert/strict';
const cwd=process.cwd();
const out=resolve(cwd,'.pages-neon-preview');
const filename=(await readdir(cwd,{withFileTypes:true}))
  .filter(x=>x.isFile()&&
    (['.html','.css','.js','.svg','.jpg','.jpeg','.png','.webp','.ico','.txt','.json'].includes(extname(x.name))||
    x.name==='_headers'))
  .map(x=>x.name);
for(const file of filename){
  if(file.startsWith('.'))throw Error('Unexpected hidden file in public staging');
  await mkdir(out,{recursive:true});
  await copyFile(join(cwd,file),join(out,file));
}
for(const sub of ['media','data','functions']){
  const source=join(cwd,sub);
  await cp(source,join(out,sub),{recursive:true,force:true});
}
const index=await readFile(join(out,'index.html'),'utf8');
assert.match(index,/neon-studio-reference-lock-v1\.css\?v=1\.2\.0/);
assert.match(index,/webstudio-parity\.js\?v=neon-1\.2\.0/);
assert.match(index,/window\.PUBLIC_API_BASE="";window\.PORTFOLIO_PREVIEW_MODE=true/);
const release=JSON.parse(await readFile(join(out,'site-release.json'),'utf8'));
assert.equal(release.stage,'preview');
assert.equal(release.preview.productionApiConnected,false);
assert.equal(release.preview.privateRequestsEnabled,false);
const contents=await readdir(out);
assert.ok(contents.includes('index.html'));
assert.ok(!contents.includes('.github')&&!contents.includes('scripts'));
console.log(JSON.stringify({result:'PASS_PUBLIC_STAGING',out,rootFiles:filename.length,
    dirs:['media','data','functions'],preview:true,prodPromotion:false},null,2));
