/* Professional Journey v3.38 — public experience map, no network or private records. */
((global)=>{'use strict';if(!global)return;
const copy={"en":["Professional Journey","Explore my experience","Metro","Global Atlas","Constellation","Expedition","Map style","Close","Previous","Next","Experience areas","Kolkata, India","Public base; global collaboration is not a list of employment locations.","Experience areas, not a dated career timeline.","Systems & technology","CRM platforms, SQL, infrastructure and practical automation.","Service delivery","Supporting users, handling escalations and resolving practical problems.","Team leadership","Leading teams through demanding targets and improving recurring processes.","Global collaboration","Working with distributed teams and supporting users across time zones.","Independent development","Linux tools, open-source development and creative software projects."],"hi":["पेशेवर यात्रा","मेरा अनुभव देखें","मेट्रो","विश्व मानचित्र","नक्षत्र","अभियान","मानचित्र शैली","बंद करें","पिछला","अगला","अनुभव क्षेत्र","कोलकाता, भारत","सार्वजनिक स्थान; वैश्विक सहयोग रोजगार स्थानों की सूची नहीं है।","अनुभव के क्षेत्र, तिथिवार करियर नहीं।","सिस्टम और तकनीक","CRM, SQL, बुनियादी ढाँचा और व्यावहारिक स्वचालन।","सेवा वितरण","उपयोगकर्ता सहायता, जटिल समस्याओं का समाधान।","टीम नेतृत्व","टीमों का नेतृत्व और प्रक्रियाओं में सुधार।","वैश्विक सहयोग","विभिन्न समय क्षेत्रों में वितरित टीमों और उपयोगकर्ताओं के साथ काम।","स्वतंत्र विकास","Linux उपकरण, ओपन-सोर्स विकास और रचनात्मक सॉफ्टवेयर।"],"bn":["পেশাগত যাত্রা","আমার অভিজ্ঞতা দেখুন","মেট্রো","বিশ্ব মানচিত্র","নক্ষত্রমণ্ডল","অভিযান","মানচিত্রের ধরন","বন্ধ করুন","আগের","পরের","অভিজ্ঞতার ক্ষেত্র","কলকাতা, ভারত","প্রকাশ্য অবস্থান; বৈশ্বিক সহযোগিতা কর্মস্থলের তালিকা নয়।","অভিজ্ঞতার ক্ষেত্র, তারিখভিত্তিক কর্মজীবন নয়।","সিস্টেম ও প্রযুক্তি","CRM, SQL, অবকাঠামো ও ব্যবহারিক অটোমেশন।","সেবা প্রদান","ব্যবহারকারী সহায়তা ও জটিল সমস্যার সমাধান।","দল পরিচালনা","দলের নেতৃত্ব ও পুনরাবৃত্ত প্রক্রিয়ার উন্নতি।","বৈশ্বিক সহযোগিতা","বিভিন্ন সময় অঞ্চলে ছড়িয়ে থাকা দল ও ব্যবহারকারীদের সঙ্গে কাজ।","স্বাধীন উন্নয়ন","Linux টুল, ওপেন সোর্স উন্নয়ন ও সৃজনশীল সফটওয়্যার।"],"es":["Trayectoria profesional","Explora mi experiencia","Metro","Atlas global","Constelación","Expedición","Estilo del mapa","Cerrar","Anterior","Siguiente","Áreas de experiencia","Calcuta, India","Base pública; la colaboración global no indica lugares de empleo.","Áreas de experiencia, no una cronología fechada.","Sistemas y tecnología","CRM, SQL, infraestructura y automatización práctica.","Prestación de servicios","Asistencia a usuarios, escalaciones y resolución de problemas.","Liderazgo de equipos","Dirección de equipos y mejora de procesos recurrentes.","Colaboración global","Equipos distribuidos y asistencia en distintas zonas horarias.","Desarrollo independiente","Herramientas Linux, código abierto y software creativo."],"fr":["Parcours professionnel","Découvrez mon expérience","Métro","Atlas mondial","Constellation","Expédition","Style de carte","Fermer","Précédent","Suivant","Domaines d’expérience","Calcutta, Inde","Base publique ; la collaboration mondiale ne désigne pas des lieux d’emploi.","Domaines d’expérience, sans chronologie datée.","Systèmes et technologie","CRM, SQL, infrastructure et automatisation pratique.","Prestation de services","Assistance aux utilisateurs, escalades et résolution de problèmes.","Direction d’équipes","Encadrement des équipes et amélioration des processus.","Collaboration mondiale","Équipes distribuées et assistance sur plusieurs fuseaux horaires.","Développement indépendant","Outils Linux, développement libre et logiciels créatifs."],"de":["Beruflicher Werdegang","Meine Erfahrung entdecken","Metro","Weltatlas","Konstellation","Expedition","Kartenstil","Schließen","Zurück","Weiter","Erfahrungsbereiche","Kolkata, Indien","Öffentlicher Standort; globale Zusammenarbeit bezeichnet keine Arbeitsorte.","Erfahrungsbereiche, keine datierte Laufbahn.","Systeme und Technologie","CRM, SQL, Infrastruktur und praktische Automatisierung.","Servicebereitstellung","Anwenderbetreuung, Eskalationen und Problemlösung.","Teamführung","Teams führen und wiederkehrende Prozesse verbessern.","Globale Zusammenarbeit","Verteilte Teams und Unterstützung über Zeitzonen hinweg.","Eigenständige Entwicklung","Linux-Werkzeuge, Open Source und Kreativsoftware."],"pt":["Trajetória profissional","Explore minha experiência","Metrô","Atlas global","Constelação","Expedição","Estilo do mapa","Fechar","Anterior","Próximo","Áreas de experiência","Calcutá, Índia","Base pública; colaboração global não indica locais de emprego.","Áreas de experiência, não uma cronologia com datas.","Sistemas e tecnologia","CRM, SQL, infraestrutura e automação prática.","Prestação de serviços","Suporte a usuários, escalonamentos e resolução de problemas.","Liderança de equipes","Liderança e melhoria de processos recorrentes.","Colaboração global","Equipes distribuídas e suporte em diferentes fusos horários.","Desenvolvimento independente","Ferramentas Linux, código aberto e software criativo."],"ar":["المسيرة المهنية","استكشف خبرتي","المترو","الأطلس العالمي","الكوكبة","الرحلة","نمط الخريطة","إغلاق","السابق","التالي","مجالات الخبرة","كولكاتا، الهند","الموقع العام؛ التعاون العالمي لا يحدد أماكن العمل.","مجالات الخبرة وليست تسلسلاً زمنياً مؤرخاً.","الأنظمة والتقنية","منصات CRM وSQL والبنية التحتية والأتمتة العملية.","تقديم الخدمات","دعم المستخدمين ومعالجة التصعيد وحل المشكلات.","قيادة الفرق","قيادة الفرق وتحسين العمليات المتكررة.","التعاون العالمي","العمل مع فرق موزعة ودعم المستخدمين عبر المناطق الزمنية.","التطوير المستقل","أدوات Linux وتطوير المصادر المفتوحة والبرمجيات الإبداعية."],"zh-CN":["职业历程","探索我的经验","地铁网络","全球地图","星座","探索之旅","地图样式","关闭","上一个","下一个","经验领域","印度加尔各答","公开所在地；全球协作不代表任职地点。","经验领域，并非带日期的职业时间线。","系统与技术","CRM、SQL、基础设施和实用自动化。","服务交付","用户支持、处理升级问题与解决实际困难。","团队领导","带领团队并改进重复性流程。","全球协作","与分布式团队合作并跨时区支持用户。","独立开发","Linux 工具、开源开发及创意软件。"],"ja":["プロフェッショナルの歩み","経験を探る","メトロ","世界地図","星座","探検","地図スタイル","閉じる","前へ","次へ","経験分野","インド・コルカタ","公開拠点。国際協業は勤務先の所在地を示しません。","経験分野であり、日付付きの職歴ではありません。","システムと技術","CRM、SQL、インフラと実用的な自動化。","サービス提供","利用者支援、エスカレーション、問題解決。","チームリーダーシップ","チームを率い、反復業務を改善。","国際協業","分散チームと連携し、時差を越えて利用者を支援。","独立開発","Linux ツール、オープンソース開発、クリエイティブソフトウェア。"]};
const styles=['metro','atlas','constellation','expedition'];
const defaults={orbit:'metro',editorial:'atlas',terminal:'metro','aurora-peak':'expedition','neon-studio':'metro','design-2':'constellation'};
const positions={metro:[[16,24],[16,76],[50,50],[84,24],[84,76]],constellation:[[50,12],[86,37],[72,85],[28,85],[14,37]],expedition:[[10,82],[28,62],[49,48],[70,32],[88,14]]};
const symbols=['▤','◉','♧','◎','⌘'];
const paths={
 metro:[['M48 60 H96 L150 125 L252 60','line'],['M48 190 L150 125 L252 190','alt']],
 atlas:[['M15 55 L45 35 76 42 91 62 68 80 53 104 38 84 23 76Z M64 115 L88 128 101 164 82 223 68 173Z M119 46 L150 34 167 55 144 76 115 66Z M123 89 L164 83 184 112 170 165 147 188 129 143Z M161 46 L200 35 237 47 278 37 313 59 300 87 275 103 250 96 240 131 230 149 217 121 201 104 177 96Z M264 174 L292 162 321 179 308 205 280 202Z','land']],
 constellation:[['M150 125 L150 30 M150 125 L258 92.5 M150 125 L216 212.5 M150 125 L84 212.5 M150 125 L42 92.5','line'],['M150 30 C275 30 275 220 150 220 C25 220 25 30 150 30Z','alt']],
 expedition:[['M0 165 L62 55 108 116 164 24 240 110 300 53 V250 H0Z','land'],['M0 205 L64 156 132 192 218 133 300 184 V250 H0Z','terrain'],['M30 205 Q55 190 84 155 T147 120 T210 80 T264 35','line']]
};
function makeSvg(doc,style,mini=false){
 const svg=doc.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox',style==='atlas'?'0 0 340 250':'0 0 300 250');svg.setAttribute('aria-hidden','true');svg.setAttribute('preserveAspectRatio','none');
 for(const [d,kind] of paths[style]){const n=doc.createElementNS('http://www.w3.org/2000/svg','path');n.setAttribute('d',d);n.setAttribute('class','pj-'+kind);svg.append(n)}
 if(style==='constellation'){const n=doc.createElementNS('http://www.w3.org/2000/svg','circle');n.setAttribute('cx','150');n.setAttribute('cy','125');n.setAttribute('r','24');n.setAttribute('class','pj-center');svg.append(n)}
 if(mini){for(const [x,y] of (style==='atlas'?[[70,45]]:positions[style])){const n=doc.createElementNS('http://www.w3.org/2000/svg','circle');n.setAttribute('cx',x*(style==='atlas'?3.4:3));n.setAttribute('cy',y*2.5);n.setAttribute('r','8');n.setAttribute('class','pj-mini-pin');svg.append(n)}}
 return svg;
}
const plugin={id:'professional-journey',version:'3.38.0',priority:30,dependsOn:['smart-landing'],
 supports:({root})=>Boolean(root.querySelector('.hero .actions a[href="#projects"]')&&root.querySelector('#experience')),
 mount(ctx){
 const doc=ctx.document,root=ctx.root,original=ctx.select('.hero .actions a[href="#projects"]');
 const make=(tag,cls)=>{const n=doc.createElement(tag);n.className=cls;return n};
 const put=(n,v)=>{if(n.textContent!==v)n.textContent=v};
 const button=make('button','button primary ws-live-action pj-launch');button.type='button';button.setAttribute('aria-haspopup','dialog');
 const visual=make('span','pj-mini'),title=make('span','pj-launch-title'),summary=make('span','pj-launch-summary'),arrow=make('span','pj-arrow');arrow.textContent='↗';arrow.setAttribute('aria-hidden','true');
 button.append(visual,title,summary,arrow);button.setAttribute('data-no-translate','');
 const panel=make('dialog','pj-dialog');panel.setAttribute('data-no-translate','');panel.id=(ctx.uid||'pj')+'-dialog';button.setAttribute('aria-controls',panel.id);
 const head=make('header','pj-head'),heading=make('h2','');heading.id=panel.id+'-title';panel.setAttribute('aria-labelledby',heading.id);
 const close=make('button','pj-close');close.type='button';head.append(heading,close);
 const field=make('label','pj-selector'),fieldText=make('span',''),select=make('select','');for(const id of styles){const o=make('option','');o.value=id;select.append(o)}field.append(fieldText,select);
 const map=make('div','pj-map'),note=make('p','pj-note'),choices=make('div','pj-choices'),detail=make('section','pj-detail'),detailTitle=make('h3',''),detailBody=make('p','');detail.setAttribute('aria-live','polite');detail.append(detailTitle,detailBody);
 const footer=make('div','pj-footer'),prev=make('button',''),next=make('button',''),counter=make('span','');prev.type=next.type='button';footer.append(prev,counter,next);
 panel.append(head,field,map,note,choices,detail,footer);
 let style=defaults[ctx.theme]||'metro',selected=0,manual=false,painted='',pinButtons=[],choiceButtons=[];
 function locale(){return copy[ctx.locale]||copy.en}
 function choose(i){selected=i;render()}
 function makePin(i,geographic=false){const n=make('button',geographic?'pj-pin pj-geographic':'pj-pin');n.type='button';n.dataset.index=String(i);n.textContent=geographic?'⌖':symbols[i];return n}
 function rebuild(){
  map.replaceChildren(makeSvg(doc,style));pinButtons=[];
  if(style==='atlas'){const pin=makePin(5,true);pin.style.left='70%';pin.style.top='45%';map.append(pin);pinButtons.push(pin)}
  else positions[style].forEach(([x,y],i)=>{const pin=makePin(i);pin.style.left=x+'%';pin.style.top=y+'%';map.append(pin);pinButtons.push(pin)});
  map.dataset.style=style;visual.replaceChildren(makeSvg(doc,style,true));painted=style;
 }
 for(let i=0;i<5;i++){const n=make('button','');n.type='button';n.dataset.index=String(i);choices.append(n);choiceButtons.push(n)}
 function render(){
  const t=locale();if(painted!==style)rebuild();
  put(title,t[0]);put(summary,t[2+styles.indexOf(style)]+' · '+t[10]);put(heading,t[0]);put(close,t[7]);put(fieldText,t[6]);
  [...select.options].forEach((o,i)=>put(o,t[i+2]));select.value=style;panel.dir=ctx.locale==='ar'?'rtl':'auto';
  put(note,style==='atlas'?t[12]:t[13]);put(prev,t[8]);put(next,t[9]);put(counter,selected===5?t[11]:new Intl.NumberFormat(ctx.locale||'en').format(selected+1)+' / 5');
  const label=i=>i===5?t[11]:t[14+i*2];
  for(const n of [...pinButtons,...choiceButtons]){const i=Number(n.dataset.index);n.setAttribute('aria-label',label(i));n.title=label(i);n.setAttribute('aria-pressed',String(i===selected));if(choiceButtons.includes(n))put(n,label(i))}
  put(detailTitle,label(selected));put(detailBody,selected===5?t[12]:t[15+selected*2]);
 }
 function open(){render();if(!panel.open){panel.showModal();close.focus()}}
 function stop(){if(panel.open)panel.close()}
 ctx.listen(button,'click',open);ctx.listen(close,'click',stop);ctx.listen(panel,'close',()=>{if(button.isConnected)button.focus()});
 ctx.listen(panel,'click',e=>{if(e.target===panel)stop()});
 ctx.listen(panel,'keydown',e=>{if(!e.target.closest?.('.pj-pin,.pj-choices'))return;if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();const delta=(e.key==='ArrowRight'?1:-1)*(ctx.locale==='ar'?-1:1);choose(selected===5?0:(selected+delta+5)%5);choiceButtons[selected]?.focus()}});
 ctx.listen(map,'click',e=>{const pin=e.target.closest('button[data-index]');if(pin&&map.contains(pin))choose(Number(pin.dataset.index))});
 ctx.listen(choices,'click',e=>{const pin=e.target.closest('button[data-index]');if(pin&&choices.contains(pin))choose(Number(pin.dataset.index))});
 ctx.listen(select,'change',()=>{if(styles.includes(select.value)){style=select.value;manual=true;if(selected===5&&style!=='atlas')selected=0;render()}});
 ctx.listen(prev,'click',()=>choose(selected===5?4:(selected+4)%5));ctx.listen(next,'click',()=>choose(selected===5?0:(selected+1)%5));
 ctx.onCleanup(()=>{stop();panel.remove();if(button.isConnected)button.replaceWith(original)});
 original.replaceWith(button);root.append(panel);render();
 return {update:()=>{if(!manual)style=defaults[ctx.theme]||'metro';if(selected===5&&style!=='atlas')selected=0;render()},api:Object.freeze({open,close:stop,setStyle:id=>{if(!styles.includes(id))return false;style=id;manual=true;if(selected===5&&style!=='atlas')selected=0;render();return true},selectPin:i=>{if(!Number.isInteger(i)||i<0||i>4)return false;choose(i);return true},getStatus:()=>({style,selected,open:panel.open,experienceAreas:5,geographicPins:1,version:'3.38.0'})})};
 }};
(global.WebStudioPlugins331||(global.WebStudioPlugins331=Object.create(null)))['professional-journey']=Object.freeze(plugin);
 // Legacy private entrypoint: same lifecycle, no second host or duplicate mount.
 if(!global.WebStudioPluginEngine331&&global.document?.body){
  const doc=global.document,root=doc.body,cleanups=[];
  const ctx={document:doc,root,uid:'pj-legacy',get theme(){return root.dataset.theme||'orbit'},get locale(){return global.profileI18n?.locale||doc.documentElement.lang||'en'},select:s=>root.querySelector(s),onCleanup:fn=>cleanups.push(fn),listen:(node,event,fn)=>{if(!node?.addEventListener)return;node.addEventListener(event,fn);cleanups.push(()=>node.removeEventListener(event,fn))}};
  if(plugin.supports(ctx)){try{const instance=plugin.mount(ctx);ctx.listen(doc,'profile-language-change',instance.update);ctx.listen(doc.getElementById('theme-select'),'change',instance.update);global.__wsProfessionalJourney=Object.freeze({...instance.api,stop:()=>{for(const fn of cleanups.splice(0).reverse())fn()}})}catch(error){for(const fn of cleanups.splice(0).reverse())fn();throw error}}
 }

})(typeof window!=='undefined'?window:undefined);
