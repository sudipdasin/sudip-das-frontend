import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const root=new URL('../migration/',import.meta.url);
const read=async name=>readFile(new URL(name,root),'utf8');

test('private repository bootstrap and public cutover scripts parse as Bash',async()=>{
 for(const name of ['bootstrap-private-source.sh','stage-public-cutover.sh']){
  const script=new URL(name,root);
  const check=spawnSync('bash',['-n',script.pathname],{encoding:'utf8'});
  assert.equal(check.status,0,name+': '+check.stderr);
 }
});
test('migration never makes the GitHub Free Pages repository private or force-pushes history',async()=>{
 const bootstrap=await read('bootstrap-private-source.sh');
 const cutover=await read('stage-public-cutover.sh');
 assert.match(bootstrap,/gh repo create "\$PRIVATE" --private/);
 assert.match(bootstrap,/VISIBILITY" == PRIVATE/);
 assert.match(bootstrap,/BRANCHES" == 0/);
 assert.match(bootstrap,/git clone --mirror/);
 assert.match(cutover,/git -C "\$ROOT" push origin "\$BACKUP"/);
 assert.match(cutover,/gh pr create/);
 assert.doesNotMatch(bootstrap+'\n'+cutover,/git\s+push\s+[^\n]*--force|git\s+push\s+[^\n]*-f\b|gh\s+repo\s+edit\s+[^\n]*--visibility/);
});
test('source publisher is disabled by default and commits only public-pages files',async()=>{
 const workflow=await read('private-release-to-public.yml');
 assert.match(workflow,/WEBSTUDIO_AUTO_PUBLISH == 'true'/);
 assert.match(workflow,/workflow_dispatch:/);
 assert.match(workflow,/node --test tests\/\*\.test\.mjs/);
 assert.match(workflow,/node browser-tests\/customer-demo\.mjs/);
 assert.match(workflow,/node scripts\/verify-customer-demo\.mjs/);
 assert.match(workflow,/secrets\.PUBLIC_DEPLOY_TOKEN/);
 assert.match(workflow,/public-pages\/\*/);
 assert.match(workflow,/Forbidden public change/);
 assert.doesNotMatch(workflow,/--force/);
});
test('public-only cutover preserves Cloudflare root and GitHub Pages path',async()=>{
 const [deploy,validate,cutover,readme]=await Promise.all([
  read('public-pages-deploy.yml'),read('public-validate.yml'),read('stage-public-cutover.sh'),read('public-README.md')
 ]);
 assert.match(deploy,/path: public-pages/);
 assert.match(deploy,/actions\/deploy-pages@v4/);
 assert.match(validate,/sudip-das-portrait\.jpg/);
 assert.match(validate,/test -s public-pages\/index\.html/);
 assert.match(cutover,/git -C "\$ROOT" diff --quiet HEAD -- "\$file"/);
 assert.match(readme,/sudipdasin\.github\.io\/sudip-das-frontend/);
 assert.match(readme,/sudipdas\.is-a\.dev/);
 assert.match(readme,/sudip-das-frontend\.pages\.dev/);
});
