#!/usr/bin/env node
// Static guard for six independent themes and ten languages in fictional WebStudio.
// Browser visual, interaction, RTL and persistence checks remain separate gates.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const html = readFileSync(join(dirname(fileURLToPath(import.meta.url)), 'index.html'), 'utf8');
const expectedThemes = new Map([
 ['orbit','Orbit'],['editorial','Editorial'],['terminal','Terminal'],
 ['aurora-peak','Aurora Peak'],['neon-studio','Aurora'],['design-2','Cosmic']
]);
const expectedLanguages = ['en','hi','bn','es','fr','de','pt','ar','zh-CN','ja'];
const errors = [];
function getOptions(id) {
 const selects = [...html.matchAll(/<select\b([^>]*)>([\s\S]*?)<\/select>/gi)];
 const selected = selects.find(([,attributes]) => new RegExp('\\bid=["\\x27]' + id + '["\\x27]').test(attributes));
 if (!selected) { errors.push('Missing selector '+id); return []; }
 return [...selected[2].matchAll(/<option\b[^>]*\bvalue=["']([^"']+)["'][^>]*>([\s\S]*?)<\/option>/gi)]
  .map(([,value,label])=>[value,label.replace(/<[^>]*>/g,'').trim()]);
}
const themes=getOptions('theme-select');
const langs=getOptions('language-select');
for(const [name,entries] of [['themes',themes],['languages',langs]]) {
 if(new Set(entries.map(([id])=>id)).size!==entries.length) errors.push('Duplicate '+name+' IDs');
}
for(const [id,label] of expectedThemes) {
 const actual=themes.find(([value])=>value===id);
 if(!actual) errors.push('Missing theme '+id);
 else if(actual[1]!==label) errors.push('Incorrect label for '+id+': '+actual[1]);
}
for(const id of expectedLanguages) if(!langs.some(([value])=>value===id)) errors.push('Missing language '+id);
if(themes.length!==6) errors.push('Expected six themes; found '+themes.length);
if(langs.length!==10) errors.push('Expected ten languages; found '+langs.length);
for(const error of errors) console.error('FAIL:',error);
console.log('Theme and locale contract:',errors.length?'FAIL':'PASS');
process.exitCode=errors.length?1:0;
