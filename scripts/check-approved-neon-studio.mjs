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
// The owner explicitly requested a desktop orbit enlargement. The original
// immutable approval remains recoverable; only the single reviewed JS blob
// below is allowed to differ on preview. All other core visual hashes stay
// fixed, and this does NOT grant approval to change production.
const variation=freeze.ownerAuthorizedPreviewVariation;
for(const asset of freeze.protectedFiles){
  const bytes=readFileSync(join(root,asset.path));
  const shasum=createHash('sha1')
    .update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
  const expected=asset.path===variation?.modifiedAsset&&variation.productionApproval===false
    ?variation.authorizedBlobSha:asset.blobSha;
  if(shasum!==expected){
    console.error('CHANGED APPROVED ASSET: '+asset.path+' expected '+expected+' got '+shasum);
    failures++;
  }else console.log('OK '+asset.path+(expected!==asset.blobSha?' (owner-authorized preview geometry)':''));
}
// Verify the explicitly authorized new header-only overlay by exact Git blob
// hash; the original approved five visual assets stay protected separately.
const header=variation?.headerBrandVariation;
if(header?.asset&&header.productionApproved===false){
  const bytes=readFileSync(join(root,header.asset));
  const gitSha=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
  if(gitSha!==header.blobSha){
    console.error('CHANGED HEADER STYLE: '+header.asset+' got '+gitSha);
    failures++;
  }else console.log('OK approved header alignment '+header.asset);
}
const mobile=variation?.mobileAudit;
if(mobile?.asset&&mobile.productionApproved===false){
  const bytes=readFileSync(join(root,mobile.asset));
  const sha=createHash('sha1').update(Buffer.from('blob '+bytes.length+'\0')).update(bytes).digest('hex');
  if(sha!==mobile.blobSha){
    console.error('CHANGED APPROVED MOBILE ASSET: '+mobile.asset+' expected '+mobile.blobSha+' got '+sha);
    failures++;
  }else console.log('OK approved mobile hardening '+mobile.asset);
}
const html=readFileSync(join(root,'index.html'),'utf8');
for(const required of [
  '<body class="ws-parity" data-theme="neon-studio" data-approved-theme="neon-studio">',
  '<option value="neon-studio" selected>Neon Studio</option>',
  "try{setTheme('neon-studio')}",
  'personal-neon-portrait-refinement-v1.css?v=1.4.0',
  'webstudio-parity.js?v=neon-1.4.3',
  'personal-neon-nameplate-fit-v1.css?v=1.1.0',
  'personal-neon-header-reference-v1.css?v=1.1.0',
  'personal-neon-mobile-hardening-v1.css?v=1.0.0',
  '<span class="brand-name">Sudip Das</span>',
  'window.PORTFOLIO_PREVIEW_MODE=true'
]){
  if(!html.includes(required)){console.error('MISSING NEON/SAFETY RULE: '+required);failures++;}
}
if(failures)process.exit(1);
console.log('Neon Studio source freeze: '+freeze.immutableCommit);
