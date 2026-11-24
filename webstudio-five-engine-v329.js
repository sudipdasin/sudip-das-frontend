/* WebStudio Five-Engine Integration v3.29.0
 * Preview-only, visitor-safe, additive enhancement over the existing five engines.
 * No remote requests, privileged settings, automatic audits, or background telemetry.
 * Every new visible string is localized in all 10 supported languages.
 */
(() => {
 'use strict';
 if(window.PORTFOLIO_PREVIEW_MODE!==true || window.__wsFiveEngines329)return;
 const body=document.body;
 const picker=document.getElementById('theme-select');
 const hero=document.querySelector('main>.hero');
 const heading=hero?.querySelector('.hero-text');
 const quick=document.querySelector('.pv-hub-pane#pv-hub-panel-tools');
 const projectPanel=document.querySelector('#projects .project-discovery');
 if(!body||!picker||!hero||!heading||!quick||!projectPanel)return;
 const THEMES=Object.freeze({
  orbit:{name:'Orbit',symbol:'◎',motif:'orbital',palette:['#75efdb','#173b49','#dbfbf5']},
  editorial:{name:'Editorial',symbol:'◇',motif:'folio',palette:['#805337','#fbf4e8','#3a312c']},
  terminal:{name:'Terminal',symbol:'▣',motif:'console',palette:['#73ffa9','#091c15','#e4ffee']},
  'aurora-peak':{name:'Aurora Peak',symbol:'△',motif:'alpine',palette:['#dce8ad','#193c33','#f4f7e8']},
  'neon-studio':{name:'Neon Studio',symbol:'✧',motif:'atelier',palette:['#61f5e4','#0d283c','#edfaff']},
  'design-2':{name:'Cosmic',symbol:'✦',motif:'constellation',palette:['#d2c0ff','#171938','#f6f2ff']}
 });
 const IDS=Object.keys(THEMES),MODES=['auto','cinematic','balanced','eco','off'];
 const LOCALES=['en','hi','bn','es','fr','de','pt','ar','zh-CN','ja'];
 const T={
  en:['Creative direction','Five connected engines','Theme','Hero display','Atmosphere','Quick menu','Portfolio','Explore themes','View introduction','Atmosphere settings','Guided tour','Find projects','Available','Unavailable','Engine controls','Visitor-safe preview tools','Projects shown','No projects match. Clear the filters.','Clear filters','Run six-theme check','Export check JSON','Check pending','Checking themes','Checks passed','Checks failed','All six themes','Quality','View projects','Presentation identity','Current theme','Theme selection applies to all five engines','Manual browser check only; not a security audit','No hosted CI was run','Close quick menu'],
  hi:['रचनात्मक दिशा','पाँच जुड़े इंजन','थीम','हीरो प्रदर्शन','वातावरण','त्वरित मेनू','पोर्टफोलियो','थीम देखें','परिचय देखें','वातावरण सेटिंग्स','निर्देशित भ्रमण','प्रोजेक्ट खोजें','उपलब्ध','अनुपलब्ध','इंजन नियंत्रण','आगंतुकों के लिए सुरक्षित पूर्वावलोकन','दिखाए गए प्रोजेक्ट','कोई प्रोजेक्ट नहीं मिला। फ़िल्टर हटाएँ।','फ़िल्टर हटाएँ','छह थीम जाँचें','जाँच JSON निर्यात करें','जाँच लंबित','थीम जाँची जा रही हैं','जाँच पास','जाँच विफल','सभी छह थीम','गुणवत्ता','प्रोजेक्ट देखें','प्रस्तुति की पहचान','वर्तमान थीम','थीम का चयन पाँचों इंजन पर लागू होता है','केवल मैन्युअल ब्राउज़र जाँच; सुरक्षा ऑडिट नहीं','होस्टेड CI नहीं चला','त्वरित मेनू बंद करें'],
  bn:['সৃজনশীল দিকনির্দেশ','পাঁচটি সংযুক্ত ইঞ্জিন','থিম','হিরো প্রদর্শন','আবহ','দ্রুত মেনু','পোর্টফোলিও','থিম দেখুন','পরিচিতি দেখুন','আবহ সেটিংস','নির্দেশিত ভ্রমণ','প্রকল্প খুঁজুন','উপলব্ধ','অনুপলব্ধ','ইঞ্জিন নিয়ন্ত্রণ','দর্শকের জন্য নিরাপদ প্রিভিউ','দেখানো প্রকল্প','কোনো প্রকল্প মেলেনি। ফিল্টার সরান।','ফিল্টার সরান','ছয়টি থিম পরীক্ষা করুন','পরীক্ষার JSON রপ্তানি','পরীক্ষা বাকি','থিম পরীক্ষা হচ্ছে','পরীক্ষায় উত্তীর্ণ','পরীক্ষায় ব্যর্থ','ছয়টি থিমই','মান','প্রকল্প দেখুন','উপস্থাপনার পরিচয়','বর্তমান থিম','থিম নির্বাচন পাঁচটি ইঞ্জিনেই প্রযোজ্য','শুধু ম্যানুয়াল ব্রাউজার পরীক্ষা; নিরাপত্তা নিরীক্ষা নয়','হোস্টেড CI চালানো হয়নি','দ্রুত মেনু বন্ধ করুন'],
  es:['Dirección creativa','Cinco motores conectados','Tema','Presentación principal','Atmósfera','Menú rápido','Portafolio','Explorar temas','Ver introducción','Ajustes de atmósfera','Visita guiada','Buscar proyectos','Disponible','No disponible','Controles de motores','Herramientas de vista previa seguras','Proyectos mostrados','No hay proyectos coincidentes. Borra los filtros.','Borrar filtros','Comprobar los seis temas','Exportar JSON de comprobación','Comprobación pendiente','Comprobando temas','Pruebas superadas','Pruebas fallidas','Los seis temas','Calidad','Ver proyectos','Identidad visual','Tema actual','El tema se aplica a los cinco motores','Solo revisión manual del navegador; no es auditoría de seguridad','No se ejecutó CI alojada','Cerrar menú rápido'],
  fr:['Direction créative','Cinq moteurs connectés','Thème','Présentation principale','Atmosphère','Menu rapide','Portfolio','Explorer les thèmes','Voir la présentation','Réglages de l’atmosphère','Visite guidée','Rechercher des projets','Disponible','Indisponible','Commandes des moteurs','Outils d’aperçu sécurisés','Projets affichés','Aucun projet trouvé. Effacez les filtres.','Effacer les filtres','Vérifier les six thèmes','Exporter le JSON du contrôle','Contrôle en attente','Vérification des thèmes','Contrôles réussis','Contrôles échoués','Les six thèmes','Qualité','Voir les projets','Identité visuelle','Thème actuel','Le thème s’applique aux cinq moteurs','Contrôle manuel du navigateur uniquement ; pas un audit de sécurité','Aucune CI hébergée exécutée','Fermer le menu rapide'],
  de:['Kreative Ausrichtung','Fünf verbundene Engines','Design','Hero-Darstellung','Atmosphäre','Schnellmenü','Portfolio','Designs entdecken','Einführung ansehen','Atmosphäre einstellen','Geführte Tour','Projekte finden','Verfügbar','Nicht verfügbar','Engine-Steuerung','Sichere Besucher-Vorschau','Angezeigte Projekte','Keine passenden Projekte. Filter zurücksetzen.','Filter löschen','Sechs Designs prüfen','Prüf-JSON exportieren','Prüfung ausstehend','Designs werden geprüft','Prüfungen bestanden','Prüfungen fehlgeschlagen','Alle sechs Designs','Qualität','Projekte ansehen','Visuelle Identität','Aktuelles Design','Das Design gilt für alle fünf Engines','Nur manuelle Browserprüfung; kein Sicherheitsaudit','Keine gehostete CI ausgeführt','Schnellmenü schließen'],
  pt:['Direção criativa','Cinco motores conectados','Tema','Apresentação principal','Atmosfera','Menu rápido','Portfólio','Explorar temas','Ver introdução','Configurações de atmosfera','Visita guiada','Buscar projetos','Disponível','Indisponível','Controles dos motores','Ferramentas seguras de prévia','Projetos exibidos','Nenhum projeto encontrado. Limpe os filtros.','Limpar filtros','Verificar seis temas','Exportar JSON da verificação','Verificação pendente','Verificando temas','Verificações aprovadas','Verificações falharam','Todos os seis temas','Qualidade','Ver projetos','Identidade visual','Tema atual','O tema se aplica aos cinco motores','Somente verificação manual do navegador; não é auditoria de segurança','Nenhuma CI hospedada foi executada','Fechar menu rápido'],
  ar:['الاتجاه الإبداعي','خمسة محركات مترابطة','السمة','عرض المقدمة','الأجواء','القائمة السريعة','معرض الأعمال','استكشف السمات','عرض المقدمة','إعدادات الأجواء','جولة إرشادية','ابحث عن المشاريع','متاح','غير متاح','عناصر تحكم المحركات','أدوات معاينة آمنة للزوار','المشاريع المعروضة','لا توجد مشاريع مطابقة. امسح عوامل التصفية.','مسح التصفية','فحص السمات الست','تصدير ملف JSON للفحص','الفحص معلّق','جارٍ فحص السمات','فحوص ناجحة','فحوص فاشلة','جميع السمات الست','الجودة','عرض المشاريع','الهوية المرئية','السمة الحالية','اختيار السمة يسري على المحركات الخمسة','فحص يدوي للمتصفح فقط؛ ليس تدقيقاً أمنياً','لم تُشغّل خدمات CI المستضافة','إغلاق القائمة السريعة'],
  'zh-CN':['创意方向','五个联动引擎','主题','首屏展示','氛围','快捷菜单','作品集','探索主题','查看简介','氛围设置','引导浏览','查找项目','可用','不可用','引擎控制','访客安全预览工具','显示的项目','没有匹配的项目。请清除筛选。','清除筛选','检查六种主题','导出检查 JSON','待检查','正在检查主题','通过的检查','失败的检查','全部六种主题','质量','查看项目','视觉标识','当前主题','主题选择适用于全部五个引擎','仅供手动浏览器检查；并非安全审计','未运行托管 CI','关闭快捷菜单'],
  ja:['クリエイティブ方針','連携する５つのエンジン','テーマ','ヒーロー表示','雰囲気','クイックメニュー','ポートフォリオ','テーマを見る','紹介を見る','雰囲気の設定','ガイドツアー','作品を探す','利用可能','利用不可','エンジン操作','訪問者向け安全なプレビュー','表示中の作品','一致する作品がありません。条件を解除してください。','条件を解除','６テーマを検査','検査JSONを出力','検査待ち','テーマを検査中','合格した検査','失敗した検査','６つすべてのテーマ','品質','作品を見る','表示の個性','現在のテーマ','テーマ選択は５つのエンジンすべてに反映','手動ブラウザ検査のみ。セキュリティ監査ではありません','ホスト型CIは実行していません','クイックメニューを閉じる']
 };
 const DESCRIPTIONS={
  en:['Systems in motion','Ideas in practice','Command-line clarity','Mountain field notes','Digital atelier','Creative constellation'],
  hi:['गतिशील प्रणालियाँ','विचारों का अभ्यास','कमांड लाइन की स्पष्टता','पहाड़ों के अनुभव','डिजिटल स्टूडियो','रचनात्मक तारामंडल'],
  bn:['গতিশীল ব্যবস্থা','বাস্তবে ধারণা','কমান্ড লাইনের স্বচ্ছতা','পাহাড়ের দিনলিপি','ডিজিটাল স্টুডিও','সৃজনশীল নক্ষত্রমণ্ডল'],
  es:['Sistemas en movimiento','Ideas en práctica','Claridad de terminal','Notas de montaña','Atelier digital','Constelación creativa'],
  fr:['Systèmes en mouvement','Idées en pratique','Clarté du terminal','Carnet de montagne','Atelier numérique','Constellation créative'],
  de:['Systeme in Bewegung','Ideen in der Praxis','Klarheit im Terminal','Notizen aus den Bergen','Digitales Atelier','Kreative Konstellation'],
  pt:['Sistemas em movimento','Ideias na prática','Clareza no terminal','Notas da montanha','Ateliê digital','Constelação criativa'],
  ar:['أنظمة في حركة','أفكار قيد التطبيق','وضوح الطرفية','مذكرات الجبال','استوديو رقمي','كوكبة إبداعية'],
  'zh-CN':['动态系统','实践中的创意','终端式清晰表达','山间札记','数字创作室','创意星座'],
  ja:['動き続けるシステム','実践するアイデア','端末の明快さ','山のフィールドノート','デジタルアトリエ','創造の星座']
 };
 const MODE_LABEL={
  en:['Auto','Cinematic','Balanced','Eco','Off'],hi:['स्वतः','सिनेमाई','संतुलित','इको','बंद'],bn:['স্বয়ংক্রিয়','সিনেমাটিক','ভারসাম্যপূর্ণ','সাশ্রয়ী','বন্ধ'],
  es:['Automático','Cinemático','Equilibrado','Eco','Desactivado'],fr:['Auto','Cinématique','Équilibré','Éco','Désactivé'],de:['Automatisch','Filmisch','Ausgewogen','Sparsam','Aus'],
  pt:['Automático','Cinemático','Equilibrado','Eco','Desligado'],ar:['تلقائي','سينمائي','متوازن','اقتصادي','إيقاف'],'zh-CN':['自动','电影级','平衡','节能','关闭'],ja:['自動','シネマ','バランス','省電力','オフ']
 };
 const K=['direction','connected','theme','hero','atmosphere','quick','portfolio','browse','intro','settings','tour','find','available','unavailable','controls','safe','shown','empty','clear','run','export','pending','running','passed','failed','all','quality','projects','identity','current','linked','disclaimer','noCI','close'];
 const ix=Object.fromEntries(K.map((k,i)=>[k,i]));
 let locale='en',running=false,lastAudit=null,renderQueued=false;
 const e=(tag,cls,text)=>{
  const n=document.createElement(tag);
  if(cls)n.className=cls;
  if(text!==undefined)n.textContent=text;
  return n;
 };
 const tr=(key)=>{const n=ix[key];return (T[locale]||T.en)?.[n]||T.en[n]||key};
 const desc=(theme)=>{const idx=IDS.indexOf(theme);return (DESCRIPTIONS[locale]||DESCRIPTIONS.en)[idx]||''};
 const modeLabel=(m)=>{const idx=MODES.indexOf(m);return (MODE_LABEL[locale]||MODE_LABEL.en)[idx]||m};
 function currentTheme(){return THEMES[body.dataset.theme]?body.dataset.theme:(THEMES[picker.value]?picker.value:'neon-studio')}
 const card=e('div','ws29-hero-dossier');
 card.id='ws29-hero-dossier';
 card.setAttribute('role','note');
 const symbol=e('span','ws29-hero-symbol');symbol.setAttribute('aria-hidden','true');
 const caption=e('div','ws29-dossier-copy');
 const kicker=e('span','ws29-dossier-kicker');
 const slogan=e('strong','ws29-dossier-descriptor');
 caption.append(kicker,slogan);card.append(symbol,caption);
 const place=heading.querySelector('.location');
 if(place)place.before(card);else heading.append(card);
 const rack=e('section','ws29-engine-rack');
 rack.id='ws29-engine-rack';
 const rackHeading=e('h3','ws29-engine-heading');rackHeading.id='ws29-engine-heading';
 rack.setAttribute('aria-labelledby',rackHeading.id);
 const rackSub=e('p','ws29-engine-sub');
 const engines=e('div','ws29-engine-grid');
 const buttons={};
 const actions=[
  ['hero','intro',()=>document.getElementById('top')?.scrollIntoView({behavior:motionSafe()?'auto':'smooth',block:'start'})],
  ['atmosphere','settings',()=>{const control=document.getElementById('ws-atmosphere-control');const sum=control?.querySelector('summary');if(control&&sum){const quickPanel=document.getElementById('ws-visitor-quick-panel');if(quickPanel&&!quickPanel.hidden)document.getElementById('ws-visitor-quick-open')?.click();control.open=true;sum.focus({preventScroll:true});control.scrollIntoView({block:'nearest'});}}],
  ['theme','browse',()=>document.getElementById('pv-theme-launch')?.click()],
  ['quick','tour',()=>document.getElementById('ws-tour-start')?.click()],
  ['portfolio','find',()=>{const trigger=document.getElementById('ws-visitor-quick-open');const panel=document.getElementById('ws-visitor-quick-panel');if(panel&&!panel.hidden)trigger?.click();window.__wsPortfolio328?.focusSearch?.();}]
 ];
 for(const [key,title,action] of actions){
  const b=e('button','ws29-engine-action');
  b.type='button';b.dataset.engine=key;
  const name=e('strong'),state=e('small');
  b.append(name,state);
  b.addEventListener('click',action);
  engines.append(b);buttons[key]={button:b,name,state,title};
 }
 const meter=e('div','ws29-atmo-meter');
 const meterLabel=e('label','ws29-meter-label');meterLabel.htmlFor='ws29-atmo-quality';
 const meterSelect=e('select','ws29-atmo-quality');meterSelect.id='ws29-atmo-quality';
 for(const m of MODES){const o=e('option');o.value=m;meterSelect.append(o);}
 meterSelect.addEventListener('change',()=>{
  if(typeof window.__wsAtmosphere328?.setMode==='function')window.__wsAtmosphere328.setMode(meterSelect.value);
  queueRender();
 });
 meter.append(meterLabel,meterSelect);
 const auditButtons=e('div','ws29-audit-actions');
 const run=e('button','ws29-audit-button');
 run.type='button';
 const exportButton=e('button','ws29-audit-export');
 exportButton.type='button';exportButton.disabled=true;
 auditButtons.append(run,exportButton);
 const output=e('p','ws29-audit-output');
 output.setAttribute('role','status');output.setAttribute('aria-live','polite');
 const disclaimer=e('p','ws29-audit-disclaimer');
 rack.append(rackHeading,rackSub,engines,meter,auditButtons,output,disclaimer);
 quick.append(rack);
 const summary=e('div','ws29-project-summary');
 summary.setAttribute('role','status');
 const summaryText=e('span','ws29-project-counter');
 const emptyButton=e('button','ws29-clear-empty');
 emptyButton.type='button';
 emptyButton.hidden=true;
 emptyButton.addEventListener('click',()=>{
  window.__wsPortfolio328?.reset?.();
  window.__wsPortfolio328?.focusSearch?.();
 });
 summary.append(summaryText,emptyButton);
 projectPanel.append(summary);
 function motionSafe(){return Boolean(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches)}
 function have(key){
  if(key==='hero')return Boolean(window.__wsHeroDisplay327?.getStatus&&hero.classList.contains('hd-hero'));
  if(key==='atmosphere')return Boolean(window.__wsAtmosphere328?.getStatus&&document.getElementById('ws-atmosphere-control'));
  if(key==='theme')return Boolean(window.__wsEngineMesh328?.getStatus&&document.getElementById('pv-theme-launch'));
  if(key==='quick')return Boolean(document.getElementById('ws-visitor-quick-panel')&&document.getElementById('ws-tour-start'));
  if(key==='portfolio')return Boolean(window.__wsPortfolio328?.getStatus&&document.getElementById('portfolio-project-search'));
  return false;
 }
 function render(){
  renderQueued=false;
  const next=window.profileI18n?.locale;
  locale=LOCALES.includes(next)?next:'en';
  const theme=currentTheme(),profile=THEMES[theme];
  body.dataset.ws29Theme=theme;
  body.dataset.ws29Motif=profile.motif;
  body.style.setProperty('--ws29-accent',profile.palette[0]);
  body.style.setProperty('--ws29-panel',profile.palette[1]);
  body.style.setProperty('--ws29-ink',profile.palette[2]);
  symbol.textContent=profile.symbol;
  kicker.textContent=tr('direction')+' · '+profile.name;
  slogan.textContent=desc(theme);
  card.setAttribute('aria-label',tr('identity')+': '+profile.name+'. '+desc(theme));
  rackHeading.textContent=tr('controls');
  rackSub.textContent=tr('connected')+' · '+tr('all');
  for(const [key,button]of Object.entries(buttons)){
   button.name.textContent=tr(button.title);
   const available=have(key);
   button.state.textContent=available?tr('available'):tr('unavailable');
   button.button.disabled=!available;
   button.button.setAttribute('aria-label',tr(key)+' — '+tr(button.title));
   button.button.dataset.ready=String(available);
  }
  meterLabel.textContent=tr('quality');
  const atmo=window.__wsAtmosphere328?.getStatus?.();
  meterSelect.disabled=!have('atmosphere');
  meterSelect.value=MODES.includes(atmo?.mode)?atmo.mode:'auto';
  [...meterSelect.options].forEach((o,i)=>o.textContent=modeLabel(MODES[i]));
  run.textContent=tr('run');run.disabled=running;
  exportButton.textContent=tr('export');exportButton.disabled=!lastAudit||running;
  if(!lastAudit&&!running)output.textContent=tr('pending');
  disclaimer.textContent=tr('disclaimer')+' · '+tr('noCI');
  const counts=window.__wsPortfolio328?.getStatus?.();
  if(counts){
   summaryText.textContent=counts.shown+' / '+counts.total+' · '+tr('shown');
   emptyButton.textContent=tr('clear');emptyButton.hidden=counts.shown!==0;
   if(counts.shown===0)summaryText.textContent=tr('empty');
  }
 }
 function queueRender(){
  if(renderQueued)return;
  renderQueued=true;
  if(typeof requestAnimationFrame==='function')requestAnimationFrame(render);
  else Promise.resolve().then(render);
 }
 async function settle(){
  await new Promise(resolve=>(window.requestAnimationFrame||((fn)=>Promise.resolve().then(fn)))(()=>resolve()));
  await new Promise(resolve=>(window.requestAnimationFrame||((fn)=>Promise.resolve().then(fn)))(()=>resolve()));
 }
 function checkTheme(id){
  const rect=el=>el?.getBoundingClientRect?.();
  const headline=rect(hero.querySelector('h1'));
  const portrait=rect(hero.querySelector('.core img')||hero.querySelector('.core'));
  const atmosphere=window.__wsAtmosphere328?.getStatus?.()||null;
  const mesh=window.__wsEngineMesh328?.getStatus?.()||null;
  const doc=document.documentElement;
  const values={
   selectedTheme:body.dataset.theme===id && picker.value===id,
   themeIdentity:body.dataset.ws29Theme===id,
   heroGeometry:Boolean(headline?.width>5&&headline.height>5&&portrait?.width>5&&portrait.height>5),
   heroEngine:window.__wsHeroDisplay327?.getStatus?.()?.theme===id,
   atmosphereTheme:atmosphere?.theme===id,
   themeEngine:mesh?.theme===id,
   quickMenu:have('quick'),
   portfolioEngine:have('portfolio'),
   noOverflow:doc.scrollWidth<=doc.clientWidth+3
  };
  return {id,checks:values,passed:Object.values(values).filter(Boolean).length,total:Object.keys(values).length,
   atmosphere:{mode:atmosphere?.mode||'unknown',effective:atmosphere?.effective||'unknown',renderer:atmosphere?.renderer||'unknown'}};
 }
 async function audit(){
  if(running)return lastAudit;
  running=true;const original=currentTheme();
  run.disabled=true;exportButton.disabled=true;
  output.textContent=tr('running');
  const results=[];
  try{
   for(const id of IDS){
    picker.value=id;
    picker.dispatchEvent(new Event('change',{bubbles:true}));
    await settle();await settle();
    render();
    results.push(checkTheme(id));
   }
  }finally{
   picker.value=original;
   picker.dispatchEvent(new Event('change',{bubbles:true}));
   await settle();await settle();
   running=false;
  }
  const total=results.reduce((n,r)=>n+r.total,0);
  const passed=results.reduce((n,r)=>n+r.passed,0);
  lastAudit={schema:1,engine:'webstudio-five-engine-v3.29.0',manualBrowserCheck:true,
   hostedCI:'NOT_RUN',securityAudit:false,
   viewport:{width:document.documentElement.clientWidth,height:window.innerHeight},
   locale,originalTheme:original,checkedAt:new Date().toISOString(),
   total,passed,failed:total-passed,results};
  output.textContent=passed+' / '+total+' · '+tr('passed')+
   (total>passed?' · '+(total-passed)+' '+tr('failed'):'');
  render();output.textContent=passed+' / '+total+' · '+tr('passed')+
   (total>passed?' · '+(total-passed)+' '+tr('failed'):'');
  return lastAudit;
 }
 run.addEventListener('click',()=>{audit().catch(err=>{
   running=false;run.disabled=false;exportButton.disabled=!lastAudit;
   output.textContent=tr('failed')+': '+String(err?.message||err).slice(0,180);
  })});
 exportButton.addEventListener('click',()=>{
  if(!lastAudit)return;
  const data=JSON.stringify(lastAudit,null,2);
  const blob=new Blob([data],{type:'application/json'});
  const url=URL.createObjectURL(blob),a=e('a');
  a.href=url;a.download='webstudio-five-engine-manual-audit-v3.29.json';
  document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),3000);
 });
 document.addEventListener('keydown',event=>{
  if(event.key!=='/'||event.ctrlKey||event.altKey||event.metaKey||event.shiftKey)return;
  const el=event.target;
  if(el?.isContentEditable||el?.closest?.('input,textarea,select,[contenteditable="true"],[role="dialog"]'))return;
  if(typeof window.__wsPortfolio328?.focusSearch==='function'){
   event.preventDefault();window.__wsPortfolio328.focusSearch();
  }
 });
 picker.addEventListener('change',queueRender);
 document.addEventListener('profile-language-change',queueRender);
 window.addEventListener('ws-engine-theme-change',queueRender);
 window.addEventListener('ws-atmosphere-change',queueRender);
 window.addEventListener('ws-portfolio-filter-change',queueRender);
 window.addEventListener('ws-quick-menu-tab-change',queueRender);
 const modeChanged=window.matchMedia?.('(prefers-reduced-motion:reduce)');
 modeChanged?.addEventListener?.('change',queueRender);
 window.__wsFiveEngines329=Object.freeze({
  version:'3.29.0',themes:IDS.slice(),locales:LOCALES.slice(),
  getStatus:()=>Object.freeze({theme:currentTheme(),locale,
   available:Object.freeze(Object.fromEntries(actions.map(([key])=>[key,have(key)]))),
   atmosphere:window.__wsAtmosphere328?.getStatus?.()||null,
   portfolio:window.__wsPortfolio328?.getStatus?.()||null,
   manualAudit:lastAudit?{passed:lastAudit.passed,total:lastAudit.total}:null}),
  audit,refresh:render
 });
 render();
})();