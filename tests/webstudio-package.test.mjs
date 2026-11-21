import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { readFile, rm } from 'node:fs/promises';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { inflateRawSync } from 'node:zlib';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const artifact = join(root, 'dist', 'webstudio-package-test.zip');

test('commercial preview packaging is isolated, valid ZIP, checksummed and truthful', async () => {
  try {
    const result = spawnSync(process.execPath, ['scripts/package-webstudio-demo.mjs', artifact], { cwd:root, encoding:'utf8' });
    assert.equal(result.status, 0, result.stderr || result.stdout);
    const zip = await readFile(artifact);
    assert.equal(zip.readUInt32LE(0), 0x04034b50);
    const records = new Map();
    let pos = 0;
    while (pos + 30 <= zip.length && zip.readUInt32LE(pos) === 0x04034b50) {
      const method = zip.readUInt16LE(pos + 8);
      const packed = zip.readUInt32LE(pos + 18);
      const size = zip.readUInt32LE(pos + 22);
      const nameSize = zip.readUInt16LE(pos + 26);
      const extraSize = zip.readUInt16LE(pos + 28);
      const name = zip.subarray(pos + 30, pos + 30 + nameSize).toString('utf8');
      const start = pos + 30 + nameSize + extraSize;
      assert.equal(method, 8);
      const data = inflateRawSync(zip.subarray(start, start + packed));
      assert.equal(data.length, size);
      records.set(name, data);
      pos = start + packed;
    }
    assert.ok(records.size > 30, 'expected full independent demo assets');
    assert.ok(records.has('site/index.html'));
    assert.ok(records.has('site/app.js'));
    assert.ok(records.has('site/profile.json'));
    assert.ok(records.has('START-HERE.txt'));
    assert.ok(records.has('SHA256SUMS.txt'));
    const profile = JSON.parse(records.get('site/profile.json').toString());
    assert.equal(profile.demo, true);
    assert.equal(profile.identity.displayName, 'Dev Das');
    assert.match(records.get('START-HERE.txt').toString(), /NOT a commercial production CMS/);
    const hashes = records.get('SHA256SUMS.txt').toString().trim().split('\n');
    assert.equal(hashes.length, records.size - 2);
    for (const line of hashes) {
      const match = /^([a-f0-9]{64})  (site\/.+)$/.exec(line);
      assert.ok(match);
      assert.equal(createHash('sha256').update(records.get(match[2])).digest('hex'), match[1]);
    }
    for (const name of records.keys()) assert.doesNotMatch(name,/portrait\.jpg|\.env|private.key|wrangler/i);
    const tail = zip.subarray(-22);
    assert.equal(tail.readUInt32LE(0), 0x06054b50, 'valid ZIP end-of-central-directory marker');
    assert.equal(tail.readUInt16LE(10), records.size);
  } finally {
    await rm(artifact, { force: true });
  }
});
