/* WebStudio personal-site bridge v3.31
 * Opt-in on current preview. Existing five engines remain the source of truth.
 * The plugin host never replaces native controls, source content or styles.
 */
((global)=>{
 'use strict';
 if(!global||global.PORTFOLIO_PREVIEW_MODE!==true||global.WebStudioSitePlugins331)return;
 const factory=global.WebStudioPluginEngine331,modules=global.WebStudioPlugins331;
 if(!factory||!modules||!global.document?.body)return;
 const doc=global.document,body=doc.body;
 const pick=doc.getElementById('theme-select');
 const names=['theme','hero','atmosphere','quick-menu','portfolio','smart-landing','professional-journey','hero-orbit-geometry'];
 const nativeTheme=()=>body.dataset.theme||pick?.value||'neon-studio';
 const nativeLocale=()=>global.profileI18n?.locale||'en';
 const nativeQuality=()=>global.__wsAtmosphere328?.getStatus?.()?.mode||'auto';
 const host=factory.create({root:body,theme:nativeTheme(),locale:nativeLocale(),quality:nativeQuality(),bridge:true});
 for(const id of names)if(modules[id])host.register(modules[id]);
 const cleanup=[];
 const listen=(node,event,fn,opts)=>{
  node?.addEventListener?.(event,fn,opts);
  cleanup.push(()=>node?.removeEventListener?.(event,fn,opts));
 };
 const syncTheme=()=>{
  const t=nativeTheme();if(t!==host.getStatus().theme)host.setTheme(t);
 };
 const syncLocale=()=>{
  const l=nativeLocale();if(l!==host.getStatus().locale)host.setLocale(l);
 };
 const syncQuality=()=>{
  const q=nativeQuality();if(q!==host.getStatus().quality)host.setQuality(q);
 };
 listen(pick,'change',syncTheme);
 listen(doc,'profile-language-change',syncLocale);
 listen(global,'ws-atmosphere-change',syncQuality);
 listen(global,'ws-engine-theme-change',syncTheme);
 const labels={
  en:['Plugin engines','Ready','Not ready','Standalone modules'],
  hi:['प्लगइन इंजन','तैयार','तैयार नहीं','स्वतंत्र मॉड्यूल'],
  bn:['প্লাগইন ইঞ্জিন','প্রস্তুত','প্রস্তুত নয়','স্বাধীন মডিউল'],
  es:['Motores de plugins','Listos','No listos','Módulos independientes'],
  fr:['Moteurs de plugins','Prêts','Non prêts','Modules autonomes'],
  de:['Plugin-Engines','Bereit','Nicht bereit','Unabhängige Module'],
  pt:['Motores de plugins','Prontos','Não prontos','Módulos independentes'],
  ar:['محركات الإضافات','جاهزة','غير جاهزة','وحدات مستقلة'],
  'zh-CN':['插件引擎','就绪','未就绪','独立模块'],
  ja:['プラグインエンジン','準備完了','未準備','独立モジュール']
 };
 const localizedHealth={
  en:[['Theme','Hero Display','Atmosphere','Quick Menu','Portfolio',"Smart Landing","Professional Journey","Hero Orbit Geometry"],['Active','Failed','Blocked','Unavailable','Stopped','Registered']],
  hi:[['थीम','मुख्य प्रदर्शन','वातावरण','त्वरित मेनू','पोर्टफोलियो',"स्मार्ट लैंडिंग","पेशेवर यात्रा","मुख्य कक्षा ज्यामिति"],['सक्रिय','विफल','अवरुद्ध','अनुपलब्ध','बंद','पंजीकृत']],
  bn:[['থিম','প্রধান প্রদর্শন','আবহ','দ্রুত মেনু','পোর্টফোলিও',"স্মার্ট ল্যান্ডিং","পেশাগত যাত্রা","প্রধান কক্ষপথ জ্যামিতি"],['সক্রিয়','ব্যর্থ','অবরুদ্ধ','অনুপলব্ধ','বন্ধ','নিবন্ধিত']],
  es:[['Tema','Presentación','Atmósfera','Menú rápido','Portafolio',"Inicio inteligente","Trayectoria profesional","Geometría orbital principal"],['Activo','Error','Bloqueado','No disponible','Detenido','Registrado']],
  fr:[['Thème','Présentation','Atmosphère','Menu rapide','Portfolio',"Accueil intelligent","Parcours professionnel","Géométrie orbitale principale"],['Actif','Échec','Bloqué','Indisponible','Arrêté','Enregistré']],
  de:[['Design','Hauptansicht','Atmosphäre','Schnellmenü','Portfolio',"Intelligente Startseite","Beruflicher Werdegang","Orbitgeometrie der Hauptansicht"],['Aktiv','Fehler','Blockiert','Nicht verfügbar','Gestoppt','Registriert']],
  pt:[['Tema','Apresentação','Atmosfera','Menu rápido','Portfólio',"Página inicial inteligente","Trajetória profissional","Geometria orbital principal"],['Ativo','Falhou','Bloqueado','Indisponível','Parado','Registrado']],
  ar:[['السمة','العرض الرئيسي','الأجواء','القائمة السريعة','معرض الأعمال',"الواجهة الذكية","المسيرة المهنية","هندسة المدار الرئيسي"],['نشط','فشل','محظور','غير متاح','متوقف','مسجل']],
  'zh-CN':[['主题','主视觉','氛围','快捷菜单','作品集',"智能首页","职业历程","主视觉轨道几何"],['已启用','失败','已阻止','不可用','已停止','已注册']],
  ja:[['テーマ','メイン表示','雰囲気','クイックメニュー','作品集',"スマートランディング","プロフェッショナルの歩み","メイン軌道ジオメトリ"],['有効','失敗','ブロック済み','利用不可','停止','登録済み']]
 };
 const healthStates=['mounted','failed','blocked','skipped','stopped','registered'];
 const healthIds=['theme','hero','atmosphere','quick-menu','portfolio','smart-landing','professional-journey','hero-orbit-geometry'];
 const tools=doc.getElementById('pv-hub-panel-tools');
 const demoLabels={
  en:'Plugin engine playground',hi:'प्लगइन इंजन प्रयोगशाला',bn:'প্লাগইন ইঞ্জিন প্রদর্শনী',
  es:'Demostración de plugins',fr:'Atelier des plugins',de:'Plugin-Demoseite',
  pt:'Demonstração de plugins',ar:'تجربة محركات الإضافات',
  'zh-CN':'插件引擎演示',ja:'プラグインエンジンのデモ'
 };
 let button,description,demo;
 function text(){
  const s=host.getStatus(),t=labels[s.locale]||labels.en;
  if(button)button.textContent=t[0]+' · '+s.mounted+'/'+s.installed;
  if(demo)demo.textContent=demoLabels[s.locale]||demoLabels.en;
  if(description&&!description.hidden){
   const translated=localizedHealth[s.locale]||localizedHealth.en;
   description.textContent=t[3]+' — '+Object.entries(s.modules)
    .map(([id,state])=>(translated[0][healthIds.indexOf(id)]||id)+': '+
      (translated[1][healthStates.indexOf(state)]||state))
    .join(' · ')+(s.errors.length?' · '+t[2]:' · '+t[1]);
  }
 }
 if(tools){
  button=doc.createElement('button');button.type='button';
  button.id='wsp-plugin-status';button.className='wsp-plugin-status-button';
  button.setAttribute('aria-expanded','false');
  button.setAttribute('aria-controls','wsp-plugin-status-content');
  description=doc.createElement('p');
  description.id='wsp-plugin-status-content';
  description.setAttribute('role','status');description.hidden=true;
  demo=doc.createElement('a');
  demo.className='wsp-plugin-demo-link';
  demo.href='examples/webstudio-plugin-starter/';
  demo.rel='nofollow';
  tools.append(button,description,demo);
  listen(button,'click',()=>{
   description.hidden=!description.hidden;
   button.setAttribute('aria-expanded',String(!description.hidden));text();
  });
  cleanup.push(()=>{button.remove();description.remove();demo.remove()});
 }
 host.on('plugin-status',text);host.on('ready',text);
 listen(doc,'profile-language-change',text);
 const ready=host.mount().then(result=>{text();return result});
 const api=Object.freeze({
  version:'3.31.0',host,ready,getStatus:()=>host.getStatus(),
  getModule:id=>host.getModule(id),
  stop:async()=>{
   for(const fn of cleanup.splice(0))fn();
   return host.unmount();
  }
 });
 global.WebStudioSitePlugins331=api;
})(typeof window!=='undefined'?window:undefined);
