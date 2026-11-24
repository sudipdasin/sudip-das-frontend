/* Human CI v3.28.1: test the two issues from the v3.27 user report.
 * Run node scripts/verify-human-ci-theme-repairs-v3281.mjs
 * Source and deterministic predicate checks; actual Cloudflare pixels require human CI.
 */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Script} from 'node:vm';
const read=path=>readFileSync(new URL('../'+path,import.meta.url),'utf8');
const html=read('index.html'),patch=read('human-ci-theme-repairs-v3281.css');
const audit=read('preview-theme-audit-v316.js');
const lock=read('neon-studio-reference-lock-v1.css');
const parity=read('webstudio-parity.js');
const results=[];
function check(name,condition){assert.ok(condition,name);results.push(name)}
check('Auditor JavaScript parses',Boolean(new Script(audit)));
check('New CSS braces balanced',(patch.match(/{/g)||[]).length===(patch.match(/}/g)||[]).length);
check('Preview uses v3.28.1 build',html.includes('preview-five-engine-mesh-i18n-audio-v3.28.1'));
check('Explicit repair marker',html.includes('name="portfolio-human-ci-repair" content="v3.28.1"'));
check('Audit cache bust v3.28.1',html.includes('preview-theme-audit-v316.js?v=3.28.1'));
check('Repair CSS cache bust v3.28.1',html.includes('human-ci-theme-repairs-v3281.css?v=3.28.1'));
const sheets=[...html.matchAll(/<link rel="stylesheet" href="([^"]+)"/g)].map(x=>x[1]);
check('Repair stylesheet loaded last',sheets.at(-1)==='human-ci-theme-repairs-v3281.css?v=3.28.1');
check('Editorial-only rule',patch.includes('data-theme="editorial"')&&!patch.includes('data-theme="neon-studio"'));
check('Editorial legacy pseudo-element removed',patch.includes('content:none!important')&&patch.includes('display:none!important')&&patch.includes('opacity:0!important'));
check('Editorial readable paper surface',patch.includes('background-color:#fbf7ee!important')&&patch.includes('background-image:none!important'));
check('Editorial teaser stays static',patch.includes('.pv-intro-cta-motion')&&patch.includes('display:none!important'));
check('Neon approved generic core is intentionally hidden',lock.includes('main>.hero .hero-art > .core{\n  display:none!important;'));
check('Neon precision portrait is the visible image',lock.includes('> .ws-neon-precision-portrait{')&&lock.includes('display:block!important'));
check('Neon precision portrait is built by the parity engine',parity.includes("node('div','ws-neon-precision-portrait')"));
check('Neon audit uses active portrait per theme',audit.includes("portraitSelector=id==='neon-studio'")&&audit.includes(".ws-neon-precision-portrait"));
check('Neon geometric audit measures width and height',audit.includes('portraitRect?.width>100&&portraitRect?.height>100'));
check('Neon audit verifies portrait visible',audit.includes("portraitStyle?.display!=='none'"));
check('Title width and height are tested',audit.includes('titleRect?.width>150&&titleRect?.height>20'));
check('Editorial audit detects pseudo with no box',audit.includes("overlay.display==='none'")&&audit.includes("overlay.content==='none'"));
check('Editorial audit still fails a visible dark overlay',audit.includes('Number.parseFloat(overlay.opacity)<=.01'));
check('Metrics included in report',audit.includes("Measurements: portrait ")&&audit.includes('r.measurements.overlayOpacity'));
check('Metrics included in exported JSON',audit.includes('checks,measurements,pass:'));
check('Never suppress real checks blindly',audit.includes("['no dark video overlay',overlay.display===")&&audit.includes('activePortraitGeometry'));
check('No external data or network introduced',!patch.includes('url(')&&!audit.includes('fetch('));
check('No production APIs enabled',html.includes('window.PUBLIC_API_BASE=""')&&html.includes('noindex,nofollow,noarchive'));
check('GitHub, Atmosphere, Quick Menu and portfolio still loaded',[
 'github-hero-explorer-v324.js','atmosphere-engine-v328.js',
 'personal-quick-hub-v2.js','portfolio-discovery-v328.js'
].every(name=>html.includes(name)));
const overlayHidden=x=>x.display==='none'||x.visibility==='hidden'||x.content==='none'||Number.parseFloat(x.opacity)<=.01;
check('Visible legacy dark overlay would fail',!overlayHidden({display:'block',visibility:'visible',content:'""',opacity:'1'}));
check('Removed overlay passes',overlayHidden({display:'none',visibility:'hidden',content:'none',opacity:'0'}));
check('Invisible pseudo without box passes',overlayHidden({display:'none',visibility:'visible',content:'""',opacity:'1'}));
check('Opacity-zero overlay passes',overlayHidden({display:'block',visibility:'visible',content:'""',opacity:'0'}));
const hasGeometry=(portrait,title,visible)=>Boolean(portrait.width>100&&portrait.height>100&&title.width>150&&title.height>20&&visible);
check('Visible Neon portrait is valid',hasGeometry({width:315,height:315},{width:410,height:84},true));
check('Hidden legacy core rejected',!hasGeometry({width:0,height:0},{width:410,height:84},false));
check('Tiny portrait still fails',!hasGeometry({width:40,height:40},{width:410,height:84},true));
console.log('PASS '+results.length+'/'+results.length+' Human CI repair v3.28.1 source and predicate checks. Physical-browser recheck pending.');
