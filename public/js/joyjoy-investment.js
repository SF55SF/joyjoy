import {calculateInvestment,investmentFields} from './joyjoy-investment-model.js';
import {investmentCopy} from './joyjoy-investment-copy.js';
import {loadFx,lastFx} from './joyjoy-fx.js';
for(const root of document.querySelectorAll('[data-investment]')){
 const lang=root.dataset.lang||'ru',c=investmentCopy[lang],form=root.querySelector('form'),defaults=JSON.parse(root.querySelector('[data-investment-defaults]').textContent);
 const locale=lang==='ru'?'ru-RU':lang==='uz'?'uz-UZ':'en-US';
 const amount=n=>new Intl.NumberFormat(locale,{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
 let edited=false;
 function update(){
  const data={currency:'USD',rentCurrency:form.elements.namedItem('rentCurrency').value,usdUzs:Number(form.elements.namedItem('usdUzs').value)||null,uzsDevaluation:form.elements.namedItem('uzsDevaluation').value===''?null:Number(form.elements.namedItem('uzsDevaluation').value)};for(const key of investmentFields){const input=form.elements.namedItem(key);data[key]=input.value.trim()===''?null:input.valueAsNumber;}
  const result=calculateInvestment(data);
  root.querySelector('[data-model-status]').textContent=result.ok?(edited?c.personal:root.dataset.published==='true'?c.published:c.personal):(edited?c.invalid:c.missing);
  for(const el of root.querySelectorAll('.jj-investment-kpis strong')){ /* presentation values are refreshed below */ }
  for(const cell of root.querySelectorAll('[data-result]')){
   const k=cell.dataset.result;cell.textContent=!result.ok?'—':k==='paybackYears'?(result[k]===null?c.noPayback:new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(result[k])+' '+c.years):['yieldPercent','irrPercent'].includes(k)?(result[k]===null?'—':new Intl.NumberFormat(locale,{maximumFractionDigits:2}).format(result[k])+'%'):amount(result[k]);
  }
  const kpis=root.querySelectorAll('.jj-investment-kpis strong');
  if(result.ok&&kpis.length===3){kpis[0].textContent=result.irrPercent===null?'—':result.irrPercent.toFixed(2)+'%';kpis[1].textContent=amount(result.totalInvestment);kpis[2].textContent=amount(result.salePrice);}
  const table=root.querySelector('[data-investment-schedule]');
  if(table&&result.ok){table.replaceChildren();for(const row of [{year:0,noi:null,sale:null,cashFlow:-result.totalInvestment},...result.schedule]){const tr=document.createElement('tr');for(const v of [row.year,row.noi,row.sale,row.cashFlow]){const cell=document.createElement(v===row.year?'th':'td');cell.textContent=v===row.year?String(v):v==null||v===0?'—':amount(v);tr.append(cell);}table.append(tr);}}
 }
 form.addEventListener('submit',e=>e.preventDefault());
 form.addEventListener('input',()=>{edited=true;update()});
 form.addEventListener('reset',e=>{e.preventDefault();for(const k of investmentFields)form.elements.namedItem(k).value=defaults[k]??'';form.elements.namedItem('rentCurrency').value=defaults.rentCurrency??'USD';edited=false;update()});
 const renderFx=fx=>{if(!fx)return;form.elements.namedItem('usdUzs').value=fx.usdUzs;form.elements.namedItem('uzsDevaluation').value=fx.annualDevaluation;update();};
 const cached=lastFx();if(cached)renderFx(cached);loadFx().then(renderFx);
 update();
}
