#!/usr/bin/env node
// Owner-side offline decryption for WebStudio encrypted exports.
// Encrypted storage protects the archive only UNTIL it is decrypted.
// Once hosted, site HTML/CSS/JavaScript and public assets are readable.
import {readFile,writeFile} from 'node:fs/promises';
import {stdin,stdout,stderr,argv,exitCode} from 'node:process';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
import {webcrypto} from 'node:crypto';
const require=createRequire(import.meta.url);
globalThis.crypto ||=webcrypto;
const {decrypt}=require('./webstudio-package-crypto.js');

function secretPrompt(){
 return new Promise((resolveSecret,reject)=>{
  if(!stdin.isTTY||typeof stdin.setRawMode!=='function'){
   reject(Error('Use an interactive terminal to enter the secret without putting it in arguments or logs.'));
   return;
  }
  let answer='',done=false;
  const rawBefore=Boolean(stdin.isRaw);
  const end=(value,error)=>{
   if(done)return;done=true;
   stdin.removeListener('data',onData);
   stdin.setRawMode(rawBefore);
   stdin.pause();stdout.write('\n');
   error?reject(error):resolveSecret(value);
  };
  const onData=chunk=>{
   for(const character of chunk.toString('utf8')){
    if(character==='\r'||character==='\n'){end(answer);return;}
    if(character==='\u0003'){end('',Error('Cancelled'));return;}
    if(character==='\u007f'||character==='\b'){answer=answer.slice(0,-1);continue;}
    if(character.charCodeAt(0)<32)continue;
    if(answer.length>=256){end('',Error('Passphrase too long'));return;}
    answer+=character;
   }
  };
  try{
   stdin.setRawMode(true);
   stdin.resume();
   stdout.write('Owner passphrase (hidden): ');
   stdin.on('data',onData);
  }catch(error){end('',error);}
 });
}
if(argv.length<3||argv.length>4){
 stderr.write('Usage: node decrypt.mjs <encrypted-file.wsenc> [output-site.zip]\n');
 stderr.write('This only protects stored copies. Decrypted website source can be viewed or copied.\n');
 process.exitCode=2;
}else{
 const input=resolve(argv[2]),output=resolve(argv[3]||'webstudio-site.zip');
 if(input===output)throw Error('Output path cannot equal encrypted input.');
 try{
  const bytes=await readFile(input);
  const passphrase=await secretPrompt();
  const plain=await decrypt(bytes,passphrase);
  if(plain.length<4||plain[0]!==80||plain[1]!==75||plain[2]!==3||plain[3]!==4)
   throw Error('Decrypted data does not contain a ZIP archive.');
  await writeFile(output,plain,{flag:'wx',mode:0o600});
  stdout.write('Website archive decrypted to '+output+'\n');
  stdout.write('Extract and manually host site/. All public site source remains inspectable by visitors.\n');
 }catch(error){
  stderr.write('Decryption failed: '+error.message+'\n');
  process.exitCode=1;
 }
}
