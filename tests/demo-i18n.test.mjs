import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const base=new URL('../examples/customer-demo/',import.meta.url);
const read=async file=>JSON.parse(await readFile(new URL(file,base),'utf8'));
const [product,ui,copy,profile,dynamic]=await Promise.all(['i18n-product.json','i18n-ui.json','i18n-copy.json','i18n-profile.json','i18n-dynamic.json'].map(read));
const languages=['en','hi','bn','es','fr','de','pt','ar','zh-CN','ja'];
test('core resilience language catalog covers all ten original-site languages',()=>{
 assert.deepEqual(Object.keys(product.locales).sort(),languages.slice().sort());
 const reference=Object.keys(product.locales.en).sort();
 assert.ok(reference.length>=35);
 for(const lang of languages)assert.deepEqual(Object.keys(product.locales[lang]).sort(),reference,lang);
});
test('no missing translations for product critical claims',()=>{
 for(const lang of languages){
  for(const [key,text] of Object.entries(product.locales[lang])){
   assert.ok(typeof text==='string'&&text.trim().length>=2,lang+'/'+key);
   assert.doesNotMatch(text,/<script|onerror\s*=|javascript:/i,lang+'/'+key);
  }
 }
});
test('all interface catalog keys are localized in nine target languages',()=>{
 for(const dataset of [ui,copy,profile,dynamic]){
  const reference=Object.keys(dataset.translations.hi).sort();
  assert.ok(reference.length>=20);
  for(const lang of languages.filter(x=>x!=='en')){
   assert.deepEqual(Object.keys(dataset.translations[lang]||{}).sort(),reference,lang);
   for(const value of Object.values(dataset.translations[lang]))assert.ok(typeof value==='string'&&value.trim().length>0);
  }
 }
});
test('marketing highlights backup recovery and provider portability without uptime guarantee',()=>{
 const en=product.locales.en;
 for(const text of [en.uspIntro,en.switchText,en.backupText,en.manageText,en.plannedNext])
  assert.match(text,/backup|hosting|provider|DNS|cloud|restore|monitor|DDoS/i);
 assert.match(en.resilienceCaveat,/not an uptime guarantee/i);
 assert.match(en.plannedLabel,/not live/i);
});
test('page uses local dictionaries and supports right-to-left Arabic',async()=>{
 const html=await readFile(new URL('index.html',base),'utf8');
 const code=await readFile(new URL('studio-i18n.js',base),'utf8');
 for(const lang of languages)assert.ok(html.includes('value="'+lang+'"'),lang);
 assert.match(html,/src="studio-i18n\.js"/);
 assert.match(code,/active === 'ar' \? 'rtl' : 'ltr'/);
 assert.doesNotMatch(code,/translate\.google|libretranslate|external\.translate|innerHTML\s*=/i);
});
test('resilience specification distinguishes plans from implemented functionality',async()=>{
 const doc=await readFile(new URL('../../docs/ENDURING-WEB-PRESENCE.md',base),'utf8');
 assert.match(doc,/Not an absolute uptime guarantee/);
 assert.match(doc,/provider/i);
 assert.match(doc,/failure-injection/i);
});
