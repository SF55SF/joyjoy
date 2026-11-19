/* JOY2_ONEPAGE_INVESTMENT_PDF_V30: one-sheet A4 investment export */
(()=>{
 if(window.__joy2OnePagePdfV30)return;
 window.__joy2OnePagePdfV30=true;
 const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const txt=e=>e?.textContent?.replace(/\s+/g,' ').trim()||'';
 const q=(p,s)=>p?.querySelector(s);
 const safeTelegram=v=>{
   let x=String(v||'').trim();if(!x)return '';
   if(x.startsWith('@'))x=x.slice(1);
   else if(/^https?:\/\/t\.me\//i.test(x))x=x.replace(/^https?:\/\/t\.me\//i,'').split(/[/?#]/)[0];
   else if(/^t\.me\//i.test(x))x=x.slice(5).split(/[/?#]/)[0];
   return /^[a-zA-Z0-9_]{4,64}$/.test(x)?'https://t.me/'+x:'';
 };
 function getMeta(){try{return JSON.parse(document.getElementById('joy2-pdf-object-data')?.textContent||'{}')}catch{return {}}}
 function list(root,selector){return [...(root?.querySelectorAll(selector)||[])].map(x=>txt(x)).filter(Boolean)}
 function render(drawer,meta){
   const lang=(document.documentElement.lang||'ru').toLowerCase().slice(0,2);
   const copy=lang==='en'?{sub:'INVESTMENT OVERVIEW',premises:'Unit',metrics:'KEY INVESTMENT METRICS',inputs:'MODEL ASSUMPTIONS',flows:'PROJECTED ANNUAL CASH FLOWS',contact:'PROPERTY CONTACT',year:'Year',thousands:'USD thousand',note:'This material is for information only and is not financial or investment advice. Calculations are based on indicative parameters and forecast assumptions. Actual results and returns may differ.'}:lang==='uz'?{sub:'INVESTITSIYA HISOBOTI',premises:'Xona',metrics:'INVESTITSIYA KO‘RSATKICHLARI',inputs:'HISOBLASH PARAMETRLARI',flows:'YILLIK PUL OQIMLARI',contact:'OBYEKT BO‘YICHA ALOQA',year:'Yil',thousands:'ming USD',note:'Ma’lumotlar faqat tanishish uchun berilgan va moliyaviy yoki investitsiyaviy maslahat emas. Hisob-kitoblar taxminiy parametr va prognozlarga asoslangan. Haqiqiy natijalar farq qilishi mumkin.'}:{sub:'ИНВЕСТИЦИОННЫЙ РАСЧЁТ',premises:'Помещение',metrics:'ОСНОВНЫЕ ПОКАЗАТЕЛИ',inputs:'ИСХОДНЫЕ ПАРАМЕТРЫ',flows:'ДЕНЕЖНЫЕ ПОТОКИ ПО ГОДАМ',contact:'КОНТАКТ ПО ОБЪЕКТУ',year:'Год',thousands:'тыс. USD',note:'Информация носит исключительно ознакомительный характер и не является финансовой или инвестиционной рекомендацией. Все расчёты основаны на индикативных параметрах и прогнозных допущениях. Фактические результаты и доходность могут отличаться от представленных значений.'};
   const row=drawer.closest('[data-jj-unit-panel]')?.previousElementSibling;
   const unit=txt(q(row,'.jj-unit-row-title b'))||txt(q(drawer,'.jj-rinv-header h3')).replace(/^.*?[·]/,'').trim()||meta.title||'';
   const title=meta.title||txt(document.querySelector('.jj-detail-heading h1'))||'Joy²';
   const addr=meta.address||txt(document.querySelector('.jj-detail-heading p'));
   const cards=[...drawer.querySelectorAll('.jj-rinv-kpis > div')].slice(0,4).map(card=>({label:txt(q(card,'small'))||'',value:txt(q(card,'strong'))||'—'}));
   const params=[...drawer.querySelectorAll('.jj-rinv-inputs > div')].slice(0,14).map(card=>({label:txt(q(card,'dt'))||'',value:txt(q(card,'dd'))||'—'}));
   const cash=[...drawer.querySelectorAll('.jj-rinv-flow-strip > .jj-rinv-year')].slice(0,16).map(card=>({year:txt(q(card,'.jj-rinv-year-label')).replace(/^Год\s*|^Year\s*|^Yil\s*/i,''),number:txt(q(card,'strong')),units:txt(q(card,'.jj-rinv-thousands'))}));
   const phone=String(meta.contact?.phone||'').trim();
   const contactName=String(meta.contact?.name||'').trim();
   const telegram=safeTelegram(meta.contact?.telegram);
   const phoneHref=/^\+?[\d\s()\-]{7,24}$/.test(phone)?'tel:'+phone.replace(/[^\d+]/g,''):'';
   const contactValue=[contactName&&`<strong>${esc(contactName)}</strong>`,phone&&`<span>${phoneHref?`<a href="${esc(phoneHref)}">${esc(phone)}</a>`:esc(phone)}</span>`,telegram&&`<a class="tg" href="${esc(telegram)}">Telegram: @${esc(telegram.split('/').pop())}</a>`].filter(Boolean).join('');
   const logo=new URL('/joy2-logo.svg',location.origin).href;
   const kpi=cards.map((c,i)=>`<div class="kpi ${i===3?'profit':''}"><span>${esc(c.label)}</span><b>${esc(c.value)}</b></div>`).join('');
   const facts=params.map(p=>`<div class="fact"><span>${esc(p.label)}</span><strong>${esc(p.value)}</strong></div>`).join('');
   const flows=cash.map((y,i)=>`<div class="flow ${i===0?'negative':''}"><span>${esc(y.year)}</span><strong>${esc(y.number)}</strong><small>${esc(y.units||copy.thousands)}</small></div>`).join('');
   return `<!doctype html><html lang="${esc(lang)}"><head><meta charset="utf-8"><title>${esc(title)} — ${esc(copy.sub)}</title><style>
 @page{size:A4 portrait;margin:0}*{box-sizing:border-box}html,body{margin:0;padding:0;background:#fff;color:#131617;font-family:Arial,Helvetica,sans-serif;-webkit-print-color-adjust:exact;print-color-adjust:exact}body{width:210mm}.sheet{width:210mm;height:297mm;padding:13mm 14mm 12mm;display:flex;flex-direction:column;overflow:hidden;gap:0;background:#fff}.top{display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #dfe4e3;padding-bottom:5mm}.logo{width:33mm;height:14mm;object-fit:contain;object-position:left center}.top-tag{background:#b6ff00;padding:3mm 4mm;border-radius:4mm;font-size:9pt;font-weight:700}.title{margin:6mm 0 1mm;font-size:23pt;font-weight:800;line-height:1.1;letter-spacing:-.04em;overflow-wrap:anywhere}.addr{font-size:9pt;color:#566064;margin:1mm 0 3mm;line-height:1.3}.unit{font-size:10pt;font-weight:700;margin:0 0 5mm}.section{margin:0 0 4mm}.section h2{font-size:9pt;text-transform:uppercase;letter-spacing:.7px;margin:0 0 2.8mm;font-weight:800}.kpis{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:2.5mm}.kpi{background:#f3f5f4;border-radius:3mm;padding:3.4mm 3.6mm;min-height:20mm;overflow:hidden}.kpi span{font-size:8pt;color:#647076;display:block;line-height:1.15}.kpi b{font-size:15pt;letter-spacing:-.03em;display:block;line-height:1.18;margin-top:2mm;overflow-wrap:anywhere}.kpi.profit{background:#edf8e6}.kpi.profit b{color:#087d37}.facts{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:1.7mm 2.2mm}.fact{background:#f5f6f6;padding:2mm 2.7mm;border-radius:2.2mm;min-height:12mm;display:flex;flex-direction:column;justify-content:center;overflow:hidden}.fact span{font-size:7.3pt;color:#677176;line-height:1.15}.fact strong{font-size:9.3pt;line-height:1.25;margin-top:1mm;overflow-wrap:anywhere}.flows{display:grid;grid-template-columns:repeat(${Math.min(9,Math.max(1,cash.length))},minmax(0,1fr));gap:1.2mm}.flow{min-width:0;min-height:20mm;border:1px solid #d7ebdd;border-radius:2.2mm;background:#f0f8f0;text-align:center;padding:2.2mm .6mm;overflow:hidden;display:flex;flex-direction:column;justify-content:center;align-items:center;gap:1.1mm;color:#08813c}.flow.negative{border-color:#f0d7d9;background:#fff4f4;color:#c7001d}.flow span{font-size:7pt;color:#555}.flow strong{font-size:10pt;line-height:1.2;white-space:nowrap}.flow small{font-size:6.6pt}.bottom{margin-top:auto}.contact{border:1px solid #d7dddd;border-radius:3mm;padding:3.3mm 4mm;background:#fafcfb;display:flex;gap:4mm;align-items:center;justify-content:space-between}.contact-info{display:flex;gap:3mm;align-items:center;flex-wrap:wrap;font-size:10pt}.contact-info strong{font-size:11pt}.contact-info a{color:#111;text-decoration:none}.contact-info .tg{color:#229ed9;font-weight:700}.disclaimer{color:#687278;font-size:7.2pt;line-height:1.33;margin:3mm 0 0}.bottom-line{display:flex;justify-content:space-between;border-top:1px solid #dfe4e3;margin-top:3mm;padding-top:2mm;color:#8a9294;font-size:7pt}@media print{.sheet{page-break-inside:avoid;break-inside:avoid}html,body{overflow:hidden}}
 </style></head><body><article class="sheet"><div class="top"><img class="logo" src="${esc(logo)}" alt="Joy²"><span class="top-tag">${esc(copy.sub)}</span></div><h1 class="title">${esc(title)}</h1><p class="addr">${esc(addr)}</p><p class="unit">${esc(copy.premises)}: ${esc(unit)}</p><section class="section"><h2>${esc(copy.metrics)}</h2><div class="kpis">${kpi}</div></section><section class="section"><h2>${esc(copy.inputs)}</h2><div class="facts">${facts}</div></section><section class="section"><h2>${esc(copy.flows)} · ${esc(copy.thousands)}</h2><div class="flows">${flows}</div></section><div class="bottom"><section class="section"><h2>${esc(copy.contact)}</h2><div class="contact"><div class="contact-info">${contactValue||'<span>—</span>'}</div></div></section><p class="disclaimer">${esc(copy.note)}</p><div class="bottom-line"><span>Joy² · ${esc(copy.sub)}</span><span>${esc(new Date().toLocaleDateString(lang==='en'?'en-GB':lang==='uz'?'uz-UZ':'ru-RU'))}</span></div></div></article></body></html>`;
 }
 document.addEventListener('click',event=>{
   const button=event.target.closest?.('[data-jj-investment-print]');
   if(!button)return;
   event.preventDefault();event.stopImmediatePropagation();
   const drawer=button.closest('.jj-unit-finance-drawer');if(!drawer)return;
   let old=document.getElementById('joy2-investment-a4-print-frame');if(old)old.remove();
   const iframe=document.createElement('iframe');iframe.id='joy2-investment-a4-print-frame';iframe.title='Joy² PDF';iframe.setAttribute('aria-hidden','true');iframe.style.cssText='position:fixed;width:0;height:0;border:0;opacity:0;pointer-events:none;';
   document.body.append(iframe);
   const doc=iframe.contentDocument;doc.open();doc.write(render(drawer,getMeta()));doc.close();
   let printed=false;
   const go=()=>{if(printed)return;printed=true;try{iframe.contentWindow.focus();iframe.contentWindow.print()}catch(e){console.error('Joy² PDF:',e);alert('Не удалось открыть окно сохранения PDF. Разрешите печать для этого сайта.')}};
   const logo=doc.querySelector('.logo');
   if(logo&&!logo.complete){logo.addEventListener('load',go,{once:true});logo.addEventListener('error',go,{once:true})}
   else setTimeout(go,100);
   setTimeout(go,900);
   setTimeout(()=>{if(iframe.isConnected)iframe.remove()},120000);
 },true);
})();
