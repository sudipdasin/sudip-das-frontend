#!/usr/bin/env node
/** Build only the fictional buyer demo for a standalone public preview. */
import {mkdir,copyFile,readFile,writeFile,rm} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve,dirname,join} from 'node:path';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const source=join(root,'examples','customer-demo');
const output=resolve(process.env.DEMO_OUTPUT_DIR || join(root,'dist','customer-demo-preview'));
const allowlist=['index.html','app.js','premium.css','premium.js','profile.json'];
if (output===root || output===source || !output.startsWith(root + '/')) throw new Error('Unsafe build destination');
const profile=JSON.parse(await readFile(join(source,'profile.json'),'utf8'));
if(profile.demo!==true||profile.schemaVersion!==1||!profile.identity?.displayName) throw new Error('Only fictional versioned demo profiles may be published');
const content=JSON.stringify(profile);
for(const expression of [/sudipdasin/i,/sudipdas\.is-a\.dev/i,/workers\.dev/i,/VAULT_ADMIN_TOKEN/i,/MAIL_BRIDGE_SECRET/i,/TURNSTILE_SECRET/i,/BEGIN PRIVATE KEY/i]){
 if(expression.test(content))throw new Error('Production identity or sensitive details detected in sample');
}
await rm(output,{recursive:true,force:true});
await mkdir(output,{recursive:true});
for(const file of allowlist)await copyFile(join(source,file),join(output,file));
await writeFile(join(output,'.nojekyll'),'');
await writeFile(join(output,'robots.txt'),'User-agent: *\nDisallow: /\n');
console.log('Created isolated demo preview with '+allowlist.join(', '));
