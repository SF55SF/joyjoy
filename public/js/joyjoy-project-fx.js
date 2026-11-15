import {calculateInvestment} from './joyjoy-investment-model.js';
import {loadFx,lastFx} from './joyjoy-fx.js';
const source=document.getElementById('jj-project-fx-data');if(source){
 let projects=[];try{projects=JSON.parse(source.textContent||'[]');}catch{}
 const apply=fx=>{if(!fx)return;for(const entry of projects){if(entry.investment?.rentCurrency!=='UZS')continue;const result=calculateInvestment({...entry.investment,usdUzs:fx.usdUzs,uzsDevaluation:fx.annualDevaluation});const cell=[...document.querySelectorAll('[data-project-irr]')].find(x=>x.dataset.projectIrr===entry.slug);if(cell&&result.ok)cell.textContent=result.irrPercent===null?'—':result.irrPercent.toLocaleString(document.documentElement.lang||'ru',{maximumFractionDigits:2})+'%';}};
 apply(lastFx());loadFx().then(apply);
}
