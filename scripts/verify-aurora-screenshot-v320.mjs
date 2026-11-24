/** Screenshot regression gate for Aurora Peak v3.20.
 * Run: node scripts/verify-aurora-screenshot-v320.mjs
 * Checks source contracts only; it does NOT certify live browser/pixel rendering. */
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { Script } from 'node:vm';
const load = path => readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=load('index.html');
const css=load('aurora-peak-review-polish-v320.css');
const ci=load('human-ci-preview-v1.js');
const theme=load('personal-theme-library.js');
const headers=load('_headers');
const config=load('.circleci/config.yml');
const edition=load('aurora-peak-alpine-v318.css');
const checks=[];
function check(name, ok){assert.ok(ok,name);checks.push(name);}
function braceBalance(text){
 let depth=0, parens=0, quote='',comment=false;
 for(let i=0;i<text.length;i++){
  const ch=text[i],next=text[i+1];
  if(comment){if(ch==='*'&&next==='/'){comment=false;i++;}continue;}
  if(quote){if(ch==='\\'){i++;continue;}if(ch===quote)quote='';continue;}
  if(ch==='/'&&next==='*'){comment=true;i++;continue;}
  if(ch==='"'||ch==="'"){quote=ch;continue;}
  if(ch==='{')depth++;else if(ch==='}')depth--;
  if(ch==='(')parens++;else if(ch===')')parens--;
  if(depth<0||parens<0)return false;
 }
 return !comment&&!quote&&depth===0&&parens===0;
}
check('Aurora v3.20 stylesheet linked',html.includes('aurora-peak-review-polish-v320.css?v=3.20.0'));
check('CSS overrides after alpine stylesheet',html.indexOf('aurora-peak-review-polish-v320.css')>html.indexOf('aurora-peak-alpine-v318.css'));
check('Current site build fingerprint',html.includes('preview-aurora-human-ci-polish-v3.20.0'));
check('20-point Human CI bundle updated',html.includes('human-ci-preview-v1.js?v=3.20.0'));
check('Aurora header CTA selector',css.includes('.topbar .navlinks a.nav-cta'));
check('Aurora CTA text contrast direction',css.includes('color:#18332b!important'));
check('Aurora library styling',css.includes('.topbar .pv-theme-launch'));
check('Aurora cyan override eliminated',css.includes('background:linear-gradient(110deg,#e1eaba,#b9dcc5)'));
check('Decorative landscape label separated',css.includes('.ap-trail-mark')&&css.includes('width:26%!important'));
check('Portrait caption bounded',css.includes('max-width:55%!important'));
check('Small-screen overlap safeguard',css.includes('@media(max-width:600px)')&&css.includes('.ap-trail-mark'));
check('CSS syntax structural balance',braceBalance(css));
check('Aurora-only styling',!css.includes('body.ws-parity[data-theme="neon-studio"]')&&!css.includes('body.ws-parity[data-theme="terminal"]'));
check('Original scenic layers retained',edition.includes('.ap-ridge-front'));
check('Fresh v3.20 Human CI key',ci.includes("const key = 'webstudio-human-ci-v3.20'"));
check('Old review notes can migrate',ci.includes("'webstudio-human-ci-v3.18'"));
check('Compact count shown',ci.includes("textContent=count+'/'+checks.length"));
check('Review launch identifies v3.20',ci.includes('Review v3.20'));
check('Review uses accessible dynamic status',ci.includes("toggle.setAttribute('aria-label'"));
check('Review JSON is v3.20',ci.includes('webstudio-human-ci-v3.20.json'));
check('Human CI script parses',Boolean(new Script(ci)));
check('Theme Library script parses',Boolean(new Script(theme)));
check('Six theme options retained',(html.match(/<option value="(?:orbit|editorial|terminal|aurora-peak|neon-studio|design-2)"/g)||[]).length===6);
check('Neon Studio approved default',html.includes('data-approved-theme="neon-studio"'));
check('Preview robots noindex',html.includes('noindex,nofollow,noarchive'));
check('No private API',html.includes('window.PUBLIC_API_BASE=""')&&html.includes('window.PORTFOLIO_PREVIEW_MODE=true'));
check('Anti-framing protection',headers.includes('X-Frame-Options: DENY'));
check('CircleCI preview branch excluded',config.includes('ignore:\\n                - preview-personalweb')||config.includes('ignore:\n                - preview-personalweb'));
console.log('PASS '+checks.length+'/'+checks.length+' Aurora screenshot regression source checks. Live browser review still pending.');
