import test from 'node:test';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {webcrypto} from 'node:crypto';
const require=createRequire(import.meta.url);
globalThis.crypto ||=webcrypto;
const protection=require('../examples/customer-demo/webstudio-package-crypto.js');
const starter=require('../examples/customer-demo/webstudio-starter.js');
const password='correct-horse-battery-staple-website-owner-2026';
const sensitive=new TextEncoder().encode(
 '<!doctype html><html><script>window.privateApp=false</script><style>.hero{display:grid}</style></html>'
);
function storedEntries(bytes){
 const buffer=Buffer.from(bytes),files=new Map();
 let cursor=0;
 while(cursor+30<=buffer.length&&buffer.readUInt32LE(cursor)===0x04034b50){
  const method=buffer.readUInt16LE(cursor+8);
  assert.equal(method,0,'ZIP files must use supported stored entries');
  const size=buffer.readUInt32LE(cursor+18);
  const length=buffer.readUInt16LE(cursor+26);
  const extra=buffer.readUInt16LE(cursor+28);
  const start=cursor+30+length+extra;
  const name=buffer.subarray(cursor+30,cursor+30+length).toString('utf8');
  files.set(name,buffer.subarray(start,start+size));
  cursor=start+size;
 }
 return files;
}
test('encrypts complete archive using authenticated AES-256-GCM and decrypts with owner password',async()=>{
 const encrypted=await protection.encrypt(sensitive,password);
 assert.equal(Buffer.from(encrypted.subarray(0,8)).toString(),'WSENC001');
 assert.ok(encrypted.byteLength>sensitive.byteLength);
 assert.equal(Buffer.from(encrypted).includes(Buffer.from('window.privateApp')),false);
 const plaintext=await protection.decrypt(encrypted,password);
 assert.deepEqual(Buffer.from(plaintext),Buffer.from(sensitive));
 assert.equal(protection.mode,'AES-256-GCM');
 assert.equal(protection.protection,'at-rest-only');
});
test('random salt and nonce produce different envelopes for the same file and password',async()=>{
 const a=await protection.encrypt(sensitive,password);
 const b=await protection.encrypt(sensitive,password);
 assert.notDeepEqual(Buffer.from(a),Buffer.from(b));
 assert.deepEqual(Buffer.from(await protection.decrypt(b,password)),Buffer.from(sensitive));
});
test('incorrect passphrase, corrupt ciphertext, and tampered header fail closed',async()=>{
 const original=await protection.encrypt(sensitive,password);
 await assert.rejects(protection.decrypt(original,'another-strong-unique-owner-password'),/Unable to decrypt/);
 const modified=Uint8Array.from(original);
 modified[modified.length-1]^=0x10;
 await assert.rejects(protection.decrypt(modified,password),/Unable to decrypt/);
 const tampered=Uint8Array.from(original);
 tampered[14]^=0x05;
 await assert.rejects(protection.decrypt(tampered,password),/Unable to decrypt/);
 const invalid=Uint8Array.from(original);invalid[0]^=0x01;
 await assert.rejects(protection.decrypt(invalid,password),/not a supported WebStudio/);
});
test('rejects short or blank passphrases and invalid input objects',async()=>{
 await assert.rejects(protection.encrypt(sensitive,'short'),/12–256 characters/);
 await assert.rejects(protection.encrypt(sensitive,'             '),/non-blank/);
 await assert.rejects(protection.encrypt('a string',password),/binary website archive/);
});
test('binary owner package retains exact encrypted bytes without exposing generated website',async()=>{
 const fullWebsite=starter.zip({'index.html':'<!doctype html><title>Owner</title>',
  'app.js':'window.WebStudioApp = true;',
  'theme.css':'body{color:#fff}'});
 const sealed=await protection.encrypt(await fullWebsite.arrayBuffer(),password);
 const protectedPackage=starter.zip({'encrypted-site.wsenc':sealed,
  'DECRYPT-README.txt':'Decrypt with owner passphrase before hosting'});
 const outer=storedEntries(await protectedPackage.arrayBuffer());
 assert.ok(outer.has('site/encrypted-site.wsenc'));
 assert.equal(outer.has('site/index.html'),false,'Plaintext site must not leak into protected envelope');
 assert.deepEqual(Buffer.from(outer.get('site/encrypted-site.wsenc')),Buffer.from(sealed));
 const plain=await protection.decrypt(outer.get('site/encrypted-site.wsenc'),password);
 const inner=storedEntries(plain);
 assert.equal(inner.get('site/app.js').toString(),'window.WebStudioApp = true;');
 assert.equal(inner.get('site/index.html').toString(),'<!doctype html><title>Owner</title>');
});
