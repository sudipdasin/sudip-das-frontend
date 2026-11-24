#!/usr/bin/env node
/* Offline WebStudio Plugin Engine 3.31 source/lifecycle test.
 * Does not use a browser, network, GitHub Actions, CircleCI or deployment.
 */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const rootDir=new URL('../',import.meta.url);
const read=p=>fs.readFileSync(new URL(p,rootDir),'utf8');
const files=[
 'plugins/webstudio-plugin-engine-v331.js',
 'plugins/modules/theme-v331.js',
 'plugins/modules/hero-v331.js',
 'plugins/modules/atmosphere-v331.js',
 'plugins/modules/quick-menu-v331.js',
 'plugins/modules/portfolio-v331.js',
 'plugins/webstudio-personal-bridge-v331.js',
 'examples/webstudio-plugin-starter/starter.js'
];
const tests={};
const check=(name,result)=>{assert.ok(result,name);console.log('PASS '+name);tests[name]=true;};
for(const file of files)new vm.Script(read(file),{filename:file});
check('All eight plugin and adapter scripts parse',true);
const sandbox={window:{performance:{now:()=>Date.now()}}};
for(const file of files.slice(0,6))vm.runInNewContext(read(file),sandbox,{filename:file});
const factory=sandbox.window.WebStudioPluginEngine331;
const modules=sandbox.window.WebStudioPlugins331;
check('Plugin host loads without DOM',factory?.version==='3.31.0');
check('All five independent module manifests load', ['theme','hero','atmosphere','quick-menu','portfolio'].every(id=>modules[id]?.mount));
const attrs=new Map(),properties=new Map();
const root={
 querySelector:()=>null,querySelectorAll:()=>[],
 getAttribute:k=>attrs.has(k)?attrs.get(k):null,
 setAttribute:(k,v)=>attrs.set(k,String(v)),removeAttribute:k=>attrs.delete(k),
 style:{
  getPropertyValue:k=>properties.get(k)||'',
  setProperty:(k,v)=>properties.set(k,v),removeProperty:k=>properties.delete(k)
 }
};
const h=factory.create({root,theme:'editorial',locale:'en',quality:'auto'});
const h2=factory.create({root,theme:'orbit'});
check('Distinct host IDs',h.getStatus().hostId!==h2.getStatus().hostId);
const released=[];
h.register({id:'alpha',mount:ctx=>{
 ctx.onCleanup(()=>released.push('alpha'));
 return {api:{ping:()=>true},update:()=>{}};
}});
h.register({id:'broken',mount(){throw Error('synthetic failure')}});
h.register({id:'blocked',dependsOn:['broken'],mount(){throw Error('should not mount')}});
h.register({id:'omega',mount:ctx=>{ctx.onCleanup(()=>released.push('omega'))}});
const mounted=await h.mount();
check('Working plugins mount',mounted.modules.alpha==='mounted'&&mounted.modules.omega==='mounted');
check('Failure isolated',mounted.modules.broken==='failed'&&mounted.mounted===2);
check('Dependent safely blocked',mounted.modules.blocked==='blocked');
check('Public module API available',h.getModule('alpha')?.ping()===true);
check('Host namespaced theme state',attrs.get('data-wsp-theme')==='editorial');
h.setTheme('terminal');h.setLocale('ar');h.setQuality('eco');
await h.update('offline-test');
check('Theme/locale/quality updates',h.getStatus().theme==='terminal'&&h.getStatus().locale==='ar'&&h.getStatus().quality==='eco');
await h.unmount();
check('Reverse cleanup',released.join(',')==='omega,alpha');
check('Original root restored',!attrs.size&&!properties.size);
h.setTheme('orbit');
check('No repaint when stopped',!attrs.size&&!properties.size);
const cycle=factory.create({root});
cycle.register({id:'one',dependsOn:['two'],mount(){}});
cycle.register({id:'two',dependsOn:['one'],mount(){}});
await assert.rejects(()=>cycle.mount(),/dependency cycle/i);
check('Dependency cycles rejected',true);
const manifest=JSON.parse(read('plugins/webstudio-plugin-manifest-v331.json'));
check('Manifest declares five reusable modules',manifest.modules.length===5);
const preview=read('index.html'),fix=read('editorial-github-layer-v331.css');
const github=read('github-hero-explorer-v324.js');
check('Editorial layering hooked in both open and close',github.includes("classList.add('gh-disclosure-visible')")&&github.includes("classList.remove('gh-disclosure-visible')")&&fix.includes('gh-disclosure-visible'));
check('Layer fix included on preview',preview.includes('editorial-github-layer-v331.css?v=3.31.0'));
check('Bridge included on preview',preview.includes('plugins/webstudio-personal-bridge-v331.js?v=3.31.0'));
check('Main build marker',preview.includes('preview-editorial-layer-plugin-platform-v3.31.0'));
check('Standalone playground links all five modules',manifest.modules.every(m=>read('examples/webstudio-plugin-starter/index.html').includes(m.path.replace('plugins/','../../plugins/'))));
const localeNames=['en','hi','bn','es','fr','de','pt','ar','zh-CN','ja'];
for(const file of [...files.slice(1,6),'plugins/webstudio-personal-bridge-v331.js','examples/webstudio-plugin-starter/starter.js']){
 const content=read(file);
 const key=file.endsWith('hero-v331.js')?'localeText':file.endsWith('atmosphere-v331.js')?'labels':file.endsWith('starter.js')?'content':'copy';
 let start=content.indexOf(' const '+key+'=');
 if(start<0&&file.includes('personal-bridge')){start=content.indexOf(' const labels=');}
 if(start<0)continue;
 const tail=content.slice(start);
 const brace=tail.indexOf('{');
 let depth=0,end=-1;
 for(let i=brace;i<tail.length;i++){
  if(tail[i]==='{')depth++;
  else if(tail[i]==='}'&&!--depth){end=i;break}
 }
 const expression=tail.slice(brace,end+1);
 const dictionary=vm.runInNewContext('('+expression+')',{});
 check('Ten native locales: '+file,localeNames.every(l=>Boolean(dictionary[l])));
}
const css=read('plugins/webstudio-plugin-engine-v331.css');
check('Plugin CSS braces balanced',css.split('{').length===css.split('}').length);
check('No network calls inside plugin core/modules',files.slice(0,6).every(path=>!/\b(?:fetch|sendBeacon|XMLHttpRequest)\s*\(/.test(read(path))));
check('CircleCI remains disabled',read('.circleci/config.yml').includes('manual_ci_enabled:\n    type: boolean\n    default: false'));
console.log('PASS '+Object.keys(tests).length+' local source/lifecycle checks. Real browser QA NOT RUN.');
