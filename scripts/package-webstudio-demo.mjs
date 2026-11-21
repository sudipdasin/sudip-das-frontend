#!/usr/bin/env node
/**
 * Produce an isolated, portable, OFFLINE customer demonstration ZIP.
 * No payments, hosting claims, customer accounts or private data are included.
 * Usage: node scripts/package-webstudio-demo.mjs [output.zip]
 */
import { spawnSync } from 'node:child_process';
import { readFile, readdir, rm, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { deflateRawSync } from 'node:zlib';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const destination = resolve(process.argv[2] || join(root, 'dist', 'DevDas-WebStudio-demo.zip'));
const stage = join(root, 'dist', 'webstudio-package-stage');
if (!destination.startsWith(join(root, 'dist') + '/') || !destination.endsWith('.zip'))
  throw new Error('Output ZIP must be inside dist/ and end with .zip');
if (destination.startsWith(stage + '/')) throw new Error('Output ZIP cannot be inside staging directory');

const build = spawnSync(process.execPath, [join(root, 'scripts/build-customer-demo.mjs')], {
  cwd: root, encoding: 'utf8',
  env: { ...process.env, DEMO_OUTPUT_DIR: stage }
});
if (build.status !== 0) throw new Error('Demo build failed: ' + (build.stderr || build.stdout));
const profile = JSON.parse(await readFile(join(stage, 'profile.json'), 'utf8'));
if (profile.demo !== true || profile.schemaVersion !== 1 || profile.identity?.displayName !== 'Dev Das')
  throw new Error('Only the isolated fictional Dev Das demo may be packaged');
const files = (await readdir(stage, { withFileTypes: true })).filter(f => f.isFile()).map(f => f.name).sort();
if (!files.includes('index.html') || !files.includes('app.js') || !files.includes('profile.json'))
  throw new Error('Missing mandatory demo files');
const forbidden = /(?:private|\.env|secret|token|sudip-das-portrait|languages\.js)/i;
if (files.some(name => forbidden.test(name))) throw new Error('Disallowed file in demo artifact');

const entries = [];
const hashes = [];
for (const name of files) {
  const data = await readFile(join(stage, name));
  entries.push({ name: 'site/' + name, data });
  hashes.push(createHash('sha256').update(data).digest('hex') + '  site/' + name);
}
entries.push({ name: 'SHA256SUMS.txt', data: Buffer.from(hashes.join('\n') + '\n') });
entries.push({ name: 'START-HERE.txt', data: Buffer.from([
  'DEV DAS WEBSTUDIO - FICTIONAL CUSTOMER DEMONSTRATION',
  '',
  'This is a functional local editing demo, NOT a commercial production CMS.',
  'Extract site/ and upload its CONTENTS to a static web host or serve over HTTP.',
  'For local preview: cd site && python3 -m http.server 8000',
  'Then visit http://localhost:8000',
  'Customize demo, save in your browser, and export a profile JSON backup.',
  'Browser localStorage changes do NOT automatically publish to your hosting.',
  'No account, cloud backup, automated failover, payment, or email delivery.',
  'Do not advertise customer-facing guarantees that are not implemented.',
  'Integrity: SHA256SUMS.txt hashes all included site files.',
  'Source: https://github.com/sudipdasin/sudip-das-frontend',
  'Review source/dependency licenses before any commercial redistribution.',
  ''
].join('\n') });

function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function zip(entries) {
  let offset = 0;
  const chunks = [], central = [];
  for (const { name, data } of entries) {
    const filename = Buffer.from(name, 'utf8');
    const compressed = deflateRawSync(data);
    const hash = crc32(data);
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x0800, 6);
    local.writeUInt16LE(8, 8);
    local.writeUInt32LE(hash, 14);
    local.writeUInt32LE(compressed.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(filename.length, 26);
    chunks.push(local, filename, compressed);
    const header = Buffer.alloc(46);
    header.writeUInt32LE(0x02014b50, 0);
    header.writeUInt16LE(20, 4);
    header.writeUInt16LE(20, 6);
    header.writeUInt16LE(0x0800, 8);
    header.writeUInt16LE(8, 10);
    header.writeUInt32LE(hash, 16);
    header.writeUInt32LE(compressed.length, 20);
    header.writeUInt32LE(data.length, 24);
    header.writeUInt16LE(filename.length, 28);
    header.writeUInt32LE(offset, 42);
    central.push(header, filename);
    offset += local.length + filename.length + compressed.length;
  }
  if (entries.length > 65535) throw new Error('Too many ZIP entries');
  const directory = Buffer.concat(central);
  const footer = Buffer.alloc(22);
  footer.writeUInt32LE(0x06054b50, 0);
  footer.writeUInt16LE(entries.length, 8);
  footer.writeUInt16LE(entries.length, 10);
  footer.writeUInt32LE(directory.length, 12);
  footer.writeUInt32LE(offset, 16);
  return Buffer.concat([...chunks, directory, footer]);
}
await mkdir(dirname(destination), { recursive: true });
await writeFile(destination, zip(entries));
await rm(stage, { recursive: true, force: true });
console.log('Created ' + destination + ' with ' + entries.length + ' demo-only files');
