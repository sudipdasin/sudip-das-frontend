/* WebStudio encrypted owner archive (at-rest confidentiality ONLY).
 * AES-256-GCM + PBKDF2(SHA-256, 310,000 iterations), random salt/nonce.
 * Never embed passphrase in the archive. Decrypt BEFORE hosting.
 * A recipient able to decrypt can inspect and reuse all JS/CSS/assets.
 */
(function(root){
 'use strict';
 const MAGIC=new TextEncoder().encode('WSENC001');
 const SALT_BYTES=16,NONCE_BYTES=12,HEADER_BYTES=36;
 const ITERATIONS=310000,MAX_BYTES=25*1024*1024;
 const encoder=new TextEncoder();
 function engine(){
  const c=(root&&root.crypto)||globalThis.crypto;
  if(!c||!c.subtle||typeof c.getRandomValues!=='function')
   throw Error('Secure WebCrypto is required for encrypted WebStudio downloads.');
  return c;
 }
 function validatePassword(value){
  if(typeof value!=='string'||value.length<12||value.length>256)
   throw Error('Use an owner passphrase of 12–256 characters.');
  if(value.trim().length<12)
   throw Error('Use a non-blank, strong owner passphrase.');
 }
 function toBytes(value){
  let bytes;
  if(value instanceof Uint8Array)bytes=value;
  else if(value instanceof ArrayBuffer)bytes=new Uint8Array(value);
  else if(ArrayBuffer.isView(value))bytes=new Uint8Array(value.buffer,value.byteOffset,value.byteLength);
  else throw Error('Expected a binary website archive.');
  if(!bytes.length||bytes.length>MAX_BYTES)throw Error('Invalid archive size (maximum 25 MiB).');
  return bytes;
 }
 async function derive(passphrase,salt,usage){
  const c=engine();
  const material=await c.subtle.importKey('raw',encoder.encode(passphrase),'PBKDF2',false,['deriveKey']);
  return c.subtle.deriveKey({name:'PBKDF2',hash:'SHA-256',salt,iterations:ITERATIONS},material,
    {name:'AES-GCM',length:256},false,[usage]);
 }
 async function encrypt(binary,passphrase){
  validatePassword(passphrase);
  const bytes=toBytes(binary);
  const c=engine();
  const header=new Uint8Array(HEADER_BYTES);
  header.set(MAGIC,0);
  c.getRandomValues(header.subarray(8,24));
  c.getRandomValues(header.subarray(24,36));
  const key=await derive(passphrase,header.subarray(8,24),'encrypt');
  const ciphertext=new Uint8Array(await c.subtle.encrypt({
    name:'AES-GCM',iv:header.subarray(24,36),additionalData:header,tagLength:128
  },key,bytes));
  const result=new Uint8Array(header.length+ciphertext.length);
  result.set(header);result.set(ciphertext,header.length);
  return result;
 }
 async function decrypt(binary,passphrase){
  validatePassword(passphrase);
  const bytes=toBytes(binary);
  if(bytes.length<HEADER_BYTES+16||!MAGIC.every((part,index)=>bytes[index]===part))
   throw Error('This is not a supported WebStudio encrypted archive.');
  const header=bytes.subarray(0,HEADER_BYTES);
  const key=await derive(passphrase,header.subarray(8,24),'decrypt');
  try{
   return new Uint8Array(await engine().subtle.decrypt({
    name:'AES-GCM',iv:header.subarray(24,36),additionalData:header,tagLength:128
   },key,bytes.subarray(HEADER_BYTES)));
  }catch{
   throw Error('Unable to decrypt: incorrect passphrase or modified archive.');
  }
 }
 const api=Object.freeze({encrypt,decrypt,format:'WSENC001',mode:'AES-256-GCM',protection:'at-rest-only'});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(root)root.WebStudioPackageCrypto=api;
})(typeof window!=='undefined'?window:undefined);
