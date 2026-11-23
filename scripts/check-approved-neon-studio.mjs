#!/usr/bin/env node
/**
 * Static Neon Studio owner-approval guard. No network, CI or secrets.
 * Run: node scripts/check-approved-neon-studio.mjs
 * This is a SOURCE-integrity check, not a rendered browser screenshot test.
 * To approve a visual change, request explicit owner authorization, save a
 * new baseline backup and update hashes after verified visual comparison.
 */
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {join} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=join(fileURLToPath(new URL('..',import.meta.url)));
const contract=JSON.parse(readFileSync(join(root,'theme-visual-contract.json'),'utf8'));
const freeze=contract.neonStudioFreeze;
if(!freeze?.protectedFiles?.length)throw Error('Neon Studio approval baseline missing');
let failures=0;
for(const asset of freeze.protectedFiles){
  const bytes=readFileSync(join(root,asset.path));
  const shasum=createHash('sha1')
    .update(Buffer.from('blob '+bytes.length+'\\0')).update(bytes).digest('hex');
  if(shasum!==asset.blobSha){
    console.error('CHANGED APPROVED ASSET: '+asset.path+' expected '+asset.blobSha+' got '+shasum);
    failures++;
  }else console.log('OK '+asset.path);
}
const html=readFileSync(join(root,'index.html'),'utf8');
for(const required of [
  '<body class="ws-parity" data-theme="neon-studio" data-approved-theme="neon-studio">',
  '<option value="neon-studio" selected>Neon Studio</option>',
  "try{setTheme('neon-studio')}",
  'personal-neon-portrait-refinement-v1.css?v=1.4.0',
  'window.PORTFOLIO_PREVIEW_MODE=true'
]){
  if(!html.includes(required)){console.error('MISSING NEON/SAFETY RULE: '+required);failures++;}
}
if(failures)process.exit(1);
console.log('Neon Studio source freeze: '+freeze.immutableCommit);
