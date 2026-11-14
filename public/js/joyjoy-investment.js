import {calculateInvestment,investmentFields} from './joyjoy-investment-model.js';
import {investmentCopy} from './joyjoy-investment-copy.js';
for(const root of document.querySelectorAll('[data-investment]')){
 const lang=root.dataset.lang||'ru',c=investmentCopy[lang],form=root.querySelector('form'),defaults=JSON.parse(root.querySelector('[data-investment-defaults]').textContent);
 const locale=lang==='ru'?'ru-RU':lang==='uz'?'uz-UZ':'en-US';
 const amount=n=>new Intl.NumberFormat(locale,{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
 let edited=false;
 function update(){
  const data={currency:'USD'};for(const key of investmentFields){const input=form.elements.namedItem(key);data[key]=input.value.trim()===''?null:input.valueAsNumber;}
  const result=calculateInvestment(data);
  root.querySelector('[data-model-status]').textContent=result.ok?(edited?c.personal:root.dataset.published==='true'?c.published:c.personal):(edited?c.invalid:c.missing);
  for(const cell of root.querySelectorAll('[data-result]')){
   const k=cell.dataset.result;cell.textContent=!result.ok?'—':k==='paybackYears'?(result[k]===null?c.noPayback:new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(result[k])+' '+c.years):k==='yieldPercent'?new Intl.NumberFormat(locale,{maximumFractionDigits:1}).format(result[k])+'%':amount(result[k]);
  }
 }
 form.addEventListener('submit',e=>e.preventDefault());
 form.addEventListener('input',()=>{edited=true;update()});
 form.addEventListener('reset',e=>{e.preventDefault();for(const k of investmentFields)form.elements.namedItem(k).value=defaults[k]??'';edited=false;update()});
 update();
}
