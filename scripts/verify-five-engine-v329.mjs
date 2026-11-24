#!/usr/bin/env node
/* Local-only v3.29 source contract test. Does not deploy, fetch, upload, run browser or incur CI credits. */
import fs from 'node:fs';
import assert from 'node:assert/strict';
const read=file=>fs.readFileSync(new URL('../'+file,import.meta.url),'utf8');
const html=read('index.html'),js=read('webstudio-five-engine-v329.js'),
 css=read('webstudio-five-engine-v329.css');
const ids=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
const locales=['en','hi','bn','es','fr','de','pt','ar','zh-CN','ja'];
const events=['ws-engine-theme-change','ws-atmosphere-change','profile-language-change','ws-portfolio-filter-change'];
const checks={
 previewGuard:js.includes('window.PORTFOLIO_PREVIEW_MODE!==true'),
 htmlScript:html.includes('webstudio-five-engine-v329.js?v=3.29.0'),
 htmlCss:html.includes('webstudio-five-engine-v329.css?v=3.29.0'),
 buildMarker:html.includes('preview-five-engine-six-theme-v3.29.0'),
 sixThemes:ids.every(id=>js.includes(id)&&css.includes('data-theme="'+id+'"')),
 fiveEngines:['hero','atmosphere','theme','quick','portfolio'].every(x=>js.includes("if(key==='"+x+"')")),
 tenLocales:locales.every(l=>js.includes((l.includes('-')?"'":"")+l+(l.includes('-')?"'":"")+':[')),
 translationData:js.includes('const DESCRIPTIONS=')&&js.includes('const MODE_LABEL='),
 events:events.every(event=>js.includes(event)),
 manualAudit:js.includes("run.addEventListener('click'")&&js.includes('hostedCI:'),
 noHostedCI:read('.circleci/config.yml').includes('manual_ci_enabled:\n    type: boolean\n    default: false'),
 noPrivateRequests:html.includes('window.PUBLIC_API_BASE="";window.PORTFOLIO_PREVIEW_MODE=true;'),
 noNewExternalRequests:!/\b(fetch|XMLHttpRequest|sendBeacon)\s*\(/.test(js),
 oldEditorialFix:html.includes('human-ci-theme-repairs-v3281.css'),
 cssBraces:css.split('{').length===css.split('}').length
};
for(const [name,passed]of Object.entries(checks)){console.log((passed?'PASS':'FAIL')+' '+name);assert.ok(passed,name);}
console.log('PASS '+Object.keys(checks).length+' source contracts. Browser UI and security tests NOT RUN.');
