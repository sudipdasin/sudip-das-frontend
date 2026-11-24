/* WebStudio v3.21 offline source verification. No dependencies or external calls.
 * Usage: node scripts/verify-preview-experience-v321.mjs
 * Source checks are not a substitute for real-device and live browser testing.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html'),footer=read('webstudio-six-theme-system-v321.css');
const reviewCss=read('preview-diagnostics-v321.css');
const diagnosis=read('preview-diagnostics-v321.js'),human=read('human-ci-preview-v1.js');
const themeAudit=read('preview-theme-audit-v316.js');
const headers=read('_headers'),ci=read('.circleci/config.yml');
const checks=[];
function pass(name,condition){assert.ok(condition,name);checks.push(name);}
function balanced(s){
 let brace=0,paren=0,quote='',comment=false;
 for(let i=0;i<s.length;i++){
  const a=s[i],b=s[i+1];
  if(comment){if(a==='*'&&b==='/'){comment=false;i++;}continue;}
  if(quote){if(a==='\\'){i++;continue;}if(a===quote)quote='';continue;}
  if(a==='/'&&b==='*'){comment=true;i++;continue;}
  if(a==="'"||a==='"'){quote=a;continue;}
  if(a==='{')brace++;if(a==='}')brace--;
  if(a==='(')paren++;if(a===')')paren--;
  if(brace<0||paren<0)return false;
 }
 return !comment&&!quote&&brace===0&&paren===0;
}
const themes=['orbit','editorial','terminal','aurora-peak','design-2'];
pass('New footer CSS is present',footer.length>5000);
pass('Five distinct footer design declarations',themes.every(id=>footer.includes('data-theme="'+id+'"] .ws-powered-band')));
pass('Neon Studio footer excluded from new overrides',!footer.includes('data-theme="neon-studio"] .ws-powered-band'));
pass('Footer has full nested demo styling',footer.includes('.ws-demo-tabs button')&&footer.includes('.ws-demo-panel figcaption'));
pass('Footer interest form controls restyled',footer.includes('.ws-interest-input-row input'));
pass('Editorial has a paper composition',footer.includes('data-theme="editorial"] .ws-powered-visual'));
pass('Terminal uses console typography',footer.includes('data-theme="terminal"] .ws-powered-content h2'));
pass('Alpine footer retains an arch',footer.includes('border-radius:48% 48% 12px 12px'));
pass('Cosmic has orbital art',footer.includes('data-theme="design-2"] .ws-powered-orbit'));
pass('Orbit has orbital art',footer.includes('data-theme="orbit"] .ws-powered-orbit'));
pass('Footer CSS balanced',balanced(footer));
pass('Review CSS balanced',balanced(reviewCss));
pass('Footer CSS after earlier theme layers',html.indexOf('webstudio-six-theme-system-v321.css')>html.indexOf('aurora-peak-review-polish-v320.css'));
pass('Review CSS loaded',html.includes('preview-diagnostics-v321.css?v=3.21.0'));
pass('Review module after human CI',html.indexOf('preview-diagnostics-v321.js')>html.indexOf('human-ci-preview-v1.js'));
pass('Theme audit version linked',html.includes('preview-theme-audit-v316.js?v=3.21.0'));
pass('Review bundle version linked',html.includes('human-ci-preview-v1.js?v=3.21.0'));
pass('Preview build marker',html.includes('preview-six-theme-experience-v3.21.0'));
pass('Six themes available',(html.match(/<option value="(?:orbit|editorial|terminal|aurora-peak|neon-studio|design-2)"/g)||[]).length===6);
pass('Original Neon default unchanged',html.includes('data-approved-theme="neon-studio"'));
pass('Noindex policy intact',html.includes('noindex,nofollow,noarchive'));
pass('Private API remains disabled',html.includes('window.PUBLIC_API_BASE=""')&&html.includes('window.PORTFOLIO_PREVIEW_MODE=true'));
pass('Preview security header retained',headers.includes('X-Frame-Options: DENY'));
pass('CircleCI preview remains paused',ci.includes('ignore:\n                - preview-personalweb'));
pass('Diagnostic module parses',Boolean(new Script(diagnosis)));
pass('Human CI module parses',Boolean(new Script(human)));
pass('Audit module parses',Boolean(new Script(themeAudit)));
pass('Diagnostics allow only known theme deep links',diagnosis.includes('THEMES.has(target)'));
pass('Diagnostics require user click',diagnosis.includes("run.addEventListener('click',runChecks)"));
pass('Diagnostics never upload or store data',!diagnosis.includes('fetch(')&&!diagnosis.includes('sendBeacon')&&!diagnosis.includes('localStorage'));
pass('Diagnostic JSON available',diagnosis.includes('webstudio-preview-diagnostics-v3.21.json'));
pass('Human CI new version',human.includes('webstudio-human-ci-v3.21.json'));
pass('Human CI Escape returns focus',human.includes('toggle.focus()'));
pass('Human CI old Pass not inherited',human.includes('No old Pass is accepted'));
pass('Theme audit checks footer contrast',themeAudit.includes('Footer ink-on-panel contrast >=4.5:1'));
pass('Reduced motion is supported',footer.includes('prefers-reduced-motion:reduce')&&reviewCss.includes('prefers-reduced-motion:reduce'));
console.log('PASS '+checks.length+'/'+checks.length+' WebStudio v3.21 offline source verifications. Browser QA still required.');
