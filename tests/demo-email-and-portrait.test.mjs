import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const {validRecipient,createEmailDraft}=require('../examples/customer-demo/studio-email.js');
const valid={name:'Test Visitor',email:'visitor@gmail.com',service:'Website redesign',timeline:'Exploring options',brief:'Build an accessible fictional portfolio website.'};
test('unconfigured demo addresses cannot receive customer data',()=>{
 for(const email of ['','demo@example.com','nobody@example.org','person@example.net','user@localhost','test@test','x@y.invalid'])assert.equal(validRecipient(email),false,email);
 assert.throws(()=>createEmailDraft('demo@example.com',valid),/Configure a real receiving/);
});
test('mailto draft encodes safe enquiry, but never reports delivery',()=>{
 const uri=createEmailDraft('owner@gmail.com',valid);
 assert.match(uri,/^mailto:owner%40gmail.com\?/);
 const text=decodeURIComponent(uri);
 for(const field of Object.values(valid))assert.ok(text.includes(field),field);
 assert.ok(text.includes('Portfolio enquiry'));
 assert.doesNotMatch(text,/\.txt|attachment=/i);
});
test('refuse invalid sender and incomplete enquiry',()=>{
 assert.throws(()=>createEmailDraft('owner@gmail.com',{...valid,email:'a@b.invalid'}),/valid details/);
 assert.throws(()=>createEmailDraft('owner@gmail.com',{...valid,brief:'short'}),/valid details/);
 assert.throws(()=>createEmailDraft('owner@gmail.com',{...valid,brief:'X'.repeat(3001)}),/valid details/);
});
test('client-side form contains no server-side delivery claims or downloadable brief',async()=>{
 const html=await readFile(new URL('../examples/customer-demo/index.html',import.meta.url),'utf8');
 const code=await readFile(new URL('../examples/customer-demo/studio-features.js',import.meta.url),'utf8');
 assert.match(html,/id="proposal-submit">Send enquiry by email/);
 assert.doesNotMatch(html,/Download sample brief/);
 assert.doesNotMatch(code,/sample-project-brief\.txt|inquiryStatus\.textContent/);
 const js=await readFile(new URL('../examples/customer-demo/studio-email.js',import.meta.url),'utf8');
 assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|navigator\.sendBeacon/);
});
test('fictional Dev Das source never loads the real profile photo',async()=>{
 const html=await readFile(new URL('../examples/customer-demo/index.html',import.meta.url),'utf8');
 const app=await readFile(new URL('../examples/customer-demo/app.js',import.meta.url),'utf8');
 const portrait=await readFile(new URL('../examples/customer-demo/dev-das-portrait.svg',import.meta.url),'utf8');
 assert.match(html,/Dev Das/);
 assert.match(app,/dev-das-portrait\.svg/);
 assert.match(portrait,/fictional developer Dev Das/);
 assert.equal(portrait.includes('<image'),false);
 assert.equal(portrait.includes('data:image/'),false);
 assert.doesNotMatch(html+app,/sudip-das-portrait\.jpg/);
});
