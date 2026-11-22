/* No payments on demo hosting. Only a verified merchant's external hosted checkout can be enabled later. */
(function(root){
 'use strict';
 const allowed={stripe:['buy.stripe.com'],razorpay:['rzp.io','pages.razorpay.com']};
 function validateCheckout(config,host){
   if(!config || config.schemaVersion!==1 || config.enabled!==true)return {ready:false,reason:'Checkout is not activated. No payments are being accepted.'};
   if(!Object.hasOwn(allowed,config.provider))return {ready:false,reason:'Unsupported hosted checkout provider.'};
   if(typeof host!=='string'||/(.github.io|.pages.github.io)$/i.test(host))return {ready:false,reason:'Commercial checkout cannot be enabled on GitHub Pages.'};
   let url;
   try{url=new URL(config.checkoutUrl);}catch{return {ready:false,reason:'Missing merchant checkout URL.'};}
   if(url.protocol!=='https:'||url.username||url.password||!allowed[config.provider].includes(url.hostname.toLowerCase()))return {ready:false,reason:'Unverified hosted payment destination.'};
   if(!url.pathname || url.pathname==='/')return {ready:false,reason:'Checkout must point to a specific merchant-created payment page.'};
   return {ready:true,url:url.href,provider:config.provider};
 }
 const api=Object.freeze({validateCheckout});
 if(typeof module!=='undefined'&&module.exports)module.exports=api;
 if(!root||!root.document)return;
 const button=root.document.getElementById('checkout-button'),status=root.document.getElementById('checkout-status');
 let destination=null;
 root.fetch('./commerce.json',{cache:'no-store'}).then(r=>{if(!r.ok)throw Error('Configuration not available');return r.json();}).then(config=>{
  const result=validateCheckout(config,root.location.hostname);
  if(!result.ready){status.textContent=result.reason;return;}
  destination=result.url;button.disabled=false;button.textContent='Continue to secure checkout';
  status.textContent='You will be redirected to an independent hosted payment page. Verify the seller and amount before paying.';
 }).catch(()=>{status.textContent='Checkout is unavailable. No payments are being accepted.';});
 button.addEventListener('click',()=>{if(destination&&button.disabled===false)root.location.assign(destination);});
})(typeof window!=='undefined'?window:undefined);
