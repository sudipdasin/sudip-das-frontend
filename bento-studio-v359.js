/* Obsidian Bento: additive freelancer composition. Original portrait, actions,
   projects and contact routes remain authoritative. No new network requests. */
(()=>{'use strict';
 if(window.PORTFOLIO_PREVIEW_MODE!==true||window.__wsBento359)return;
 const doc=document,body=doc.body,hero=doc.querySelector('main>.hero'),art=hero?.querySelector('.hero-art');
 if(!hero||!art)return;
 const make=(tag,cls,txt)=>{const e=doc.createElement(tag);if(cls)e.className=cls;if(txt)e.textContent=txt;return e};
 const tile=(id,cls,label)=>{const e=make('article','bt-tile '+cls);e.dataset.bentoTile=id;e.append(make('span','bt-kicker',label));return e};
 const link=(txt,href)=>{const a=make('a','bt-link',txt+' ↗');a.href=href;return a};
 const h=(t)=>make('h2','bt-title',t);
 const p=(t)=>make('p','bt-copy',t);
 const proof=tile('proof','bt-proof','Experience / impact');
 proof.append(make('div','bt-stat','1,000+'),p('CRM users supported across regions'),link('Professional experience','#experience'));
 const intro=tile('intro','bt-intro','Meet the builder');
 const play=make('button','bt-play','▶');play.type='button';play.setAttribute('aria-label','Play professional introduction');
 intro.append(make('div','bt-video-art'),play,h('Professional introduction'));
 play.addEventListener('click',()=>{const trigger=hero.querySelector('.pv-intro-tile .pv-intro-expand')||hero.querySelector('.pv-intro-tile .pv-intro-hero-cta');if(trigger){trigger.click();hero.querySelector('.pv-intro-tile')?.scrollIntoView({block:'nearest',behavior:'instant'})}else{play.disabled=true;play.setAttribute('aria-label','Introduction unavailable');play.textContent='—'}});
 const services=tile('services','bt-services','Freelance collaboration');
 services.append(h('Practical systems. Better workflows.'),p('CRM & SQL · Linux tools · Automation · Technical support'),link('Explore capabilities','#capabilities'));
 const work=tile('work','bt-work','Selected work');
 work.append(make('div','bt-project-art'),h('Independent software'),p('Linux desktop and creative applications'),link('Explore projects','#projects'));
 const contact=tile('contact','bt-contact','Have a project in mind?');
 contact.append(h('Let’s build something useful.'),p('Discuss scope, goals and a tailored project estimate.'),link('Start a conversation','#contact'));
 const tiles=[proof,intro,services,work,contact];for(const t of tiles){t.hidden=true;hero.append(t)}
 const policy=()=>{const tier=body.dataset.atmosphereTier||'off';const safety=window.__wsAtmosphere328?.getShapeMotionPolicy?.();return {tier,running:body.dataset.theme==='bento'&&Boolean(safety?.animated)&&doc.visibilityState!=='hidden'}};
 let active=false,raf=0;
 let previousLabel=null;const photoLabel='Original profile photograph';
 function sync(){const introTrigger=hero.querySelector('.pv-intro-tile .pv-intro-expand')||hero.querySelector('.pv-intro-tile .pv-intro-hero-cta');play.disabled=!introTrigger;play.setAttribute('aria-label',introTrigger?'Play professional introduction':'Introduction unavailable');play.textContent=introTrigger?'▶':'—';const enabled=body.dataset.theme==='bento';const state=policy();if(enabled!==active){active=enabled;for(const t of tiles)t.hidden=!active;if(active){previousLabel=art.getAttribute('aria-label');art.setAttribute('aria-label',photoLabel)}else if(art.getAttribute('aria-label')===photoLabel){if(previousLabel===null)art.removeAttribute('aria-label');else art.setAttribute('aria-label',previousLabel)}}
 if(active){hero.dataset.bentoMotion=state.running?'running':'static';hero.dataset.bentoQuality=state.tier}else{delete hero.dataset.bentoMotion;delete hero.dataset.bentoQuality}}
 hero.addEventListener('pointermove',e=>{if(!active||!policy().running||raf||e.pointerType==='touch')return;const card=e.target.closest('.bt-tile');if(!card)return;const r=card.getBoundingClientRect(),x=Math.max(0,Math.min(100,(e.clientX-r.left)/Math.max(1,r.width)*100)),y=Math.max(0,Math.min(100,(e.clientY-r.top)/Math.max(1,r.height)*100));raf=requestAnimationFrame(()=>{raf=0;if(active){card.style.setProperty('--bt-x',x+'%');card.style.setProperty('--bt-y',y+'%')}})},{passive:true});
 const observer=new MutationObserver(sync);observer.observe(body,{attributes:true,attributeFilter:['data-theme','data-atmosphere-tier']});
 window.addEventListener('ws-atmosphere-change',sync);doc.addEventListener('visibilitychange',sync);sync();
 window.__wsBento359=Object.freeze({getStatus:()=>({theme:'bento',active,tiles:tiles.length+2,atmosphere:policy(),originalPortrait:true}),refresh:sync});
})();