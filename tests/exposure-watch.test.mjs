import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=file=>readFile(join(root,'examples/customer-demo',file),'utf8');

test('Exposure Watch explicitly distinguishes manual reports from verified breach monitoring',async()=>{
  const [html,js]=await Promise.all([source('index.html'),source('studio-exposure.js')]);
  assert.doesNotMatch(html,/id="exposure-watch"|studio-exposure\\.js/);
  assert.match(html,/LifeSphere suite/);
  assert.match(js,/Self-reported/);
  assert.match(js,/No incidents recorded/);
  assert.match(js,/localStorage/);
  assert.doesNotMatch(js,/fetch\s*\(|XMLHttpRequest|sendBeacon|FormData/);
  assert.doesNotMatch(js,/innerHTML\s*=/);
  // Exposure Watch must not collect account passwords. Owner-only archive
  // encryption has a separate password field and is intentionally allowed.
  assert.doesNotMatch(js,/\b(?:type\s*=\s*['"]password['"]|createElement\(['"]input['"]\))/i);
  assert.doesNotMatch(html,/<input(?=[^>]*\bid="exposure-[^"]+")[^>]*\btype="password"/i);
});
test('Exposure Watch includes safe local incident controls and remediation',async()=>{
  const js=await source('studio-exposure.js');
  for(const category of ['account','identity','financial','phishing'])
    assert.match(js,new RegExp(category+':'));
  for(const label of ['reported','investigating','resolved'])
    assert.ok(js.includes(label));
  assert.match(js,/incidents\.length>=MAX/);
  assert.match(js,/crypto\.randomUUID/);
  assert.match(js,/Remove|Delete record/);
  assert.match(js,/Change the affected password directly on the service/);
});
