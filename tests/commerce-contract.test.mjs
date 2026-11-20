import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
const root=new URL('../examples/customer-demo/',import.meta.url);
const code=await readFile(new URL('commerce.js',root),'utf8');
const cfg=JSON.parse(await readFile(new URL('commerce.json',root),'utf8'));
const ctx={module:{exports:{}},URL,Object};vm.runInNewContext(code,ctx);
const {validateCheckout}=ctx.module.exports;
const merchant={schemaVersion:1,enabled:true,provider:'stripe',checkoutUrl:'https://buy.stripe.com/test_example_payment_path'};
test('the public demo defaults to disabled checkout',()=>{assert.equal(cfg.enabled,false);assert.equal(validateCheckout(cfg,'example.com').ready,false)});
test('even a configured checkout is blocked on GitHub Pages',()=>{assert.equal(validateCheckout(merchant,'sudipdasin.github.io').ready,false)});
test('hosted merchant checkout is accepted on independent commercial hosting',()=>{const r=validateCheckout(merchant,'shop.example.com');assert.equal(r.ready,true);assert.equal(r.url,merchant.checkoutUrl)});
test('insecure and spoofed checkout destinations are rejected',()=>{
 for(const url of ['http://buy.stripe.com/test','https://buy.stripe.com.evil.test/test','https://evil.test/checkout','https://test:secret@buy.stripe.com/test']){
  assert.equal(validateCheckout({...merchant,checkoutUrl:url},'shop.example.com').ready,false,url);
 }
});
test('empty payment page and unsupported provider are rejected',()=>{
 assert.equal(validateCheckout({...merchant,checkoutUrl:'https://buy.stripe.com/'},'shop.example.com').ready,false);
 assert.equal(validateCheckout({...merchant,provider:'unverified'},'shop.example.com').ready,false);
});
test('Razorpay hosted payment pages can be configured separately',()=>{
 const r=validateCheckout({...merchant,provider:'razorpay',checkoutUrl:'https://pages.razorpay.com/pl_example'},'shop.example.com');
 assert.equal(r.ready,true);
});
test('no API keys, merchant credentials or real payment URLs in public configuration',()=>{
 assert.equal(cfg.checkoutUrl,'');assert.equal(cfg.provider,'none');
 assert.doesNotMatch(JSON.stringify(cfg),/sk_live_|sk_test_|rzp_live_|webhook_secret/i);
});
