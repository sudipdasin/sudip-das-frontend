/* Cloudflare Pages Functions: optional WebStudio lead intake.
 * SECURE BY DEFAULT — requires EXPLICIT preview-only environment enablement,
 * Turnstile, a dedicated D1 rate limiter, and a signed owner mail bridge.
 * No secret, API credential, personal email destination or D1 binding is
 * bundled in the static HTML. Production and other branch hosts are denied.
 */
const PREVIEW_HOST='preview-personalweb.sudip-das-frontend.pages.dev';
const PREVIEW_ORIGIN='https://'+PREVIEW_HOST;
const MAX_BODY=4096;
const WINDOW_SECONDS=3600;
const PER_WINDOW=3;
const headers={
 'content-type':'application/json; charset=utf-8',
 'cache-control':'no-store',
 'x-content-type-options':'nosniff',
 'referrer-policy':'no-referrer',
 'vary':'Origin'
};
function respond(payload,status=200){
 return new Response(JSON.stringify(payload),{status,headers});
}
function ready(env){
 return env.WEBSTUDIO_INTEREST_ENABLED==='true' &&
  env.WEBSTUDIO_INTEREST_APPROVED_HOST===PREVIEW_HOST &&
  typeof env.MAIL_BRIDGE_URL==='string' &&
  /^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(env.MAIL_BRIDGE_URL) &&
  typeof env.MAIL_BRIDGE_SECRET==='string'&&env.MAIL_BRIDGE_SECRET.length>=24 &&
  typeof env.OWNER_EMAIL==='string'&&/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(env.OWNER_EMAIL) &&
  typeof env.TURNSTILE_SECRET_KEY==='string'&&!!env.TURNSTILE_SECRET_KEY &&
  typeof env.WEBSTUDIO_RATE_SALT==='string'&&env.WEBSTUDIO_RATE_SALT.length>=24 &&
  typeof env.INTEREST_DB?.prepare==='function';
}
function cleanEmail(value){
 if(typeof value!=='string'||value.length>254)return null;
 const email=value.trim().toLowerCase();
 return email.length<=254&&/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,63}$/.test(email)?email:null;
}
async function limitedBody(request){
 const reader=request.body?.getReader();
 if(!reader)throw Error('empty_body');
 const chunks=[];let size=0;
 for(;;){
  const {done,value}=await reader.read();
  if(done)break;
  size+=value.byteLength;
  if(size>MAX_BODY){await reader.cancel().catch(()=>{});throw Error('too_large');}
  chunks.push(value);
 }
 const body=new Uint8Array(size);let offset=0;
 for(const chunk of chunks){body.set(chunk,offset);offset+=chunk.byteLength;}
 return JSON.parse(new TextDecoder().decode(body));
}
async function verifyTurnstile(secret,token,ip){
 if(typeof token!=='string'||token.length<10||token.length>3000)return false;
 const params=new URLSearchParams({secret,response:token});
 if(ip)params.set('remoteip',ip);
 const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
  method:'POST',body:params,redirect:'error'
 });
 if(!response.ok)return false;
 const result=await response.json();
 return result.success===true &&
  result.hostname===PREVIEW_HOST &&
  result.action==='webstudio-interest';
}
async function hashKey(secret,key){
 const bytes=new TextEncoder().encode(secret+':'+key);
 const hash=await crypto.subtle.digest('SHA-256',bytes);
 return [...new Uint8Array(hash)].map(x=>x.toString(16).padStart(2,'0')).join('');
}
async function checkRate(env,ip,email){
 const bucket=Math.floor(Date.now()/1000/WINDOW_SECONDS);
 const statements=[
  'ip:'+await hashKey(env.WEBSTUDIO_RATE_SALT,'ip:'+ip),
  'email:'+await hashKey(env.WEBSTUDIO_RATE_SALT,'email:'+email)
 ];
 for(const key of statements){
  const row=await env.INTEREST_DB.prepare(
   'INSERT INTO webstudio_interest_limits (subject_hash,bucket,count) VALUES (?,?,1) '+
   'ON CONFLICT(subject_hash,bucket) DO UPDATE SET count=count+1 WHERE count < ? '+
   'RETURNING count'
  ).bind(key,bucket,PER_WINDOW).first();
  if(!row)return false;
 }
 // Best-effort retention; only hashed identity counters are persisted.
 await env.INTEREST_DB.prepare(
  'DELETE FROM webstudio_interest_limits WHERE bucket < ?'
 ).bind(bucket-24).run();
 return true;
}
function htmlEscape(s){
 return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
async function sendMail(env,email){
 const subject='WebStudio interest from your portfolio';
 const message='A visitor has expressed interest in WebStudio.\n\nTheir email: '+email+
  '\nSource: protected personal website preview\n\nYou may reply directly to the visitor.';
 const payload=JSON.stringify({
  version:1,sentAt:Date.now(),nonce:crypto.randomUUID(),
  to:env.OWNER_EMAIL,replyTo:email,subject,text:message,
  html:'<div style="font-family:Arial,sans-serif"><h2>WebStudio interest</h2>'+
   '<p>A visitor from your personal preview is interested in WebStudio.</p>'+
   '<p><b>Reply address:</b> '+htmlEscape(email)+'</p>'+
   '<p>Reply directly to this message to follow up.</p></div>',
  attachments:[]
 });
 const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(env.MAIL_BRIDGE_SECRET),
  {name:'HMAC',hash:'SHA-256'},false,['sign']);
 const signed=await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(payload));
 const sig=[...new Uint8Array(signed)].map(v=>v.toString(16).padStart(2,'0')).join('');
 const response=await fetch(env.MAIL_BRIDGE_URL,{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({payload,signature:sig}),redirect:'follow'
 });
 const result=await response.json().catch(()=>null);
 return response.ok&&result?.ok===true;
}
export async function onRequestPost({request,env}){
 try{
  const url=new URL(request.url);
  if(url.hostname!==PREVIEW_HOST||request.headers.get('Origin')!==PREVIEW_ORIGIN)
   return respond({ok:false,error:'origin_not_allowed'},403);
  if(!ready(env))return respond({ok:false,error:'service_not_configured'},503);
  if(!request.headers.get('content-type')?.toLowerCase().startsWith('application/json'))
   return respond({ok:false,error:'unsupported_media_type'},415);
  const input=await limitedBody(request).catch(()=>null);
  if(!input||typeof input!=='object')return respond({ok:false,error:'invalid_request'},400);
  // Honeypot is not a credential; never assume it replaces Turnstile.
  if(input.website)return respond({ok:false,error:'invalid_request'},400);
  const email=cleanEmail(input.email);
  if(!email)return respond({ok:false,error:'invalid_email'},400);
  const ip=request.headers.get('CF-Connecting-IP')||'unknown';
  if(!await verifyTurnstile(env.TURNSTILE_SECRET_KEY,input.turnstileToken,ip))
   return respond({ok:false,error:'captcha_failed'},400);
  if(!await checkRate(env,ip,email))return respond({ok:false,error:'rate_limited'},429);
  if(!await sendMail(env,email))return respond({ok:false,error:'mail_delivery_failed'},502);
  return respond({ok:true,status:'delivered'},202);
 }catch{
  // No sensitive backend exception detail is exposed to the browser.
  return respond({ok:false,error:'service_unavailable'},503);
 }
}
export function onRequestGet(){
 return respond({ok:false,error:'method_not_allowed'},405);
}
