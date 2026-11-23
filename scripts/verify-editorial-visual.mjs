/**
 * Editorial gold-master visual regression and six-theme screenshot gallery.
 *
 * Always render the fixed archived COMMIT from the same repository, never a
 * moving URL or an unrelated WebStudio fictional demo. No privileged backend.
 * A browser screenshot comparison is only a pixel-level SITE stability check,
 * not proof of parity with the private WebStudio reference.
 *
 * Usage:
 *   npm i --no-save --no-package-lock playwright@1.56.1 pngjs@7 pixelmatch@6
 *   node scripts/verify-editorial-visual.mjs
 */
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { createReadStream, mkdirSync, mkdtempSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { basename, extname, join, resolve, sep } from 'node:path';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const SNAPSHOT = 'c5383df1ebda7a0e5f05d9f59048a136dc99dac5';
const ARCHIVE_REF = 'refs/heads/archive/editorial-favorite-2026-11-23-c5383df';
const THEMES = ['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
const VIEWPORTS = [
  {width:1440,height:900},
  {width:390,height:844},
];
const GALLERY_VIEWPORTS = [
  {width:1833,height:858},
  {width:1672,height:941},
  {width:820,height:900},
  {width:390,height:844},
];
const root = process.cwd();
const output = join(root, 'visual-audit');
mkdirSync(output,{recursive:true});
const report = {
  baselineCommit:SNAPSHOT, archiveRef:ARCHIVE_REF,
  purpose:'Editorial freeze and personal-theme browser gallery; NOT WebStudio pixel parity',
  editorial:{}, gallery:[], problems:[],
};
function runGit(args,opts={}) {
  return execFileSync('git',args,{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe'],...opts}).trim();
}
function obtainSnapshot() {
  // Re-fetch the named archive branch and reject any movement of the reference.
  execFileSync('git',['fetch','--no-tags','--depth=1','origin',ARCHIVE_REF],
    {cwd:root,stdio:'inherit',timeout:120000});
  const actual=runGit(['rev-parse','FETCH_HEAD']);
  assert.equal(actual,SNAPSHOT,'EDITORIAL BACKUP MOVED: stop, investigate and restore!');
  const destination=mkdtempSync(join(tmpdir(),'editorial-baseline-'));
  const archive=spawnSync('git',['archive','--format=tar',SNAPSHOT],
    {cwd:root,maxBuffer:32*1024*1024});
  assert.equal(archive.status,0,'Unable to open archived Editorial source tree');
  const extracted=spawnSync('tar',['-xf','-','-C',destination],
    {input:archive.stdout,maxBuffer:4*1024*1024});
  assert.equal(extracted.status,0,'Unable to extract archived Editorial tree');
  assert.ok(readFileSync(join(destination,'index.html'),'utf8').includes('value="editorial"'));
  return destination;
}
function serve(folder) {
  const MIME={
    '.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8',
    '.css':'text/css; charset=utf-8','.json':'application/json; charset=utf-8',
    '.svg':'image/svg+xml','.jpg':'image/jpeg','.jpeg':'image/jpeg',
    '.png':'image/png','.webp':'image/webp','.txt':'text/plain; charset=utf-8'
  };
  const server=createServer((req,res)=>{
    try {
      const u=new URL(req.url,'http://localhost');
      const name=decodeURIComponent(u.pathname)==='/'?'/index.html':decodeURIComponent(u.pathname);
      const path=resolve(folder,'.'+name);
      if(!path.startsWith(resolve(folder)+sep)){
        res.writeHead(403);res.end();return;
      }
      const info=statSync(path);
      if(!info.isFile())throw Error('not-file');
      res.writeHead(200,{
        'Content-Type':MIME[extname(path)]||'application/octet-stream',
        'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'
      });
      createReadStream(path).pipe(res);
    } catch {
      res.writeHead(404,{'Content-Type':'text/plain'});res.end('Not found');
    }
  });
  return new Promise((ok,no)=>{
    server.on('error',no);
    server.listen(0,'127.0.0.1',()=>ok({
      server, origin:'http://127.0.0.1:'+server.address().port
    }));
  });
}
async function openTheme(browser, origin, viewport, theme) {
  const context=await browser.newContext({
    viewport,deviceScaleFactor:1,reducedMotion:'reduce',
    serviceWorkers:'block', colorScheme:'light'
  });
  const page=await context.newPage();
  // Identical external blocking and seeded random on both the gold master
  // and candidate, so network fonts/Turnstile cannot skew the comparison.
  await page.addInitScript(()=>{
    let state=0x1a2b3c4d;
    Math.random=()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return state/4294967296;};
  });
  await page.route('**/*',route=>{
    if(route.request().url().startsWith(origin+'/'))return route.continue();
    return route.abort('blockedbyclient');
  });
  const response=await page.goto(origin+'/',{waitUntil:'domcontentloaded',timeout:30000});
  assert.ok(response?.ok(),'Unable to load local archived/candidate HTML');
  await page.locator('#theme-select').waitFor({timeout:15000});
  await page.locator('#theme-select').selectOption(theme);
  await page.waitForFunction(want=>document.body.dataset.theme===want,theme);
  await page.evaluate(()=>document.fonts.ready);
  await page.addStyleTag({content:
    '*,*::before,*::after{animation:none!important;transition:none!important;'
    +'scroll-behavior:auto!important;caret-color:transparent!important} '
    +'html{scroll-behavior:auto!important}'
  });
  await page.evaluate(()=>scrollTo(0,0));
  return {context,page};
}
function makePng(buffer){return PNG.sync.read(buffer);}
function dimensions(p){return p.width+'x'+p.height;}
function safeLabel(text){return text.replace(/[^a-z0-9-]/gi,'_');}
async function screenshot(browser,origin,vp,theme,filename,fullPage=true) {
  const {context,page}=await openTheme(browser,origin,vp,theme);
  try {
    assert.equal(await page.locator('#theme-select option').count(),6);
    assert.equal(await page.locator('#ws-studio-open').count(),0);
    assert.equal(await page.locator('#profile-look-open').count(),0);
    const metrics=await page.evaluate(()=>{
      const rect=el=>{const r=el.getBoundingClientRect();return {
        x:+r.x.toFixed(2),y:+r.y.toFixed(2),width:+r.width.toFixed(2),height:+r.height.toFixed(2)
      }};
      const hero=document.querySelector('.hero');
      const portrait=document.querySelector('.hero-art .core');
      const quick=document.querySelector('#ws-visitor-quick-open');
      return {
        documentWidth:document.documentElement.scrollWidth,viewportWidth:innerWidth,
        documentHeight:document.documentElement.scrollHeight,
        hero:rect(hero),portrait:rect(portrait),
        orbitBadgeCount:document.querySelectorAll('.hero-art .ws-orbit-chip').length,
        auroraSectionPresent:!!document.querySelector('.ws-aurora-reference'),
        auroraSectionVisible:!!document.querySelector('.ws-aurora-reference') &&
          getComputedStyle(document.querySelector('.ws-aurora-reference')).display!=='none',
        quickActionsPresent:!!quick,
        quickActionsDocked:!!quick?.closest('.topbar')
      };
    });
    const image=await page.screenshot({fullPage,animations:'disabled',caret:'hide'});
    writeFileSync(join(output,filename),image);
    return {metrics,image};
  }finally{await context.close();}
}
async function main(){
  const source=obtainSnapshot();
  const saved=await serve(source),candidate=await serve(root);
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  try{
    for(const vp of VIEWPORTS){
      const id=vp.width+'x'+vp.height;
      const base=await screenshot(browser,saved.origin,vp,'editorial','editorial-'+id+'-GOLD.png');
      const now=await screenshot(browser,candidate.origin,vp,'editorial','editorial-'+id+'-candidate.png');
      const old=makePng(base.image),cur=makePng(now.image);
      const entry={
        viewport:id,baselineDimensions:dimensions(old),
        candidateDimensions:dimensions(cur),differenceRatio:1
      };
      if(old.width!==cur.width||old.height!==cur.height){
        report.problems.push('EDITORIAL SIZE CHANGED at '+id);
      }else{
        const diff=new PNG({width:old.width,height:old.height});
        const count=pixelmatch(old.data,cur.data,diff.data,old.width,old.height,
          {threshold:0.15,includeAA:false});
        entry.differenceRatio=count/(old.width*old.height);
        entry.changedPixels=count;
        writeFileSync(join(output,'editorial-'+id+'-DIFF.png'),PNG.sync.write(diff));
        if(entry.differenceRatio>0.001){
          report.problems.push('EDITORIAL VISUAL REGRESSION '+id+': '+(entry.differenceRatio*100).toFixed(3)+'%');
        }
      }
      report.editorial[id]=entry;
      console.log('EDITORIAL GOLD '+id,JSON.stringify(entry));
    }
    // Additional visual audit artifacts for all themes; no false claims
    // about WebStudio private demo screenshot equivalence.
    for(const theme of THEMES){
      for(const vp of GALLERY_VIEWPORTS){
        const id=vp.width+'x'+vp.height;
        const file=safeLabel(theme)+'-'+id+'.png';
        const item=await screenshot(browser,candidate.origin,vp,theme,file);
        const metrics=item.metrics;
        const expectedBadges=theme==='neon-studio'?5:theme==='design-2'?4:3;
        if(metrics.orbitBadgeCount!==expectedBadges)
          report.problems.push(theme+' '+id+' badge count differs');
        if(metrics.documentWidth>metrics.viewportWidth+3)
          report.problems.push(theme+' '+id+' horizontal overflow '+(metrics.documentWidth-metrics.viewportWidth));
        if(metrics.auroraSectionVisible!==(theme==='neon-studio') ||
           metrics.auroraSectionPresent!==(theme==='neon-studio'))
          report.problems.push(theme+' '+id+' cross-theme Aurora section mounting/leak');
        report.gallery.push({theme,viewport:id,file,metrics});
      }
      console.log('GALLERY COMPLETE '+theme);
    }
  }finally{
    await browser.close();
    await Promise.all([new Promise(r=>saved.server.close(r)),new Promise(r=>candidate.server.close(r))]);
  }
  writeFileSync(join(output,'results.json'),JSON.stringify(report,null,2)+'\n');
  console.log('Editorial and 24-shot gallery saved to visual-audit/; errors='+report.problems.length);
  assert.deepEqual(report.problems,[],report.problems.join('\n'));
}
main().catch(error=>{
  report.problems.push(String(error));
  writeFileSync(join(output,'results.json'),JSON.stringify(report,null,2)+'\n');
  console.error(error);
  process.exitCode=1;
});
