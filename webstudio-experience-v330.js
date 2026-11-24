/* WebStudio Experience Engine v3.30 — manual CI / public preview.
 * Coordinated command palette, live project pathways, responsive theme signatures
 * and honest quality introspection. Additive: protects existing five engines and
 * approved themes. No private APIs, telemetry, hosting calls, autostart audits.
 */
(() => {
 'use strict';
 if(window.PORTFOLIO_PREVIEW_MODE!==true||window.__wsExperience330)return;
 const q=s=>document.querySelector(s);
 const picker=document.getElementById('theme-select');
 const projectSearch=document.getElementById('portfolio-project-search');
 const discovery=q('#projects .project-discovery');
 const quickTools=document.getElementById('pv-hub-panel-tools');
 if(!picker||!discovery)return;
 const IDs=['orbit','editorial','terminal','aurora-peak','neon-studio','design-2'];
 const THEMES={
  orbit:{symbol:'◎',shape:'ring',tint:'#75efdb',name:'Orbit'},
  editorial:{symbol:'◇',shape:'folio',tint:'#805337',name:'Editorial'},
  terminal:{symbol:'▣',shape:'terminal',tint:'#73ffa9',name:'Terminal'},
  'aurora-peak':{symbol:'△',shape:'mountain',tint:'#dce8ad',name:'Aurora Peak'},
  'neon-studio':{symbol:'✧',shape:'glass',tint:'#61f5e4',name:'Neon Studio'},
  'design-2':{symbol:'✦',shape:'star',tint:'#d2c0ff',name:'Cosmic'}
 };
 const LANGS=['en','hi','bn','es','fr','de','pt','ar','zh-CN','ja'];
 const LOCAL={
  en:['Explore portfolio','Search projects, sections, engines or themes','Navigation','Themes','Engines','Portfolio','Theme','Introduction','About','Projects','Experience','Strengths','Contact','Show atmosphere settings','Open quick menu','Focus project search','Open theme library','Run manual theme check','Nothing matches this search','Press Enter to open · Esc to close','Open command palette','Project pathways','All','Linux & desktop','AI & media','Web & apps','Clear filters','Showing','of','projects','Keyboard shortcut Alt+Shift+P','Presentation style','Reduced motion respected','Performance mode','Open','Close','Select','Current','Result','results','Use ↑ and ↓ to navigate','No hosted CI was executed'],
  hi:['पोर्टफोलियो देखें','प्रोजेक्ट, अनुभाग, इंजन या थीम खोजें','नेविगेशन','थीम','इंजन','पोर्टफोलियो','थीम','परिचय','परिचय विवरण','प्रोजेक्ट','अनुभव','विशेषताएँ','संपर्क','वातावरण सेटिंग्स खोलें','त्वरित मेनू खोलें','प्रोजेक्ट खोज पर जाएँ','थीम लाइब्रेरी खोलें','मैन्युअल थीम जाँच चलाएँ','कोई परिणाम नहीं मिला','खोलने के लिए Enter · बंद करने के लिए Esc','कमांड पैलेट खोलें','प्रोजेक्ट श्रेणियाँ','सभी','लिनक्स और डेस्कटॉप','AI और मीडिया','वेब और ऐप्स','फ़िल्टर हटाएँ','दिखा रहे हैं','में से','प्रोजेक्ट','कीबोर्ड शॉर्टकट Alt+Shift+P','प्रदर्शन शैली','कम गति प्राथमिकता का सम्मान','प्रदर्शन मोड','खोलें','बंद करें','चुनें','वर्तमान','परिणाम','परिणाम','नेविगेट करने के लिए ↑ और ↓','होस्टेड CI नहीं चला'],
  bn:['পোর্টফোলিও দেখুন','প্রকল্প, বিভাগ, ইঞ্জিন বা থিম খুঁজুন','নেভিগেশন','থিম','ইঞ্জিন','পোর্টফোলিও','থিম','পরিচিতি','সম্পর্কে','প্রকল্প','অভিজ্ঞতা','দক্ষতা','যোগাযোগ','আবহ সেটিংস খুলুন','দ্রুত মেনু খুলুন','প্রকল্প অনুসন্ধান করুন','থিম লাইব্রেরি খুলুন','ম্যানুয়াল থিম পরীক্ষা চালান','কোনো ফলাফল পাওয়া যায়নি','খুলতে Enter · বন্ধ করতে Esc','কমান্ড প্যালেট খুলুন','প্রকল্পের বিভাগ','সব','লিনাক্স ও ডেস্কটপ','AI ও মিডিয়া','ওয়েব ও অ্যাপ','ফিল্টার সরান','দেখানো হচ্ছে','মোট','প্রকল্প','কীবোর্ড শর্টকাট Alt+Shift+P','প্রদর্শনের ধরন','গতিবিধি কমানোর পছন্দ মানা হয়','পারফরম্যান্স মোড','খুলুন','বন্ধ করুন','বেছে নিন','বর্তমান','ফলাফল','ফলাফল','চলতে ↑ ও ↓ ব্যবহার করুন','হোস্টেড CI চালানো হয়নি'],
  es:['Explorar portafolio','Buscar proyectos, secciones, motores o temas','Navegación','Temas','Motores','Portafolio','Tema','Introducción','Acerca de','Proyectos','Experiencia','Fortalezas','Contacto','Abrir ajustes de atmósfera','Abrir menú rápido','Buscar proyectos','Abrir biblioteca de temas','Ejecutar comprobación manual','No hay resultados','Enter para abrir · Esc para cerrar','Abrir paleta de comandos','Áreas de proyectos','Todos','Linux y escritorio','IA y medios','Web y apps','Borrar filtros','Mostrando','de','proyectos','Atajo Alt+Mayús+P','Estilo visual','Se respeta movimiento reducido','Modo de rendimiento','Abrir','Cerrar','Elegir','Actual','Resultado','resultados','Usa ↑ y ↓ para navegar','No se ejecutó CI alojada'],
  fr:['Explorer le portfolio','Rechercher projets, rubriques, moteurs ou thèmes','Navigation','Thèmes','Moteurs','Portfolio','Thème','Introduction','À propos','Projets','Expérience','Atouts','Contact','Ouvrir les réglages d’ambiance','Ouvrir le menu rapide','Rechercher un projet','Ouvrir les thèmes','Lancer le contrôle manuel','Aucun résultat','Entrée pour ouvrir · Échap pour fermer','Ouvrir la palette de commandes','Catégories de projets','Tout','Linux et bureau','IA et médias','Web et applications','Effacer les filtres','Affichage','sur','projets','Raccourci Alt+Maj+P','Style visuel','Mouvement réduit respecté','Mode de performance','Ouvrir','Fermer','Choisir','Actuel','Résultat','résultats','Utilisez ↑ et ↓ pour naviguer','Aucune CI hébergée exécutée'],
  de:['Portfolio erkunden','Projekte, Bereiche, Engines oder Designs suchen','Navigation','Designs','Engines','Portfolio','Design','Einführung','Über mich','Projekte','Erfahrung','Stärken','Kontakt','Atmosphäre-Einstellungen öffnen','Schnellmenü öffnen','Projektsuche fokussieren','Design-Bibliothek öffnen','Manuelle Designprüfung starten','Keine Treffer','Enter öffnet · Esc schließt','Befehlspalette öffnen','Projektbereiche','Alle','Linux und Desktop','KI und Medien','Web und Apps','Filter löschen','Zeige','von','Projekten','Tastenkürzel Alt+Umschalt+P','Visueller Stil','Reduzierte Bewegung beachtet','Leistungsmodus','Öffnen','Schließen','Auswählen','Aktuell','Ergebnis','Ergebnisse','Mit ↑ und ↓ navigieren','Keine gehostete CI ausgeführt'],
  pt:['Explorar portfólio','Buscar projetos, seções, motores ou temas','Navegação','Temas','Motores','Portfólio','Tema','Introdução','Sobre','Projetos','Experiência','Competências','Contato','Abrir ajustes da atmosfera','Abrir menu rápido','Focar busca de projetos','Abrir biblioteca de temas','Executar verificação manual','Nenhum resultado','Enter para abrir · Esc para fechar','Abrir paleta de comandos','Áreas de projetos','Todos','Linux e desktop','IA e mídia','Web e aplicativos','Limpar filtros','Exibindo','de','projetos','Atalho Alt+Shift+P','Estilo visual','Movimento reduzido respeitado','Modo de desempenho','Abrir','Fechar','Selecionar','Atual','Resultado','resultados','Use ↑ e ↓ para navegar','Nenhuma CI hospedada executada'],
  ar:['استكشف معرض الأعمال','ابحث عن المشاريع أو الأقسام أو المحركات أو السمات','التنقل','السمات','المحركات','معرض الأعمال','السمة','المقدمة','نبذة عني','المشاريع','الخبرة','نقاط القوة','التواصل','افتح إعدادات الأجواء','افتح القائمة السريعة','الانتقال إلى بحث المشاريع','افتح مكتبة السمات','تشغيل الفحص اليدوي','لا توجد نتائج مطابقة','اضغط Enter للفتح · Esc للإغلاق','افتح لوحة الأوامر','مجالات المشاريع','الكل','لينكس وسطح المكتب','الذكاء الاصطناعي والوسائط','الويب والتطبيقات','مسح التصفية','عرض','من','مشاريع','اختصار Alt+Shift+P','النمط البصري','احترام تقليل الحركة','وضع الأداء','فتح','إغلاق','اختيار','الحالي','نتيجة','نتائج','استخدم ↑ و ↓ للتنقل','لم تُشغّل خدمات CI المستضافة'],
  'zh-CN':['探索作品集','搜索项目、章节、引擎或主题','导航','主题','引擎','作品集','主题','介绍','关于','项目','经验','优势','联系','打开氛围设置','打开快捷菜单','聚焦项目搜索','打开主题库','运行手动检查','没有匹配结果','回车打开 · Esc 关闭','打开命令面板','项目分类','全部','Linux 与桌面','AI 与媒体','网站与应用','清除筛选','显示','共','个项目','快捷键 Alt+Shift+P','视觉风格','遵循减少动态效果设置','性能模式','打开','关闭','选择','当前','条结果','条结果','使用 ↑ 和 ↓ 导航','未运行托管 CI'],
  ja:['ポートフォリオを探す','プロジェクト・セクション・エンジン・テーマを検索','ナビゲーション','テーマ','エンジン','ポートフォリオ','テーマ','はじめに','概要','プロジェクト','経験','強み','連絡先','雰囲気設定を開く','クイックメニューを開く','プロジェクト検索へ','テーマライブラリーを開く','手動テーマ検査を実行','一致する結果なし','Enterで開く · Escで閉じる','コマンドパレットを開く','プロジェクトの分類','すべて','Linux・デスクトップ','AI・メディア','Web・アプリ','絞り込みを解除','表示中','全','プロジェクト','ショートカット Alt+Shift+P','表示スタイル','動きを減らす設定に対応','性能モード','開く','閉じる','選択','現在','件','件','↑ と ↓ で移動','ホスト型CIは未実行']
 };
 const F=['portfolio','search','navigation','themes','engines','gallery','theme','intro','about','projects','experience','strengths','contact','atmo','quick','find','library','audit','empty','hint','launch','pathways','all','linux','ai','web','clear','showing','of','projectsCount','shortcut','style','reduced','performance','open','close','select','current','result','results','arrowHint','noCI'];
 const IDX=Object.fromEntries(F.map((k,i)=>[k,i]));
 let locale='en',filtered=[],active=0,lastFocus=null,paintScheduled=false,revisions=0;
 const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n};
 const tr=key=>(LOCAL[locale]||LOCAL.en)[IDX[key]]||LOCAL.en[IDX[key]]||key;
 const current=()=>IDs.includes(document.body.dataset.theme)?document.body.dataset.theme:picker.value;
 const norm=x=>String(x||'').normalize('NFKD').toLocaleLowerCase().replace(/[\u0300-\u036f]/g,'').trim();
 const sourceLinks=[
  ['top','intro'],['about','about'],['projects','projects'],['experience','experience'],['capabilities','strengths'],['contact','contact']
 ];
 const overlay=el('div','ws30-overlay');overlay.id='ws30-command-overlay';overlay.hidden=true;
 overlay.setAttribute('role','presentation');
 const dialog=el('section','ws30-dialog');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-modal','true');
 const head=el('div','ws30-head');
 const title=el('h2','ws30-title');title.id='ws30-title';dialog.setAttribute('aria-labelledby',title.id);
 const close=el('button','ws30-close','×');close.type='button';
 const input=el('input','ws30-input');input.type='search';input.id='ws30-command-input';input.autocomplete='off';input.spellcheck=false;
 input.setAttribute('role','combobox');input.setAttribute('aria-controls','ws30-command-results');
 input.setAttribute('aria-autocomplete','list');input.setAttribute('aria-expanded','true');
 const resultBox=el('div','ws30-results');resultBox.id='ws30-command-results';resultBox.setAttribute('role','listbox');
 const footer=el('div','ws30-footer');
 const hint=el('span','ws30-hint');const counter=el('span','ws30-counter');counter.setAttribute('role','status');counter.setAttribute('aria-live','polite');
 head.append(title,close);footer.append(hint,counter);
 dialog.append(head,input,resultBox,footer);overlay.append(dialog);document.body.append(overlay);
 const launcher=el('button','ws30-launcher');
 launcher.id='ws30-command-launcher';launcher.type='button';launcher.setAttribute('aria-haspopup','dialog');launcher.setAttribute('aria-controls',overlay.id);
 const launcherSymbol=el('span','ws30-launcher-symbol','⌕');launcherSymbol.setAttribute('aria-hidden','true');
 const launcherText=el('span','ws30-launcher-text');const launcherKey=el('kbd','ws30-key','Alt+Shift+P');
 launcher.append(launcherSymbol,launcherText,launcherKey);
 if(quickTools)quickTools.append(launcher);
 else document.querySelector('.topbar .nav')?.append(launcher);
 const facets=el('div','ws30-project-pathways');facets.id='ws30-project-pathways';
 facets.setAttribute('role','group');
 const facetTitle=el('strong','ws30-facet-title');
 const chips=el('div','ws30-facet-chips');
 const facetKeys=['all','linux','ai','web'];
 const facetValues=['all','linux','ai','web'];
 const facetButtons=facetKeys.map((key,i)=>{const b=el('button','ws30-facet');b.type='button';b.dataset.focus=facetValues[i];chips.append(b);return b});
 const facetCount=el('p','ws30-facet-count');facetCount.setAttribute('role','status');facetCount.setAttribute('aria-live','polite');
 facets.append(facetTitle,chips,facetCount);
 discovery.append(facets);
 const focusSelect=discovery.querySelector('select[aria-label="Filter projects by focus"]')||
  discovery.querySelector('select:not(.project-sort)');
 const projectInput=projectSearch||discovery.querySelector('input[type=search]');
 function closePalette(){
  if(overlay.hidden)return;
  overlay.hidden=true;document.body.classList.remove('ws30-dialog-open');
  input.setAttribute('aria-expanded','false');
  (lastFocus?.isConnected?lastFocus:launcher).focus({preventScroll:true});
 }
 function openPalette(){
  if(!overlay.hidden)return;
  const themeLibrary=document.getElementById('pv-theme-library');
  if(themeLibrary&&!themeLibrary.hidden)return;
  const quickPanel=document.getElementById('ws-visitor-quick-panel');
  lastFocus=document.activeElement||launcher;
  if(quickPanel&&!quickPanel.hidden)document.getElementById('ws-visitor-quick-open')?.click();
  overlay.hidden=false;document.body.classList.add('ws30-dialog-open');
  input.setAttribute('aria-expanded','true');input.value='';active=0;
  updateResults();input.focus({preventScroll:true});
 }
 function navigate(id){
  const target=document.getElementById(id);
  if(target)target.scrollIntoView({behavior:window.matchMedia?.('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});
 }
 function chooseTheme(id){
  if(!IDs.includes(id))return false;
  if(window.__wsEngineMesh328?.chooseTheme)return window.__wsEngineMesh328.chooseTheme(id);
  picker.value=id;picker.dispatchEvent(new Event('change',{bubbles:true}));return true;
 }
 function openAtmosphere(){
  const node=document.getElementById('ws-atmosphere-control'),summary=node?.querySelector('summary');
  if(node&&summary){node.open=true;summary.focus({preventScroll:true});node.scrollIntoView({block:'nearest'});}
 }
 function focusProjects(){
  navigate('projects');if(window.__wsPortfolio328?.focusSearch)window.__wsPortfolio328.focusSearch();
  else projectInput?.focus({preventScroll:true});
 }
 function buildCommands(){
  const group=(key,list)=>list.map(row=>({...row,group:tr(key)}));
  return [
   ...group('navigation',sourceLinks.map(([id,key])=>({
    id:'go-'+id,title:tr(key),detail:tr('navigation'),icon:'↗',execute:()=>navigate(id)
   }))),
   ...group('themes',IDs.map(id=>({
    id:'theme-'+id,title:THEMES[id].name,detail:tr('style'),
    icon:THEMES[id].symbol,active:current()===id,execute:()=>chooseTheme(id)
   }))),
   ...group('engines',[
    {id:'engine-atmosphere',title:tr('atmo'),detail:tr('performance'),icon:'✧',execute:openAtmosphere},
    {id:'engine-quick',title:tr('quick'),detail:tr('engines'),icon:'⌘',execute:()=>document.getElementById('ws-visitor-quick-open')?.click()},
    {id:'engine-themes',title:tr('library'),detail:tr('themes'),icon:'◇',execute:()=>document.getElementById('pv-theme-launch')?.click()},
    {id:'engine-portfolio',title:tr('find'),detail:tr('gallery'),icon:'⌕',execute:focusProjects},
    {id:'engine-audit',title:tr('audit'),detail:tr('noCI'),icon:'✓',execute:()=>window.__wsFiveEngines329?.audit?.()}
   ])
  ];
 }
 function updateResults(){
  const text=norm(input.value);
  filtered=buildCommands().filter(cmd=>!text||norm([cmd.title,cmd.detail,cmd.group,cmd.id].join(' ')).includes(text));
  active=Math.max(0,Math.min(active,filtered.length-1));
  resultBox.replaceChildren();
  filtered.forEach((cmd,i)=>{
   const row=el('button','ws30-result');row.type='button';row.id='ws30-result-'+i;
   row.setAttribute('role','option');row.setAttribute('aria-selected',String(i===active));
   row.dataset.selected=String(i===active);row.dataset.command=cmd.id;
   const symbol=el('span','ws30-result-symbol',cmd.icon);symbol.setAttribute('aria-hidden','true');
   const titleBox=el('span','ws30-result-labels');
   const a=el('strong','',cmd.title),b=el('small','',cmd.group+' · '+cmd.detail);
   titleBox.append(a,b);const state=el('span','ws30-result-state',cmd.active?tr('current'):'↗');state.setAttribute('aria-hidden','true');
   row.append(symbol,titleBox,state);
   row.addEventListener('pointerenter',()=>{active=i;updateSelection();});
   row.addEventListener('click',()=>execute(i));
   resultBox.append(row);
  });
  if(!filtered.length){resultBox.append(el('p','ws30-empty',tr('empty')));input.removeAttribute('aria-activedescendant');}
  else updateSelection();
  counter.textContent=filtered.length+' '+(filtered.length===1?tr('result'):tr('results'));
 }
 function updateSelection(){
  const rows=[...resultBox.querySelectorAll('.ws30-result')];
  rows.forEach((node,i)=>{node.setAttribute('aria-selected',String(i===active));node.dataset.selected=String(i===active)});
  if(rows[active]){input.setAttribute('aria-activedescendant',rows[active].id);rows[active].scrollIntoView({block:'nearest'});}
 }
 function execute(index){
  const command=filtered[index];if(!command)return;
  closePalette();
  command.execute();
  revisions++;
 }
 function refresh(){
  const l=window.profileI18n?.locale;locale=LANGS.includes(l)?l:'en';
  document.body.dataset.ws30Theme=current();
  document.body.dataset.ws30Direction=locale==='ar'?'rtl':'ltr';
  launcherText.textContent=tr('launch');launcher.title=tr('shortcut');
  launcher.setAttribute('aria-label',tr('launch')+' · '+tr('shortcut'));
  title.textContent=tr('portfolio');
  close.setAttribute('aria-label',tr('close'));
  input.placeholder=tr('search');input.setAttribute('aria-label',tr('search'));
  hint.textContent=tr('hint')+' · '+tr('arrowHint');
  facetTitle.textContent=tr('pathways');
  facets.setAttribute('aria-label',tr('pathways'));
  const selected=focusSelect?.value||'all';
  facetButtons.forEach((b,i)=>{
   b.textContent=tr(facetKeys[i]);b.setAttribute('aria-pressed',String(selected===facetValues[i]));
   b.setAttribute('aria-label',tr(facetKeys[i]));
  });
  const count=window.__wsPortfolio328?.getStatus?.();
  facetCount.textContent=count?tr('showing')+' '+count.shown+' '+tr('of')+' '+count.total+' '+tr('projectsCount'):'';
  if(!overlay.hidden)updateResults();
 }
 function schedule(){
  if(paintScheduled)return;paintScheduled=true;
  (window.requestAnimationFrame||((fn)=>Promise.resolve().then(fn)))(()=>{paintScheduled=false;refresh()});
 }
 launcher.addEventListener('click',openPalette);
 close.addEventListener('click',closePalette);
 overlay.addEventListener('pointerdown',e=>{if(e.target===overlay)closePalette()});
 input.addEventListener('input',()=>{active=0;updateResults()});
 input.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'||e.key==='ArrowUp'){
   e.preventDefault();if(!filtered.length)return;
   active=(active+(e.key==='ArrowDown'?1:-1)+filtered.length)%filtered.length;updateSelection();
  }else if(e.key==='Enter'){e.preventDefault();execute(active);}
 });
 dialog.addEventListener('keydown',e=>{
  if(e.key==='Escape'){e.stopPropagation();e.preventDefault();closePalette();return;}
  if(e.key!=='Tab')return;
  const focusable=[input,close,...resultBox.querySelectorAll('button:not(:disabled)')];
  const first=focusable[0],last=focusable.at(-1);
  if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
  else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
 });
 document.addEventListener('keydown',e=>{
  if(e.key==='Escape'&&!overlay.hidden){e.preventDefault();closePalette();return;}
  if(e.code!=='KeyP'||!e.altKey||!e.shiftKey||e.ctrlKey||e.metaKey||e.repeat)return;
  if(e.target?.isContentEditable)return;
  e.preventDefault();if(overlay.hidden)openPalette();else closePalette();
 });
 facetButtons.forEach(b=>b.addEventListener('click',()=>{
  if(!focusSelect)return;
  focusSelect.value=b.dataset.focus;
  focusSelect.dispatchEvent(new Event('change',{bubbles:true}));
  schedule();
 }));
 focusSelect?.addEventListener('change',schedule);
 picker.addEventListener('change',schedule);
 document.addEventListener('profile-language-change',schedule);
 window.addEventListener('ws-engine-theme-change',schedule);
 window.addEventListener('ws-portfolio-filter-change',schedule);
 window.__wsExperience330=Object.freeze({
  version:'3.30.0',locales:LANGS.slice(),themes:IDs.slice(),open:openPalette,close:closePalette,
  getStatus:()=>Object.freeze({theme:current(),locale,commandCount:buildCommands().length,
   projectLens:focusSelect?.value||null,open:!overlay.hidden,revisions}),
  refresh
 });
 refresh();
})();