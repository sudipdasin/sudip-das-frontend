import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL('../examples/customer-demo/'+path,import.meta.url),'utf8');
const profile=JSON.parse(await read('profile.json'));
test('demo profile is schema-versioned and explicitly fictional',()=>{
  assert.equal(profile.schemaVersion,1);
  assert.equal(profile.demo,true);
  assert.equal(profile.identity.displayName,'Dev Das');
  assert.match(profile.identity.location,/fictional|example/i);
});
test('demo identity is not the real portfolio identity',()=>{
  assert.notEqual(profile.identity.displayName,'Sudip Das');
  assert.equal(profile.contact.email,'demo@example.com');
});
test('all sample project links use a reserved example domain',()=>{
  assert.ok(profile.projects.length>=3);
  for (const project of profile.projects){
    assert.ok(project.name&&project.category&&project.description);
    const url=new URL(project.url);
    assert.equal(url.protocol,'https:');
    assert.equal(url.hostname,'example.com');
  }
});
test('social links are safe example-only endpoints',()=>{
  for(const social of profile.social){
    const url=new URL(social.url);
    assert.ok(['example.com','github.com'].includes(url.hostname));
    if(url.hostname==='github.com')assert.equal(url.pathname,'/example');
  }
});
test('demo does not contain secrets or working private endpoints',async()=>{
  const raw=await read('profile.json');
  assert.doesNotMatch(raw,/sudipdasin|sudipdas\.is-a\.dev|workers\.dev|VAULT_ADMIN_TOKEN|MAIL_BRIDGE_SECRET|PRIVATE_KEY|password|apiToken/i);
});
test('demo has its own independent page and JavaScript',async()=>{
  const html=await read('index.html');
  assert.match(html,/src="app\.js"/);
  assert.match(html,/FICTIONAL DEMO PROFILE/);
  assert.match(html,/<meta name="robots" content="noindex,nofollow"/);
  assert.match(html,/id="profile-form"/);
});
test('local customization never posts personal information to an API',async()=>{
  const js=await read('app.js');
  assert.match(js,/fetch\('\.\/profile\.json'/);
  assert.match(js,/JSON\.stringify\(profile/);
  assert.doesNotMatch(js,/\/api\/v1\/|VAULT_ADMIN_TOKEN|MAIL_BRIDGE_SECRET|fetch\([^)]*method\s*:\s*['"]POST/i);
});
test('demo renders editable text with textContent, not unsafe HTML injection',async()=>{
  const js=await read('app.js');
  assert.match(js,/textContent/);
  assert.doesNotMatch(js,/innerHTML\s*=/);
  assert.match(js,/validExampleUrl/);
});
test('appearance colors are defined explicitly',()=>{
  for(const color of [profile.appearance.accent,profile.appearance.background])
    assert.match(color,/^#[0-9a-fA-F]{6}$/);
});

test('GitHub Pages demo defaults to Neon Studio while preserving real controls',async()=>{
  const html=await read('index.html');
  const js=await read('studio-features.js');
  assert.match(html,/<body data-theme="neon-studio">/);
  assert.match(js,/setTheme\(storage\('studio-demo-layout-v1'\)\|\|'neon-studio'\)/);
  for(const id of ['backup-download','backup-import','system-customize','system-reset']){
    assert.match(html,new RegExp('id="'+id+'"'));
    assert.doesNotMatch(html,new RegExp('<button[^>]*disabled[^>]*id="'+id+'"'));
  }
  const planned=html.match(/<button type="button" disabled title="[^"]+">/g)||[];
  assert.equal(planned.length,8); // Six existing future actions plus Social Studio OAuth/publishing
  assert.match(html,/class="studio-planned-grid"/);
  assert.match(html,/Coming soon/);
  assert.match(html,/id="social-studio"/);
  assert.match(html,/Publish to social networks · Planned/);
});
