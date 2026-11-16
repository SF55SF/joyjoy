// JOYJOY_CALCULATOR_ERRORS_V1
// JOYJOY_CALCULATOR_RESET_V1
import {calculateInvestment,investmentFields} from './joyjoy-investment-model.js';
import {investmentCopy} from './joyjoy-investment-copy.js';
import {loadFx,lastFx} from './joyjoy-fx.js';
for(const root of document.querySelectorAll('[data-investment]')){
 const lang=root.dataset.lang||'ru',c=investmentCopy[lang],form=root.querySelector('form'),defaults=JSON.parse(root.querySelector('[data-investment-defaults]').textContent);
 const locale=lang==='ru'?'ru-RU':lang==='uz'?'uz-UZ':'en-US';
 const amount=n=>new Intl.NumberFormat(locale,{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
 for(const input of form.querySelectorAll('input,select')){const label=input.closest('label')?.querySelector('span');if(label&&!input.hasAttribute('aria-label')&&!input.hasAttribute('aria-labelledby'))input.setAttribute('aria-label',label.textContent);}
 let edited=!1,fxVersion=0;const words={ru:{fill:"Заполните поле",integer:"целое 1–40",fx:"UZS: нужны курс ЦБ и годовая девальвация"},en:{fill:"Enter a value",integer:"integer 1–40",fx:"UZS: CBU rate and annual depreciation required"},uz:{fill:"Qiymat kiriting",integer:"butun son 1–40",fx:"UZS: Markaziy bank kursi va yillik devalvatsiya kerak"}}[lang]||{},scope="jj-error-",message=t=>{if(t==="fx")return words.fx;const a=form.elements.namedItem(t),e=["occupancy","exitCapRate","annualRentGrowth"].includes(t)?100:1e12;return(c[t]||t)+": "+(a?.value.trim()===""?words.fill:t==="holdYears"?words.integer:(["purchasePrice","lettableArea","exitCapRate"].includes(t)?"> 0; ≤ ":"0–")+e.toLocaleString(locale))};function feedback(t){const a=[];for(const e of form.querySelectorAll("input,select")){const r=t.includes("fx")&&["usdUzs","uzsDevaluation"].includes(e.name)?"fx":e.name,n=edited&&t.includes(r)&&(e.value!==""||e.dataset.jjTouched==="1"||r==="fx"),l=scope+e.name;let i=document.getElementById(l);n&&!i&&(i=document.createElement("small"),i.id=l,i.className="jj-field-error",e.after(i)),i&&(i.hidden=!n,i.textContent=n?message(r):""),e.setAttribute("aria-invalid",n);const s=(e.getAttribute("aria-describedby")||"").split(/\s+/).filter(u=>u&&u!==l);n&&(s.push(l),a.push(r)),s.length?e.setAttribute("aria-describedby",s.join(" ")):e.removeAttribute("aria-describedby")}return[...new Set(a)]}
 function update(){
  const data={currency:'USD',rentCurrency:form.elements.namedItem('rentCurrency').value,usdUzs:Number(form.elements.namedItem('usdUzs').value)||null,uzsDevaluation:form.elements.namedItem('uzsDevaluation').value===''?null:Number(form.elements.namedItem('uzsDevaluation').value)};for(const key of investmentFields){const input=form.elements.namedItem(key);data[key]=input.value.trim()===''?null:input.valueAsNumber;}
  const computed=calculateInvestment(data),missing=investmentFields.filter(k=>form.elements.namedItem(k).value.trim()==='');
  const result=missing.length?{ok:false,errors:[...new Set([...(computed.errors||[]),...missing])]}:computed;
  const reported=feedback(result.errors||[]);
  root.querySelector('[data-model-status]').textContent=result.ok?(edited?c.personal:root.dataset.published==='true'?c.published:c.personal):reported.length?reported.map(message).join(' · '):c.missing;
  root.querySelector('.jj-investment-kicker').textContent=edited?c.personal:root.dataset.published==='true'?c.published:c.personal;
  for(const el of root.querySelectorAll('.jj-investment-kpis strong'))el.textContent='—';
  for(const cell of root.querySelectorAll('[data-result]')){
   const k=cell.dataset.result;cell.textContent=!result.ok?'—':k==='paybackYears'?(result[k]===null?c.noPayback:new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(result[k])+' '+c.years):['yieldPercent','irrPercent'].includes(k)?(result[k]===null?'—':new Intl.NumberFormat(locale,{maximumFractionDigits:2}).format(result[k])+'%'):amount(result[k]);
  }
  const kpis=root.querySelectorAll('.jj-investment-kpis strong');
  if(result.ok&&kpis.length===3){kpis[0].textContent=result.irrPercent===null?'—':result.irrPercent.toFixed(2)+'%';kpis[1].textContent=amount(result.totalInvestment);kpis[2].textContent=amount(result.salePrice);}
  const table=root.querySelector('[data-investment-schedule]');
  if(table){table.replaceChildren();if(result.ok)for(const row of [{year:0,noi:null,sale:null,cashFlow:-result.totalInvestment},...result.schedule]){const tr=document.createElement('tr');[row.year,row.noi,row.sale,row.cashFlow].forEach((v,index)=>{const cell=document.createElement(index===0?'th':'td');if(index===0)cell.scope='row';cell.textContent=index===0?String(v):v==null?'—':amount(v);tr.append(cell);});table.append(tr);}}
 }
 form.addEventListener('submit',e=>e.preventDefault());
 form.addEventListener('input',e=>{if(e.target.name)e.target.dataset.jjTouched='1';edited=true;update()});
 form.addEventListener('reset',e=>{e.preventDefault();++fxVersion;for(const k of [...investmentFields,'rentCurrency','usdUzs','uzsDevaluation'])form.elements.namedItem(k).value=defaults[k]??(k==='rentCurrency'?'USD':'');for(const input of form.querySelectorAll('[data-jj-touched]'))delete input.dataset.jjTouched;edited=false;update()});
 const fxRequest=fxVersion;
 const renderFx=fx=>{if(!fx||fxRequest!==fxVersion||defaults.usdUzs>0)return;form.elements.namedItem('usdUzs').value=fx.usdUzs;form.elements.namedItem('uzsDevaluation').value=fx.annualDevaluation;update();};
 const cached=lastFx();if(cached)renderFx(cached);loadFx().then(renderFx);
 update();
}
