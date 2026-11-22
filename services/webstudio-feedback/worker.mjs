/* Cloudflare Worker: optional truthful developer-feedback receipt receiver.
   Deploy separately with RESEND_API_KEY, FEEDBACK_FROM and FEEDBACK_TO secrets.
   Configure ALLOWED_ORIGIN and TURNSTILE_SECRET_KEY. Never expose keys to client.
   The frontend's manual mailto attestation remains clearly unverified until deployed. */
export default {
 async fetch(request,env){
  const origin=request.headers.get('Origin')||'';
  const allow=env.ALLOWED_ORIGIN||'';
  const headers={'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store',
   'Vary':'Origin'};
  if(origin&&origin===allow)headers['Access-Control-Allow-Origin']=origin;
  const send=(status,data)=>new Response(JSON.stringify(data),{status,headers});
  if(request.method==='OPTIONS'){
   if(origin!==allow)return send(403,{error:'Origin not allowed'});
   return new Response(null,{status:204,headers:{...headers,'Access-Control-Allow-Methods':'POST, OPTIONS',
    'Access-Control-Allow-Headers':'content-type'}});
  }
  if(request.method!=='POST')return send(405,{error:'Method not allowed'});
  if(!allow||origin!==allow)return send(403,{error:'Origin not allowed'});
  if(!env.RESEND_API_KEY||!env.FEEDBACK_FROM||!env.FEEDBACK_TO||!env.TURNSTILE_SECRET_KEY)
   return send(503,{error:'Feedback delivery not configured'});
  const raw=await request.text();
  if(raw.length>8000)return send(413,{error:'Feedback request too large'});
  let body;
  try{body=JSON.parse(raw);}catch{return send(400,{error:'Invalid JSON'});}
  const clean=(value,max)=>typeof value==='string'?value.trim().slice(0,max):'';
  const theme=clean(body.theme,50),notes=clean(body.feedback,1801),email=clean(body.replyEmail,181);
  if(body.schemaVersion!==1||!['orbit','editorial','terminal'].includes(theme)||
     notes.length<60||notes.length>1800||
     email&&(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)||email.length>180))
    return send(400,{error:'Feedback validation failed'});
  const token=clean(body.turnstileToken,4096);
  if(!token)return send(400,{error:'Complete the CAPTCHA first'});
  const params=new URLSearchParams({secret:env.TURNSTILE_SECRET_KEY,response:token});
  const verify=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',
   {method:'POST',body:params,signal:AbortSignal.timeout(10000)});
  if(!verify.ok)return send(502,{error:'CAPTCHA verification unavailable'});
  const verdict=await verify.json();
  if(verdict.success!==true||verdict.hostname!==new URL(allow).hostname)
   return send(403,{error:'CAPTCHA challenge invalid for this website'});
  const message=['WebStudio Free tester feedback','Theme: '+theme,
    'Reply email (optional): '+(email||'Not supplied'),'',
    'Feedback:',notes].join('\n');
  const mail=await fetch('https://api.resend.com/emails',{method:'POST',
   headers:{'Authorization':'Bearer '+env.RESEND_API_KEY,'Content-Type':'application/json'},
   body:JSON.stringify({from:env.FEEDBACK_FROM,to:[env.FEEDBACK_TO],
    subject:'WebStudio Free detailed feedback · '+theme,text:message}),
   signal:AbortSignal.timeout(10000)});
  if(!mail.ok)return send(502,{error:'Feedback could not be delivered'});
  const result=await mail.json();
  if(typeof result?.id!=='string'||result.id.length<8)
   return send(502,{error:'Delivery provider did not acknowledge receipt'});
  // Receipt is emitted only after CAPTCHA and mail provider acceptance.
  return send(200,{accepted:true,receiptId:result.id});
 }
};
