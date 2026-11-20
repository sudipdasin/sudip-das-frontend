#!/usr/bin/env node
/** Read-only pre-cutover inspection; never changes DNS, hosting or secrets. */
import { resolveCname } from 'node:dns/promises';
export const DEFAULTS = Object.freeze({
 domain:'sudipdas.is-a.dev',
 pagesOrigin:'https://sudip-das-frontend.pages.dev',
 fallbackOrigin:'https://sudip-das-portfolio.grittyonyx10.chatgpt.site',
 apiHealth:'https://sudip-das-profile-api.sudipdasin.workers.dev/api/v1/health'
});
export function classifyResult(report) {
 const checks=Object.values(report.checks??{});
 return checks.length && checks.every(c=>c.ok===true) ? 'ready_for_manual_review' : 'blocked';
}
export function expectedPagesCname(pagesOrigin) {
 const u=new URL(pagesOrigin);
 if(u.protocol!=='https:'||u.pathname!=='/'||u.search||u.hash||u.username||u.password||!u.hostname.endsWith('.pages.dev')) throw new Error('Pages origin must be a bare HTTPS .pages.dev origin');
 return u.hostname;
}
async function timedFetch(url,opts={}) {
 return fetch(url,{redirect:'manual',signal:AbortSignal.timeout(10000),...opts});
}
function errorResult(error){return {ok:false,error:String(error?.message||error).slice(0,250)};}
export async function inspectSite(config=DEFAULTS,dependencies={}) {
 const {dns=resolveCname,request=timedFetch}=dependencies;
 const expected=expectedPagesCname(config.pagesOrigin);
 const checks={};
 try {
  const records=(await dns(config.domain)).map(v=>v.replace(/\.$/,'').toLowerCase());
  checks.dns={ok:records.includes(expected),expected,records};
 }catch(error){checks.dns=errorResult(error);}
 for(const [name,url] of [['pages',config.pagesOrigin],['fallback',config.fallbackOrigin],['api',config.apiHealth]]){
  try{
   const res=await request(url,{method:'GET'});
   checks[name]={ok:res.status===200,status:res.status,...(res.headers?.get?.('location')?{redirect:res.headers.get('location')}:{})};
   if(name==='api'&&res.status===200){
    try {const body=await res.json();checks.api.ok=body.ok===true;}
    catch {checks.api.ok=false;checks.api.error='Health endpoint did not return valid JSON';}
   }
  }catch(error){checks[name]=errorResult(error);}
 }
 const report={checkedAt:new Date().toISOString(),domain:config.domain,expectedTarget:expected,checks};
 return {...report,status:classifyResult(report),note:'Read-only checks only; does not verify Pages domain attachment, Turnstile, CORS, email, or custom-domain TLS.'};
}
if(process.argv[1]&&import.meta.url===new URL('file://'+process.argv[1]).href){
 inspectSite().then(report=>{console.log(JSON.stringify(report,null,2));if(report.status!=='ready_for_manual_review')process.exitCode=1;}).catch(error=>{console.error(String(error));process.exitCode=2;});
}
