import { createServer } from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,join,extname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';

const root=resolve(fileURLToPath(new URL('..',import.meta.url)));
const output=join(root,'dist','customer-demo-preview');
const result=spawnSync(process.execPath,['scripts/build-customer-demo.mjs'],{cwd:root,encoding:'utf8'});
assert.equal(result.status,0,result.stderr);
const mime={'.html':'text/html;charset=utf-8','.js':'application/javascript;charset=utf-8','.json':'application/json;charset=utf-8','.txt':'text/plain'};
const server=createServer(async (request,response)=>{
 try {
  const path=decodeURIComponent(new URL(request.url,'http://localhost').pathname);
  if(!['/','/index.html','/app.js','/profile.json','/robots.txt'].includes(path)){response.writeHead(404);response.end('Not found');return;}
  const file=join(output,path==='/'?'index.html':path.slice(1));
  const bytes=await readFile(file);
  response.writeHead(200,{'content-type':mime[extname(file)]||'text/plain'});response.end(bytes);
 }catch{response.writeHead(500);response.end('Failed');}
});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
const url='http://127.0.0.1:'+server.address().port+'/';
const browser=await chromium.launch({headless:true});
let passed=0;
const check=(name,fn)=>async()=>{await fn();passed++;console.log('PASS '+name);};
try {
 const page=await browser.newPage({acceptDownloads:true});
 await check('fictional customer profile loads',async()=>{
  await page.goto(url);
  await page.locator('#name').waitFor({state:'visible'});
  assert.equal(await page.locator('#name').innerText(),'Avery Example');
  assert.equal(await page.locator('#projects article').count(),3);
 })();
 await check('editing and saving fields works',async()=>{
  await page.getByRole('button',{name:'Customize demo'}).click();
  await page.locator('input[name="displayName"]').fill('Taylor Demo');
  await page.locator('input[name="role"]').fill('Design Engineer');
  await page.getByRole('button',{name:'Save & preview'}).click();
  assert.equal(await page.locator('#name').innerText(),'Taylor Demo');
  assert.equal(await page.locator('#role').innerText(),'Design Engineer');
 })();
 await check('project creation editing and removal work',async()=>{
  await page.getByRole('button',{name:'Add project'}).click();
  assert.equal(await page.locator('#projects article').count(),4);
  await page.locator('[data-project-index="3"] input[data-property="name"]').fill('New Example App');
  await page.getByRole('button',{name:'Save & preview'}).click();
  assert.equal(await page.locator('#projects h3').last().innerText(),'New Example App');
  await page.locator('[data-remove-project="3"]').click();
  assert.equal(await page.locator('#projects article').count(),3);
 })();
 await check('new social links work',async()=>{
  await page.getByRole('button',{name:'Add social link'}).click();
  await page.locator('[data-social-index="2"] input[data-property="label"]').fill('Docs');
  await page.getByRole('button',{name:'Save & preview'}).click();
  assert.equal(await page.locator('#social a').count(),3);
 })();
 await check('invalid URL is rejected',async()=>{
  await page.locator('[data-social-index="2"] input[data-property="url"]').fill('javascript:alert(1)');
  await page.getByRole('button',{name:'Save & preview'}).click();
  assert.match(await page.locator('#editor-status').innerText(),/correct|HTTPS/);
  await page.locator('[data-social-index="2"] input[data-property="url"]').fill('https://example.com');
  await page.getByRole('button',{name:'Save & preview'}).click();
 })();
 await check('export creates a JSON download',async()=>{
  const downloadPromise=page.waitForEvent('download');
  await page.getByRole('button',{name:'Export profile JSON'}).click();
  const download=await downloadPromise;
  assert.equal(download.suggestedFilename(),'customer-demo-profile.json');
  const fs=await import('node:fs/promises');
  const path=await download.path();
  const object=JSON.parse(await fs.readFile(path,'utf8'));
  assert.equal(object.identity.displayName,'Taylor Demo');
 })();
 await check('saved changes survive browser reload',async()=>{
  await page.reload();
  assert.equal(await page.locator('#name').innerText(),'Taylor Demo');
 })();
 await check('import and reset work',async()=>{
  await page.getByRole('button',{name:'Customize demo'}).click();
  const input=page.locator('#import-profile');
  const saved=JSON.parse(await readFile(join(output,'profile.json'),'utf8'));
  saved.identity.displayName='Imported Example';
  await input.setInputFiles({name:'profile.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(saved))});
  await page.waitForFunction(() => document.querySelector('#name')?.textContent === 'Imported Example');
  assert.equal(await page.locator('#name').innerText(),'Imported Example');
  await page.getByRole('button',{name:'Reset demo'}).click();
  assert.equal(await page.locator('#name').innerText(),'Avery Example');
 })();
 await page.close();
}finally{
 await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
assert.equal(passed,8);
console.log('Browser checks passed: '+passed);
