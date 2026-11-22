import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../services/webstudio-feedback/worker.mjs';
const env={ALLOWED_ORIGIN:'https://sudipdasin.github.io',TURNSTILE_SECRET_KEY:'test-secret',
 RESEND_API_KEY:'test-email-key',FEEDBACK_FROM:'test@example.com',FEEDBACK_TO:'developer@example.com'};
const valid={schemaVersion:1,theme:'terminal',
 feedback:'I used the real interactive Terminal preview with my own saved project details. The keyboard controls work and I would like additional portfolio layout controls.',
 replyEmail:'tester@example.org',turnstileToken:'test-challenge-token'};
const make=(body,origin=env.ALLOWED_ORIGIN)=>new Request('https://feedback.example.workers.dev/',{
 method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify(body)});
test('blocks unauthorized origin before processing feedback',async()=>{
 const response=await worker.fetch(make(valid,'https://attacker.invalid'),env);
 assert.equal(response.status,403);
});
test('requires CAPTCHA and rejects invalid themes and feedback',async()=>{
 assert.equal((await worker.fetch(make({...valid,turnstileToken:''}),env)).status,400);
 assert.equal((await worker.fetch(make({...valid,theme:'design-2'}),env)).status,400);
 assert.equal((await worker.fetch(make({...valid,feedback:'short'}),env)).status,400);
});
test('does not issue a receipt unless CAPTCHA succeeds and mail provider accepts',async()=>{
 const original=globalThis.fetch;
 try{
  globalThis.fetch=async url=>{
   if(String(url).includes('siteverify'))return new Response(JSON.stringify({success:false,hostname:'sudipdasin.github.io'}),{status:200});
   throw Error('Mail provider should never be called');
  };
  assert.equal((await worker.fetch(make(valid),env)).status,403);
  globalThis.fetch=async url=>{
   if(String(url).includes('siteverify'))return new Response(JSON.stringify({success:true,hostname:'sudipdasin.github.io'}),{status:200});
   return new Response(JSON.stringify({error:'Provider unavailable'}),{status:502});
  };
  const response=await worker.fetch(make(valid),env);
  assert.equal(response.status,502);
  assert.notEqual((await response.json()).accepted,true);
 }finally{globalThis.fetch=original;}
});
test('issues opaque receipt only after provider confirms accepted feedback',async()=>{
 const original=globalThis.fetch;
 try{
  globalThis.fetch=async url=>{
   if(String(url).includes('siteverify'))return new Response(JSON.stringify({success:true,hostname:'sudipdasin.github.io'}),{status:200});
   if(String(url).includes('resend.com'))return new Response(JSON.stringify({id:'mail_1234567890abcdef'}),{status:200});
   throw Error('Unexpected network destination');
  };
  const response=await worker.fetch(make(valid),env);
  assert.equal(response.status,200);
  const data=await response.json();
  assert.equal(data.accepted,true);
  assert.equal(data.receiptId,'mail_1234567890abcdef');
 }finally{globalThis.fetch=original;}
});
