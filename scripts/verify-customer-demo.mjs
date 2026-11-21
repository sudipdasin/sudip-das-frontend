#!/usr/bin/env node
/**
 * Verify the *built* fictional WebStudio preview before it is made public.
 * Usage: node scripts/verify-customer-demo.mjs [artifact-directory]
 * No network, secrets or third-party dependencies required.
 */
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, join, relative, sep, extname } from 'node:path';
import { createHash } from 'node:crypto';

const root=resolve(process.argv[2] || 'dist/customer-demo-preview');
const errors=[];
const files=[];
async function visit(dir) {
  for (const entry of await readdir(dir,{withFileTypes:true})) {
    const abs=join(dir,entry.name);
    if(entry.isSymbolicLink()){errors.push('Symlink forbidden: '+relative(root,abs));continue;}
    if(entry.isDirectory())await visit(abs);
    else if(entry.isFile())files.push(relative(root,abs).split(sep).join('/'));
    else errors.push('Unsupported entry: '+relative(root,abs));
  }
}
try {await visit(root);} catch(error) {console.error('Preview missing or unreadable:',error.message);process.exit(1);}
const available=new Set(files);
for(const required of ['index.html','app.js','profile.json','robots.txt','.nojekyll'])
  if(!available.has(required))errors.push('Missing essential artifact: '+required);
for(const path of files){
  if(path.startsWith('.') && path!=='.nojekyll')errors.push('Unexpected hidden file: '+path);
  if(/(^|\/)(?:\.git|node_modules|private|secrets|backups)(\/|$)/i.test(path))errors.push('Nonpublic directory included: '+path);
  if(/\.(?:env|pem|key|p12|pfx|sqlite|db|zip|log)$/i.test(path))errors.push('Potentially sensitive artifact: '+path);
}
let html='';
try{html=await readFile(join(root,'index.html'),'utf8');}catch{}
const refs=[...html.matchAll(/\b(?:src|href)\s*=\s*(['"])(.*?)\1/gi)].map(x=>x[2]);
for(const ref of refs){
  if(ref.startsWith('#')||/^(?:https?:|mailto:|tel:|data:)/i.test(ref))continue;
  if(/^(?:javascript:|\/\/)/i.test(ref)){errors.push('Unsafe reference: '+ref);continue;}
  const clean=ref.split(/[?#]/,1)[0];
  if(!clean)continue;
  let decoded;
  try{decoded=decodeURIComponent(clean);}catch{errors.push('Malformed asset reference: '+ref);continue;}
  if(decoded.startsWith('/')||decoded.includes('\\')||decoded.split('/').includes('..')){
    errors.push('Unsafe asset path: '+ref);continue;
  }
  if(!available.has(decoded))errors.push('Missing referenced asset: '+ref);
}
try{
  const profile=JSON.parse(await readFile(join(root,'profile.json'),'utf8'));
  if(profile.demo!==true||profile.schemaVersion!==1)errors.push('Demo profile marker/schema invalid');
  if(!profile.identity?.displayName)errors.push('Demo profile missing display name');
}catch(error){errors.push('Invalid demo profile: '+error.message);}
let totalBytes=0;
const manifest=[];
for(const path of files.sort()){
  const full=join(root,path);
  const size=(await stat(full)).size;
  totalBytes+=size;
  const bytes=await readFile(full);
  manifest.push({path,size,sha256:createHash('sha256').update(bytes).digest('hex')});
  if(['.html','.js','.json','.css','.svg','.txt'].includes(extname(path).toLowerCase())){
    const body=bytes.toString('utf8');
    for(const [label,pattern] of [
      ['private key',/-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/],
      ['GitHub access token',/\b(?:ghp_|gho_|ghu_|ghs_|ghr_|github_pat_)[A-Za-z0-9_]{20,}/],
      ['payment secret',/\bsk_live_[A-Za-z0-9]{16,}/],
      ['Cloudflare API token',/\b(?:CLOUDFLARE_API_TOKEN|MAIL_BRIDGE_SECRET)\s*[:=]\s*['"][^'"]{12,}['"]/],
    ]) if(pattern.test(body))errors.push('Possible '+label+' in '+path);
  }
}
if(errors.length){
  for(const message of errors)console.error('FAIL '+message);
  console.error('Preview rejected: '+errors.length+' issue(s).');
  process.exit(1);
}
console.log(JSON.stringify({status:'PASS',files:files.length,bytes:totalBytes,sha256Manifest:manifest},null,2));
